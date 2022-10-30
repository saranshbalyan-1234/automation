import db from "../../Utils/dataBaseConnection.js";
import getError from "../../Utils/sequelizeError.js";
import { projectByIdValidation } from "../../Utils/Validations/project.js";
import {
  saveTestCaseValidation,
  updateTestCaseValidation,
  testCaseIdValidation,
} from "../../Utils/Validations/testCase.js";
import { Op } from "sequelize";
const TestCase = db.testCases;
const User = db.users;
const Process = db.process;
const Object = db.objects;
const TestParameter = db.testParameters;
const TestStep = db.testSteps;
const saveTestCase = async (req, res) => {
  /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    const { error } = saveTestCaseValidation.validate(req.body);
    if (error) throw new Error(error.details[0].message);
    const payload = { ...req.body };
    payload.createdByUser = req.user.id;
    const data = await TestCase.schema(req.database).create(payload);
    return res
      .status(200)
      .json({ ...data.dataValues, message: "TestCase created successfully!" });
  } catch (err) {
    getError(err, res);
  }
};

const updateTestCase = async (req, res) => {
  /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    const name = req.body.name;
    const testCaseId = req.params.testCaseId;
    const { error } = updateTestCaseValidation.validate({ name, testCaseId });
    if (error) throw new Error(error.details[0].message);

    const updatedTestCase = await TestCase.schema(req.database).update(
      { name },
      {
        where: {
          id: testCaseId,
        },
      }
    );

    if (updatedTestCase[0]) {
      return res
        .status(200)
        .json({ message: "TestCase updated successfully!" });
    } else {
      return res.status(400).json({ error: "Record not found" });
    }
  } catch (err) {
    getError(err, res);
  }
};

const getAllTestCase = async (req, res) => {
  /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    const projectId = req.headers["x-project-id"];
    const { error } = projectByIdValidation.validate({ projectId });
    if (error) throw new Error(error.details[0].message);

    const testCases = await TestCase.schema(req.database).findAll({
      where: {
        projectId,
      },
      attributes: ["id", "name", "updatedAt"],
      include: [
        {
          model: User.schema(req.database),
          as: "createdBy",
          attributes: ["id", "name", "email", "active"],
        },
      ],
    });

    return res.status(200).json(testCases);
  } catch (err) {
    getError(err, res);
  }
};

const deleteTestCase = async (req, res) => {
  /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    const testCaseId = req.params.testCaseId;
    const { error } = testCaseIdValidation.validate({ testCaseId });
    if (error) throw new Error(error.details[0].message);

    const deletedTestCase = await TestCase.schema(req.database).destroy({
      where: { id: testCaseId },
    });

    if (deletedTestCase > 0) {
      return res.status(200).json({ message: "TestCase deleted successfully" });
    } else {
      return res.status(400).json({ error: "Record not found" });
    }
  } catch (err) {
    getError(err, res);
  }
};
const getTestCaseDetailsById = async (req, res) => {
  /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    const testCaseId = req.params.testCaseId;
    // const { error } = projectByIdValidation.validate({ projectId });
    // if (error) throw new Error(error.details[0].message);

    const testCase = await TestCase.schema(req.database).findOne({
      where: {
        id: testCaseId,
      },
      attributes: ["id", "name", "createdAt", "updatedAt", "description"],
      include: [
        {
          model: User.schema(req.database),
          as: "createdBy",
          attributes: ["id", "name", "email", "active"],
        },
      ],
    });

    return res.status(200).json(testCase);
  } catch (err) {
    getError(err, res);
  }
};

const getTestStepByTestCase = async (req, res) => {
  /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    // const { error } = nameValidation.validate(req.body);
    // if (error) throw new Error(error.details[0].message);

    const testCaseId = req.params.testCaseId;
    const data = await Process.schema(req.database).findAll({
      where: { testCaseId },
      include: [
        {
          model: TestStep.schema(req.database),
          // separate: true,
          // order: [["step", "ASC"]],
          include: [
            {
              model: Object.schema(req.database),
              model: TestParameter.schema(req.database),
            },
          ],
        },
      ],
      order: [
        ["step", "ASC"],
        [TestStep, "step", "ASC"],
      ],
    });

    return res.status(200).json(data);
  } catch (err) {
    getError(err, res);
  }
};

const saveProcess = async (req, res) => {
  /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    // const { error } = nameValidation.validate(req.body);
    // if (error) throw new Error(error.details[0].message);

    const { testCaseId, step } = req.body;

    await Process.schema(req.database).increment("step", {
      by: 1,
      where: {
        testCaseId: { [Op.eq]: testCaseId },
        step: {
          [Op.gte]: step,
        },
      },
    });

    const data = await Process.schema(req.database).create(req.body);

    return res.status(200).json(data);
  } catch (err) {
    getError(err, res);
  }
};

const updateProcess = async (req, res) => {
  /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    const processId = req.params.processId;
    // const { error } = updateTestCaseValidation.validate({ name, testCaseId });
    // if (error) throw new Error(error.details[0].message);

    const updatedProcess = await Process.schema(req.database).update(req.body, {
      where: {
        id: processId,
      },
    });

    if (updatedProcess[0]) {
      return res.status(200).json({ message: "Process updated successfully!" });
    } else {
      return res.status(400).json({ error: "Record not found" });
    }
  } catch (err) {
    console.log(err);
    getError(err, res);
  }
};

const deleteProcess = async (req, res) => {
  /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    const processId = req.params.processId;
    // const { error } = testCaseIdValidation.validate({ testCaseId });
    // if (error) throw new Error(error.details[0].message);
    const deletingProcess = await Process.schema(req.database).findByPk(
      processId
    );

    const deletedProcess = await Process.schema(req.database).destroy({
      where: { id: processId },
    });

    if (deletedProcess > 0) {
      await Process.schema(req.database).decrement("step", {
        by: 1,
        where: {
          testCaseId: { [Op.eq]: deletingProcess.testCaseId },
          step: {
            [Op.gt]: deletingProcess.step,
          },
        },
      });

      return res.status(200).json({ message: "Process deleted successfully" });
    } else {
      return res.status(400).json({ error: "Record not found" });
    }
  } catch (err) {
    getError(err, res);
  }
};

export {
  saveTestCase,
  updateTestCase,
  getAllTestCase,
  deleteTestCase,
  getTestCaseDetailsById,
  getTestStepByTestCase,
  saveProcess,
  updateProcess,
  deleteProcess,
};
