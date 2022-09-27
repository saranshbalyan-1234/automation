const express = require("express");
const Router = express.Router();
const authController = require("../Controllers/authController");

Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.get("/verify-customer/:token", authController.verifyCustomer);
Router.get("/verify-user/:token", authController.verifyUser);
Router.post("/reset-password/send-mail", authController.sendResetPasswordMail);
Router.post("/reset-password/:token", authController.resetPassword);

module.exports = Router;
