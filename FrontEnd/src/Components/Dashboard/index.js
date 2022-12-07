import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Typography, Statistic, Row, Col, Card, Tag } from "antd";
import axios from "axios";
import {
  EditOutlined,
  UserOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import ColumnGraph from "../Common/ColumnGraph";
import Loading from "../Common/Loading";
import ExecutionDetailModal from "./ExecutionDetailModal";
const { Title } = Typography;

export const Dashboard = ({ user }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [mainData, setMainData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [detailedExecutionReportModal, setDetailedExecutionReportModal] =
    useState(false);
  const [executionHistoryData, setExecutionHistoryData] = useState([]);
  useEffect(() => {
    axios.get("/dashboard").then((res) => {
      setData(res.data);
      setLoading(false);
      let mainData = Object.entries(res.data.createdByMe).map((el) => {
        return { name: el[0], Total: el[1] };
      });

      setMainData(mainData);
      let tempUserdata = { ...res.data.user };
      delete tempUserdata.total;
      let userData = Object.entries(tempUserdata).map((el) => {
        return { name: el[0], Total: el[1] };
      });
      setUserData(userData);

      let tempExecutedData = { ...res.data.executionHistory };
      delete tempExecutedData.Total;
      let executedData = Object.entries(tempExecutedData)
        .filter((el) => {
          return el !== "Total";
        })
        .map((el) => {
          return { name: el[0], Total: el[1] };
        });
      setExecutionHistoryData(executedData);
    });
  }, []);

  return (
    <Loading loading={loading}>
      <StyledContainer>
        {/* <Title level={3}>Hi, {user.name}</Title> */}

        <Row gutter={[16, 16]} style={{ justifyContent: "space-between" }}>
          <div className="row">
            <div className="row">
              <Col>
                <Card className="card">
                  <Statistic
                    title={
                      <div className="title">
                        <ProjectOutlined className="icon" />
                        <Title level={5}>Projects Assigned</Title>
                      </div>
                    }
                    value={data.project}
                  />
                </Card>
              </Col>
              <Col>
                <Card className="card">
                  <Statistic
                    title={
                      <div className="title">
                        <UserOutlined className="icon" />
                        <Title level={5}>Total Users</Title>
                      </div>
                    }
                    value={data.user?.total}
                  />
                </Card>
              </Col>
              <Col>
                <Card className="card">
                  <Statistic
                    title={
                      <div className="title">
                        <ClockCircleOutlined className="icon" />
                        <Title level={5}>Executed By Me</Title>
                      </div>
                    }
                    value={data.executionHistory?.Total}
                  />
                </Card>
              </Col>
            </div>
          </div>
          <div style={{ color: "green" }}>All Projects Dashboard</div>
        </Row>

        <Row gutter={[16, 16]}>
          <Col>
            <Card
              title={
                <div>
                  <EditOutlined style={{ marginRight: 10 }} />
                  Created By Me
                </div>
              }
              className="card"
              style={{ width: 400, height: 360 }}
            >
              <div style={{ width: 350, height: 200 }}>
                <ColumnGraph data={mainData} width={360} />
              </div>
            </Card>
          </Col>
          <Col>
            <Card
              title={
                <div>
                  <UserOutlined style={{ marginRight: 10 }} />
                  {`Total Users: ${data.user?.total}`}
                </div>
              }
              className="card"
              style={{ width: 400, height: 360 }}
            >
              <div style={{ width: 350, height: 200 }}>
                <ColumnGraph data={userData} />
              </div>
            </Card>
          </Col>
          <Col>
            <Card
              title={
                <div
                  className="row"
                  style={{
                    justifyContent: "space-between",
                  }}
                >
                  <div className="row">
                    <ClockCircleOutlined style={{ marginTop: "4px" }} />
                    {`Executed By Me: ${data.executionHistory?.Total}`}
                    <Tag
                      className="pointer"
                      style={{ textAlign: "center", fontWeight: 450 }}
                      onClick={() => {
                        setDetailedExecutionReportModal(true);
                      }}
                    >
                      More Details
                    </Tag>
                  </div>
                </div>
              }
              className="card"
              style={{ width: 400, height: 360 }}
            >
              <div style={{ width: 350, height: 200 }}>
                <ColumnGraph data={executionHistoryData} />
              </div>
            </Card>
          </Col>
        </Row>
      </StyledContainer>
      {detailedExecutionReportModal && (
        <ExecutionDetailModal
          visible={detailedExecutionReportModal}
          setVisible={setDetailedExecutionReportModal}
        />
      )}
    </Loading>
  );
};

const mapStateToProps = (state) => ({ user: state.auth.user });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

const StyledContainer = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  .card {
    box-shadow: 5px 10px #f6f6f6;
    width: 220px;
  }
  .title {
    gap: 10px;
    display: flex;
  }
  .icon {
    margin-top: 3px;
    font-size: 18px;
  }
`;
