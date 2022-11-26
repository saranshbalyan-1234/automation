import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Modal } from "antd";
import Loading from "../../Common/Loading";
import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { uploadProfilePic } from "../../../Redux/Actions/user";
const { Dragger } = Upload;
const UploadProfileImage = ({ visible, setVisible, uploadProfilePic }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormdata] = useState(new FormData());
  const onFinish = async () => {
    setLoading(true);
    const result = await uploadProfilePic(formData);
    result && setVisible(false);
    setLoading(false);
  };

  const handleFile = (e) => {
    formData.set("image", e.file);
    setFormdata(formData);
  };

  return (
    <Modal
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={false}
      closable={false}
    >
      <Loading loading={loading}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Dragger
            beforeUpload={() => {
              return false;
            }}
            maxCount={1}
            onChange={(e) => handleFile(e)}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger>{" "}
          <div style={{ marginTop: 10 }}>
            <Button type="primary" onClick={onFinish}>
              Upload
            </Button>
            <Button style={{ marginLeft: "10px" }}>Preview</Button>
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => {
                setVisible(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Loading>
    </Modal>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { uploadProfilePic };

export default connect(mapStateToProps, mapDispatchToProps)(UploadProfileImage);
