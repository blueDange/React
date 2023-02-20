import React from "react"
import { Outlet } from "react-router-dom"

export default function Main() {
  return (
    <>
      <div>主界面的顶部</div>
      <div>主界面的左侧</div>
      <div>
        主界面的右侧：
        {/* 子路由页面的显示“出口” */}
        <Outlet />
      </div>
    </>
  )
}
