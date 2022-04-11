const nodemailer = require("nodemailer")

const mailer = async ({
    subject,
    to,
    text,
    html
}) => {
    // const testAccount = await nodemailer.createTestAccount()
    const transport = nodemailer.createTransport({
        auth: {
            user: "nitroa198@gmail.com",
            pass: "Nitro5acer."
            // user: testAccount.user,
            // pass: testAccount.pass
        },
        host: "smtp.gmail.com"
        // host: "smtp.ethereal.email"
    })

    await transport.sendMail({
        subject: subject || "Test subject",
        to: to || "monpai732@gmail.com",
        text: text || "Test nodemailer",
        html: html || "<h1>This is sent from my express API</h1>"
    })
}

module.exports= mailer