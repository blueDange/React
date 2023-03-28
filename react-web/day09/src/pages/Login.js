import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Space,
  Typography,
} from "antd"
import React from "react"
import { useNavigate } from "react-router-dom"
import { adminLogin } from "../service"

export default function Login() {
  //在最顶层调用“页面跳转”必需的钩子
  let nav = useNavigate()
  //处理“提交登录信息”事件 —— onFinish方法的处理函数，参数就是表单中的输入内容
  let doLogin = async ({ adminName, adminPwd, remember }) => {
    //1.如果用户勾选了“记住个人信息”，应该存储这些信息到本地；否则应该从客户端端存储中删除
    if (remember) {
      localStorage["adminName"] = adminName
      localStorage["adminPwd"] = adminPwd
      localStorage["remember"] = remember
    } else {
      delete localStorage["adminName"]
      delete localStorage["adminPwd"]
      delete localStorage["remember"]
    }
    //2.检查用户名和密码格式是否正确
    adminName = adminName.trim()
    if (adminName.length < 3 || adminName.length > 24) {
      message.warning("用户名长度非法") //弹出一个警告型的“模态对话框”
      return
    }
    adminPwd = adminPwd.trim()
    if (adminPwd.length < 6 || adminPwd.length > 24) {
      message.warning("密码长度非法") //弹出一个警告型的“模态对话框”
      return
    }
    //3.提交登录信息给服务器(fetch)
    let data = await adminLogin(adminName, adminPwd)
    // console.log(data)
    if (data.code === 2000) {
      //登录验证成功，在客户端保存身份令牌，跳转到主菜单页面
      localStorage["adminToken"] = data.token
      nav("/admin?aname=" + adminName) //此处如果显示的欢迎性的“吐司对话框”，不能跨页面存在
    } else {
      //登录验证失败，弹出模态对话框提示用户
      Modal.error({
        title: "错误", //对话框标题
        content: "登录失败！服务器返回错误消息：" + data.msg, //主体内容
        okText: "确定", //“确定”按钮上显示的文字
        centered: true, //是否居中显示对话框
      })
    }
  }
  return (
    <div
      style={{
        backgroundImage: "url(img/bg.jpg)",
        height: "100vh",
        backgroundSize: "100% 100%",
      }}
    >
      {/* 一行一列（居中显示） */}
      <Row style={{ paddingTop: "20vh" }}>
        {/* <Col span={10}  offset={7}> */}
        <Col style={{ width: "550px", margin: "0 auto" }}>
          {/* 顶部的标题 */}
          <Typography.Title
            level={2}
            style={{ textAlign: "center", color: "#fff" }}
          >
            天通苑智慧社区管理系统
          </Typography.Title>
          {/* 主体的卡片 */}
          <Card>
            <Space>
              {/* 左侧：图片，不需要预览功能 */}
              <Image
                preview={false}
                src="img/u794.jpg"
                style={{ width: "210px" }}
              />
              {/* 中央：分割线，类型为“竖直线”   */}
              <Divider
                type="vertical"
                style={{ backgroundColor: "#009DDF", height: "30vh" }}
              />
              {/* 右侧：表单 */}
              <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onFinish={doLogin}
                initialValues={{
                  //给表单元素赋初始值 —— 如果之前用户要求“记住个人信息”则应该从客户端存储中读取
                  adminName: localStorage["adminName"],
                  adminPwd: localStorage["adminPwd"],
                  remember: localStorage["remember"],
                }}
              >
                {/* 用户名输入框组 */}
                <Form.Item
                  style={{ width: "260px" }}
                  label="用户名："
                  name="adminName"
                  rules={[{ required: true, message: "用户名不能为空" }]}
                >
                  <Input placeholder="请输入管理员登录用户名" />
                </Form.Item>
                {/* 密码输入框组 */}
                <Form.Item
                  label="密码："
                  name="adminPwd"
                  rules={[{ required: true, message: "密码不能为空" }]}
                >
                  <Input.Password placeholder="请输入登录密码" />
                </Form.Item>
                {/* 记住密码复选框组 */}
                <Form.Item
                  wrapperCol={{ offset: 6 }}
                  name="remember"
                  //复选框提交时提交HTML元素的checked的值，而不是value属性的值
                  valuePropName="checked"
                >
                  <Checkbox>记住密码</Checkbox>
                </Form.Item>
                {/* 提交按钮组 */}
                <Form.Item wrapperCol={{ offset: 6 }}>
                  <Button type="primary" htmlType="submit">
                    提 交
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
