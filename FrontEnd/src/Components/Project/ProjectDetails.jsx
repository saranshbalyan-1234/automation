import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Typography,
  Tooltip,
  Progress,
  Card,
  Table,
  Button,
  Spin,
  Popconfirm,
  Tag,
  Badge,
} from "antd";
import Avatar from "../Common/Avatar";
import moment from "moment";
import { DeleteOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getProjectById, removeMember } from "../../Redux/Actions/project";
// import AddEditProjectModal from "./AddEditProjectModal";
import AddProjectMemberModal from "./AddProjectMemberModal";
const { Title } = Typography;
const { Meta } = Card;
export const ProjectDetails = ({
  currentProject,
  loading,
  getProjectById,
  removeMember,
}) => {
  const { id } = useParams();

  const [addProjectMemberModal, setAddProjectMemberModal] = useState(false);
  useEffect(() => {
    getProjectById(id);
  }, [id]);

  const statusBadge = () => {
    const activeMembers = currentProject.members.filter((el) => {
      return el.active === true;
    }).length;
    const inactiveMembers = currentProject.members.length - activeMembers;
    const unverifiedMembers = currentProject.members.filter((el) => {
      return el.verifiedAt === null;
    }).length;
    return (
      <>
        <Badge
          count={`Active: ${activeMembers}`}
          overflowCount={999}
          style={{ backgroundColor: "#52c41a" }}
        />
        <Badge overflowCount={999} count={`Inactive: ${inactiveMembers}`} />
        <Badge
          count={`Verification Pending: ${unverifiedMembers}`}
          overflowCount={999}
          style={{ backgroundColor: "grey" }}
        />
      </>
    );
  };
  const formatDates = (startDate, endDate) => {
    let currentDate = moment(new Date()).format("YYYY/MM/DD");
    let totalDays = moment(endDate).diff(moment(startDate), "days");
    let daysPassed = moment(currentDate).diff(moment(startDate), "days");
    let percentagePassed = Math.floor((daysPassed / totalDays) * 100);

    return (
      <div style={{ marginTop: 10 }}>
        <Tooltip
          title={
            <div>
              Total Days: {totalDays}
              <br />
              Days Passed: {daysPassed}
            </div>
          }
        >
          <Progress percent={percentagePassed} size="small" />
        </Tooltip>
      </div>
    );
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },

    {
      title: "Status",
      key: "action",
      render: (_, record) => (
        <Tag color={record.verifiedAt ? (record.active ? "green" : "red") : ""}>
          {record.verifiedAt
            ? record.active
              ? "Active"
              : "Inactive"
            : "Verification Pending"}
        </Tag>
      ),
    },

    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to remove this user?"
          onConfirm={async () => {
            await removeMember({
              projectId: currentProject.id,
              userId: record.id,
            });
          }}
          okText="Yes, Remove"
          cancelText="No"
        >
          <DeleteOutlined style={{ fontSize: 17 }} onClick={() => {}} />
        </Popconfirm>
      ),
    },
  ];
  if (loading) return null;
  return (
    <div style={{ paddingTop: 20 }}>
      <Spin spinning={loading}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Meta
              title={
                <Title style={{ textTransform: "capitalize" }} level={3}>
                  Project: {currentProject.name}
                </Title>
              }
              description={
                <div style={{ color: "black" }}>
                  Created On
                  {moment(currentProject.createdAt).format("YYYY/MM/DD")} By
                  &nbsp;
                  {currentProject.createdBy && (
                    <Avatar name={currentProject.createdBy.name} />
                  )}
                </div>
              }
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 25,
              }}
            >
              <Button type="primary" ghost>
                Edit Project Details
              </Button>
            </div>
          </div>
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
                    __html: currentProject.description,
                  }}
                ></div>
              }
            />

            <div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 25,
                  alignSelf: "end",
                }}
              >
                <Card>
                  <Meta
                    title="Start Date"
                    description={currentProject.startDate}
                  />
                </Card>
                <Card>
                  <Meta title="End Date" description={currentProject.endDate} />
                </Card>
              </div>
              {formatDates(currentProject.startDate, currentProject.endDate)}
            </div>
          </div>
        </Card>
        <Card style={{ marginTop: 20 }}>
          {currentProject.members && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <Title
                level={5}
                style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
              >
                <div>Members</div> <div>({currentProject.members.length})</div>
                {statusBadge()}
              </Title>
              <Button
                type="primary"
                ghost
                onClick={() => {
                  setAddProjectMemberModal(true);
                }}
              >
                Add Member
              </Button>
            </div>
          )}
          <Table
            columns={columns}
            dataSource={currentProject.members}
            size="small"
          />
        </Card>
      </Spin>
      {addProjectMemberModal && (
        <AddProjectMemberModal
          visible={addProjectMemberModal}
          setVisible={setAddProjectMemberModal}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentProject: state.projects.currentProject,
  loading: state.projects.loading,
});

const mapDispatchToProps = { getProjectById, removeMember };

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);