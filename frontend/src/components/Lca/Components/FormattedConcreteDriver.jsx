import { Box, Tab, Text } from "@chakra-ui/react";

const FormattedConcreteDriver = ({ concreteCostDriver, cType }) => {
  let cost = concreteCostDriver.cost;
  // console.log("ihfhahhsf", cType, cost)
  let exponent, formattedNumber;
  let mcFormatted = {};
  if (cType == "lazy") {
    [formattedNumber, exponent] = formatNumber(cost);
    // console.log("formattedNumber:", formattedNumber, "exponent:", exponent);
  } else {
    mcFormatted.mean = formatNumber(cost.mean);
    mcFormatted.median = formatNumber(cost.median);
    mcFormatted.stdDev = formatNumber(cost.stdDev);
    // console.log("aba " + cost)
  }

  return (
    <Box>
      <Text as="span">{concreteCostDriver.name}: </Text>
      {cType !== "monte carlo" ? (
        <Text>
          <Text as="span">{formattedNumber}</Text>
          {exponent !== "0" && exponent !== "+0" && exponent !== "-0" &&
            <Text as="sup" fontWeight={"bold"}>{parseInt(exponent, 10)}</Text>
          }
        </Text>
      ) : (
        <div>
          <Text as="span">{"mean: " + mcFormatted.mean[0]}</Text>
          {mcFormatted.mean[1] !== "0" && mcFormatted.mean[1] !== "+0" &&
            <Text as="sup" fontWeight={"bold"}>{parseInt(mcFormatted.mean[1], 10)}</Text>
          }
          <Text as="span">&nbsp;&nbsp;&nbsp;</Text>
          <Text as="span">{"median: " + mcFormatted.median[0]}</Text>
          {mcFormatted.median[1] !== "0" && mcFormatted.median[1] !== "+0" &&
            <Text as="sup" fontWeight={"bold"}>{parseInt(mcFormatted.median[1], 10)}</Text>
          }
          <Text as="span">&nbsp;&nbsp;&nbsp;</Text>
          <Text as="span">{"stdDev: " + mcFormatted.stdDev[0]}</Text>
          {mcFormatted.stdDev[1] !== "0" && mcFormatted.stdDev[1] !== "+0" &&
            <Text as="sup" fontWeight={"bold"}>{parseInt(mcFormatted.stdDev[1], 10)}</Text>
          }
        </div>
      )}
    </Box>
  );
};


/**
 * formats a number into scientific notation with two decimal places
 * except for 0, which is returned as "0"
 * and for exponents of 0, which are not shown
 * @param {number} number 
 * @returns formattedNumber 
 * @returns exponent
 */
function formatNumber(number) {
  if (typeof number !== "number") return ["-", "-"];
  // console.log("formatNumber called with:", number);
  if (number === 0) return ["0", "0"];
  let [coefficient, exponent] = number.toExponential(2).split('e');
  let formattedNumber;
  if (exponent === "0" || exponent === "+0" || exponent === "-0") {
    formattedNumber = coefficient;
  } else
    formattedNumber = `${coefficient} × 10`;
  // console.log("number:", number, "Exponent:", exponent, typeof exponent);
  return [formattedNumber, exponent];
}

export default FormattedConcreteDriver;