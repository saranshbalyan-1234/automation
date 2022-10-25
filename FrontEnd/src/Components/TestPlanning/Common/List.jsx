import React, { useState } from "react";
import { Table, Popconfirm, Button, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import AddEditModal from "./AddEditModal";
import UserAvatar from "../../Common/Avatar";
import { useNavigate } from "react-router-dom";
export const List = ({ onDelete, loading, data, reusable = false }) => {
  const navigate = useNavigate();
  const [addEditModal, setAddEditModal] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      render: (_, record) => (
        <div>{<UserAvatar name={record.createdBy.name} />}</div>
      ),
    },

    {
      title: "Last Updated",
      key: "updatedAt",
      render: (_, record) => (
        <div>{moment(record.updatedAt).format("DD-MM-YYYY h:mm:ss a")}</div>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Popconfirm
            title={`Are you sure to delete this ${
              reusable ? "Reusable Flow" : "Test Case"
            }?`}
            onConfirm={async (e) => {
              e.stopPropagation();
              await onDelete(record.id);
            }}
            okText="Yes, Delete"
            cancelText="No"
          >
            <DeleteOutlined
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: 17 }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Spin spinning={loading}>
        {" "}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            padding: "10px 0px 10px 0px ",
          }}
        >
          <div></div>
          <Button
            type="primary"
            ghost
            onClick={() => {
              setAddEditModal(true);
            }}
          >
            New {reusable ? "Reusable Flow" : "Test Case"}
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowClassName="pointer"
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                navigate(
                  `/TestPlanning/${reusable ? "ReusableFlow" : "TestCase"}/${
                    record.id
                  }/details`
                );
              },
            };
          }}
        />
        {addEditModal && (
          <AddEditModal
            visible={addEditModal}
            setVisible={setAddEditModal}
            loading={loading}
            reusable={reusable}
          />
        )}
      </Spin>
    </>
  );
};

export default List;
