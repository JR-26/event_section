// ============================================
// BACKEND WITH CLOUDINARY + Google Calendar integration
// ============================================

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const Event = require("./models/Event");

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CLOUDINARY CONFIG
// ============================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("✓ Cloudinary configured");

// ============================================
// MULTER CONFIG FOR IMAGE UPLOAD
// ============================================
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase());
    if (valid) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

// Create uploads folder if needed
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// ============================================
// CLOUDINARY IMAGE SERVICE
// ============================================
class ImageService {
  async uploadImage(filePath, fileName) {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "events",
      public_id: `${Date.now()}-${path.parse(fileName).name}`,
      resource_type: "image",
      transformation: [{ width: 1200, crop: "limit" }, { quality: "auto" }],
    });
    return {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      thumbnailUrl: cloudinary.url(result.public_id, {
        transformation: [{ width: 400, height: 300, crop: "fill" }],
      }),
    };
  }

  async deleteImage(publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
}
const imageService = new ImageService();

// ============================================
// MONGODB CONNECTION
// ============================================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✓ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

// ============================================
// EXPRESS MIDDLEWARE
// ============================================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);
app.use(express.json());

// ============================================
// GOOGLE CALENDAR SETUP
// ============================================

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const TOKEN_PATH = path.join(__dirname, "token.json");

// YOUR SHARED DEPARTMENT CALENDAR ID (IMPORTANT)
const DEPT_CALENDAR_ID =
  "c_8c051af583a2abbcf59dafaa753954df357ef63678c4bcf71daf7d27c251bc92@group.calendar.google.com";

let oAuth2Client = null;

// Load credentials.json
if (fs.existsSync(CREDENTIALS_PATH)) {
  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = creds.web;

  oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    console.log("✓ Google Calendar token loaded");
  } else {
    console.log("Token not found — visit /calendar/auth to authorize");
  }
} else {
  console.log("⚠ No credentials.json found — Calendar disabled");
}

// Generate OAuth URL
app.get("/calendar/auth", (req, res) => {
  if (!oAuth2Client)
    return res.status(500).send("OAuth client missing — add credentials.json");

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  res.json({ url: authUrl });
});

// OAuth Redirect Handler
app.get("/calendar/oauth2callback", async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.query.code);

    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

    console.log("✓ Token saved");
    res.send("Google Calendar connected! You may close this window.");
  } catch (err) {
    console.error("OAuth error:", err);
    res.status(500).send("OAuth failed");
  }
});

// Calendar Event Creator
async function createCalendarEvent(payload) {
  if (!fs.existsSync(TOKEN_PATH))
    throw new Error("Not authorized — run /calendar/auth");

  oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  const eventData = {
    summary: payload.title,
    location: payload.venue,
    description: payload.description,
    start: {
      date: payload.startDate,
    },
    end: {
      date: payload.endDate,
    },
  };

  const response = await calendar.events.insert({
    calendarId: DEPT_CALENDAR_ID, // <<< IMPORTANT FIX
    resource: eventData,
  });

  return response.data;
}

// ============================================
// API ROUTES – EVENTS CRUD
// ============================================

// GET ALL EVENTS
app.get("/api/events", async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

// GET SINGLE EVENT
app.get("/api/events/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.json(event);
});

// CREATE EVENT + UPLOAD IMAGE + SYNC TO CALENDAR
app.post("/api/events", upload.single("poster"), async (req, res) => {
  let temp = null,
    publicId = null;

  try {
    const eventData = { ...req.body };

    if (req.file) {
      temp = req.file.path;
      const uploaded = await imageService.uploadImage(temp, req.file.originalname);
      eventData.poster = uploaded.imageUrl;
      eventData.thumbnailUrl = uploaded.thumbnailUrl;
      eventData.posterPublicId = uploaded.publicId;
      publicId = uploaded.publicId;
    }

    const newEvent = new Event(eventData);
    const savedEvent = await newEvent.save();

    console.log("✓ Event added:", savedEvent.eventName);

    // AUTO-SYNC TO GOOGLE CALENDAR
    if (process.env.ENABLE_CALENDAR_SYNC === "true") {
      try {
        await createCalendarEvent({
          title: savedEvent.eventName,
          venue: savedEvent.venue,
          description: savedEvent.description,
          startDate: savedEvent.startDate,
          endDate: savedEvent.endDate,
        });

        console.log("✓ Synced to Google Calendar");
      } catch (err) {
        console.error("Calendar sync failed:", err.message);
      }
    }

    res.json({ success: true, event: savedEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (temp && fs.existsSync(temp)) fs.unlinkSync(temp);
  }
});

// DELETE EVENT
app.delete("/api/events/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event.posterPublicId) {
    await imageService.deleteImage(event.posterPublicId);
  }

  await Event.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log("→ MongoDB Connected");
  console.log("→ Cloudinary Ready");
  console.log("→ Google Calendar Ready");
  console.log("  Authorize: http://localhost:5000/calendar/auth");
});
