import mongoose from 'mongoose';

const URLSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  siteId: { type: Number, unique: true },
  shortUrl: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
  userId: { type: String, required: true }
});

const URLModel = mongoose.model('URL', URLSchema);

export default URLModel;
