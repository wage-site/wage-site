interface AJAXSensor {
  id: string;
  latitude: string;
  longitude: string;
  altitude: string;
  city: string;
  country: string;
  placement: string;
  randomize: any;
  hidden: boolean;
  picture: string;
  note: string;
  versionhw: string;
  versionsw: string;
  status: string;
  userid: string;
}

interface Sensor {
  id: string;
  name: string;
  coords: [number, number];
  active: boolean;
  picture: string;
}

interface SensorData {
  name: string | null | undefined;
  picture: string | null | undefined;
  gas1: number | null | undefined;
  humidity: number | null | undefined;
  temperature: number | null | undefined;
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  pressure: number | null | undefined;
  time: number | null | undefined;
  timelocal: number | null | undefined;
  pm1: number | null | undefined;
  pm10: number | null | undefined;
  pm25: number | null | undefined;
  date: string | null | undefined;
}
