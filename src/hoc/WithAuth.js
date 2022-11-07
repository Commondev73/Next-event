import React from 'react'

const RequireAuthentication = (gssp) => async (ctx) => {
  const token = ctx.req.cookies.token
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: '/admin'
      }
    }
  }
  const gsspData = await gssp(ctx)
  return {
    props: {
      ...gsspData.props
    }
  }
}

export default RequireAuthentication
