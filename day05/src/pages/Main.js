import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  HomeOutlined,
  AndroidOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { adminInfo } from '../service'

export default function Main() {
  let [params] = useSearchParams()

  let [userInfo, setUserInfo] = useState({})

  let [collapsed, setCollapsed] = useState(false)

  let [menuItems, setMenuItems] = useState([])
  //生命周期方法/副作用方法 —— 组件挂载完成时
  useEffect(() => {
    //1.弹出欢迎性的“模态对话框”
    //2.调用服务器端接口，获取当前登录用户的信息/权限
    // console.log(params)
    let aname = params.get('aname')
    message.success('欢迎回来' + aname)
    ;(async () => {
      let data = await adminInfo()
      // console.log(data)
      setUserInfo(data)
      //
      setMenuItems([
        { key: 'menu0', label: '首页', icon: <HomeOutlined /> },
        {
          key: 'menu1',
          label: '智慧物业',
          icon: <AndroidOutlined />,
          children: [
            { key: 'menu1-1', label: '物业缴费', icon: <AndroidOutlined /> },
            { key: 'menu1-2', label: '故障报修', icon: <AndroidOutlined /> },
            { key: 'menu1-3', label: '公告管理', icon: <AndroidOutlined /> },
          ],
        },
        { key: 'menu2', label: '社区医院', icon: <PlusOutlined /> },
      ])
    })()
  }, [])
  return (
    <Layout>
      <Layout.Sider
        collapsible={true}
        collapsed={collapsed}
        trigger={null}
        onCollapse={val => setCollapsed(val)}
        style={{ background: '#927bfe', minHeight: '100vh', color: '#fff' }}
      >
        <Menu mode='inline' items={menuItems} />
      </Layout.Sider>
      <Layout>
        <Layout.Header
          style={{
            background: '#927bfe',
            color: '#fff',
            borderLeft: '1px solid #fff',
          }}
        >
          {/* <Button
            onClick={() => {
              setCollapsed(!collapsed)
            }}
          >
            按钮
          </Button> */}
          <DoubleLeftOutlined
            style={{
              marginLeft: '-30px',
              fontSize: '20px',
              display: collapsed ? 'none' : 'inline',
            }}
            onClick={() => {
              setCollapsed(!collapsed)
            }}
          />
          <DoubleRightOutlined
            style={{
              fontSize: '20px',
              display: collapsed ? 'inline' : 'none',
            }}
            onClick={() => {
              setCollapsed(!collapsed)
            }}
          />
          管理员信息
        </Layout.Header>
        <Layout.Content>主</Layout.Content>
        <Layout.Footer>脚</Layout.Footer>
      </Layout>
    </Layout>
  )
}
