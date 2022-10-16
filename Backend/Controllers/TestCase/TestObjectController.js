import db from "../../Utils/dataBaseConnection.js";
import getError from "../../Utils/sequelizeError.js";

const TestObject = db.testObjects;

const saveTestObject = async (req, res) => {
  /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    // const { error } = nameValidation.validate(req.body);
    // if (error) throw new Error(error.details[0].message);

    const data = await TestObject.schema(req.database).create(req.body);
    return res.status(200).json(data);
  } catch (err) {
    getError(err, res);
  }
};

const updateTestObject = async (req, res) => {
  /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    const testObjectId = req.params.testObjectId;
    // const { error } = updateTestCaseValidation.validate({ name, testCaseId });
    // if (error) throw new Error(error.details[0].message);

    const updatedTestObject = await TestObject.schema(req.database).update(
      req.body,
      {
        where: {
          id: testObjectId,
        },
      }
    );

    if (updatedTestObject[0]) {
      return res
        .status(200)
        .json({ message: "TestObject updated successfully!" });
    } else {
      return res.status(400).json({ error: "Record not found" });
    }
  } catch (err) {
    getError(err, res);
  }
};

const deleteTestObject = async (req, res) => {
  /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    const testObjectId = req.params.testObjectId;
    // const { error } = testCaseIdValidation.validate({ testCaseId });
    // if (error) throw new Error(error.details[0].message);

    const deletedTestObject = await TestObject.schema(req.database).destroy({
      where: { id: testObjectId },
    });

    if (deletedTestObject > 0) {
      return res
        .status(200)
        .json({ message: "TestObject deleted successfully" });
    } else {
      return res.status(400).json({ error: "Record not found" });
    }
  } catch (err) {
    getError(err, res);
  }
};

export { saveTestObject, updateTestObject, deleteTestObject };