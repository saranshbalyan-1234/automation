import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Button, Spin, Select, Switch } from "antd";
import { connect } from "react-redux";
import { addProcess } from "../../../Redux/Actions/testCase";
import { addStep, editStep } from "../../../Redux/Actions/testCase";
import { getObjectByProject } from "../../../Redux/Actions/object";
import {
  addReusableStep,
  editReusableStep,
} from "../../../Redux/Actions/reusableFlow";
import AddEditObjectModal from "../../ObjectBank/AddEditObjectModal";
import axios from "axios";
import { saveObject } from "../../../Redux/Actions/object";
import ReactQuill from "react-quill";
const Option = { Select };
const AddEditStepModal = ({
  visible,
  setVisible,
  editData,
  editStep,
  editReusableStep,
  setEditData,
  loading,
  edit = false,
  step,
  addStep,
  addReusableStep,
  processId,
  reusableFlowId,
  currentProjectId,
  objectList,
  getObjectByProject,
  objectLoading,
  saveObject,
  setEdit = () => {},
}) => {
  const [actionEvent, setActionEvent] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({});
  const [addObjectModal, setAddObjectModal] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    axios.get("/global/actionEvent").then((res) => {
      setActionEvent(res.data);
      if (edit)
        setCurrentEvent(
          res.data.find((el) => {
            return el.name === editData.actionEvent;
          })
        );
      else
        setCurrentEvent(
          res.data.find((el) => {
            return el.name === "Launch Website";
          })
        );
    });
  }, []);

  useEffect(() => {
    edit &&
      form.setFieldsValue({
        parameter1: editData.testParameters.find((el) => {
          return el.type === currentEvent.parameter1;
        })?.property,
        parameter2: editData.testParameters.find((el) => {
          return el.type === currentEvent.parameter2;
        })?.property,
        parameter3: editData.testParameters.find((el) => {
          return el.type === currentEvent.parameter3;
        })?.property,
      });
  }, [currentEvent, edit]);

  useEffect(() => {
    currentProjectId && getObjectByProject();
  }, [currentProjectId]);

  const onSubmit = async (data) => {
    let result = false;

    let payload = { ...data, parameters: [] };

    if (currentEvent.parameter1) {
      const key = currentEvent.parameter1;
      const value = data.parameter1;
      payload.parameters.push({ type: key, property: value });
    }
    if (currentEvent.parameter2) {
      const key = currentEvent.parameter2;
      const value = data.parameter2;
      payload.parameters.push({ type: key, property: value });
    }
    if (currentEvent.parameter3) {
      const key = currentEvent.parameter3;
      const value = data.parameter3;
      payload.parameters.push({ type: key, property: value });
    }

    if (edit) {
      if (reusableFlowId && !processId) {
        result = await editReusableStep({
          data: payload,
          stepId: editData.id,
        });
      } else {
        result = await editStep({
          data: payload,
          stepId: editData.id,
          reusableFlowId,
          processId,
        });
      }
      setEditData({});
    } else {
      if (reusableFlowId && !processId) {
        result = await addReusableStep({
          ...payload,
          reusableFlowId,
          step,
        });
      } else {
        if (reusableFlowId && processId) {
          result = await addStep({
            ...payload,
            reusableFlowId,
            step,
            reusableProcessId: processId,
          });
        } else {
          result = await addStep({
            ...payload,
            processId,
            step,
          });
        }
      }
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
        width={500}
        centered
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>{edit ? "Edit Step" : "Create New Step"}</div>
            {currentEvent.object && (
              <Button
                type="primary"
                ghost
                onClick={() => {
                  setAddObjectModal(true);
                }}
              >
                Add New Object
              </Button>
            )}
          </div>
        }
        visible={visible}
        footer={false}
        onCancel={() => {
          setVisible(false);
        }}
        closable={false}
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            name="testStep"
            onFinish={onSubmit}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              name: edit ? editData.name : "",
              comment: edit ? editData.comment : "",
              actionEvent: edit ? editData.actionEvent : "Launch Website",
              objectId: edit ? editData.object?.id : "",
              screenshot: edit ? editData.screenshot : false,
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
              <Select
                showSearch
                style={{ minWidth: "160px" }}
                onChange={(e) =>
                  setCurrentEvent(
                    actionEvent.find((el) => {
                      return el.name === e;
                    })
                  )
                }
              >
                {actionEvent.map((el, i) => {
                  return (
                    <Option value={el.name} key={i}>
                      {el.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            {currentEvent.object && (
              <Form.Item
                name="objectId"
                label="Object"
                rules={[
                  {
                    required: true,
                    message: "Please select object!",
                  },
                ]}
              >
                <Select style={{ minWidth: "160px" }} showSearch>
                  {objectList.map((el, i) => {
                    return (
                      <Option value={el.id} key={i}>
                        {el.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}

            {currentEvent.parameter1 && (
              <Form.Item
                name="parameter1"
                label={currentEvent.parameter1}
                rules={[
                  {
                    required: true,
                    message: "Please input Parameter!",
                  },
                ]}
              >
                <Input name="parameter1" showCount maxLength={50} />
              </Form.Item>
            )}

            {currentEvent.parameter2 && (
              <Form.Item
                name="parameter2"
                label={currentEvent.parameter1}
                rules={[
                  {
                    required: true,
                    message: "Please input Parameter!",
                  },
                ]}
              >
                <Input name="parameter2" showCount maxLength={50} />
              </Form.Item>
            )}

            {currentEvent.parameter3 && (
              <Form.Item
                name="parameter3"
                label={currentEvent.parameter3}
                rules={[
                  {
                    required: true,
                    message: "Please input Parameter!",
                  },
                ]}
              >
                <Input name="parameter3" showCount maxLength={50} />
              </Form.Item>
            )}
            <Form.Item name="screenshot" label="Screenshot">
              {/* <Input name="screenshot" /> */}
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
            <Form.Item name="comment" label="">
              {/* <Input name="comment" showCount maxLength={50} /> */}
              <ReactQuill
                style={{ width: 450 }}
                placeholder="Enter Comment"
                name="comment"
              />
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="primary"
                style={{ marginRight: "20px" }}
                htmlType="submit"
              >
                Submit
              </Button>
              <Button
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

      <AddEditObjectModal
        visible={addObjectModal}
        setVisible={setAddObjectModal}
        loading={objectLoading}
        name={"Object"}
        onSave={saveObject}
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  loading: state.testCase.loading,
  currentProjectId: state.projects.currentProject.id,
  objectList: state.objectBank.data,
  objectLoading: state.objectBank.loading,
});
const mapDispatchToProps = {
  addProcess,
  editStep,
  addStep,
  addReusableStep,
  editReusableStep,
  getObjectByProject,
  saveObject,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEditStepModal);