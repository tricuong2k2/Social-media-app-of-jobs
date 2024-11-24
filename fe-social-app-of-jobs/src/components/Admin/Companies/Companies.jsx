import { Avatar, message, Popconfirm, Space, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

import { PiTrademarkRegisteredFill } from "react-icons/pi";
import { MdHideSource, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import { QuestionCircleOutlined } from "@ant-design/icons";

import styles from "./Companies.module.css";
import ManagementTable from "../ManagementTable/ManagementTable";
import { useNavigate, useOutletContext } from "react-router-dom";

function Companies() {
  const { admin } = useOutletContext();

  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [openConfirmHidden, setOpenConfirmHidden] = useState(null);
  const [confirmHiddenLoading, setConfirmHiddenLoading] = useState(false);

  const [openConfirmEnable, setOpenConfirmEnable] = useState(null);
  const [confirmEnableLoading, setConfirmEnableLoading] = useState(false);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(null);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [messageApi, contextHolder] = message.useMessage();

  const handleConfirmHidden = async (companies) => {
    setConfirmHiddenLoading(true);
    await axios.post(`http://localhost:8000/api/admin/hidden`, {
      members: companies.map(company => ({ mbid: company._id, email: company.email, })),
      adminId: admin.id,
    }, {
      withCredentials: true,
    })
      .then(_ => {
        const companyIds = companies.map(company => company._id);
        setData(prev => prev.filter(company => !companyIds.includes(company._id)));
        messageApi.success("Ẩn công ty thành công!");
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

  const handleConfirmEnable = async (companies) => {
    setConfirmEnableLoading(true);
    await axios.post(`http://localhost:8000/api/admin/enable`, {
      members: companies.map(company => ({ mbid: company._id, email: company.email, })),
    }, {
      withCredentials: true,
    })
      .then(_ => {
        const companyIds = companies.map(company => company._id);
        setData(prev => prev.filter(company => !companyIds.includes(company._id)));
        messageApi.success("Khôi phục công ty thành công!");
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

  const handleConfirmDelete = async (companies) => {
    setConfirmDeleteLoading(true);
    await axios.post(`http://localhost:8000/api/admin/employers/delete`, {
      members: companies.map(company => ({ mbid: company._id, email: company.email, })),
    }, {
      withCredentials: true,
    })
      .then(_ => {
        const companyIds = companies.map(company => company._id);
        setData(prev => prev.filter(company => !companyIds.includes(company._id)));
        messageApi.success("Xóa công ty thành công!");
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

  const getCompanies = (page, pageSize, hidden = false, pos = "Unknow") => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/admin/list/companies?hidden=${hidden}&page=${page}&size=${pageSize}`, {
      withCredentials: true,
    })
      .then(res => {
        // console.log(res.data.companies, pos);
        setData(res.data.companies?.map((data) => ({
          uid: data._id,
          companyId: data.company._id,
          ...data.company,
          ...data.member,
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
      title: "Logo",
      dataIndex: "logo",
      render: (logo) => <div style={{ textAlign: "center" }}>
        <Avatar
          size="small"
          shape="square"
          src={logo}
          icon={logo ? null : <PiTrademarkRegisteredFill />}
        />
      </div>,
      width: "6%",
      align: "center",
    },
    {
      title: "Công ty",
      dataIndex: "name",
      sorter: (a, b) => `${a.name}`.localeCompare(`${b.name}`),
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
      title: "Mã số thuế",
      dataIndex: "taxCode",
      render: (taxCode) => taxCode || <Tag color="blue">Chưa cập nhật</Tag>,
      align: "center",
    },
    {
      title: "Quy mô",
      dataIndex: "companySize",
      render: (size) => <span >
        <Tag color={size <= 50 
          ? "green" : (50 < size && size <= 200 
            ? "gold" : (size > 200 ? "magenta" : "blue"))}>
          { size || "Chưa cập nhật" }
        </Tag>
      </span>,
      filters: [
        {
          text: "Dưới 50 nhân viên",
          value: [0, 50],
        },
        {
          text: "Từ 50 đến 200 nhân viên",
          value: [50, 200],
        },
        {
          text: "Trên 200 nhân viên",
          value: [200, Infinity],
        },
        {
          text: "Chưa xác định",
          value: null,
        }
      ],
      onFilter: (value, record) => value !== null 
        ? value[0] < record?.companySize && record?.companySize <= value[1] : record.companySize === undefined,
      align: "center",
      width: "10%",
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
      render: (address) => address 
        ? `${address.ward}, ${address.district}, ${address.province}` 
        : <Tag color="blue">Chưa cập nhật</Tag>,
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
          {/* <Tooltip title="Chỉnh sửa" placement="topRight">
            <span className={styles.update} >
              <FaRegPenToSquare />
            </span>
          </Tooltip> */}
          <Tooltip title="Ẩn" placement="topRight">
            <Popconfirm title="Ẩn công ty" description="Bạn chắc chắn muốn ẩn công ty này?" placement="topRight"
              icon={<QuestionCircleOutlined style={{ color: "#ff4d4f" }} />} open={openConfirmHidden === record._id}
              onConfirm={() => handleConfirmHidden([record])}
              onCancel={() => { if (!confirmHiddenLoading) setOpenConfirmHidden(null) }}
            >
              <span className={styles.hide} onClick={() => setOpenConfirmHidden(record._id)}>
                <MdHideSource />
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
    getCompanies(1, 10, false, "Companies.jsx");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      { contextHolder }
      <ManagementTable
        getData={getCompanies}
        tableParams={tableParams}
        setTableParams={setTableParams}
        setData={setData}
        handleConfirmHidden={handleConfirmHidden}
        handleConfirmEnable={handleConfirmEnable}
        handleConfirmDelete={handleConfirmDelete}
        uses={["refresh", "export", "hidden", "enable", "delete"]}
        tabs={[{
          label: "Công ty hoạt động",
          icon: <FaUserTie />,
          title: "Danh sách công ty đang hoạt động",
          columns: columns,
          loading: loading,
          data: data,
        }, {
          label: "Công ty bị ẩn",
          icon: <MdHideSource />,
          title: "Danh sách công ty bị ẩn",
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
                  <Popconfirm title="Hành động không thể khôi phục" description="Bạn chắc chắn muốn xóa vĩnh viễn công ty này?"
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
    </>
  );
}

export default Companies;