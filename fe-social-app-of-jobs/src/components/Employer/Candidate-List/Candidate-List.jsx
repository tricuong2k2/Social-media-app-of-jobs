import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Avatar, Button, message, Space, Table, Tooltip } from 'antd';

import axios from 'axios';

import { AiOutlineUser } from "react-icons/ai";
import { LoadingOutlined } from "@ant-design/icons";
import { FaEye } from "react-icons/fa6";
import { BsFiletypeDocx, BsFiletypeDoc } from "react-icons/bs";
import { FaFilePdf } from "react-icons/fa6";
import { IoReturnDownBackOutline } from "react-icons/io5";

import styles from './Candidate-List.module.css';
import CandidateInfo from '../CandidateInfo/CandidateInfo';
import { MdRefresh } from 'react-icons/md';

function CandidateList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { jobId } = useParams();
  const nav = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [candidateInfo, setCandidateInfo] = useState(null);

  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  // const handleViewDetails = (candidate) => {
  //   nav('/employer/candidate-profile', { state: { candidate } });
  // };

  const getCandidatesApplied = () => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/employer/job/applied/${jobId}`, {
      withCredentials: true,
    })
      .then(res => {
        // console.log(res.data);
        setCandidates(res.data.applications);
      })
      .catch(err => {
        console.error(err);

        const code = err?.response?.status;
        if (400 <= code && code < 500)
          nav("/login");
        else
          messageApi.error(err.response.data.toString());
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getCandidatesApplied();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    {
      title: "Avatar",
      dataIndex: ["candidate", "member", "avatar"],
      render: (avatar) => <div style={{ textAlign: "center" }}>
        <Avatar
          size="small"
          shape="square"
          src={avatar}
          icon={avatar ? null : <AiOutlineUser />}
        />
      </div>,
      width: "8%",
      align: "center",
    },
    {
      title: "Họ tên",
      dataIndex: ["candidate", "member", "fullName"],
      sorter: (a, b) => `${a.candidate.member.fullName}`.localeCompare(`${b.candidate.member.fullName}`),
      key: "name",
    },
    {
      title: "Email",
      dataIndex: ["candidate", "member", "email"],
      key: "email",
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Ngày ứng tuyển",
      dataIndex: "appliedAt",
      render: (appliedAt) => {
        const dob = new Date(appliedAt);
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
      key: "appliedAt",
    },
    {
      title: "Hồ sơ ứng tuyển",
      dataIndex: "resume",
      key: "cv",
      render: (resume) => (
        <a href={resume} target="_blank" rel="noreferrer" title="CV ứng tuyển">
          <div className={styles.resume}>
            {resume?.toString().lastIndexOf(".pdf") >= 0 ? (
              <span className={styles.iconPdfFile}><FaFilePdf /></span>
            ) : (resume?.toString().lastIndexOf(".docx") >= 0 ? (
              <span className={styles.iconDocxFile}><BsFiletypeDocx /></span>
            ) : (
              <span className={styles.iconDocFile}><BsFiletypeDoc /></span>
            ))}
            <p className={styles.cvName}>Hồ sơ ứng tuyển</p>
          </div>
        </a>
      ),
      align: "center",
      ellipsis: true,
    },
    {
      title: "Xem",
      render: (record) => (
        <Space align="center">
          <Tooltip title="Xem chi tiết">
            <span className={styles.viewDetail} onClick={() => setCandidateInfo(record)}>
              <FaEye />
            </span>
          </Tooltip>
        </Space>
      ),
      align: "center",
      width: "10%",
    }
  ]

  return (
    <div className={styles.candidateList}>
      {contextHolder}
      {/* <button className={styles.backButton} onClick={() => nav('/employer/posted-jobs')}>← Quay lại</button> */}
      <Table
        title={() => (
          <div className={styles.titleWrapper}>
            <h3 className={styles.heading}>Danh sách ứng viên đã nộp hồ sơ</h3>
            <div className={styles.back} title="Quay lại" onClick={() => {
              if (searchParams.get("prev") === "hidden")
                nav("/employer/posted-jobs?hidden=true");
              else
                nav("/employer/posted-jobs?hidden=false");
            }}><IoReturnDownBackOutline /></div>
            <div className={styles.refresh} title="Quay lại">
              <Tooltip title="Làm mới" >
                <Button
                  icon={<MdRefresh />}
                  shape="circle"
                  onClick={getCandidatesApplied}
                />
              </Tooltip>
            </div>
          </div>
        )}
        columns={columns}
        dataSource={candidates}
        pagination={false}
        loading={{
          spinning: loading,
          indicator: <LoadingOutlined style={{ color: "#01be56" }} spin />
        }}
      />

      {
        candidateInfo && <CandidateInfo
          data={candidateInfo}
          setModalData={setCandidateInfo}
        ></CandidateInfo>
      }
    </div>
  );
}

export default CandidateList;
