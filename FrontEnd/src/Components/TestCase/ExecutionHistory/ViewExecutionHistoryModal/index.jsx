import React, { useEffect, useState } from "react";
import { Modal, Card, Typography, Tag } from "antd";
import { getExecutionHistoryById } from "../../../../Redux/Actions/executionHistory";
import { connect } from "react-redux";
import UserAvatar from "../../../Common/Avatar";
import Process from "../../Process";
import Loading from "../../../Common/Loading";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ViewExecutionVideoModal from "../ViewExecutionVideoModal";
import ExecutionTimeStepper from "./ExecutionTimeStepper";
const { Meta } = Card;
const { Title } = Typography;
const ViewExecutionHistoryModal = ({
  visible,
  setVisible,
  currentExecutionHistory,
  getExecutionHistoryById,
  loading,
}) => {
  const [viewExecutionViewModal, setViewExecutionVideoModal] = useState(false);
  useEffect(() => {
    getExecutionHistoryById(visible);
    // eslint-disable-next-line
  }, [visible]);

  return (
    <Modal
      width={1200}
      centered
      open={visible}
      footer={false}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <Loading loading={loading}>
        <div style={{ maxHeight: "80vh", overflow: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              marginTop: 2,
            }}
          >
            <Meta
              title={
                <div style={{ display: "flex", gap: 20 }}>
                  <Title style={{ textTransform: "capitalize" }} level={3}>
                    {`Execution History: ${currentExecutionHistory.name}`}
                  </Title>
                  <div style={{ color: "black", fontWeight: 600 }}>
                    Executed By &nbsp;
                    <UserAvatar user={currentExecutionHistory.executedByUser} />
                  </div>
                </div>
              }
              description={<></>}
            />
          </div>

          {currentExecutionHistory.description && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 30,
              }}
            >
              <Meta
                title="Description"
                description={
                  <div
                    style={{ marginTop: "5px" }}
                    dangerouslySetInnerHTML={{
                      __html: currentExecutionHistory.description,
                    }}
                  ></div>
                }
              />
            </div>
          )}

          <div className="row">
            <Tag
              color={
                currentExecutionHistory.recordAllSteps ? "#1677ff" : "#cd201f"
              }
              className="row"
              style={{
                cursor: currentExecutionHistory.recordAllSteps
                  ? "pointer"
                  : "not-allowed",
              }}
              onClick={() => {
                currentExecutionHistory.recordAllSteps &&
                  setViewExecutionVideoModal(true);
              }}
            >
              <div>Record All Steps</div>
              <div>
                {currentExecutionHistory.recordAllSteps ? (
                  <CheckOutlined />
                ) : (
                  <CloseOutlined />
                )}
              </div>
            </Tag>
            <Tag
              color={
                currentExecutionHistory.continueOnError ? "#1677ff" : "#cd201f"
              }
              className="row"
            >
              <div> Continue On Error</div>
              <div>
                {currentExecutionHistory.continueOnError ? (
                  <CheckOutlined />
                ) : (
                  <CloseOutlined />
                )}
              </div>
            </Tag>

            <Tag
              color={currentExecutionHistory.headless ? "#1677ff" : "#cd201f"}
              className="row"
            >
              <div>Headless</div>
              <div>
                {currentExecutionHistory.headless ? (
                  <CheckOutlined />
                ) : (
                  <CloseOutlined />
                )}
              </div>
            </Tag>
          </div>
          <ExecutionTimeStepper />
          <div style={{ marginTop: 20 }}>
            <Process />
          </div>
        </div>
      </Loading>
      {viewExecutionViewModal && (
        <ViewExecutionVideoModal
          visible={viewExecutionViewModal}
          setVisible={setViewExecutionVideoModal}
        />
      )}
    </Modal>
  );
};
const mapStateToProps = (state) => ({
  loading: state.executionHistory.loading,
  currentExecutionHistory: state.executionHistory.currentExecutionHistory,
});

const mapDispatchToProps = {
  getExecutionHistoryById,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewExecutionHistoryModal);