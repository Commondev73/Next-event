import Cookies from 'js-cookie'

const Auth = {
  setToken: (token, refreshToken) => {
    Cookies.set('token', token)
    Cookies.set('refreshToken', refreshToken)
  },
  getToken: () => {
    return Cookies.get('token') || ''
  },
  getRefreshToken: () => {
    return Cookies.get('refreshToken') || ''
  },
  removeToken: () => {
    Cookies.remove('token')
    Cookies.remove('refreshToken')
  }
}

export default Auth
