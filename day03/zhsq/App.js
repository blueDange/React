import {View, Text} from 'react-native';
import React from 'react';
import Login from './screens/Login';
import GoodsList from './screens/GoodsList';
import GoodsDetail from './screens/GoodsDetail';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {textColorInverse, themeColor} from './gss';

//创建原生的栈式导航器，获得“导航器(路由词典)”和“屏幕(路由)”对象
let {Navigator, Screen} = createNativeStackNavigator();

//每个屏幕配置标题栏的公共选项
let headerOptions = {
  headerTitleAlign: 'center', //标题字对齐方式
  headerStyle: {backgroundColor: themeColor}, //头部样式.背景颜色
  headerTintColor: textColorInverse, //头部着色颜色(即文字颜色)
  title: '智慧社区',
};

export default function App() {
  return (
    //VueRouter：       Router                >   Routes      >   Route
    //ReactNavigation： NavigationContainer   >   Navigator   >   Screen
    <NavigationContainer>
      {/* 初始路由名称：指定App的默认首页 */}
      <Navigator initialRouteName="login">
        {/* 如果没有指定“初始路由名称”,路由列表中的第一个页面就是默认首页 */}
        <Screen
          name="login"
          component={Login}
          options={{
            headerShown: false, //是否显示顶部标题栏
          }}
        />
        <Screen
          name="glist"
          component={GoodsList}
          options={{
            ...headerOptions,
            title: '社区商城',
            // headerTitleAlign: 'center', //标题字对齐方式
            // headerStyle: {backgroundColor: themeColor}, //头部样式.背景颜色
            // headerTintColor: textColorInverse, //头部着色颜色(即文字颜色)
          }}
        />
        <Screen
          name="gdetail"
          component={GoodsDetail}
          options={{
            ...headerOptions,
            title: '商品详情',
          }}
        />
        {/* RN应用中不需要编写404页面——没有浏览器地址栏 */}
        {/* <Screen name="*" component={NotFound}/> */}
      </Navigator>
    </NavigationContainer>
  );
}
