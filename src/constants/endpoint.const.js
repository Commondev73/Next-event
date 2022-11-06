const baseUrl = process.env.NEXT_PUBLIC_API_URL

// POST   /api/auth/sign-in
// POST   /api/auth/sign-up
// POST   /api/auth/refresh-token
// GET    /api/auth/sign-up-auto

// GET    /api/event/list
// GET    /api/event/:id
// GET    /api/event/create-auto
// POST   /api/event/create

// GET    /api/user-event/list/:id
// POST   /api/user-event/create
// PUT    /api/user-event/update

export const EndpointConst = {
  EVENT: {
    GET_LIST: `${baseUrl}/api/event/list`,
  },
  USER_EVENT: {
    GET_LIST: `${baseUrl}/api/user-event/list`,
    CREATE: `${baseUrl}/api/user-event/create`,
  },
  ADMIN: {
    SIGN_IN: `${baseUrl}/api/auth/sign-in`,
    REFRESH_TOKEN: `${baseUrl}/api/auth/refresh-token`,
    SIGN_UP_AUTO: `${baseUrl}/api/auth/sign-up-auto`,
  }
}
