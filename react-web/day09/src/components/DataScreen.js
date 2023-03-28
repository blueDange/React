import { CloseCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React, { useEffect } from 'react'
import * as datav from '@jiaminghi/data-view-react'

export default function DataScreen({ hide }) {
  //生命周期方法/副作用方法 —— 组件挂载完成
  useEffect(() => {
    //在DOM树上查找#container元素，让其进入全屏模式
    let e = document.getElementById('container')
    e.requestFullscreen() //指定元素请求进入全屏模式
  }, [])
  return (
    <FullScreenContainer
      id='container'
      style={{
        background: "#000 url:('../../public/img/screen.jpg') 100% 100% ",
      }}
    >
      <CloseCircleOutlined
        style={{
          position: 'fixed',
          right: '20px',
          top: '20px',
          color: '#fff',
          fontSize: '25px',
          opacity: 0.5,
        }}
        onClick={() => {
          document.exitFullscreen() //整个文档退出全屏模式
          hide() //通过属性调用父组件的方法，隐藏当前组件
        }}
      />
      {/* <Button>退出数据大屏</Button> */}
    </FullScreenContainer>
  )
}
