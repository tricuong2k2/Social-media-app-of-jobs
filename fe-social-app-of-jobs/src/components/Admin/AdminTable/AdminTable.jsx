import { Button, Input, Space, Table, Tooltip } from "antd";

import { LoadingOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import { BsFiletypeXlsx } from "react-icons/bs";
import { MdRefresh, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdHideSource, MdOutlineMarkEmailRead } from "react-icons/md";

import styles from "./AdminTable.module.css";

const primaryColor = "#00b14f";

function AdminTable({ title="", columns=[], hidden=true, isRowSelection=true, selectedRowKeys=[], 
  onSelectChange=null, data=[], tableParams={}, loading=false, handleTableChange=null, 
  columnSearches = [], handleRefresh=null, uses = [], handleConfirmHiddenSelected=null, 
  handleConfirmEnableSelected=null, handleConfirmVerifySelected=null, handleConfirmDeleteSelected=null,
  handleAddNew=null }) {
  const actions = [
    { code: 1, key: "refresh", icon: <MdRefresh />, tooltip: "Làm mới", onClick: handleRefresh },
    { code: 2, key: "add", icon: <FaPlus />, tooltip: "Thêm mới", onClick: handleAddNew },
    { code: 3, 
      key: hidden ? "delete" : "verify", 
      icon: hidden ? <RiDeleteBin6Line/> : <MdOutlineMarkEmailRead />, 
      tooltip: hidden ? "Xóa vĩnh viễn" : "Xác minh thủ công", 
      onClick: () => hidden ? handleConfirmDeleteSelected() : handleConfirmVerifySelected() },
    { code: 4, 
      key: hidden ? "enable" : "hidden", 
      icon: hidden ? <MdOutlineSettingsBackupRestore/> : <MdHideSource />, 
      tooltip: hidden ? "Khôi phục" : "Ẩn", 
      onClick: () => hidden ? handleConfirmEnableSelected() : handleConfirmHiddenSelected() },
    { code: 5, key: "export", icon: <BsFiletypeXlsx />, tooltip: "Xuất file .xlsx" },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? primaryColor : undefined,
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  });

  return (
    <>
      <Table
        size="middle"
        title={() => (
          <div className={styles.tableHeader}>
            <h3 className={styles.heading}>{title}</h3>
            <Space className={styles.actions}>
              {actions.map((action, index) => (
                uses.includes(action.key) || uses.includes("all")
                  ? (action.code === 3 || action.code === 4) ? (
                    selectedRowKeys.length > 0 ? (
                      <Tooltip key={index} title={action.tooltip} placement="topRight" >
                        <Button
                          icon={action.icon}
                          shape="circle"
                          onClick={action.onClick}
                        />
                      </Tooltip>
                    ) : null
                  ) : (
                    <Tooltip key={index} title={action.tooltip} placement="topRight" >
                      <Button
                        icon={action.icon}
                        shape="circle"
                        onClick={action.onClick}
                      />
                    </Tooltip>
                  )
                  : null))}
            </Space>
          </div >
        )
        }
        columns={
          columns.map((col) => {
            if (columnSearches.includes(col.dataIndex))
              return { ...col, ...getColumnSearchProps(col.dataIndex) };
            return col;
          })
        }
        rowSelection={isRowSelection ? {
          selectedRowKeys,
          onChange: onSelectChange,
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ]
        } : null}
        rowKey={(record) => record?.login?.uuid || record._id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={{
          spinning: loading,
          indicator: <LoadingOutlined style={{ color: "#01be56" }} spin />
        }}
        onChange={handleTableChange}
      />
    </>
  )
}

export default AdminTable;