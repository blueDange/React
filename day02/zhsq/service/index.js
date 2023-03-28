/*****对服务器端数据API进行二次封装*****/

export let base = 'https://www.codeboy.com/zhsqapi/';

/**
 *
 * 1.2、用户登录
 * 接口地址：user/login
 * 请求方式：POST
 * 请求主体格式：application/json
 * 请求数据说明：
 *  名称	必填	类型	说明
 *  phone	是	string	手机号
 *  pwd	    是	string	密码
 */
export let userLogin = async (phone, pwd) => {
  //1.创建请求地址，和请求选项对象
  let url = base + 'user/login';
  let options = {
    method: 'POST', //请求头部
    headers: {'Content-Type': 'application/json'}, //请求主体
    body: JSON.stringify({phone, pwd}), //请求主体，对请求数据进行JSON序列化
  };
  //2.发起异步请求，等待得到响应消息，再等待读取响应消息主体，得到主体数据
  let res = await fetch(url, options);
  let data = await res.json();
  //3.返回数据
  return data;
};

/**
 * 7.2、返回指定类型的商品列表
 * 接口地址：mall/goods/list
 * 请求方式：GET
 * 请求参数：tid —— 待查询的商品类型(type)，例如：1、2、...
 */
export let mallGoodsList = async (tid = 1) => {
  //1.创建服务器接口地址
  let url = base + 'mall/goods/list?tid=' + tid;
  //2.发起异步请求，等待执行完成后读取响应消息中的数据
  //发起请求，等待，得到响应消息(状态码+原因短句+头部+主体描述信息)
  let res = await fetch(url);
  //读取响应消息主体，等待，读取完成后再执行响应的解析操作(例如：JSON.parse())
  let data = await res.json();
  //3.向外返回响应消息主体数据
  return data;
};
