import React, { Component } from 'react'

export default class App extends Component {
  // 声明一个状态数据(Model)
  state = {
    uname: '神里',
  }
  change = e => {
    console.log(e.target.value)
    this.setState({ uname: e.target.value })
  }
  render() {
    return (
      <div>
        <h3>使用两个数据绑定模拟实现双向数据绑定</h3>
        <input
          placeholder='请输入用户名'
          value={this.state.uname}
          onChange={this.change}
        />
      </div>
    )
  }
}
