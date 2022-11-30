import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Table, Button, Popconfirm, Input, Spin } from "antd";
import CustomSearch from "../../Common/Search";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddModal from "./AddModal";
import { connect } from "react-redux";
import {
  getAllEnvironments,
  updateColumnValue,
} from "../../../Redux/Actions/environment";
const DataTable = ({
  visible,
  setVisible,
  currentTestCaseId,
  getAllEnvironments,
  environments,
  loading,
  updateColumnValue,
}) => {
  const [columns, setColumns] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [addModal, setAddModal] = useState({ active: false });

  useEffect(() => {
    setSearchedData(environments);
  }, [environments]);
  useEffect(() => {
    getAllEnvironments(currentTestCaseId);
  }, [currentTestCaseId]);
  const handleUpdateValue = (record, column, e) => {
    updateColumnValue({
      envId: record.envId,
      name: column,
      value: e.target.innerText,
    });
  };
  useEffect(() => {
    if (environments.length == 0) return;

    const tempDynamicKeys = Object.keys(environments[0]).map((el) => {
      let temp = {
        title: el,
        dataIndex: el,
      };
      if (el != "Environment") {
        temp.render = (text, record) => (
          <div style={{ minHeight: 30 }}>
            <div
              className="show-boundary"
              style={{ minHeight: 25 }}
              contentEditable
              onBlur={(e) => handleUpdateValue(record, el, e)}
            >
              {text}
            </div>
          </div>
        );
      }
      return temp;
    });
    const dynamicKeys = tempDynamicKeys.filter((el) => {
      return el.title !== "envId";
    });
    console.log("saransh", dynamicKeys);
    setColumns([
      ...dynamicKeys,
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Popconfirm
            title={`Are you sure to delete this Env?`}
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
        ),
      },
    ]);
  }, [environments.length > 0 && Object.keys(environments[0]).length]);

  const handleSearch = (e) => {
    let value = e.target.value.toLowerCase();
    const temp = environments.filter((el) => {
      return Object.keys(environments[0]).some((el1) => {
        return (
          el1 !== "envId" &&
          el[el1] &&
          String(el[el1]).toLowerCase().includes(value)
        );
      });
    });
    setSearchedData(temp);
  };
  const onDelete = (id) => {
    const deletedData = searchedData.filter((el) => {
      return el.id !== id;
    });
    setSearchedData(deletedData);
  };
  const handleAddEdit = (e, record) => {
    const value = e.target.value;
    if (record.id) {
      //edit
    } else {
      // add new
      const addedData = searchedData.map((el) => {
        return { ...el, env: value, editing: false };
      });
      setSearchedData(addedData);
    }
  };
  const startEditMode = (id) => {};

  return (
    <>
      <Modal
        // title="Environment"
        width={1000}
        centered
        visible={visible}
        footer={false}
        onCancel={() => {
          setVisible(false);
        }}
        // closable={false}
      >
        <Spin spinning={loading}>
          <div
            style={{ maxHeight: "70vh", overflow: "auto", minHeight: "70vh" }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginRight: 20,
              }}
            >
              <CustomSearch
                width="300px"
                placeholder={`Search By Env Name or Column Value`}
                onSearch={handleSearch}
              />
              <div className="row">
                <Button
                  type="primary"
                  ghost
                  style={{ marginBottom: 5 }}
                  onClick={() => {
                    // setRows([...rows, { env: "Enter Name", editing: true }]);
                    setAddModal({ active: true, type: "Column" });
                  }}
                  disabled={searchedData.length == 0}
                >
                  <PlusOutlined /> Column
                </Button>
                <Button
                  type="primary"
                  style={{ marginBottom: 5 }}
                  onClick={() => {
                    // setRows([...rows, { env: "Enter Name", editing: true }]);
                    setAddModal({ active: true, type: "Environment" });
                  }}
                >
                  <PlusOutlined />
                  Environment
                </Button>
              </div>
            </div>
            <Table
              size="small"
              columns={columns}
              dataSource={searchedData}
              pagination={false}
              sticky
            />
          </div>
        </Spin>
      </Modal>
      {addModal.active && (
        <AddModal
          visible={addModal.active}
          type={addModal.type}
          setVisible={setAddModal}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  currentTestCaseId: state.testCase.currentTestCase?.id,
  environments: state.environment.data,
  loading: state.environment.loading,
});
const mapDispatchToProps = { getAllEnvironments, updateColumnValue };

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
