import React from 'react';
import styles from './Job-Detail.module.css';
import { useNavigate } from 'react-router-dom';

function JobDetail() {

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/employer/companyjob');
  };
  return (
    <div>
      <div className={styles.header}>
      <div className={styles.jobActions}>
          <button className={styles.editButton} onClick={() => navigate('/employer/companyjob-edit')} >Sửa</button>
          <button className={styles.deleteButton}>Đóng</button> 
        </div>
        {/* Chỗ này cho trạng thái đóng hoặc mở */}
        <button className={styles.backButton} onClick={handleBackClick}>← Quay lại</button>
        
      </div>
    <div className={styles.container}>
      <div className={styles.jobDetailContainer}>
        <div className={styles.jobHeader}>
          <h1>Nhân Viên Kinh Doanh (Hà Đông) - Thu Nhập Lên Đến 25 Triệu</h1>
          <div className={styles.jobInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Mức lương:</span>
              <span>8 - 25 triệu</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Địa điểm:</span>
              <span>Hà Nội</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Kinh nghiệm:</span>
              <span>Không yêu cầu kinh nghiệm</span>
            </div>
            
          </div>
          <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Hạn nộp hồ sơ:</span>
              <span>11/08/2024</span>
            </div>
        </div>
        <div className={styles.jobSection}>
          <h2>Chi tiết tin tuyển dụng</h2>
          <h3>Mô tả công việc</h3>
          <ul>
            <li>
              Tìm kiếm khách hàng, tư vấn các sản phẩm của công ty tới khách hàng. Báo giá, đàm phán, ký kết và triển khai hợp đồng.
              Chăm sóc các khách hàng, đối tác đã và đang sử dụng sản phẩm của công ty.
              Thực hiện các công việc khác theo yêu cầu của cấp trên/người quản lý trực tiếp trên cơ sở phù hợp với công việc chung của công ty.
            </li>
          </ul>
          <h3>Yêu cầu ứng viên</h3>
          <ul>
            <li>Tốt nghiệp cao đẳng trở lên
              Có kỹ năng giao tiếp, nhanh nhẹn, trung thực, có tinh thần trách nhiệm cao, kỷ luật tốt.
              Sử dụng thành thạo máy vi tính, word, excel, Power Point,...</li>
          </ul>
          <h3>Quyền lợi</h3>
          <ul>
            <li>Mức lương: lương cứng từ 5-8 triệu + phụ cấp + % doanh số + thưởng. Thử việc 2 tháng hưởng 85% lương + % doanh số (nếu có).</li>
          </ul>
          <h3>Địa điểm làm việc</h3>
          <ul>
            <li>Hồ Chí Minh: 113 Kinh Dương Vương, Phường 12, Quận 6, Quận 6</li>
          </ul>
          <h3>Thời gian làm việc</h3>
          <ul>
            <li>Thứ 2 - Thứ 7 (từ 08:30 đến 17:30)</li>
          </ul>
          <h3>Cách thức ứng tuyển</h3>
          <ul>
            <li>Ứng viên nộp hồ sơ trực tuyến bằng cách bấm Ứng tuyển ngay dưới đây.</li>
          </ul>

        </div>
      </div>
      <div className={styles.rightPanel}>
      <div className={styles.jobDetail1}>
          <div className={styles.jobSection}>
            <h2>Tiến độ</h2>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Số lượng người ứng tuyển:</span>
              <span>10/100</span>
            </div>
            <div className={styles.infoItem}>
            <a href="#" onClick={() => navigate('/employer/candidate-list')} className={styles.companyLink}>Xem Danh Sách Ứng Viên</a>
            </div>
          </div>
        </div>
      <div className={styles.jobDetail0}>
          <div className={styles.jobSection}>
            <h2>Thông tin chung</h2>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Cấp bậc:</span>
              <span>Nhân viên</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Kinh nghiệm:</span>
              <span>Không yêu cầu kinh nghiệm</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Số lượng tuyển:</span>
              <span>5 người</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Hình thức làm việc:</span>
              <span>Toàn thời gian</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Giới tính:</span>
              <span>Không yêu cầu</span>
            </div>
            <div className={styles.infoItem1}>
              <div className={styles.infoLabel1}>Ngành nghề:</div>
              <span>Không yêu cầu</span>
              <span>Không yêu cầu</span>
              <span>Không yêu cầu</span>
              <span>Không yêu cầu</span>
            </div>
          </div>
        </div>
        

        <div className={styles.jobDetail2}>
          <div className={styles.companyInfo}>
            <h2>Thông tin công ty</h2>
            <img src="/logo512.png" alt="Company Logo" className={styles.companyLogo} />
            <p><strong>Công ty cổ phần giải pháp và thiết bị VHB Việt Nam</strong></p>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Quy mô:</span>
              <span>10-24 nhân viên</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Địa điểm:</span>
              <span>Số 6/59/195 Đường Trần Cung, Tổ dân phố Hoàng 9,...</span>
            </div>
            <div className={styles.infoItem}>
            <a href="#" onClick={() => navigate('/employer/company-profile')} className={styles.companyLink}>Xem Trang Công Ty</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

  );
}

export default JobDetail;
