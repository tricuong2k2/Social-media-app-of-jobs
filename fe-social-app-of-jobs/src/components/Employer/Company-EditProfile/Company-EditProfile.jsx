import React, { useState, useEffect } from 'react';
import styles from './Company-EditProfile.module.css';
import { useNavigate } from 'react-router-dom';
import { Col, message, Form, Button, Input } from "antd";
import { PiBuildingApartmentBold } from "react-icons/pi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { TbBuildingCommunity } from "react-icons/tb";
import Address from "../../Address/Address";
import axios from "axios";
import Logo from '../Logo/Logo';

const EditCompanyProfile = () => {
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [location, setLocation] = useState('116 Hà Nội');
  const [company, setCompany] = useState({});


  useEffect(() => {
    Promise.all([
      axios.get("https://provinces.open-api.vn/api/p/"),
      axios.get(`http://localhost:8000/api/company/info`, {
        withCredentials: true,
      })
    ])
      .then(([resProvinces, resCompanyInfo]) => {
        const cities = resProvinces.data.map((city, index) => ({
          id: index,
          key: city.code,
          label: city.name,
          value: city.name,
        }));

        setCities(cities);
        setCompany(resCompanyInfo.data.info);

        // Set initial selected city based on current value
        if (resCompanyInfo.data.info?.address?.province) {
          const selectedCity = cities.find(
            city => city.value === resCompanyInfo.data.info.address.province
          );
          if (selectedCity) {
            handleSelectCitites(selectedCity);
          }
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectCitites = async (selectedCity) => {
    console.log('selectedCity: ', selectedCity)
    console.log('selectedCity.key: ', selectedCity.key)
    try {
      setLocation(selectedCity.value);
      setDistricts([]);
      setWards([]);

      const res = await axios.get(`https://provinces.open-api.vn/api/p/${selectedCity.key}?depth=2`);
      const districts = res.data.districts.map((district) => ({
        key: district.code,
        label: district.name,
        value: district.name,
      }));

      setDistricts(districts);

      // Set initial selected district based on company data
      if (company?.address?.district) {
        const selectedDistrict = districts.find(
          district => district.value === company.address.district
        );
        if (selectedDistrict) {
          handleSelectDistricts(selectedDistrict);
        }
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };


  const handleSelectDistricts = async (selectedDistrict) => {
    try {
      setWards([]);

      const res = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.key}?depth=2`);
      const wards = res.data.wards.map((ward) => ({
        key: ward.code,
        label: ward.name,
        value: ward.name,
      }));

      setWards(wards);

      // Set initial selected ward based on company data
      if (company?.address?.ward) {
        const selectedWard = wards.find(
          ward => ward.value === company.address.ward
        );
        if (selectedWard) {
          setWards(wards); // Set all wards but highlight the selected one
        }
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };



  const [form] = Form.useForm();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);

  const handleSave = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        values.locations = [{
          detail: values.detail,
          ward: values.ward,
          district: values.district,
          province: values.province,
        }]
        console.log(values);
        await axios.post('http://localhost:8000/api/company/info', values, {
          withCredentials: true,
        })
          .then(res => {
            console.log(res.data);
            const info = res.data.info;

            messageApi.success("Cập nhật thành công!");
            navigate("/employer/company-profile");
          })
          .catch(err => {
            console.error(err);
            messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
          })
          .finally(() => {
            setLoading(false);
          })
      })
  }

  console.log(company);

  return (
    console.log('company: ', company),
    console.log('company?.address?.province: ', company?.address?.province),
    <div>
      {contextMessageHolder}
      <Form
        form={form}
        name="update_info"
        layout="vertical"
        className={styles.container}
      >
        <h1>Chỉnh sửa hồ sơ công ty</h1>
        <div >
          <Logo
            API={{
              upload: "http://localhost:8000/api/company/logo",
              delete: "http://localhost:8000/api/company/logo"
            }}
            company={company}
          />
        </div>
        <Form.Item
          label="Tên công ty"
          name="name"
        >
          <Input placeholder="Tên công ty mới" />
        </Form.Item>

        <Form.Item
          label="Giới thiệu công ty"
          name="introduction"
        >
          <Input placeholder="Hãy nhập lời giới thiệu thật oách" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
        >
          <Input placeholder="Nhập địa chỉ của bạn" />
        </Form.Item>

        <Col span={8}></Col>
        <Col span={6}>
          <Address
            label="Tỉnh/thành phố"
            initialValue={company?.address?.province || "Không xác định"}
            type="province" suffixIcon={<PiBuildingApartmentBold />}
            options={cities}
            required={false}
            placeholder="Chọn tỉnh/thành phố"
            onSelect={(value) => {
              // Tìm city object dựa trên value string nhận được
              const selectedCity = cities.find(
                city => city.value === value || city.label === value
              );

              if (selectedCity) {
                handleSelectCitites(selectedCity);
              } else {
                console.error('Không tìm thấy thành phố:', value);
              }
            }}

          />
        </Col>
        <Col span={6}>
          <Address
            label="Quận/huyện"
            initialValue={company?.address?.district || "Không xác định"}
            type="district"
            options={districts} suffixIcon={<HiBuildingOffice2 />}
            required={false}
            placeholder="Chọn quận/huyện"
            onSelect={(value) => {
              const selectedDistrict = districts.find(
                district => district.value === value || district.label === value
              );

              if (selectedDistrict) {
                handleSelectDistricts(selectedDistrict);
              }
            }}

          />
        </Col>
        <Col span={6}>
          <Address
            label="Xã/phường"
            initialValue={company?.address?.ward || "Không xác định"}
            type="ward"
            options={wards} suffixIcon={<TbBuildingCommunity />}
            required={false}
            placeholder="Chọn xã/phường"
          />
        </Col>

        <Form.Item
          label="Mã số thuế"
          name="taxCode"
        >
          <Input placeholder="Điền mã số thuế của công ty" />
        </Form.Item>

        <Form.Item
          label="Số lượng nhân lực"
          name="companySize"
        >
          <Input placeholder="Nhập quy mô nhân viên của công ty" />
        </Form.Item>

        <Form.Item>
          <div className={styles.formActions}>
            <Button className={styles.saveButton} onClick={handleSave}>Lưu</Button>
            <Button className={styles.cancelButton} onClick={() => navigate('/employer/company-profile')}>Hủy</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCompanyProfile;
