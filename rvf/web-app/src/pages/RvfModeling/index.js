import React, { useState, useEffect } from "react";
import { Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Filters from "./filter.js";
import { LOCATION, modelIntialData, modelDefaultLocation } from "../../Constants/index.js";
import { formatMonthRange } from "../../helpers/index.js";
import RenderMapContainer from "./mapContainer.js";
import {
  locationRequest,
  locationstateRequest,
  modelingMapRequest,
  modelingMapSuccess,
  // dashboardSourceRequest,
} from "../../store/actions.js";

function RvfModellingComponent() {
  const dispatch = useDispatch();
  const [country, setCountry] = useState();
  const [stateList, setStateList] = useState();
  const [formData, setFormData] = useState({});
  const [selectedLocation, setSelectedLocation] = useState();
  const [isSubCounty, setIsSubCounty] = useState(false);
  const [isCounty, setIsCounty] = useState(false);
  const [isCountry, setIsCountry] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);
  const [month, setMonth] = useState();

  const updateFormData = (newData) => {
    setFormData(newData);
  };

  const nextProps = useSelector((state) => ({
    LocationData: state.Location.LocationList,
    StateLocationData: state.Location.LocationstateList,
    ForcastMapData: state.Dashboard.forcastMapData,
    LoadingMap: state.Dashboard.mapRainLoading,
  }));

  // Month options from January to current month in reverse order
  const monthOptions = Array.from({ length: new Date().getMonth() + 1 }, (_, index) => {
    const year = new Date().getFullYear();
    const month = index + 1;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const optionLabel = new Date(year, index).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    return {
      value: `${year}-${formattedMonth}-01`,
      label: optionLabel,
      // isDisabled: optionLabel === "March 2024", // Disable March option
    };
  }).reverse();

  useEffect(() => {
    dispatch(locationRequest({ location_type: LOCATION.Country, parent_id: "" }));
    return () => {
      dispatch(modelingMapSuccess({}));
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
    if (submitForm === false) {
      const data = {
        ...modelIntialData,
        start_date: monthOptions[0].value,
      };
      setSelectedLocation(modelDefaultLocation);
      dispatch(modelingMapRequest(data));
      setMonth(formatMonthRange(data.start_date));
    }
  }, [modelDefaultLocation, modelIntialData]);

  useEffect(() => {
    if (submitForm && formData) {
      const data = {
        adm0_name: formData.adm0_name,
        adm1_name: formData.adm1_name,
        adm2_name: formData.adm2_name,
        start_date: formData.startDate,
      };
      dispatch(modelingMapRequest(data));
      setMonth(formatMonthRange(data.start_date));
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
        setSelectedLocation={setSelectedLocation}
        setIsSubCounty={setIsSubCounty}
        setIsCountry={setIsCountry}
        setIsCounty={setIsCounty}
        loader={nextProps.LoadingMap}
        monthOptions={monthOptions}
      />
      <Row>
        <RenderMapContainer
          forcastMapData={nextProps?.ForcastMapData}
          selectedLocation={selectedLocation}
          isSubCounty={isSubCounty}
          isCounty={isCounty}
          isCountry={isCountry}
          isLoader={nextProps.LoadingMap}
          indicatorList={[{ label: "GPM" }]}
          month={month}
        />
      </Row>
    </div>
  );
}

export default React.memo(RvfModellingComponent);
