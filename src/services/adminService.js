import axios from 'axios'
import { EndpointConst } from '../constants'

const signUpAuto = async (payload) => {
  return await axios.post(EndpointConst.ADMIN.SIGN_UP_AUTO, payload)
}

const signIn = async (payload) => {
  return await axios.post(EndpointConst.ADMIN.SIGN_IN, payload)
}

const refreshToken = async (refreshToken) => {
  return await axios.get(EndpointConst.ADMIN.REFRESH_TOKEN, {
    headers: {
      Authorization: refreshToken
    }
  })
}

module.exports = { signUpAuto, signIn, refreshToken, }
