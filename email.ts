import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'
import * as process from 'process'

config()
// Create SES service object.
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

const sendEmail = async (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.SES_FROM_ADDRESS as string,
    toAddresses: toAddress,
    body,
    subject
  })
  return sesClient.send(sendEmailCommand)
}

const verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/send-email.html'), 'utf8')

export const verifyEmailWithTemplate = (
  toAddress: string,
  name: string,
  token: string,
  template: string = verifyEmailTemplate
) => {
  return sendEmail(
    toAddress,
    'Verify your email',
    template
      .replace('{{name}}', name)
      .replace('{{title}}', 'Verify your email')
      .replace('{{buttonName}}', 'Verify email')
      .replace('{{link}}', `${process.env.PRODUCTION_URL}/verify-email?token=${token}`)
  )
}

export const forgotPasswordWithTemplate = (
  toAddress: string,
  name: string,
  token: string,
  template: string = verifyEmailTemplate
) => {
  return sendEmail(
    toAddress,
    'Forgot password',
    template
      .replace('{{name}}', name)
      .replace('{{title}}', 'Forgot your password')
      .replace('{{buttonName}}', 'Change password')
      .replace('{{link}}', `${process.env.PRODUCTION_URL}/verify-forgot-password?token=${token}`)
  )
}
