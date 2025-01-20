import React, { Suspense, useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Filters from "./filter";
import CasesChart from "./casesChart";
import RainFallChart from "./rainfallChart";
import RenderMapContainer from "./mapContainer";
import {
  LOCATION,
  initialFormData,
  initialFormData1,
  initialFormData2,
  defaultLocation,
} from "../../Constants";
import { formatDateRange } from "../../helpers";
import {
  locationRequest,
  locationstateRequest,
  dashboardSourceRequest,
  addMapRequest,
  getTimeSeriesRequest,
  addRvfMapRequest,
  getRvfTimeSeriesRequest,
  addMapSuccess,
  getTimeSeriesSuccess,
} from "../../store/actions.js";

function ClimateEpidemicComponent() {
  const dispatch = useDispatch();
  const [country, setCountry] = useState();
  const [stateList, setStateList] = useState();
  const [formData, setFormData] = useState({});
  const [submitForm, setSubmitForm] = useState(false);
  const [indicatorList, setIndicatorList] = useState([]);
  const [date, setDate] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [isSubCounty, setIsSubCounty] = useState(false);
  const [isCounty, setIsCounty] = useState(false);
  const [isCountry, setIsCountry] = useState(false);
  const updateFormData = (newData) => {
    setFormData(newData);
  };
  const spatialData = {
    spatial_aggregation: "mean",
  };
  const temporalData = {
    temporal_aggregation: "mean",
  };
  const mapFormData = { ...formData, ...temporalData };
  const timeSeriesFormData = { ...formData, ...spatialData };

  const nextProps = useSelector((state) => ({
    LocationData: state.Location.LocationList,
    StateLocationData: state.Location.LocationstateList,
    SourceData: state.Dashboard.SourceList,
    MapData1: state.Dashboard.mapData,
    MapData2: state.Dashboard.mapDataRvf,
    TimeSeriesData: state.Dashboard.timeseriesData,
    TimeSeriesDataRvf: state.Dashboard.timeseriesDataRvf,
    LoadingGraph: state.Dashboard.timeSeriesloading,
    LoadingRvfGraph: state.Dashboard.timeSeriesRvfloading,
    LoadingMap: state.Dashboard.mapRainLoading,
  }));
  useEffect(() => {
    dispatch(locationRequest({ location_type: LOCATION.Country, parent_id: "" }));
    dispatch(dashboardSourceRequest());
    return () => {
      dispatch(addMapSuccess({}));
      dispatch(getTimeSeriesSuccess());
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
    if (submitForm === false && initialFormData) {
      setSelectedLocation(defaultLocation);
      setDate(formatDateRange(initialFormData?.start_date));
      setIndicatorList([initialFormData?.source]);
      dispatch(addMapRequest(initialFormData2));
      dispatch(getTimeSeriesRequest(initialFormData1));
      dispatch(addRvfMapRequest(initialFormData));
      dispatch(getRvfTimeSeriesRequest(initialFormData));
    }
  }, [initialFormData, defaultLocation]);
  useEffect(() => {
    if (submitForm && formData) {
      dispatch(addMapRequest(mapFormData));
      dispatch(getTimeSeriesRequest(timeSeriesFormData));
      dispatch(addRvfMapRequest(formData));
      dispatch(getRvfTimeSeriesRequest(formData));
      setDate(formatDateRange(formData?.start_date));
    }
  }, [formData, submitForm]);
  return (
    <div className="main-container">
      <Filters
        country={country}
        stateList={stateList}
        sourceData={nextProps.SourceData}
        updateFormData={updateFormData}
        setSubmitForm={setSubmitForm}
        setIndicatorList={setIndicatorList}
        setSelectedLocation={setSelectedLocation}
        setIsSubCounty={setIsSubCounty}
        setIsCountry={setIsCountry}
        setIsCounty={setIsCounty}
        loader={nextProps.LoadingGraph || nextProps.LoadingRvfGraph || nextProps.LoadingMap}
      />
      <Row>
        <Col md={7}>
          <Row>
            <Col md={12}>
              <Suspense fallback={<div>Loading CasesChart...</div>}>
                <CasesChart
                  graphData={nextProps?.TimeSeriesDataRvf}
                  graph_data={nextProps?.TimeSeriesData?.graph_data}
                  isLoader={nextProps.LoadingGraph || nextProps.LoadingRvfGraph}
                />
              </Suspense>
            </Col>
            <Col md={12}>
              <Suspense fallback={<div>Loading RainFallChart...</div>}>
                <RainFallChart
                  graph_data={nextProps?.TimeSeriesData?.graph_data}
                  isLoader={nextProps.LoadingGraph}
                />
              </Suspense>
            </Col>
          </Row>
        </Col>
        <Col md={5}>
          <RenderMapContainer
            MapData1={nextProps.MapData1}
            MapData2={nextProps.MapData2}
            indicatorList={indicatorList}
            selectedLocation={selectedLocation}
            formattedDateRange={date}
            isSubCounty={isSubCounty}
            isCounty={isCounty}
            isCountry={isCountry}
            isLoader={nextProps.LoadingMap}
          />
        </Col>
      </Row>
    </div>
  );
}

export default React.memo(ClimateEpidemicComponent);
