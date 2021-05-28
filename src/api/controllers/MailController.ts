// const nodemailer = require('nodemailer')
import nodemailer from 'nodemailer'
import ReactDOM from 'react-dom/server'
import { html } from '@src/api/views/SampleEmail'
// import { html }from "@src/api/views/SampleMaterialUiEmail"
import fs from 'fs'
import prettier from 'prettier'
import { generateHTML } from '@src/api/views/SampleMaterialUiEmail'

const MailHandler = ({
  host,
  port,
  secure,
  auth,
}: {
  host: string
  port: number
  auth: {
    user: string
    pass: string
  }
  secure?: boolean
}) => {
  const transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    // auth: {
    //   user: 'rakiabodyjm@gmail.com',
    //   pass: 'jotrlfelacwmyxao',
    // },
    host,
    port,
    secure,
    auth,
  })

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
  email: string
  // eslint-disable-next-line camelcase
  contact_number: string
  message: string
}) => {
  try {
    const mail = MailHandler({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '9edf534b5a47d1',
        pass: '71daf23bccf360',
      },
    })
    await mail.sendMail({
      from: 'REALM1000-DITO AUTOMATED CONTACT <rakiabodyjm@gmail.com>',
      to: 'testreceiver@gmail.com',
      subject: `Inquiry from ${recipient.name}`,

      text: `HELLO MAILTRAP \n ${JSON.stringify(recipient)}`,
      html: `
      ${ReactToHTML({
        ...recipient,
      })}
      `,
    })
  } catch (err) {
    console.log(err)
  }
}

export default sendMail
