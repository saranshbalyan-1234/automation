const express = require("express");
const Router = express.Router();
const mailer = require("../Utils/Mail/nodeMailer");

Router.post("/sendMail", mailer.sendMailApi);
module.exports = Router;
