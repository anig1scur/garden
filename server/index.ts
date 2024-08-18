import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import path from 'path';
import Garden from './models/garden';

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/garden_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

app.post('/api/gardens', async (req: Request, res: Response) => {
  try {
    const id = nanoid();
    const garden = new Garden({ id, boxes: req.body.boxes });
    await garden.save();
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create garden' });
  }
});

app.get('/api/gardens/:id', async (req: Request, res: Response) => {
  try {
    const garden = await Garden.findOne({ id: req.params.id });
    if (!garden) {
      return res.status(404).json({ error: 'Garden not found' });
    }
    res.json(garden);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch garden' });
  }
});

app.put('/api/gardens/:id', async (req: Request, res: Response) => {
  try {
    const garden = await Garden.findOneAndUpdate(
      { id: req.params.id },
      { boxes: req.body.boxes },
      { new: true }
    );
    if (!garden) {
      return res.status(404).json({ error: 'Garden not found' });
    }
    res.json(garden);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update garden' });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${ port }`);
});
