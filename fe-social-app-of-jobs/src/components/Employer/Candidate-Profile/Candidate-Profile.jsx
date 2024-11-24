import React from 'react';
import styles from './Candidate-Profile.module.css';
import { useNavigate } from 'react-router-dom';


function CandidateProfile() {

  const navigate = useNavigate();


  return (
    // <div className={styles.profileContainer}>
    //   <h2>Chi tiết ứng viên</h2>
    //   <img src="/logo512.png" alt="Applicant" className={styles.photo} />
    //   <p><strong>Họ tên:</strong> hahaha</p>
    //   <p><strong>Số điện thoại:</strong> 34343434</p>
    //   <p><strong>Email:</strong> sfsdfsdfsdf</p>
    //   <a href="/logo512.png" download className={styles.downloadButton}>Tải xuống CV</a>
    // </div>
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate('/employer/candidate-list')}>← Quay lại</button>
      <div className={styles.tittle} >Chi tiết ứng viên</div>
            <div className={styles.header}>
                <img
                    src="/3.jpg"
                    alt="Company Logo"
                    className={styles.logo}
                />
                <h1 className={styles.Name}>Ptit</h1>
            </div>
            <div className={styles.details}>
                <div>
                    <span className={styles.Gender}>Giới tính: </span>
                    <span>Nam</span>
                </div>      
                <div>
                    <span className={styles.Dob}>Ngày Sinh: </span>
                    <span>11/04/2000</span>
                </div>
                <div>
                    <span className={styles.Address}>Địa Chỉ: </span>
                    <span>hà Nội</span>
                </div>        
                <div>
                    <span className={styles.PhoneNumber}>Số điện thoại: </span>
                    <span>123</span>
                </div>
                <div>
                    <span className={styles.Email}>Email: </span>
                    <span>a@gmail.com</span>
                </div>
                <div>
                  <a href="/logo512.png" download className={styles.downloadButton}>Tải xuống CV</a>
                </div>
            </div>
        </div>
  );
}

export default CandidateProfile;
