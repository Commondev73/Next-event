import React from 'react'
import { Loader, Placeholder } from 'rsuite'

const Loading = (props) => {
  if (props.show) {
    return <Loader backdrop content="loading..." vertical size="md" className="z-[88] !fixed" />
  }
  return null
}

export default Loading
