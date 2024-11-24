import { Card, List, Spin, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './AppliedJobs.module.css';

const { Title, Text } = Typography;

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/candidate/applied-jobs', 
            { withCredentials: true }
        );
        setAppliedJobs(response.data.applications);
      } catch (error) {
        console.error('Failed to fetch applied jobs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <div className={styles.container}>
      <Title level={2}>Công việc đã ứng tuyển</Title>
      {loading ? (
        <div className={styles.spinner}>
          <Spin size="large" />
        </div>
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={appliedJobs}
          renderItem={item => (
            <List.Item>
              <Card title={item.job.title} bordered={false}>
                <Text strong>Company:</Text> {item.job.company.name}
                <br />
                <Text strong>Applied At:</Text> {new Date(item.appliedAt).toLocaleDateString()}
                <br />
                <Text strong>Description:</Text> {item.description}
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default AppliedJobs;
