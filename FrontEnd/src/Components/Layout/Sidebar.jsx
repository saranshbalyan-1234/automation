import React, { useEffect, useState } from "react";
import {
  DashboardOutlined,
  FileOutlined,
  BankOutlined,
  BugOutlined,
} from "@ant-design/icons";
import { VscDebugRestart } from "react-icons/vsc";
import { Layout, Menu, Divider } from "antd";
import { connect } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
const { Sider } = Layout;
function Sidebar({ collapsed, setCollapsed, currentProjectId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");

  useEffect(() => {
    let temp = location.pathname.split("/");
    location.pathname.length > 1
      ? setSelectedMenu(temp[1])
      : setSelectedMenu("Dashboard");
  }, [location.pathname]);

  const handleMenuClick = (data) => {
    const path = data.keyPath.reverse().join("/");
    path === "Dashboard" ? navigate(`/`) : navigate(`/${path}`);
  };

  const items = [
    {
      label: "Dashboard",
      key: "Dashboard",
      icon: <DashboardOutlined />,
    },
    {
      label: <hr className="menuDivider" />,
      key: "Dashboard",
      icon: <DashboardOutlined />,
      type: "group",
    },
    {
      label: "Test Case",
      key: "TestCase",
      icon: <FileOutlined />,
      disabled: !currentProjectId,
    },
    {
      label: "Reusable Process",
      key: "ReusableProcess",
      icon: <VscDebugRestart />,
      disabled: !currentProjectId,
    },
    {
      label: "Object Bank",
      key: "ObjectBank",
      icon: <BankOutlined />,
      disabled: !currentProjectId,
    },
    {
      label: <hr className="menuDivider" />,
      key: "Dashboard",
      icon: <DashboardOutlined />,
      type: "group",
    },
    {
      label: "Defect",
      key: "Defect",
      icon: <BugOutlined />,
      disabled: !currentProjectId,
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      defaultCollapsed={true}
      collapsed={collapsed}
      breakpoint="lg"
      // collapsedWidth={window.innerWidth < 720 ? 0 : 80}
      onBreakpoint={(broken) => {}}
      onMouseEnter={() => {
        setCollapsed(false);
      }}
      onMouseLeave={() => {
        setCollapsed(true);
      }}
    >
      <div>
        {collapsed ? (
          <img
            alt="logo"
            src="https://qualitycuredmain.s3.ap-south-1.amazonaws.com/Public/Logo/QDIconWhite.svg"
            className="logo"
            style={{
              height: "38px",
              width: "50px",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/");
            }}
          />
        ) : (
          <img
            alt="logo"
            src="https://qualitycuredmain.s3.ap-south-1.amazonaws.com/Public/Logo/QDFullWhite.svg"
            className="logo"
            style={{
              height: "38px",
              width: "150px",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/");
            }}
          />
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedMenu}
        style={{ marginTop: "-4px" }}
        onClick={handleMenuClick}
        items={items}
      />
      ;
    </Sider>
  );
}

const mapStateToProps = (state) => ({
  currentProjectId: state.projects.currentProject?.id,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
