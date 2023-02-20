import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {base, mallIndex} from '../service';
import Swiper from '../components/Swiper';
import Tabs from '../components/Tabs';

//使用上下文共享数据步骤1：创建并导出上下文对象
export let GoodsTypesContext = React.createContext();
//使用上下文共享数据步骤1：创建并导出上下文对象
export let NavigationContext = React.createContext();

export default function GoodsList({navigation, route}) {
  //状态变量 —— 当前登录用的个人信息
  let [userInfo, setUserInfo] = useState({});
  //状态变量 —— 轮播广告数据
  let [carousels, setCarousels] = useState([]);
  //状态变量 —— 商品类别
  let [goodsTypes, setGoodsTypes] = useState([]);

  //弹出“是否退出登录”对话框
  let showQuit = () => {
    Alert.alert('确认', '您确定要退出登录吗？', [
      {
        text: '确定',
        onPress: () => {
          //导航返回到登录页面
          navigation.goBack();
        },
      },
      {text: '取消'},
    ]);
  };
  //生命周期方法 —— 组件挂载时
  useEffect(() => {
    (async () => {
      //异步的匿名自调函数
      //1.异步请求服务器端数据，获取商城首页数据：用户信息、轮播数据、商品类别
      let data = await mallIndex();
      setUserInfo(data.userInfo); //状态变量的修改都是“异步的”
      setCarousels(data.carousels);
      setGoodsTypes(data.goodsTypes);
      //2.设置标题栏右上角的用户头像——是保存在数据服务器上的动态图片
      navigation.setOptions({
        headerRight: () => (
          //activeOpacity：激活后(即被按下)的不透明度
          <TouchableOpacity activeOpacity={0.6} onPress={showQuit}>
            {/* 作用1：增加onPress事件  作用2：增加点击反馈 */}
            <Image
              style={{width: 36, height: 36}}
              source={{uri: base + data.userInfo.avatar}}
            />
          </TouchableOpacity>
        ),
      });
    })();
  }, []);
  return (
    //“导航上下文”包裹轮播广告和页签组件，因为这两个子组件/孙组件都需要页面跳转
    <NavigationContext.Provider value={navigation}>
      {/* 经典错误：Objects are not valid  as  React child */}
      {/* React中不能使用对象/对象数组进行内容绑定 */}
      {/* <Text>GoodsList: {userInfo}</Text> */}

      {/* F1：轮播广告 —— 自定义的子组件 */}
      <Swiper data={carousels} />
      {/* F2：页签组件（商品+评价+介绍） */}
      {/* 使用上下文共享数据步骤2：创建上下文中的数据 */}
      <GoodsTypesContext.Provider value={goodsTypes}>
        {/* 使用上下文共享数据步骤3：使用上下文对象包裹儿孙们 */}
        <Tabs />
      </GoodsTypesContext.Provider>
    </NavigationContext.Provider>
  );
}
