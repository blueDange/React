import { SearchOutlined } from "@ant-design/icons"
import {
  Button,
  Col,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from "antd"
import React, { useEffect, useState } from "react"
import ResidentAddModal from "../../components/ResidentAddModal"
import ResidentDetailsModal from "../../components/ResidentDetailsModal"
import ResidentUpdateModal from "../../components/ResidentUpdateModal"
import {
  adminHouseholdBatchDelete,
  adminHouseholdDelete,
  adminHouseholdList,
} from "../../service"

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
  //状态数据：是否显示“修改居民信息”模态对话框
  let [showResidentUpdateModal, setShowResidentUpdateModal] = useState(false)
  //状态数据：是否显示“添加居民”模态对话框
  let [showResidentAddModal, setShowResidentAddModal] = useState(false)
  //状态数据：要查询的居民的编号
  let [residentId, setResidentId] = useState(0)
  //状态数据：数据表中当前选中的行的keys
  let [selectedKeys, setSelectedKeys] = useState([])
  //状态数据：是否显示“批量导入”模态对话框
  let [showBatchAddModal, setShowBatchAddModal] = useState(false)

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

  //副作用方法：当加载到的数据为空，但是却显示还有更多页数据，就要加载“当前页-1”页
  useEffect(() => {
    if (residentList.length === 0 && pageNum > 1) {
      loadData(pageNum - 1)
    }
  }, [residentList, pageNum])

  //执行“删除居民记录”操作
  let doDelete = async (hid) => {
    let data = await adminHouseholdDelete(hid)
    if (data.code === 2000) {
      //删除成功，重新加载当前页号数据
      message.success("居民记录删除成功！")
      loadData(pageNum)
    } else {
      //删除失败
      Modal.error({
        title: "错误",
        content: "数据删除失败！服务器端返回错误原因：" + data.msg,
        okText: "确定",
        cancelText: "取消",
      })
    }
  }

  //执行“批量删除”操作
  let doBatchDelete = async () => {
    if (selectedKeys.length === 0) {
      //用户没有选中任何记录，无法删除
      message.error("您尚未选中任何待删除项！")
      return
    }
    //弹出一个模态对话框，让用户确认是否真的要删除
    Modal.confirm({
      title: "确认",
      content: "删除操作无法恢复，您确定要执行吗？",
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        let data = await adminHouseholdBatchDelete(selectedKeys)
        if (data.code === 2000) {
          message.success(data.affected + " 条记录成功删除！")
          loadData(pageNum) //重新加载当前页号对应的数据
        } else {
          //删除失败
          message.error("删除失败！错误消息为：" + data.msg)
        }
      },
    })
  }
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
            <Button onClick={() => setShowResidentAddModal(true)}>
              添加新的
            </Button>
            <Button onClick={doBatchDelete}>批量删除</Button>
            <Button onClick={() => setShowBatchAddModal(true)}>批量导入</Button>
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
      {/* rowSelection：在表格的最左侧添加“多选”列 */}
      <Table
        style={{ marginTop: "10px" }}
        rowSelection={{
          onChange: (keys) => {
            //此处的形参keys就是当前选中的行对应的数据中的key属性值
            setSelectedKeys(keys)
          },
        }}
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
                {/* 弹出式确认框 */}
                <Popconfirm
                  title="确认"
                  description="您确定要删除吗？此操作无法恢复！"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => doDelete(txt)}
                >
                  <Button size="small">删除</Button>
                </Popconfirm>
                <Button
                  size="small"
                  onClick={() => {
                    setResidentId(txt) //设置要查询的居民编号
                    setShowResidentUpdateModal(true) //显示“居民信息更新”模块对话框
                  }}
                >
                  修改
                </Button>
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
      <ResidentDetailsModal
        show={showResidentDetailsModal} //父组件给子组件传递数据
        residentId={residentId} //父组件给子组件传递数据
        doHide={setShowResidentDetailsModal} //父组件把自己的方法传递给子组件，用于实现“子=>父”
      />
      {/* 模态对话框2：修改某个居民的详细信息 */}
      <ResidentUpdateModal
        show={showResidentUpdateModal} //Props Down
        residentId={residentId} //Props Down
        doHide={setShowResidentUpdateModal} //Props Up，父组件只给子组件一个方法，实参需要子组件提供
        refresh={() => loadData(pageNum)} //Props Up  父组件给子组件一个方法，以及必需的实参，直接供子组件调用
      />
      {/* 模态对话框3：添加新的居民信息 */}
      <ResidentAddModal
        show={showResidentAddModal}
        doHide={setShowResidentAddModal}
        refresh={() => loadData(1)} //要想看到最近刚刚添加的记录，只能在第1页查看
      />
      {/* 模态对话框4：批量导入居民数据 */}
      <Modal
        centered //对话框在屏幕正中央显示
        title="批量导入"
        open={showBatchAddModal}
        okText="确定"
        cancelText="取消"
        onCancel={() => setShowBatchAddModal(false)}
        onOk={() => setShowBatchAddModal(false)}
      >
        请选择...
      </Modal>
    </div>
  )
}
