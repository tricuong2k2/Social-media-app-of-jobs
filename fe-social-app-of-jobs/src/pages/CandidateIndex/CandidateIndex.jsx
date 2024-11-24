import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../components/FooterMain/Footer";
import HeaderCadidateIdex from '../../components/Header/Header_CandidateIndex';
import styles from "./CadidateIndex.module.css";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCandidateInfo } from '../../actions';

function CandidateIndex() {
  const nav = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('http://localhost:8000/api/candidate/info/', {
      withCredentials: true,
    }).then(res => {
      // console.log(res.data.info);
      
      dispatch(setCandidateInfo({
        uid: res.data.info._id,
        ...res.data.info.member,
      }));
    })
      .catch(error => {
        console.log(error);
        const code = error.response.status;
        if (code === 401 || code === 403)
          nav("/login");
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <HeaderCadidateIdex />
      <div className={styles.content}>
        <Outlet />
      </div>
      <div className={styles.footer_main}>
        <Footer />
      </div>
    </div>
  );
}

export default CandidateIndex;
