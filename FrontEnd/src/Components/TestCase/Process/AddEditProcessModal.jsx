import React, { useEffect } from "react";
import { Form, Input, Modal, Button, Select } from "antd";
import { connect } from "react-redux";
import { addProcess, editProcess } from "../../../Redux/Actions/testCase";
import { getReusableProcessByProject } from "../../../Redux/Actions/reusableProcess";
import ReactQuill from "react-quill";
import Loading from "../../Common/Loading";
const { Option } = Select;
const AddEditProcessModal = ({
  visible,
  setVisible,
  addProcess,
  currentTestCaseId,
  editData,
  editProcess,
  setEditData,
  loading,
  edit = false,
  setEdit = () => {},
  step,
  addReusable = false,
  getReusableProcessByProject,
  reusableLoading,
  reusableProcesses,
}) => {
  useEffect(() => {
    addReusable && getReusableProcessByProject();
    // eslint-disable-next-line
  }, [addReusable]);

  const onSubmit = async (data) => {
    let result = false;
    if (edit) {
      result = await editProcess({ data: data, processId: editData.id });
      setEditData({});
    } else {
      result = await addProcess({
        ...data,
        testCaseId: currentTestCaseId,
        step,
      });
      if (step === 1 && edit === false) setEdit(true);
    }
    result && setVisible(false);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Modal
        centered
        title={edit ? "Edit Process" : "Create New Process"}
        open={visible}
        footer={false}
        onCancel={() => {
          setVisible(false);
        }}
        width={600}
        // closable={false}
      >
        <Loading loading={loading || reusableLoading}>
          <Form
            name="process"
            onFinish={onSubmit}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              name: edit ? editData.name : "",
              comment: edit ? editData.comment : "",
            }}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please input Name!",
                },
              ]}
            >
              <Input name="name" showCount maxlength={50} />
            </Form.Item>
            {addReusable && (
              <Form.Item
                name="reusableProcessId"
                label="Reusable Process"
                rules={[
                  {
                    required: true,
                    message: "Please select Reusable Process!",
                  },
                ]}
              >
                <Select style={{ minWidth: "160px" }}>
                  {reusableProcesses.map((el, i) => {
                    return (
                      <Option value={el.id} key={i}>
                        {el.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
            <Form.Item name="comment" label="">
              {/* <Input name="comment" showCount maxLength={50} /> */}
              <ReactQuill
                style={{ width: 550 }}
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
        </Loading>
      </Modal>
    </div>
  );
};
const mapStateToProps = (state) => ({
  currentTestCaseId: state.testCase.currentTestCase.id,
  loading: state.testCase.loading,
  reusableProcesses: state.reusableProcess.data,
  reusableLoading: state.reusableProcess.loading,
});
const mapDispatchToProps = {
  addProcess,
  editProcess,
  getReusableProcessByProject,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditProcessModal);
