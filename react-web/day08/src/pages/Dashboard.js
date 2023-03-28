import { Button } from 'antd'
import React from 'react'

export default function Dashboard() {
  return (
    <div>
      <Button
        onClick={() => {
          let e = document.getElementById('container')
          e.requestFullscreen()
        }}
      >
        进入数据大屏
      </Button>
      <div
        id='container'
        style={{ width: '100px', background: 'red', height: '100px' }}
      >
        <Button
          onClick={() => {
            document.exitFullscreen()
          }}
        >
          退出数据大屏
        </Button>
      </div>
    </div>
  )
}
