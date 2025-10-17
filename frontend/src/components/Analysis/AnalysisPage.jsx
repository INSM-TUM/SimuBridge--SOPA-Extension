import React, { useState, useRef, useEffect } from "react";
import { db } from './db'
import axios from 'axios';
import { Flex, Heading, Card, CardHeader, CardBody, Text, Select, Stack, Button, Progress, Box, Textarea, UnorderedList, ListItem, Grid, Input } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';


import RunProgressIndicationBar from "../RunProgressIndicationBar";
import ToolRunOutputCard from "../ToolRunOutputCard";
import DriverEditTab from "./components/DriverEditTab";
import CostCharts from "./components/AnalysisResultCard";

import { runMultipleSimulations } from './logic/simulationRunner';
import { getConcreteCostDriverArray } from './logic/analysisLogic'
import AnalysisResultCard from "./components/AnalysisResultCard";
import { saveAllCostDrivers, mapAbstractDriversFromConcrete } from "../../components/Lca/Logic/LcaDataManager";


const AnalysisPage = ({ projectName, getData, toasting }) => {

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [errored, setErrored] = useState(false);
  // const [response, setResponse] = useState(JSON.parse(sessionStorage.getItem(projectName + '/analysisResults')) || {});
  // const [response, setResponse] = useState(loadLargeAnalysis(projectName));
  const [response, setResponse] = useState({});


  const [scenarioName, setScenarioName] = useState();
  const [simulator, setSimulator] = useState();
  const [simulationDriverSettings, setSimulationDriverSettings] = useState(getData().getCurrentScenario().environmentImpactParameters.costDrivers);

  const [toolName, setToolName] = useState();
  const [analysisTypes, setAnalysisTypes] = useState(["deterministic", "monte carlo", "local SA", "sobol GSA"]);
  const [mcIterations, setMcIterations] = useState(5);

  const driverEditGridSize = "220px 150px 400px 100px";
  const source = useRef(null);


  useEffect(() => {
    // Fetching scenario names from data
    let simulationDriverSettings = getData().getCurrentScenario().environmentImpactParameters.costDrivers;
    console.log("[Analyss Page] useEffect(): costDrivers", simulationDriverSettings);
  }, [getData]);


  const handleDriverUpdate = (abstractIndex, concreteIndex, updatedDriver) => {
    setSimulationDriverSettings((prevAC) => {
     
      const newAbstractSettings = structuredClone(simulationDriverSettings);
      // console.log("handleDriverUpdate: prevAC", prevAC, newAbstractSettings);
      newAbstractSettings[abstractIndex].concreteCostDrivers[concreteIndex] = updatedDriver;
      const allConcreteDrivers = getConcreteCostDriverArray(newAbstractSettings);
      const rebuiltAbstractDrivers = mapAbstractDriversFromConcrete(allConcreteDrivers);

      // Save  new settings
      saveAllCostDrivers(
        rebuiltAbstractDrivers,
        getData().getCurrentScenario().environmentImpactParameters.calcType,
        getData
      );

      return rebuiltAbstractDrivers;
    });
  };

  // const MC_ITERATIONS = 5; // Set number of MC iterations here
  const start = async () => {
    // console.log("Iteration", mcIterations);
    const stateReports = { 'toasting': toasting, 'setResponse': setResponse, 'setStarted': setStarted, 'setFinished': setFinished, 'setErrored': setErrored, 'started': started }
    // console.log("sim drivers", simulationDriverSettings)
    const currentScenario = getData().getCurrentScenario();
    currentScenario.environmentImpactParameters.costDrivers = simulationDriverSettings;
    source.current = axios.CancelToken.source();

    await runMultipleSimulations({
      scenarioName,
      mcIterations,
      getData,
      projectName,
      stateReports,
      cancelToken: source.current.token,
      toolName
    });

    const finalResults = await loadLargeAnalysis(projectName);
    setResponse(finalResults);
    console.log("[Analyss Page start()] Finished simulations", finalResults); //response.runs.length
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      console.log("fetchInitialData");
      const data = await loadLargeAnalysis(projectName);
      setResponse(data);
    };

    fetchInitialData();
  }, [projectName]);

  const handleAfterUpload = async () => {
    const finalResults = await loadLargeAnalysis(projectName);
    setResponse(finalResults);
  };

  // Function to abort simulation
  const abort = () => {
    console.log("abort");
    // Cancelling source and updating finished and started states
    source.current.cancel("Simulation was canceled");
    setStarted(-1);
    setResponse({ message: "canceled" });
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
            <Grid templateColumns={driverEditGridSize} gap={4} mb={2} width={"60%"}>
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
                  driverEditGridSize={driverEditGridSize}
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
                <Select value={toolName} placeholder='choose analysis' width='100%' {...(!toolName && { color: "gray" })} backgroundColor='white' icon={<FiChevronDown />} onChange={evt => setToolName(evt.target.value)}>
                  {
                    analysisTypes.map((type, index) => {
                      return <option value={type} color="black">{type}</option>
                    })
                  }
                </Select>
              </Box>
              {toolName !== "deterministic" && (
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

              {(started === 0 || started === 100 || started === false || started === -1) ? (
                <Button variant="outline" bg="#FFFF" onClick={start} disabled={!scenarioName || !simulator}>
                  <Text color="RGBA(0, 0, 0, 0.64)" fontWeight="bold">Start Simulation</Text>
                </Button>) :

                (
                  <Button variant="outline" bg="#FFFF" onClick={abort}>
                    <Text color="RGBA(0, 0, 0, 0.64)" fontWeight="bold">Abort Simulation</Text>
                  </Button>
                )}

              <Text fontSize="s" textAlign="start" > Results?:  {JSON.stringify(started)}</Text>
              {/* .toFixed(2) */}


            </Flex>
          </CardBody>
        </Card>
        {/* #region Header Section */}
        <RunProgressIndicationBar {...{ started, finished, errored }} />
        <ToolRunOutputCard {...{
          projectName, response: response.runs, toolName: toolName,
          processName: 'simulation', filePrefix: response.requestId, 'setResponse': setResponse, 'setToolName': setToolName, 'durationMs': response.durationMs,
          toasting, 'drivers': simulationDriverSettings, 'iterations': mcIterations, onUploadComplete: handleAfterUpload
        }} />
        {/* <Text fontSize="s" textAlign="start" > Help: {JSON.stringify(response) }</Text> */}
        {response && response.runs && ((response.runs.length > 0) || response.runs.sobolResults) &&
          <AnalysisResultCard {... { response: response, projectName: projectName, drivers: getConcreteCostDriverArray(simulationDriverSettings) }} />
        }
        {/* #endregion */}


      </Stack>
    </Box>
  )


  async function loadLargeAnalysis(projectName) {
    // Fetch all chunks for given project in one go
    const allChunks = await db.chunks.where({ projectName }).toArray();
    console.log("[loadLargeAnalysis] allChunks:", allChunks);
    if (allChunks.length === 0) {
      return {}; // No data found
    }

    // Find main 'analysisResults' chunk to get metadata
    const mainResultChunk = allChunks.find(c => c.key === 'analysisResults');
    // console.log("[loadLargeAnalysis] mainResultChunk:", mainResultChunk);
    if (!mainResultChunk) return {}; // Metadata is missing

    const sessionResults = mainResultChunk.data;

    // Rebuild full object from fetched chunks
    const detRuns = sessionResults.runs;
    const toolName = sessionResults.toolName; // todo load all from db
    const chunkInfo = sessionResults.chunkInfo;
    const concDrivers = getConcreteCostDriverArray(sessionResults.driversStructure || simulationDriverSettings);
    const driverCount = concDrivers.length;

    let runs = {};
    // console.log("[loadLargeAnalysis] projectName:", projectName, driverCount, toolName,);

    // find chunk data from pre-fetched array
    const findChunkData = (key) => allChunks.find(c => c.key === key)?.data;

    switch (toolName) {
      case 'sobol GSA': {
        runs.aMatrix = findChunkData('aMatrix') || [];
        runs.bMatrix = findChunkData('bMatrix') || [];
        runs.sobolResults = [];
        for (let i = 0; i < driverCount; i++) {
          const driverData = findChunkData(`driver_${concDrivers[i].name}`);
          if (driverData) {
            runs.sobolResults.push(driverData);
          }
        }
        break;
      } case 'local SA': {
        const lsaRuns = [];

        // baseline
        const baselineData = findChunkData('baseline');
        // console.log("[loadLargeAnalysis] baselineData:", baselineData);
        if (baselineData) {
          lsaRuns.push(baselineData);
        }
        // drivers
        for (let i = 0; i < driverCount; i++) {
          const driverData = findChunkData(`driver_${concDrivers[i].name}`);
          // console.log("[loadLargeAnalysis] driverData:", driverData,`driver_${concDrivers[i].name}` );
          if (driverData) {
            lsaRuns.push(driverData);
          }
        }
        if (lsaRuns.length > 0) {
          runs = [
            lsaRuns[0],
            ...lsaRuns.slice(1).sort((a, b) => a.driverName.localeCompare(b.driverName))
          ];
        } else {
          runs = [];
        }

        break;
      } case 'monte carlo': {
        let mcResults = [];
        // loop through number of chunks stored in metadata
        for (let i = 0; i < chunkInfo.chunkCount; i++) {
          const chunkData = findChunkData(`mc_chunk_${i}`);
          if (chunkData) {
            // Concatenate array of results from each chunk
            mcResults = mcResults.concat(chunkData);
          }
        }
        runs = mcResults; // combined array
        break;
      } case 'deterministic': {
        let detResults = [];
        console.log("[loadLargeAnalysis] detRuns:", chunkInfo);
        for (let i = 0; i < chunkInfo.chunkCount; i++) {
          const chunkData = findChunkData(`det_chunk_${i}`);
          if (chunkData) {
            // Concatenate array of results from each chunk
            detResults = detResults.concat(chunkData);
          }
        }
        runs = detResults; // combined array
        break;

      }

    }

    const results = {
      toolName,
      finished: sessionResults.finished,
      durationMs: sessionResults.durationMs,
      runs
    };
    setToolName(toolName);
    console.log("[loadLargeAnalysis] results:", results);
    return results;
  }
}

export default AnalysisPage;



