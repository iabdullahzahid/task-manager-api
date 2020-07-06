const nodemailer= require('nodemailer')

const main= async()=>{

    const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });




const sendWelcomeEmail = await transporter.sendMail({
    
from: 'coolabdullahzahid@gmail.com', // sender address

to: "coolabdullahzahid@gmail.com", // list of receivers
subject: "Welcome to aBd Limited ✔", // Subject line
text: "Greeting from aBd Limited CEO: Mian Abdullah Zahid" // plain text body
//html: "<b>Hello world?</b>", // html body
})


console.log("Message sent: %s", sendWelcomeEmail.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(sendWelcomeEmail));


}

