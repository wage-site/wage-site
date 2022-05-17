/**
 * Get the unit used for a specific type of sensor
 * @param sensor Sensor type to get unit for
 * @returns Unit used fot the type of sensor passed
 */
export function getUnit(sensor: string) {
  switch (sensor) {
    case "temperature":
      return "°C";
    case "cpm":
      return "CPM";
    case "voltage1":
      return "Volts";
    case "duty":
      return "‰";
    case "pressure":
      return "Pa";
    case "humidity":
      return "% RH";
    case "gas1":
      return "ppm";
    case "gas2":
      return "ppm";
    case "gas3":
      return "ppm";
    case "gas4":
      return "ppm";
    case "dust":
      return "mg/m³";
    case "co2":
      return "ppm";
    case "ch2o":
      return "ppm";
    case "pm25":
      return "µg/m³";
    case "pm10":
      return "µg/m³";
    case "noise":
      return "dBA";
    case "voc":
      return "voc";
  }
}

/**
 * Get the arithmetic mean of the args passed
 * @param [...values] Values to get the arithmetic mean of
 * @returns The arithmetic mean of the values passed
 */
export function calcApprox([...values]: Array<
  number | undefined | null
>): number {
  let arr = values.filter((x) => {
    return x != null || x !== undefined;
  });
  let sum = arr.reduce((total, x) => Number(total) + Number(x));
  let fin = Number(sum) / arr.length;
  return parseInt(String(fin));
}
