import React from 'react'
import { Loader, Placeholder } from 'rsuite'

const Loading = (props) => {
  if (props.show) {
    return (
      <div>
        <Loader backdrop content="loading..." vertical size="md" className="z-[88]" />
      </div>
    )
  }
  return null
}

export default Loading
