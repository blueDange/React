import { Button } from "antd"
import React from "react"

export default function Dashboard() {
  return (
    <div>
      <Button
        onClick={() => {
          let e = document.getElementById("container")
          e.requestFullscreen() //指定元素请求进入全屏模式
        }}>
        进入数据大屏
      </Button>
      <div
        id="container"
        style={{ width: "300px", height: "100px", background: "#ff0" }}>
        <Button
          onClick={() => {
            document.exitFullscreen() //整个文档退出全屏模式
          }}>
          退出数据大屏
        </Button>
      </div>
    </div>
  )
}
