import {
    Button, Card, CardBody, CardHeader, Flex, Heading, ListItem, Textarea, UnorderedList, Accordion, AccordionItem,
    AccordionButton, AccordionPanel, AccordionIcon, Text, Divider
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { downloadFile, fetchFileBlob } from "../util/Storage";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ZipUploadButton from "./Analysis/components/ZipUploadButton";



export default function ToolRunOutputCard({ projectName, response, toolName, processName, filePrefix, setResponse, setAnalysisName, durationMs, toasting }) {
    const initialVisible = 3; // show first 3 runs by default
    const [showAll, setShowAll] = useState(false);

    useEffect(() => { // todo add blending out of showAll button when not needed (iterations <= initialVisible)
        if (toolName === "local SA" && response && Array.isArray(response)) {
            setShowAll(Array(response.length).fill(false));
        } else if (toolName !== "sobol GSA" && response && Array.isArray(response.sobolResults)) {
            setShowAll(Array(response.sobolResults.length + 2).fill(false));
        }

    }, [toolName, response, response?.length]);

    let runs = Array.isArray(response) ? response : response ? [response] : [];
    console.log("[ToolRunOutputCard] start:", projectName, response, toolName, runs, showAll);
    if (runs.length === 1)
        response = runs[0];

    //#region Zip upload/download handling
    const zipUpload = (parsedResults) => {
        console.log("Uploaded ZIP and parsed results:", parsedResults);
        if (parsedResults.toolName === "local SA Analysis" || parsedResults.toolName === "local SA") {
            response = parsedResults.results;
        } else if (parsedResults.toolName === "sobol GSA Analysis" || parsedResults.toolName === "sobol GSA") {
            response = {
                aMatrix: parsedResults.aMatrix,
                bMatrix: parsedResults.bMatrix, 
                sobolResults: parsedResults.sobolResults
            };
        }          
        else {
            runs = parsedResults.results;
        }
        let wholeToolName = parsedResults.toolName;
        toolName = (wholeToolName || '').endsWith(' Analysis') ? wholeToolName.slice(0, -' Analysis'.length) : wholeToolName;

        setAnalysisName(toolName)
        sessionStorage.setItem(projectName + '/analysisResults', JSON.stringify({ runs: parsedResults.results, analysisName: toolName, }));
        // setResponse(parsedResults.results);
        console.log("[ToolRunOutputCard] Set response to:", parsedResults.results, "and toolName to:", toolName);
        // setResponse(["parsedResults.results"]);
        setResponse(prevResponse => ({
            ...prevResponse, // Keep existing properties
            runs: parsedResults.results, // Update runs
            analysisName: toolName,
            //durationMs: 0, // Example duration
            requestId: "new-request-id" // If needed
        }));

    }

    async function zipDownloadSingle(roundOfRuns, projectName, zip) {
        for (let idx = 0; idx < roundOfRuns.length; idx++) {
            const res = roundOfRuns[idx];
            if (!res.files) continue;

            for (const fileName of res.files) {
                const path = (res.requestId ? res.requestId + "/" : "") + fileName;
                const fileData = await fetchFileBlob(projectName, path);   // <-- use fetchFileBlob for raw Blob
                zip.file(`run${idx + 1}_${res.requestId}/${fileName}`, fileData);   // <-- replaced folder with runFolderName
            }
        }

    }

    // helper to fetch and add files to zip old
    async function downloadAllRunsAsZip(projectName, responses) {
        const zip = new JSZip();

        if (toolName === "local SA") {
            // console.log("[zipDownload] Processing lsa driver runs:", responses, projectName);
            const baselineDriver = responses.find(driver => driver.driverName === 'baseline').baselineResults;
            console.log("Baseline driver:", baselineDriver, responses);
            for (const fileName of baselineDriver.files) {
                const path = (baselineDriver.requestId ? baselineDriver.requestId + "/" : "") + fileName;
                const fileData = await fetchFileBlob(projectName, path);
                zip.file(`Baseline_${baselineDriver.requestId}/${fileName}`, fileData);
            }
            console.log("Baseline files added.", zip);

            const runs = responses.filter(driver => driver.driverName !== 'baseline');
            for (const driverObj of runs) {
                if (!driverObj.driverName || !driverObj.results) continue;
                const driverFolder = zip.folder(`Driver_${driverObj.driverName}`);
                await zipDownloadSingle(driverObj.results, projectName, driverFolder);
            }
        } else if (toolName === "sobol GSA") {
            console.log("[zipDownload] Processing sobol GSA runs:", responses, projectName);
            await zipDownloadSingle(responses.aMatrix, projectName, zip.folder("A_Matrix"));
            await zipDownloadSingle(responses.bMatrix, projectName, zip.folder("B_Matrix"));
            console.log("A and B matrix files added.", zip);
            for (const driverObj of responses.sobolResults) {
                if (!driverObj.driverName || !driverObj.results) continue;
                const driverFolder = zip.folder(`Driver_${driverObj.driverName}`);
                await zipDownloadSingle(driverObj.results, projectName, driverFolder);
            }
        }

        else {
            console.log("[zipDownload] Processing simple runs:", responses, projectName);
            await zipDownloadSingle(responses, projectName, zip);

        }

        console.log("Zip file downloading starting sucessful.");
        toasting("success", "Downloading Analysis Files", `Starting Zip file downloading sucessful. It might take a minute to show in the browser.`);

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${projectName}__${toolName.replace(" ", "_")}_SimRuns_${durationMs}.zip`);


    }
    //#endregion

    //#region reusable Rendering components
    // Component to render runs inside an accordion (can be reused for different nesting structures)
    const AccordionRunsPanel = ({ runs, showAllRuns }) => (
        <Accordion allowMultiple>
            {(showAllRuns ? (runs || []) : (runs || []).slice(0, initialVisible)).map((res, idx) => (  //  show only initialVisible unless showAll
                <AccordionItem key={res.requestId || idx} border="1px solid #ddd" borderRadius="md" mb={2}>
                    <h2>
                        <AccordionButton>
                            <Heading size="sm" flex="1" textAlign="left">
                                Run {idx + 1} {res.finished && `[${new Date(res.finished).toLocaleString()}]`}
                            </Heading>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        {res.message && (
                            <>
                                <Heading size="xs" mt={-2}>Console Output:</Heading>
                                <Textarea isDisabled value={res.message} />
                            </>
                        )}
                        {res.files && (
                            <>
                                <Heading size="xs">Returned Files:</Heading>
                                <UnorderedList>
                                    {res.files.map((fileName, fIdx) => (
                                        <ListItem key={fIdx}>
                                            <Button
                                                onClick={() =>
                                                    downloadFile(
                                                        projectName,
                                                        (res.requestId ? res.requestId + "/" : "") + fileName
                                                    )
                                                }
                                                variant="link"
                                            >
                                                {fileName}
                                            </Button>
                                        </ListItem>
                                    ))}
                                </UnorderedList>
                            </>
                        )}
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );
    //#endregion

    const toggleDriverShowAll = (driverIdx) => {
        setShowAll(prev => {
            if (typeof prev === 'boolean') {
                const newArray = Array(response.length).fill(false);
                newArray[driverIdx] = true;
                return newArray;
            }

            const newArray = [...prev];
            newArray[driverIdx] = !newArray[driverIdx];
            return newArray;
        });
    };


//#region RETURN render
    return <Card bg="white">
        <CardHeader display="flex" alignItems="center" justifyContent="space-between">
            <Heading size='md'> Last <em color="var(--chakra-colors-gray-500)">{toolName} Analysis</em> Run Output {response && response.finished && `[${new Date(response.finished).toLocaleString()}]`}</Heading>
            <ZipUploadButton onUpload={zipUpload} size="sm" />
        </CardHeader>
        <CardBody>
           
            {toolName === "deterministic" || toolName === "monte carlo" ? (
                runs.length === 0 ? (
                    <>No {processName} runs in this session yet.</>
                ) : (
                    runs.length === 1 ? (
                        <Flex flexDirection='column' gap='5'>
                            {!response.message && !response.files && !response.finished && <>
                                No {processName} runs in this session yet.
                            </>}
                            {response.message && <>
                                <Heading size='ms' mt={-5}>Console Output:</Heading>
                                <Textarea isDisabled value={response.message} />
                            </>}
                            {response.files && <>
                                <Heading size='ms'>Returned Files: (Click on the name of the file to download it)</Heading>
                                <UnorderedList>
                                    {response.files.map(fileName => (<ListItem>
                                        <Button onClick={() => downloadFile(projectName, (filePrefix ? filePrefix + '/' : '') + fileName)} variant="link">{fileName}</Button>
                                    </ListItem>))}
                                </UnorderedList>
                            </>}
                        </Flex>
                    ) : ( // runs.length > 1 in mc or deterministic 

                        <>
                            <AccordionRunsPanel runs={runs} showAllRuns={showAll} />
                            <Flex mt={4} gap={4} justifyContent="space-between" flexWrap="wrap">
                                {runs.length > initialVisible && (
                                    <Button size="sm" onClick={() => setShowAll(!showAll)}>
                                        {showAll ? "Show Fewer Runs" : `Show All Runs (${runs.length})`}
                                    </Button>
                                )}

                                <Button colorScheme="blue" onClick={() => downloadAllRunsAsZip(projectName, runs)}>
                                    Download All Runs as ZIP
                                </Button>
                            </Flex>
                        </>


                    )
                )
            ) : toolName === "local SA" ? ( /// local SA
                !response || response.length === 0 ? (
                    <>No {processName} runs in this session yet.</>
                ) : (
                    <>
                        <Accordion allowMultiple>
                            {response.filter(driver => driver.driverName !== 'baseline').map((driverResult, driverIdx) => (
                                <AccordionItem key={driverIdx}>
                                    <h2>
                                        <AccordionButton>
                                            <Heading size="sm" flex="1" textAlign="left">
                                                Driver: <Text as="span" fontWeight="semibold" color="var(--chakra-colors-gray-500)">{driverResult.driverName}</Text>
                                            </Heading>
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent accordion toggle
                                                    toggleDriverShowAll(driverIdx);
                                                }}
                                                ml={2}
                                            >
                                                {showAll[driverIdx] ? "Show Fewer" : "Show All"}
                                            </Button>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        <AccordionRunsPanel key={driverIdx} runs={driverResult.results} showAllRuns={showAll[driverIdx]} />
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        <Flex mt={4} mr={4} gap={4} justifyContent="right" flexWrap="wrap">
                            <Button colorScheme="blue" onClick={() => downloadAllRunsAsZip(projectName, response)}>
                                Download All Runs as ZIP
                            </Button>
                        </Flex>
                    </>
                )
            ) : toolName === "sobol GSA" ? (
                !response || !response.aMatrix || !response.bMatrix || !response.sobolResults ? (
                    <>No {processName} runs in this session yet.</>
                ) : (
                    <> <Heading size='sm' mt={2}>Base Results</Heading>
                        <Accordion allowMultiple>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Heading size="sm" flex="1" textAlign="left">A Matrix</Heading>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <AccordionRunsPanel runs={response.aMatrix} showAllRuns={false} />
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Heading size="sm" flex="1" textAlign="left">B Matrix</Heading>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <AccordionRunsPanel runs={response.bMatrix} showAllRuns={false} />
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                        <Divider />
                        <Heading size='sm' mt={2}>Per Driver Results</Heading>
                        <Accordion allowMultiple>
                            {response.sobolResults.map((driverResult, driverIdx) => (
                                <AccordionItem key={driverIdx}>
                                    <h2>
                                        <AccordionButton>
                                            <Heading size="sm" flex="1" textAlign="left">
                                                Driver: <Text as="span" fontWeight="semibold" color="var(--chakra-colors-gray-500)">{driverResult.driverName}</Text>
                                            </Heading>
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent accordion toggle
                                                    toggleDriverShowAll(driverIdx);
                                                }}
                                                ml={2}
                                            >
                                                {showAll[driverIdx + 2] ? "Show Fewer" : "Show All"}
                                            </Button>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        <AccordionRunsPanel key={driverIdx} runs={driverResult.results} showAllRuns={showAll[driverIdx + 2]} />
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>
                            <Flex mt={4} mr={4} gap={4} justifyContent="right" flexWrap="wrap">
                        <Button colorScheme="blue" onClick={() => downloadAllRunsAsZip(projectName, response)}>
                            Download All Runs as ZIP
                        </Button></Flex>
                    </>
                )
            ) : (
                <>Unknown tool name: <em>{toolName}</em></>
            )}


        </CardBody>
    </Card >

// #endregion
}

