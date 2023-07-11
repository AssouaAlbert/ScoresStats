const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

async function mail(message, fileName = "") {
  console.log("🚀 ~ file: sendEmail.js:5 ~ mail ~ message:", message)
  dotenv.config();
  try{
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS_APP,
      },
    });
    transporter.verify(async (err, succ) => {
      if (err) {
        console.log(
          "🚀 ~ file: sendEmail.js:21 ~ transporter.verify ~ err.message:\n",
          err
        );
        return false;
      } else {
        let info = await transporter.sendMail({
          from: '"Livescore Daily ⚽" <sylvoalberto@gmail.com>', // sender address
          to: "assouaalbert@gmail.com", // list of receivers
          subject: `${message.subject} ${fileName ? " - " + fileName : ""}`, // Subject line
          text: `${message.message} `, // plain text body
          html: `<b>${message.message}</b>`, // html body
        });
        console.log("Message sent: %s", info.messageId);
      }
    });
  }
  catch(error){
  console.log("🚀 ~ file: sendEmail.js:35 ~ mail ~ error:", error.message)
  }
}
module.exports = mail
