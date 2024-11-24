import { DeleteOutlined, DownloadOutlined, FileOutlined } from '@ant-design/icons';
import { Button, Empty, message } from 'antd';
import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import styles from './CVList.module.css';

const CVList = () => {
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCVs = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/candidate/resumes', 
                    { withCredentials: true }
                );
                setCvs(response.data.resumes);
            } catch (error) {
                console.error('Error fetching CVs:', error);
                message.error('Có lỗi xảy ra khi tải danh sách CV');
            } finally {
                setLoading(false);
            }
        };

        fetchCVs();
    }, []);

    const handleDelete = async (cvId) => {
        try {
            await axios.delete(`http://localhost:8000/api/candidate/resume/${cvId}`,
                { withCredentials: true }
            );
            setCvs(cvs.filter(cv => cv._id !== cvId));
            message.success('CV đã được xóa thành công');
        } catch (error) {
            console.error('Error deleting CV:', error);
            message.error('Có lỗi xảy ra khi xóa CV');
        }
    };

    const handleDownload = async (cv) => {
        try {
            const response = await axios.get(cv.resume, {
                responseType: 'blob',
            });
            saveAs(response.data, cv.name);
        } catch (error) {
            console.error('Error downloading CV:', error);
            message.error('Có lỗi xảy ra khi tải CV');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.cvListContainer}>
            <h2 className={styles.title}>CV đã tải lên</h2>
            {cvs.length === 0 ? (
                <div className={styles.emptyContainer}>
                    <Empty />
                    <p>Bạn chưa tải lên CV nào.</p>
                </div>
            ) : (
                <ul className={styles.cvList}>
                    {cvs.map(cv => (
                        <li key={cv._id} className={styles.cvListItem}>
                            <div className={styles.cvName}>
                                <FileOutlined className={styles.fileIcon} />
                                <a href={cv.resume} target="_blank" rel="noopener noreferrer">
                                    {cv.name}
                                </a>
                            </div>
                            <div className={styles.cvActions}>
                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload(cv)}
                                    className={styles.downloadButton}
                                >
                                    Tải xuống
                                </Button>
                                <Button
                                    type="danger"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDelete(cv._id)}
                                    className={styles.deleteButton}
                                >
                                    Xóa
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CVList;
