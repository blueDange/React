import {View, Text, FlatList, Image, useWindowDimensions} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {base} from '../service';

export default function Swiper({data}) {
  // console.log('接收到父组件传下来的属性数据：', data);
  //获取当前屏幕的宽度
  let windowWidth = useWindowDimensions().width;
  //创建一个子组件的引用，让它指向平面列表
  let carouselList = useRef();
  //状态变量 —— 当前显示哪一张轮播广告
  let [cur, setCur] = useState(0);

  //生命周期方法/副作用方法 —— 当组件获得了轮播数据，且列表项个数大于1时，启用轮播
  useEffect(() => {
    //console.log('Swiper的data值重新渲染了：', data);
    let timer = null; //定时器，每隔一段时间，控制轮播下标变化
    if (data.length > 1) {
      //跳转到下一个轮播广告项
      timer = setInterval(() => {
        let i = cur + 1;
        i = i >= data.length ? 0 : i;
        // console.log(i);
        carouselList.current.scrollToIndex({index: i});
        setCur(i);
      }, 2000);
    }
    return () => {
      //组件被卸载时，或者旧数据即将被清理时执行的操作
      clearInterval(timer); //停止定时器
      timer = null; //释放对象的引用
    };
  }, [data, cur]); //此处需要依赖于data和cur两个变量的修改，立即执行创建新的闭包对象

  //渲染列表中的一个列表项
  let _renderItem = ({item, index}) => {
    //console.log('正在渲染一个列表项,数据下标是：', index, ' 其内容是：', item);
    return (
      <Image
        style={{width: windowWidth, height: (180 * windowWidth) / 600}}
        source={{uri: base + item.pic}}
      />
    );
  };
  return (
    <View>
      {/* 使用FlatList（平面列表）来实现一个轮播广告  */}
      {/* data：必需，列表中要渲染出来的所有数据 */}
      {/* renderItem：必需，如何渲染列表中的一个列表项 */}
      {/* horizontal：是否显示为水平列表 */}
      {/* pagingEnabled：是否启用分页显示（要么显示N，要么显示N+1，不能显示在二者中央 */}
      {/* scrollToIndex()：滚动到指定下标处的元素对应的列表项 */}
      <FlatList
        data={data}
        renderItem={_renderItem}
        horizontal={true}
        pagingEnabled={true}
        ref={carouselList}
      />
    </View>
  );
}
