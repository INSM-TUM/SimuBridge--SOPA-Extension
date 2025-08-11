import axios from 'axios';
import { setFile } from '../../../util/Storage';
import { convertScenario } from 'simulation-bridge-converter-scylla/ConvertScenario';
import {runSimpleMonteCarloSimulation} from "./analysisLogic";


// This is the main entry point called from your component
export const runMonteCarloSimulation = async ({
  scenarioName,
  MC_ITERATIONS,
  getData,
  projectName,
  stateReports,
  source, 
  analysisName
}) => {
    let variants = getData().getCurrentScenario().environmentImpactParameters.variants;
    console.log("start simulation, Vaiants:", variants)
    if(variants.reduce((sum, variant) => sum + parseInt(variant.frequency), 0) != 100) ///todo: If variants have non-integer frequencies (e.g., decimals), the current sum check will fail.
    {
      stateReports.toasting("error", "Frequencies sum is not 100%", "For correct simulation, the sum of frequencies must be 100%");
      
      return;
    }// todo: add warning for multiple of same abstract in same variant (not allowed)

    stateReports.setFinished(false);
    stateReports.setStarted(true);
    try {
      const scenarioData = getData().getScenario(scenarioName);
      console.log('ScenarioData', scenarioData);
      

      const simulator = createSimulator(scenarioData, scenarioName, stateReports, source, projectName);

      switch(analysisName)
      {
        case "monte carlo":
          console.log("runSimpleMonteCarloSimulation with scenarioData", scenarioData, "and mc iterations", MC_ITERATIONS);
          await runSimpleMonteCarloSimulation({MC_ITERATIONS, scenarioData, simulator});
          break;
        case "local SA":
          await simulator();
          break;
      }

      const simulationResults = [];
      // for (let i = 0; i < MC_ITERATIONS; i++) {
        
      //   const sampledGlobalConfig  = await getGlobalConfigSample(i, globalConfig); 
      //   const result = await simulate(sampledGlobalConfig, simConfig, scenarioName, processModel, bpmn, stateReports, source, projectName);
      //   if (result) {
      //     result.sampleIndex = i;                   
      //     result.sampledConfig = sampledGlobalConfig;    
      //     simulationResults.push(result);
      //   }
      // }
      
      stateReports.setStarted(false);
      stateReports.setFinished(true);
    
      stateReports.toasting("success", "Monte Carlo Simulation", `Completed ${MC_ITERATIONS} simulations`);
      console.log("Simulation Results:", simulationResults);
      sessionStorage.setItem(projectName + '/monteCarloResults', JSON.stringify(simulationResults));

      // stateReports.toasting a success message
      stateReports.toasting("success", "Success", "Analysis was successful");
      // todo: initiate analysis result display
      
    // todo - implement the monte carlo logic here using the simulate function
    }catch (err) {
      stateReports.setStarted(false);
      stateReports.setErrored(true);
      console.error("[Analysis Mistake]", err);
      stateReports.toasting("error", "Error", "Analysis was not successful");
    }
  }

  /**
   * Simulator to give to the specific analysis loop functions without sampledGlobalConfig
   * 
   * @param {*} stateReports 
   * @param {*} source 
   * @param {*} projectName 
   * @returns 
   */
  function createSimulator(scenarioData, scenarioName,stateReports, source, projectName) {
  return async function (drivers) {
    console.log("[createSimulator()] drivers", drivers, scenarioData);
    // Deep copy to avoid mutating original
    const scenarioCopy = structuredClone(scenarioData);
    scenarioCopy.environmentImpactParameters.costDrivers = drivers;

    console.log("[createSimulator()] scenarioCopy", scenarioCopy);
    const {globalConfig, simConfigs} = await convertScenario( scenarioCopy);

    console.log("globalConfig", globalConfig);
    console.log("simConfigs", simConfigs[0]);

    const simConfig = simConfigs[0]; //TODO magic index access
    const processModel = scenarioData.models[0]; //TODO magic index access

    let bpmn = processModel.BPMN;
    bpmn = bpmn.replace(/'/g, "");
    //console.log('BPMN', bpmn);
    return await simulate(globalConfig, simConfig, scenarioName, processModel, bpmn, stateReports, source, projectName);
  };
}

const replaceScenarioDrivers = (drivers, scenarioData) => {
  scenarioData.environmentImpactParameters.costDrivers = drivers;
  return scenarioData;
}

  // function to start the simulation
  const simulate = async (globalConfig, simConfig, scenarioName, processModel, bpmn, stateReports, source, projectName) => {
    // Resetting response and finished states
    stateReports.setResponse({ message: "", files: [] });
    stateReports.setErrored(false);

    const requestId = 'request' + Math.random();
    const formData = new FormData();
  
    // Creating a cancel token and assigning it to the current source
    source.current = axios.CancelToken.source();
    console.log("[simulate] with global:", globalConfig);
    try{
      const bpmnFile = new File([bpmn], processModel.name + '.bpmn')
      const globalConfigFile = new File([globalConfig], scenarioName + '_Global.xml')
      const simConfigFile = new File([simConfig], scenarioName + '_' + bpmnFile.name + '_Sim.xml')

      formData.append("bpmn", bpmnFile, bpmnFile.name);
      formData.append("globalConfig", globalConfigFile, globalConfigFile.name);
      formData.append("simConfig", simConfigFile, simConfigFile.name); 
      console.log("[simulation] formData", formData);

      // todo: reactivate
      // Sending a POST request to apiTool.py in the Scylla-Container subproject, with the cancel token attached
      const r = await axios.post("http://127.0.0.1:8080/scyllaapi", formData, {
        headers: {
          'requestId' : requestId,
          'Content-Type': 'multipart/form-data'
        },
        cancelToken: source.current.token
      });
      r.data.files.forEach(file => {
        setFile(projectName, requestId + '/' + file.name, file.data);
      })
      console.log("[simulation] response", r.data);

      // Setting the response state and updating the finished and started states
      
      const responseObject = {
        message : r.data.message,
        files : r.data.files.map(file => file.name),
        finished : new Date(),
        requestId
    }
    // const responseObject = { }


    stateReports.setResponse(responseObject);
    // sessionStorage.setItem(projectName+'/lastAlanysisResponse', JSON.stringify(responseObject));
    return responseObject;
    } catch (err) {
      // If there's a cancellation error, toast a success message
      if (axios.isCancel(err)) {
        stateReports.toasting("success", "Success", "Analysis was canceled");
      } else {
        // Otherwise, stateReports.toast an error message
        stateReports.setErrored(true);
        console.log("[Simulation Mistake]", err)
        //TODO also display error occurence
        stateReports.toasting("error", "error", "Simulation was not successful");
      }
      return null;
    }
  };


  
  const getGlobalConfigSample = async (iteration, globalConfig) => {
    // todo: This function should return a sample of the global configuration for the given iteration
    // For now, we will just return the globalConfig as is
    return globalConfig;
  };