/******服务器端接口封装模块*********/

import nProgress from "nprogress"

export let base = "https://www.codeboy.com/zhsqapi/"

/**
 * 8.1、管理员登录
 * 接口地址：admin/login
 * 请求方式：POST
 * 请求主体格式：application/json
 * 请求数据说明：
 *  名称	必填	类型	说明
 *  aname	是	string	管理员登录名
 *  apwd	是	string	管理员登录密码
 */
export let adminLogin = async (aname, apwd) => {
  //1.构建请求地址
  let url = base + "admin/login"
  let options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ aname, apwd }),
  }
  //2.显示“加载中”提示进度条
  nProgress.start()
  //3.异步请求(fetch)
  let res = await fetch(url, options)
  let data = await res.json()
  //4.隐藏“加载中”提示进度条
  nProgress.done()
  //5.返回响应消息主体
  return data
}


export let adminInfo = async () => {
  //1.构建请求地址
  let url = base + "admin/info"
  let options = {
    headers: { token: localStorage["adminToken"] },
    
  }
  //2.显示“加载中”提示进度条
  nProgress.start()
  //3.异步请求(fetch)
  let res = await fetch(url, options)
  let data = await res.json()
  //4.隐藏“加载中”提示进度条
  nProgress.done()
  //5.返回响应消息主体
  return data
}
