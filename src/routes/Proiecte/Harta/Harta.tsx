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
  faCircleInfo,
  faCircleNotch,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Wagepedia from "../../../components/Harta/Wagepedia";

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

  const [menuData, setMenuData] = useState<SensorData>();

  const [sensors, setSensors] = useState<Sensor[]>([]);

  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

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
    if (selectedMenu == "wagepedia") return;
    else if (selectedMenu == "") {
      setMenuData(undefined);
    } else {
      setLoading(true);
      let sensorId;
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
        } = data.data[data.data.length - 1];
        let date = new Date(time * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours + ":" + minutes.substr(-2);
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
          date: formattedTime,
          picture: sensorPicture,
        });
        setLoading(false);
      });
    }
  }, [selectedMenu]);

  function closeTab() {
    map.current?.easeTo({
      center: [25.045456, 45.268469],
      zoom: 12,
      duration: 1000,
    });
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
        <div className="absolute top-0 left-0 m-2 flex flex-col justify-center items-start space-y-2">
          <Link
            to="/"
            className="flex flex-row justify-center items-center space-x-1.5 px-2.5 py-0.5 bg-gray-900 bg-opacity-50 hover:bg-opacity-75 transition-all duration-300 rounded-full text-white"
          >
            <FontAwesomeIcon
              icon={faArrowRightToBracket}
              className="h-3.5 w-3.5 rotate-180"
            />
            <span>Inapoi Acasa</span>
          </Link>
          <button
            onClick={() => {
              openTab("wagepedia");
            }}
            className="flex flex-row justify-center items-center space-x-1.5 px-2.5 py-0.5 bg-gray-900 bg-opacity-50 hover:bg-opacity-75 transition-all duration-300 rounded-full text-white"
          >
            <FontAwesomeIcon icon={faCircleInfo} className="h-3.5 w-3.5" />
            <span>Wagepedia</span>
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
          {selectedMenu != "wagepedia" ? (
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
                        src={menuData?.picture ? menuData.picture : ""}
                        className="h-full object-cover w-full rounded-t-lg brightness-50 absolute top-0 left-0"
                      />
                      <div className="relative p-4 flex flex-col justify-between h-full">
                        <div className="flex flex-row justify-between items-center">
                          <div className="text-xl text-white">
                            {menuData?.name}
                          </div>
                          <div className="text-white">
                            <button
                              onClick={() => {
                                closeTab();
                              }}
                              className="flex flex-row justify-center items-center space-x-1.5 bg-gray-900 px-1.5 bg-opacity-50 hover:bg-opacity-75 transition-all duration-200 rounded-full py-0.5"
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
                          {!menuData.gas1 ? (
                            <div className="flex flex-row items-end justify-start text-white space-x-2">
                              <span className="text-4xl">
                                {calcApprox([
                                  menuData?.pm1,
                                  menuData?.pm10,
                                  menuData?.pm25,
                                ])}
                              </span>
                              <span>Particule in suspensie (PM)</span>
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
                    <div className="flex flex-col justify-between h-full p-4 overflow-y-auto space-y-3">
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
          ) : (
            <div className="bg-slate-50 shadow-md h-full m-2 ml-2 rounded-lg flex flex-col z-50 md:w-[42rem] w-[calc(100%-1rem)] relative top-0 left-0">
              <div className="h-full w-full">
                <Wagepedia
                  closeFunc={() => {
                    closeTab();
                  }}
                />
              </div>
            </div>
          )}
        </Transition>
      </div>
      {sensors.map((sensor) => (
        <button
          className={`marker ${sensor.active ? "" : "grayscale"}`}
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
