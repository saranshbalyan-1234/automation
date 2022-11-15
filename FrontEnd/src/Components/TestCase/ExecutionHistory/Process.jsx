import React, { useState } from "react";
import { Popconfirm, Spin, Collapse, Tag } from "antd";
import { connect } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
// import TestStepTable from "../../Common/TestStep";
import ViewCommentModal from "../../Common/TestStep/ViewCommentModal";
const { Panel } = Collapse;
const Process = ({ process }) => {
  const [comment, setComment] = useState(false);

  return (
    <>
      <Spin spinning={false}>
        {process?.map((item, index) => {
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
                      Process: {item.name}
                      {item.reusableProcess && (
                        <Tag color="blue">
                          Reusable Process : {item.reusableProcess.name}
                        </Tag>
                      )}
                    </div>
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {item.comment && (
                        <Tag
                          color="red"
                          onClick={() => {
                            setComment(item.comment);
                          }}
                        >
                          <EyeOutlined /> View Comment
                        </Tag>
                      )}
                    </div>
                  </div>
                }
              >
                {/* <TestStepTable
                  testSteps={item.testSteps}
                  processId={item.id}
                  reusableProcessId={item.reusableProcess?.id}
                  deleteStep={deleteStep}
                /> */}
              </Panel>
            </Collapse>
          );
        })}
      </Spin>

      {comment && (
        <ViewCommentModal
          comment={comment}
          visible={comment}
          setVisible={setComment}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  process: state.executionHistory.currentExecutionHistory.process,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Process);