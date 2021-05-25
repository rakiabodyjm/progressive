import mongoose from 'mongoose'

const countSchema = new mongoose.Schema(
  {
    visits: { default: 0, type: Number },
    inquiries: { default: 0, type: Number },
    orders: { default: 0, type: Number },
  },
  {
    _id: false,
  }
)

const Counts = mongoose.models?.Counts || mongoose.model('Counts', countSchema)

export default Counts
