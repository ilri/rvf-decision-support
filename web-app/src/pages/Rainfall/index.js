/* eslint-disable no-unused-vars */
import React, { Suspense, useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Filters from "./filter";
import {
  LOCATION,
  RainfallinitialFormData,
  RainfallinitialMapFormData,
  gfsNovaIntial,
  gfsNovaTempIntial,
  RainfallDefaultLocation,
} from "../../Constants";
import RenderMapContainer from "./mapContainer";
import RainFallChart from "./currentRainfall";
import NovaChart from "./novaChart";
import {
  locationRequest,
  locationstateRequest,
  getTimeSeriesRequest,
  getTimeSeriesSuccess,
  getGfsNovaRequest,
  getGfsNovaSuccess,
  addMapRequest,
  addMapSuccess,
  addMap1Request,
  addMap1Success,
  dashboardSourceRequest,
  gfsNoaaTemperatureRequest,
} from "../../store/actions.js";
import {
  getEndDate,
  formatMonthRange,
  getStartDate,
  getMonthYearArray,
  convertToFullDate,
} from "../../helpers";

function RainfallComponent() {
  const dispatch = useDispatch();
  const [indicatorList, setIndicatorList] = useState([]);
  const [country, setCountry] = useState();
  const [stateList, setStateList] = useState();
  const [formData, setFormData] = useState({});
  const [selectedLocation, setSelectedLocation] = useState();
  const [isSubCounty, setIsSubCounty] = useState(false);
  const [isCounty, setIsCounty] = useState(false);
  const [isCountry, setIsCountry] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [date, setDate] = useState();
  const [apiUrl, setApiUrl] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const monthArray = getMonthYearArray(getStartDate(endDate), endDate);
  const [formChanged, setFormChanged] = useState(false);
  const handleMonthChange = (selectedOption) => {
    setSelectedMonth(selectedOption);
  };

  const updateFormData = (newData) => {
    setFormData(newData);
  };
  const spatialData = {
    spatial_aggregation: "mean",
  };
  const temporalData = {
    temporal_aggregation: "mean",
  };
  const timeSeriesFormData = { ...formData, ...spatialData };
  const mapFormData = { ...formData, ...temporalData };

  const nextProps = useSelector((state) => ({
    LocationData: state.Location.LocationList,
    StateLocationData: state.Location.LocationstateList,
    TimeSeriesData: state.Dashboard.timeseriesData,
    TemperatureTimeSeriseData: state.Dashboard.temperatureData,
    GfsNovaData: state.Dashboard.timeseriesGfsNova,
    MapData: state.Dashboard.mapData,
    SourceData: state.Dashboard.SourceList,
    LoadingMap: state.Dashboard.mapRainLoading,
    LoadingGraph: state.Dashboard.timeSeriesloading,
    LoadingGfs: state.Dashboard.timeSeriesGfsNovaloading,
    gfsTemperatureLoading: state.Dashboard.gfsTemperatureLoading,
    MapData1: state.Dashboard.mapData1,
    LoadingMap1: state.Dashboard.mapRain1Loading,
  }));
  useEffect(() => {
    dispatch(locationRequest({ location_type: LOCATION.Country, parent_id: "" }));
    dispatch(dashboardSourceRequest());
    return () => {
      dispatch(getTimeSeriesSuccess());
      dispatch(addMapSuccess({}));
      dispatch(addMap1Success({}));
      dispatch(getGfsNovaSuccess());
    };
  }, []);

  useEffect(() => {
    if (nextProps.LocationData) {
      setCountry(nextProps.LocationData[0]);
      dispatch(
        locationstateRequest({
          location_type: LOCATION.State,
          parent_id: nextProps.LocationData[0].id,
        })
      );
    }
  }, [nextProps.LocationData]);

  useEffect(() => {
    if (nextProps.StateLocationData) {
      setStateList(nextProps.StateLocationData.data);
    }
  }, [nextProps.StateLocationData]);

  useEffect(() => {
    if (nextProps.SourceData) {
      setApiUrl(nextProps?.SourceData[0].api_url);
      setEndDate(nextProps?.SourceData[0].dataset_max_date);
    }
  }, [nextProps.SourceData]);
  useEffect(() => {
    if (
      submitForm === false &&
      RainfallinitialFormData &&
      gfsNovaIntial &&
      apiUrl &&
      endDate &&
      gfsNovaTempIntial
    ) {
      const data = {
        ...RainfallinitialFormData,
        api_url: apiUrl,
        end_date: endDate,
        start_date: getStartDate(endDate),
      };
      const startDate = convertToFullDate(monthArray[monthArray.length - 2]);
      const mapData = {
        ...RainfallinitialMapFormData,
        api_url: apiUrl,
        start_date: startDate,
        end_date: getEndDate(startDate),
      };
      const data2 = {
        ...RainfallinitialFormData,
        api_url: apiUrl,
        start_date: startDate,
        end_date: getEndDate(startDate),
      };
      setSelectedLocation(RainfallDefaultLocation);
      dispatch(getTimeSeriesRequest(data));
      dispatch(getGfsNovaRequest(gfsNovaIntial));
      dispatch(gfsNoaaTemperatureRequest(gfsNovaTempIntial));
      // dispatch(addMapRequest(mapData));
      dispatch(addMap1Request(data2));
      setIndicatorList([{ label: "GPM" }]);
      setDate(monthArray[monthArray.length - 2]);
    }
  }, [RainfallinitialFormData, RainfallDefaultLocation, nextProps.SourceData, apiUrl, endDate]);
  useEffect(() => {
    if (submitForm && formData) {
      const data = {
        adm0_name: formData.adm0_name,
        adm1_name: formData.adm1_name,
        adm2_name: formData.adm2_name,
        spatial_aggregation: "mean",
        parameter_id: "precipitation",
        end_date: gfsNovaIntial.end_date,
        start_date: gfsNovaIntial.start_date,
      };
      const data1 = {
        ...timeSeriesFormData,
        api_url: apiUrl,
        end_date: endDate,
        start_date: getStartDate(endDate),
      };
      const startDate = convertToFullDate(monthArray[monthArray.length - 2]);
      // const data2 = {
      //   ...mapFormData,
      //   api_url: apiUrl,
      //   start_date: startDate,
      //   end_date: getEndDate(startDate),
      // };
      const data3 = {
        ...timeSeriesFormData,
        api_url: apiUrl,
        start_date: startDate,
        end_date: getEndDate(startDate),
      };
      dispatch(getTimeSeriesRequest(data1));
      dispatch(getGfsNovaRequest(data));
      dispatch(gfsNoaaTemperatureRequest(gfsNovaTempIntial));
      // dispatch(addMapRequest(data2));
      dispatch(addMap1Request(data3));
      setDate(monthArray[monthArray.length - 2]);
    }
  }, [formData, submitForm]);
  useEffect(() => {
    if (selectedMonth) {
      if (submitForm && formData && mapFormData) {
        const data = {
          ...mapFormData,
          start_date: selectedMonth,
          end_date: getEndDate(selectedMonth),
          api_url: apiUrl,
        };
        const data2 = {
          ...timeSeriesFormData,
          api_url: apiUrl,
          start_date: selectedMonth,
          end_date: getEndDate(selectedMonth),
        };
        // dispatch(addMapRequest(data));
        dispatch(addMap1Request(data2));
        setSelectedMonth(null);
        setDate(formatMonthRange(data?.start_date));
      } else if (submitForm === false && RainfallinitialMapFormData) {
        const data = {
          ...RainfallinitialMapFormData,
          start_date: selectedMonth,
          end_date: getEndDate(selectedMonth),
          api_url: apiUrl,
        };
        const data2 = {
          ...RainfallinitialFormData,
          api_url: apiUrl,
          start_date: selectedMonth,
          end_date: getEndDate(selectedMonth),
        };
        // dispatch(addMapRequest(data));
        dispatch(addMap1Request(data2));
        setSelectedMonth(null);
        setDate(formatMonthRange(data?.start_date));
        setSubmitForm(false);
      }
    }
  }, [selectedMonth, RainfallinitialMapFormData, formData, RainfallinitialFormData]);
  return (
    <div className="main-container">
      <Filters
        country={country}
        stateList={stateList}
        sourceData={nextProps.SourceData}
        updateFormData={updateFormData}
        setSubmitForm={setSubmitForm}
        setSelectedLocation={setSelectedLocation}
        setIsSubCounty={setIsSubCounty}
        setIsCountry={setIsCountry}
        setIsCounty={setIsCounty}
        loader={
          nextProps.LoadingGraph ||
          nextProps.LoadingGfs ||
          nextProps.LoadingMap ||
          nextProps.LoadingMap1
        }
        setFormChanged={setFormChanged}
      />
      <Row>
        <Col md={7}>
          <Row>
            <Col md={12}>
              <Suspense fallback={<div>Loading RainFallChart...</div>}>
                <RainFallChart
                  graph_data={nextProps?.TimeSeriesData?.graph_data}
                  isLoader={nextProps.LoadingGraph}
                />
              </Suspense>
            </Col>
            <Col md={12} className="temperature-loading">
              <Suspense fallback={<div>Loading NoaaChart...</div>}>
                <NovaChart
                  graphData={nextProps?.GfsNovaData?.total_precipitation_surface}
                  temperatureData={
                    nextProps?.TemperatureTimeSeriseData?.temperature_2m_above_ground
                  }
                  isLoader={nextProps.LoadingGfs || nextProps?.gfsTemperatureLoading}
                />
              </Suspense>
            </Col>
          </Row>
        </Col>
        <Col md={5}>
          <RenderMapContainer
            MapData={nextProps?.MapData}
            MapData2={nextProps?.MapData1}
            selectedLocation={selectedLocation}
            isSubCounty={isSubCounty}
            isCounty={isCounty}
            isCountry={isCountry}
            indicatorList={indicatorList}
            graphData={nextProps?.TimeSeriesData?.graph_data}
            monthArray={getMonthYearArray(getStartDate(endDate), endDate)}
            handleMonthChange={handleMonthChange}
            formattedDateRange={date}
            isLoader={nextProps.LoadingMap || nextProps.LoadingMap1}
            ButtonLoader={
              nextProps.LoadingMap || nextProps.LoadingMap1 || nextProps.LoadingGraph || formChanged
            }
          />
        </Col>
      </Row>
    </div>
  );
}

export default React.memo(RainfallComponent);
