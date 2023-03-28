import React from "react"
import ReactDOM from "react-dom/client"

//假设：来自服务器端的数据
let list0 = ["#f00", "#0f0", "#00f"]
//需要：把上述的数据映射为如下的JSX数组
// let list1 = [
//   <button>#f00</button>,
//   <button>#0f0</button>,
//   <button>#00f</button>,
// ]

// let list1 = list0.map((c, i) => {
//   return (
//     <button key={i}>
//       {i}-{c}
//     </button>
//   )
// })
// console.log(list1)

const root = ReactDOM.createRoot(document.getElementById("root"))
// root.render(<div>{list1}</div>)
root.render(
  <div>
    {list0.map((c, i) => (
      <button key={i}>{c}</button>
    ))}
  </div>
)
