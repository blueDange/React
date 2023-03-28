import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  HomeOutlined,
  AndroidOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import { keyboard } from "@testing-library/user-event/dist/keyboard"
import { Button, Layout, Menu, message } from "antd"
import React, { useEffect, useState } from "react"
import { Outlet, useSearchParams } from "react-router-dom"
import { adminInfo } from "../service"

//数据库中指定的“图标名”与Antd中图标组件之间的映射对象
let iconMap = {
  home: <HomeOutlined />, //iconMap.home 等价于 iconMap['home']
  building: <HomeOutlined />,
  medical: <HomeOutlined />,
  category: <HomeOutlined />,
  chart: <HomeOutlined />,
  basic: <HomeOutlined />,
  layers: <HomeOutlined />,
}

export default function Main() {
  //在最外层调用react-router-dom提供的钩子，用于读取路由参数/查询字符串
  let [params] = useSearchParams()
  //状态变量 —— 用户信息
  let [userInfo, setUserInfo] = useState({})
  //状态变量 —— 侧边栏是否折叠起来了
  let [collapsed, setCollapsed] = useState(false)
  //状态变量 —— 根据当前用户的权限生成的功能菜单
  let [menuItems, setMenuItems] = useState([])

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
      console.log(data)
      setUserInfo(data)
      //根据获得的用户权限，创建功能菜单中的菜单项
      setMenuItems(generateMenuItems(data.privileges))
    })()
  }, [])
  return (
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
          background: "#0059AA",
          minHeight: "100vh",
          color: "#fff",
          padding: "6px",
        }}
      >
        {/* items：菜单中要显示出来的菜单项数据 */}
        {/* mode：菜单显示模式  horizontal-水平菜单  vertical-竖直菜单  inline-行内菜单 */}
        <Menu items={menuItems} mode="inline" />
      </Layout.Sider>
      {/* 右侧：主体部分 */}
      <Layout>
        {/* 右侧上部：管理员信息 */}
        <Layout.Header
          style={{
            background: "#0059AA",
            color: "#fff",
            borderLeft: "1px solid #fff",
          }}
        >
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
          管理员信息
        </Layout.Header>
        {/* 右侧中部：主体 */}
        <Layout.Content>主体</Layout.Content>
      </Layout>
    </Layout>
  )
}
