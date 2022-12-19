import authReducer from "./authReducer";
import { combineReducers } from "redux";
import teamReducer from "./teamReducer";
import roleReducer from "./roleReducer";
import projectReducer from "./projectReducer";
import testCaseReducer from "./testCaseReducer";
import reusableProcessReducer from "./reusableProcessReducer";
import objectBankReducer from "./objectBankReducer";
import executionHistoryReducer from "./executionHistory";
import environmentReducer from "./environment";
export default combineReducers({
  auth: authReducer,
  team: teamReducer,
  roles: roleReducer,
  projects: projectReducer,
  testCase: testCaseReducer,
  reusableProcess: reusableProcessReducer,
  objectBank: objectBankReducer,
  executionHistory: executionHistoryReducer,
  environment: environmentReducer,
});
