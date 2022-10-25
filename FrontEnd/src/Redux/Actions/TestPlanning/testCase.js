import axios from "axios";
import {
  TEST_CASE_REQUEST,
  TEST_CASE_FAILURE,
  GET_ALL_TEST_CASE,
  CREATE_TEST_CASE,
  UPDATE_CURRENT_TEST_CASE,
  DELETE_TEST_CASE,
  GET_TEST_CASE_DETAILS_BY_ID,
  GET_TEST_CASE_STEPS_BY_ID,
  ADD_PROCESS,
  EDIT_PROCESS,
  DELETE_PROCESS,
  ADD_STEP,
  EDIT_STEP,
  DELETE_STEP,
} from "../action-types";

export const getTestCaseByProject = (payload) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: TEST_CASE_REQUEST });
      let currentProjectId = getState().projects.currentProject.id;
      const { data } = await axios.get(`/testcase/project/${currentProjectId}`);
      dispatch({ type: GET_ALL_TEST_CASE, payload: data });
      return true;
    } catch (err) {
      dispatch({ type: TEST_CASE_FAILURE });
      return false;
    }
  };
};

export const saveTestCase = (payload) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: TEST_CASE_REQUEST });
      const { data } = await axios.post(`/testcase`, payload);
      const updatedTestCase = {
        ...data,
        createdBy: getState().auth.user,
      };
      dispatch({ type: CREATE_TEST_CASE, payload: updatedTestCase });
      return true;
    } catch (err) {
      console.log(err);
      dispatch({ type: TEST_CASE_FAILURE });
      return false;
    }
  };
};

export const editTestCase = (payload) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: TEST_CASE_REQUEST });

      let currentTestCaseId = getState().testCase.currentTestCase?.id;
      let editedTestCase = { ...payload };

      await axios.put(`/testcase/${currentTestCaseId}`, payload);
      dispatch({
        type: UPDATE_CURRENT_TEST_CASE,
        payload: editedTestCase,
      });

      return true;
    } catch (err) {
      console.log(err);
      dispatch({ type: TEST_CASE_FAILURE });
      return false;
    }
  };
};

export const deleteTestCase = (testCaseId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: TEST_CASE_REQUEST });

      await axios.delete(`testCase/${testCaseId}`);
      dispatch({ type: DELETE_TEST_CASE, payload: testCaseId });
      return true;
    } catch (err) {
      dispatch({ type: TEST_CASE_FAILURE });
      return false;
    }
  };
};
export const getTestCaseDetailsById = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: TEST_CASE_REQUEST });
      const { data } = await axios.get(`/testcase/${id}/details`);
      dispatch({ type: GET_TEST_CASE_DETAILS_BY_ID, payload: data });
      return true;
    } catch (err) {
      dispatch({ type: TEST_CASE_FAILURE });
      return false;
    }
  };
};

export const getTestCaseStepsById = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: TEST_CASE_REQUEST });
      const { data } = await axios.get(`/testcase/${id}/testSteps`);
      dispatch({ type: GET_TEST_CASE_STEPS_BY_ID, payload: data });
      return true;
    } catch (err) {
      dispatch({ type: TEST_CASE_FAILURE });
      return false;
    }
  };
};

//Process
export const addProcess = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({ type: TEST_CASE_REQUEST });
      const { data } = await axios.post(`/testProcess`, payload);
      dispatch({ type: ADD_PROCESS, payload: data });
      return true;
    } catch (err) {
      dispatch({ type: TEST_CASE_FAILURE });
      return false;
    }
  };
};

export const editProcess = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({ type: TEST_CASE_REQUEST });

      await axios.put(`/testProcess/${payload.processId}`, payload.data);
      dispatch({
        type: EDIT_PROCESS,
        payload,
      });

      return true;
    } catch (err) {
      console.log(err);
      dispatch({ type: TEST_CASE_FAILURE });
      return false;
    }
  };
};

export const deleteProcess = (testProcessId, step) => {
  return async (dispatch) => {
    try {
      dispatch({ type: TEST_CASE_REQUEST });

      await axios.delete(`/testProcess/${testProcessId}`);
      dispatch({
        type: DELETE_PROCESS,
        payload: { testProcessId, step },
      });

      return true;
    } catch (err) {
      console.log(err);
      dispatch({ type: TEST_CASE_FAILURE });
      return false;
    }
  };
};

//Step
export const addStep = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({ type: TEST_CASE_REQUEST });
      const { data } = await axios.post(`/testStep`, payload);
      dispatch({ type: ADD_STEP, payload: data });
      return true;
    } catch (err) {
      dispatch({ type: TEST_CASE_FAILURE });
      return false;
    }
  };
};

export const editStep = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({ type: TEST_CASE_REQUEST });
      await axios.put(`/testStep/${payload.stepId}`, payload.data);
      dispatch({ type: EDIT_STEP, payload });
      return true;
    } catch (err) {
      dispatch({ type: TEST_CASE_FAILURE });
      return false;
    }
  };
};

export const deleteStep = (testStepId, step, testProcessId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: TEST_CASE_REQUEST });

      await axios.delete(`/testStep/${testStepId}`);
      dispatch({
        type: DELETE_STEP,
        payload: { testStepId, testProcessId, step },
      });

      return true;
    } catch (err) {
      console.log(err);
      dispatch({ type: TEST_CASE_FAILURE });
      return false;
    }
  };
};