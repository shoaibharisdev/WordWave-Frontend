import React from 'react'
import Logo from '../components/Logo'
import { useColorMode } from '@chakra-ui/react';
import {Triangle} from 'react-loader-spinner'
const TestLoader = () => {
    const { colorMode, toggleColorMode } = useColorMode();
  return (
    <div>
         <Triangle
  visible={true}
  height="80"
  width="80"
  color="#fff"
  ariaLabel="triangle-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />

    </div>
  )
}

export default TestLoader