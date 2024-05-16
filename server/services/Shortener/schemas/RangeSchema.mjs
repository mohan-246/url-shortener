import mongoose from 'mongoose';

const RangeSchema = new mongoose.Schema({
  Name: { type: String, required: true, unique: true},
  currentRange: { type: Number, required: true }
});

const RangeModel = mongoose.model('Range', RangeSchema);

export default RangeModel;
