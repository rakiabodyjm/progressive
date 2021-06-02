import mongoose from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'

const MONGO_URI =
  process.env.NODE_ENV === 'development'
    ? process.env.DEVELOPMENT_MONGO_URI
    : process.env.PRODUCTION_MONGO_URI

let timeout = null
const connectDB = async () => {
  try {
    await mongoose
      .connect(MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => {
        clearInterval(timeout)
      })
  } catch (err) {
    console.log(err)

    timeout = setInterval(async () => {
      connectDB()
    }, 5000)
  }
}

const disconnectDB = async () => {
  mongoose.connection.close()
}

export default connectDB

const connectionWrapper =
  (req: NextApiRequest, res: NextApiResponse) =>
  async (apiFunction: (req: NextApiRequest, res: NextApiResponse) => void) => {
    await connectDB()
    return apiFunction(req, res)
  }

mongoose.connection.on('connect', () => {
  console.log('connection detected, terminating in 10000ms')
  const timeout = setTimeout(() => {
    mongoose.connection.close()
    clearTimeout(timeout)
  }, 10000)
})

export { connectDB, disconnectDB, connectionWrapper }
