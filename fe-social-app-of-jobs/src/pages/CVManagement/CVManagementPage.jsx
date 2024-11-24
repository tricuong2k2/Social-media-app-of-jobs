import { Layout } from 'antd';
import React, { useState } from 'react';
import CVList from '../../components/CandidateCV/CVList';
import CVUpload from '../../components/CandidateCV/CVUpload';
import UserInfo from '../../components/CandidateCV/UserInfo';
import styles from './CVManagementPage.module.css';

const { Sider, Content } = Layout;

const CVManagementPage = () => {
    const [cvs, setCvs] = useState([]);

    const handleUploadSuccess = (newCv) => {
        setCvs(prevCvs => [...prevCvs, newCv]);
    };

    const handleDelete = (cvId) => {
        setCvs(prevCvs => prevCvs.filter(cv => cv.id !== cvId));
    };

    return (
        <Layout className={styles.layout}>
            <Content className={styles.content}>
                <div>
                    <h1 className={styles.header}>Hồ sơ & CV</h1>
                    <CVUpload onUploadSuccess={handleUploadSuccess} />
                </div>
                <div className={styles.marginTop}>
                    <CVList cvs={cvs} onDelete={handleDelete} />
                </div>
            </Content>
            <Sider width="30%" className={styles.sider}>
                <div>
                    <UserInfo />
                </div>
            </Sider>
        </Layout>
    );
};

export default CVManagementPage;
