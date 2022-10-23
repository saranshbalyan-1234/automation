import authReducer from "./authReducer";
import { combineReducers } from "redux";
import teamReducer from "./teamReducer";
import roleReducer from "./roleReducer";
import projectReducer from "./projectReducer";
import testCaseReducer from "./TestPlanning/testCaseReducer";
import reusableFlowReducer from "./TestPlanning/reusableFlowReducer";
export default combineReducers({
  auth: authReducer,
  team: teamReducer,
  roles: roleReducer,
  projects: projectReducer,
  testCase: testCaseReducer,
  reusableFlow: reusableFlowReducer,
});
