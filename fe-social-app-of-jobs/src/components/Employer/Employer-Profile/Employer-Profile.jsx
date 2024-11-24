import React from 'react';
import { useEffect, useState } from "react";
import styles from './Employer-Profile.module.css';
import {Outlet, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Header from "../Header/Header";
import { setEmployerInfo } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";

const CompanyProfile = () => {
    const navigate = useNavigate();
    const[avatar, setAvatar] = useState(null);
    const[id,setId] = useState(null);
    const[name, setName] = useState(null);
    const[dob, setDob] = useState(null);
//    const[address, setAddress] = useState(null);
    const[sex, setSex] = useState(null);
    const[email, setEmail] = useState(null);
    const[phone, setPhone] = useState(null);

    const employer = useSelector(state => state.memberReducer);
    const dispatch = useDispatch();

    const getEmployer = () => {
        axios.get(`http://localhost:8000/api/employer/info`, {
            withCredentials: true,
        })
            .then(res => {
                setName(res.data.info.member.fullName);
                setAvatar(res.data.info.member.avatar);
                setId(res.data.info.member._id);
                setSex(res.data.info.member.gender);
                setEmail(res.data.info.member.email);
                setPhone(res.data.info.member.tel);
                const dateStr = res.data.info.member.dob;
                const date = new Date(dateStr);
                
                const formattedDate = date.toISOString().split('T')[0];
                setDob(formattedDate);                
 //               console.log(res.data.info);
                const info = res.data.info;
                dispatch(setEmployerInfo({...employer, ...res.data.info}))

            })
            .catch(err => {
                console.error(err);
            })
    }
    useEffect(() => {
        getEmployer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);   

    return (
        <div>

        <div className={styles.container}>
            <div className={styles.header}>
                {avatar ? (
                    <img 
                        style={{width:"200px", height:"200px"}} 
                        src={avatar} alt='anh'
                    />
                ):(
                    <p></p>
                )}
                <h1 className={styles.companyName}>{employer.fullName}</h1>
            </div>
            
            <div className={styles.details}> 
                <div>
                    <span className={styles.address}>ID người dùng: </span>
                    <span>{employer._id}</span>
                </div>                  
                <div>
                    <span className={styles.gender}>Giới Tính: </span>
                    <span>{employer.gender}</span>
                </div>             
                <div>
                    <span className={styles.gender}>Ngày sinh: </span>
                    <span>{dob}</span>
                </div>
                <div>
                    <span className={styles.email}>Email: </span>
                    <span>{employer.email}</span>
                </div>
                <div>
                    <span className={styles.phonenumber}>Số điện thoại: </span>
                    <span>{employer.tel}</span>
                </div>
            </div>
            <div className={styles.jobActions}>
            <button className={styles.editButton} onClick={() => navigate('/employer/employer-editprofile')} >Sửa</button>
          </div>   
            
        </div>
        </div>
    );
};

export default CompanyProfile;

