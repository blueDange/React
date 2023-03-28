import { Divider, Form, Input, message, Modal, Radio } from "antd"
import { useForm } from "antd/es/form/Form"
import React from "react"
import { adminHouseholdAdd } from "../service"

export default function ResidentAddModal({ show, doHide, refresh }) {
  //使用antd提供的钩子，创建一个指向表单组件的引用
  let [addForm] = useForm()

  //提交表单中的用户输入，实现“添加居民”功能
  let submitAdd = async (values) => {
    let data = await adminHouseholdAdd(values)
    if (data.code === 2000) {
      //添加成功
      message.success("新记录添加成功！")
      doHide(false) //关闭当前的模态对话框
      refresh() //刷新列表中的第一个页面
    } else {
      //添加失败
      Modal.error({
        title: "错误",
        content: "添加失败！服务器返回错误消息：" + data.msg,
        okText: "确定",
        cancelText: "取消",
      })
    }
  }
  return (
    <Modal
      title="添加新的居民"
      open={show}
      okText="保存"
      cancelText="取消"
      onCancel={() => doHide(false)}
      onOk={() => addForm.submit()}
    >
      <Divider />
      <Form form={addForm} onFinish={submitAdd} labelCol={{ span: 4 }}>
        <Form.Item
          label="居民户号："
          name="householdId"
          rules={[{ required: true, message: "户号不能为空" }]}
        >
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
        <Form.Item label="手机号码：" name="phone">
          <Input placeholder="请输入手机号码" />
        </Form.Item>
        <Form.Item label="身份证号：" name="idNum">
          <Input placeholder="请输入身份证号" />
        </Form.Item>
      </Form>
      <Divider />
    </Modal>
  )
}
