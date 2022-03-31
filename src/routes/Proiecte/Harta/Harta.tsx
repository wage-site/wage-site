import {
  useState,
  useEffect,
  useRef,
  LegacyRef,
  useCallback,
  Fragment,
} from "react";

import mapboxgl, { Map } from "mapbox-gl";
import { useWindowSize } from "../../../lib/hooks";

import "./Harta.css";
import axios from "axios";
import { Transition } from "@headlessui/react";
import { getUnit, calcApprox } from "../../../lib/harta/sensorUtils";
import {
  faArrowRightToBracket,
  faBook,
  faCircleNotch,
  faCircleXmark,
  faRssSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Wagepedia from "../../../components/Harta/Wagepedia";

import hB from "../../../assets/svg/hartaBanner.svg";

import { Chart as ChartJS, ChartData, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
ChartJS.register(...registerables, zoomPlugin);

import { DateTime } from "luxon";

var userid = "7137",
  userkey = "a8e0ed5e1cf288124d1b84cd0c994958";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZWR5Z3V5IiwiYSI6ImNrbDNoZzB0ZjA0anoydm13ejJ2ZnI1bTUifQ.IAGnqkUNAZULY6QbYCSS7w";

function Harta() {
  const size = useWindowSize();

  const [loading, setLoading] = useState(false);

  const map = useRef<Map>();
  const mapContainer = useRef<string | HTMLElement>("");
  const [mapHeight, setMapHeight] = useState(window.innerHeight);

  const [menuOpened, setMenuOpened] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [prevMenu, setPrevMenu] = useState("");

  const [menuData, setMenuData] = useState<SensorData>();

  const [sensors, setSensors] = useState<Sensor[]>([]);

  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  const [graphData, setGraphData] =
    useState<ChartData<"line", number[], string>>();
  const [graphTime, setGraphTime] = useState(1);
  const graphTimes = [
    {
      label: "30m",
      value: 0.5,
    },
    {
      label: "1h",
      value: 1,
    },
    {
      label: "2h",
      value: 2,
    },
    {
      label: "4h",
      value: 4,
    },
    {
      label: "6h",
      value: 6,
    },
    {
      label: "12h",
      value: 12,
    },
    {
      label: "24h",
      value: 24,
    },
  ];

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [25.045456, 45.268469],
      zoom: 12,
    });
    axios({
      method: "GET",
      url: `https://data.uradmonitor.com/api/v1/devices/userid/${userid}`,
      responseType: "json",
    }).then((data) => {
      if (Object.keys(data)[0] == "error") {
        console.error("Error occured!");
      } else {
        let sensorArray: AJAXSensor[] = data.data;
        let finArray: Sensor[] = [];
        sensorArray.forEach((sensor) => {
          finArray.push({
            id: sensor.id,
            name: sensor.note,
            coords: [Number(sensor.longitude), Number(sensor.latitude)],
            active: Boolean(sensor.status),
            picture: sensor.picture,
          });
        });
        setSensors(finArray);
      }
    });
  });

  useEffect(() => {
    setMapHeight(window.innerHeight);
    forceUpdate();
  }, [size]);

  useEffect(() => {
    sensors.forEach((sensor) => {
      let element = document.getElementById(sensor.id);
      if (element && map.current)
        new mapboxgl.Marker(element, {
          color: "#34eb40",
        })
          .setLngLat(sensor.coords)
          .addTo(map.current);
    });
    forceUpdate();
  }, [sensors]);

  useEffect(() => {
    if (selectedMenu == "wagepedia" || selectedMenu == "socials") return;
    else if (selectedMenu == "") {
      setMenuData(undefined);
      setGraphData(undefined);
    } else {
      setLoading(true);
      let sensorId: string = "";
      let sensorCoords;
      let sensorPicture: string;
      sensors.map((sensor) => {
        if (sensor.name == selectedMenu) {
          sensorId = sensor.id;
          sensorCoords = sensor.coords;
          sensorPicture = sensor.picture;
        }
      });
      map.current?.easeTo({
        center: sensorCoords,
        zoom: 16,
        duration: 1000,
      });
      axios({
        method: "GET",
        url: `https://data.uradmonitor.com/api/v1/devices/${sensorId}/all`,
        headers: {
          "Content-Type": "text/plain",
          "X-User-id": userid,
          "X-User-hash": userkey,
        },
        responseType: "json",
      }).then((data) => {
        let {
          gas1,
          humidity,
          temperature,
          latitude,
          longitude,
          pressure,
          time,
          timelocal,
          pm1,
          pm10,
          pm25,
          co2,
        } = data.data[data.data.length - 1];
        let date = DateTime.fromSeconds(time).toLocaleString(
          DateTime.TIME_SIMPLE
        );
        setMenuData({
          name: selectedMenu,
          gas1: gas1,
          humidity: humidity ? humidity : null,
          temperature: temperature
            ? parseInt(temperature.toString().substring(0, 4))
            : null,
          latitude: latitude ? latitude : null,
          longitude: longitude ? longitude : null,
          pressure: pressure ? pressure : null,
          time: time ? time : null,
          timelocal: timelocal ? timelocal : null,
          pm1: pm1 ? pm1 : null,
          pm10: pm10 ? pm10 : null,
          pm25: pm25 ? pm25 : null,
          date: date,
          picture: sensorPicture,
          co2: co2 ? co2 : null,
        });
        setLoading(false);
      });
    }
  }, [selectedMenu]);

  useEffect(() => {
    if (
      selectedMenu == "wagepedia" ||
      selectedMenu == "" ||
      selectedMenu == "socials"
    )
      return;
    let sensorId: string = "";
    sensors.map((sensor) => {
      if (sensor.name == selectedMenu) {
        sensorId = sensor.id;
      }
    });
    let pm1Arr: number[] = [];
    let pm10Arr: number[] = [];
    let pm25Arr: number[] = [];
    let pmArr: number[] = [];
    let gas1Arr: number[] = [];
    let co2Arr: number[] = [];
    let timesArr: string[] = [];
    axios({
      method: "GET",
      url: `https://data.uradmonitor.com/api/v1/devices/${sensorId}/all/${
        graphTime * 3600
      }`,
      headers: {
        "Content-Type": "text/plain",
        "X-User-id": userid,
        "X-User-hash": userkey,
      },
      responseType: "json",
    }).then((data) => {
      data.data?.forEach((time: AJAXSensorData) => {
        let date = DateTime.fromSeconds(time.time).toLocaleString(
          DateTime.TIME_SIMPLE
        );
        pm1Arr.push(time.pm1);
        pm10Arr.push(time.pm10);
        pm25Arr.push(time.pm25);
        gas1Arr.push(time.gas1);
        co2Arr.push(time.co2);
        if (
          [time.pm1, time.pm10, time.pm25].filter((x) => {
            return x != undefined;
          }).length > 1
        )
          pmArr.push(calcApprox([time.pm1, time.pm10, time.pm25]));
        timesArr.push(date);
      });
      let gD: ChartData<"line", number[], string> = {
        datasets: [],
        labels: [],
      };
      if (
        pm1Arr.filter((x) => {
          return x != undefined;
        }).length > 1
      )
        gD.datasets.push({
          label: "PM1.0",
          data: pm1Arr,
          fill: false,
          borderColor: "#16A34A",
          tension: 0.1,
        });
      if (
        pm25Arr.filter((x) => {
          return x != undefined;
        }).length > 1
      )
        gD.datasets.push({
          label: "PM2.5",
          data: pm25Arr,
          fill: false,
          borderColor: "#15803D",
          tension: 0.1,
        });
      if (
        pm10Arr.filter((x) => {
          return x != undefined;
        }).length > 1
      )
        gD.datasets.push({
          label: "PM10",
          data: pm10Arr,
          fill: false,
          borderColor: "#14532D",
          tension: 0.1,
        });
      if (
        pmArr.filter((x) => {
          return x != undefined;
        }).length > 1
      )
        gD.datasets.push({
          label: "PM",
          data: pmArr,
          fill: false,
          borderColor: "#22C55E",
          tension: 0.1,
        });
      if (
        gas1Arr.filter((x) => {
          return x != undefined;
        }).length > 1
      )
        gD.datasets.push({
          label: "NO2",
          data: gas1Arr,
          fill: false,
          borderColor: "#22C55E",
          tension: 0.1,
        });
      if (
        co2Arr.filter((x) => {
          return x != undefined;
        }).length > 1
      )
        gD.datasets.push({
          label: "CO2",
          data: co2Arr,
          fill: false,
          borderColor: "#22C55E",
          tension: 0.1,
        });
      if (
        timesArr.filter((x) => {
          return x != undefined;
        }).length > 1
      )
        gD.labels = timesArr;
      setGraphData(gD);
    });
  }, [selectedMenu, graphTime]);

  function closeTab() {
    map.current?.easeTo({
      center: [25.045456, 45.268469],
      zoom: 12,
      duration: 1000,
    });
    setPrevMenu(selectedMenu);
    setSelectedMenu("");
    setMenuOpened(false);
  }

  function openTab(sensor: string) {
    if (sensor === selectedMenu) {
      closeTab();
    } else {
      setMenuOpened(true);
      setSelectedMenu(sensor);
    }
  }

  return (
    <div className="h-full w-full">
      <div
        ref={mapContainer as LegacyRef<HTMLDivElement>}
        style={{
          height: mapHeight,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
        }}
      />
      <Transition
        as={Fragment}
        show={!menuOpened}
        enter="transition-all duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-all duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute bottom-0 sm:top-0 sm:bottom-auto left-0 m-2 flex flex-row sm:flex-col justify-between items-end sm:justify-start sm:items-start w-[calc(100%-1rem)] sm:space-y-2">
          <button
            onClick={() => {
              openTab("wagepedia");
            }}
            className="py-2 px-3 bg-gray-800 hover:bg-opacity-75 transition-all duration-300 rounded-full text-white"
          >
            <FontAwesomeIcon icon={faBook} className="" />
          </button>
          <Link
            to="/"
            className="py-3 px-4 sm:py-2 sm:px-3 bg-gray-800 hover:bg-opacity-75 transition-all duration-300 rounded-full text-white"
          >
            <FontAwesomeIcon
              icon={faArrowRightToBracket}
              className="rotate-180"
            />
          </Link>
          <button
            onClick={() => {
              openTab("socials");
            }}
            className="py-2 px-3 bg-gray-800 hover:bg-opacity-75 transition-all duration-300 rounded-full text-white"
          >
            <FontAwesomeIcon icon={faRssSquare} className="" />
          </button>
        </div>
      </Transition>
      <div className="top-0 left-0 relative m-2"></div>
      <div className="h-[calc(100%-1rem)]">
        <Transition
          as={Fragment}
          show={menuOpened}
          enter="transition-all duration-500"
          enterFrom="-translate-x-64 opacity-0"
          enterTo="-translate-x-0 opacity-100"
          leave="transition-all duration-500"
          leaveFrom="-translate-x-0 opacity-100"
          leaveTo="-translate-x-64 opacity-0"
        >
          {selectedMenu == "socials" ? (
            <div className="bg-slate-50 shadow-md m-2 ml-2 rounded-lg flex flex-col space-y-6 z-50 sm:w-[22rem] w-[calc(100%-1rem)] relative top-0 left-0 p-4">
              <div className="grid grid-cols-3 grid-rows-1 justify-items-center justify-between items-start text-2xl">
                <div />
                <span className="text-2xl font-bold pt-4">Socials</span>
                <div className="flex flex-row justify-end w-full text-white">
                  <button
                    onClick={() => {
                      closeTab();
                    }}
                    className="flex flex-row justify-center items-center space-x-1.5 bg-gray-900 pl-1 pr-2 bg-opacity-50 hover:bg-opacity-75 transition-all duration-200 rounded-full py-0.5"
                  >
                    <FontAwesomeIcon icon={faCircleXmark} className="h-4 w-4" />
                    <span className="text-sm">Inchide</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center space-y-2">
                <div>
                  <a
                    href="https://instagram.com/wage_team_cndg"
                    className="flex flex-row justify-center items-center space-x-1"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                    <span>Instagram</span>
                  </a>
                </div>
                <div>
                  <a
                    href="https://www.facebook.com/wageteam"
                    className="flex flex-row justify-center items-center space-x-1"
                  >
                    <FontAwesomeIcon icon={faFacebookSquare} />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          ) : selectedMenu == "wagepedia" ? (
            <div className="bg-slate-50 shadow-md h-full m-2 ml-2 rounded-lg flex flex-col z-50 md:w-[42rem] w-[calc(100%-1rem)] relative top-0 left-0">
              <div className="h-full w-full">
                <Wagepedia
                  closeFunc={() => {
                    closeTab();
                  }}
                />
              </div>
            </div>
          ) : selectedMenu == "" ? (
            <div
              className={`${
                prevMenu == "wagepedia"
                  ? "bg-slate-50 shadow-md h-full m-2 ml-2 rounded-lg flex flex-col z-50 md:w-[42rem] w-[calc(100%-1rem)] relative top-0 left-0"
                  : prevMenu == "socials"
                  ? "bg-slate-50 shadow-md m-2 ml-2 rounded-lg flex flex-col space-y-6 z-50 sm:w-[22rem] w-[calc(100%-1rem)] relative top-0 left-0 p-4"
                  : "bg-slate-50 shadow-md h-full m-2 ml-2 rounded-lg flex flex-col z-50 sm:w-96 w-[calc(100%-1rem)] relative top-0 left-0"
              }`}
            ></div>
          ) : (
            <div className="bg-slate-50 shadow-md h-full m-2 ml-2 rounded-lg flex flex-col z-50 sm:w-96 w-[calc(100%-1rem)] relative top-0 left-0">
              {loading ? (
                <div className="flex flex-row h-full w-full justify-center items-center space-x-2">
                  <FontAwesomeIcon
                    icon={faCircleNotch}
                    className="animate-spin"
                  />
                  <span>Loading...</span>
                </div>
              ) : (
                menuData && (
                  <>
                    <div className="relative h-32">
                      <img
                        src={hB}
                        className="h-full object-cover w-full rounded-t-lg brightness-50 absolute top-0 left-0"
                      />
                      <div className="relative p-4 flex flex-col justify-between h-full space-y-5 sm:space-y-6">
                        <div className="flex flex-row justify-between items-center">
                          <div className="text-xl text-white flex flex-row justify-center items-center space-x-3">
                            <span>{menuData?.name}</span>
                          </div>
                          <div className="text-white">
                            <button
                              onClick={() => {
                                closeTab();
                              }}
                              className="flex flex-row justify-center items-center space-x-1.5 bg-gray-900 pl-1 pr-2 bg-opacity-50 hover:bg-opacity-75 transition-all duration-200 rounded-full py-0.5"
                            >
                              <FontAwesomeIcon
                                icon={faCircleXmark}
                                className="h-4 w-4"
                              />
                              <span className="text-sm">Inchide</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          {[
                            menuData?.pm1,
                            menuData?.pm10,
                            menuData?.pm25,
                          ].filter((x) => {
                            return x != undefined || x != null;
                          }).length > 1 ? (
                            <div className="flex flex-row h-full space-x-1">
                              <div
                                className={`w-4 h-full bg-contain bg-center bg-no-repeat mr-2 marker-${
                                  calcApprox([
                                    menuData?.pm1,
                                    menuData?.pm10,
                                    menuData?.pm25,
                                  ]) > 150
                                    ? "unhealthy"
                                    : calcApprox([
                                        menuData?.pm1,
                                        menuData?.pm10,
                                        menuData?.pm25,
                                      ]) > 100
                                    ? "usg"
                                    : calcApprox([
                                        menuData?.pm1,
                                        menuData?.pm10,
                                        menuData?.pm25,
                                      ]) > 50
                                    ? "moderate"
                                    : "good"
                                }`}
                              ></div>
                              <div className="flex flex-row items-end justify-start text-white space-x-2">
                                <span className="text-4xl">
                                  {calcApprox([
                                    menuData?.pm1,
                                    menuData?.pm10,
                                    menuData?.pm25,
                                  ])}
                                </span>
                                <span className="text-sm sm:text-base">
                                  Particule in suspensie (PM)
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div> </div>
                          )}
                          <div className="text-lg text-white px-3 bg-gray-900 bg-opacity-50 rounded-full">
                            {menuData?.temperature}
                            {getUnit("temperature")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between h-full p-4 overflow-y-auto overflow-x-hidden scrollbar-thin space-y-3">
                      <div className="flex flex-col space-y-2">
                        <div className="flex flex-row justify-center items-center w-full space-x-2">
                          <span className="mb-[2px]">Particule</span>
                          <div className="w-full h-px bg-black opacity-25 rounded-full" />
                        </div>
                        {menuData.gas1 != null && (
                          <div className="grid grid-cols-2 grid-rows-1 w-full">
                            <div className="flex flex-row justify-start text-xl">
                              NO2
                            </div>
                            <div className="flex flex-row justify-end items-center">
                              {menuData.gas1} {getUnit("gas1")}
                            </div>
                          </div>
                        )}
                        {menuData.co2 != null && (
                          <div className="grid grid-cols-2 grid-rows-1 w-full">
                            <div className="flex flex-row justify-start text-xl">
                              CO2
                            </div>
                            <div className="flex flex-row justify-end items-center">
                              {menuData.co2} {getUnit("co2")}
                            </div>
                          </div>
                        )}
                        {menuData.pm1 != null && (
                          <div className="grid grid-cols-2 grid-rows-1 w-full">
                            <div className="flex flex-row justify-start text-xl">
                              PM1.0
                            </div>
                            <div className="flex flex-row justify-end items-center">
                              {menuData.pm1} {getUnit("pm10")}
                            </div>
                          </div>
                        )}
                        {menuData.pm25 != null && (
                          <div className="grid grid-cols-2 grid-rows-1 w-full">
                            <div className="flex flex-row justify-start text-xl">
                              PM2.5
                            </div>
                            <div className="flex flex-row justify-end items-center">
                              {menuData.pm25} {getUnit("pm25")}
                            </div>
                          </div>
                        )}
                        {menuData.pm10 != null && (
                          <div className="grid grid-cols-2 grid-rows-1 w-full">
                            <div className="flex flex-row justify-start text-xl">
                              PM10
                            </div>
                            <div className="flex flex-row justify-end items-center">
                              {menuData.pm10} {getUnit("pm10")}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-row justify-center items-center w-full space-x-2">
                          <span className="mb-[2px]">Altele</span>
                          <div className="w-full h-px bg-black opacity-25 rounded-full" />
                        </div>
                        {menuData.pressure != null && (
                          <div className="grid grid-cols-2 grid-rows-1 w-full">
                            <div className="flex flex-row justify-start text-xl">
                              Presiune
                            </div>
                            <div className="flex flex-row justify-end items-center">
                              {menuData.pressure / 100} {getUnit("pressure")}
                            </div>
                          </div>
                        )}
                        {menuData.humidity != null && (
                          <div className="grid grid-cols-2 grid-rows-1 w-full">
                            <div className="flex flex-row justify-start text-xl">
                              Umiditate
                            </div>
                            <div className="flex flex-row justify-end items-center">
                              {menuData.humidity} {getUnit("humidity")}
                            </div>
                          </div>
                        )}
                        <div className="pt-2 w-full flex flex-col justify-center items-center space-y-2">
                          <div className="h-64 w-full">
                            <Line
                              data={graphData ? graphData : { datasets: [] }}
                              options={{
                                maintainAspectRatio: false,
                                plugins: {
                                  zoom: {
                                    zoom: {
                                      wheel: {
                                        enabled: true,
                                      },
                                      pinch: {
                                        enabled: true,
                                      },
                                      drag: {
                                        enabled: true,
                                      },
                                      mode: "x",
                                    },
                                  },
                                },
                              }}
                            />
                          </div>
                          <div className="flex flex-row space-x-2">
                            {graphTimes.map((time) => (
                              <button
                                onClick={() => setGraphTime(time.value)}
                                disabled={graphTime == time.value}
                                key={time.label}
                                className={`${
                                  graphTime == time.value
                                    ? "ring-2 ring-green-600 bg-opacity-75"
                                    : "bg-opacity-50 hover:bg-opacity-75"
                                } bg-gray-300 px-2.5 rounded-full transition-all duration-200`}
                              >
                                {time.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 grid-rows-1 w-full">
                        <div className="flex flex-row justify-start items-center text-xl">
                          <span className="mb-[2px] text-xs opacity-50">
                            Ultima actualizare la {menuData.date}
                          </span>
                        </div>
                        <div className="flex flex-row justify-end items-center"></div>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>
          )}
        </Transition>
      </div>
      {sensors.map((sensor) => (
        <button
          className={`marker marker-good ${sensor.active ? "" : "grayscale"}`}
          key={sensor.name}
          id={sensor.id}
          disabled={sensor.active ? false : true}
          onClick={() => openTab(sensor.name)}
        >
          {" "}
        </button>
      ))}
    </div>
  );
}

export default Harta;
