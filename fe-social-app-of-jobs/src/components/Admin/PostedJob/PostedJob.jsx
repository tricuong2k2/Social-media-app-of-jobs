import { message, Popconfirm, Space, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

import { MdHideSource, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCheckToSlot } from "react-icons/fa6";
import { QuestionCircleOutlined } from "@ant-design/icons";

import styles from "./PostedJob.module.css";
import ManagementTable from "../ManagementTable/ManagementTable";
import { useNavigate, useOutletContext } from "react-router-dom";

function PostedJob() {
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

  const handleConfirmHidden = async (postedJobs) => {
    setConfirmHiddenLoading(true);
    const jobIds = postedJobs.map(job => job._id);
    await axios.post(`http://localhost:8000/api/admin/posted-job/hidden`, {
      jobs: jobIds,
      adminId: admin.id,
    }, {
      withCredentials: true,
    })
      .then(_ => {
        setData(prev => prev.filter(job => !jobIds.includes(job._id)));
        messageApi.success("Ẩn công việc thành công!");
      })
      .catch(err => {
        console.log(err);
        const code = err.response.status;
        if (code === 401 || code === 403)
          nav("/login");
        else
          messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
      })
      .finally(() => {
        setConfirmHiddenLoading(false);
        setOpenConfirmHidden(null);
      })
  }

  const handleConfirmEnable = async (postedJobs) => {
    setConfirmEnableLoading(true);
    const jobIds = postedJobs.map(job => job._id);
    await axios.post(`http://localhost:8000/api/admin/posted-job/enable`, {
      jobs: jobIds,
    }, {
      withCredentials: true,
    })
      .then(_ => {
        setData(prev => prev.filter(job => !jobIds.includes(job._id)));
        messageApi.success("Khôi phục công việc thành công!");
      })
      .catch(err => {
        console.log(err);
        const code = err.response.status;
        if (code === 401 || code === 403)
          nav("/login");
        else
          messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
      })
      .finally(() => {
        setConfirmEnableLoading(false);
        setOpenConfirmEnable(null);
      })
  }

  const handleConfirmDelete = async (postedJobs) => {
    setConfirmDeleteLoading(true);
    const jobIds = postedJobs.map(job => job._id);
    await axios.post(`http://localhost:8000/api/admin/posted-job/delete`, {
      jobs: jobIds,
    }, {
      withCredentials: true,
    })
      .then(_ => {
        setData(prev => prev.filter(job => !jobIds.includes(job._id)));
        messageApi.success("Xóa công việc thành công!");
      })
      .catch(err => {
        console.log(err);
        const code = err.response.status;
        if (code === 401 || code === 403)
          nav("/login");
        else
          messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
      })
      .finally(() => {
        setConfirmDeleteLoading(false);
        setOpenConfirmDelete(null);
      })
  }

  const getPostedJob = (page, pageSize, hidden = false, pos = "Unknow",) => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/admin/list/posted-job?hidden=${hidden}&page=${page}&size=${pageSize}`, {
      withCredentials: true,
    })
      .then(res => {
        console.log(res.data.jobs, pos);
        setData(res.data.jobs);
        setTableParams({ ...tableParams, pagination: { current: page, pageSize: pageSize, total: res.data.info.total } });
      })
      .catch(err => {
        console.error(err);
        const code = err.response.status;
        if (code === 401 || code === 403)
          nav("/login");
        else
          messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
      })
      .finally(() => setLoading(false))
  }

  const columns = [
    {
      title: "Tên công việc",
      dataIndex: "title",
      sorter: (a, b) => `${a.title}`.localeCompare(`${b.title}`),
      ellipsis: true,
      width: "13%",
    },
    {
      title: "Hạn ứng tuyển",
      dataIndex: "deadlineForSubmission",
      render: (deadlineForSubmission) => {
        const deadline = new Date(deadlineForSubmission);
        const [date, month, year] = [deadline.getDate().toString(), (deadline.getMonth() + 1).toString(), deadline.getFullYear().toString()];
        return `${date.length > 1 ? date : "0" + date}/${month.length > 1 ? month : "0" + month}/${year}`;
      },
      sorter: (a, b) => {
        if (a.deadlineForSubmission && b.deadlineForSubmission)
          return new Date(a.deadlineForSubmission).getTime() - new Date(b.deadlineForSubmission).getTime();
        else if (a.deadlineForSubmission && !b.deadlineForSubmission)
          return -1;
        else return 1;
      },
      align: "center"
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      render: (gender) => <span >
        <Tag color={gender === "male" ? "orange" : (gender === "female" ? "cyan" : "blue")}>
          {gender === "male" ? "Nam" : (gender === "female" ? "Nữ" : "Không yêu cầu")}
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
          text: "Không yêu cầu",
          value: "all",
        },
      ],
      onFilter: (value, record) => record.gender.indexOf(value) === 0,
      align: "center",
      width: "10%",
    },
    {
      title: "Kinh nghiệm",
      dataIndex: "experience",
      ellipsis: true,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center",
    },
    {
      title: "Hình thức",
      dataIndex: "formOfWork",
      ellipsis: true,
    },
    {
      title: "Mức lương",
      dataIndex: "salary",
      ellipsis: true,
    },
    {
      title: "Công ty",
      dataIndex: "company",
      render: (company) => company.name,
      ellipsis: true,
    },
    {
      title: "Hành động",
      render: (record) => (
        <Space size="small" align="start">
          <Tooltip title="Ẩn" placement="topRight">
            <Popconfirm title="Ẩn công việc" description="Bạn chắc chắn muốn ẩn công việc này?" placement="topRight"
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
    getPostedJob(1, 10, false, "PostedJob.jsx");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {contextHolder}
      <ManagementTable
        getData={getPostedJob}
        tableParams={tableParams}
        setTableParams={setTableParams}
        setData={setData}
        columnSearches={["title", "company"]}
        handleConfirmHidden={handleConfirmHidden}
        handleConfirmEnable={handleConfirmEnable}
        handleConfirmDelete={handleConfirmDelete}
        uses={["refresh", "export", "hidden", "enable", "delete"]}
        tabs={[{
          label: "Công việc khả dụng",
          icon: <FaCheckToSlot />,
          title: "Danh sách công việc khả dụng",
          columns: columns,
          loading: loading,
          data: data,
        }, {
          label: "Công việc bị ẩn",
          icon: <MdHideSource />,
          title: "Danh sách công việc bị ẩn",
          columns: [...columns.slice(0, columns.length - 1), {
            title: "Hành động",
            render: (record) => (
              <Space size="small" align="center">
                <Tooltip title="Bỏ ẩn" placement="topRight">
                  <Popconfirm title="Khôi phục công việc" description="Bạn chắc chắn muốn khôi phục công việc này?"
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
                  <Popconfirm title="Hành động không thể khôi phục" description="Bạn chắc chắn muốn xóa vĩnh viễn công việc này?"
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

export default PostedJob;