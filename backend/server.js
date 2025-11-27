// ============================================
// BACKEND WITH CLOUDINARY (MUCH SIMPLER!)
// ============================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const Event = require('./models/Event');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CLOUDINARY CONFIGURATION
// ============================================
// Sign up at: https://cloudinary.com (FREE tier: 25GB storage, 25GB bandwidth/month)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('✓ Cloudinary configured');

// ============================================
// MULTER CONFIGURATION
// ============================================
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// ============================================
// IMAGE SERVICE (Cloudinary)
// ============================================
class ImageService {
  async uploadImage(filePath, fileName) {
    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'events', // Organize in a folder
        public_id: `${Date.now()}-${path.parse(fileName).name}`,
        resource_type: 'image',
        transformation: [
          { width: 1200, crop: 'limit' }, // Limit max width
          { quality: 'auto' } // Auto optimize quality
        ]
      });

      console.log('✓ Image uploaded to Cloudinary:', result.public_id);

      return {
        imageUrl: result.secure_url, // HTTPS URL
        publicId: result.public_id, // For deletion
        thumbnailUrl: cloudinary.url(result.public_id, {
          transformation: [{ width: 400, height: 300, crop: 'fill' }]
        })
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }

  async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log('✓ Image deleted from Cloudinary:', publicId);
      return true;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  }
}

const imageService = new ImageService();

// ============================================
// MONGODB CONNECTION
// ============================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// ============================================
// ROUTES
// ============================================

// GET: Fetch all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET: Fetch single event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST: Add new event WITH IMAGE UPLOAD
app.post('/api/events', upload.single('poster'), async (req, res) => {
  let uploadedPublicId = null;
  let tempFilePath = null;

  try {
    const eventData = { ...req.body };

    // Handle image upload if file exists
    if (req.file) {
      tempFilePath = req.file.path;
      
      // Upload to Cloudinary
      const uploadResult = await imageService.uploadImage(tempFilePath, req.file.originalname);
      
      // Store URL and publicId in database
      eventData.poster = uploadResult.imageUrl;
      eventData.posterPublicId = uploadResult.publicId;
      eventData.thumbnailUrl = uploadResult.thumbnailUrl;
      
      uploadedPublicId = uploadResult.publicId;
    }

    // Save event to MongoDB
    const newEvent = new Event(eventData);
    const savedEvent = await newEvent.save();
    
    console.log('✓ New event added:', savedEvent.eventName);
    
    res.json({ 
      success: true, 
      event: savedEvent,
      imageUrl: eventData.poster || null
    });

  } catch (error) {
    console.error('Error saving event:', error);
    
    // Cleanup: Delete uploaded image if event save failed
    if (uploadedPublicId) {
      try {
        await imageService.deleteImage(uploadedPublicId);
        console.log('✓ Cleaned up uploaded image after error');
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to save event', 
      details: error.message 
    });
  } finally {
    // Delete temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
});

// PUT: Update event WITH IMAGE UPLOAD
app.put('/api/events/:id', upload.single('poster'), async (req, res) => {
  let newPublicId = null;
  let tempFilePath = null;

  try {
    const eventData = { ...req.body };
    const existingEvent = await Event.findById(req.params.id);
    
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Handle new image upload
    if (req.file) {
      tempFilePath = req.file.path;
      
      // Upload new image
      const uploadResult = await imageService.uploadImage(tempFilePath, req.file.originalname);
      eventData.poster = uploadResult.imageUrl;
      eventData.posterPublicId = uploadResult.publicId;
      eventData.thumbnailUrl = uploadResult.thumbnailUrl;
      newPublicId = uploadResult.publicId;
      
      // Delete old image if exists
      if (existingEvent.posterPublicId) {
        try {
          await imageService.deleteImage(existingEvent.posterPublicId);
          console.log('✓ Old image deleted from Cloudinary');
        } catch (error) {
          console.warn('⚠️  Could not delete old image:', error.message);
        }
      }
    }

    // Update event in MongoDB
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      eventData,
      { new: true, runValidators: true }
    );

    console.log('✓ Event updated:', updatedEvent.eventName);
    
    res.json({ 
      success: true, 
      event: updatedEvent,
      imageUrl: eventData.poster || existingEvent.poster
    });

  } catch (error) {
    console.error('Error updating event:', error);
    
    // Cleanup new image if update failed
    if (newPublicId) {
      try {
        await imageService.deleteImage(newPublicId);
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    }
    
    res.status(500).json({ error: 'Failed to update event' });
  } finally {
    // Delete temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
});

// DELETE: Remove event AND its image
app.delete('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Delete image from Cloudinary if exists
    if (event.posterPublicId) {
      try {
        await imageService.deleteImage(event.posterPublicId);
        console.log('✓ Image deleted from Cloudinary');
      } catch (error) {
        console.warn('⚠️  Could not delete image:', error.message);
      }
    }

    // Delete event from MongoDB
    await Event.findByIdAndDelete(req.params.id);
    
    console.log('✓ Event deleted:', event.eventName);
    
    res.json({ 
      success: true, 
      message: 'Event and associated image deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not configured'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size is too large. Max 10MB allowed.' });
    }
  }
  res.status(500).json({ error: error.message });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`→ Serves both frontend (5173) and temp-frontend (5174)`);
  console.log(`→ MongoDB Atlas: connected`);
  console.log(`→ Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? '✓ Ready' : '✗ Not configured'}`);
});