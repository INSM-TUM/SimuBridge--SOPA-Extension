import { Button, Card, CardBody, CardHeader, Flex, Heading, ListItem, Textarea, UnorderedList, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/react";
import { useState } from "react";
import { downloadFile, fetchFileBlob } from "../util/Storage";
import JSZip from "jszip";
import { saveAs } from "file-saver";


export default function ToolRunOutputCard({ projectName, response, toolName, processName, filePrefix }) {
    const initialVisible = 3; // show first 3 runs by default
    const [showAll, setShowAll] = useState(false);

    const runs = Array.isArray(response) ? response : response ? [response] : [];
    // console.log("[ToolRunOutputCard]", response, runs);
    if (runs.length === 1)
        response = runs[0];



    // helper to fetch and add files to zip
    async function downloadAllRunsAsZip(projectName, responses) {
        const zip = new JSZip();

        for (let idx = 0; idx < responses.length; idx++) {
            const res = responses[idx];
            if (!res.files) continue;




            for (const fileName of res.files) {
                const path = (res.requestId ? res.requestId + "/" : "") + fileName;
                const fileData = await fetchFileBlob(projectName, path);   // <-- use fetchFileBlob for raw Blob
                zip.file(`run${idx + 1}_${res.requestId}/${fileName}`, fileData);   // <-- replaced folder with runFolderName
            }
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${projectName}_SimRuns.zip`);
    }

    return <Card bg="white">
        <CardHeader>
            <Heading size='md'> Last {toolName} Run Output {response.finished && `[${new Date(response.finished).toLocaleString()}]`}</Heading>
        </CardHeader>
        <CardBody>
            {runs.length === 0 && (
                <>No {processName} runs in this session yet.</>
            )}
            {runs.length === 1 && (
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
            )}
            {runs.length > 1 &&
                <>
                    <Accordion allowMultiple>
                        {(showAll ? runs : runs.slice(0, initialVisible)).map((res, idx) => (  // <-- show only initialVisible unless showAll
                            // {runs.map((res, idx) => (
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
            }
        </CardBody>
    </Card >
}