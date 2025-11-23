const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Allow both frontends to connect
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'] // Vite default ports
}));
app.use(express.json());

// Serve the events.json file dynamically
const EVENTS_FILE = path.join(__dirname, 'events.json');

// GET: Fetch all events (used by frontend/EventsPage.jsx)
app.get('/api/events', (req, res) => {
  fs.readFile(EVENTS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json([]);
    }
    res.json(data ? JSON.parse(data) : []);
  });
});

// POST: Add new event from temp-frontend/EventsAdminPage.jsx
app.post('/api/events', (req, res) => {
  const newEvent = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };

  fs.readFile(EVENTS_FILE, 'utf8', (err, data) => {
    const events = data ? JSON.parse(data) : [];
    events.push(newEvent);

    fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save event' });
      }
      console.log('New event added:', newEvent.eventName);
      res.json({ success: true, event: newEvent });
    });
  });
});

// Optional: DELETE or UPDATE later if needed
// app.delete('/api/events/:id', ...)
// app.put('/api/events/:id', ...)

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`→ Serves both frontend (5173) and temp-frontend (5174)`);
  console.log(`→ Admin page saves here → events appear instantly in main site`);
});