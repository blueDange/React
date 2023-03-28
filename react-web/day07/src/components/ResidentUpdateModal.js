import { Divider, Form, Input, message, Modal, Radio } from "antd"
import { useForm } from "antd/es/form/Form"
import React, { useEffect, useState } from "react"
import { adminHouseholdDetails, adminHouseholdUpdate } from "../service"

export default function ResidentUpdateModal({
  show,
  residentId,
  doHide,
  refresh,
}) {
  //使用antd提供的钩子，创建表单组件的引用
  let [updateForm] = useForm()
  //副作用方法 —— 当 “是否显示居民更新对话框” 发生改变时，异步请求当前编号对应的居民信息
  useEffect(() => {
    if (show) {
      ;(async () => {
        let data = await adminHouseholdDetails(residentId)
        console.log("待修改的居民信息：", data)
        //把查询到的居民详细信息显示到表单中即可 —— 可以无需状态变量
        updateForm.setFieldsValue(data) //设置表单组件的每个字段对应的值
        //注意：居民数据的属性名必须和表单项的name属性一致
      })()
    }
  }, [show])

  //提交表单中的输入内容给服务器端接口
  let submitUpdate = async (values) => {
    // console.log("表单中当前输入值：", values)
    let data = await adminHouseholdUpdate(values)
    if (data.code === 2000) {
      message.success("居民信息更新成功！")
      doHide(false) //执行模态对话框的隐藏，即让“显示模态对话框吗？”赋值为false
      //重新加载“居民列表”中当前加载的那一页数据，即调用loadData(pageNum)
      refresh() //子组件想调用父组件的方法
    } else {
      Modal.error({
        title: "错误",
        content: "更新失败！服务器返回错误消息：" + data.msg,
        okText: "确定",
        cancelText: "取消",
      })
    }
  }
  return (
    <Modal
      title="修改居民信息"
      open={show}
      okText="确定"
      cancelText="取消"
      onCancel={() => doHide(false)}
      onOk={() => updateForm.submit()}
    >
      <Divider />
      {/* 注意：此表单没有提供初始值绑定(initialValues)——该属性没有“响应式”特点 */}
      {/* 还要注意：表单项的name必需和resident的某个属性名相同 */}
      <Form form={updateForm} onFinish={submitUpdate}>
        {/* hidden: 表单中的隐藏字段 —— 用户看不见，但是却实实在在存在，而且可以提交 */}
        <Form.Item name="hid" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="居民户号：" name="householdId">
          <Input placeholder="请输入居民户号" />
        </Form.Item>
        <Form.Item label="居民姓名：" name="householdName">
          <Input placeholder="请输入居民姓名" />
        </Form.Item>
        <Form.Item label="居民性别：" name="gender">
          <Radio.Group>
            <Radio value="0">女</Radio>
            <Radio value="1">男</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="家庭住址：" name="householdAddr">
          <Input placeholder="请输入家庭住址" />
        </Form.Item>
        <Form.Item label="联系电话：" name="phone">
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        <Form.Item label="身份证号：" name="idNum">
          <Input placeholder="请输入身份证号" />
        </Form.Item>
      </Form>
      <Divider />
    </Modal>
  )
}
