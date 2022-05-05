import nodemailer from 'nodemailer'
import { IMailAdapter, ISendMailData } from '../mail-adapter'

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '81ae37fab463bf',
    pass: '1a43263b0a500d',
  },
})

export class NodemailerMailAdapter implements IMailAdapter {
  async sendMail({ subject, body }: ISendMailData) {
    await transport.sendMail({
      from: 'Equipe Feedget <oi@feedget.com>',
      to: 'Gilmar Alves Filho <gilmarfilho75@gmail.com>',
      subject,
      html: body,
    })
  }
}
