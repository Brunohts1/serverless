import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporterOptions: SMTPTransport.Options = {
  host: process.env.SMTP_SERVER,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_FROM_PASSWORD,
  }
};
const transporter = nodemailer.createTransport(transporterOptions);

export const send = async (
  event: any
): Promise<any> => {
  const emailPromises: Promise<SentMessageInfo>[] = [];
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    
    const adminEmail: MailOptions = {
      from: `"Reservas 👻" ${process.env.EMAIL_FROM}`,
      to: process.env.EMAIL_TO, 
      subject: "Reserva Efetuada",
      text: body.Message,
      html: body.Message,
    }

    const costumer = body.Message.match(/\(([^)]+)\)/);
    const costumerEmail: MailOptions = {
      from: `"Reservas 👻" ${process.env.EMAIL_FROM}`,
      to: costumer, 
      subject: "Reserva Efetuada",
      text: body.Message,
      html: body.Message,
    }
    emailPromises.push(transporter.sendMail(costumerEmail))
    emailPromises.push(transporter.sendMail(adminEmail));
  };
  await Promise.all(emailPromises);
  console.log("Success sending emails!");

 return { message: "email-notification handler working" }
}
