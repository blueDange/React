import {StyleSheet} from 'react-native';

//供屏幕和组件共用的样式变量
export let themeColor = '#090';
export let themeColorLight = '#6EDA0C';
export let themeColorLighter = '#7AC67A';
export let themeColorInverse = '#CC9';
export let themeGreyDark = '#000';
export let themeGrey = '#363636';
export let themeGreyLight = '#8A8A8A';
export let themeGreyLighter = '#F2F2F2';

export let textColor = themeGrey;
export let textColorInverse = '#FFF';
export let textColorGrey = themeGreyLight;
export let textColorPlaceholder = themeGreyLight;
export let textColorDisable = '#C0C0C0';

export let bgColor = '#fff';
export let bgColorGrery = themeGreyLighter;
export let bgColorHover = '#f1f1f1';
export let bgColorMask = 'rgba(0,0,0, 0.4)';

export let borderColor = '#c8c7cc';
export let borderWidth = 1; //注意：RN中的px必需省略
export let borderStyle = 'solid';

export let fontSizeSm = 12;
export let fontSizeBase = 14;
export let fontSizeLg = 16;

export let borderRadiusSm = 2;
export let borderRadiusBase = 3;
export let borderRadiusLg = 6;
export let borderRadiusCircle = '50%';

export let spacingRowSm = 5;
export let spacingRowBase = 10;
export let spacingRowLg = 15;

export let spacingColSm = 4;
export let spacingColBase = 8;
export let spacingColLg = 12;

let gss = StyleSheet.create({
  //供屏幕和组件共用的样式对象
  bordered: {
    //带边框的
    //border: '1px solid #000'  //错误！RN中没有复合样式属性
    borderWidth: borderWidth,
    borderStyle,
    borderColor,
  },
  //ellipsis_1: {     //文本只显示一行，溢出部分用省略号代替  —— RN中需要使用Text组件的numberOfLines / ellipsizeMode属性代替
  //  //whiteSpace    //RN中无此样式
  //  //textOverflow  //RN中无此样式
  //}
});
export default gss;
