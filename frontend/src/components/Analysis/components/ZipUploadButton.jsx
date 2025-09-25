import { useRef } from 'react';
import { Button, Input, Text } from '@chakra-ui/react';
import JSZip from "jszip";
import { use } from 'react';

export default function ZipUploadButton({ onUpload, ...buttonProps }) {
    const fileInputRef = useRef(null);
    // const [toolNa#me, setToolName] = useRef(null); // or "local SA Analysis"

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const results = await uploadAndParseResultsZip(file);
            onUpload(results);
        } catch (error) {
            console.error('Error parsing ZIP file:', error);
            alert('Failed to parse ZIP file. Please check the format.');
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
                accept=".zip"
                hidden
            />
            <Button
                onClick={handleButtonClick}
                colorScheme="green"
                variant="outline"
                {...buttonProps}
            >
                <Text>Upload Results ZIP</Text>
            </Button>
        </>
    );
};

// // Usage in component:
// {
//   toolName === "local SA Analysis" ? (
//     <ZipUploadButton
//       onUpload={(parsedResults) => {
//         // Handle the parsed results - either set state or merge with existing
//         setResponse(parsedResults);
//       }}
//       toolName={toolName}
//       size="sm"
//       ml={2}
//     />
//   ) : (
//     <ZipUploadButton
//       onUpload={(parsedResults) => {
//         setRuns(parsedResults);
//       }}
//       toolName={toolName}
//       size="sm"
//       ml={2}
//     />
//   )
// }



//#region Helpers to upload and prepare parse
async function uploadAndParseResultsZip(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async function (event) {
            try {
                const arrayBuffer = event.target.result;
                const zip = await JSZip.loadAsync(arrayBuffer);
                // Auto-detect tool type from ZIP structure
                const toolType = detectToolTypeFromZip(zip);
                console.log("[zip upload] Detected tool type:", toolType);
                // setToolName(toolType);

                if (toolType === "local SA") {
                    // Parse LSA structure
                    const lsaResults = await parseLSAZip(zip);
                    resolve({
                        toolName: toolType,
                        results: lsaResults
                    });
                } else if (toolType === "monte carlo") {
                    // Parse Monte Carlo structure
                    const mcResults = await parseMCZip(zip);

                    resolve({
                        toolName: toolType,
                        results: mcResults
                    });
                }
                else if (toolType === "sobol GSA") {
                    // Parse Monte Carlo structure
                    const mcResults = await parseSobolZip(zip);

                    resolve({
                        toolName: toolType,
                        results: mcResults
                    });
                }
                else {
                    reject(new Error("Unknown tool type or unsupported ZIP structure"));
                }
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

// Even simpler - check all entries for Driver_ pattern
function detectToolTypeFromZip(zip) {
    for (const relativePath of Object.keys(zip.files)) {
        if (relativePath.includes('A_Matrix') || relativePath.includes('B_Matrix    ')) {
            return "sobol GSA";
        }
        else if (relativePath.includes('Driver_')) {
            return "local SA";
        }
    }
    return "monte carlo";
}
//#endregion

//#region Parser Functions
// Parse LSA ZIP structure


async function parseLSAZipX(zip) {
    const results = [];
    const driverFolders = {};
    const baselineResults = {files:[], requestId: null};

    // Group files by driver folder or baseline folder
    zip.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir) {
            const pathParts = relativePath.split('/');
            if (pathParts.length >= 2) {
                const folderName = pathParts[0];
                const fileName = pathParts[1];

                const baselineMatch = folderName.match(/^Baseline_(.+)/);
                if (baselineMatch) {
                    baselineResults.files.push(fileName)
                    baselineResults.requestId = baselineMatch[1];
                    return; // Skip to next entry
                }

                if (pathParts.length >= 3) {
                    const driverFolder = pathParts[0]; // e.g., Driver_a_concrete_c
                    const runFolder = pathParts[1];    // e.g., run1_req123
                    const driverFileName = pathParts[2]; // File inside the run folder

                    if (!driverFolders[driverFolder]) {
                        driverFolders[driverFolder] = {};
                    }
                    if (!driverFolders[driverFolder][runFolder]) {
                        driverFolders[driverFolder][runFolder] = { files: [] };
                    }
                    driverFolders[driverFolder][runFolder].files.push(driverFileName);
                }
            }
        }
    });

    // Process each driver
    for (const [driverPath, runs] of Object.entries(driverFolders)) {
        const driverMatch = driverPath.match(/^Driver_(.+)/);
        if (driverMatch) {
            const driverName = driverMatch[1];
            const driverResults = [];

            for (const [runPath, runData] of Object.entries(runs)) {
                const runMatch = runPath.match(/run\d+_(.+)/);
                if (runMatch) {
                    const requestId = runMatch[1];
                    driverResults.push({
                        requestId: requestId,
                        files: runData.files,
                    });
                }
            }

            results.push({
                driverName: driverName,
                results: driverResults.sort((a, b) => a.requestId.localeCompare(b.requestId))
            });
        }
    }

    if (baselineResults.files.length > 0) {
        results.push({
            driverName: 'baseline',
            baselineResults: baselineResults
        });
    }

    return results.sort((a, b) => a.driverName.localeCompare(b.driverName));
}

async function parseLSAZip(zip) {
    const results = [];
    const driverFolders = {};
    const baselineResults = { files: [], requestId: null };

    const groups = await groupByFirstFolder(zip, 2);

    for (const [folderName, entries] of Object.entries(groups)) {
        const baselineMatch = extractWithRegex(folderName, /^Baseline_(.+)/);
        if (baselineMatch) {
            for (const { file } of entries) {
                baselineResults.files.push(file);
            }
            baselineResults.requestId = baselineMatch[0];
            continue;
        }

        const driverMatch = extractWithRegex(folderName, /^Driver_(.+)/);
        if (driverMatch) {
            for (const { parts } of entries) {
                if (parts.length >= 3) {
                    const runFolder = parts[1];
                    const driverFileName = parts[2];
                    driverFolders[folderName] ??= {};
                    driverFolders[folderName][runFolder] ??= { files: [] };
                    driverFolders[folderName][runFolder].files.push(driverFileName);
                }
            }
        }
    }

    for (const [driverPath, runs] of Object.entries(driverFolders)) {
        const driverName = extractWithRegex(driverPath, /^Driver_(.+)/)[0];
        const driverResults = [];

        for (const [runPath, runData] of Object.entries(runs)) {
            const runMatch = extractWithRegex(runPath, /run\d+_(.+)/);
            if (runMatch) {
                driverResults.push({ requestId: runMatch[0], files: runData.files });
            }
        }

        results.push({ driverName, results: sortByKey(driverResults, 'requestId') });
    }

    if (baselineResults.files.length > 0) {
        results.push({ driverName: 'baseline', baselineResults });
    }

    return sortByKey(results, 'driverName');
}


// Parse Monte Carlo ZIP structure
async function parseMCZipX(zip) {
    const results = [];
    const runFolders = {};
    // const runFolders = await groupByFirstFolder(zip, 2);

    // Group files by run folder
    zip.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir) {
            const pathParts = relativePath.split('/');
            if (pathParts.length >= 2) { // runX_requestId/file.txt
                const runFolder = pathParts[0];
                const fileName = pathParts[1];

                if (!runFolders[runFolder]) {
                    runFolders[runFolder] = { files: [] };
                }

                runFolders[runFolder].files.push(fileName);
            }
        }
    });

    // Process each run - UPDATED REGEX
    for (const [runPath, runData] of Object.entries(runFolders)) {
        const runMatch = runPath.match(/run(\d+)_(.+)/i); // case-insensitive, matches "run1_requestId"
        if (runMatch) {
            const runIdx = parseInt(runMatch[1]);
            const requestId = runMatch[2]; // Extract the original requestId

            results.push({
                requestId: requestId, // Use the original requestId
                runNumber: runIdx,
                files: runData.files,
            });
        }
    }

    return results.sort((a, b) => a.runNumber - b.runNumber);
}

async function parseMCZip(zip) {
    const results = [];
    const runFolders = await groupByFirstFolder(zip, 2);

    for (const [runPath, entries] of Object.entries(runFolders)) {
        const runMatch = extractWithRegex(runPath, /run(\d+)_(.+)/i);
        if (runMatch) {
            const runIdx = parseInt(runMatch[0]);
            const requestId = runMatch[1];
            results.push({
                requestId,
                runNumber: runIdx,
                files: entries.map(e => e.file),
            });
        }
    }

    console.log("[zip upload] Parsed MC results:", results);

    return sortByKey(results, 'runNumber');
}

async function parseSobolZip(zip) {
    const aMatrix = [];
    const bMatrix = [];
    const driverFolders = {};
    const sobolResults = [];

    const groups = await groupByFirstFolder(zip, 2);

    for (const [folderName, entries] of Object.entries(groups)) {
        if (/^A_Matrix$/i.test(folderName)) {
            for (const { parts, file } of entries) {
                if (parts.length >= 2) {
                    const runFolder = parts[0]; // A_Matrix
                    const requestId = parts[1].split("_")[0] || null; // try extract reqId from file name
                    aMatrix.push({ requestId, files: [file] });
                }
            }
            continue;
        }

        if (/^B_Matrix$/i.test(folderName)) {
            for (const { parts, file } of entries) {
                if (parts.length >= 2) {
                    const runFolder = parts[0]; // B_Matrix
                    const requestId = parts[1].split("_")[0] || null;
                    bMatrix.push({ requestId, files: [file] });
                }
            }
            continue;
        }

        const driverMatch = extractWithRegex(folderName, /^Driver_(.+)/);
        if (driverMatch) {
            for (const { parts } of entries) {
                if (parts.length >= 3) {
                    const runFolder = parts[1];
                    const driverFileName = parts[2];
                    driverFolders[folderName] ??= {};
                    driverFolders[folderName][runFolder] ??= { files: [] };
                    driverFolders[folderName][runFolder].files.push(driverFileName);
                }
            }
        }
    }

    // Process driver folders
    for (const [driverPath, runs] of Object.entries(driverFolders)) {
        const driverName = extractWithRegex(driverPath, /^Driver_(.+)/)[0];
        const driverResults = [];

        for (const [runPath, runData] of Object.entries(runs)) {
            const runMatch = extractWithRegex(runPath, /run\d+_(.+)/);
            if (runMatch) {
                driverResults.push({ requestId: runMatch[0], files: runData.files });
            }
        }

        sobolResults.push({
            driverName,
            results: sortByKey(driverResults, "requestId")
        });
    }

    return {
        aMatrix: sortByKey(aMatrix, "requestId"),
        bMatrix: sortByKey(bMatrix, "requestId"),
        sobolResults: sortByKey(sobolResults, "driverName")
    };
}


//#endregion


//#region parser helpers
async function groupByFirstFolder(zip, minDepth = 2) {
    const groups = {};
    zip.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir) {
            const parts = relativePath.split('/');
            if (parts.length >= minDepth) {
                const folder = parts[0];
                const file = parts[parts.length - 1];

                if (!groups[folder]) {
                    groups[folder] = [];
                }
                groups[folder].push({ parts, file });
            }
        }
    });
    return groups;
}

function extractWithRegex(str, regex) {
    const match = str.match(regex);
    return match ? match.slice(1) : null;
}

function sortByKey(arr, key) {
    return arr.sort((a, b) => {
        if (typeof a[key] === 'number') return a[key] - b[key];
        return String(a[key]).localeCompare(String(b[key]));
    });
}

//#endregion

// Usage example:
// const fileInput = document.getElementById('file-input');
// fileInput.addEventListener('change', async (e) => {
//     const file = e.target.files[0];
//     const results = await uploadAndParseResultsZip(file, "local SA Analysis");
//     console.log(results);
// });


//#endregion