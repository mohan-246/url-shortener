import mongoose from 'mongoose';

const uri = 'mongodb://mongos:27017/url_shortener';

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export default connect;
