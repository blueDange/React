import React, { Component } from 'react'
import './style.css'

export default class ChildClickCounter extends Component {
  state = {
    count: 100,
  }
  constructor() {
    super()
    console.log('声明周期方法1: 组件被创建')
  }
  // 声明周期方法三,组件完成挂载
  componentDidMount() {
    console.log('声明周期方法3: 创建完成')
  }

  // 声明周期方法4: 应该让组件更新吗
  shouldComponentUpdate(newProps, newState) {
    console.log('newProps', newProps) //  修改后的新的props对象
    console.log('newState', newState) // 修改后的新的state对象
    console.log('生命周期方法4: 应该让组件更新吗')
    // if (this.state.count % 2 === 0)
    if (newState.count % 2 === 0) {
      return true
    } else {
      return false
    }
  }

  // 声明周期方法6: 组件完成更新
  componentDidUpdate() {
    console.log('生命周期方法6: 组件完成更新')
  }

  // 声明周期方法7: 组件即将写在
  componentWillUnmount() {
    console.log('生命周期方法7,组件即将卸载')
  }

  add = () => {
    let count = this.state.count + 1
    this.setState({ count }, () => {
      console.log(this.state)
    })
  }
  render() {
    console.log('声明周期方法2/5 : 组件内容渲染')
    return (
      <div className='child'>
        <h3>ChildClickCounter</h3>
        <button onClick={this.add}>当前的点击次数: {this.state.count}</button>
      </div>
    )
  }
}
