import {
  View,
  Text,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {mallGoodsDetails, base} from '../service';
import AutoHeightWebView from 'react-native-autoheight-webview';

//路由组件的props都是由路由系统传递进来的，形如：{navigation:导航对象,route:路由对象}
export default function GoodsDetail({navigation, route}) {
  //从props中解构出来navigation：用于导航跳转，和修改标题栏
  //从props中解构出来route：用于读取路由参数
  //状态变量 —— 商品详情
  let [goods, setGoods] = useState({});
  //内部变量 —— 屏幕的宽度
  let windowWidth = useWindowDimensions().width;

  //生命周期方法 —— 当组件挂载时
  useEffect(() => {
    //1.从路由参数中读取上一个页面传递来的数据：要查询的商品的编号
    let {gid} = route.params;
    //console.log('上个页面传来的路由参数-商品编号:', gid);
    //2.根据商品编号，异步请求服务器，查询商品详情
    (async () => {
      let data = await mallGoodsDetails(gid);
      // ! 修改服务器端返回的商品详情
      // 1.
      data.details = data.details.replace(/src="img/g, `src="${base}img`);
      data.details = data.details.replace(/<img/g, `<img style = "width=100%"`);

      setGoods(data);
      //3.根据查询的到商品标题，动态修改当前页面的标题栏标题
      navigation.setOptions({
        title: data.shortTitle, //注意：这里不能使用goods.shortTitle，因为setGoods是异步的
      });
    })();
  }, []);
  return (
    <ScrollView>
      {/* F1: 商品的主图片 */}
      <Image
        style={{style: windowWidth, height: windowWidth}}
        source={{uri: base + goods.mainPic}}
      />
      {/* F2: 商品名称 */}
      <Text>{goods.goodsName}</Text>
      {/* F3: 简单描述 */}
      <Text>{goods.descriptions}</Text>
      {/* F4: 原价 */}
      <Text>
        <Text>价格：</Text>
        <Text>
          ￥{goods.originalPrice ? goods.originalPrice.toFixed(2) : '加载中'}
        </Text>
      </Text>
      {/* F5: 促销价格（可能没有可能有） */}
      <Text>
        <Text>促销价格：</Text>
        <Text>
          ￥
          {goods.originalPrice
            ? Number(goods.originalPrice * goods.discount)
            : '加载中'}
        </Text>
      </Text>
      {/* F6: 两个按钮 */}
      <View>
        {/* 按钮“立即购买” */}
        <TouchableOpacity>
          <Text style={[ss.btn, {}]}>立即购买</Text>
        </TouchableOpacity>
        {/* 按钮“添加到购物车” */}
        <TouchableOpacity>
          <Text style={[ss.btn, {}]}>添加到购物车</Text>
        </TouchableOpacity>
      </View>
      <Text>商品详情:</Text>
      {/* <Text>{goods.details}</Text> */}
      {/* <AutoHeightWebView source={{uri: 'https://baidu.com'}} /> */}
      {/* <AutoHeightWebView
        source={{
          html: '<h1>大号标题</h1> <hr style-"width:50%"  /><hr style-"width:80%"  />',
        }}
      /> */}
      <AutoHeightWebView source={{html: goods.details}} />
    </ScrollView>
  );
}

let ss = StyleSheet.create({
  btn: {},
});
