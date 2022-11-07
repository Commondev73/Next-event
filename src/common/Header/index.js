import React from 'react'
import WithLogin from '../../hoc/WithLogin'
import Auth from '../../auth'
import { isEmpty } from 'lodash'
import { Header, Navbar, Nav } from 'rsuite'
import { Admin } from '@rsuite/icons'

const Head = (props) => {
  const logout = () => {
    Auth.removeToken()
    window.location.href = '/admin'
  }

  return (
    <Header>
      <Navbar className='!bg-slate-800 !text-white px-3'>
        <Navbar.Brand>ADMIN LOGIN</Navbar.Brand>
        {!isEmpty(props.profile) ? (
          <Nav pullRight>
            <Nav.Menu title={props.profile.firstName} icon={<Admin />}>
              <Nav.Item onClick={logout}>ออกจากระบบ</Nav.Item>
            </Nav.Menu>
          </Nav>
        ) : null}
      </Navbar>
    </Header>
  )
}

export default WithLogin(Head)
