import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { renderReactOptionsArraystate, formatDate } from "../../helpers";
import { LOCATION, defaultCounty } from "../../Constants";
import { locationsubRequest } from "../../store/actions";
import "react-datepicker/dist/react-datepicker.css";

function OnlineBulletinModal({
  country = {},
  stateList = {},
  loader,
  toggleModal,
  isOpenModel,
  onFormSubmit,
  isFilter,
  updateFormData,
  setSubmitData,
  submitData,
  setFilteredBulletinCards,
}) {
  const dispatch = useDispatch();

  const [stateListOptions, setStateListOptions] = useState([]);
  const [subCountyList, setSubCountyList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const nextProps = useSelector((state) => ({
    LocationsubData: state.Location.LocationsubList?.data,
  }));

  const defaultCountry = {
    label: country.name,
    value: country.id,
    latitude: country.latitude,
    longitude: country.longitude,
    zoom_level: country.zoom_level,
  };
  const [County, setCounty] = useState(defaultCounty);
  const countryList = [defaultCountry];
  useEffect(() => {
    const defaultOption = {
      label: "All",
      value: "",
      id: "",
      latitude: country?.latitude || "",
      longitude: country?.longitude || "",
      zoom_level: country?.zoom_level || "",
    };
    if (stateList) {
      const countyOptions = renderReactOptionsArraystate(
        Object.values(stateList),
        "name",
        "id",
        "latitude",
        "longitude",
        "zoom_level"
      );
      setStateListOptions([defaultOption, ...countyOptions]);
    } else {
      setStateListOptions([defaultOption]);
    }
  }, [stateList]);
  const defaultValues = {
    country: "kenya",
    county: stateListOptions[0],
    subCounty: subCountyList[0],
    startDate: "",
    endDate: "",
  };

  const { handleSubmit, control, setValue, reset } = useForm({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    setValue("country", defaultCountry);
  }, [defaultCountry, setValue]);

  const handleCountryChange = (selectedOption, field) => {
    field.onChange(selectedOption);

    // Update county and subCounty values when a country is selected
    const defaultCountyOption = {
      label: "All",
      value: "",
      latitude: defaultCountry?.latitude || "",
      longitude: defaultCountry?.longitude || "",
      zoom_level: defaultCountry?.zoom_level || "",
    };

    setCounty(null);
    setValue("county", defaultCountyOption);

    // Update subCounty default value based on the selected country
    const defaultSubCountyOption = {
      label: "All",
      value: "",
      latitude: selectedOption?.latitude || "",
      longitude: selectedOption?.longitude || "",
      zoom_level: selectedOption?.zoom_level || "",
    };

    setValue("subCounty", defaultSubCountyOption);
  };

  useEffect(() => {
    setValue("county", defaultCounty);
    const defaultSubCountyOption = {
      label: "All",
      value: "",
      latitude: defaultCounty?.latitude || "",
      longitude: defaultCounty?.longitude || "",
      zoom_level: defaultCounty?.zoom_level || "",
    };
    setValue("subCounty", defaultSubCountyOption);
    return () => setValue("county", defaultCounty);
  }, [setValue, defaultCounty]);

  const handleCountyChange = (selectedOption, field) => {
    const tempCounty = selectedOption;
    setCounty(tempCounty);
    field.onChange(selectedOption);

    // Update subCounty value when a county is selected
    const defaultSubCountyOption = {
      label: "All",
      value: "",
      latitude: tempCounty?.latitude || "",
      longitude: tempCounty?.longitude || "",
      zoom_level: tempCounty?.zoom_level || "",
    };

    setValue("subCounty", defaultSubCountyOption);
  };

  const handleSubCountyChange = (selectedOption, field) => {
    field.onChange(selectedOption);
  };

  const onSubmit = (data) => {
    toggleModal();
    let selectedLocation;
    if (data?.subCounty) {
      if (data?.subCounty.value === "") {
        selectedLocation = data.county;
      } else {
        selectedLocation = data.subCounty;
      }
    } else if (data?.county) {
      if (data?.county.value === "") {
        selectedLocation = data.country;
      } else {
        selectedLocation = data.county;
      }
    } else if (data?.country) {
      selectedLocation = defaultCountry;
    }
    let adm1_name = data?.county?.label;
    if (adm1_name === "All") {
      adm1_name = "";
    }
    let adm2_name = data?.subCounty?.label;
    if (adm2_name === "All") {
      adm2_name = "";
    }

    if (isFilter) {
      const formattedStartDate = data?.startDate ? formatDate(data?.startDate) : null;
      const formattedEndDate = data?.endDate ? formatDate(data?.endDate) : null;
      setSubmitData(data);
      let adm1_name = data?.county?.label;
      if (adm1_name === "All") {
        adm1_name = "";
      }
      let adm2_name = data?.subCounty?.label;
      if (adm2_name === "All") {
        adm2_name = "";
      }

      const formData = {
        country_name: data?.country?.label,
        county_name: adm1_name,
        sub_county_name: adm2_name,
        ...(formattedStartDate && { start_date: formattedStartDate }),
        ...(formattedEndDate && { end_date: formattedEndDate }),
      };
      updateFormData(formData);
      // setFilterSubmit(true);
    } else {
      const formData = {
        adm0_name: data?.country?.label,
        adm0_id: data?.country?.value,
        adm1_name,
        adm1_id: data?.county?.value,
        adm2_name,
        adm2_id: data?.subCounty?.value,
        basin_name: "",
        sub_basin_name: "",
      };
      onFormSubmit(formData, selectedLocation, true);
    }
  };

  const handleClearAll = () => {
    reset(defaultValues);
    // toggleModal();
    setFilteredBulletinCards([]);
    updateFormData(null);
    setSubmitData(null);
    setCounty(defaultValues?.county);
    setStartDate(defaultValues?.startDate);
    setEndDate(defaultValues?.endDate);
  };

  useEffect(() => {
    if (County && County.value !== "") {
      dispatch(
        locationsubRequest({
          location_type: LOCATION.District,
          parent_id: County?.value,
        })
      );
    } else if (defaultCounty && !submitData?.county) {
      dispatch(
        locationsubRequest({
          location_type: LOCATION.District,
          parent_id: defaultCounty?.value,
        })
      );
    }
  }, [County]);

  useEffect(() => {
    if (nextProps.LocationsubData) {
      const subCountyOptions = renderReactOptionsArraystate(
        nextProps.LocationsubData,
        "name",
        "id",
        "latitude",
        "longitude",
        "zoom_level"
      );
      setSubCountyList([
        {
          label: "All",
          value: "",
          latitude: County?.latitude || "",
          longitude: County?.longitude || "",
          zoom_level: County?.zoom_level || "",
        },
        ...subCountyOptions,
      ]);
    }
  }, [nextProps.LocationsubData, County]);

  useEffect(() => {
    // Pre-fill the form fields with the stored submitted data when the form is reopened
    if (submitData && isFilter) {
      setValue("country", submitData.country);
      if (submitData?.county?.value === "") {
        setValue("county", defaultCounty);
      } else {
        setValue("county", submitData.county);
      }
      if (submitData?.subCounty?.value === "") {
        setValue("subCounty", defaultCounty);
      } else {
        setValue("subCounty", submitData.subCounty);
      }
      setValue("startDate", submitData.startDate);
      setValue("endDate", submitData.endDate);
      setStartDate(submitData.startDate);
      setEndDate(submitData.endDate);
      setCounty(submitData?.county);
    }
  }, [submitData, setValue, isFilter]);

  return (
    <Modal
      isOpen={isOpenModel}
      toggle={isFilter ? "" : toggleModal}
      className={isFilter ? "filter-popup" : "create-bulletin-popup"}
    >
      <ModalHeader className={isFilter ? "modal-header" : "modal-header1"}>
        {isFilter ? (
          <div className="modal-head-div">
            <p className="create-bulletin-header">Filter</p>
            {/* &nbsp;&nbsp; */}
            <p onClick={() => toggleModal()} style={{ cursor: "pointer" }}>
              x&nbsp;
            </p>
          </div>
        ) : (
          <p className="create-bulletin-header">New Bulletin</p>
        )}
      </ModalHeader>
      <ModalBody className={isFilter ? "modal-body-div" : ""}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="model-div">
            <Row className={isFilter ? "input-div" : ""}>
              <FormGroup className="notranslate">
                <Label for="country" className="label-text">
                  Country
                </Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isDisabled={loader} //||isFiter
                      id="country"
                      options={countryList}
                      onChange={(selectedOption) => handleCountryChange(selectedOption, field)}
                      menuShouldScrollIntoView={false}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row className={isFilter ? "input-div" : ""}>
              <FormGroup className="notranslate">
                <Label for="county" className="label-text">
                  County
                </Label>
                <Controller
                  name="county"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={stateListOptions}
                      id="county"
                      isSearchable
                      onChange={(selectedOption) => handleCountyChange(selectedOption, field)}
                      isDisabled={loader}
                      menuShouldScrollIntoView={false}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row className={isFilter ? "input-div" : ""}>
              <FormGroup className="notranslate">
                <Label for="subCounty" className="label-text">
                  Sub-County
                </Label>
                <Controller
                  name="subCounty"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={subCountyList}
                      id="subCounty"
                      isSearchable
                      isDisabled={loader || County?.value === "" || County === null}
                      onChange={(selectedOption) => handleSubCountyChange(selectedOption, field)}
                      menuShouldScrollIntoView={false} // to prevent the modal movment while select the dropdown
                    />
                  )}
                />
              </FormGroup>
            </Row>
            {isFilter && (
              <>
                <FormGroup className="notranslate">
                  <Label for="startDate" className="label-text">
                    Start Date
                  </Label>
                  <Controller
                    name="startDate"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        selected={field.value}
                        onChange={(date) => {
                          field.onChange(date);
                          setStartDate(date);
                        }}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="dd-MM-yyyy"
                        showPopperArrow={false}
                        toggleCalendarOnIconClick
                        maxDate={new Date()}
                        icon={
                          <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 11H7V13H9V11ZM13 11H11V13H13V11ZM17 11H15V13H17V11ZM19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z"
                              fill="#962129"
                            />
                          </svg>
                        }
                        showIcon
                        autoComplete="off"
                        // showMonthDropdown
                        // showYearDropdown
                        // dropdownMode="select"
                      />
                    )}
                  />
                </FormGroup>
                <FormGroup className="notranslate">
                  <Label for="endDate" className="label-text">
                    End Date
                  </Label>
                  <Controller
                    name="endDate"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        selected={field.value}
                        onChange={(date) => {
                          field.onChange(date);
                          setEndDate(date);
                        }}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        maxDate={new Date()}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="dd-MM-yyyy"
                        showPopperArrow={false}
                        toggleCalendarOnIconClick
                        // showMonthDropdown
                        // showYearDropdown
                        // dropdownMode="select"
                        icon={
                          <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 11H7V13H9V11ZM13 11H11V13H13V11ZM17 11H15V13H17V11ZM19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z"
                              fill="#962129"
                            />
                          </svg>
                        }
                        showIcon
                        autoComplete="off"
                        disabled={!startDate}
                      />
                    )}
                  />
                </FormGroup>
              </>
            )}
            <Row className="button-div">
              <Col md={6}>
                {isFilter ? (
                  <Button type="button" className="clear-button" onClick={handleClearAll}>
                    Reset
                  </Button>
                ) : (
                  <Button type="button" className="clear-button" onClick={() => toggleModal()}>
                    Cancel
                  </Button>
                )}
              </Col>
              <Col md={6}>
                {isFilter ? (
                  <Button
                    type="submit"
                    className="modal-button"
                    disabled={
                      loader ||
                      (startDate && !endDate) ||
                      ((!County || !County.value) && !startDate && !endDate)
                    }
                  >
                    Filter
                  </Button>
                ) : (
                  <Button type="submit" className="modal-button" disabled={loader}>
                    Create
                  </Button>
                )}
              </Col>
            </Row>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default OnlineBulletinModal;
