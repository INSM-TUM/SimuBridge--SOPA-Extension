import React, { useState, useEffect, useRef } from "react";

import {
  Alert, AlertIcon, AlertDescription, CloseButton, useDisclosure,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Flex, Heading, Card, CardHeader, CardBody,
  Text, Input, InputGroup, InputRightElement, InputLeftElement,
  Select, Button, Progress, Box, Spinner,
  UnorderedList, ListItem,
  FormControl,
  FormLabel,
  Spacer
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import { fetchAllCostDrivers, calculateCostDrivers } from '../Logic/LcaIntegrationUtils';
import { getCostDriversFromScenario, mapAbstractDriversFromConcrete, saveAllCostDrivers } from "../Logic/LcaDataManager";
import FormattedConcreteDriver from './FormattedConcreteDriver';
import BasicSpinner from "./BasicSpinner";
import { getAllImpactMethods, getImpactMethod } from "../Logic/OpenLcaConnector";

const LcaIntegration = ({ getData, toasting }) => {
  //vars
  const defaultApiUrl = 'http://localhost:8081';
  const [apiUrl, setApiUrl] = useState(defaultApiUrl);
  const [isApiUrlValid, setIsApiUrlValid] = useState(true);
  const [isFetchingRunning, setIsFetchingRunning] = useState(false);
  const [fetchingProgress, setFetchingProgress] = useState(-1);
  const [isScenarioModelLoaded, setIsScenarioModelLoaded] = useState(false);
  const [allCostDrivers, setAllCostDrivers] = useState([]);
  const [isCostDriversLoaded, setIsCostDriversLoaded] = useState(false);

  
  const [impactMethodId, setImpactMethodId] = useState(); 
  const [impactMethods, setImpactMethods] = useState([]);

  const [normalizationSetId, setNormalizationSetId] = useState(); 
  const [normalizationSets, setNormalizationSets] = useState([]);

  const [selectedCalcType, setSelectedCalcType] = useState("lazy");
  const [calcType, setCalcType] = useState("");
  const [mcIterations, setMcIterations] = useState(1000);



  const [progressText, setProgressText] = useState('');

  //init
  useEffect(() => {
    const [uniqueCostDrivers, calcType] = getCostDriversFromScenario(getData);
    console.log("[LcaIntegration] uniqueCostDrivers:", uniqueCostDrivers, "calcType:", calcType);
    setCalcType(calcType);
    setSelectedCalcType(calcType);
    setAllCostDrivers(uniqueCostDrivers);
    setIsCostDriversLoaded(uniqueCostDrivers.length > 0);
    setIsScenarioModelLoaded(true);
  }, [getData]);



  useEffect(() => {
    if (impactMethodId) {
      const impactMethod = impactMethods.filter(im => im.id == impactMethodId)[0];
      setNormalizationSets(impactMethod.nwSets);
      setNormalizationSetId(impactMethod.nwSets && impactMethod.nwSets[0]?.id)
    }
  }, [impactMethodId]);

  const handleApiUrlChange = (event) => {
    const value = event.target.value;
    setApiUrl(value);
    validateUrl(value);
  };

  const validateUrl = (url) => {
    const regex = /^http:\/\/[\w.]+:\d+$/;
    setIsApiUrlValid(regex.test(url));
  };

  const fillDefaultHostPortButtonClick = () => {
    setApiUrl(defaultApiUrl);
    setIsApiUrlValid(true);
  };

  const handleFetchImpactMethodButtonClick = async () => {
    if (!isApiUrlValid) {
      toasting("error", "Invalid URL", "Please enter a valid URL in the format 'http://[host]:[port]'");
      return;
    }
    const impactMethodsToBe = await getAllImpactMethods(apiUrl);
    setImpactMethods(impactMethodsToBe);
    if (impactMethodsToBe.length > 0) {
      setImpactMethodId(impactMethodsToBe[0].id);
    }
  }


  const handleFetchCostsButtonClick = async () => {
    if (!isApiUrlValid) {
      toasting("error", "Invalid URL", "Please enter a valid URL in the format 'http://[host]:[port]'");
      return;
    }
    setIsFetchingRunning(true);
    setProgressText('Fetching ...');
    setFetchingProgress(0);

    console.log("[LcaIntegration] handleFetchCostsButtonClick", apiUrl, impactMethodId, selectedCalcType, normalizationSetId, mcIterations);

    await fetchAllCostDrivers(apiUrl,
      (abstractCostDrivers) => {
        toasting("info", "Success", "Cost drivers fetched successfully. Normalizing results...");
        setProgressText('Normalizing ...');
        setFetchingProgress(1 / (abstractCostDrivers.length + 1) * 100);
        calculateCostDrivers(apiUrl, impactMethodId, selectedCalcType, normalizationSetId, abstractCostDrivers, mcIterations,
          (progress) => setFetchingProgress(progress),
          (normalizedCostDrivers) => {
            const abstractCostDriversMap = mapAbstractDriversFromConcrete(normalizedCostDrivers);

            saveAllCostDrivers(
              abstractCostDriversMap,
              selectedCalcType,
              getData
            );

            toasting("success", "Success", "Cost drivers were successfully saved to the application");
            setIsFetchingRunning(false);
            setCalcType(selectedCalcType);
            setAllCostDrivers(abstractCostDriversMap);
            setIsCostDriversLoaded(true);
          },
          (error) => {
            setIsFetchingRunning(false);
            toasting("error", "Error", "Error calculating cost drivers. Please check if the OpenLCA IPC server is running and the URL is correct");
            console.error('API Error:', error);
          });
      },
      (error) => {
        setIsFetchingRunning(false);
        toasting("error", "Error", "Please check if the OpenLCA IPC server is running and the URL is correct");
        console.error('API Error:', error);
      }
    );
  };

  const {
    isOpen: isAlertBoxVisible,
    onClose,
  } = useDisclosure({ defaultIsOpen: true })

  return (
    !isScenarioModelLoaded ?
      <BasicSpinner />
      :
      <Box>
        <Card bg="white" mt="25px">
          <CardHeader>
            <Heading size='md'>Configure OpenLCA integration</Heading>
          </CardHeader>
          <CardBody>
            OpenLCA IPC server host and port:
            <Flex mt={2}>
              <InputGroup size='md' flex='2'>
                <InputLeftElement pointerEvents='none'>
                  <ExternalLinkIcon color='gray.300' />
                </InputLeftElement>
                <Input
                  id="apiUrlInput"
                  size="md"
                  type="url"
                  value={apiUrl}
                  isInvalid={!isApiUrlValid}
                  errorBorderColor='red.300'
                  onChange={handleApiUrlChange}
                  placeholder={'e.g., ' + defaultApiUrl}
                />
                <InputRightElement width='4.5rem' mr={2}>
                  <Button h='1.75rem' size='sm'
                    onClick={fillDefaultHostPortButtonClick}>
                    Default
                  </Button>
                </InputRightElement>
              </InputGroup>

              <Button
                id='fetchIMButton'
                onClick={handleFetchImpactMethodButtonClick}
                disabled={isFetchingRunning}
                colorScheme='white'
                flex='1'
                variant='outline'
                border='1px'
                borderColor='#B4C7C9'
                color='#6E6E6F'
                _hover={{ bg: '#B4C7C9' }}
                ml={2}
              >
                Fetch Impact Methods
              </Button>
            </Flex>
            <Spacer />
            <Flex mt={2}>
              {impactMethods && impactMethods.length > 0 &&
                <FormControl>
                  <FormLabel>Impact Method</FormLabel>
                  <Select value={impactMethodId} ml={2} flex='2' onChange={({ target: { value, name } }) => setImpactMethodId(value)} >
                    {impactMethods.map((method, index) => {
                      return <option value={method.id}>{method.name}</option>
                    })}
                  </Select>
                </FormControl>
              }


              {normalizationSets && normalizationSets.length > 0 &&
                <FormControl>
                  <FormLabel>Normalization Set</FormLabel>
                  <Select value={normalizationSetId} ml={2} flex='2' onChange={({ target: { value, name } }) => setNormalizationSetId(value)} >
                    {normalizationSets.map((set, index) => {
                      return <option value={set.id}>{set.name}</option>
                    })}
                  </Select>
                </FormControl>
              }
            </Flex>
            <Spacer />
            
              {normalizationSets && normalizationSets.length > 0 &&
              <Flex mt={2}>
                <FormControl>
                  <FormLabel>Calculation Type</FormLabel>
                  <Select
                    value={selectedCalcType}
                    ml={2} flex='2'
                    onChange={(e) => setSelectedCalcType(e.target.value)}
                  >
                    <option value="lazy">lazy</option>
                    <option value="monte carlo">monte carlo</option>
                  </Select>
                </FormControl>
                {selectedCalcType === "monte carlo" && (
                <FormControl>
                  <FormLabel>Number of Iterations</FormLabel>
                  <Input
                    type="number"
                    value={mcIterations}
                    onChange={(e) => setMcIterations(parseInt(e.target.value) || 1)}
                    min={1}
                    max={10000} // optional upper limit
                    backgroundColor="white"
                    ml={2} flex='2'
                  />
                </FormControl>
                    )}
              </Flex>}
            
            
            <Spacer />
            {impactMethods && impactMethods.length > 0 &&
              <Button
                id='fetchButton'
                onClick={handleFetchCostsButtonClick}
                disabled={isFetchingRunning}
                isLoading={isFetchingRunning}
                loadingText={progressText}
                colorScheme='white'
                flex='1'
                variant='outline'
                border='1px'
                borderColor='#B4C7C9'
                color='#6E6E6F'
                _hover={{ bg: '#B4C7C9' }}
                ml={2}
              >
                Fetch Costs
              </Button>
            }
            {isFetchingRunning &&
              <Progress mt={2} colorScheme='green' size='md' hasStripe
                {...(fetchingProgress >= 0 ? { value: fetchingProgress } : { isIndeterminate: true })}
              />
            }
          </CardBody>
        </Card>

        {!isCostDriversLoaded && isAlertBoxVisible &&
          <Alert status='warning' mt={2} display='flex' alignItems='center' justifyContent='space-between'>
            <Flex alignItems='center'>
              <AlertIcon />
              <AlertDescription>There are no cost drivers saved in the system. Use the window above to fetch.</AlertDescription>
            </Flex>
            <CloseButton position='relative' onClick={onClose} />
          </Alert>
        }
        {isCostDriversLoaded && !isFetchingRunning &&
          <Card mt={2}>
            <CardHeader>
              <Heading size='md'>{allCostDrivers.length} abstract cost drivers</Heading>
            </CardHeader>
            <CardBody>
              <Accordion allowToggle>
                {allCostDrivers.map((costDriver, abstractIndex) => (
                  <AccordionItem key={abstractIndex}>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Text fontSize="lg" fontWeight="bold">
                            {costDriver.name}
                          </Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {<UnorderedList>
                        {costDriver.concreteCostDrivers.map((concreteCostDriver, concreteIndex) => (
                          <ListItem key={concreteIndex}>


                            <FormattedConcreteDriver concreteCostDriver={concreteCostDriver} cType={calcType} onUpdate={(updatedConcreteDriver) => {
                              const updatedConcreteCostDrivers = [...costDriver.concreteCostDrivers];
                              updatedConcreteCostDrivers[concreteIndex] = updatedConcreteDriver;
                              //concreteCostDriver[index] = updatedConcreteDriver;
                              console.log("[lcaInt on formComponent] updated cost concrete drivers", concreteIndex, updatedConcreteCostDrivers)
                              const updatedAbstractCostDrivers = [...allCostDrivers];
                              updatedAbstractCostDrivers[abstractIndex].concreteCostDrivers = updatedConcreteCostDrivers
                              console.log("[lcaInt on formComponent] updated abstract cost drivers", abstractIndex, updatedAbstractCostDrivers)

                              setAllCostDrivers(updatedAbstractCostDrivers);
                              console.log("[lcaInt on formComponent] updated all cost drivers", allCostDrivers);
                              saveAllCostDrivers(updatedAbstractCostDrivers, calcType , getData);
                            }} />


                          </ListItem>
                        ))}
                      </UnorderedList>}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardBody>
          </Card>
        }
      </Box>
  );
};

export default LcaIntegration;
