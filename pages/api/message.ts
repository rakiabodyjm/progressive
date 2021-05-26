import connectDB from '@src/api/dbConnect'
import Messages from '@src/api/models/Message'
import { NextApiRequest, NextApiResponse } from 'next'

const messageHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB()

    if (req.method === 'POST') {
      createMessage(req, res)
    } else {
      res.setHeader('Content-Type', 'text/html')
      res
        .status(404)
        .send(
          '<h3 style="font-family:Raleway, sans-serif; margin: auto; text-align:center;">Error 404</h3>'
        )
    }
  } catch (err) {
    res.status(400).send({
      error: err.message,
    })
  }
}

const createMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const regex = /^(message|name|phone|email)$/

    console.log(req.body)
    /**
     * check if keys are correct
     */
    const keysError = Object.keys(req.body).every((ea) => regex.test(ea))

    /**
     * check if values are more than 5 characters
     */
    const valuesError = Object.keys(req.body).every((ea) => ea.length < 5)
    console.log(valuesError, keysError)

    if (!!keysError && !!valuesError) {
      res.status(400).send({
        error: 'Wrong body keys',
      })
      return
    }
    const message = new Messages({ ...req.body })
    await message.save()
    res.status(200).send({
      ...message,
    })
  } catch (err) {
    console.error(err)
    res.status(400).send({
      error: err.message,
    })
  }
}

export default messageHandler
