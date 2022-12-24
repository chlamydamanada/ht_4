import nodemailer from "nodemailer";

export const emailAdapter = {
  async sendEmail(fullUser: any) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "learningandtestingemail@gmail.com", //  email xwbpergboxauytuv
        pass: "xwbpergboxauytuv", //  password
      },
    });
    let code = fullUser.emailConfirmation.confirmationCode;
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Kek 👻" <learningandtestingemail@gmail.com>', // sender address
      to: fullUser.email, // list of receivers
      subject: "home task 7 ", // Subject line
      html:
        " <h1>Thank for your registration</h1>\n" +
        "       <p>To finish registration please follow the link below:\n" +
        `          <a href='https://somesite.com/confirm-email?code=${fullUser.emailConfirmation.confirmationCode}'>complete registration</a>\n` +
        "      </p>\n", // html body
    });
    console.log(code);
    if (info) {
      return true;
    }
  },
};
