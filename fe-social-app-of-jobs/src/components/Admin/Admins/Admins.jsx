import { Avatar, message, Tag } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

import { AiOutlineUser } from "react-icons/ai";
import { FaUserShield } from "react-icons/fa";

import ManagementTable from "../ManagementTable/ManagementTable";
import { useNavigate } from "react-router-dom";

function Admins() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [messageApi, contextHolder] = message.useMessage();

  const getAdmins = (page, pageSize, hidden = false, pos = "Unknow", ) => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/admin/list/admin?hidden=${hidden}&page=${page}&size=${pageSize}`, {
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
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      sorter: (a, b) => `${a.fullName}`.localeCompare(`${b.fullName}`),
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
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      render: (address) => address || <Tag color="blue">Chưa cập nhật</Tag>,
      ellipsis: true,
    },
  ];

  useEffect(() => {
    getAdmins(1, 10, false, "Admins.jsx");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      { contextHolder }
      <ManagementTable 
        getData={getAdmins}
        setData={setData}
        tableParams={tableParams}
        setTableParams={setTableParams}
        isRowSelection={false}
        uses={["refresh", "export"]}
        tabs={[{
          label: "Quản trị viên",
          icon: <FaUserShield />,
          title: "Danh sách quản trị viên",
          columns: columns,
          loading: loading,
          data: data,
        },]}
      />
    </>
  );
}

export default Admins;