import { ConfigProvider, message, Modal, Popconfirm, Space, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

import { MdHideSource, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { FaListUl, FaRegPenToSquare } from "react-icons/fa6";
import { QuestionCircleOutlined } from "@ant-design/icons";

import styles from "./PostedJob.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminTable from "../../Admin/AdminTable/AdminTable";
import { adminTableThemes } from "../../../helper";
import ModalPostJob from "../ModalPostJob/ModalPostJob";

function PostedJob() {
  const [searchParams, setSearchParams] = useSearchParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [jobInfo, setJobInfo] = useState(null);
  const [jobCategories, setJobCategories] = useState([]);

  const [openConfirmHidden, setOpenConfirmHidden] = useState(null);
  const [confirmHiddenLoading, setConfirmHiddenLoading] = useState(false);

  const [openConfirmEnable, setOpenConfirmEnable] = useState(null);
  const [confirmEnableLoading, setConfirmEnableLoading] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [messageApi, contextMessageHolder] = message.useMessage();

  const [modal, contextModalHolder] = Modal.useModal();

  const handleModalPostJob = (data) => {
    if (jobInfo.title) {
      setData(prev => prev.map(job => {
        // console.log(job);
        if (job._id === data._id)
          return data;
        return job;
      }));
    } else {
      setData(prev => [{
        ...data,
        categories: jobCategories.filter(cate => data.categories.includes(cate._id))
      }, ...prev]);
    }
  }

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    // console.log(selectedRows);
    setSelectedRows(selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleTableChange = async (pagination, filters, sorter) => {
    if (pagination.current !== tableParams.pagination.current || pagination.pageSize !== tableParams.pagination.pageSize) {
      getPostedJob(1, 10, searchParams.get("hidden") === "true", "PostedJob.jsx")
    }

    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };

  const handleConfirmHiddenSelected = () => {
    if (selectedRows.length) {
      modal.warning({
        title: "Xác nhận ẩn",
        content: "Bạn chắc chắn muốn ẩn tất cả các hàng được chọn!",
        open: openModalConfirm,
        okText: "Xác nhận",
        closable: true,
        onOk: async () => {
          setConfirmLoading(true);
          await handleConfirmHidden(selectedRows);
          setConfirmLoading(false);
          setOpenModalConfirm(false);
        },
        onCancel: () => { if (!confirmLoading) setOpenModalConfirm(false) },
      })
    }
  }

  const handleConfirmEnableSelected = () => {
    if (selectedRows.length) {
      modal.warning({
        title: "Xác nhận khôi phục",
        content: "Bạn chắc chắn muốn khôi phục tất cả các hàng được chọn!",
        open: openModalConfirm,
        okText: "Xác nhận",
        closable: true,
        onOk: async () => {
          setConfirmLoading(true);
          await handleConfirmEnable(selectedRows);
          setConfirmLoading(false);
          setOpenModalConfirm(false);
        },
        onCancel: () => { if (!confirmLoading) setOpenModalConfirm(false) },
      })
    }
  }

  const handleConfirmHidden = async (postedJobs) => {
    setConfirmHiddenLoading(true);
    const jobIds = postedJobs.map(job => job._id);
    await axios.post(`http://localhost:8000/api/company/hidden-job/`, {
      jobs: jobIds,
    }, {
      withCredentials: true,
    })
      .then(_ => {
        setData(prev => prev.filter(job => !jobIds.includes(job._id)));
        messageApi.success("Ẩn công việc thành công!");
      })
      .catch(err => {
        console.log(err);
        messageApi.error(err.response?.data?.message);
      })
      .finally(() => {
        setConfirmHiddenLoading(false);
        setOpenConfirmHidden(null);
        setSelectedRowKeys([]);
      })
  }

  const handleConfirmEnable = async (postedJobs) => {
    setConfirmEnableLoading(true);
    const jobIds = postedJobs.map(job => job._id);
    await axios.post(`http://localhost:8000/api/company/enable-job/`, {
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
        messageApi.error(err.response?.data?.message);
      })
      .finally(() => {
        setConfirmEnableLoading(false);
        setOpenConfirmEnable(null);
        setSelectedRowKeys([]);
      })
  }

  const getPostedJob = (page, pageSize, hidden = false, pos = "Unknow",) => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/company/jobs?hidden=${hidden}&page=${page}&size=${pageSize}`, {
      withCredentials: true,
    })
      .then(res => {
        // console.log(res.data.jobs, pos);
        setData(res.data.jobs);
        setTableParams({ ...tableParams, pagination: { current: page, pageSize: pageSize, total: res.data.info.total } });
      })
      .catch(err => {
        console.error(err);
        messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
      })
      .finally(() => setLoading(false))
  }

  const getAllCategories = () => {
    axios.get("http://localhost:8000/api/job-category/all")
      .then(res => {
        setJobCategories(res.data.categories);
      })
      .catch(err => {
        console.error(err);
        messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
      })
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
      filters: [
        { text: "Chưa có kinh nghiệm", value: "Chưa có kinh nghiệm", },
        { text: "Dưới 1 năm", value: "Dưới 1 năm", },
        { text: "1 năm", value: "1 năm", },
        { text: "2 năm", value: "2 năm", },
        { text: "3 năm", value: "3 năm", },
        { text: "4 năm", value: "4 năm", },
        { text: "5 năm", value: "5 năm", },
        { text: "Trên 5 năm", value: "Trên 5 năm", },
      ],
      onFilter: (value, record) => record.experience.toLowerCase().indexOf(value.toLowerCase()) === 0,
      ellipsis: true,
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      align: "center",
    },
    {
      title: "Hình thức",
      dataIndex: "formOfWork",
      filters: [
        { text: "Toàn thời gian", value: "Toàn thời gian", },
        { text: "Bán thời gian", value: "Bán thời gian", },
        { text: "Thực tập", value: "Thực tập", },
      ],
      onFilter: (value, record) => record.formOfWork.toLowerCase().indexOf(value.toLowerCase()) === 0,
      ellipsis: true,
    },
    {
      title: "Mức lương",
      dataIndex: "salary",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      render: (record) => {
        const deadline = new Date(record.deadlineForSubmission);
        const curr = new Date();
        if (deadline < curr)
          return <span >
            <Tag color="red">
              Quá hạn
            </Tag>
          </span>;
        return <span >
          <Tag color="green">
            {`Còn ${Math.ceil((deadline.getTime() - curr.getTime()) / (1000 * 3600 * 24))} ngày`}
          </Tag>
        </span>;
      },
      filters: [
        {
          text: "Còn hạn",
          value: "valid",
        },
        {
          text: "Quá hạn",
          value: "invalid",
        },
      ],
      onFilter: (value, record) => {
        const deadline = new Date(record.deadlineForSubmission);
        const curr = new Date();
        return value === "valid" ? deadline >= curr : deadline < curr;
      },
      width: "10%",
      align: "center"
    },
    {
      title: "Hành động",
      render: (record) => (
        <Space size="small" align="start">
          {searchParams.get("hidden") === "true" ? (
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
          ) : (
            <>
              <Tooltip title="Chỉnh sửa" placement="topRight">
                <span className={styles.update} onClick={() => setJobInfo(record)}>
                  <FaRegPenToSquare />
                </span>
              </Tooltip>
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
            </>
          )}
          <Tooltip title="Danh sách ứng viên" placement="topRight">
            <span className={styles.listCandidates} onClick={() => {
              nav(`/employer/job/${record._id}/candidates-list?prev=${searchParams.get("hidden") === "true" ? "hidden" : "active"}`);
            }}>
              <FaListUl />
            </span>
          </Tooltip>
        </Space>
      ),
      align: "center",
      width: "10%",
    },
  ];

  useEffect(() => {
    getPostedJob(1, 10, searchParams.get("hidden") === "true", "PostedJob.jsx");
    getAllCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <ConfigProvider theme={adminTableThemes}>
        {contextMessageHolder}
        {contextModalHolder}
        <AdminTable
          title={searchParams.get("hidden") === "true" ? "Danh sách công việc đã đóng" : "Danh sách công việc đang mở"}
          uses={["refresh", searchParams.get("hidden") === "true" ? null : "add", "enable", "hidden"]}
          hidden={searchParams.get("hidden") === "true"}
          columns={columns}
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          data={data}
          tableParams={tableParams}
          onSelectChange={onSelectChange}
          handleTableChange={handleTableChange}
          columnSearches={["title"]}
          handleRefresh={() => getPostedJob(1, 10, searchParams.get("hidden") === "true", "PostedJob.jsx")}
          handleConfirmHiddenSelected={handleConfirmHiddenSelected}
          handleConfirmEnableSelected={handleConfirmEnableSelected}
          handleAddNew={() => setJobInfo({})}
        />

        {jobInfo !== null && jobCategories ? (
          <ModalPostJob
            data={jobInfo}
            categories={jobCategories}
            setModalData={setJobInfo}
            handleModalPostJob={handleModalPostJob}
            apiUpdate={jobInfo.title
              ? `http://localhost:8000/api/employer/job/${jobInfo._id}`
              : "http://localhost:8000/api/company/post-job"
            }
            messageApi={messageApi}
          ></ModalPostJob>
        ) : <></>}
      </ConfigProvider>
    </>
  );
}

export default PostedJob;