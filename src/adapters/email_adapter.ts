import nodemailer from "nodemailer";

export const emailAdapter = {
  async sendEmail(fullUser: any) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL, //  email
        pass: process.env.PASS, //  password
      },
    });
    let code = fullUser.emailConfirmation.confirmationCode;
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Kek 👻" <process.env.MY_EMAIL>', // sender address
      to: fullUser.email, // list of receivers
      subject: "home task 7 ", // Subject line
      html: ` <h1>Thank for your registration</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href='https://somesite.com/confirm-email?code=${fullUser.emailConfirmation.confirmationCode}'>complete registration</a>
              </p>`, // html body
    });

    if (info) {
      return true;
    }
  },
};
