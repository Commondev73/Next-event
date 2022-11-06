import React, { useState, useEffect } from 'react'
import Services from '../../services'
import {
  Container,
  Row,
  Col,
  Form,
  Schema,
  ButtonToolbar,
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
const { StringType } = Schema.Types

const defaultFormValue = {
  firstName: '',
  lastName: '',
  phone: '',
  eventId: ''
}

const RegisterEvent = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [eventList, setEventList] = useState([])
  const [limit, setLimit] = useState(10)
  const [userEventList, setUserEventList] = useState()
  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState()
  const [sortType, setSortType] = useState()
  const [formValue, setFormValue] = useState(defaultFormValue)

  const model = Schema.Model({
    firstName: StringType().isRequired('This field is required.'),
    lastName: StringType().isRequired('This field is required.'),
    phone: StringType()
      .minLength(10, 'Please enter a valid phone number')
      .maxLength(10, 'Invalid phone number')
      .isRequired('This field is required.'),
    eventId: StringType().isRequired('This field is required.')
  })

  useEffect(() => {
    if (isEmpty(eventList)) {
      fetchData()
    }
  })

  useEffect(() => {
    const eventId = formValue.eventId
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
    const eventId = formValue.eventId
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
    const eventId = formValue.eventId
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

  const onSubmit = async (validate) => {
    if (validate) {
      setIsLoading(true)
      try {
        const result = await Services.UserEventService.createUserEvent(formValue)
        if (!isEmpty(result.data)) {
          setFormValue(defaultFormValue)
          setUserEventList({})
          fetchData()
          toaster.push(
            <Message showIcon type="success">
              Success
            </Message>
          )
        }
      } catch (error) {
        toaster.push(
          <Message showIcon type="error">
            error
          </Message>
        )
      }
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <div className="text-black items-center	flex flex-wrap">
        <div className="flex-[1_1_100%] min-w-[100%] lg:flex-[1_1_50%] lg:min-w-[50%]">
          <div className="p-3">
            <Row className="">
              <Col className="text-center" xs={12}>
                <div className="pt-3 bg-white rounded-lg">
                  <div>
                    <Peoples className="w-8 h-8" />
                  </div>
                  <p className="mt-1">ผู้ลงทะเบียนทั้งหมด</p>
                  <h4>{eventDetail().user}</h4>
                </div>
              </Col>
              <Col className="text-center" xs={12}>
                <div className="pt-3 bg-white rounded-lg">
                  <div>
                    <PeoplesCostomize className="w-8 h-8" />
                  </div>
                  <p className="mt-1">สามารถลงทะเบียนได้อีก</p>
                  <h4>{eventDetail().quantity}</h4>
                </div>
              </Col>
              <Col className="flex justify-center" xs={24}>
                <Panel header={<h3>ลงทะเบียนเข้าร่วมงาน</h3>}>
                  <Form
                    fluid
                    model={model}
                    formValue={formValue}
                    onChange={setFormValue}
                    onSubmit={onSubmit}
                  >
                    <Form.Group>
                      <Form.ControlLabel>เลือกงานที่ต้องการเข้าร่วม</Form.ControlLabel>
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

                    <Form.Group>
                      <Form.ControlLabel>ชื่อ</Form.ControlLabel>
                      <Form.Control name="firstName" placeholder="First name" />
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>นามสกุล</Form.ControlLabel>
                      <Form.Control name="lastName" placeholder="Last name" />
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>เบอร์มือถือ</Form.ControlLabel>
                      <Form.Control name="phone" placeholder="Phone number" />
                    </Form.Group>

                    <ButtonToolbar>
                      <Button color="green" appearance="primary" type="submit" block>
                        ลงทะเบียน
                      </Button>
                    </ButtonToolbar>
                  </Form>
                </Panel>
              </Col>
            </Row>
          </div>
        </div>
        <div className="flex-[1_1_100%] min-w-[100%] lg:flex-[1_1_50%] lg:min-w-[50%]">
          <div className="p-3">
            <Panel className="p-2" header={<h4>รายชื่อผู้ลงทะเบียนทั้งหมด</h4>} bodyFill>
              <InputGroup>
                <Input value={search} onChange={(value) => setSearch(value)} />
                <InputGroup.Button onClick={onSearch}>
                  <Search />
                </InputGroup.Button>
              </InputGroup>
              <div>
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
                    <Table.Cell dataKey="firstName" />
                  </Table.Column>

                  <Table.Column width={100} align="center" flexGrow={1} sortable>
                    <Table.HeaderCell>นามสกุล</Table.HeaderCell>
                    <Table.Cell dataKey="lastName" />
                  </Table.Column>

                  <Table.Column width={100} align="center" flexGrow={1} sortable>
                    <Table.HeaderCell>เบอร์มือถือ</Table.HeaderCell>
                    <Table.Cell dataKey="phone" />
                  </Table.Column>

                  <Table.Column width={100} align="center" flexGrow={1} sortable>
                    <Table.HeaderCell>ที่นั่ง</Table.HeaderCell>
                    <Table.Cell dataKey="seat" />
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
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default RegisterEvent
