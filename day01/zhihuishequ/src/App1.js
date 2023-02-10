import React from 'react'
export default class App extends React.Component {
  // 声明当前组建的模型数据 -- 状态数据  -- 只有状态数据才能实现'响应式'
  state = {  // 重写父类提供的同名属性
    count: 10,
    age: 17,
    uname: '申鹤'
  }
  render() {
    return (
    <div>
      <button onClick={() => {
        // 下属代码只能修改状态变量,不能启动渲染系统重新绘图
        // this.state.count = this.state.count + 1 
        // 下述代码既能修改状态变量,又能启动渲染系统重新绘图
        this.setState({count: this.state.count+1})
        console.log(this.state.count)

      }}>当前点击次数为:{this.state.count}</button>
      <span> {this.state.uname}</span>
      </div>
    )
  }
}