//import { Avatar, message } from "antd";
import React from 'react';
import styles from './Company-Profile.module.css';
import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CompanyProflie() {
    const [loading, setLoading] = useState(true);
    const [webSite, setWebSite] = useState(null);

    const [companyName, setCompanyName] = useState(null);
    const [introduct, setIntroduct] = useState(null);
    const [taxCode, setTaxCode] = useState(null);
    const [companySize, setCompanySize] = useState(null); 
    const [address, setAddress] = useState([]);
    const [avatar, setAvatar] = useState(null);

    const getCompany = () => {
        setLoading(true);
        axios.get(`http://localhost:8000/api/company/info`, {
            withCredentials: true,
        })
            .then(res => {
                setCompanyName(res.data.info.name);
                setIntroduct(res.data.info.introduction);
                setCompanySize(res.data.info.companySize);
                setTaxCode(res.data.info.taxCode);
                setWebSite(res.data.info.website);
                setAddress(res.data.info.address);
 //               setProvince(res.data.info.address.province);
 //               setDistrict(res.data.info.address.district);
 //               setWard(res.data.info.address.ward);
                setAvatar(res.data.info.logo);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => setLoading(false))
    }
    useEffect(() => {
        getCompany();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    
    const navigate = useNavigate();
    return (
        <div>

        <div className={styles.container}>
            <div className={styles.header}>
            {avatar ? (
                    <img 
                        style={{width:"200px", height:"200px"}} 
                        src={avatar || "/company.png"} alt='anh'
                    />
                ):(
                    <p></p>
                )}
                <h1 className={styles.companyName}> 
                    {companyName}
                </h1>
            </div>
            <div className={styles.details}>
                <div className={styles.h}>
                    <p className={styles.introduction}>Giới thiệu về công ty:</p>
                    <p>{introduct}
                    </p>
                </div>
                <div>
                    <p className={styles.address}>Địa chỉ: </p>
                    <p>{address}</p>
                </div>
                <div>
                    <p className={styles.address}>
                        Trang web: <a href='{webSite}'>{webSite}</a>
                    </p>
                <div>
                    <span className={styles.employees}>Mã số thuế: </span>
                    <span>{taxCode}</span>
                </div>   
                </div>
                <div>
                    <span className={styles.employees}>Số lượng nhân lực: </span>
                    <span>{companySize}</span>
                </div>
            </div>
            <div className={styles.jobActions}>
            <button className={styles.editButton} onClick={() => navigate('/employer/company-editprofile')} >Sửa</button>
          </div>   
            
        </div>
        </div>
    );
};

export default CompanyProflie;