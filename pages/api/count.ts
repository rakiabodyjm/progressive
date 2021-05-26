import connectDB, { connectionWrapper } from '@src/api/dbConnect'
import Counts from '@src/api/models/Counts'
import { NextApiRequest, NextApiResponse } from 'next'

const countHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB()
  } catch (err) {
    console.log(err)
    res.status(500).send({
      error: 'not connected',
    })
  }
}

const postCount = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { body } = req
    const { visits, inquiries, orders } = body
    const expectParams = ['visits', 'inquiries', 'orders']
    if (!visits && !inquiries && !orders) {
      return res.status(400).send({
        error: 'Missing one of the required parameters',
      })
    }
    await connectDB()
    const counts = await Counts.findOneAndUpdate(
      {},
      {
        ...body,
      },
      { upsert: true }
    )
    // const counts = await Counts.findOneAndUpdate({
    //   ...req.body,
    // })

    return res.status(200).send({
      counts,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      error: err,
    })
  }
}

export default postCount
