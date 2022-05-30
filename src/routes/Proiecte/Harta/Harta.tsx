/* eslint-disable react-hooks/exhaustive-deps */
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRightToBracket,
  faBook,
  faCircleNotch,
  faCircleXmark,
  faRssSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/outline";
import axios from "axios";
import { Chart as ChartJS, ChartData, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import classNames from "classnames";
import { DateTime } from "luxon";
import mapboxgl, { Map } from "mapbox-gl";
import {
  Fragment,
  LegacyRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import Wagepedia from "../../../components/Harta/Wagepedia";
import { calcApprox, getUnit } from "../../../lib/harta/sensorUtils";
import useDocumentTitle from "../../../lib/hooks/useDocumentTitle";
import usePathCondition from "../../../lib/hooks/usePathCondition";
import useWindowSize from "../../../lib/hooks/useWindowSize";
import "./Harta.css";

ChartJS.register(...registerables, zoomPlugin);

var userid = "7137",
  userkey = "a8e0ed5e1cf288124d1b84cd0c994958";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZWR5Z3V5IiwiYSI6ImNrbDNoZzB0ZjA0anoydm13ejJ2ZnI1bTUifQ.IAGnqkUNAZULY6QbYCSS7w";

function Harta({ backButton = true }: { backButton?: boolean }) {
  usePathCondition(!backButton);

  useDocumentTitle(backButton ? "Harta" : "");

  const [easeTo] = useState<"campulung" | "targoviste">("campulung");
  const [easeToCoords] = useState<[number, number]>([25.045456, 45.268469]);

  const [easeToMessage] = useState(false);

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
      if (Object.keys(data)[0] === "error") {
        console.error("Error occured!");
      } else {
        let sensorArray: AJAXSensor[] = data.data;
        let finArray: Sensor[] = [];
        sensorArray.forEach((sensor) => {
          finArray.push({
            id: sensor.id,
            name: sensor.note,
            coords: [Number(sensor.longitude), Number(sensor.latitude)],
            active: ![
              "Cartier Schei",
              "Scoala Nanu Muscel",
              "Scoala Gimnaziala Oprea Iorgulescu",
              "Cartier Flamanda",
              "Scoala Theodor Aman",
            ].includes(sensor.note),
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

  function getMenu(updateLoading: boolean = true) {
    if (selectedMenu === "wagepedia" || selectedMenu === "socials") return;
    else if (selectedMenu === "") {
      setMenuData(undefined);
      setGraphData(undefined);
    } else {
      if (updateLoading) setLoading(true);
      let sensorId: string = "";
      let sensorCoords;
      let sensorPicture: string;
      sensors.forEach((sensor) => {
        if (sensor.name === selectedMenu) {
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
          humidity: humidity,
          temperature: temperature
            ? parseInt(temperature.toString().substring(0, 4))
            : null,
          latitude: latitude ? latitude : null,
          longitude: longitude ? longitude : null,
          pressure: pressure ? pressure : null,
          time: time ? time : null,
          timelocal: timelocal ? timelocal : null,
          pm1: pm1,
          pm10: pm10,
          pm25: pm25,
          date: date,
          picture: sensorPicture,
          co2: co2,
        });
        if (updateLoading) setLoading(false);
      });
    }
  }

  function getGraph() {
    if (
      selectedMenu === "wagepedia" ||
      selectedMenu === "" ||
      selectedMenu === "socials"
    )
      return;
    let sensorId: string = "";
    sensors.forEach((sensor) => {
      if (sensor.name === selectedMenu) {
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
            return x !== undefined;
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
          return x !== undefined;
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
          return x !== undefined;
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
          return x !== undefined;
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
          return x !== undefined;
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
          return x !== undefined;
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
          return x !== undefined;
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
          return x !== undefined;
        }).length > 1
      )
        gD.labels = timesArr;
      setGraphData(gD);
    });
  }

  useEffect(() => {
    getMenu();
  }, [selectedMenu]);

  useEffect(() => {
    getGraph();
  }, [selectedMenu, graphTime]);

  useEffect(() => {
    if (!menuOpened) return;

    const interval = setInterval(() => {
      getMenu(false);
      getGraph();
    }, 10000);

    return () => clearInterval(interval);
  }, [menuOpened, selectedMenu, graphTime]);

  function closeTab() {
    map.current?.easeTo({
      center: easeToCoords,
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

  function getQuality(
    type: string,
    value: number
  ): { color: { border: string; indicator: string }; message: string } {
    switch (type) {
      case "pm1": {
        if (value >= 0 && value < 12.0)
          return {
            color: { border: "border-green-500", indicator: "bg-green-500" },
            message: "Calitatea aerului ideală pentru activități în aer liber.",
          };
        else if (value > 12.1 && value < 66)
          return {
            color: { border: "border-yellow-500", indicator: "bg-yellow-500" },
            message:
              "Nu modificați activitățile obișnuite în aer liber decât dacă aveți simptome cum ar fi tusea și iritația gâtului.",
          };
        else if (value > 66 && value < 99)
          return {
            color: { border: "border-orange-500", indicator: "bg-orange-500" },
            message: "Nesănătos pentru persoanele sensibile",
          };
        else if (value > 99 && value < 199)
          return {
            color: { border: "border-red-500", indicator: "bg-red-500" },
            message: "Nesanatos pentru toate tipurile de persoane",
          };
        else if (value > 200)
          return {
            color: { border: "border-black", indicator: "bg-black" },
            message: "Riscant pentru toate tipurile de persoane",
          };
        break;
      }
      case "pm25": {
        if (value >= 0 && value < 12.0)
          return {
            color: { border: "border-green-500", indicator: "bg-green-500" },
            message: "Calitatea aerului ideală pentru activități în aer liber.",
          };
        else if (value > 12.1 && value < 66)
          return {
            color: { border: "border-yellow-500", indicator: "bg-yellow-500" },
            message:
              "Nu modificați activitățile obișnuite în aer liber decât dacă aveți simptome cum ar fi tusea și iritația gâtului.",
          };
        else if (value > 66 && value < 99)
          return {
            color: { border: "border-orange-500", indicator: "bg-orange-500" },
            message: "Nesănătos pentru persoanele sensibile",
          };
        else if (value > 99 && value < 199)
          return {
            color: { border: "border-red-500", indicator: "bg-red-500" },
            message: "Nesănătos pentru toate tipurile de persoane",
          };
        else if (value > 200)
          return {
            color: { border: "border-black", indicator: "bg-black" },
            message: "Riscant pentru toate tipurile de persoane",
          };
        break;
      }
      case "pm10": {
        if (value >= 0 && value < 50)
          return {
            color: { border: "border-green-500", indicator: "bg-green-500" },
            message: "Calitatea aerului ideală pentru activități în aer liber.",
          };
        else if (value > 51 && value < 100)
          return {
            color: { border: "border-yellow-500", indicator: "bg-yellow-500" },
            message:
              "Nu modificați activitățile obișnuite în aer liber decât dacă aveți simptome cum ar fi tusea și iritația gâtului.",
          };
        else if (value > 101 && value < 150)
          return {
            color: { border: "border-orange-500", indicator: "bg-orange-500" },
            message: "Nesănătos pentru persoanele sensibile",
          };
        else if (value > 151 && value < 300)
          return {
            color: { border: "border-red-500", indicator: "bg-red-500" },
            message: "Nesanatos pentru toate tipurile de persoane",
          };
        else if (value > 300)
          return {
            color: { border: "border-black", indicator: "bg-black" },
            message: "Riscant pentru toate tipurile de persoane",
          };
        break;
      }
      case "co2": {
        if (value >= 400 && value < 1000)
          return {
            color: { border: "border-green-500", indicator: "bg-green-500" },
            message: "Calitatea aerului ideală pentru activități în aer liber.",
          };
        else if (value > 1000 && value < 2000)
          return {
            color: { border: "border-yellow-500", indicator: "bg-yellow-500" },
            message: "Nivel asociat cu senzatii de somnolență și aer slab.",
          };
        else if (value > 2000 && value < 5000)
          return {
            color: { border: "border-orange-500", indicator: "bg-orange-500" },
            message:
              "Nivel asociat cu dureri de cap, somnolență și aer stagnant, învechit și înfundat.",
          };
        else if (value > 5000 && value < 40000)
          return {
            color: { border: "border-red-500", indicator: "bg-red-500" },
            message:
              "Condiții de aer neobișnuite în care ar putea fi prezente și niveluri ridicate de alte gaze.",
          };
        else if (value > 40000)
          return {
            color: { border: "border-black", indicator: "bg-black" },
            message:
              "Acest nivel este imediat dăunător din cauza lipsei de oxigen.",
          };
        break;
      }
      case "no2": {
        if (value >= 0 && value < 50)
          return {
            color: { border: "border-green-500", indicator: "bg-green-500" },
            message: "Calitatea aerului ideală pentru activități în aer liber.",
          };
        else if (value > 51 && value < 100)
          return {
            color: { border: "border-yellow-500", indicator: "bg-yellow-500" },
            message:
              "Nu modificați activitățile obișnuite în aer liber decât dacă aveți simptome cum ar fi tusea și iritația gâtului.",
          };
        else if (value > 101 && value < 150)
          return {
            color: { border: "border-orange-500", indicator: "bg-orange-500" },
            message: "Nesănătos pentru persoanele sensibile",
          };
        else if (value > 151 && value < 200)
          return {
            color: { border: "border-red-500", indicator: "bg-red-500" },
            message: "Nesănătos pentru toate tipurile de persoane",
          };
        else if (value > 201)
          return {
            color: { border: "border-black", indicator: "bg-black" },
            message: "Riscant pentru toate tipurile de persoane",
          };
        break;
      }
      default: {
        return {
          color: { border: "border-blue-500", indicator: "bg-blue-500" },
          message: "Nu s-au inregistrat destule date!",
        };
      }
    }
    return {
      color: { border: "border-blue-500", indicator: "bg-blue-500" },
      message: "Nu s-au inregistrat destule date!",
    };
  }

  const transitionProps = {
    as: Fragment,
    enter: "transition duration-500 ease-out",
    enterFrom: "opacity-0 origin-top",
    enterTo: "opacity-100 origin-top",
    leave: "transition duration-200 ease-out",
    leaveFrom: "opacity-100 origin-top",
    leaveTo: "opacity-0 origin-top",
  };

  const popoutClasses =
    "border-0 p-2 py-3 text-sm w-full flex flex-row justify-between items-center space-x-2";

  return (
    <div className="h-full w-full font-custom">
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
        show={easeToMessage}
        enter="transition-all duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-all duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center">
          <div className="flex flex-row items-center justify-center bg-gray-200 shadow-md rounded-full px-5 py-2">
            {easeTo === "campulung" ? "Campulung" : "Targoviste"}
          </div>
        </div>
      </Transition>
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
        <div className="absolute bottom-0 sm:top-0 sm:bottom-auto left-0 m-2 flex flex-row sm:flex-col justify-between items-end sm:justify-start sm:items-start w-[calc(100%-1rem)] sm:w-min sm:space-y-2">
          {backButton && (
            <Link
              to="/"
              className="py-4 px-5 bg-slate-100 hover:bg-opacity-75 transition-all duration-300 rounded-full text-black"
            >
              <FontAwesomeIcon
                icon={faArrowRightToBracket}
                className="rotate-180"
              />
            </Link>
          )}
          <button
            onClick={() => {
              openTab("wagepedia");
            }}
            className="py-5 px-6 sm:py-4 sm:px-5 bg-slate-100 hover:bg-opacity-75 transition-all duration-300 rounded-full text-black"
          >
            <FontAwesomeIcon icon={faBook} className="" />
          </button>
          <button
            onClick={() => {
              openTab("socials");
            }}
            className="py-4 px-5 bg-slate-100 hover:bg-opacity-75 transition-all duration-300 rounded-full text-blac2"
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
          {selectedMenu === "socials" ? (
            <div className="absolute bottom-0 sm:top-0 sm:bottom-auto left-0 m-2 flex flex-row sm:flex-col justify-between items-end sm:justify-start sm:items-start w-[calc(100%-1rem)] sm:space-y-2">
              <button
                onClick={() => {
                  closeTab();
                }}
                className="py-4 px-5 bg-slate-100 hover:bg-opacity-75 transition-all duration-300 rounded-full text-black"
              >
                <FontAwesomeIcon
                  icon={faArrowRightToBracket}
                  className="rotate-180"
                />
              </button>
              <a
                href="https://instagram.com/wage_team_cndg"
                target="_blank"
                rel="noopener noreferrer"
                className="py-5 px-6 sm:py-4 sm:px-5 bg-slate-100 hover:bg-opacity-75 transition-all duration-300 rounded-full text-black"
              >
                <FontAwesomeIcon icon={faInstagram} className="" />
              </a>
              <a
                href="https://www.facebook.com/wageteam"
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 px-5 bg-slate-100 hover:bg-opacity-75 transition-all duration-300 rounded-full text-black"
              >
                <FontAwesomeIcon icon={faFacebookSquare} />
              </a>
            </div>
          ) : selectedMenu === "wagepedia" ? (
            <div className="bg-slate-50 shadow-md h-full m-2 ml-2 rounded-lg flex flex-col z-50 md:w-[42rem] w-[calc(100%-1rem)] relative top-0 left-0">
              <div className="h-full w-full">
                <Wagepedia
                  closeFunc={() => {
                    closeTab();
                  }}
                />
              </div>
            </div>
          ) : selectedMenu === "" ? (
            <div
              className={`${
                prevMenu === "wagepedia"
                  ? "bg-slate-50 shadow-md h-full m-2 ml-2 rounded-lg flex flex-col z-50 md:w-[42rem] w-[calc(100%-1rem)] relative top-0 left-0"
                  : prevMenu === "socials"
                  ? ""
                  : "bg-slate-50 shadow-md h-full m-2 ml-2 rounded-lg flex flex-col z-50 sm:w-96 w-[calc(100%-1rem)] relative top-0 left-0"
              }`}
            ></div>
          ) : (
            <div className="bg-slate-50 shadow-md h-full m-2 ml-2 rounded-lg flex flex-col z-50 sm:w-[26rem] w-[calc(100%-1rem)] relative top-0 left-0">
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
                        src="/svg/hartaBanner.svg"
                        loading="lazy"
                        className="h-full object-cover w-full rounded-t-lg brightness-50 absolute top-0 left-0"
                        alt=""
                      />
                      <div className="relative p-4 flex flex-col justify-between h-full space-y-5 sm:space-y-6">
                        <div className="flex flex-row justify-between items-center">
                          <div className="text-lg text-white flex flex-row justify-center items-center space-x-3">
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
                            return x !== undefined || x != null;
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
                    <div className="flex flex-col justify-between h-full p-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200 space-y-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex flex-row justify-center items-center w-full space-x-2">
                          <span className="mb-[2px]">Particule</span>
                          <div className="w-full h-px bg-black opacity-25 rounded-full" />
                        </div>
                        {menuData.gas1 != null && (
                          <Disclosure>
                            {({ open }) => (
                              <>
                                <Disclosure.Button>
                                  <div className="grid grid-cols-2 grid-rows-1 w-full justify-items-stretch">
                                    <div className="h-full flex flex-row justify-start items-center space-x-2">
                                      <ChevronRightIcon
                                        className={`h-4 w-4  transition-all duration-200 ${
                                          open ? "rotate-90" : "pt-0.5"
                                        }`}
                                      />
                                      <span className="text-xl">NO2</span>
                                    </div>
                                    <div className="flex flex-row justify-end items-center">
                                      {String(menuData.gas1)} {getUnit("gas1")}
                                    </div>
                                  </div>
                                </Disclosure.Button>
                                <Transition {...transitionProps}>
                                  {menuData.gas1 != null && (
                                    <Disclosure.Panel
                                      className={classNames(
                                        getQuality("no2", menuData.gas1).color
                                          .border,
                                        popoutClasses
                                      )}
                                    >
                                      <span className="">
                                        {
                                          getQuality("no2", menuData.gas1)
                                            .message
                                        }
                                      </span>
                                      <div className="flex flex-row h-full justify-end items-center">
                                        <div
                                          className={classNames(
                                            getQuality("no2", menuData.gas1)
                                              .color.indicator,
                                            "h-5 rounded-md aspect-square"
                                          )}
                                        />
                                      </div>
                                    </Disclosure.Panel>
                                  )}
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        )}
                        {menuData.pm1 != null && (
                          <Disclosure>
                            {({ open }) => (
                              <>
                                <Disclosure.Button>
                                  <div className="grid grid-cols-2 grid-rows-1 w-full justify-items-stretch">
                                    <div className="h-full flex flex-row justify-start items-center space-x-2">
                                      <ChevronRightIcon
                                        className={`h-4 w-4  transition-all duration-200 ${
                                          open ? "rotate-90" : "pt-0.5"
                                        }`}
                                      />
                                      <span className="text-xl">PM1.0</span>
                                    </div>
                                    <div className="flex flex-row justify-end items-center">
                                      {String(menuData.pm1)} {getUnit("pm10")}
                                    </div>
                                  </div>
                                </Disclosure.Button>
                                <Transition {...transitionProps}>
                                  {menuData.pm1 != null && (
                                    <Disclosure.Panel
                                      className={classNames(
                                        getQuality("pm1", menuData.pm1).color
                                          .border,
                                        popoutClasses
                                      )}
                                    >
                                      <span className="">
                                        {
                                          getQuality("pm1", menuData.pm1)
                                            .message
                                        }
                                      </span>
                                      <div className="flex flex-row h-full justify-end items-center">
                                        <div
                                          className={classNames(
                                            getQuality("pm1", menuData.pm1)
                                              .color.indicator,
                                            "h-5 rounded-md aspect-square"
                                          )}
                                        />
                                      </div>
                                    </Disclosure.Panel>
                                  )}
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        )}
                        {menuData.pm25 != null && (
                          <Disclosure>
                            {({ open }) => (
                              <>
                                <Disclosure.Button>
                                  <div className="grid grid-cols-2 grid-rows-1 w-full justify-items-stretch">
                                    <div className="h-full flex flex-row justify-start items-center space-x-2">
                                      <ChevronRightIcon
                                        className={`h-4 w-4  transition-all duration-200 ${
                                          open ? "rotate-90" : "pt-0.5"
                                        }`}
                                      />
                                      <span className="text-xl">PM2.5</span>
                                    </div>
                                    <div className="flex flex-row justify-end items-center">
                                      {String(menuData.pm25)} {getUnit("pm25")}
                                    </div>
                                  </div>
                                </Disclosure.Button>
                                <Transition {...transitionProps}>
                                  {menuData.pm25 != null && (
                                    <Disclosure.Panel
                                      className={classNames(
                                        getQuality("pm25", menuData.pm25).color
                                          .border,
                                        popoutClasses
                                      )}
                                    >
                                      <span className="">
                                        {
                                          getQuality("pm25", menuData.pm25)
                                            .message
                                        }
                                      </span>
                                      <div className="flex flex-row h-full justify-end items-center">
                                        <div
                                          className={classNames(
                                            getQuality("pm25", menuData.pm25)
                                              .color.indicator,
                                            "h-5 rounded-md aspect-square"
                                          )}
                                        />
                                      </div>
                                    </Disclosure.Panel>
                                  )}
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        )}
                        {menuData.pm10 != null && (
                          <Disclosure>
                            {({ open }) => (
                              <>
                                <Disclosure.Button>
                                  <div className="grid grid-cols-2 grid-rows-1 w-full justify-items-stretch">
                                    <div className="h-full flex flex-row justify-start items-center space-x-2">
                                      <ChevronRightIcon
                                        className={`h-4 w-4  transition-all duration-200 ${
                                          open ? "rotate-90" : "pt-0.5"
                                        }`}
                                      />
                                      <span className="text-xl">PM10</span>
                                    </div>
                                    <div className="flex flex-row justify-end items-center">
                                      {String(menuData.pm10)} {getUnit("pm10")}
                                    </div>
                                  </div>
                                </Disclosure.Button>
                                <Transition {...transitionProps}>
                                  {menuData.pm10 != null && (
                                    <Disclosure.Panel
                                      className={classNames(
                                        getQuality("pm10", menuData.pm10).color
                                          .border,
                                        popoutClasses
                                      )}
                                    >
                                      <span className="">
                                        {
                                          getQuality("pm10", menuData.pm10)
                                            .message
                                        }
                                      </span>
                                      <div className="flex flex-row h-full justify-end items-center">
                                        <div
                                          className={classNames(
                                            getQuality("pm10", menuData.pm10)
                                              .color.indicator,
                                            "h-5 rounded-md aspect-square"
                                          )}
                                        />
                                      </div>
                                    </Disclosure.Panel>
                                  )}
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        )}
                        {menuData.co2 != null && (
                          <Disclosure>
                            {({ open }) => (
                              <>
                                <Disclosure.Button>
                                  <div className="grid grid-cols-2 grid-rows-1 w-full justify-items-stretch">
                                    <div className="h-full flex flex-row justify-start items-center space-x-2">
                                      <ChevronRightIcon
                                        className={`h-4 w-4  transition-all duration-200 ${
                                          open ? "rotate-90" : "pt-0.5"
                                        }`}
                                      />
                                      <span className="text-xl">CO2</span>
                                    </div>
                                    <div className="flex flex-row justify-end items-center">
                                      {String(menuData.co2)} {getUnit("co2")}
                                    </div>
                                  </div>
                                </Disclosure.Button>
                                <Transition {...transitionProps}>
                                  {menuData.co2 != null && (
                                    <Disclosure.Panel
                                      className={classNames(
                                        getQuality("co2", menuData.co2).color
                                          .border,
                                        popoutClasses
                                      )}
                                    >
                                      <span className="">
                                        {
                                          getQuality("co2", menuData.co2)
                                            .message
                                        }
                                      </span>
                                      <div className="flex flex-row h-full justify-end items-center">
                                        <div
                                          className={classNames(
                                            getQuality("co2", menuData.co2)
                                              .color.indicator,
                                            "h-5 rounded-md aspect-square"
                                          )}
                                        />
                                      </div>
                                    </Disclosure.Panel>
                                  )}
                                </Transition>
                              </>
                            )}
                          </Disclosure>
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
                                responsive: true,
                                scales: {
                                  x: {
                                    ticks: {
                                      font: {
                                        family:
                                          "'Lato', 'Source Sans Pro', 'sans-serif'",
                                      },
                                    },
                                  },
                                  y: {
                                    ticks: {
                                      font: {
                                        family:
                                          "'Lato', 'Source Sans Pro', 'sans-serif'",
                                      },
                                    },
                                  },
                                },
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
                                  legend: {
                                    labels: {
                                      font: {
                                        family:
                                          "'Lato', 'Source Sans Pro', 'sans-serif'",
                                      },
                                    },
                                  },
                                  tooltip: {
                                    bodyFont: {
                                      family:
                                        "'Lato', 'Source Sans Pro', 'sans-serif'",
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
                                disabled={graphTime === time.value}
                                key={time.label}
                                className={`${
                                  graphTime === time.value
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
                        <div className="flex flex-row justify-start items-center text-xl space-x-2">
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
          className={`marker marker-map ${sensor.active ? "" : "grayscale"}`}
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
