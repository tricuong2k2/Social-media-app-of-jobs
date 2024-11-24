import React from 'react';
import styles from './Job-Post.module.css';
import { useNavigate } from 'react-router-dom';
import { Col, Form, Input, Radio, Row } from "antd";
import Address from "../../Address/Address";
import axios from "axios";
import { useEffect, useState } from "react";
import { Select } from "antd";




function AddJob() {
  const navigate = useNavigate();
  
  // State for form fields
  const [title, setTitle] = useState('');
  const [salaryType, setSalaryType] = useState('range'); // 'range' or 'option'
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [salaryOption, setSalaryOption] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [deadline, setDeadline] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [workTime, setWorkTime] = useState('');
  const [applicationMethod, setApplicationMethod] = useState('');
  const [level, setLevel] = useState('');
  const [numberOfVacancies, setNumberOfVacancies] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [gender, setGender] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);


  const handleCategoryChange = (value) => {
    setSelectedCategories(value);
  };
  


  const handleSave = () => {

    navigate('/job-list');
  };

  useEffect(() => {
    axios.get("https://vapi.vnappmob.com/api/province/")
      .then(res => {
        const cities = res.data.results.map((city, index) => ({
          id: index,
          key: city.province_id,
          label: city.province_name,
          value: city.province_name,
        }));

        setCities(cities);
      })
  }, []);

  const handleSelectCitites = (_, option) => {
    setDistricts([]);
    setWards([]);
    axios.get(`https://vapi.vnappmob.com/api/province/district/${option.key}`)
      .then(res => {
        const districts = res.data.results.map((district, index) => ({
          id: index,
          key: district.district_id,
          label: district.district_name,
          value: district.district_name,
        }))

        setDistricts(districts);
      })
      .catch(err => console.error(err))
  }

  const handleSelectDistricts = (_, option) => {
    setWards([]);
    axios.get(`https://vapi.vnappmob.com/api/province/ward/${option.key}`)
      .then(res => {
        const wards = res.data.results.map((ward, index) => ({
          id: index,
          key: ward.ward_id,
          label: ward.ward_name,
          value: ward.ward_name,
        }))

        setWards(wards);
      })
  }


  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  return (
    <div className={styles.container}>
      <h1>Thêm công việc mới</h1>
      <div className={styles.formGroup}>
        <label className={styles.label}>Tiêu đề công việc</label>
        <input
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Mức lương</label>
        <div>
          <input
            type="radio"
            id="range"
            name="salaryType"
            value="range"
            checked={salaryType === 'range'}
            onChange={(e) => setSalaryType(e.target.value)}
          />
          <label htmlFor="range">Nhập từ ... đến ...</label>
          <input
            className={styles.input}
            type="number"
            placeholder="Từ"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            disabled={salaryType === 'option'}
          />
          <input
            className={styles.input}
            type="number"
            placeholder="Đến"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            disabled={salaryType === 'option'}
          />
        </div>
        <div>
          <input
            type="radio"
            id="option"
            name="salaryType"
            value="option"
            checked={salaryType === 'option'}
            onChange={(e) => setSalaryType(e.target.value)}
          />
          <label htmlFor="option">Chọn mức lương</label>
          <select
            className={styles.input}
            value={salaryOption}
            onChange={(e) => setSalaryOption(e.target.value)}
            disabled={salaryType === 'range'}
          >
            <option value="">Chọn mức lương</option>
            <option value="Dưới 10 triệu">Dưới 10 triệu</option>
            <option value="10-15 triệu">10-15 triệu</option>
            <option value="15-20 triệu">15-20 triệu</option>
            <option value="20-25 triệu">20-25 triệu</option>
            <option value="25-30 triệu">25-30 triệu</option>
            <option value="30-50 triệu">30-50 triệu</option>
            <option value="Trên 50 triệu">Trên 50 triệu</option>
            <option value="Thỏa thuận">Thỏa thuận</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Địa điểm</label>
        <input
          className={styles.input}
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <Row gutter={[32, 0]}>
        <Col lg={12}>
          <Address
            label="Địa điểm làm việc"
            type="province" size="large" 
            options={cities}
            message="Vui lòng chọn tỉnh/thành phố làm việc"
            placeholder="Chọn tỉnh/thành phố"
            onSelect={handleSelectCitites}
          />
        </Col>
        <Col lg={12}>
          <Address
            label="Quận/huyện"
            type="district" size="large"
            options={districts} 
            message="Vui lòng chọn quận/huyện làm việc"
            placeholder="Chọn quận/huyện"
            onSelect={handleSelectDistricts}
          />
        </Col>
        <Col lg={12}>
          <Address
            label="Xã/phường"
            type="ward" size="large"
            options={wards}
            message="Vui lòng chọn xã/phường làm việc"
            placeholder="Chọn xã/phường"
          />
        </Col>
      </Row>

      <div className={styles.formGroup}>
        <label className={styles.label}>Kinh nghiệm</label>
        <select
          className={styles.input}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="">Chọn kinh nghiệm</option>
          <option value="Chưa có kinh nghiệm">Chưa có kinh nghiệm</option>
          <option value="Dưới 1 năm">Dưới 1 năm</option>
          <option value="1 năm">1 năm</option>
          <option value="2 năm">2 năm</option>
          <option value="3 năm">3 năm</option>
          <option value="4 năm">4 năm</option>
          <option value="5 năm">5 năm</option>
          <option value="Trên 5 năm">Trên 5 năm</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Ngành Nghề</label>
        <Select
          mode="multiple"
          className={styles.input}
          placeholder="Chọn danh mục"
          value={selectedCategories}
          onChange={setSelectedCategories}
          options={[
            { value: '1', label: 'Danh mục 1' },
            { value: '2', label: 'Danh mục 2' },
            { value: '3', label: 'Danh mục 3' },
            { value: '4', label: 'Danh mục 4' },
            { value: '5', label: 'Danh mục 5' },
            { value: '6', label: 'Danh mục 6' },
            { value: '7', label: 'Danh mục 7' },
          ]}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Hạn nộp hồ sơ</label>
        <input
          className={styles.input}
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Mô tả công việc</label>
        <textarea
          className={styles.textarea}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Yêu cầu ứng viên</label>
        <textarea
          className={styles.textarea}
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Quyền lợi</label>
        <textarea
          className={styles.textarea}
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Địa điểm làm việc</label>
        <textarea
          className={styles.textarea}
          value={workLocation}
          onChange={(e) => setWorkLocation(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Thời gian làm việc</label>
        <textarea
          className={styles.textarea}
          value={workTime}
          onChange={(e) => setWorkTime(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Cách thức ứng tuyển</label>
        <textarea
          className={styles.textarea}
          value={applicationMethod}
          onChange={(e) => setApplicationMethod(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Cấp bậc</label>
        <select
          className={styles.input}
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">Chọn cấp bậc</option>
          <option value="Thực tập sinh">Thực tập sinh</option>
          <option value="Giám đốc">Giám đốc</option>
          <option value="Phó giám đốc">Phó giám đốc</option>
          <option value="Trưởng chi nhánh">Trưởng chi nhánh</option>
          <option value="Quản lí / Giám sát">Quản lí / Giám sát</option>
          <option value="Trưởng / Phó phòng">Trưởng / Phó phòng</option>
          <option value="Trưởng nhóm">Trưởng nhóm</option>
          <option value="Nhân viên">Nhân viên</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Số lượng tuyển</label>
        <input
          className={styles.input}
          type="number"
          value={numberOfVacancies}
          onChange={(e) => setNumberOfVacancies(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Hình thức làm việc</label>
        <select
          className={styles.input}
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
        >
          <option value="">Chọn hình thức làm việc</option>
          <option value="Toàn thời gian">Toàn thời gian</option>
          <option value="Bán thời gian">Bán thời gian</option>
          <option value="Thực tập">Thực tập</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Giới tính</label>
        <select
          className={styles.input}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Không yêu cầu">Không yêu cầu</option>
        </select>
      </div>

      <div className={styles.formActions}>
        <button className={styles.saveButton} onClick={handleSave}>Thêm Công Việc</button>
        <button className={styles.cancelButton} onClick={() => navigate('/employer/companyjob')}>Hủy</button>
      </div>
    </div>
  );
}

export default AddJob;
