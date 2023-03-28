import { Divider, Modal, Space } from "antd"
import React, { useEffect, useState } from "react"
import { adminHouseholdDetails } from "../service"

export default function ResidentDetailsModal({ show, residentId, doHide }) {
  //状态变量 —— 查询到的居民详情
  let [resident, setResident] = useState({})
  //生命周期方法/副作用方法 —— 当模态对话框显示出来时,查询居民详情
  useEffect(() => {
    if (show) {
      //发起服务器端数据的异步请求
      ;(async () => {
        let data = await adminHouseholdDetails(residentId)
        console.log("居民详情：", data)
        setResident(data)
      })()
    }
  }, [show])

  return (
    <Modal
      title="居民详情"
      open={show}
      okText="确定"
      cancelText="取消"
      onCancel={() => doHide(false)} //相当于调用了父组件的方法：setShowResidentDetailsModal(false)
      onOk={() => doHide(false)}
    >
      <Divider />
      {/* direction:指定在哪个方向添加间距  horizontal / vertical */}
      {/* size：指定间距大小   small / middle  / large  / 数字 */}
      <Space direction="vertical" size="large">
        <div>居民户号：{resident.householdId}</div>
        <div>居民姓名：{resident.householdName}</div>
        <div>居民性别：{resident.gender}</div>
        <div>家庭住址：{resident.householdAddr}</div>
        <div>联系电话：{resident.phone}</div>
        <div>身份证号：{resident.idNum}</div>
      </Space>
      <Divider />
    </Modal>
  )
}
