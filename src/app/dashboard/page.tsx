"use client";

import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Check,
  ChevronDown,
  RefreshCw,
  Calendar,
  Truck,
  Car,
  MapPin,
  Wifi,
  RotateCcw,
  Unlink,
  BarChart2,
  Package,
} from "lucide-react";
import React from "react";
import { httpsGet, httpsPost } from "@/utils/Communication";
import { useRouter } from "next/navigation";
import constants from "@/constants/dashboard";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getEpoch } from "@/utils/timeService";

interface plant {
  name: string;
  _id: string;
}

export default function Component() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [compareMode, setCompareMode] = useState(false);
  const [activeTab, setActiveTab] = useState("c-Shift");
  const [singleOpen, setSingleOpen] = useState(false);
  const [multiOpen, setMultiOpen] = useState(false);
  const [plants, setPlants] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState<any>({});
  const [selectedPlant, setSelectedPlant] = useState<plant[]>([]);
  const [countByPlantData, setCountByPlantData] = useState<any>([]);
  const [shiftWiseData, setShiftWiseData] = useState<any>([]);
  //   const [openDatePicker,setOpenDatePicker] = useState(false)
  //   const [openOverlay,setOpenOverlay] = useState(false)

  const locations = constants.LOCATIONS.JSPL;

  const router = useRouter();

  const fetchCountByPlant = async () => {
    const plants = selectedPlant.map((val) => val.name);
    const payload: any = {
      dedicatedTo: selectedLocation._id,
    };
    if (plants?.length) {
      payload.material = plants;
    }
    const response = await httpsPost("get/live/count", payload, router);
    if (response.statusCode === 200) {
      const data = response.data;
      setCountByPlantData(data);
    }
  };

  const fetchShitWiseData = async () => {
    const payload = {
      shipper: selectedLocation._id || locations[0]._id,
      date: getEpoch(new Date(date))
    };

    const response = await httpsPost("get/shiftWiseCount", payload, router);
    if (response.statusCode === 200) {
      const data = response?.data?.shifts || [];
      setShiftWiseData(data);
    }
  };

  const fetchPlantDetails = async () => {
    const response = await httpsGet(
      `get/materials?shipper=${selectedLocation._id || locations[0]._id}`,
      router
    );
    if (response.statusCode === 200) {
      const resp = response.data;
      setPlants(resp);
    }
  };

  useEffect(() => {
    setSelectedLocation(locations[0]);
    fetchPlantDetails();
    fetchShitWiseData();
  }, []);

  useEffect(() => {
    fetchCountByPlant();
  }, [selectedLocation, selectedPlant]);

  useEffect(() => {
    fetchPlantDetails();
    fetchShitWiseData();
  }, [selectedLocation]);

  const toggleMultiSelect = (option: any) => {
    setSelectedPlant((prev): any =>
      prev.filter((item) => item._id === option._id)?.length
        ? prev.filter((item) => item._id !== option._id)
        : [...prev, option]
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  //   function closeAll() {
  //     setOpenDatePicker(false)
  //   }

  return (
    <div className="p-6 space-y-6 text-black bg-white h-[100vh] relative">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">GPS Inventory Dashboard</h1>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Single Select Dropdown */}
          <div className="relative w-[200px]">
            <button
              onClick={() => setSingleOpen(!singleOpen)}
              className="w-full px-4 py-2.5 text-left bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{selectedLocation.name}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    singleOpen ? "transform rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {singleOpen && (
              <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                <div className="py-1 max-h-60 overflow-auto">
                  {locations.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => {
                        setSelectedLocation(option);
                        setSingleOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left flex items-center space-x-3 hover:bg-blue-50 transition-colors
                        ${
                          selectedLocation._id === option._id
                            ? "bg-blue-50"
                            : ""
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center
                        ${
                          selectedLocation._id === option._id
                            ? "text-blue-600"
                            : "text-transparent"
                        }`}
                      >
                        {selectedLocation.name === option.name && (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                      <span
                        className={`${
                          selectedLocation._id === option._id
                            ? "font-medium"
                            : ""
                        }`}
                      >
                        {option.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Multi Select Dropdown */}
          <div className="relative w-[200px]">
            <button
              onClick={() => setMultiOpen(!multiOpen)}
              className="w-full px-4 py-2.5 text-left bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">
                  {selectedPlant.length === 0
                    ? "Select options"
                    : selectedPlant.length === 1
                    ? selectedPlant[0].name
                    : `${selectedPlant.length} items selected`}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    multiOpen ? "transform rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {multiOpen && (
              <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                <div className="py-1 max-h-60 overflow-auto">
                  {plants.map((option:any) => (
                    <button
                      key={option.name}
                      onClick={() => toggleMultiSelect(option)}
                      className={`w-full px-4 py-2.5 text-left flex items-center space-x-3 hover:bg-blue-50 transition-colors
                        ${Boolean(selectedPlant.filter((val)=>val._id === option._id).length) ? "bg-blue-50" : ""}`}
                    >
                      <div
                        className={`w-5 h-5 border rounded flex items-center justify-center
                        ${
                          Boolean(selectedPlant.filter((val)=>val._id === option._id).length)
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {Boolean(selectedPlant.filter((val)=>val._id === option._id).length) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span
                        className={`${
                          Boolean(selectedPlant.filter((val)=>val._id === option._id).length) ? "font-medium" : ""
                        }`}
                      >
                        {option.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            className={`p-2 border rounded ${
              isRefreshing ? "animate-spin" : ""
            }`}
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="compare-mode"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
            />
            <label htmlFor="compare-mode">Compare Mode</label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registrations"
          value={!isNaN(countByPlantData.totalCount) ? countByPlantData.totalCount : '--'}
          icon={<Truck />}
          color="blue"
        />
        <StatCard
          title="Own Vehicles"
          value={!isNaN(countByPlantData.TotalOwnVehicle) ? countByPlantData.TotalOwnVehicle : '--'}
          icon={<Car />}
          color="green"
        />
        <StatCard
          title="Spot Vehicles"
          value={!isNaN(countByPlantData.totalMarketVehicle) ? countByPlantData.totalMarketVehicle : '--'}
          icon={<MapPin />}
          color="yellow"
        />
        <StatCard
          title="Devices Installed"
          value={!isNaN(countByPlantData.deviceInstalled) ? countByPlantData.deviceInstalled : '--'}
          icon={<Wifi />}
          color="purple"
        />
        <StatCard
          title="Devices Returned"
          value={!isNaN(countByPlantData.returnedDevices) ? countByPlantData.returnedDevices : '--'}
          icon={<RotateCcw />}
          color="pink"
        />
        <StatCard
          title="Devices De-linked"
          value={!isNaN(countByPlantData.delinkedDevices) ? countByPlantData.delinkedDevices : '--'}
          icon={<Unlink />}
          color="red"
        />
        <StatCard
          title="GPS Stock Balance"
          value={countByPlantData.totalCount || '--'}
          icon={<BarChart2 />}
          color="indigo"
        />
        <StatCard
          title="Buffer Stock"
          value={countByPlantData.totalCount || "--"}
          icon={<Package />}
          color="orange"
        />
      </div>

      {compareMode ? (
        <div>
          <div className="mb-3 flex items-center space-x-4">
            <div className="font-bold text-xl">Shift Data</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DatePicker"]}
                sx={{
                  paddingTop: 0,
                  input: {
                    padding: "10px",
                  },
                }}
              >
                <DatePicker value={dayjs(date)} format="DD/MM/YYYY" />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["C Shift", "A Shift", "B Shift"].map((shift) => (
              <div key={shift} className="border rounded p-4">
                <h3 className="text-lg font-semibold mb-4">{shift}</h3>
                <ShiftDetailsTable
                  shiftData={shiftWiseData[`${shift.split(" ")[0]}`] || []}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex border-b mb-4">
            {["c-Shift", "a-Shift", "b-Shift"].map((shift) => (
              <button
                key={shift}
                className={`px-4 py-2 ${
                  activeTab === shift ? "border-b-2 border-blue-500" : ""
                }`}
                onClick={() => setActiveTab(shift)}
              >
                {shift.charAt(0).toUpperCase() +
                  shift.slice(1).replace("-", " ")}
              </button>
            ))}
            <div className="ml-6 mb-1.5">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{
                    paddingTop: 0,
                    input: {
                      padding: "10px",
                    },
                  }}
                >
                  <DatePicker value={dayjs(date)} format="DD/MM/YYYY" onChange={(e)=>{ console.log(e?.date); setDate(date);fetchShitWiseData()}} />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
          <div className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-4">
              {activeTab.charAt(0).toUpperCase() +
                activeTab.slice(1).replace("-", " ")}
            </h3>
            <ShiftDetailsTable />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colorMap: any = {
    blue: { bg: "#E6F3FF", text: "#0066CC", value: "#004080" },
    green: { bg: "#E6FFF2", text: "#00994D", value: "#006633" },
    yellow: { bg: "#FFFDE6", text: "#B3A000", value: "#806600" },
    purple: { bg: "#F2E6FF", text: "#6600CC", value: "#400080" },
    pink: { bg: "#FFE6F2", text: "#CC0066", value: "#800040" },
    red: { bg: "#FFE6E6", text: "#CC0000", value: "#800000" },
    indigo: { bg: "#E6E6FF", text: "#3333CC", value: "#1A1A80" },
    orange: { bg: "#FFF0E6", text: "#CC6600", value: "#804000" },
  };

  const { bg, text, value: valueColor } = colorMap[color];

  return (
    <div className={`p-4 rounded-lg`} style={{ backgroundColor: bg }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium" style={{ color: text }}>
            {title}
          </div>
          <div className="text-2xl font-bold" style={{ color: valueColor }}>
            {value}
          </div>
        </div>
        {React.cloneElement(icon, { color: text })}
      </div>
    </div>
  );
}

function ShiftDetailsTable({ shiftData }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: "#FFE6E6" }}>
          <div className="text-sm font-medium" style={{ color: "#CC0000" }}>
            Faulty Devices
          </div>
          <div className="text-xl font-bold" style={{ color: "#800000" }}>
            {!isNaN(shiftData?.faulty) ? shiftData?.faulty : "--"}
          </div>
        </div>
        <div className="p-2 rounded-lg" style={{ backgroundColor: "#E6FFF2" }}>
          <div className="text-sm font-medium" style={{ color: "#00994D" }}>
            Working Devices
          </div>
          <div className="text-xl font-bold" style={{ color: "#006633" }}>
          {!isNaN(shiftData?.working) ? shiftData?.working : "--"}
          </div>
        </div>
        <div className="p-2 rounded-lg" style={{ backgroundColor: "#F2E6FF" }}>
          <div className="text-sm font-medium" style={{ color: "#6600CC" }}>
            PT By Products
          </div>
          <div className="text-xl font-bold" style={{ color: "#400080" }}>
          {!isNaN(shiftData?.pt_metrics?.pt_by_products) ? shiftData?.pt_metrics?.pt_by_products : "--"}
          </div>
        </div>
      </div>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Metric</th>
              <th className="text-left p-2">Own Vehicle</th>
              <th className="text-left p-2">CT</th>
              <th className="text-left p-2">PT</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">Total</td>
              <td className="p-2">
              {!isNaN(shiftData?.own_vehicle?.total) ? shiftData?.own_vehicle?.total : "--"}
              </td>
              <td className="p-2">
              {!isNaN(shiftData?.ct_metrics?.total) ? shiftData?.ct_metrics?.total : "--"}
              </td>
              <td className="p-2">
              {!isNaN(shiftData?.pt_metrics?.total) ? shiftData?.pt_metrics?.total : "--"}
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-2">Devices Installed</td>
              <td className="p-2">
              {!isNaN(shiftData?.own_vehicle?.device_installed) ? shiftData?.own_vehicle?.device_installed : "--"}
              </td>
              <td className="p-2">
              {!isNaN(shiftData?.ct_metrics?.device_installed) ? shiftData?.ct_metrics?.device_installed : "--"}
              </td>
              <td className="p-2">
              {!isNaN(shiftData?.pt_metrics?.device_installed) ? shiftData?.pt_metrics?.device_installed : "--"}
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-2">Devices Returned</td>
              <td className="p-2">
              {!isNaN(shiftData?.own_vehicle?.device_returned) ? shiftData?.own_vehicle?.device_returned : "--"}
              </td>
              <td className="p-2">
              {!isNaN(shiftData?.ct_metrics?.device_returned) ? shiftData?.ct_metrics?.device_returned : "--"}
              </td>
              <td className="p-2">
              {!isNaN(shiftData?.pt_metrics?.device_returned) ? shiftData?.pt_metrics?.device_returned : "--"}
              </td>
            </tr>
            <tr>
              <td className="p-2">De-linked</td>
              <td className="p-2">
              {!isNaN(shiftData?.own_vehicle?.de_linked) ? shiftData?.own_vehicle?.de_linked : "--"}
              </td>
              <td className="p-2">
              {!isNaN(shiftData?.ct_metrics?.de_linked) ? shiftData?.ct_metrics?.de_linked : "--"}
              </td>
              <td className="p-2">
              {!isNaN(shiftData?.pt_metrics?.de_linked) ? shiftData?.pt_metrics?.de_linked : "--"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-sm text-muted-foreground">
        Data Entry By: { shiftData?.data_entry_by?.join(', ') || '--' }
      </div>
    </div>
  );
}
