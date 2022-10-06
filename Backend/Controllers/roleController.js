import db from "../Utils/dataBaseConnection.js";
import getError from "../Utils/sequelizeError.js";
import { paginate, pageInfo } from "../Utils/pagination.js";
const Role = db.roles;
const UserRole = db.userRoles;
const Permission = db.permissions;
const PermissionList = db.permissionList;

const getAllRole = async (req, res) => {
  /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
  try {
    const roles = await Role.findAndCountAll(paginate({}, req.query));
    const temp = pageInfo(roles, req.query);
    return res.status(200).json(temp);
  } catch (err) {
    getError(err, res);
  }
};

const saveRole = async (req, res) => {
  /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
  await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  await Role.create(req.body, {})
    .then((resp) => {
      return res.status(200).json(resp);
    })
    .catch((e) => {
      getError(e, res);
    });
};

const updateRole = async (req, res) => {
  /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
  await Role.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(async (resp) => {
      if (resp[0]) {
        await Role.findByPk(req.params.id)
          .then((resp) => {
            return res.status(200).json(resp);
          })
          .catch((e) => {
            return res.status(500).json(e);
          });
      } else {
        return res.status(400).json({ error: "Record not found" });
      }
    })
    .catch((e) => {
      getError(e, res);
    });
};

const deleteRole = (req, res) => {
  /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
  Role.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((resp) => {
      if (resp === 1) {
        return res.status(200).json({ message: "Role deleted successfully" });
      } else {
        return res.status(400).json({ error: "Record not found" });
      }
    })
    .catch((e) => {
      getError(e, res);
    });
};
const updateRolePermission = async (req, res) => {
  /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
  try {
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.sequelize.query(`use Main`);
    const data = await PermissionList.findAll({});

    await db.sequelize.query(
      `use ${req.user.tenant.replace(/[^a-zA-Z0-9 ]/g, "")}`
    );

    const check = data.some((el) => {
      return req.body.some((el1) => {
        return el.name == el1.name;
      });
    });

    if (check) {
      await Permission.destroy({ where: { roleId: req.params.roleId } });
      await Permission.bulkCreate(req.body).then((resp) => {
        return res.status(200).json(resp);
      });
    } else {
      return res.status(400).json({ error: "Inavlid Permission" });
    }
  } catch (error) {
    getError(error, res);
  }
};
const getUserRole = async (req, res) => {
  /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
  try {
    const roles = await UserRole.findAll({
      where: { userId: req.params.userId },

      include: [
        {
          model: Role,
          attributes: ["name"],
        },
      ],
    });
    const tempRole = roles.map((el) => {
      const temp = { ...el.dataValues, name: el.dataValues.role.name };
      delete temp.role;
      return temp;
    });

    return res.status(200).json(tempRole);
  } catch (error) {
    getError(error, res);
  }
};

const updateUserRole = async (req, res) => {
  /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
  try {
    await UserRole.destroy({ where: { userId: req.params.userId } });
    await UserRole.bulkCreate(req.body).then((resp) => {
      return res.status(200).json({ message: "User role updated." });
    });
  } catch (err) {
    getError(err, res);
  }
};

export {
  saveRole,
  updateRole,
  getAllRole,
  deleteRole,
  updateRolePermission,
  updateUserRole,
  getUserRole,
};
