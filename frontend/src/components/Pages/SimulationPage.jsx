import React, { useState, useRef } from "react";
import {
    Flex, Heading, Card, CardHeader, CardBody, Text, Select, Stack, Button, Progress, Box, Textarea
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import axios from 'axios';



function SimulationPage(props){

    const [started, setStarted] = useState(false)
    const [finished, setFinished] = useState(false)
    const [response, setResponse] = useState({})


    const CancelToken = axios.CancelToken;
    const source = useRef(null)
    

   

    const start = () => {
        setResponse({message: ""})
        setFinished(false)
        setStarted(true)


    source.current  = CancelToken.source()
        axios
        .get(
            "http://127.0.0.1:8000/startScylla",
            {
                cancelToken: source.current.token
            }
        )
        .then(async (r) => {
            setResponse(r.data)
            setFinished(true)
            setStarted(false)
            props.toasting("success", "Success", "Request was successful")})
            
        .catch((err) => {
              if (axios.isCancel(err)) {
                props.toasting("success", "Success", "Request was canceled")
            
            } else {
                props.toasting("error", "error", "Request was not successful")
                
            }
        })
    
    }

    const abort = () => {
        console.log("abort")
        source.current.cancel('Operation canceled by the user.');
        setStarted(false)
        setResponse({message: "canceled"})
    }



    return (
        <Box h="93vh" overflowY="auto" p="5" >
        <Stack gap="2">
        <Heading size='lg' >Run Simulation</Heading>

        {started&& 
        <Card bg="white" p="5" >
            <Progress isIndeterminate isAnimated hasStripe value={100} colorScheme="green" />
        </Card>}

        {finished&& 
        <Card bg="white" p="5" >
            <Progress  hasStripe value={100} colorScheme="green" />
        </Card>}
            <Card bg="white">
                <CardHeader>
                    <Heading size='ms'> Simulation settings </Heading>
                </CardHeader>
                <CardBody>
                  
                    <Flex
                        gap="5"
                        flexDirection="row"
                        alignItems="end"
                        mt="-4"
                        >               
                            <Box>
                                <Text fontSize="s" textAlign="start" color="#485152" fontWeight="bold" > Select scenario:</Text>
                                <Select placeholder = 'choose scenario' width = '100%' color="darkgrey" backgroundColor= 'white' icon={<FiChevronDown />}>
                                {props.data.map((scenario, index) => {
                                return  <option value= {scenario.scenarioName} onClick={() =>  props.setScenario(index)}>{scenario.scenarioName}</option>
                                })}
                                </Select>
                            </Box>
                            <Box>
                                <Text fontSize="s" textAlign="start" color="#485152" fontWeight="bold" > Select simulator:</Text>
                                <Select placeholder = 'choose simulator' width = '100%' color="darkgrey"  backgroundColor= 'white' icon={<FiChevronDown />}>
                                    <option value='Simod'>Simod</option>
                                    <option value='Option 2'>Option 2</option>
                                    <option value='Option 3'>Option 3</option>
                                </Select>
                            </Box>
                            
                            {!started&& 
                            <Button variant="outline" bg="#FFFF" onClick={start} >
                                <Text color="RGBA(0, 0, 0, 0.64)" fontWeight="bold">Start Simulation</Text>
                            </Button>}

                            {started&& 
                            <Button variant="outline" bg="#FFFF" onClick={abort}>
                                <Text color="RGBA(0, 0, 0, 0.64)" fontWeight="bold">Abort Simulation</Text>
                            </Button>
                            }

                        </Flex>
                </CardBody>
            </Card>

            <Card bg="white">
                <CardHeader>
                    <Heading size='ms'> Simulator feedback </Heading>
                </CardHeader>
                <CardBody>
                    <Textarea isDisabled  value={response.message} />
                </CardBody>
            </Card>
            
        
            
        </Stack>
        </Box>
    )
}
export default SimulationPage;