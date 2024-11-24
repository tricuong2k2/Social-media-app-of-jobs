import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import styles from './CVUpload.module.css'; // CSS module

const CVUpload = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFileChange = ({ file }) => {
        setSelectedFile(file);
        setFileName(file.name); // Cập nhật tên file
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await axios.post('http://localhost:8000/api/candidate/resumes/', 
                    formData,
                    { withCredentials: true },
                );

                onUploadSuccess(response.data.resume);
                setSelectedFile(null);
                setFileName(''); // Xóa tên file sau khi tải lên thành công
                message.success('Tải CV lên thành công');
            } catch (error) {
                console.error('Error uploading CV:', error);
                message.error('Có lỗi xảy ra khi tải CV lên');
            }
        }
    };

    return (
        <div className={styles.cvUploadContainer}>
            <h2 className={styles.title}>Tải CV lên</h2>
            <Upload
                beforeUpload={() => false} // Prevent auto upload
                onChange={handleFileChange}
                showUploadList={false}
                className={styles.uploadInput}
            >
                <Button icon={<UploadOutlined />}>Chọn CV</Button>
            </Upload>
            {fileName && (
                <div className={styles.fileNameContainer}>
                    <p className={styles.fileNameText}>File đã chọn: {fileName}</p>
                </div>
            )}
            <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={handleUpload}
                disabled={!selectedFile}
                className={styles.uploadButton}
            >
                Tải CV lên
            </Button>
        </div>
    );
};

export default CVUpload;
