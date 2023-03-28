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

/**
 * 8.2、获取当前登录管理员的基础信息及权限信息
 * 接口地址：admin/info
 * 请求方式：GET
 * 请求头部：token - 管理员登录后保存在客户端的身份凭证
 */
export let adminInfo = async () => {
  //1.构建请求地址
  let url = base + "admin/info"
  let options = {
    //提交给服务器最近一次登录后获得的用户身份令牌
    headers: { token: localStorage["adminToken"] },
  }
  //2.显示“加载中”提示进度条
  nProgress.start()
  //3.异步请求
  let res = await fetch(url, options)
  let data = await res.json()
  //4.隐藏“加载中”提示进度条
  nProgress.done()
  //5.返回响应消息主体
  return data
}

/**
 * 8.3、修改当前登录的管理员密码
 * 接口地址：admin/update/pwd
 * 请求方式：POST
 * 请求主体格式：application/json
 * 请求头部：token
 * 请求数据说明：
 *  名称	  必填	类型	说明
 *  token	  是	  string	请求头部中必须携带登录成功后得到的身份令牌，且必须在有效期内
 *  oldPwd	是	  string	原有密码
 *  newPwd	是	  string	新密码
 */
export let adminUpdatePwd = async (oldPwd, newPwd) => {
  //1.构建请求地址
  let url = base + "admin/update/pwd"
  let options = {
    method: "POST",
    headers: {
      token: localStorage["adminToken"], //提交给服务器最近一次登录后获得的用户身份令牌
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ oldPwd, newPwd }),
  }
  //2.显示“加载中”提示进度条
  nProgress.start()
  //3.异步请求
  let res = await fetch(url, options)
  let data = await res.json()
  //4.隐藏“加载中”提示进度条
  nProgress.done()
  //5.返回响应消息主体
  return data
}

/**
 * 8.4、分页获取居民列表
 * 接口地址：admin/household/list
 * 请求方式：GET
 * 请求头部：token - 管理员登录后保存在客户端的身份凭证
 * 请求参数：
 *  名称	    必填	  类型	说明
 *  pageNum	非必需	  number	默认值为1；要查询的页号
 *  kw	    非必需	  string	待查询的居民姓名关键字
 */
export let adminHouseholdList = async (pageNum = 1, kw = "") => {
  //1.构建请求地址
  let url = base + `admin/household/list?pageNum=${pageNum}&kw=${kw}`
  let options = {
    headers: {
      token: localStorage["adminToken"],
      //此处提交token是为了验证当前登录用户是否有权限访问此接口
    },
  }
  //2.显示“加载中”提示进度条
  nProgress.start()
  //3.异步请求
  let res = await fetch(url, options)
  let data = await res.json()
  //4.隐藏“加载中”提示进度条
  nProgress.done()
  //5.返回响应消息主体
  return data
}

/**
 * 8.5、查询特定居民详情
 * 接口地址：admin/household/details
 * 请求方式：GET
 * 请求头部：token - 管理员登录后保存在客户端的身份凭证
 * 请求参数：
 *  名称	必填	类型	说明
 *  hid	必需	number	待查询的居民编号
 */
export let adminHouseholdDetails = async (hid) => {
  //1.构建请求地址
  let url = base + `admin/household/details?hid=` + hid
  let options = {
    headers: {
      token: localStorage["adminToken"],
      //此处提交token是为了验证当前登录用户是否有权限访问此接口
    },
  }
  //2.显示“加载中”提示进度条
  nProgress.start()
  //3.异步请求
  let res = await fetch(url, options)
  let data = await res.json()
  //4.隐藏“加载中”提示进度条
  nProgress.done()
  //5.返回响应消息主体
  return data
}
