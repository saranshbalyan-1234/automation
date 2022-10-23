import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Button, Spin, Select } from "antd";
import { connect } from "react-redux";
import { addProcess } from "../../../../../Redux/Actions/TestPlanning/testCase";
import {
  addStep,
  editStep,
} from "../../../../../Redux/Actions/TestPlanning/testCase";
import axios from "axios";
const Option = { Select };
const AddEditStepModal = ({
  visible,
  setVisible,
  editData,
  editStep,
  setEditData,
  loading,
  edit = false,
  step,
  addStep,
  processId,
  setEdit = () => {},
}) => {
  const [actionEvent, setActionEvent] = useState([]);
  useEffect(() => {
    axios.get("/global/actionEvent").then((res) => {
      setActionEvent(res.data);
    });
  }, []);

  const onSubmit = async (data) => {
    let result = false;
    if (edit) {
      result = await editStep({ data: data, stepId: editData.id });
      setEditData({});
    } else {
      result = await addStep({
        ...data,
        testProcessId: processId,
        step,
      });
    }
    if (step === 1 && edit === false) setEdit(true);
    result && setVisible(false);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Modal
        title={edit ? "Edit Step" : "Create New Step"}
        visible={visible}
        footer={false}
        onCancel={() => {
          setVisible(false);
        }}
        closable={false}
      >
        <Spin spinning={loading}>
          <Form
            name="testStep"
            onFinish={onSubmit}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              name: edit ? editData.name : "",
              comment: edit ? editData.comment : "",
              actionEvent: edit ? editData.actionEvent : "Launch Website",
            }}
          >
            <Form.Item
              name="actionEvent"
              label="Action Event"
              rules={[
                {
                  required: true,
                  message: "Please input Name!",
                },
              ]}
            >
              <Select style={{ minWidth: "160px" }}>
                {actionEvent.map((el, i) => {
                  return (
                    <Option value={el.name} key={i}>
                      {el.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="comment" label="Comment">
              <Input name="comment" showCount maxLength={50} />
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="primary"
                className="login-form-button"
                style={{ marginRight: "20px" }}
                htmlType="submit"
              >
                Submit
              </Button>
              <Button
                className="login-form-button"
                style={{ marginRight: "20px" }}
                onClick={() => {
                  setVisible(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};
const mapStateToProps = (state) => ({
  currentTestCaseId: state.testCase.currentTestCase.id,
  loading: state.testCase.loading,
});
const mapDispatchToProps = { addProcess, editStep, addStep };

export default connect(mapStateToProps, mapDispatchToProps)(AddEditStepModal);
