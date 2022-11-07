import React, { useState, useEffect } from 'react'
import Services from '../../services'
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  SelectPicker,
  Panel,
  Message,
  toaster,
  Table,
  Pagination,
  Input,
  InputGroup
} from 'rsuite'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { Search, Peoples, PeoplesCostomize } from '@rsuite/icons'

const AdminEvent = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [eventList, setEventList] = useState([])
  const [limit, setLimit] = useState(10)
  const [userEventList, setUserEventList] = useState()
  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState()
  const [sortType, setSortType] = useState()
  const [eventId, setEventId] = useState()

  useEffect(() => {
    if (isEmpty(eventList)) {
      fetchData()
    }
  })

  useEffect(() => {
    if (eventId) {
      fetchDataUserEventList(eventId)
    }
  }, [
    router.query.search,
    router.query.limit,
    router.query.page,
    router.query.sortBy,
    router.query.order
  ])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const result = await Services.EventService.getEventList()
      if (!isEmpty(result.data)) {
        const { data = {} } = result.data
        const list = data.map((item) => ({
          label: item.name,
          value: item._id,
          limit: item.limit,
          user: item.user,
          quantity: item.limit - item.user
        }))
        setEventList(list)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const fetchDataUserEventList = async (eventId) => {
    if (eventId) {
      setIsLoading(true)
      try {
        const result = await Services.UserEventService.getUserEventList(
          eventId,
          getCurrentSearch(),
          getCurrentPage(),
          limit,
          sortColumn,
          sortType
        )
        if (!isEmpty(result.data)) {
          const { data = {} } = result.data
          setUserEventList(data)
        }
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
  }

  const eventDetail = () => {
    let result = { user: '-', quantity: '-' }
    if (!isEmpty(eventList) && eventId) {
      return eventList.find((i) => i.value === eventId)
    }
    return result
  }

  const getCurrentSearch = () => {
    return router.query.search || ''
  }

  const getCurrentPage = () => {
    const page = router.query.page ? parseInt(router.query.page) : 1
    if (page <= 0) {
      return 1
    }
    return page
  }

  const handleChangeEvent = async (eventId) => {
    setEventId(eventId)
    setSearch('')
    router.push(
      {
        pathname: router.pathname,
        query: {}
      },
      undefined,
      { shallow: true }
    )
    fetchDataUserEventList(eventId)
  }

  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn)
    setSortType(sortType)
    router.push(
      {
        pathname: router.pathname,
        query: {
          search: getCurrentSearch(),
          page: getCurrentPage(),
          limit,
          sortBy: sortColumn,
          order: sortType
        }
      },
      undefined,
      { shallow: true }
    )
  }

  const handleChangeLimit = (limit) => {
    const { sortBy, order } = router.query
    setLimit(limit)
    router.push(
      {
        pathname: router.pathname,
        query: { search: getCurrentSearch(), page: getCurrentPage(), limit, sortBy, order }
      },
      undefined,
      { shallow: true }
    )
  }

  const handleChangePage = (selected) => {
    const { sortBy, order } = router.query
    router.push(
      {
        pathname: router.pathname,
        query: { search: getCurrentSearch(), page: selected, limit, sortBy, order }
      },
      undefined,
      { shallow: true }
    )
  }

  const onSearch = () => {
    const { sortBy, order } = router.query
    if (eventId) {
      router.push(
        {
          pathname: router.pathname,
          query: { search, page: getCurrentPage(), limit, sortBy, order }
        },
        undefined,
        { shallow: true }
      )
      fetchDataUserEventList(eventId)
    }
  }

  const handleChange = (id, key, value) => {
    const nextData = Object.assign([], userEventList?.docs || [])
    nextData.find((item) => item.id === id)[key] = value
  }

  const handleEditState = (id) => {
    const nextData = Object.assign([], userEventList?.docs || [])
    const activeItem = nextData.find((item) => item.id === id)
    activeItem.status = activeItem.status ? null : 'EDIT'
    if (!activeItem.status) {
      onUpdate(activeItem)
    }
    userEventList.docs = nextData
    setUserEventList({
      ...userEventList
    })
  }

  const onUpdate = async (value) => {
    setIsLoading(true)
    try {
      const result = await Services.UserEventService.updateUserEvent(value)
      if (!isEmpty(result.data)) {
        toaster.push(
          <Message showIcon type="success">
            Success
          </Message>
        )
      }
    } catch (error) {
      console.log(error)
      fetchDataUserEventList(eventId)
      toaster.push(
        <Message showIcon type="error">
          {error?.response?.data?.message || 'error'}
        </Message>
      )
    }
    setIsLoading(false)
  }

  const EditableCell = ({ rowData, dataKey, onChange, ...props }) => {
    const editing = rowData.status === 'EDIT'
    return (
      <Table.Cell {...props} className={editing ? 'table-content-editing' : ''}>
        {editing ? (
          <input
            className="rs-input !p-0"
            defaultValue={rowData[dataKey]}
            onChange={(event) => {
              onChange && onChange(rowData.id, dataKey, event.target.value)
            }}
          />
        ) : (
          <span className="table-content-edit-span">{rowData[dataKey]}</span>
        )}
      </Table.Cell>
    )
  }

  const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
    return (
      <Table.Cell {...props} style={{ padding: '6px' }}>
        <Button
          appearance="link"
          onClick={() => {
            onClick(rowData.id)
          }}
        >
          {rowData.status === 'EDIT' ? 'Save' : 'Edit'}
        </Button>
      </Table.Cell>
    )
  }

  return (
    <Container className="my-5">
      <Row className="w-full h-screen text-black items-center">
        <Col className="text-center" xs={12} md={8}>
          <div className="pt-3 bg-white rounded-lg">
            <div>
              <Peoples className="w-8 h-8" />
            </div>
            <p className="mt-1">ผู้ลงทะเบียนทั้งหมด</p>
            <h4>{eventDetail().user}</h4>
          </div>
        </Col>
        <Col className="text-center" xs={12} md={8}>
          <div className="pt-3 bg-white rounded-lg">
            <div>
              <PeoplesCostomize className="w-8 h-8" />
            </div>
            <p className="mt-1">สามารถลงทะเบียนได้อีก</p>
            <h4>{eventDetail().quantity}</h4>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <Panel>
            <Form fluid>
              <Form.Group>
                <Form.ControlLabel>เลือกงาน</Form.ControlLabel>
                <Form.Control
                  className="w-full"
                  name="eventId"
                  accepter={SelectPicker}
                  data={eventList}
                  searchable={false}
                  loading={isLoading}
                  onChange={handleChangeEvent}
                />
              </Form.Group>
            </Form>
          </Panel>
        </Col>
        <Col xs={24}>
          <Panel header={<h4>รายชื่อผู้ลงทะเบียนทั้งหมด</h4>} bodyFill>
            <InputGroup>
              <Input
                value={search}
                placeholder="ค้นหา ชื่อ /นามสกุล /เบอร์"
                onChange={(value) => setSearch(value)}
              />
              <InputGroup.Button onClick={onSearch}>
                <Search />
              </InputGroup.Button>
            </InputGroup>
            <Table
              height={450}
              className="mt-3 rounded-t-lg bg-white"
              data={userEventList?.docs}
              sortColumn={sortColumn}
              sortType={sortType}
              onSortColumn={handleSortColumn}
              loading={isLoading}
            >
              <Table.Column width={100} align="center" flexGrow={1} sortable>
                <Table.HeaderCell>ชื่อ</Table.HeaderCell>
                <EditableCell dataKey="firstName" onChange={handleChange} />
              </Table.Column>

              <Table.Column width={100} align="center" flexGrow={1} sortable>
                <Table.HeaderCell>นามสกุล</Table.HeaderCell>
                <EditableCell dataKey="lastName" onChange={handleChange} />
              </Table.Column>

              <Table.Column width={100} align="center" flexGrow={1} sortable>
                <Table.HeaderCell>เบอร์มือถือ</Table.HeaderCell>
                <EditableCell dataKey="phone" onChange={handleChange} />
              </Table.Column>

              <Table.Column width={100} align="center" flexGrow={1} sortable>
                <Table.HeaderCell>ที่นั่ง</Table.HeaderCell>
                <EditableCell dataKey="seat" onChange={handleChange} />
              </Table.Column>

              <Table.Column width={100} align="center" flexGrow={1}>
                <Table.HeaderCell>...</Table.HeaderCell>
                <ActionCell dataKey="id" onClick={handleEditState} />
              </Table.Column>
            </Table>
            <Pagination
              className="p-2 rounded-b-lg bg-white"
              prev
              next
              ellipsis
              boundaryLinks
              maxButtons={5}
              size="sm"
              layout={['total', '-', 'limit', '|', 'pager']}
              limitOptions={[10, 20, 30, 50]}
              total={userEventList?.totalDocs}
              limit={userEventList?.limit}
              activePage={userEventList?.page}
              onChangePage={handleChangePage}
              onChangeLimit={handleChangeLimit}
            />
          </Panel>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminEvent
