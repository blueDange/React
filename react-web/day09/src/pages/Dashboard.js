import { Button } from 'antd'
import React, { useState } from 'react'
import DataScreen from '../components/DataScreen'

export default function Dashboard() {
  //状态变量 —— 是否显示数据大屏(DataScreen)组件
  let [showDataScreen, setShowDataScreen] = useState(false)
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button
        onClick={() => {
          //显示DataScreen组件
          setShowDataScreen(true)
        }}
      >
        进入数据大屏
      </Button>
      {/* 如果showDataScreen为true，则在DOM树上挂载DataScreen组件 */}
      {showDataScreen && <DataScreen hide={() => setShowDataScreen(false)} />}
    </div>
  )
}
