import { DeleteOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, List } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteSavedJob } from '../../actions';
import styles from './SavedJobs.module.css';

const SavedJobs = () => {
  const savedJobs = useSelector(state => state.savedJobs);
  const dispatch = useDispatch();

  const handleRemove = (jobId) => {
    dispatch(deleteSavedJob(jobId));
  };

  return (
    <ConfigProvider>
      <div className={styles.savedJobsContainer}>
        <h2>Saved Jobs</h2>
        <List
          itemLayout="horizontal"
          dataSource={savedJobs}
          renderItem={job => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(job.id)}
                >
                  Remove
                </Button>
              ]}
            >
              <List.Item.Meta
                title={<Link to={`/job-detail/${job.id}`}>{job.title}</Link>}
                description={job.company.name}
              />
            </List.Item>
          )}
        />
      </div>
    </ConfigProvider>
  );
};

export default SavedJobs;
