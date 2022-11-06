import React, { useState, useEffect } from 'react'
import Services from '../../services'
import Auth from '../../auth'
import Loading from '../../common/Loading'
import { useRouter } from 'next/router'
import {
  Container,
  Col,
  Form,
  ButtonToolbar,
  Button,
  Panel,
  Row,
  Schema,
  Message,
  toaster
} from 'rsuite'
import { isEmpty } from 'lodash'
const { StringType } = Schema.Types

const defaultFormValue = {
  userName: '',
  password: ''
}

const AdminLogin = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formValue, setFormValue] = useState(defaultFormValue)

  const model = Schema.Model({
    userName: StringType().isRequired('This field is required.'),
    password: StringType().isRequired('This field is required.')
  })

  const onSubmit = async (validate) => {
    if (validate) {
      setIsLoading(true)
      try {
        const result = await Services.AdminService.signIn(formValue)
        if (!isEmpty(result.data)) {
          const { data = {} } = result.data
          Auth.setToken(data.token, data.refreshToken)
          return router.push('/admin/event')
        }
      } catch (error) {
        console.log(error)
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
    <>
      <Loading show={true} />
      <Container className="mt-5 mb-5">
        <Panel className="bg-white" header={<h3>เข้าสู่ระบบ</h3>}>
          <Form
            fluid
            model={model}
            formValue={formValue}
            onChange={setFormValue}
            onSubmit={onSubmit}
          >
            <Form.Group>
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control name="userName" placeholder="Username" />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control name="password" placeholder="Password" />
            </Form.Group>

            <ButtonToolbar>
              <Button color="green" appearance="primary" type="submit" block>
                เข้าสู่ระบบ
              </Button>
            </ButtonToolbar>
          </Form>
        </Panel>
      </Container>
    </>
  )
}

export default AdminLogin
