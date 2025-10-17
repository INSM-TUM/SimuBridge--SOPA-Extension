import React, { useRef } from 'react';
import { Button, Input, Text } from '@chakra-ui/react';
import untar from 'js-untar';
import { saveDbChunk, deleteProjectData, extractCostsFromXMLString } from './../analysisUtils';
const MC_CHUNK_SIZE = 1000;

export default function FolderUploadButton({ projectName, onUpload, ...buttonProps }) {
    const fileInputRef = useRef(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            await deleteProjectData(projectName);
            const metadata = await uploadAndSaveTarChunks(file, projectName);
            onUpload({ metadata });
        } catch (error) {
            console.error('Error processing TAR file:', error);
            alert(`Failed to process TAR file. Error: ${error.message}`);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".tar"
                hidden
            />
            <Button
                onClick={handleButtonClick}
                // disable button if no project selected
                isDisabled={!projectName}
                colorScheme="green"
                variant="outline"
                {...buttonProps}
            >
                <Text>Upload Results TAR</Text>
            </Button>
        </>
    );
}




// decode Uint8Array buffer into string
function decodeBuffer(buffer) {
    return new TextDecoder().decode(buffer);
}

export async function uploadAndSaveTarChunks(file, projectName) {
    if (!file || !projectName) {
        throw new Error("A file and projectName are required.");
    }

    const fileBuffer = await file.arrayBuffer();
    const extractedFiles = await untar(fileBuffer);

    // get metadata
    const metadataFile = extractedFiles.find(f => f.name.endsWith('_metadata.json'));
    if (!metadataFile) {
        throw new Error("Could not find a metadata JSON file in the TAR archive.");
    }
    const metadata = JSON.parse(decodeBuffer(metadataFile.buffer));


    const fileGroups = new Map();
    for (const extractedFile of extractedFiles) {
        if (extractedFile.name.endsWith('.xml')) {
            const pathParts = extractedFile.name.split('/');
            const fileName = pathParts.pop();
            const groupKey = pathParts.join('/'); // e.g., 'A_Matrix', 'Driver_DriverA', or '' for MC
            if (!fileGroups.has(groupKey)) {
                fileGroups.set(groupKey, []);
            }

            const content = decodeBuffer(extractedFile.buffer);
            const extractedData = extractCostsFromXMLString(content);

            if (groupKey.startsWith('Baseline_')) {
                console.log("Baseline found:", extractedData);
                fileGroups.get(groupKey).push({ fileName, extractedData });

            } else {
                const runMatch = fileName.match(/^run(\d+)_/);
                if (runMatch) {
                    const runIndex = parseInt(runMatch[1], 10) - 1; // 0 indexed
                    // put at index to preserve order
                    fileGroups.get(groupKey)[runIndex] = { fileName, extractedData };
                }
            }
        }
    }

    const savePromises = [];

    switch (metadata.toolName) {
        case "sobol GSA":
            for (const [groupKey, results] of fileGroups.entries()) {
                if (groupKey === 'A_Matrix') {
                    savePromises.push(saveDbChunk(projectName, 'aMatrix', results));
                } else if (groupKey === 'B_Matrix') {
                    savePromises.push(saveDbChunk(projectName, 'bMatrix', results));
                } else if (groupKey.startsWith('Driver_')) {
                    const driverName = groupKey.replace('Driver_', '');
                    const chunkData = { results, driverName };
                    savePromises.push(saveDbChunk(projectName, `driver_${driverName}`, chunkData));

                }
            }
            break;

        case "local SA":
            for (const [groupKey, results] of fileGroups.entries()) {

                if (groupKey.startsWith('Baseline_')) {
                    console.log("groupKey b:", groupKey, "results:", results);
                    savePromises.push(saveDbChunk(projectName, 'baseline', {
                        baselineResults: results[0],
                        driverName: 'baseline'
                    }));
                } else if (groupKey.startsWith('Driver_')) {
                    const driverName = groupKey.replace('Driver_', '');
                    // const driverIndex = metadata.driversStructure.findIndex(d => d.name === driverName); doesnt work with abstract drivers
                    // console.log("groupKey:", groupKey, "results:", results, metadata);
                    const driverMetadata = metadata.inputData[driverName];
                    if (driverMetadata) {
                        const chunkData = {
                            driverName: driverName,
                            results: results,
                            inputSamples: driverMetadata.inputSamples,
                            baseMean: driverMetadata.baseMean
                        };
                        savePromises.push(saveDbChunk(projectName, `driver_${driverName}`, chunkData));
                    }
                }
            }
            break;

        default: // MC
            const allMcResults = fileGroups.get('') || [];
            const numChunks = Math.ceil(allMcResults.length / MC_CHUNK_SIZE);
            metadata.chunkInfo = { chunkCount: numChunks, chunkSize: MC_CHUNK_SIZE };

            for (let i = 0; i < numChunks; i++) {
                const chunkStart = i * MC_CHUNK_SIZE;
                const chunkEnd = chunkStart + MC_CHUNK_SIZE;
                const chunkData = allMcResults.slice(chunkStart, chunkEnd);
                savePromises.push(saveDbChunk(projectName, `mc_chunk_${i}`, chunkData));
            }
            break;
    }
    await saveDbChunk(projectName, 'analysisResults', metadata);
    await Promise.all(savePromises);
    return metadata;
}