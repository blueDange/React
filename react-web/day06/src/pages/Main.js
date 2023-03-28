import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  HomeOutlined,
  AndroidOutlined,
  PlusOutlined,
  DatabaseOutlined,
  HeartOutlined,
  BarsOutlined,
  LineChartOutlined,
  TableOutlined,
  SettingOutlined,
  DownOutlined,
  createFromIconfontCN,
  QuestionCircleOutlined,
  PoweroffOutlined,
} from "@ant-design/icons"
import {
  Button,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  Layout,
  Menu,
  message,
  Modal,
  Popover,
  Row,
  Space,
  Typography,
} from "antd"
import { useForm } from "antd/es/form/Form"
import React, { useEffect, useRef, useState } from "react"
import { Outlet, useNavigate, useSearchParams } from "react-router-dom"
import { adminInfo, adminUpdatePwd, base } from "../service"

//数据库中指定的“图标名”与Antd中图标组件之间的映射对象
let iconMap = {
  home: <HomeOutlined />, //iconMap.home 等价于 iconMap['home']
  building: <DatabaseOutlined />,
  medical: <HeartOutlined />,
  category: <BarsOutlined />,
  chart: <LineChartOutlined />,
  basic: <TableOutlined />,
  layers: <SettingOutlined />,
}

//从iconfont.cn网站导入JS脚本，可以加载一套自定义图标库
let IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_3840950_we8rc78ufwh.js",
})

export default function Main() {
  //在最外层调用react-router-dom提供的钩子，用于读取路由参数/查询字符串
  let [params] = useSearchParams()
  //状态变量 —— 用户信息
  let [userInfo, setUserInfo] = useState({})
  //状态变量 —— 侧边栏是否折叠起来了
  let [collapsed, setCollapsed] = useState(false)
  //状态变量 —— 根据当前用户的权限生成的功能菜单
  let [menuItems, setMenuItems] = useState([])
  //调用钩子 —— 获取路由跳转的方法
  let nav = useNavigate()
  //状态变量 —— 是否显示“修改密码”模态对话框
  let [showModalModifyPwd, setShowModalModifyPwd] = useState(false)
  //调用钩子 —— 创建一个组件的引用，用于指向Form组件
  //let modifyPwdForm = useRef()
  let [modifyPwdForm] = useForm() //antd提供的钩子，专用于指向一个Form组件
  //状态变量 —— 主题色
  let [themeColor, setThemeColor] = useState("#0059AA")
  //状态变量 —— 假设：这是从服务器端动态获取的可用的主题色列表
  let [themeColorList, setThemeColorList] = useState([
    "#FF0000",
    "#9699FE",
    "#656698",
    "#00821A",
    "#856BDD",
  ])

  //生成权限菜单项列表，
  //list0是服务器端返回前端的数据, list1是Menu组件需要的数据 —— 数组的映射(map)
  let generateMenuItems = (list0) => {
    let list1 = list0.map((p, i) => {
      return {
        //把一个“权限”映射为一个“菜单项”
        key: p.pid + "-" + p.path, //每个菜单项必需的唯一值，其中还包含了菜单项点击后的跳转地址
        label: p.pname,
        icon: iconMap[p.icon],
        children:
          p.children.length > 0 ? generateMenuItems(p.children) : undefined,
        //递归调用：函数中调用自己 —— 无限深度的“权限列表”必需使用
      }
    })
    return list1
  }

  //生命周期方法/副作用方法 —— 组件挂载完成时
  useEffect(() => {
    //1.弹出欢迎性的“模态对话框”
    let aname = params.get("aname")
    message.success("欢迎回来：" + aname) //因为下一行是匿名自调函数，此处的分号不能省略
    //2.调用服务器端接口，获取当前登录用户的信息/权限
    ;(async () => {
      let data = await adminInfo()
      // console.log(data)
      setUserInfo(data)
      //根据获得的用户权限，创建功能菜单中的菜单项
      setMenuItems(generateMenuItems(data.privileges))
    })()
  }, [])

  //菜单项被点击时，跳转到另一个页面
  let jump = (e) => {
    // console.log(e)
    //读取当前被点击的菜单项的key，拆分获得其中的“跳转地址”
    let url = e.key.split("-")[1] //split：使用自定字符拆分原始字符串
    //使用react-router-dom提供的页面跳转方法
    nav(url) //在<Outlet/>中显示嵌套路由页面
  }
  //提交“修改密码”表单的内容
  let submitModifyPwd = async ({ oldPwd, newPwd, repeatPwd }) => {
    // console.log("待提交给服务器的数据：", oldPwd, newPwd, repeatPwd)
    //1.校验表单输入字段内容
    if (oldPwd.length < 6) {
      message.error("旧密码长度不足")
      return
    }
    if (newPwd.length < 6) {
      message.error("新密码长度不足")
      return
    }
    if (oldPwd == newPwd) {
      message.error("新旧密码不能相同")
      return
    }
    if (newPwd != repeatPwd) {
      message.error("两次输入的新密码必须相同")
      return
    }
    //2.提交内容给服务器端接口
    let data = await adminUpdatePwd(oldPwd, newPwd)
    if (data.code === 2000) {
      //修改成功
      Modal.success({
        title: "成功",
        content: "密码修改成功！点击确定后重新登录",
        okText: "确定",
        onOk: () => nav("/"),
      })
    } else {
      //修改失败
      Modal.error({
        title: "错误",
        content: "密码修改失败！服务器返回错误消息：" + data.msg,
        okText: "确定",
      })
    }
  }
  return (
    <>
      <Layout>
        {/* 左侧：侧边栏——用户权限 */}
        {/* collapsible：侧边栏是否能够折叠起来 */}
        {/* collapsed：当前是否折叠起来了 */}
        {/* onCollapse：处理“折叠切换”事件 */}
        {/* trigger：指定折叠/展开进行切换的触发器，默认是在Sider下部一个大于或小于号 */}
        <Layout.Sider
          collapsible={true}
          collapsed={collapsed}
          trigger={null}
          style={{
            background: themeColor,
            minHeight: "100vh",
            color: "#fff",
            padding: "6px",
          }}
        >
          {/* items：菜单中要显示出来的菜单项数据 */}
          {/* mode：菜单显示模式  horizontal-水平菜单  vertical-竖直菜单  inline-行内菜单 */}
          {/* defaultSelectedKeys：当前处于选中状态的菜单项有哪些 */}
          <Menu
            items={menuItems}
            mode="inline"
            onClick={jump}
            defaultSelectedKeys={["1-/admin"]}
          />
        </Layout.Sider>
        {/* 右侧：主体部分 */}
        <Layout>
          {/* 右侧上部：管理员信息 */}
          <Layout.Header
            style={{
              background: themeColor,
              color: "#fff",
              borderLeft: "1px solid #fff",
            }}
          >
            <Row>
              {/* 第一列：左侧的菜单展开/折叠控制按钮 */}
              <Col>
                {/* <Button onClick={() => setCollapsed(!collapsed)}>按钮</Button> */}
                <DoubleLeftOutlined
                  style={{
                    fontSize: "20px",
                    marginLeft: "-30px",
                    display: collapsed ? "none" : "inline",
                  }}
                  onClick={() => setCollapsed(!collapsed)}
                />
                <DoubleRightOutlined
                  style={{
                    fontSize: "20px",
                    marginLeft: "-30px",
                    display: collapsed ? "inline" : "none",
                  }}
                  onClick={() => setCollapsed(!collapsed)}
                />
              </Col>
              {/* 第二列：中间的大标题 */}
              <Col style={{ flex: 1 }}>
                <Typography.Title
                  level={3}
                  style={{ margin: "15px 0 0 15px", color: "#fff" }}
                >
                  天通苑智慧社区管理系统
                </Typography.Title>
              </Col>
              {/* 第三列：右侧的功能菜单 */}
              <Col>
                <Space>
                  {/* 第三列中的功能菜单1：用户头像和基础信息 */}
                  <div>
                    <img
                      src={base + userInfo.avatar}
                      style={{
                        width: "35px",
                        verticalAlign: "middle",
                      }}
                    />
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "1",
                            label: "修改密码",
                            onClick: () => setShowModalModifyPwd(true),
                          },
                          { key: "2", label: "个人资料" },
                        ],
                      }}
                    >
                      <Button type="text" style={{ color: "#fff" }}>
                        {userInfo.aname} <DownOutlined />
                      </Button>
                    </Dropdown>
                  </div>
                  {/* 第三列中的功能菜单2：修改主题色 */}
                  <div>
                    <IconFont
                      type="icon-colors"
                      style={{
                        color: "#fff",
                        fontSize: "26px",
                        verticalAlign: "middle",
                      }}
                    />
                    {/* trigger：触发器/扳机，指如何弹出“弹出框”，可选值：hover|click|focus   themeColor */}
                    <Popover
                      trigger="click"
                      content={
                        <Space>
                          {themeColorList.map((color, index) => (
                            <Button
                              style={{
                                width: "60px",
                                height: "30px",
                                background: color,
                              }}
                              onClick={() => setThemeColor(color)}
                              key={index}
                            ></Button>
                          ))}
                        </Space>
                      }
                    >
                      <Button type="text" style={{ color: "#fff" }}>
                        换肤
                      </Button>
                    </Popover>
                  </div>
                  {/* 第三列中的功能菜单3：帮助和关于 */}
                  <div>
                    <QuestionCircleOutlined
                      style={{ fontSize: "24px", verticalAlign: "middle" }}
                    />
                    <Dropdown
                      menu={{
                        items: [
                          { key: "1", label: "帮助手册" },
                          { key: "2", label: "关于系统" },
                        ],
                      }}
                    >
                      <Button type="text" style={{ color: "#fff" }}>
                        帮助 <DownOutlined />
                      </Button>
                    </Dropdown>
                  </div>
                  {/* 第三列中的功能菜单4：退出登录 */}
                  <PoweroffOutlined
                    style={{ fontSize: "24px", verticalAlign: "middle" }}
                    onClick={() =>
                      Modal.confirm({
                        centered: true, //弹出框显示在屏幕中央
                        title: "确认",
                        content: "您确定要退出吗？",
                        okText: "确定",
                        cancelText: "取消",
                        onOk: () => {
                          delete localStorage["adminToken"] //删除登录得到的身份令牌
                          nav("/") //导航跳转会登录页面
                        },
                      })
                    }
                  />
                </Space>
              </Col>
            </Row>
          </Layout.Header>
          {/* 右侧中部：主体 —— 嵌套的子路由页面的出口*/}
          <Layout.Content>
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
      {/* 固定定位的模态对话框 —— 修改密码 */}
      <Modal
        title="修改密码"
        open={showModalModifyPwd} //是否打开对话框
        //onOk={() => modifyPwdForm.current.submit()}
        onOk={() => modifyPwdForm.submit()}
        onCancel={() => {
          modifyPwdForm.resetFields() //重置所有的输入域
          setShowModalModifyPwd(false) //隐藏模态对话框       15:34
        }}
        okText="确定"
        cancelText="取消"
      >
        <Divider />
        <Form
          //ref={modifyPwdForm}
          form={modifyPwdForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={submitModifyPwd}
        >
          <Form.Item name="oldPwd" label="旧密码：">
            <Input.Password placeholder="请输入旧密码" />
          </Form.Item>
          <Form.Item name="newPwd" label="新密码：">
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item name="repeatPwd" label="重复密码">
            <Input.Password placeholder="请再输入一次新密码" />
          </Form.Item>
        </Form>
        <Divider />
      </Modal>
    </>
  )
}
