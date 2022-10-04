import express from "express";
import {
  getMyProject,
  allProject,
  getProjectUsers,
  getProjectById,
  addProject,
} from "../Controllers/projectController.js";
import { validatePermission } from "../Utils/Middlewares/permissions.js";
const Router = express.Router();

Router.get("/myProject", validatePermission("project", "view"), getMyProject);
Router.get("/all", validatePermission("project", "view"), allProject);
Router.get("/:id/user", validatePermission("project", "view"), getProjectUsers);
Router.get("/:id", validatePermission("project", "view"), getProjectById);
Router.post("/", validatePermission("project", "add"), addProject);
export default Router;
