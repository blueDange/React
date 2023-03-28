import {View, Text} from 'react-native';
import React, {useEffect} from 'react';

//路由组件的props都是由路由系统传递进来的，形如：{navigation:导航对象,route:路由对象}
export default function GoodsDetail({navigation, route}) {
  //从props中解构出来navigation：用于导航跳转，和修改标题栏
  //从props中解构出来route：用于读取路由参数

  //生命周期方法 —— 当组件挂载时
  useEffect(() => {
    //1.从路由参数中读取上一个页面传递来的数据：要查询的商品的编号
    //2.根据商品编号，异步请求服务器，查询商品详情
    //3.根据查询的到商品标题，动态修改当前页面的标题栏标题
    navigation.setOptions({
      title: '小台农芒果',
    });
  }, []);
  return (
    <View>
      <Text>GoodsDetail</Text>
    </View>
  );
}
