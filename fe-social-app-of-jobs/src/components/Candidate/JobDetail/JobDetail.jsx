import { Button, Col, ConfigProvider, message, Row, Space, Spin } from "antd";

import { LoadingOutlined } from '@ant-design/icons';
import { BiSolidGroup } from "react-icons/bi";
import { FaClock, FaHourglassHalf, FaLocationDot, FaRegHeart, FaTransgender } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { IoOpenOutline } from "react-icons/io5";
import { LuBox } from "react-icons/lu";
import { MdAttachMoney, MdOutlineWorkOutline, MdStars } from "react-icons/md";

import axios from "axios";

import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { adminTableThemes } from "../../../helper/themes";
import ModalApply from "../ModalApply/ModalApply";
import styles from "./JobDetail.module.css";

const getDate = (date) => {
  const dob = new Date(date);
  const [dat, month, year] = [dob.getDate().toString(), (dob.getMonth() + 1).toString(), dob.getFullYear().toString()];
  return `${dat.length > 1 ? dat : "0" + dat}/${month.length > 1 ? month : "0" + month}/${year}`;
}

const getAddress = (address) => {
  return `${address.detail || "Không xác định"}, ${address.ward}, ${address.district}, ${address.province}`;
}

const primaryColor = "#00b14f";

function JobDetail() {
  const { jobId } = useParams();

  const candidate = useSelector(state => state.memberReducer);

  const [jobInfo, setJobInfo] = useState(null);
  const [openModalApply, setOpenModalApply] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [saving, setSaving] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);


  const items = [
    {
      icon: <MdStars />,
      label: "Cấp bậc",
      value: jobInfo?.level,
    },
    {
      icon: <FaHourglassHalf />,
      label: "Kinh nghiệm",
      value: jobInfo?.experience,
    },
    {
      icon: <BiSolidGroup />,
      label: "Số lượng tuyển",
      value: jobInfo?.quantity,
    },
    {
      icon: <MdOutlineWorkOutline />,
      label: "Hình thức làm việc",
      value: jobInfo?.formOfWork,
    },
    {
      icon: <FaTransgender />,
      label: "Giới tính",
      value: jobInfo?.gender === "male" ? "Nam" : (jobInfo?.gender === "female" ? "Nữ" : "Không yêu cầu"),
    }
  ]

  const getDetailJobInfo = async () => {
    await axios.get(`http://localhost:8000/api/job/info/${jobId}`)
      .then(res => {
        // console.log(res.data.info);
        setJobInfo(res.data.info);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const checkIfJobIsSaved = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/candidate/all-saved-jobs', {
        withCredentials: true
      });
      setSavedJobs(res.data.savedJobs);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getDetailJobInfo();
    if (candidate.role) {
      checkIfJobIsSaved();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveJob = async () => {
    if (savedJobs.some(job => job.jobId === jobId)) {
      messageApi.info('Bạn đã lưu tin này rồi.');
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/candidate/save-job/', { jobId }, {
        withCredentials: true
      });
      messageApi.success('Lưu công việc thành công!');
      setSavedJobs([...savedJobs, { jobId }]);
    } catch (error) {
      console.error(error);
      messageApi.error('Có lỗi xảy ra khi lưu công việc.');
    }
  }

  return (
    <>
      <ConfigProvider theme={adminTableThemes}>
        {contextHolder}
        {
          jobInfo ? (
            <div className={styles.viewDetailJob}>
              <div className={styles.detailWrapper}>
                <Row gutter={[24, 24]}>
                  <Col span={16}>
                    <Row gutter={[24, 24]}>
                      <Col span={24}>
                        <div className={styles.generalInfo}>
                          <div className={styles.title}>
                            <h2>{jobInfo?.title}</h2>
                          </div>
                          <Row gutter={[12, 12]}>
                            <Col span={8}>
                              <div className={styles.item}>
                                <div className={styles.icon}><MdAttachMoney /></div>
                                <div className={styles.salary}>
                                  <span className={styles.label}>Mức lương</span>
                                  <span className={styles.value}>{jobInfo?.salary}</span>
                                </div>
                              </div>
                            </Col>
                            <Col span={8}>
                              <div className={styles.item}>
                                <div className={styles.icon}><FaLocationDot /></div>
                                <div className={styles.location}>
                                  <span className={styles.label}>Địa điểm</span>
                                  <span className={styles.value}>{jobInfo ? jobInfo.locations[0].province : ""}</span>
                                </div>
                              </div>
                            </Col>
                            <Col span={8}>
                              <div className={styles.item}>
                                <div className={styles.icon}><FaHourglassHalf /></div>
                                <div className={styles.experience}>
                                  <span className={styles.label}>Kinh nghiệm</span>
                                  <span className={styles.value}>{jobInfo?.experience}</span>
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <div className={styles.expSumbitCV}>
                            <Space>
                              <span className={styles.timeSubIcon}><FaClock /></span>
                              <span>Hạn nộp hồ sơ: {jobInfo?.deadlineForSubmission && getDate(jobInfo.deadlineForSubmission)}</span>
                            </Space>
                          </div>
                          {candidate.role ? (
                            <div className={styles.actions}>
                              <Button type="primary" icon={<FiSend />} size="large" className={styles.btnApply}
                                onClick={() => setOpenModalApply(true)}
                              >Ứng tuyển ngay</Button>
                              <ConfigProvider theme={{
                                components: {
                                  Button: {
                                    defaultBorderColor: primaryColor,
                                    defaultColor: primaryColor
                                  }
                                }
                              }}>
                                <Button icon={<FaRegHeart />} size="large" className={styles.btnSave} onClick={handleSaveJob}>Lưu tin</Button>
                              </ConfigProvider>
                            </div>
                          ) : (<></>)}
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className={styles.detailInfo}>
                          <h2 className={styles.heading}>Chi tiết tuyển dụng</h2>
                          <div className={styles.description}>
                            <h3 className={styles.title}>Mô tả công việc</h3>
                            <TextArea className={styles.areaDisplay} value={jobInfo?.description} autoSize readOnly />
                          </div>
                          <div className={styles.candidateRequirements}>
                            <h3 className={styles.title}>Yêu cầu ứng viên</h3>
                            <TextArea className={styles.areaDisplay} value={jobInfo?.candidateRequirements} autoSize readOnly />
                          </div>
                          <div className={styles.rights}>
                            <h3 className={styles.title}>Quyền lợi</h3>
                            <TextArea className={styles.areaDisplay} value={jobInfo?.rights} readOnly autoSize />
                          </div>
                          <div className={styles.locations}>
                            <h3 className={styles.title}>Địa điểm làm việc</h3>
                            {jobInfo?.locations.map((location, index) => (
                              <p key={index}>- {getAddress(location)}</p>
                            ))}
                          </div>
                          {candidate.role ? (
                            <>
                              <div className={styles.description}>
                                <h3 className={styles.title}>Cách thức ứng tuyển</h3>
                                <p>Ứng viên nộp hồ sơ trực tuyến bằng cách bấm <strong>Ứng tuyển</strong> ngay dưới đây.</p>
                              </div>
                              <div className={styles.actions}>
                                <p className={styles.deadlineForSubmission}>Hạn nộp hồ sơ: {getDate(jobInfo?.deadlineForSubmission)}</p>
                                <Space size={"large"}>
                                  <Button type="primary" size="large" className={styles.btnApply}
                                    onClick={() => setOpenModalApply(true)}
                                  >Ứng tuyển ngay</Button>
                                  <ConfigProvider theme={{
                                    components: {
                                      Button: {
                                        defaultBorderColor: primaryColor,
                                        defaultColor: primaryColor
                                      }
                                    }
                                  }}>
                                    <Button
                                      size="large"
                                      className={styles.btnSave}
                                      onClick={handleSaveJob}
                                      loading={saving}
                                    >
                                      Lưu tin
                                    </Button>
                                  </ConfigProvider>
                                </Space>
                              </div>
                            </>
                          ) : (<></>)}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row gutter={[24, 24]}>
                      <Col span={24}>
                        <div className={styles.companyInfo}>
                          <Row gutter={[0, 16]}>
                            <Col span={8}>
                              <div className={styles.logoCompany}>
                                <img src={jobInfo.company.logo} alt="Logo Company" />
                              </div>
                            </Col>
                            <Col span={16}>
                              <h3>{jobInfo.company.name}</h3>
                            </Col>
                            <Col span={24}>
                              <Row gutter={[12, 12]}>
                                <Col span={24}>
                                  <div className={styles.infoCompanyWrapper}>
                                    <span className={styles.infoItem}><BiSolidGroup /> Quy mô:</span>
                                    <span className={styles.value}>{jobInfo.company.companySize} nhân viên</span>
                                  </div>
                                </Col>
                                <Col span={24}>
                                  <div className={styles.infoCompanyWrapper}>
                                    <span className={styles.infoItem}><LuBox /> Lĩnh vực:</span>
                                    <span className={styles.value}>{jobInfo.company?.field || "Không xác định"}</span>
                                  </div>
                                </Col>
                                <Col span={24}>
                                  <div className={styles.infoCompanyWrapper}>
                                    <span className={styles.infoItem}><FaLocationDot /> Địa chỉ:</span>
                                    <span className={styles.value}
                                      title={getAddress(jobInfo.company.address)}
                                    >
                                      {getAddress(jobInfo.company.address)}
                                    </span>
                                  </div>
                                </Col>
                                <Col span={24}>
                                  <div className={styles.website}>
                                    <a href={jobInfo.company.website} target="_blank" rel="noreferrer">
                                      Xem trang công ty <IoOpenOutline />
                                    </a>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className={styles.jobInfo}>
                          <h2 className={styles.heading}>Thông tin chung</h2>
                          {items.map((item, index) => (
                            <div className={styles.item} key={index}>
                              <div className={styles.icon}>{item.icon}</div>
                              <div className={styles.salary}>
                                <span className={styles.label}>{item.label}</span>
                                <span className={styles.value}>{item.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className={styles.extraInfo}>
                          <h2 className={styles.heading}>Ngành nghề</h2>
                          <Row gutter={[8, 18]}>
                            {jobInfo?.categories.map((category, index) => (
                              <Col key={index}><span className={styles.jobCategory}>{category.category}</span></Col>
                            ))}
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          ) : (<Spin spinning fullscreen
            indicator={<LoadingOutlined
              style={{
                fontSize: 48,
                color: primaryColor
              }}
              spin
            />}
          />)
        }
        {openModalApply && <ModalApply
          title={jobInfo?.title}
          open={openModalApply}
          setOpenModalApply={setOpenModalApply}
          messageApi={messageApi}
          jobId={jobId}
        ></ModalApply>}
      </ConfigProvider>
    </>
  );
}

export default JobDetail;