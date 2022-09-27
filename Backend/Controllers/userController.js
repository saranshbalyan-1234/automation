const db = require("../Utils/dataBaseConnection");
const getError = require("../Utils/sequelizeError");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../Utils/Mail/nodeMailer");
const { userRegisterValidation } = require("../Utils/hapiValidation");

const User = db.users;
const Customer = db.customers;

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const database = req.user.tenant.replace(/[^a-zA-Z0-9 ]/g, "");
    await db.sequelize.query(`use Main`);
    await Customer.create({ email, tenantName: req.user.tenant }).catch((e) => {
      throw new Error("User already exist");
    });

    await db.sequelize.query(`use ${database}`);

    const { error } = userRegisterValidation.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const hash = await bcrypt.hash(password, 8);
    const user = await User.create({ name, email, password: hash });
    sendMail({ email, name, tenant: database }, "addUser");

    return res.status(200).json({ id: user.id, name, email });
  } catch (error) {
    getError(error, res);
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (req.user.tenant == user.email)
      throw new Error("Cannot Delete Customer Admin");
    const deletedUser = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deletedUser == 1) {
      await db.sequelize.query(`use Main`);
      const deletedCustomerUser = await Customer.destroy({
        where: {
          email: user.email,
        },
      });

      if (deletedCustomerUser == 1) {
        // const database = req.user.tenant.replace(/[^a-zA-Z0-9 ]/g, "");
        // await db.sequelize.query(`DROP DATABASE ${database}`);
        return res.status(200).json({ message: "User Deleted Successfully" });
      }
    } else {
      throw new Error("User Not Found");
    }
  } catch (error) {
    getError(error, res);
  }
};

module.exports = {
  addUser,
  deleteUser,
};
