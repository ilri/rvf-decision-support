import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { Button, Col, Form, FormGroup, Label, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { renderReactOptionsArraystate } from "../../helpers";
import { LOCATION, defaultCounty } from "../../Constants";
import { locationsubRequest } from "../../store/actions";

function Filter({
  country = {},
  stateList = {},
  updateFormData,
  setSubmitForm,
  setSelectedLocation,
  setIsSubCounty,
  setIsCountry,
  setIsCounty,
  loader,
  setFormChanged,
}) {
  const dispatch = useDispatch();

  const [stateListOptions, setStateListOptions] = useState([]);
  const [subCountyList, setSubCountyList] = useState([]);
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

  const { handleSubmit, control, setValue } = useForm();

  useEffect(() => {
    setValue("country", defaultCountry);
  }, [defaultCountry, setValue]);

  const handleCountryChange = (selectedOption, field) => {
    field.onChange(selectedOption);
    setFormChanged(true);

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
    setFormChanged(true);

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
    setFormChanged(true);
  };

  const onSubmit = (data) => {
    if (data?.subCounty) {
      if (data?.subCounty.value === "") {
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
      if (data?.county.value === "") {
        setSelectedLocation(data.country);
        setIsSubCounty(false);
        setIsCountry(true);
        setIsCounty(false);
      } else {
        setSelectedLocation(data.county);
        setIsSubCounty(false);
        setIsCounty(true);
        setIsCountry(false);
      }
    } else if (data?.country) {
      setSelectedLocation(defaultCountry);
      setIsSubCounty(false);
      setIsCountry(true);
      setIsCounty(false);
    }
    let adm1_name = data?.county?.label;
    if (adm1_name === "All") {
      adm1_name = "";
    }
    let adm2_name = data?.subCounty?.label;
    if (adm2_name === "All") {
      adm2_name = "";
    }

    const formData = {
      // api_url: "accumulated_rainfall/gpm",
      adm0_name: data?.country?.label,
      adm0_id: data?.country?.value,
      adm1_name,
      adm1_id: data?.county?.value,
      adm2_name,
      adm2_id: data?.subCounty?.value,
      basin_name: "",
      sub_basin_name: "",
      // start_date,
      // end_date,
    };
    updateFormData(formData);
    setSubmitForm(true);
    setFormChanged(false);
  };

  useEffect(() => {
    if (County) {
      dispatch(
        locationsubRequest({
          location_type: LOCATION.District,
          parent_id: County?.value,
        })
      );
    } else if (defaultCounty) {
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

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="form-div">
        <Col md={2} />
        <Col md={2}>
          <FormGroup>
            <Label for="country" className="label-text">
              Country
            </Label>
            <Controller
              name="country"
              control={control}
              // defaultValue={defaultCountry}
              render={({ field }) => (
                <Select
                  {...field}
                  isDisabled={loader}
                  id="country"
                  // value={defaultCountry}
                  options={countryList}
                  onChange={(selectedOption) => handleCountryChange(selectedOption, field)}
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
                  onChange={(selectedOption) => handleCountyChange(selectedOption, field)}
                  isDisabled={loader}
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
                  isDisabled={loader || County?.value === "" || County === null}
                  onChange={(selectedOption) => handleSubCountyChange(selectedOption, field)}
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
        <Col md={2} />
      </Row>
    </Form>
  );
}

export default Filter;
