import axios from 'axios'
import { EndpointConst } from '../constants'

const getEventList = async () => {
  return await axios.get(EndpointConst.EVENT.GET_LIST)
}

module.exports = {
  getEventList
}
