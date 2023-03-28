import React from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
  //提示：React中所有的Hook都必须在最顶层调用
  let nav = useNavigate()

  let doLogin = () => {
    //页面跳转到“管理主菜单”
    nav("/admin")
  }
  return (
    <div>
      Login
      <button onClick={doLogin}>登录</button>
      <Link to="/admin">打开主菜单</Link>
    </div>
  )
}
