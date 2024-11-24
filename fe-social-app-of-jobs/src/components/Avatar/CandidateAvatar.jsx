import { EditOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Dropdown, Image, message, Space, Spin, Upload } from "antd";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCandidateInfo } from "../../actions";
import styles from "./Avatar.module.css";

function CandidateAvatar({ API }) {
  const member = useSelector(state => state.memberReducer);
  const dispatch = useDispatch();

  const [upload, setUpLoad] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [avatar, setAvatar] = useState(member.avatar);

  const [messageApi, contextHolder] = message.useMessage();

  const editOptions = [
    {
      key: "0",
      label: (
        <div onClick={() => setOpenDropdown(false)}>
          Cập nhật avatar
        </div>
      )
    },
    {
      key: "2",
      label: (
        <div onClick={(e) => {
          e.stopPropagation();
          handleDeleteUpload();
        }}>
          Xóa avatar
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

  const handleUploadAvatar = async (file) => {
    await axios.post(API.upload, {
      file,
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
      .then(res => {
        setAvatar(res.data.url);
        messageApi.success("Cập nhật ảnh đại diện thành công");
        dispatch(setCandidateInfo({ ...member, avatar: res.data.url }));
      })
      .catch(err => {
        console.log(err);
        messageApi.error("Cập nhật ảnh đại diện thất bại");
        throw err;
      })
      .finally(() => setUpLoad(false));
  }

  const handleDeleteUpload = async () => {
    await axios.delete(API.delete, {
      withCredentials: true,
    })
      .then(_ => {
        setAvatar("/avatar.png");
        messageApi.success("Xóa ảnh đại diện thành công");
        dispatch(setCandidateInfo({ ...member, avatar: "/avatar.png" }));
      })
      .catch(err => {
        console.log(err);
        messageApi.error("Xóa ảnh đại diện thất bại");
      })
      .finally(() => setUpLoad(false));
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
          handleUploadAvatar(file)
            .then(onSuccess)
            .catch(onError)
        }}
        beforeUpload={beforeUpload}
        disabled={!openDropdown}
      >
        <div className={styles.uploadWrapper}>
          <div className={styles.avatarUpload} onClick={() => setPreviewOpen(true)}>
            { upload ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : (
              <>
                <img src={avatar || "/avatar.png"} className={styles.avatar} alt="Avatar" />
                <EyeOutlined className={styles.iconEye} />
              </>
            ) }
          </div>
          <Dropdown
            menu={{ items: avatar === "/avatar.png" ? [editOptions[0]] : editOptions }}
            open={openDropdown}
            trigger="click"
            onOpenChange={(open) => setOpenDropdown(open)}
          >
            <Button className={styles.editBtn} onClick={() => setOpenDropdown(true)}>
              <Space>
                <EditOutlined className={styles.editIcon} />
                Edit
              </Space>
            </Button>
          </Dropdown>
        </div>
      </Upload>
      <Image
        wrapperStyle={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
        src={avatar}
      />
    </div>
  );
}

export default CandidateAvatar;
