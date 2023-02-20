import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  Pressable,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import gss, {
  borderRadiusLg,
  fontSizeBase,
  fontSizeLg,
  spacingColLg,
  spacingRowLg,
  textColorInverse,
  themeColor,
} from '../gss';
//导入“闭眼”和“睁眼”两张图片
let eyeClose = require('../assets/img/eye-close.png');
let eyeOpen = require('../assets/img/eye-open.png');

export default function Login() {
  //调用RN提供的钩子方法，获取屏幕尺寸
  let windowWidth = useWindowDimensions().width;
  //声明状态变量 —— 是否隐藏密码
  let [hidePwd, setHidePwd] = useState(true);
  //声明状态变量 —— 提交按钮的背景颜色
  let [btnBgColor, setBtnBgColor] = useState(themeColor); //#090

  return (
    <>
      {/* F1：顶部状态栏设定 */}
      {/* barStyle：状态栏中图标/文字的颜色，可取值：default、dark-content、light-content */}
      <StatusBar backgroundColor={themeColor} barStyle="light-content" />

      {/* F2: LOGO(手机本地的静态图片) */}
      <Image
        style={[ss.logo, {width: windowWidth * 0.6, height: windowWidth * 0.6}]}
        source={require('../assets/img/logo.png')}
      />

      {/* F3: 手机号输入框组 */}
      <View style={ss.inputGroup}>
        <TextInput
          style={[gss.bordered, ss.input]}
          placeholder="请输入手机号码"
        />
        <Image
          style={ss.iconLeft}
          source={require('../assets/img/cellphone.png')}
        />
        <Image
          style={ss.iconRight}
          source={require('../assets/img/clear.png')}
        />
      </View>

      {/* F4: 密码输入框组 */}
      <View style={[ss.inputGroup, {marginTop: spacingColLg * 2}]}>
        {/* secureTextEntry：是否采用安全的文本输入 */}
        <TextInput
          style={[gss.bordered, ss.input]}
          placeholder="请输入登录密码"
          secureTextEntry={hidePwd}
        />
        <Image style={ss.iconLeft} source={require('../assets/img/lock.png')} />
        {/* Image本身没有onPress事件，只能在外面套一个Pressable组件 */}
        <Pressable style={ss.iconRight} onPress={() => setHidePwd(!hidePwd)}>
          <Image source={hidePwd ? eyeClose : eyeOpen} />
        </Pressable>
      </View>

      {/* F5: 提交按钮 */}
      {/* <Button title="提 交" style={{margin: 10, padding: 100}} /> */}
      {/* Text只有onPress事件（按了一下），没有“开始按下”和“结束按下”事件 */}
      <Pressable
        onPressIn={() => setBtnBgColor('#070')}
        onPressOut={() => setBtnBgColor(themeColor)}>
        <Text style={[ss.btn, {backgroundColor: btnBgColor}]}>提 交</Text>
      </Pressable>

      {/* F6: 忘记密码超链接 —— RN中没有“超链接”概念 */}
      <Text style={ss.link}>忘记密码</Text>
    </>
  );
}

//当前模块内部的样式
let ss = StyleSheet.create({
  //F2：LOGO
  logo: {
    marginTop: spacingColLg * 8, //上方的外间距
    marginLeft: 'auto', //即使不能指定display:block，也可以使用此方式实现左右居中
    marginRight: 'auto',
  },
  //F3
  inputGroup: {
    position: 'relative', //定位方式：相对定位 ——  RN中定位方式只有“相对”和“绝对”
    marginTop: spacingColLg * 5,
    marginHorizontal: spacingRowLg * 2, //水平外间距 = 左外间距+右外间距
    justifyContent: 'center', //弹性容器中的子元素在主轴上居中对齐
  },
  input: {
    borderColor: themeColor,
    borderRadius: borderRadiusLg,
    paddingHorizontal: spacingRowLg * 3, //水平内边距 = 左内边距+右内边距
    fontSize: fontSizeLg,
  },
  iconLeft: {
    position: 'absolute',
    left: 8,
    // top: 0,
    width: 35,
    height: 35,
  },
  iconRight: {
    position: 'absolute',
    right: 10,
    // top: 0,
    width: 28,
    height: 28,
  },
  //F5
  btn: {
    marginTop: spacingColLg * 4,
    marginHorizontal: spacingRowLg * 2,
    backgroundColor: themeColor,
    color: textColorInverse,
    textAlign: 'center',
    paddingVertical: spacingColLg, //竖直方向上的内边距
    borderRadius: borderRadiusLg,
    fontSize: fontSizeLg,
  },
  //F6
  link: {
    marginTop: spacingColLg * 3,
    color: themeColor,
    fontSize: fontSizeLg,
    textAlign: 'center',
  },
});
