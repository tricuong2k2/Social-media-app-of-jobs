import { ConfigProvider, Modal, Tabs } from "antd";
import { useState } from "react";

import styles from "./ManagementTable.module.css";
import AdminTable from "../AdminTable/AdminTable";
import { adminTableThemes } from "../../../helper";

function ManagementMember({ getData=null, tabs=[], isRowSelection=true, 
  tableParams={}, setTableParams=null, setData=null, uses=["all"], 
  handleConfirmHidden=null, handleConfirmEnable=null, handleConfirmVerify=null,
  handleConfirmDelete=null, columnSearches=[] }) {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false); 

  const [modal, contextHolder] = Modal.useModal();

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    // console.log(selectedRows);
    setSelectedRows(selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleTableChange = async (pagination, filters, sorter) => {
    if (pagination.current !== tableParams.pagination.current || pagination.pageSize !== tableParams.pagination.pageSize) {
      getData(pagination.current, pagination.pageSize);
    }

    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };

  const handleConfirmHiddenSelected = () => {
    if (selectedRows.length) {
      modal.warning({
        title: "Xác nhận ẩn",
        content: "Bạn chắc chắn muốn ẩn tất cả các hàng được chọn!",
        open: openModalConfirm,
        okText: "Xác nhận",
        closable: true,
        onOk: async () => {
          setConfirmLoading(true);
          await handleConfirmHidden(selectedRows);
          setConfirmLoading(false);
          setOpenModalConfirm(false);
        },
        onCancel: () => { if (!confirmLoading) setOpenModalConfirm(false) },
      })
    }
  }

  const handleConfirmEnableSelected = () => {
    if (selectedRows.length) {
      modal.warning({
        title: "Xác nhận khôi phục",
        content: "Bạn chắc chắn muốn khôi phục tất cả các hàng được chọn!",
        open: openModalConfirm,
        okText: "Xác nhận",
        closable: true,
        onOk: async () => {
          setConfirmLoading(true);
          await handleConfirmEnable(selectedRows);
          setConfirmLoading(false);
          setOpenModalConfirm(false);
        },
        onCancel: () => { if (!confirmLoading) setOpenModalConfirm(false) },
      })
    }
  }

  const handleConfirmVerifySelected = () => {
    if (selectedRows.length && selectedRows.every(row => !row.status)) {
      modal.warning({
        title: "Xác nhận xác minh thủ công",
        content: "Bạn chắc chắn muốn xác minh tất cả các hàng được chọn!",
        open: openModalConfirm,
        okText: "Xác nhận",
        closable: true,
        onOk: async () => {
          setConfirmLoading(true);
          await handleConfirmVerify(selectedRows);
          setConfirmLoading(false);
          setOpenModalConfirm(false);
        },
        onCancel: () => { if (!confirmLoading) setOpenModalConfirm(false) },
      })
    } else {
      modal.error({
        title: "Không khả dụng",
        content: "Một trong các hàng bạn chọn đã được xác minh!",
        open: openModalConfirm,
        okText: "Đã hiểu",
        closable: true,
        onOk: () => setOpenModalConfirm(false),
        onCancel: () => setOpenModalConfirm(false),
      })
    }
  }

  const handleConfirmDeleteSelected = () => {
    if (selectedRows.length) {
      modal.warning({
        title: "Hành động không thể khôi phục",
        content: "Bạn chắc chắn muốn xóa tất cả các hàng được chọn!",
        open: openModalConfirm,
        okText: "Xác nhận",
        closable: true,
        onOk: async () => {
          setConfirmLoading(true);
          await handleConfirmDelete(selectedRows);
          setConfirmLoading(false);
          setOpenModalConfirm(false);
        },
        onCancel: () => { if (!confirmLoading) setOpenModalConfirm(false) },
      })
    } 
  }

  return (
    <div className={styles.candidates}>
      <ConfigProvider theme={adminTableThemes} >
        { contextHolder }
        <Tabs 
          defaultActiveKey="1"
          centered
          items={tabs.map((tab, index) => ({
            label: tab.label,
            icon: tab.icon,
            children: (
                <AdminTable 
                  title={tab.title}
                  uses={uses}
                  hidden={index === 1}
                  columns={tab.columns}
                  loading={tab.loading}
                  isRowSelection={isRowSelection}
                  selectedRowKeys={selectedRowKeys}
                  data={tab.data}
                  tableParams={tableParams}
                  onSelectChange={onSelectChange}
                  handleTableChange={handleTableChange}
                  columnSearches={["fullName", "email", "tel", "address", ...columnSearches]}
                  handleRefresh={() => getData(tableParams.pagination.current, tableParams.pagination.pageSize
                    , index ? true : false)}
                  handleConfirmHiddenSelected={handleConfirmHiddenSelected}
                  handleConfirmEnableSelected={handleConfirmEnableSelected}
                  handleConfirmVerifySelected={handleConfirmVerifySelected}
                  handleConfirmDeleteSelected={handleConfirmDeleteSelected}
                />
            )
          })).map((table, index) => ({
            key: index,
            label: table.label,
            icon: table.icon,
            children: table.children,
          }))}
          onTabClick={(activeKey) => {
            // console.log(activeKey);
            setSelectedRowKeys([]);
            setTableParams({ ...tableParams, pagination: {
              current: 1,
              pageSize: 10,
              total: 200,
            }});
            setData([]);
            // setLoading(false);
            setTimeout(() => {
              getData(1, 10, activeKey ? true : false, "ManagementMember.jsx");
            }, 500);
          }}
          tabBarStyle={{
            backgroundColor: "#FFF",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        />
      </ConfigProvider>
    </div>
  );
}

export default ManagementMember;