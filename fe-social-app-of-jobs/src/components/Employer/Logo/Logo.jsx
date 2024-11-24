import { Button, Dropdown, Image, message, Space, Spin, Upload } from "antd";

import axios from "axios";
import { useState } from "react";

import { EditOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";

import styles from "./Logo.module.css";

function Logo({ API, company=null }) {

  const [upload, setUpLoad] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [logo, setLogo] = useState(company?.logo);

  const [messageApi, contextHolder] = message.useMessage();

  const editOptions = [
    {
      key: "0",
      label: (
        <div
          onClick={() => setOpenDropdown(false)}
        >
          Cập nhật logo
        </div>
      )
    },
    {
      key: "2",
      label: (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteUpload();
          }}
        >
          Xóa logo
        </div>
      )
    }
  ]

  const beforeUpload = (file) => {
    if (!file.type.match(/image.*/)) {
      messageApi.error("Bạn chỉ có thể tải file ảnh lên!");
    } else {
      setUpLoad(true);
    }
    setOpenDropdown(false);
  }

  const handleUploadLogo = async (file) => {
    await axios.post(API.upload, {
      file,
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
      .then(res => {
        setLogo(res.data.url);
        messageApi.success("Cập nhật logo thành công");
        return res.data;
      })
      .catch(err => {
        console.log(err);
        messageApi.error("Cập nhật logo thất bại");
        throw err;
      })
      .finally(() => setUpLoad(false))
  }

  const handleDeleteUpload = async () => {
    await axios.delete(API.delete, {
      withCredentials: true,
    })
      .then(_ => {
        setLogo("/company.png");
        messageApi.success("Xóa logo thành công");
      })
      .catch(err => {
        console.log(err);
        messageApi.error("Xóa ảnh đại diện thất bại");
      })
      .finally(() => setUpLoad(false))
  }

  return (
    <div>
      {contextHolder}
      <Upload
        name="avatar"
        listType="picture-circle"
        className={styles.avatarUploader}
        accept="image/*"
        maxCount={1}
        showUploadList={false}
        customRequest={({ file, onSuccess, onError }) => {
          handleUploadLogo(file)
            .then(onSuccess)
            .catch(onError)
        }}
        beforeUpload={beforeUpload}
        disabled={!openDropdown}
      >
        <div className={styles.uploadWrapper}>
          <div className={styles.avatarUpload} onClick={() => setPreviewOpen(true)}>
            { upload ? <Spin indicator={ <LoadingOutlined style={{ fontSize: 24, }} spin /> }/> : (
              <>
                <img src={logo || company?.logo || "/company.png"} className={styles.avatar} alt="Logo company" />
                <EyeOutlined className={styles.iconEye} />
              </>
            ) }
          </div>
          <Dropdown
            menu={{ items: !logo && !company?.logo ? [editOptions[0]] : editOptions }}
            open={openDropdown}
            trigger="click"
            onOpenChange={(open) => setOpenDropdown(open)}
          >
            <Button className={styles.editBtn}
              onClick={() => setOpenDropdown(true)}
            >
              <Space >
                <EditOutlined className={styles.editIcon} />
                Edit
              </Space>
            </Button>
          </Dropdown>
        </div>
      </Upload>
      <Image
        wrapperStyle={{
          display: 'none',
        }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
        src={logo || company?.logo || "/company.png"}
      />
    </div>
  );
}

export default Logo;