import React, { useState, useEffect } from "react";
import { Modal, Select, DatePicker } from "antd";
import { Line } from "@ant-design/plots";
import axios from "axios";
import { connect } from "react-redux";
const DetailedExecutionReportModal = ({
  visible,
  setVisible,
  currentUserId,
  team,
  user,
}) => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [range, setRange] = useState({});
  const [userId, setUserId] = useState(currentUserId);
  useEffect(() => {
    let payload = { userId };
    if (range.startDate && range.endDate) {
      payload = { ...payload, ...range };
    }
    axios.post("/dashboard/detailed-execution-report", payload).then((res) => {
      setData(res.data.data);
      setTotalCount(res.data.totalCount);
    });
  }, [userId, range]);
  const handleRangeSelection = (date) => {
    setRange({
      startDate: `${date[0].$y}-${date[0].$M + 1}-${date[0].$D}`,
      endDate: `${date[1].$y}-${date[1].$M + 1}-${date[1].$D}`,
    });
  };
  const config = {
    data,
    xField: "date",
    yField: "value",
    seriesField: "type",
    xAxis: {
      type: "time",
    },
    yAxis: {
      label: {
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
  };

  return (
    <Modal
      centered
      width={1000}
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>Detailed Execution Report</div>
          <DatePicker.RangePicker onChange={handleRangeSelection} />
          <div style={{ display: "flex", gap: 10, marginRight: 30 }}>
            Total Executed By
            <Select
              size="small"
              defaultValue={user?.id}
              style={{ width: 80, marginRight: "-2px" }}
              onChange={(e) => {
                setUserId(e);
              }}
            >
              <Select.Option value={user?.id}>Me</Select.Option>
              {team.map((el) => {
                return <Select.Option value={el.id}>{el.name}</Select.Option>;
              })}
            </Select>
            : {totalCount}
          </div>
        </div>
      }
      open={visible}
      footer={false}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <Line {...config} />
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  team: state.team.data,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailedExecutionReportModal);