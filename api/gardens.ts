import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import { nanoid } from 'nanoid';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri || 'mongodb://localhost:27017/garden');

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'POST') {
    try {
      await client.connect();
      const database = client.db('garden');
      const gardens = database.collection('gardens');

      const id = nanoid();
      const result = await gardens.insertOne({ id, boxes: req.body.boxes });

      res.status(200).json({ id });
    } catch (error) {
      console.error('Failed to create garden:', error);
      res.status(500).json({ error: 'Failed to create garden' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${ req.method } Not Allowed`);
  }
};