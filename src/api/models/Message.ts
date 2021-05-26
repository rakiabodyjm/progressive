import mongoose from 'mongoose'

const countSchema = new mongoose.Schema({
  name: { required: true, type: String },
  contact_number: { required: true, type: String },
  email: { required: true, type: String },
  message: { required: true, type: String },
})

const Messages = mongoose.models?.Messages || mongoose.model('Messages', countSchema)

export default Messages
