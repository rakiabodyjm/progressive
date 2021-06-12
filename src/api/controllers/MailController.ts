// const nodemailer = require('nodemailer')
import nodemailer from 'nodemailer'
// import { html }from "@src/api/views/SampleMaterialUiEmail"
import { generateHTML } from '@src/api/views/SampleMaterialUiEmail'
import realm1000 from '@src/api/assets/realm1000-service-account.json'

const developmentDetails = {}
const productionDetails = {}

const MailHandler = async ({
  host,
  port,
  secure,
  auth,
}: {
  host: string
  port: number
  auth:
    | {
        user: string
        pass: string
      }
    | {
        type: 'OAuth2'
        user: string
        serviceClient: string
        privateKey: string
      }
  secure?: boolean
}) => {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
  })

  await transporter.verify()

  const sendMail = async ({
    from,
    to,
    subject,
    text,
    html,
  }: {
    from: string
    to: string
    subject: string
    text: string
    html?: string
  }) =>
    transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    })

  return {
    sendMail,
  }
}

const ReactToHTML = (params) =>
  // const htmlWithDoc = `<!DOCTYPE html>${html}`
  // const prettyHtml = prettier.format(htmlWithDoc, { parser: 'html' })
  // const outputFile = './ContactOutput.html'
  // fs.writeFileSync(outputFile, prettyHtml)
  // return prettyHtml

  // const prettyhtml = prettier.format(generateHTML(), { parser: 'html' })
  // const output = './ContactOutput.html'
  // fs.writeFileSync(output, prettyhtml)

  generateHTML({ ...params })

const sendMail = async (recipient: {
  name: string
  email: string | string[]
  // eslint-disable-next-line camelcase
  contact_number: string
  message: string
}) => {
  try {
    /**
     * Test with mailtrap
     */
    const mail = await MailHandler({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '9edf534b5a47d1',
        pass: '71daf23bccf360',
      },
    })

    /**
     *
     * Production
     */

    // const mail = await MailHandler({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     type: 'OAuth2',
    //     serviceClient: realm1000.client_id,
    //     // user: realm1000.client_email,
    //     user: 'support@realm1000.com',
    //     privateKey: realm1000.private_key,
    //   },
    // })

    await mail.sendMail({
      from: 'REALM1000-DITO AUTOMATED CONTACT <support@realm1000.com>',
      to: 'rakiabodyjm@gmail.com',
      subject: `Inquiry from ${recipient.name}`,

      text: `${recipient.name}  \n Details: ${JSON.stringify(recipient)}`,
      html: `
      ${ReactToHTML({
        ...recipient,
      })}
      `,
    })
  } catch (err) {
    console.log(err)
    throw err
    // throw new Error(err)
  }
}

export default sendMail
