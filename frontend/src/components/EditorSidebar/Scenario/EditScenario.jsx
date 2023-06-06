import React, { useEffect, useState } from 'react'
import {
  Input, FormControl, FormLabel, Flex, Button, Stack, Select, Text, ButtonGroup, IconButton, Accordion, Box,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons'


// TODO extract distribution types and currencies
const distributionTypes = {
  exponential : { distribution_params: ["mean"] },
  normal : { distribution_params: ["mean", "standard deviation"] },
  uniform : { distribution_params: ["min", "max"] },
  constant : { distribution_params: ["constant value"] },
  erlang : { distribution_params: ["order", "mean"] },
  triangular : { distribution_params: ["lower", "peak", "upper"] },
  binomial : { distribution_params: ["probabiliy", "amount"] },
  arbitraryFiniteProbabilityDistribution : { distribution_params: [] }
}

const currencies = ['euro', 'dollar'];

function getParamsForDistribution(distributionType, distributionValues) {
  return (distributionType === "arbitraryFiniteProbabilityDistribution"
    ? distributionValues?.map((_, index) => 'entry'+index) //TODO: this currently only supports single frequency entries
    : distributionTypes[distributionType]?.distribution_params);
}


const EditScenario = ({getData, selectedScenario, setIsInDuplicateMode}) => {

  const [state, setState] = useState({
    scenarioName: "",
    startingDate: "",
    startingTime: "",
    currency: "",
    numberOfInstances: "",
    interArrivalTime: "",
    values: "",
    timeUnit: "",
    distributionType: "",
    distributionValues: []
  });

  useEffect(() => {
    let newTypes = distributionTypes;

    const selectedScenarioData = getData().getScenarioByIndex(selectedScenario);
    console.log('mounted')
    console.log(selectedScenario)
    if (!selectedScenarioData) return;

    if (selectedScenarioData.interArrivalTime.distributionType === "arbitraryFiniteProbabilityDistribution") {
      newTypes["arbitraryFiniteProbabilityDistribution"].distribution_params = selectedScenarioData.interArrivalTime.values.map(v => v.id)

    }
    setState({
      scenarioName: selectedScenarioData.scenarioName,
      startingDate: selectedScenarioData.startingDate,
      startingTime: selectedScenarioData.startingTime,
      currency: selectedScenarioData.currency,
      numberOfInstances: selectedScenarioData.numberOfInstances,
      interArrivalTime: selectedScenarioData.interArrivalTime,
      values: selectedScenarioData.interArrivalTime.values,
      timeUnit: selectedScenarioData.timeUnit,
      distributionType: selectedScenarioData.interArrivalTime.distributionType,
      distributionValues: selectedScenarioData.interArrivalTime.values.map(v => v.value)
    })
    console.log(state)
    console.log(state.distributionValues)
  }, [selectedScenario]);


  function handleInputChange(resource, index) {
    const target = resource.target;
    const value = target.value;
    const name = target.name;

    console.log(name)
    console.log(state)
    console.log(state.distributionValues)

    if (name === "distributionType") {
      setState({
        ...state,
        distributionType : value,
        distributionValues: new Array(distributionTypes[value].distribution_params.length).fill(0)
      })
    } else if (name === "distributionValues") {
      let newArr = state.distributionValues
      newArr[index] = value

      setState({
        ...state,
        distributionValues: newArr
      })
    } else {

      setState({
        ...state,
        [name]: value
      });

    }
  }

  function changeValueAmount(amount){ // For arbitrary final distributions
    if (amount === 1) {
      setState({
        ...state,
        distributionValues : [... state.distributionValues, 0]
      });
    } else {
      setState({
        ...state,
        distributionValues : state.distributionValues.slice(0, -1) // remove last element
      });
    }
  }

  function onSubmit(event){
    event.preventDefault();

    let obj = getData().getScenarioByIndex(selectedScenario);

    let interArrivalTime = {
      distributionType: state.distributionType,
      values: getParamsForDistribution(state.distributionType, state.distributionValues).map((key, index) => { return { id: key, value: state.distributionValues[index] } })
    }

    if (obj.scenarioName !== state.scenarioName) {
      getData().renameScenario(obj, state.scenarioName);
    }

    obj.scenarioName = state.scenarioName
    obj.startingDate = state.startingDate
    obj.startingTime = state.startingTime
    obj.currency = state.currency
    obj.numberOfInstances = state.numberOfInstances
    obj.interArrivalTime = interArrivalTime
    obj.values = state.values
    obj.timeUnit = state.timeUnit
    obj.distributionType = state.distributionType

    getData().saveScenario(obj);
  }

  return (
    <>
      <Box w="100%">
        <Stack gap="3">
          <Button onClick={() => setIsInDuplicateMode(true)}
            colorScheme='#ECF4F4'
            variant='outline'
            w="100%"
            border='1px'
            borderColor='#B4C7C9'
            color='#6E6E6F'
            _hover={{ bg: '#B4C7C9' }}> Duplicate Scenario </Button>



          <form onSubmit={onSubmit}>

            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                      General Parameters
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>


                  <FormControl>
                    <FormLabel>Scenario Name:</FormLabel>
                    <Input value={state.scenarioName} bg="white" name="scenarioName" onChange={(event) => handleInputChange(event)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Starting Date:</FormLabel>
                    <Input value={state.startingDate} bg="white" name="startingDate" onChange={(event) => handleInputChange(event)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Starting time:</FormLabel>
                    <Input value={state.startingTime} bg="white" name="startingTime" onChange={(event) => handleInputChange(event)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Number of Process Instances:</FormLabel>
                    <Input value={state.numberOfInstances} bg="white" name="numberOfInstances" onChange={(event) => handleInputChange(event)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Currency:</FormLabel>
                    <Select name="currency" value={state.currency} bg="white" onChange={(event) => handleInputChange(event)} >
                        {currencies.map((currency) => (<option key={currency} value={currency}>{currency}</option>))}
                    </Select>
                  </FormControl>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                      Interarrival time
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Flex justifyContent="space-between">

                    <FormControl w="47%">
                      <FormLabel>Distribution:</FormLabel>
                      <Select value={state.distributionType} bg="white" name="distributionType" onChange={(event) => handleInputChange(event)} >
                        {Object.keys(distributionTypes).map((distributionType, index) => {
                          return <option key={index} value={distributionType}>{distributionType}</option>
                        })}
                      </Select>
                    </FormControl>


                    <FormControl w="47%">
                      <FormLabel>Time Unit:</FormLabel>
                      <Select name="timeUnit" value={state.timeUnit} onChange={(event) => handleInputChange(event)} bg="white">
                        <option value='secs'>secs</option>
                        <option value='mins'>mins</option>
                      </Select>

                    </FormControl>
                  </Flex>

                  {state.distributionType === "arbitraryFiniteProbabilityDistribution" ?
                    <ButtonGroup size='md' isAttached variant="outline" >
                      <IconButton icon={<MinusIcon />} onClick={() => changeValueAmount(-1)} />
                      <IconButton icon={<AddIcon />} onClick={() => changeValueAmount(1)} />
                    </ButtonGroup>
                    : ""}

                  {getParamsForDistribution(state.distributionType, state.distributionValues)?.map((key, index) => {
                    return <>

                        <FormControl>
                          <FormLabel>{key}:</FormLabel>
                          <Input value={state.distributionValues[index]} bg="white" name="distributionValues" onChange={(event) => handleInputChange(event, index)} />
                        </FormControl></>

                  })}

                </AccordionPanel>
              </AccordionItem>
            </Accordion>


            <Button
              type="submit"
              colorScheme='#ECF4F4'
              w="100%"
              variant='outline'
              border='1px'
              borderColor='#B4C7C9'
              color='#6E6E6F'
              mt="5"
              _hover={{ bg: '#B4C7C9' }}> Save changes </Button>


          </form>
        </Stack>
      </Box>
    </>
  )
}



export default EditScenario;