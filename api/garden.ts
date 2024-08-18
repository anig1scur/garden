import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri || 'mongodb://localhost:27017/garden');

export default async (req: VercelRequest, res: VercelResponse) => {
  const { id } = req.query;

  try {
    await client.connect();
    const database = client.db('garden');
    const gardens = database.collection('gardens');

    if (req.method === 'GET') {
      const garden = await gardens.findOne({ id });
      if (!garden) {
        return res.status(404).json({ error: 'Garden not found' });
      }
      res.status(200).json(garden);
    } else if (req.method === 'PUT') {
      const result = await gardens.updateOne(
        { id },
        { $set: { boxes: req.body.boxes } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Garden not found' });
      }
      res.status(200).json({ message: 'Garden updated successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  } finally {
    await client.close();
  }
};