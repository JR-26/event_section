require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Event = require('./models/Event');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']
}));
app.use(express.json());

// Routes

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

// POST: Add new event
app.post('/api/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    console.log('✓ New event added:', savedEvent.eventName);
    res.json({ success: true, event: savedEvent });
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).json({ error: 'Failed to save event', details: error.message });
  }
});

// PUT: Update event
app.put('/api/events/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    console.log('✓ Event updated:', updatedEvent.eventName);
    res.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE: Remove event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    console.log('✓ Event deleted:', deletedEvent.eventName);
    res.json({ success: true, message: 'Event deleted successfully' });
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
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`→ Serves both frontend (5173) and temp-frontend (5174)`);
  console.log(`→ MongoDB Atlas connected`);
});