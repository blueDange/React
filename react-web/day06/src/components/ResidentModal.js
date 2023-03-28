import { Divider, Modal } from "antd"
import React, { useEffect } from "react"

export default function ResidentModal({ title, show, residentId, doHide }) {
  //生命周期方法/副作用方法 —— 当获得到有价值的“居民编号”时,查询居民详情
  useEffect(() => {
    if (residentId > 0) {
      //发起服务器端数据的异步请求
    }
  }, [residentId])

  return (
    <Modal
      title={title}
      open={show}
      okText="确定"
      cancelText="取消"
      onCancel={() => doHide(false)} //相当于调用了父组件的方法：setShowResidentDetailsModal(false)
      onOk={null}
    >
      <Divider />
      居民编号：{residentId}
      <Divider />
    </Modal>
  )
}
