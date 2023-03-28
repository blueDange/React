import { Layout, message } from "antd"
import React, { useEffect, useState } from "react"
import { Outlet, useSearchParams } from "react-router-dom"
import { adminInfo } from "../service"

export default function Main() {
  //在最外层调用react-router-dom提供的钩子，用于读取路由参数/查询字符串
  let [params] = useSearchParams()
  //状态变量 —— 用户信息
  let [userInfo, setUserInfo] = useState({})

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
    })()
  }, [])
  return (
    <Layout>
      {/* 左侧：侧边栏——用户权限 */}
      <Layout.Sider
        style={{ background: "#0059AA", minHeight: "100vh", color: "#fff" }}
      >
        侧边栏
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
          管理员信息
        </Layout.Header>
        {/* 右侧中部：主体 */}
        <Layout.Content>主体</Layout.Content>
        {/* 右侧下部：底部信息栏 */}
        <Layout.Footer>底部信息栏</Layout.Footer>
      </Layout>
    </Layout>
  )
}
