import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
//使用上下文共享数据步骤4：儿孙组件导入上下文对象
import {GoodsTypesContext, NavigationContext} from '../screens/GoodsList';
import {
  bgColor,
  bgColorGrery,
  fontSizeBase,
  fontSizeLg,
  spacingColBase,
  spacingColLg,
  spacingColSm,
  spacingRowBase,
  textColor,
  textColorGrey,
  textColorInverse,
  themeColor,
  themeColorLight,
  themeGreyLighter,
} from '../gss';
import {base, mallGoodsList} from '../service';

export default function Tab0Goods(props) {
  // console.log('Tab0Goods的props：', props);
  //注意：此处的props中无法解构出 route 和 navigation —— 只有路由组件才有
  //使用上下文共享数据步骤5：儿孙们读取上下文对象中提供的数据
  let types = useContext(GoodsTypesContext);
  let navigation = useContext(NavigationContext);
  //console.log('孙子组件Tab0Goods读取到的爷爷组件共享的数据：', types);
  //状态变量 —— 当前选中的是哪个商品类别，值是某个类别在数组中的下标
  let [curType, setCurType] = useState(0);
  //状态变量 —— 当前选中类别下所有的商品
  let [goodsList, setGoodsList] = useState([]);
  //局部变量 —— 商品图片宽度 = (屏幕宽度 - 左侧类别列表宽度 - 商品间空白宽度) / 2张图片
  let imgWidth =
    (useWindowDimensions().width - fontSizeLg * 6 - spacingRowBase * 4) / 2;

  //副作用/生命周期方法 —— 当curType数据改变时
  useEffect(() => {
    //console.log('要显示的商品类别改变了：', curType);
    //console.log('TYPES：', types);
    if (types.length > 0) {
      //异步请求服务器端接口数据 —— 获取该类别下的商品列表
      let tid = types[curType].tid; //要查询的类别在数据中的编号
      (async () => {
        //异步的匿名自调函数 —— 外层的副作用方法不允许加async
        let data = await mallGoodsList(tid);
        setGoodsList(data);
      })();
    }
  }, [curType, types]); //curType和types内容发生改变，都要重新执行一次副作用方法
  //总结：依赖列表中声明哪些依赖？  ①副作用方法中使用到的数据  ②该数据还可能发生改变

  //在列表中渲染一个商品类型
  let renderType = ({item, index}) => {
    return (
      <Text
        onPress={() => setCurType(index)}
        style={[
          ss.type,
          {
            backgroundColor: curType === index ? themeColor : themeGreyLighter,
            color: curType === index ? textColorInverse : textColor,
          },
        ]}>
        {item.tname}
      </Text>
    );
  };
  //在商品列表中渲染一个商品
  let renderGoods = ({item, index}) => {
    // console.log(item);
    return (
      //导航跳转时携带参数gid
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate('gdetail', {gid: item.gid})}>
        <View style={ss.goods}>
          {/* 商品图片  */}
          <Image
            style={{width: imgWidth, height: imgWidth}}
            source={{uri: base + item.mainPic}}
          />
          {/* 商品名称 */}
          {/* numberOfLines：文本最多显示几行，如果有溢出用省略号代替 */}
          <Text
            numberOfLines={2}
            style={{
              width: imgWidth,
              fontSize: fontSizeBase + 1,
              marginTop: spacingColSm,
            }}>
            {item.goodsName}
          </Text>
          {/* 当月销售数量 */}
          <Text
            style={{
              fontSize: fontSizeBase,
              color: '#aaa',
              marginTop: spacingColSm,
            }}>
            月售：{item.soldCount}
          </Text>
          {/* 商品价格 */}
          <Text
            style={{
              fontSize: fontSizeLg + 1,
              fontWeight: 'bold',
              marginTop: spacingColSm,
            }}>
            {/* 折扣价 */}
            {item.discount < 1 && (
              <Text style={{color: 'red'}}>
                ￥{Number(item.originalPrice * item.discount).toFixed(2)}
              </Text>
            )}
            {/* 原价 */}
            <Text
              style={{
                textDecorationLine: item.discount < 1 ? 'line-through' : 'none',
              }}>
              ￥{item.originalPrice.toFixed(2)}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={ss.container}>
      {/* 左侧：商品类别列表 */}
      <View style={ss.left}>
        {/* data：指定平面列表要渲染的数据——商品类型 */}
        {/* renderItem：如何渲染一个列表项 */}
        <FlatList data={types} renderItem={renderType} />
      </View>
      {/* 右侧：属于某个类别下的商品列表 —— Z字形列表(一行中显示两个列表项)*/}
      <View style={ss.right}>
        {/* numColumns：一行中显示几个列表项，默认是1 */}
        <FlatList data={goodsList} renderItem={renderGoods} numColumns={2} />
      </View>
    </View>
  );
}

let ss = StyleSheet.create({
  container: {
    flexDirection: 'row', //弹性容器主轴方向：横向
  },
  left: {
    fontSize: fontSizeLg,
    width: fontSizeLg * 6, //左侧宽度固定
    flexShrink: 0, //左侧宽度不参与尺寸收缩 —— 即使右侧宽度不够用
  },
  right: {
    flex: 1, //右侧占剩余全部宽度，弹性子元素尺寸增长权重为1
    backgroundColor: bgColor,
  },
  //一个商品类别
  type: {
    fontSize: fontSizeLg,
    textAlign: 'center',
    paddingVertical: spacingColLg,
  },
  //一个商品
  goods: {
    margin: spacingRowBase,
  },
});
