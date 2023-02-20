import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import Device from "./pages/baseinfo/Device"
import HouseInfo from "./pages/baseinfo/HouseInfo"
import Map from "./pages/baseinfo/Map"
import Resident from "./pages/baseinfo/Resident"
import Dashboard from "./pages/Dashboard"
import Door from "./pages/intelligent/Door"
import ParkingRecord from "./pages/intelligent/ParkingRecord"
import ParkingSpace from "./pages/intelligent/ParkingSpace"
import ParkingVehicle from "./pages/intelligent/ParkingVehicle"
import Login from "./pages/Login"
import Main from "./pages/Main"
import Doctor from "./pages/medical/Doctor"
import Register from "./pages/medical/Register"
import Tip from "./pages/medical/Tip"
import NotFound from "./pages/NotFound"
import FeePay from "./pages/property/FeePay"
import FeeQuery from "./pages/property/FeeQuery"
import Notice from "./pages/property/Notice"
import Repair from "./pages/property/Repair"
import Fee from "./pages/statistics/Fee"
import House from "./pages/statistics/House"
import Privilege from "./pages/sysadmin/Privilege"
import Role from "./pages/sysadmin/Role"
import User from "./pages/sysadmin/User"

//创建一个基于浏览器的路由器对象 Router > Routes > Route*N
let router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/index", element: <Login /> },
  { path: "/login", element: <Login /> },
  {
    path: "/admin",
    element: <Main />,
    children: [
      //children属性指定/admin路由下面的嵌套子路由
      //子路由地址为"",它就是父页面中要显示的默认子页面
      { path: "", element: <Dashboard /> },
      { path: "property/fee/pay", element: <FeePay /> },
      { path: "property/fee/query", element: <FeeQuery /> },
      { path: "property/repair", element: <Repair /> },
      { path: "property/notice", element: <Notice /> },
      { path: "medical/register", element: <Register /> },
      { path: "medical/tip", element: <Tip /> },
      { path: "medical/doctor", element: <Doctor /> },
      { path: "intelligent/door", element: <Door /> },
      { path: "intelligent/parking/space", element: <ParkingSpace /> },
      { path: "intelligent/parking/vehicle", element: <ParkingVehicle /> },
      { path: "intelligent/parking/record", element: <ParkingRecord /> },
      { path: "statistics/house", element: <House /> },
      { path: "statistics/fee", element: <Fee /> },
      { path: "baseinfo/house", element: <HouseInfo /> },
      { path: "baseinfo/resident", element: <Resident /> },
      { path: "baseinfo/device", element: <Device /> },
      { path: "baseinfo/map", element: <Map /> },
      { path: "sysadmin/user", element: <User /> },
      { path: "sysadmin/role", element: <Role /> },
      { path: "sysadmin/privilege", element: <Privilege /> },
    ],
  },
  { path: "*", element: <NotFound /> }, //匹配其它不存在的任意地址
])

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<RouterProvider router={router} />)
