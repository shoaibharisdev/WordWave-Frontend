import { useColorMode } from '@chakra-ui/react'
import React from 'react'
import { Triangle } from 'react-loader-spinner'
const TriangleSpinner = () => {
    const {colorMode,setColorMode}=useColorMode()

  return (
    <Triangle
  visible={true}
  height="80"
  width="80"
  color={colorMode==='dark'? '#fff':'black'}
  ariaLabel="triangle-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
  )
}

export default TriangleSpinner