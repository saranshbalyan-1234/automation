const nodemailer = require("nodemailer");
const { createToken } = require("../../Utils/jwt");
const registerHTML = require("../../Utils/Mail/HTML/register");
const resetPasswordHtml = require("../../Utils/Mail/HTML/resetPassword");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saranshbalyan1234@gmail.com",
    pass: "cwybqmfmlrskndfz",
  },
});

const sendMailApi = (req, res) => {
  transporter.sendMail(req.body, function (error, info) {
    if (error) {
      return res.status(400).json({ error: error });
    } else {
      return res.status(200).json(info);
    }
  });
};
const sendMail = async (data, type) => {
  let mailOption = {
    to: "",
    subject: "",
    text: "",
    html: "",
  };
  let token = "";
  let link = "";
  switch (type) {
    case "customerRegister":
      token = await createToken(
        { email: data.email },
        process.env.JWT_VERIFICATION_SECRET,
        process.env.JWT_VERIFICATION_EXPIRATION
      );
      link = `${process.env.WEBSITE_HOME}/auth/verify-customer/${token}`;
      mailOption = {
        to: data.email,
        subject: "Customer Registration Successfull",
        html: registerHTML(data.name, link),
      };
      break;
    case "addUser":
      token = await createToken(
        { email: data.email, tenant: data.tenant },
        process.env.JWT_VERIFICATION_SECRET,
        process.env.JWT_VERIFICATION_EXPIRATION
      );
      link = `${process.env.WEBSITE_HOME}/auth/verify-user/${token}`;
      mailOption = {
        to: data.email,
        subject: "Registration Successfull",
        html: registerHTML(data.name, link),
      };
      break;
    case "reset-password":
      token = await createToken(
        { email: data.email, tenant: data.tenant },
        process.env.JWT_RESET_SECRET,
        process.env.JWT_RESET_EXPIRATION
      );
      link = `${process.env.WEBSITE_HOME}/auth/reset-password/${token}`;
      mailOption = {
        to: data.email,
        subject: "Password Reset",
        html: resetPasswordHtml(data.name, link),
      };
      break;
  }
  transporter.sendMail(
    { ...mailOption, from: process.env.MAILER_FROM },
    function (error, info) {
      if (error) {
        console.log("Failed to send email");
      } else {
        console.log("Email Sent");
      }
    }
  );
};
module.exports = { sendMailApi, sendMail };
