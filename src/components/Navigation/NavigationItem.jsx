import React, { useState } from 'react'

import {
    Flex,
    Text,
    Link,
    Icon,
    Menu,
    MenuButton,
  } from '@chakra-ui/react'

  import {
    FiTrendingUp,
    FiStar,
    FiSettings,

  } from 'react-icons/fi';


  import { TimeIcon } from '@chakra-ui/icons'

  

  const LinkItems = [
    { name: 'Scenario Parameters', icon: FiSettings },
    { name: 'Resource Parameters', icon: FiTrendingUp },
    { name: 'Timetable', icon: TimeIcon },
    { name: 'Activity', icon: FiStar },
    { name: 'Gateway Logic', icon: FiStar },
  ];


function NavigationItem(props) {


  return (
        <>
        {LinkItems.map((link) => (
           <>
            <Flex w="100%">
                <Menu placement="right">
                    <Link
                        backgroundColor={link.name === props.current? "#AEC8CA" : "#FFFF" }
                        p={3}
                        borderRadius={8}
                        _hover={{ backgroundColor: "#AEC8CA" }}
                        transition="background-color 400ms linear"
                    >
                        <MenuButton w="100%" onClick={() => props.setCurrent(link.name)}>
                            <Flex alignItems='center' >
                                <Flex 
                                borderRadius='lg' bg="#FFFF" color='white' h={7} w={7} justifyContent='center' alignItems='center' >
                                    <Icon as={link.icon} fontSize="md" color={"RGBA(0, 0, 0, 0.64)"} />
                                </Flex>
                                
                                <Text ml={5} fontSize="sm" color="RGBA(0, 0, 0, 0.64)" fontWeight="bold" display="flex">{link.name}</Text>
                            </Flex>
                        </MenuButton>
                    </Link>
                    </Menu>
                </Flex>
            </>
      ))}
      </>    
  )
  }
  export default NavigationItem;
  