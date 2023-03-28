import { SearchOutlined } from "@ant-design/icons"
import { Button, Col, Input, Row, Space, Table, Typography } from "antd"
import React, { useEffect, useState } from "react"
import ResidentModal from "../../components/ResidentModal"
import { adminHouseholdList } from "../../service"

export default function Resident() {
  //状态数据1：待查询的居民数据关键字
  let [kw, setKw] = useState("")
  //状态数据2：当前查询到的居民列表
  let [residentList, setResidentList] = useState([])
  //状态数据3：当前加载到的页号
  let [pageNum, setPageNum] = useState(0)
  //状态数据4：每页可以显示的最大记录条数，即页面大小
  let [pageSize, setPageSize] = useState(6)
  //状态数据5：满足条件的数据总条数
  let [totalRecord, setTotalRecord] = useState(0)
  //状态数据6：当前是否正在加载数据
  let [isLoading, setIsLoading] = useState(false)
  ////////////////////////////////////////////////////////////
  //状态数据：是否显示“居民详情”模态对话框
  let [showResidentDetailsModal, setShowResidentDetailsModal] = useState(false)
  //状态数据：要查询的居民的编号
  let [residentId, setResidentId] = useState(0)

  //加载指定页号对应的数据，参数：num-即将要加载的页号
  let loadData = async (num) => {
    //1.如果当前正在加载中，则退出
    if (isLoading) {
      return
    }
    //2.修改“当前正在加载中吗”为true
    setIsLoading(true)
    //3.异步请求服务器端接口数据
    let data = await adminHouseholdList(num, kw)
    /*****预处理服务器端返回的数据：为每个居民对象添加key属性******/
    data.data.forEach((resident) => (resident.key = resident.hid))
    console.log(data)
    setPageSize(data.pageSize) //页面大小
    setTotalRecord(data.recordCount) //符合条件的数据总数
    setPageNum(data.pageNum) //当前加载的页号
    setResidentList(data.data) //查询到的数据列表
    //4.修改“当前正在加载中吗”为false
    setIsLoading(false)
  }

  //“加载数据”方法调用情形1：当组件挂载完成时，加载第一页数据
  useEffect(() => {
    loadData(1)
  }, [])

  return (
    <div className="content">
      {/* F1: 顶部的标题 */}
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        人口信息
      </Typography.Title>

      {/* F2: 数据操作按钮组 */}
      <Row>
        <Col style={{ flex: 1 }}>
          <Space.Compact>
            <Button>添加新的</Button>
            <Button>批量删除</Button>
            <Button>批量导入</Button>
            <Button>导出当前</Button>
            <Button>导出所有</Button>
          </Space.Compact>
        </Col>
        <Col>
          {/* 留白.紧凑的 */}
          <Space.Compact>
            <Input placeholder="请输入居民姓名搜索词" />
            <Button>
              <SearchOutlined />
            </Button>
          </Space.Compact>
        </Col>
      </Row>

      {/* F3: 数据表格 */}
      <Table
        style={{ marginTop: "10px" }}
        dataSource={residentList}
        columns={[
          { title: "序号", dataIndex: "hid", key: "hid" },
          { title: "编号", dataIndex: "householdId", key: "householdId" },
          {
            title: "居民姓名",
            dataIndex: "householdName",
            key: "householdName",
          },
          {
            title: "性别", //列的标题
            dataIndex: "gender", //当前列要先显示哪个数据属性
            key: "gender", //不同的列指定不同的识别符
            render: (txt) => (txt == 0 ? "女" : "男"), //把文本渲染为一段JSX
          },
          {
            title: "电话",
            dataIndex: "phone",
            key: "phone",
          },
          {
            title: "操作",
            dataIndex: "hid",
            key: "action",
            render: (txt) => (
              <Space>
                <Button
                  size="small"
                  onClick={() => {
                    setResidentId(txt) //设置要显示的居民的编号
                    setShowResidentDetailsModal(true) //显示出来“居民详情”模态框
                  }}
                >
                  详情
                </Button>
                <Button size="small">删除</Button>
                <Button size="small">修改</Button>
              </Space>
            ),
          },
        ]}
        pagination={{
          //表格下方的分页器中的数据
          total: totalRecord, //查询到的总的记录数
          pageSize: pageSize, //每页渲染多少行数据
          onChange: (pno) => loadData(pno), //事件：选中的页号改变——即用户点击了其它页号，参数就是点击的新页号
          //"加载数据"方法调用情形2
        }}
      />
      {/* 模态对话框1：显示某个居民的详细信息 */}
      <ResidentModal
        title="居民详情" //父组件给子组件传递数据
        show={showResidentDetailsModal} //父组件给子组件传递数据
        residentId={residentId} //父组件给子组件传递数据
        doHide={setShowResidentDetailsModal} //父组件把自己的方法传递给子组件，用于实现“子=>父”
      />
      {/* 模态对话框2：修改某个居民的详细信息 */}
      {/* 模态对话框3：添加新的居民信息 */}
    </div>
  )
}
