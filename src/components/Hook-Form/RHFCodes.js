import { Stack } from '@mui/material'
import React, { useRef } from 'react'

const RHFCodes = ({keyName = '', inputs = [], ...other}) => {
    const codesRef = useRef(null)

  return (
    <Stack direction={"row"} spacing={2} justifyContent="center" ref={codesRef}>
      
    </Stack>
  )
}

export default RHFCodes
