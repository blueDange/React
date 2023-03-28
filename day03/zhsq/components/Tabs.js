import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Tab0Goods from './Tab0Goods';
import Tab1Comment from './Tab1Comment';
import Tab2Intro from './Tab2Intro';
import {
  fontSizeLg,
  spacingColBase,
  spacingColLg,
  spacingRowBase,
  spacingRowLg,
  themeColor,
  themeGreyLight,
  themeGreyLighter,
} from '../gss';

export default function Tabs() {
  //状态变量 —— 当前显示出来的是哪个页签
  let [curTab, setCurTab] = useState(0); //0-商品  1-评价  2-介绍
  return (
    <View style={{flex: 1}}>
      {/* 页签头部：三个Text可以点击切换下划线 */}
      <View style={ss.tabHeader}>
        <Text
          onPress={() => setCurTab(0)}
          style={[
            ss.tabTitle,
            {borderBottomColor: curTab === 0 ? themeColor : 'transparent'},
          ]}>
          商 品
        </Text>
        <Text
          onPress={() => setCurTab(1)}
          style={[
            ss.tabTitle,
            {borderBottomColor: curTab === 1 ? themeColor : 'transparent'},
          ]}>
          评 价
        </Text>
        <Text
          onPress={() => setCurTab(2)}
          style={[
            ss.tabTitle,
            {borderBottomColor: curTab === 2 ? themeColor : 'transparent'},
          ]}>
          介 绍
        </Text>
      </View>
      {/* 页签主体：三个子组件，某个时刻只能显示其中之一 */}
      <View style={{flex: 1}}>
        {/* 注意：自定义子组件没有style属性，需要的话在外面再套一个View */}
        <View style={{display: curTab === 0 ? 'flex' : 'none'}}>
          <Tab0Goods />
        </View>
        <View style={{display: curTab === 1 ? 'flex' : 'none'}}>
          <Tab1Comment />
        </View>
        <View style={{display: curTab === 2 ? 'flex' : 'none'}}>
          <Tab2Intro />
        </View>
      </View>
    </View>
  );
}

let ss = StyleSheet.create({
  tabHeader: {
    paddingTop: spacingColLg,
    paddingBottom: spacingColBase,
    borderBottomWidth: 1,
    borderBottomColor: themeGreyLight,
    flexDirection: 'row', //弹性容器主轴方向：横向
  },
  tabTitle: {
    fontSize: fontSizeLg + 2,
    paddingHorizontal: spacingRowBase,
    marginHorizontal: spacingRowLg,
    borderBottomColor: themeColor,
    borderBottomWidth: 2,
  },
});
