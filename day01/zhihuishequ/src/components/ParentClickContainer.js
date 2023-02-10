import React, { Component } from 'react'
import ChildClickCounter from './ChildClickCounter'

export default class ParentClickContainer extends Component {
  // 是否显示子组件
  state = {
    showChild: false,
  }
  render() {
    return (
      <div style={{ padding: '10px', background: '#bfb' }}>
        <h3>ParentClickContainer -- 这里是父组件</h3>
        <button
          onClick={() => this.setState({ showChild: !this.state.showChild })}
        >
          隐藏/显示子组件
        </button>
        {/* 父组件内包含着一个子组件  -- 使用短路与运算实现 */}
        {this.state.showChild && <ChildClickCounter />}
      </div>
    )
  }
}
