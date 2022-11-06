/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import jwtDecode from 'jwt-decode'
import Auth from '../auth'

// eslint-disable-next-line react/display-name
const WithLogin = (Component) => (props) => {
  const token = Auth.getToken()
  const [profile, setProfile] = useState({})

  useEffect(() => {
    if (token && isEmpty(profile)) {
      getProfile()
    }
  })

  const getProfile = () => {
    const decoded = jwtDecode(token)
    delete decoded.iat
    delete decoded.exp
    if (!isEmpty(decoded)) {
      setProfile(decoded)
    }
  }

  return <Component {...props} profile={profile} />
}

export default WithLogin
