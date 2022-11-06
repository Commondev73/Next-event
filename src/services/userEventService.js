import axios from 'axios'
import { EndpointConst } from '../constants'

const getUserEventList = async (eventId, search, page, limit, sortBy, order) => {
  return await axios.get(`${EndpointConst.USER_EVENT.GET_LIST}/${eventId}`, {
    params: { search, page, limit, sortBy, order}
  })
}

const createUserEvent = async (payload) => {
  return await axios.post(EndpointConst.USER_EVENT.CREATE, payload)
}

module.exports = {
  getUserEventList,
  createUserEvent
}
