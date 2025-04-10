"use server";
import nodemailer from "nodemailer";

const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

const transporter = nodemailer.createTransport({
    host: "smtp.seznam.cz",
    port: 465,
    secure: true,
    auth: {
        user: SMTP_SERVER_USERNAME,
        pass: SMTP_SERVER_PASSWORD,
    },
});

export async function sendMail({
    sendTo,
    subject,
    text,
    html,
    from,
}: {
    sendTo?: string;
    subject: string;
    text: string;
    html?: string;
    from?: string;
}) {
    try {
        await transporter.verify();
    } catch (error) {
        console.error("Something Went Wrong", SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
        return;
    }
    const info = await transporter.sendMail({
        from: from || SMTP_SERVER_USERNAME,
        to: sendTo || SITE_MAIL_RECIEVER,
        subject: subject,
        text: text,
        html: html ? html : "",
    });
    console.log("Message Sent", info.messageId);
    return info;
}
