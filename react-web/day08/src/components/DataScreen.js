import { Button } from 'antd'
import React, { useState } from 'react'

export default function DataScreen() {
  let [showDataScreen, setShowDataScreen] = useState(false)
  return (
    <div>
      <Button
        onClick={() => {
          setShowDataScreen(true)
          let e = document.getElementById('container')
          e.requestFullscreen()
        }}
      >
        进入数据大屏
      </Button>
      {showDataScreen && <DataScreen />}
    </div>
  )
}
