import React, { useState, useRef, useEffect } from "react";
import { Flex, Heading, Card, CardHeader, CardBody, Text, Select, Stack, Button, Progress, Box, Textarea, UnorderedList, ListItem, Grid, Input } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';

import { getFile, getScenarioFileName, setFile } from "../../util/Storage";
import { convertScenario } from "simulation-bridge-converter-scylla/ConvertScenario";
import RunProgressIndicationBar from "../RunProgressIndicationBar";
import ToolRunOutputCard from "../ToolRunOutputCard";
import DriverEditTab from "./components/DriverEditTab";
import CostCharts from "./components/AnalysisResultCard";

import { runMultipleSimulations } from './logic/simulationRunner';
import {getConcreteCostDriverArray} from './logic/analysisLogic'
import AnalysisResultCard from "./components/AnalysisResultCard";
import { saveAllCostDrivers, mapAbstractDriversFromConcrete } from "../../components/Lca/Logic/LcaDataManager";


const AnalysisPage = ({ projectName, getData, toasting }) => {

  // Setting initial states of started, finished, and response
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [errored, setErrored] = useState(false);
  const [response, setResponse] = useState(JSON.parse(sessionStorage.getItem(projectName + '/analysisResults')) || {});

  const [scenarioName, setScenarioName] = useState();
  const [simulator, setSimulator] = useState();
  const [simulationDriverSettings, setSimulationDriverSettings] = useState(getData().getCurrentScenario().environmentImpactParameters.costDrivers);

  const [analysisName, setAnalysisName] = useState();
  const [analysisTypes, setAnalysisTypes] = useState(["monte carlo", "local SA", "Sobol GSA"]);
  const [mcIterations, setMcIterations] = useState(5);

  // Creating a reference to the source that can be cancelled if needed
  const source = useRef(null);


  useEffect(() => {
    // Fetching the scenario names from the data
    let simulationDriverSettings = getData().getCurrentScenario().environmentImpactParameters.costDrivers;
    console.log("[Analyss Page]  useEffect(): costDrivers", simulationDriverSettings);
  }, [getData]);


  const handleDriverUpdate = (abstractIndex, concreteIndex, updatedDriver) => {
    setSimulationDriverSettings((prevAC) => {
      // 1. Copy the full abstract array
      const newAbstractSettings = structuredClone(simulationDriverSettings);
      console.log("handleDriverUpdate: prevAC", prevAC, newAbstractSettings);

      // 2. Update the specific concrete driver
      newAbstractSettings[abstractIndex].concreteCostDrivers[concreteIndex] = updatedDriver;

      // 3. Flatten ALL concrete drivers from ALL abstracts
      const allConcreteDrivers = getConcreteCostDriverArray(newAbstractSettings);
      console.log("handleDriverUpdate: allConcreteDrivers", allConcreteDrivers);

      // 4. Rebuild ALL abstracts consistently
      const rebuiltAbstractDrivers = mapAbstractDriversFromConcrete(allConcreteDrivers);

      // 5. Save the new settings
      saveAllCostDrivers(
        rebuiltAbstractDrivers,
        getData().getCurrentScenario().environmentImpactParameters.calcType,
        getData
      );

      console.log("handleDriverUpdate: rebuiltAbstractDrivers", rebuiltAbstractDrivers);

      return rebuiltAbstractDrivers;
    });
  };

  // const MC_ITERATIONS = 5; // Set your number of MC iterations here
  const start = async () => {
    console.log("Iteration", mcIterations);
    const stateReports = { 'toasting': toasting, 'setResponse': setResponse, 'setStarted': setStarted, 'setFinished': setFinished, 'setErrored': setErrored }
    console.log("sim drivers", simulationDriverSettings)

    // Overwrite costDrivers in getData with the edited simulationDriverSettings
    const currentScenario = getData().getCurrentScenario();
    currentScenario.environmentImpactParameters.costDrivers = simulationDriverSettings;

    await runMultipleSimulations({
      scenarioName,
      mcIterations,
      getData,
      projectName,
      stateReports,
      source,
      analysisName
    });

    console.log("[Analyss Page start()] Finished simulations", response);
  }

  // Function to abort the simulation
  const abort = () => {
    console.log("abort");
    // Cancelling the source and updating the finished and started states
    source.current.cancel("Simulation was canceled");
    setStarted(false);
    setResponse({ message: "canceled" });
  };

  //  function to download the file
  const download = async (data, fileName, encoding = 'charset=UTF-8') => {
    // Fetching the file, creating a blob and a URL
    const encodedData = encodeURIComponent(data);
    const a = document.createElement("a");
    // Creating a download link and triggering a click event
    const fileType = fileName.split('.').pop();

    a.href = 'data:application/' + fileType + ';' + encoding + ',' + encodedData;
    a.download = fileName;
    // a.download = `${sessionStorage.getItem("currentProject")}_${name}.${type}`;
    a.click();
  };



  return (
    <Box h="93vh" overflowY="auto" p="5" >
      <Stack gap="2">
        <Heading size='lg' >Sensitivity Analysis</Heading>



        <Card bg="white">
          <CardHeader>
            <Heading size='md'> Environmental Simulation Parameters</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="100px 150px 1fr 100px" gap={4} mb={2} width={"60%"}>
              {/* Header row */}
              <Text fontWeight="bold">Name</Text>
              <Text fontWeight="bold">Distribution Type</Text>
              <Text fontWeight="bold">Cost Parameters</Text>
              <Text fontWeight="bold">Actions</Text>
            </Grid>


            {/* Rows */}
            {simulationDriverSettings.map((abstractDriver, abstractIndex) =>
              abstractDriver.concreteCostDrivers.map((concreteDriver, concreteIndex) => (
                <DriverEditTab
                  key={`${abstractIndex}-${concreteIndex}`}
                  concreteCostDriver={concreteDriver}

                  onUpdate={(updatedDriver) =>
                    handleDriverUpdate(abstractIndex, concreteIndex, updatedDriver)
                  }
                />
              ))
            )}

          </CardBody>
          <CardHeader>
            <Heading size='md'> Start Analysis Run </Heading>
          </CardHeader>
          <CardBody>

            <Flex
              gap="5"
              flexDirection="row"
              alignItems="end"
              mt="-4"
            >
              <Box>
                <Text fontSize="s" textAlign="start" color="#485152" fontWeight="bold" > Select Analysis:</Text>
                <Select value={analysisName} placeholder='choose analysis' width='100%' {...(!analysisName && { color: "gray" })} backgroundColor='white' icon={<FiChevronDown />} onChange={evt => setAnalysisName(evt.target.value)}>
                  {
                    analysisTypes.map((type, index) => {
                      return <option value={type} color="black">{type}</option>
                    })
                  }
                </Select>
              </Box>
              {analysisName === "monte carlo" && (
                <Box mt={4}>
                  <Text fontSize="s" textAlign="start" color="#485152" fontWeight="bold">
                    Select Iterations:
                  </Text>
                  <Input
                    type="number"
                    value={mcIterations}
                    onChange={(e) => setMcIterations(parseInt(e.target.value) || 1)}
                    min={1}
                    max={10000} // optional upper limit
                    backgroundColor="white"
                  />
                </Box>
              )}
              <Box>
                <Text fontSize="s" textAlign="start" color="#485152" fontWeight="bold" > Select scenario:</Text>
                <Select value={scenarioName} placeholder='choose scenario' width='100%' {...(!scenarioName && { color: "gray" })} backgroundColor='white' icon={<FiChevronDown />} onChange={evt => setScenarioName(evt.target.value)}>
                  {
                    getData().getAllScenarios().map((scenario, index) => {
                      return <option value={scenario.scenarioName} color="black">{scenario.scenarioName}</option>
                    })
                  }
                </Select>
              </Box>
              <Box>
                <Text fontSize="s" textAlign="start" color="#485152" fontWeight="bold" > Select simulator:</Text>
                <Select value={simulator} placeholder='choose simulator' width='100%'  {...(!simulator && { color: "gray" })} backgroundColor='white' icon={<FiChevronDown />} onChange={evt => setSimulator(evt.target.value)}>
                  <option value='Scylla' color="black">Scylla</option>
                </Select>
              </Box>

              {!started &&
                <Button variant="outline" bg="#FFFF" onClick={start} disabled={!scenarioName || !simulator}>
                  <Text color="RGBA(0, 0, 0, 0.64)" fontWeight="bold">Start Simulation</Text>
                </Button>}

              {started &&
                <Button variant="outline" bg="#FFFF" onClick={abort}>
                  <Text color="RGBA(0, 0, 0, 0.64)" fontWeight="bold">Abort Simulation</Text>
                </Button>
              }

            </Flex>
          </CardBody>
        </Card>

        <RunProgressIndicationBar {...{ started, finished, errored }} />
        <ToolRunOutputCard {...{ projectName, response: response.runs, toolName: 'Analysis', processName: 'simulation', filePrefix: response.requestId }} />
        {response && response.runs && response.runs.length > 0 &&
          <AnalysisResultCard {... { response: response, projectName: projectName }} />}



      </Stack>
    </Box>
  )
}
export default AnalysisPage;