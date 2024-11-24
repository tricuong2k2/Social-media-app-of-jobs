import { Avatar, Col, Form, message, Popconfirm, Space, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";

import { AiOutlineUser } from "react-icons/ai";
import { MdHideSource, MdOutlineMarkEmailRead, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegPenToSquare } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { QuestionCircleOutlined } from "@ant-design/icons";

import styles from "./Candidates.module.css";
import ManagementTable from "../ManagementTable/ManagementTable";
import { useNavigate, useOutletContext } from "react-router-dom";
import ModalUpdate from "../ModalUpdate/ModalUpdate";
import TextArea from "antd/es/input/TextArea";

function Candidates() {
  const { admin } = useOutletContext();

  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [openConfirmHidden, setOpenConfirmHidden] = useState(null);
  const [confirmHiddenLoading, setConfirmHiddenLoading] = useState(false);

  const [openConfirmEnable, setOpenConfirmEnable] = useState(null);
  const [confirmEnableLoading, setConfirmEnableLoading] = useState(false);

  const [openConfirmVerify, setOpenConfirmVerify] = useState(null);
  const [confirmVerifyLoading, setConfirmVerifyLoading] = useState(false);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(null);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);

  const [modalData, setModalData] = useState(null);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [messageApi, contextHolder] = message.useMessage();

  const handleUpdateCandidate = (data) => {
    setData(prev => prev.map(candidate => {
      // console.log(candidate);
      if (candidate._id === data._id)
        return data;
      return candidate;
    }))
  }

  const handleConfirmHidden = async (candidates) => {
    setConfirmHiddenLoading(true);
    await axios.post(`http://localhost:8000/api/admin/hidden`, {
      members: candidates.map(candidate => ({ mbid: candidate._id, email: candidate.email, })),
      adminId: admin.id,
    }, {
      withCredentials: true,
    })
      .then(_ => {
        const canIds = candidates.map(candidate => candidate._id);
        setData(prev => prev.filter(can => !canIds.includes(can._id)));
        messageApi.success("Ẩn ứng viên thành công!");
      })
      .catch(err => {
        console.log(err);
        messageApi.error(err.response?.data?.message);
        const code = err?.response?.status;
        if (code === 401 || code === 403)
          nav("/login");
      })
      .finally(() => {
        setConfirmHiddenLoading(false);
        setOpenConfirmHidden(null);
      })
  }

  const handleConfirmEnable = async (candidates) => {
    setConfirmEnableLoading(true);
    await axios.post(`http://localhost:8000/api/admin/enable`, {
      members: candidates.map(candidate => ({ mbid: candidate._id, email: candidate.email, })),
    }, {
      withCredentials: true,
    })
      .then(_ => {
        const canIds = candidates.map(candidate => candidate._id);
        setData(prev => prev.filter(can => !canIds.includes(can._id)));
        messageApi.success("Khôi phục ứng viên thành công!");
      })
      .catch(err => {
        console.log(err);
        messageApi.error(err.response?.data?.message);
        const code = err?.response?.status;
        if (code === 401 || code === 403)
          nav("/login");
      })
      .finally(() => {
        setConfirmEnableLoading(false);
        setOpenConfirmEnable(null);
      })
  }

  const handleConfirmVerify = async (candidates) => {
    setConfirmVerifyLoading(true);
    await axios.post(`http://localhost:8000/api/admin/verify`, {
      members: candidates.map(candidate => ({ mbid: candidate._id, email: candidate.email, })),
    }, {
      withCredentials: true,
    })
      .then(_ => {
        const canIds = candidates.map(candidate => candidate._id);
        setData(prev => prev.map(can => {
          if (canIds.includes(can._id))
            can.status = true
          return can;
        }));
        messageApi.success("Xác minh ứng viên thành công!");
      })
      .catch(err => {
        console.log(err);
        messageApi.error(err.response?.data?.message);
        const code = err?.response?.status;
        if (code === 401 || code === 403)
          nav("/login");
      })
      .finally(() => {
        setConfirmVerifyLoading(false);
        setOpenConfirmVerify(null);
      })
  }

  const handleConfirmDelete = async (candidates) => {
    setConfirmDeleteLoading(true);
    await axios.post(`http://localhost:8000/api/admin/candidates/delete`, {
      members: candidates.map(candidate => ({ mbid: candidate._id, email: candidate.email, })),
    }, {
      withCredentials: true,
    })
      .then(_ => {
        const canIds = candidates.map(candidate => candidate._id);
        setData(prev => prev.filter(can => !canIds.includes(can._id)));
        messageApi.success("Xóa ứng viên thành công!");
      })
      .catch(err => {
        console.log(err);
        messageApi.error(err.response?.data?.message);
        const code = err?.response?.status;
        if (code === 401 || code === 403)
          nav("/login");
      })
      .finally(() => {
        setConfirmDeleteLoading(false);
        setOpenConfirmDelete(null);
      })
  }

  const getCandidates = (page, pageSize, hidden = false, pos = "Unknow",) => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/admin/list/candidate?hidden=${hidden}&page=${page}&size=${pageSize}`, {
      withCredentials: true,
    })
      .then(res => {
        // console.log(res.data.members, pos);
        setData(res.data.members?.map((data) => ({
          uid: data._id,
          ...data.member,
          education: data.education,
          status: data.member?.verifiedAt ? true : false,
        })));
        setTableParams({ ...tableParams, pagination: { current: page, pageSize: pageSize, total: res.data.info.total } });
      })
      .catch(err => {
        console.error(err);
        messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
        const code = err.response.status;
        if (code === 401 || code === 403)
          nav("/login");
      })
      .finally(() => setLoading(false))
  }

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      render: (avatar) => <div style={{ textAlign: "center" }}>
        <Avatar
          size="small"
          shape="square"
          src={avatar}
          icon={avatar ? null : <AiOutlineUser />}
        />
      </div>,
      width: "6%",
      align: "center",
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      sorter: (a, b) => `${a.fullName}`.localeCompare(`${b.fullName}`),
      render: (name) => <span style={{ textTransform: "capitalize", }}>{name}</span>,
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "15%",
      ellipsis: true,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      render: (gender) => <span >
        <Tag color={gender === "male" ? "orange" : (gender === "female" ? "cyan" : "blue")}>
          {gender === "male" ? "Nam" : (gender === "female" ? "Nữ" : "Chưa cập nhật")}
        </Tag>
      </span>,
      filters: [
        {
          text: "Nam",
          value: "male",
        },
        {
          text: "Nữ",
          value: "female",
        },
        {
          text: "Chưa cập nhật",
          value: null,
        },
      ],
      onFilter: (value, record) => record.gender ? record.gender.indexOf(value) === 0 : (value === null),
      align: "center",
      width: "10%",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      render: (brirth) => {
        if (!brirth)
          return <Tag color="blue">Chưa cập nhật</Tag>;
        const dob = new Date(brirth);
        const [dat, month, year] = [dob.getDate().toString(), (dob.getMonth() + 1).toString(), dob.getFullYear().toString()];
        return `${dat.length > 1 ? dat : "0" + dat}/${month.length > 1 ? month : "0" + month}/${year}`;
      },
      sorter: (a, b) => {
        if (a.dob && b.dob)
          return new Date(a.dob.date).getTime() - new Date(b.dob.date).getTime();
        else if (a.dob && !b.dob)
          return -1;
        else return 1;
      },
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "tel",
      render: (tel) => tel || <Tag color="blue">Chưa cập nhật</Tag>,
      ellipsis: true,
      width: "13%",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      render: (address) => address || <Tag color="blue">Chưa cập nhật</Tag>,
      ellipsis: true,
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => <span>
        <Tag color={status ? "green" : "volcano"}>
          {status ? "Đã xác minh" : "Chưa xác minh"}
        </Tag>
      </span>,
      filters: [
        {
          text: "Đã xác minh",
          value: "true",
        },
        {
          text: "Chưa xác minh",
          value: "false",
        },
      ],
      onFilter: (value, record) => record.status.toString() === value,
      align: "center",
    },
    {
      title: "Hành động",
      render: (record) => (
        <Space size="small" align="start">
          <Tooltip title="Chỉnh sửa" placement="topRight">
            <span className={styles.update} onClick={() => setModalData(record)} >
              <FaRegPenToSquare />
            </span>
          </Tooltip>
          <Tooltip title="Ẩn" placement="topRight">
            <Popconfirm title="Ẩn ứng viên" description="Bạn chắc chắn muốn ẩn ứng viên này?" placement="topRight"
              icon={<QuestionCircleOutlined style={{ color: "#ff4d4f" }} />} open={openConfirmHidden === record._id}
              onConfirm={() => handleConfirmHidden([record])}
              onCancel={() => { if (!confirmHiddenLoading) setOpenConfirmHidden(null) }}
            >
              <span className={styles.hide} onClick={() => setOpenConfirmHidden(record._id)}>
                <MdHideSource />
              </span>
            </Popconfirm>
          </Tooltip>
          <Tooltip title={record.status ? "Không khả dụng" : "Xác minh thủ công"} placement="topRight">
            <Popconfirm title="Xác minh ứng viên" description="Bạn chắc chắn muốn xác minh cho ứng viên này?" placement="topRight"
              icon={<QuestionCircleOutlined style={{ color: "#20bbc9" }} />}
              open={!record.status && openConfirmVerify === record._id}
              onConfirm={() => handleConfirmVerify([record])}
              onCancel={() => { if (!confirmVerifyLoading) setOpenConfirmVerify(null) }}
            >
              <span className={clsx([styles.verify, record.status ? styles.disabled : null])}
                onClick={() => setOpenConfirmVerify(record._id)}
              >
                <MdOutlineMarkEmailRead />
              </span>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
      align: "center",
      width: "10%",
    },
  ];

  useEffect(() => {
    getCandidates(1, 10, false, "Candidates.jsx");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {contextHolder}
      <ManagementTable
        getData={getCandidates}
        tableParams={tableParams}
        setTableParams={setTableParams}
        setData={setData}
        handleConfirmHidden={handleConfirmHidden}
        handleConfirmEnable={handleConfirmEnable}
        handleConfirmVerify={handleConfirmVerify}
        handleConfirmDelete={handleConfirmDelete}
        uses={["refresh", "export", "verify", "hidden", "enable", "delete"]}
        tabs={[{
          label: "Ứng viên hoạt động",
          icon: <FaUserTie />,
          title: "Danh sách ứng viên khả dụng",
          columns: columns,
          loading: loading,
          data: data,
        }, {
          label: "Ứng viên bị ẩn",
          icon: <MdHideSource />,
          title: "Danh sách ứng viên bị ẩn",
          columns: [...columns.slice(0, columns.length - 1), {
            title: "Hành động",
            render: (record) => (
              <Space size="small" align="center">
                <Tooltip title="Bỏ ẩn" placement="topRight">
                  <Popconfirm title="Khôi phục ứng viên" description="Bạn chắc chắn muốn khôi phục ứng viên này?"
                    icon={<QuestionCircleOutlined style={{ color: "#20bbc9" }} />} open={openConfirmEnable === record._id}
                    onConfirm={() => handleConfirmEnable([record])} placement="topRight"
                    onCancel={() => { if (!confirmEnableLoading) setOpenConfirmEnable(null) }}
                  >
                    <span className={styles.restore} onClick={() => setOpenConfirmEnable(record._id)}>
                      <MdOutlineSettingsBackupRestore />
                    </span>
                  </Popconfirm>
                </Tooltip>
                <Tooltip title="Xóa vĩnh viễn" placement="topRight">
                  <Popconfirm title="Hành động không thể khôi phục" description="Bạn chắc chắn muốn xóa vĩnh viễn ứng viên này?"
                    icon={<QuestionCircleOutlined style={{ color: "#ff4d4f" }} />} open={openConfirmDelete === record._id}
                    onConfirm={() => handleConfirmDelete([record])} placement="topRight"
                    onCancel={() => { if (!confirmDeleteLoading) setOpenConfirmDelete(null) }}
                  >
                    <span className={styles.delete} onClick={() => setOpenConfirmDelete(record._id)} >
                      <RiDeleteBin6Line />
                    </span>
                  </Popconfirm>
                </Tooltip>
              </Space>
            ),
            align: "center",
            width: "10%",
          }],
          loading: loading,
          data: data,
        }]}
      />
      {modalData && <ModalUpdate
        data={{
          ...modalData,
          // resumes: [
          //   {
          //     name: "CV-ứng-tuyển-intern-ReactJs.pdf",
          //     resume: "https://www.topcv.vn/xem-cv/AwFWVFYACQVXAVFTAw0ODgIDVlcMBFQCWABXUg0191"
          //   },
          //   {
          //     name: "CV-ứng-tuyển-intern-Node-ExpressJS.docx",
          //     resume: "https://www.topcv.vn/xem-cv/AwFWVFYACQVXAVFTAw0ODgIDVlcMBFQCWABXUg0191"
          //   },
          //   {
          //     name: "CV-ứng-tuyển-intern-ASPdotNet.doc",
          //     resume: "https://www.topcv.vn/xem-cv/AwFWVFYACQVXAVFTAw0ODgIDVlcMBFQCWABXUg0191"
          //   }
          // ]
        }}
        setModalData={setModalData}
        handleUpdateMember={handleUpdateCandidate}
        apiUpdate={`http://localhost:8000/api/admin/member/info/${modalData._id}`}
      >
        <Col span={24}>
          <Form.Item
            label={<span className={styles.lbUpdateFrm}>Học vấn</span>}
            name="education"
            initialValue={modalData?.education}
          >
            <TextArea rows={4} placeholder="Học vấn" />
          </Form.Item>
        </Col>
      </ModalUpdate>}
    </>
  );
}

export default Candidates;