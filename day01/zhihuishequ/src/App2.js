import React, { Component } from 'react'

export default class App extends Component {
  // 声明状态变量  -- 购买数量
  state = {
    num: 3,
    age: 17,
    uname: '神里'
  }

  // 声明成员方法 - 用于监听按钮的点击事件
  // f1() {
  //   console.log(this)  // undefined
  // }
  //  解决this指向undefined方案1
  // f1 = () => {
  //   //  ES6中箭头函数不改变this的指向,荏苒之乡当前函数外面的this对象
  //   console.log(this)
  // }
  ///////////////////////////////////////////////////////////////////////////////////



  //  解决this指向undefined方案2
  // f1(id) {
  //   console.log(this)
  //   console.log(id)
  // }


  //////////////////////////////////////////////////////////////////////////////
  //  解决this指向undefined方案3  --- bind
  f1() {
    console.log(this)
  }
  ///////////////////////////////////////////////


  //  解决this指向undefined方案3  --- bind升级版
  constructor() {
    super()
    console.log('一个App类型的实例被创建了')
    this.f2 = this.f1.bind(this)
  }

  render() {
    return (
      <React.Fragment>
        {/* 箭头函数解决this问题 --1 */}
        <button onClick={this.f1}>1+</button> 
        {/* 箭头函数解决this问题 --2 */}
        <button onClick={() => {
          this.f1(8)
        }}>2+</button>
        <button onClick={this.f1.bind(this)}>3+</button> 
        <button onClick={this.f2}>4+</button> 
        <span>{this.state.num}</span>
        <button>-</button>
      </React.Fragment>
    )
  }
}
