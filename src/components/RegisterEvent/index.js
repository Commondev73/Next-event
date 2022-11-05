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
import { Search } from '@rsuite/icons'
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
    let result = {}
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
      <Row>
        <Col className="" md={12} sm={24}>
          {!isEmpty(userEventList) && userEventList.docs && (
            <>
              <InputGroup>
                <Input value={search} onChange={(value) => setSearch(value)} />
                <InputGroup.Button onClick={onSearch}>
                  <Search />
                </InputGroup.Button>
              </InputGroup>
              <Table
                data={userEventList.docs}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}
                loading={isLoading}
              >
                <Table.Column width={100} align="center" flexGrow={1} sortable>
                  <Table.HeaderCell>First name</Table.HeaderCell>
                  <Table.Cell dataKey="firstName" />
                </Table.Column>

                <Table.Column width={100} align="center" flexGrow={1} sortable>
                  <Table.HeaderCell>Last name</Table.HeaderCell>
                  <Table.Cell dataKey="lastName" />
                </Table.Column>

                <Table.Column width={100} align="center" flexGrow={1} sortable>
                  <Table.HeaderCell>Phone</Table.HeaderCell>
                  <Table.Cell dataKey="phone" />
                </Table.Column>

                <Table.Column width={100} align="center" flexGrow={1} sortable>
                  <Table.HeaderCell>Seat</Table.HeaderCell>
                  <Table.Cell dataKey="seat" />
                </Table.Column>
              </Table>
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                size="sm"
                layout={['total', '-', 'limit', '|', 'pager']}
                limitOptions={[10, 20, 30, 50]}
                total={userEventList.totalDocs}
                limit={userEventList.limit}
                activePage={userEventList.page}
                onChangePage={handleChangePage}
                onChangeLimit={handleChangeLimit}
              />
            </>
          )}
        </Col>
        <Col className="" md={12} sm={24}>
          {!isEmpty(eventDetail()) && (
            <>
              <Panel>{eventDetail().limit}</Panel>
              <Panel>{eventDetail().quantity}</Panel>
            </>
          )}
          <Panel header={<h3>Register</h3>} bordered>
            <Form model={model} formValue={formValue} onChange={setFormValue} onSubmit={onSubmit}>
              <Form.Group>
                <Form.ControlLabel>Event</Form.ControlLabel>
                <Form.Control
                  name="eventId"
                  accepter={SelectPicker}
                  data={eventList}
                  searchable={false}
                  loading={isLoading}
                  onChange={handleChangeEvent}
                />
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>First name</Form.ControlLabel>
                <Form.Control name="firstName" placeholder="First name" />
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Last name</Form.ControlLabel>
                <Form.Control name="lastName" placeholder="Last name" />
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Phone number</Form.ControlLabel>
                <Form.Control name="phone" placeholder="Phone number" />
              </Form.Group>

              <ButtonToolbar>
                <Button appearance="primary" type="submit">
                  Submit
                </Button>
              </ButtonToolbar>
            </Form>
          </Panel>
        </Col>
      </Row>
    </Container>
  )
}

export default RegisterEvent
