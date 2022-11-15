import React from 'react';
import './styles/globals.css'
import {
  ChakraProvider,
  Box,
  theme,
  Flex,
} from '@chakra-ui/react';
import BackgroundView from './components/BackgroundView'
import Navigation from './components/Navigation/Navigation';
import Parameditor from './components/Parameditor';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Flex bg="#F9FAFC" p="6"  h="100vh" zIndex={-3}>
        <Box zIndex={2}>
          <Navigation />
        </Box>
        <Box zIndex={2}>
          <Parameditor />
        </Box>
        <Box>
          <BackgroundView zIndex={-5}/>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
