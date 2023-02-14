import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  Pressable,
  Alert,
  AsyncStorage,
  ToastAndroid,
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
import {mallGoodsList, userLogin} from '../service';
//导入“闭眼”和“睁眼”两张图片
let eyeClose = require('../assets/img/eye-close.png');
let eyeOpen = require('../assets/img/eye-open.png');

export default function Login({navigation, route}) {
  //调用RN提供的钩子方法，获取屏幕尺寸
  let windowWidth = useWindowDimensions().width;
  //声明状态变量 —— 是否隐藏密码
  let [hidePwd, setHidePwd] = useState(true);
  //声明状态变量 —— 提交按钮的背景颜色
  let [btnBgColor, setBtnBgColor] = useState(themeColor); //#090
  //声明状态变量 —— 手机号码
  let [phone, setPhone] = useState('13501234567');
  //声明状态变量 —— 登录密码
  let [upwd, setUpwd] = useState('123456');

  //处理“登录”按钮的单击事件
  let doLogin = async () => {
    // console.log('用户当前输入的值：', phone, upwd);
    // 1.验证手机号输入是否格式正确
    let p = phone.trim();
    if (p.length === 0 || !/^1[3-9]\d{9}$/.test(p)) {
      Alert.alert('错误', '手机号码格式错误', [{text: '确定'}]); //弹出警告框
      return;
    }
    // 2.验证密码输入是否格式正确
    let u = upwd.trim();
    if (u.length < 6 || u.length > 18) {
      Alert.alert('错误', '密码长度必须在6~18之间', [{text: '确定'}]);
      return;
    }
    // 3.异步提交数据给服务器接口，验证登录正确性
    let data = await userLogin(p, u);
    if (data.code === 2000) {
      //登录成功
      //①在客户端保存此次登录后服务器返回的身份令牌
      AsyncStorage.setItem('userToken', data.token, () => {
        console.log('客户端成功保存了此次登录获得的身份令牌');
      });
      //②弹出一个欢迎回来对话框——不紧急可以使用“吐司对话框”
      ToastAndroid.show('欢迎回来：' + p, ToastAndroid.LONG);
      // console.log('SHORT:', ToastAndroid.SHORT);   //0
      // console.log('LONG:', ToastAndroid.LONG);     //1
      //③跳转到下一个页面(商城列表)
      navigation.navigate('glist');
    } else {
      //登录失败
      Alert.alert('错误', '登录失败！服务器返回错误原因：' + data.msg, [
        {text: '确定'},
      ]);
    }
  };
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
      {/* onChangeText：监视输入框的内容改变事件，形参就是用户的最新输入 */}
      <View style={ss.inputGroup}>
        <TextInput
          style={[gss.bordered, ss.input]}
          placeholder="请输入手机号码"
          value={phone}
          onChangeText={txt => setPhone(txt)}
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
          value={upwd}
          onChangeText={txt => setUpwd(txt)}
        />
        <Image style={ss.iconLeft} source={require('../assets/img/lock.png')} />
        {/* Image本身没有onPress事件，只能在外面套一个Pressable组件 */}
        <Pressable style={ss.iconRight} onPress={() => setHidePwd(!hidePwd)}>
          <Image source={hidePwd ? eyeClose : eyeOpen} />
        </Pressable>
      </View>

      {/* F5: 提交按钮 */}
      {/* <Button title="提 交"*/}
      {/* Text只有onPress事件（按了一下），没有“开始按下”和“结束按下”事件 */}
      <Pressable
        onPress={doLogin}
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
