import React, { useState, useEffect } from 'react';
import styles from './Employer-EditProfile.module.css';
import { PiBuildingApartmentBold } from "react-icons/pi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { TbBuildingCommunity } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { Col, message, Form, Button, Input, Select, DatePicker } from "antd";
import Address from "../../Address/Address";
import axios from "axios";
import Avatar from "../../Avatar/Avatar";
import { setEmployerInfo } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";

function EmployerEditProfile() {
  const navigate = useNavigate();
  const [cities, setCities] = useState('Hà Nội');
  const [districts, setDistricts] = useState('Hà Đông');
  const [wards, setWards] = useState('Mỗ Lao');
  const [location, setLocation] = useState('116 Hà Nội');
  const [loading, setLoading] = useState(true);

  const handleSelectCitites = (selectedCity, option) => {
    setLocation(selectedCity.value);
    setDistricts([]);
    setWards([]);

    axios.get(`https://vapi.vnappmob.com/api/province/district/${option.key}`)
      .then(res => {
        const districts = res.data.results.map((district, index) => ({
          id: index,
          key: district.district_id,
          label: district.district_name,
          value: district.district_name,
        }));

        setDistricts(districts);

        // Set initial selected district based on current value
        const selectedDistrict = districts.find(district => district.value === 'Hà Đông');
        if (selectedDistrict) {
          handleSelectDistricts(selectedDistrict, { key: selectedDistrict.key });
        }
      })
  }
  const handleSelectDistricts = (selectedDistrict, option) => {
    setWards([]);

    axios.get(`https://vapi.vnappmob.com/api/province/ward/${option.key}`)
      .then(res => {
        const wards = res.data.results.map((ward, index) => ({
          id: index,
          key: ward.ward_id,
          label: ward.ward_name,
          value: ward.ward_name,
        }));

        setWards(wards);

        // Set initial selected ward based on current value
        const selectedWard = wards.find(ward => ward.value === 'Mỗ Lao');
        if (selectedWard) {
          setWards([selectedWard]);
        }
      })
  }

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
        // Set initial selected city based on current value
        const selectedCity = cities.find(city => city.value === 'Hà Nội');
        if (selectedCity) {
          handleSelectCitites(selectedCity, { key: selectedCity.key });
        }
      })
  }, []);

  //name, gender, dob, address, email, phone  
  // State for form fields
  /*  const [avatar, setAvatar] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('Nam');
    const [dob, setDob] = useState('2000-04-11');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');*/
  const [form] = Form.useForm();

  const employer = useSelector(state => state.memberReducer);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [messageApi, contextMessageHolder] = message.useMessage();


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
        await axios.post('http://localhost:8000/api/employer/info',values, {
          withCredentials: true,
        })
          .then(res => {
            console.log(res.data);
//            const info = res.data.info;  
            dispatch(setEmployerInfo({ 
              uid: res.data.info._id,
              ...res.data.info.member,
            }));                      
            messageApi.success("Cập nhật thành công!");

          })
          .catch(err => {
            console.error(err);
            messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
          })
          .finally(() => {
            setLoading(false);
 //           console.log(values);
          })
      })

  }  
  return (
    <div >
      {contextMessageHolder}
      <Form
        form={form}
        name="update_info"
        layout="vertical"
        className={styles.container}
      >
        <h1>Chỉnh sửa hồ sơ nhà tuyển dụng</h1>
        <div >
          <Avatar
            API={{
              upload: "http://localhost:8000/api/employer/avatar",
              delete: "http://localhost:8000/api/employer/avatar"
            }}
          />
        </div>
        <Form.Item
          label="Họ và tên"
          name="fullName"
        >
          <Input placeholder="Nhập họ và tên của bạn" />
        </Form.Item>
        <Col span={5}>
          <Form.Item
            label="Giới tính"
            name="gender"
          >
            <Select
              options={[
                { value: "Nam", label: "Nam" },
                { value: "Nữ", label: "Nữ" },
              ]}
            />
          </Form.Item></Col>
        <Col span={3}>
          <Form.Item
            label={<span className={styles.lbForm}>Ngày sinh</span>}
            name="dob"
          >
            <DatePicker format={{ format: 'DD-MM-YYYY' }} placeholder="Ngày sinh" />
          </Form.Item>
        </Col>
        <Col span={8}></Col>
            <Col span={6}>
              <Address
                label="Tỉnh/thành phố"
                initialValue={data?.locations && data?.locations.length > 0 ? data.locations[0]?.province : "Không xác định"}
                type="province" suffixIcon={<PiBuildingApartmentBold />}
                options={cities}
                required={false}
                placeholder="Chọn tỉnh/thành phố"
                onSelect={handleSelectCitites}
              />
            </Col>
            <Col span={6}>
              <Address
                label="Quận/huyện"
                initialValue={data?.locations && data?.locations.length > 0 ? data.locations[0]?.district : "Không xác định"}
                type="district"
                options={districts} suffixIcon={<HiBuildingOffice2 />}
                required={false}
                placeholder="Chọn quận/huyện"
                onSelect={handleSelectDistricts}
              />
            </Col>
            <Col span={6}>
              <Address
                label="Xã/phường"
                initialValue={data?.locations && data?.locations.length > 0 ? data.locations[0]?.ward : "Không xác định"}
                type="ward"
                options={wards} suffixIcon={<TbBuildingCommunity />}
                required={false}
                placeholder="Chọn xã/phường"
              />
            </Col>
        <Form.Item
          label="Địa chỉ công ty"
          name="address"
        >
          <Input placeholder="Nhập địa chỉ cụ thể" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
        >
          <Input placeholder="Nhập email liên lạc của bạn" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="tel"
        >
          <Input placeholder="Nhập số điện thoại của bạn" />
        </Form.Item>
        <Form.Item>
          <div className={styles.formActions}>
            <Button className={styles.saveButton} onClick={handleSave}>Lưu</Button>
            <Button className={styles.cancelButton} onClick={() => navigate('/employer/employer-profile')}>Hủy</Button>
          </div>          
        </Form.Item>

      </Form>
 
    </div>
  );
};

export default EmployerEditProfile;
