import React, { useEffect, useState } from "react";
import { Popconfirm, Spin, Collapse, Tag } from "antd";
import {
  getTestCaseStepsById,
  deleteProcess,
  deleteStep,
} from "../../../../Redux/Actions/TestPlanning/testCase";
import { connect } from "react-redux";
import ProcessMenu from "./ProcessMenu";
import { useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TestStepTable from "../../Common/TestStep";
import AddEditProcessModal from "./AddEditProcessModal";
const { Panel } = Collapse;
const TestProcess = ({
  getTestCaseStepsById,
  testProcess,
  deleteProcess,
  deleteStep,
}) => {
  const [addEditProcessModal, setAddEditProcessModal] = useState(false);
  const [editProcessData, setEditProcessData] = useState({});
  const [edit, setEdit] = useState(true);
  const { testCaseId } = useParams();

  useEffect(() => {
    getTestCaseStepsById(testCaseId);
  }, [testCaseId]);

  return (
    <>
      <Spin spinning={false}>
        {testProcess.map((item, index) => {
          return (
            <Collapse style={{ marginTop: "10px" }} key={index}>
              <Panel
                header={
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <ProcessMenu process={item} />
                      Process: {item.name}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "5px",
                        }}
                      ></div>
                    </div>
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <EditOutlined
                        onClick={() => {
                          setEditProcessData(item);
                          setAddEditProcessModal(true);
                        }}
                      />
                      <Popconfirm
                        title="Are you sure to remove this process?"
                        onConfirm={async () => {
                          await deleteProcess(item.id, item.step);
                        }}
                        okText="Yes, Remove"
                        cancelText="No"
                      >
                        <DeleteOutlined />
                      </Popconfirm>
                    </div>
                  </div>
                }
              >
                <TestStepTable
                  testSteps={item.testSteps}
                  processId={item.id}
                  deleteStep={deleteStep}
                />
              </Panel>
            </Collapse>
          );
        })}
        {testProcess.length === 0 && (
          <Tag
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEdit(false);
              setAddEditProcessModal(true);
            }}
          >
            Add First Process
          </Tag>
        )}
      </Spin>
      {addEditProcessModal && (
        <AddEditProcessModal
          visible={addEditProcessModal}
          setVisible={setAddEditProcessModal}
          editData={editProcessData}
          setEditData={setEditProcessData}
          edit={edit}
          step={1}
          setEdit={setEdit}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  testProcess: state.testCase.currentTestCase.testProcess,
});

const mapDispatchToProps = { getTestCaseStepsById, deleteProcess, deleteStep };

export default connect(mapStateToProps, mapDispatchToProps)(TestProcess);