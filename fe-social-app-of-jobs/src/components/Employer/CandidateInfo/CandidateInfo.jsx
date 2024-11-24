import { Col, ConfigProvider, DatePicker, Input, Modal, Radio, Row } from "antd";

import moment from "moment";

import { BsFiletypeDocx, BsFiletypeDoc } from "react-icons/bs";
import { CiInboxOut } from "react-icons/ci";
import { FaFilePdf } from "react-icons/fa6";
import { MdOutlineMessage } from "react-icons/md";

import styles from "./CandidateInfo.module.css";
import { adminTableThemes } from "../../../helper";
import TextArea from "antd/es/input/TextArea";

const primaryColor = "#00b14f";

function CandidateInfo({ children = null, data, setModalData }) {
  return (
    <ConfigProvider
      theme={{
        components: {
          ...adminTableThemes.components,
          DatePicker: {
            activeBorderColor: primaryColor,
            hoverBorderColor: "#04df67",
          }
        }
      }}
    >
      <Modal
        title={<div className={styles.avatarWrapper}>
          <div className={styles.avatarUpload}>
            <img src={data?.candidate?.member.avatar || "/avatar.png"} className={styles.avatar} alt="Avatar" />
          </div>
        </div>}
        centered
        // maskClosable={true}
        open={data !== null}
        cancelText="Thoát"
        okText={<div style={{ display:"flex", alignItems:"center", gap:"6px" }}><MdOutlineMessage /> Nhắn tin</div>}
        onCancel={() => setModalData(null)}
        width={"90%"}
      >
        <Row gutter={[32, 24]}>
          <Col span={12}>
            <h3 className={styles.heading}>Thông tin cá nhân</h3>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className={styles.info}>
                  <div className={styles.title}>Họ tên:</div>
                  <Input value={data?.candidate?.member.fullName} />
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.info}>
                  <div className={styles.title}>Số điện thoại:</div>
                  <Input value={data?.candidate?.member.tel || "Chưa cập nhật"} />
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.info}>
                  <div className={styles.title}>Giới tính:</div>
                  <Radio.Group size="large" value={data?.candidate?.member.gender || "all"}>
                    <Radio value="male">Nam</Radio>
                    <Radio value="female">Nữ</Radio>
                    <Radio value="all">Chưa cập nhật</Radio>
                  </Radio.Group>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.info}>
                  <div className={styles.title}>Ngày sinh:</div>
                  <DatePicker format={{ format: 'DD-MM-YYYY' }} placeholder="Chưa cập nhật"
                    value={data?.candidate?.member.dob ? moment(data?.candidate?.member.dob) : null}
                  />
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.info}>
                  <div className={styles.title}>Địa chỉ:</div>
                  <Input value={data?.candidate?.member.address || "Chưa cập nhật"} />
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.info}>
                  <div className={styles.title}>Danh sách hồ sơ tải lên:</div>
                  {data?.candidate?.resumes.length > 0
                    ? (<div className={styles.resumes}>
                      <Row gutter={[12, 12]} justify="space-evenly">
                        {data?.candidate?.resumes.map((cv, index) => (
                          <Row key={index} span={12}>
                            <a href={cv.resume} target="_blank" rel="noreferrer" title={cv.name}>
                              <div className={styles.resume}>
                                {cv.name.lastIndexOf(".pdf") >= 0 ? (
                                  <span className={styles.iconPdfFile}><FaFilePdf /></span>
                                ) : (cv.name.lastIndexOf(".docx") >= 0 ? (
                                  <span className={styles.iconDocxFile}><BsFiletypeDocx /></span>
                                ) : (
                                  <span className={styles.iconDocFile}><BsFiletypeDoc /></span>
                                ))}
                                <p className={styles.cvName}>{cv.name}</p>
                              </div>
                            </a>
                          </Row>
                        ))}
                      </Row>
                    </div>)
                    : (<div className={styles.title} style={
                      { textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }
                    }>
                      <span style={{ fontSize: "24px" }} title="Chưa tải lên hồ sơ"><CiInboxOut /></span>
                      <span style={{ fontSize: "12px" }}>Chưa tải hồ sơ nào lên!</span>
                    </div>)}
                </div>
              </Col>
            </Row>
          </Col>

          <Col span={12}>
            <h3 className={styles.heading}>Thông tin ứng tuyển</h3>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className={styles.info}>
                  <div className={styles.title}>Lời nhắn:</div>
                  <TextArea autoSize value={data?.description || "Không có lời nhắn nào!"}></TextArea>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.info}>
                  <div className={styles.title}>Ngày ứng tuyển:</div>
                  <DatePicker format={{ format: 'DD-MM-YYYY' }} placeholder="Ngày ứng tuyển"
                    value={data?.appliedAt ? moment(data?.appliedAt) : null}
                    disabled
                  />
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.info}>
                  <div className={styles.title}>Hồ sơ ứng tuyển:</div>
                  <a href={data?.resume} target="_blank" rel="noreferrer" title="Hồ sơ ứng tuyển">
                    <div className={styles.resume}>
                      {data?.resume?.toString().lastIndexOf(".pdf") >= 0 ? (
                        <span className={styles.iconPdfFile}><FaFilePdf /></span>
                      ) : (data?.resume?.toString().lastIndexOf(".docx") >= 0 ? (
                        <span className={styles.iconDocxFile}><BsFiletypeDocx /></span>
                      ) : (
                        <span className={styles.iconDocFile}><BsFiletypeDoc /></span>
                      ))}
                      <p className={styles.cvName}>Hồ sơ ứng tuyển</p>
                    </div>
                  </a>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </ConfigProvider>
  );
}

export default CandidateInfo;