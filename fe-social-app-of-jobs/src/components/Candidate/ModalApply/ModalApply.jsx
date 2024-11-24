import { Col, Modal, Row, Space, Upload } from "antd";

import { RiFolderUserFill } from "react-icons/ri";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaPenNib } from "react-icons/fa6";

import styles from "./ModalApply.module.css";
import Radio from "antd/es/radio/radio";
import { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

function ModalApply({ title, open = false, setOpenModalApply, messageApi, jobId }) {
  const nav = useNavigate();
  const [typeResume, setTypeResume] = useState("upladed-resume");
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [chooseCV, setChooseCV] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [message, setMessage] = useState("");


  const handleChangeTypeResume = (e) => {
    setTypeResume(e.target.value);
  };

  const handleChooseCVUploaded = (e) => {
    setChooseCV(e.target.dataset.name);
  }

  const handleApplyForJob = async () => {
    if (!fileUpload && !chooseCV) {
      messageApi.error("Bạn chưa chọn hồ sơ để ứng tuyển");
      return;
    }
    if (typeResume === "upladed-resume") {
      if (!chooseCV) {
        messageApi.error("Bạn chưa chọn hồ sơ để ứng tuyển");
        return;
      }
      await axios.post("http://localhost:8000/api/application/apply/uploaded-resume", {
        job: jobId,
        resume: chooseCV,
        description: message,
      }, {
        withCredentials: true,
      })
        .then(_ => messageApi.success("Bạn đã ứng tuyển thành công công việc này"))
        .catch(err => {
          console.error(err);

          const code = err?.response?.status;
          if (code === 401 || code === 403)
            nav("/login");
          else
            messageApi.error(err.response.data?.message || err.response.data.toString());
        })
    } else {
      if (!fileUpload) {
        messageApi.error("Bạn chưa chọn hồ sơ để ứng tuyển");
        return;
      }
      await axios.post("http://localhost:8000/api/application/apply/new-resume", {
        job: jobId,
        file: fileUpload,
        description: message,
      }, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
        .then(_ => messageApi.success("Bạn đã ứng tuyển thành công công việc này"))
        .catch(err => {
          console.error(err);

          const code = err?.response?.status;
          if (code === 401 || code === 403)
            nav("/login");
          else
            messageApi.error(err.response.data?.message || err.response.data.toString());
        })
    }
  }

  const beforeUpload = (file) => {
    if (!file.type.match(/pdf|docx|doc/))
      messageApi.error("Bạn chỉ có thể tải lên file có định dạng .doc, .docx, pdf!");
    else
      setFileUpload(file);
  }

  useEffect(() => {
    axios.get("http://localhost:8000/api/candidate/info/", {
      withCredentials: true,
    })
      .then(res => {
        const candidate = res.data.info;
        console.log(candidate);
        setCandidateInfo({
          uid: candidate._id,
          resumes: candidate.resumes,
          education: candidate.education,
          ...candidate.member,
        })
      })
      .catch(err => {
        console.error(err);

        const code = err?.response?.status;
        if (400 <= code && code < 500)
          nav("/login");
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Modal
        title={<div className={styles.heading}>
          <h3>Ứng tuyển <span className={styles.title}>{title}</span></h3>
        </div>}
        width={648}
        cancelText="Hủy"
        okText="Nộp hồ sơ ứng tuyển"
        centered
        open={open}
        maskClosable={false}
        onCancel={() => setOpenModalApply(false)}
        onOk={handleApplyForJob}
      >
        <div className={styles.applyFormWrapper}>
          <div className={styles.chooseCV}>
            <div className={styles.title}>
              <span className={styles.titleIcon}><RiFolderUserFill /></span>
              <h4>Chọn CV để ứng tuyển</h4>
            </div>
            <div>
              <Radio.Group defaultValue={typeResume} >
                <Space direction="vertical" onChange={handleChangeTypeResume}>
                  <Radio value={"upladed-resume"}>Chọn CV trong thư viện CV của tôi</Radio>
                  <Radio value={"new-resume"}>Tải lên CV</Radio>
                </Space>
              </Radio.Group>
            </div>
            <div className={styles.cvWrapper}>
              {typeResume === "upladed-resume" ? (
                <div className={styles.resumesUploaded}>
                  {(candidateInfo?.resumes || []).map((resume, index) => (
                    <div className={clsx([styles.itemResume, chooseCV === resume.name ? styles.choose : null])}
                      key={index} data-name={resume.name}
                      onClick={handleChooseCVUploaded}
                    >
                      {resume.name.substring(resume.name.indexOf("-") + 1)}
                      <a href={resume.resume} target="_blank" rel="noreferrer"
                        className={styles.viewResume} onClick={(e) => e.stopPropagation()}
                      >Xem</a>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <Upload
                    // listType="text"
                    className={styles.avatarUploader}
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    maxCount={1}
                    showUploadList={false}
                    customRequest={() => { }}
                    beforeUpload={beforeUpload}
                  >
                    <div className={styles.contentUpload}>
                      <Row justify="center" align="middle">
                        <Col span={4}>
                          <span className={styles.iconUpload}><FaCloudUploadAlt /></span>
                        </Col>
                        <Col span={15}>
                          <strong>Tải lên CV từ máy tính, chọn hoặc kéo thả</strong>
                        </Col>
                        <Col span={24}>
                          <div style={{ textAlign: "center" }}>Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5MB</div>
                        </Col>
                      </Row>
                    </div>
                  </Upload>
                  {fileUpload && <div className={styles.fileUploaded}>
                    {fileUpload.name}
                  </div>}
                </>
              )}
            </div>
          </div>
          <div className={styles.description}>
            <div className={styles.title}>
              <span className={styles.titleIcon}><FaPenNib /></span>
              <h4>Thư giới thiệu</h4>
            </div>
            <span className={styles.hint}>Một thư giới thiệu ngắn gọn, chỉnh chu sẽ giúp bạn trở nên chuyên nghiệp và gây ấn tượng hơn với nhà tuyển dụng.</span>
            <TextArea rows={10}
              onChange={(e) => setMessage(e.target.value)}
            ></TextArea>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalApply;