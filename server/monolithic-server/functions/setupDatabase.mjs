import mongoose from 'mongoose';
import 'dotenv/config.js'

const uri = process.env.MONGODB_URL;

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export default connect;
