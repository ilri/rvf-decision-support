import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { Button, Col, Form, FormGroup, Label, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { renderReactOptionsArraystate, renderSourceArray } from "../../helpers";
import { LOCATION, defaultSource, defaultYear } from "../../Constants";
import { locationsubRequest } from "../../store/actions";
import "react-datepicker/dist/react-datepicker.css";

function Filters({
  country = {},
  stateList = {},
  sourceData = {},
  updateFormData,
  setSubmitForm,
  setIndicatorList,
  setSelectedLocation,
  setIsSubCounty,
  setIsCountry,
  setIsCounty,
  loader,
}) {
  const dispatch = useDispatch();
  const [stateListOptions, setStateListOptions] = useState([]);
  const [County, setCounty] = useState(null);
  const [subCountyList, setSubCountyList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date(defaultYear));
  const maxDate = new Date("2023-04-01");

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

  useEffect(() => {
    if (sourceData) {
      const sourceOptions = renderSourceArray(Object.values(sourceData), "name", "id", "api_url");
      setSourceList(sourceOptions);
    }
  }, [sourceData]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("country", defaultCountry);
    setValue("monthYear", selectedDate);
  }, [defaultCountry, setValue]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setValue("monthYear", selectedDate, true);
  };

  const onSubmit = (data) => {
    if (data?.subCounty) {
      if (data.subCounty.value === "") {
        setSelectedLocation(data.county);
        setIsSubCounty(false);
        setIsCountry(false);
        setIsCounty(true);
      } else {
        setSelectedLocation(data.subCounty);
        setIsSubCounty(true);
        setIsCountry(false);
        setIsCounty(false);
      }
    } else if (data?.county) {
      if (data.county.value === "") {
        setSelectedLocation(defaultCountry);
        setIsSubCounty(false);
        setIsCounty(false);
        setIsCountry(true);
      } else {
        setSelectedLocation(data.county);
        setIsSubCounty(false);
        setIsCounty(true);
        setIsCountry(false);
      }
    } else if (data?.country) {
      setSelectedLocation(data.country);
      setIsSubCounty(false);
      setIsCountry(true);
      setIsCounty(false);
    }
    let start_date = "";
    let end_date = "";

    const year = data.monthYear?.getFullYear();
    const month = String(data.monthYear?.getMonth() + 1).padStart(2, "0");

    if (year && month) {
      const startDate = new Date(`${year}-${month}-01`);

      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 6);

      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      start_date = formattedStartDate;
      end_date = formattedEndDate;
    }

    let adm1_name = data?.county?.label;
    let adm2_name = data?.subCounty?.label;

    if (adm1_name === "All") {
      adm1_name = "";
    }

    if (adm2_name === "All") {
      adm2_name = "";
    }

    const formData = {
      api_url: data?.source?.url,
      adm0_name: data?.country?.label,
      adm0_id: data?.country?.value,
      adm1_name,
      adm1_id: data?.county?.value,
      adm2_name,
      adm2_id: data?.subCounty?.value,
      basin_name: "",
      sub_basin_name: "",
      start_date,
      end_date,
    };
    updateFormData(formData);
    setSubmitForm(true);
    setIndicatorList([data.source]);
  };

  useEffect(() => {
    if (County) {
      dispatch(
        locationsubRequest({
          location_type: LOCATION.District,
          parent_id: County?.value,
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

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="form-div">
        <Col md={2}>
          <FormGroup>
            <Label for="country" className="label-text">
              Country *
            </Label>
            <Controller
              name="country"
              control={control}
              defaultValue={defaultCountry}
              render={({ field }) => (
                <Select
                  {...field}
                  isDisabled
                  id="country"
                  value={defaultCountry}
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: errors.country ? "1px solid red" : "1px solid #ccc",
                    }),
                  }}
                />
              )}
            />
          </FormGroup>
        </Col>
        <Col md={2}>
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
                  defaultValue={County}
                  onChange={(selectedOption) => {
                    // Use a temporary variable to hold the selected option
                    const tempCounty = selectedOption;

                    // Set the temporary variable as County
                    setCounty(tempCounty);

                    // Dispatch the action
                    field.onChange(selectedOption);
                    // Reset the "Sub-County" field
                    setValue("subCounty", "");
                  }}
                  value={County}
                  isDisabled={loader}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "10px",
                      border: errors.county ? "1px solid red" : "1px solid #ccc",
                    }),
                  }}
                />
              )}
            />
          </FormGroup>
        </Col>
        <Col md={2}>
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
                  isDisabled={!County || County.value === "" || loader}
                />
              )}
            />
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <Label for="monthYear" className="label-text">
              Month and Year *
            </Label>
            <Controller
              name="monthYear"
              control={control}
              rules={{
                required: "required",
              }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={selectedDate}
                  dateFormat="MMMM-yyyy"
                  showMonthYearPicker
                  showPopperArrow={false}
                  id="monthYear"
                  maxDate={maxDate}
                  onChange={handleDateChange}
                  disabled={loader}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "10px",
                    }),
                    "&[disabled]": {
                      backgroundColor: "#ffffff",
                    },
                  }}
                />
              )}
            />
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <Label for="source" className="label-text">
              Source *
            </Label>
            <Controller
              name="source"
              control={control}
              defaultValue={defaultSource}
              rules={{ required: "required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={sourceList}
                  id="source"
                  isSearchable
                  isDisabled={loader}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "10px",
                      border: errors.source ? "1px solid red" : "1px solid #ccc",
                    }),
                  }}
                />
              )}
            />
          </FormGroup>
        </Col>
        <Col md={1}>
          <Button type="submit" className="apply-button" disabled={loader}>
            Apply
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Filters;
