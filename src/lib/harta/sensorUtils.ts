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

export function calcApprox([...values]: Array<
  number | undefined | null
>): number {
  let sum: number = 0;
  let undefineds: number = 0;
  let val: number;
  values.forEach((value) => {
    if (value != undefined && value != null) sum += value;
    else undefineds++;
  });
  val = sum / (values.length - undefineds);
  return parseInt(String(val).substring(0, 2));
}
