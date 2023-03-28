import {View, Text, StatusBar, Image} from 'react-native';
import React from 'react';
import {themeColor} from '../gss';
//导入服务器端的图片，Webpack就会把它打包入App
//Webpack支持的导入语法：CJS、ES6、AMD、CMD
let logo1 = require('../assets/img/logo.png'); //CJS导入语法
import logo2 from '../assets/img/logo.png'; //ES6导入语法

export default function Login() {
  return (
    <>
      {/* F1：顶部状态栏设定 */}
      {/* barStyle：状态栏中图标/文字的颜色，可取值：default、dark-content、light-content */}
      <StatusBar backgroundColor={themeColor} barStyle="light-content" />
      {/* F2: LOGO */}

      {/* 使用本地（手机中的）图片 */}
      {/* <Image source={logo1} /> */}
      {/* <Image source={logo2} /> */}
      <Image source={require('../assets/img/logo.png')} />

      {/* 使用远程服务器上的图片 */}
      <Image
        style={{width: 300, height: 100}}
        source={{uri: 'https://www.codeboy.com/image/index/jd3.jpg'}}
      />

      {/* F3: 手机号输入框组 */}
      {/* F4: 密码输入框组 */}
      {/* F5: 提交按钮 */}
      {/* F6: 忘记密码超链接 */}
    </>
  );
}
