import { Avatar, Col, Form, Input, message, Popconfirm, Space, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";

import { AiOutlineUser } from "react-icons/ai";
import { MdHideSource, MdOutlineMarkEmailRead, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegPenToSquare } from "react-icons/fa6";
import { RiUserSearchFill } from "react-icons/ri";
import { QuestionCircleOutlined } from "@ant-design/icons";

import styles from "./Employers.module.css";
import ManagementTable from "../ManagementTable/ManagementTable";
import { useNavigate, useOutletContext } from "react-router-dom";
import ModalUpdate from "../ModalUpdate/ModalUpdate";

function Employers() {
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

  const handleUpdateEmployer = (data) => {
    setData(prev => prev.map(employer => {
      // console.log(employer);
      if (employer._id === data._id)
        return data;
      return employer;
    }))
  }

  const handleConfirmHidden = async (employers) => {
    setConfirmHiddenLoading(true);
    await axios.post(`http://localhost:8000/api/admin/hidden`, {
      members: employers.map(employer => ({ mbid: employer._id, email: employer.email, })),
      adminId: admin.id,
    }, {
      withCredentials: true,
    })
      .then(_ => {
        const employerIds = employers.map(employer => employer._id);
        setData(prev => prev.filter(employer => !employerIds.includes(employer._id)));
        messageApi.success("Ẩn nhà tuyển dụng thành công!");
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

  const handleConfirmEnable = async (employers) => {
    setConfirmEnableLoading(true);
    await axios.post(`http://localhost:8000/api/admin/enable`, {
      members: employers.map(employer => ({ mbid: employer._id, email: employer.email, })),
    }, {
      withCredentials: true,
    })
      .then(_ => {
        const employerIds = employers.map(employer => employer._id);
        setData(prev => prev.filter(employer => !employerIds.includes(employer._id)));
        messageApi.success("Khôi phục nhà tuyển dụng thành công!");
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

  const getEmployers = (page, pageSize, hidden = false, pos = "Unknow") => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/admin/list/employer?hidden=${hidden}&page=${page}&size=${pageSize}`, {
      withCredentials: true,
    })
      .then(res => {
        // console.log(res.data.members, pos);
        setData(res.data.members?.map((data) => ({
          uid: data._id,
          company: data.company.name,
          ...data.member,
          status: data.member?.verifiedAt ? true : false,
        })));
        setTableParams({ ...tableParams, pagination: { current: page, pageSize: pageSize, total: res.data.info.total } });
      })
      .catch(err => {
        console.error(err);
        messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
        const code = err?.response?.status;
        if (code === 401 || code === 403)
          nav("/login");
      })
      .finally(() => setLoading(false))
  }

  const handleConfirmVerify = async (employers) => {
    setConfirmVerifyLoading(true);
    await axios.post(`http://localhost:8000/api/admin/verify`, {
      members: employers.map(employer => ({ mbid: employer._id, email: employer.email, })),
    }, {
      withCredentials: true,
    })
      .then(_ => {
        const employerIds = employers.map(employer => employer._id);
        setData(prev => prev.map(employer => {
          if (employerIds.includes(employer._id))
            employer.status = true
          return employer;
        }));
        messageApi.success("Xác minh nhà tuyển dụng thành công!");
      })
      .catch(err => {
        console.log(err);
        const code = err?.response?.status;
        if (code === 401 || code === 403)
          nav("/login");
        else
          messageApi.error(err.response?.data?.message);

      })
      .finally(() => {
        setConfirmVerifyLoading(false);
        setOpenConfirmVerify(null);
      })
  }

  const handleConfirmDelete = async (employers) => {
    setConfirmDeleteLoading(true);
    await axios.post(`http://localhost:8000/api/admin/employers/delete`, {
      members: employers.map(employer => ({ mbid: employer._id, email: employer.email, })),
    }, {
      withCredentials: true,
    })
      .then(_ => {
        const employerIds = employers.map(employer => employer._id);
        setData(prev => prev.filter(employer => !employerIds.includes(employer._id)));
        messageApi.success("Xóa nhà tuyển dụng thành công!");
      })
      .catch(err => {
        console.log(err);
        const code = err?.response?.status;
        if (code === 401 || code === 403)
          nav("/login");
        else
          messageApi.error(err.response?.data?.message);
      })
      .finally(() => {
        setConfirmDeleteLoading(false);
        setOpenConfirmDelete(null);
      })
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
            <Popconfirm title="Ẩn nhà tuyển dụng" description="Bạn chắc chắn muốn ẩn nhà tuyển dụng này?" placement="topRight"
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
            <Popconfirm title="Xác minh nhà tuyển dụng" description="Bạn chắc chắn muốn xác minh cho nhà tuyển dụng này?"
              icon={<QuestionCircleOutlined style={{ color: "#20bbc9" }} />} placement="topRight"
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
    getEmployers(1, 10, false, "Employers.jsx");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {contextHolder}
      <ManagementTable
        getData={getEmployers}
        setData={setData}
        tableParams={tableParams}
        handleConfirmHidden={handleConfirmHidden}
        handleConfirmEnable={handleConfirmEnable}
        handleConfirmVerify={handleConfirmVerify}
        handleConfirmDelete={handleConfirmDelete}
        setTableParams={setTableParams}
        uses={["refresh", "add", "export", "verify", "hidden", "enable", "delete"]}
        tabs={[{
          label: "Nhà tuyển dụng hoạt động",
          icon: <RiUserSearchFill />,
          title: "Danh sách nhà tuyển dụng khả dụng",
          columns: columns,
          loading: loading,
          data: data,
        }, {
          label: "Nhà tuyển dụng bị ẩn",
          icon: <MdHideSource />,
          title: "Danh sách nhà tuyển dụng bị ẩn",
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
                  <Popconfirm title="Hành động không thể khôi phục" description="Bạn chắc chắn muốn xóa vĩnh viễn nhà tuyển dụng này?"
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
        }}
        setModalData={setModalData}
        handleUpdateMember={handleUpdateEmployer}
        apiUpdate={`http://localhost:8000/api/admin/member/info/${modalData._id}`}
      >
        <Col span={24}>
          <Form.Item
            label={<span className={styles.lbUpdateFrm}>Tên công ty</span>}
          >
            <Input  placeholder="Tên công ty" value={modalData.company} disabled />
          </Form.Item>
        </Col>
      </ModalUpdate>}
    </>
  );
}

export default Employers;