import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { Button, Col, Form, FormGroup, Label, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { desicionCategoryRequest } from "../../store/actions.js";
import { defaultPhase } from "../../Constants";

function Filter({ phaseList = {}, updateFormData, setSubmitForm }) {
  const dispatch = useDispatch();
  const [phaseOptions, setPhaseOptions] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);
  const [subEventOptions, setSubEventOptions] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState(defaultPhase);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSubEvent, setSelectedSubEvent] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activityOptions, setActivityOptions] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const { handleSubmit, control, setValue } = useForm();
  const nextprops = useSelector((state) => ({
    ListCategory: state.Decision.CategoryList,
  }));
  useEffect(() => {
    const phases = [];

    phaseList.forEach((phase) => {
      phases.push({
        value: phase.id,
        label: phase.name,
      });
    });
    setPhaseOptions(phases);
  }, [phaseList]);

  const onSubmit = (data) => {
    const formData = {
      phaseName: null,
      phase: null,
      eventName: null,
      event: null,
      subEventName: null,
      subEvent: null,
      category: null,
      categoryName: null,
      activityName: null,
      activity: null,
    };

    if (data.Epidemic) {
      formData.phase = data.Epidemic.value;
      formData.phaseName = data.Epidemic.label;
    } else {
      formData.phase = defaultPhase.value;
      formData.phaseName = defaultPhase.label;
    }
    if (data.Events) {
      formData.event = data.Events.value;
      formData.eventName = data.Events.label;
    }
    if (data.subEvent) {
      formData.subEvent = data.subEvent.value;
      formData.subEventName = data.subEvent.label;
    }
    if (data.Category) {
      formData.category = data.Category.value;
      formData.categoryName = data.Category.label;
    }
    if (data.Activity) {
      formData.activity = data.Activity.value;
      formData.activityName = data.Activity.label;
    } else {
      formData.activity = null;
      formData.activityName = null;
    }
    updateFormData(formData);
    setSubmitForm(true);
  };
  const handlePhaseChange = (phase) => {
    setSelectedPhase(phase);
    setValue("Epidemic", phase);
    setSelectedEvent(null);
    setSelectedSubEvent(null);
    setSelectedCategory(null);
    setSelectedActivity(null);

    if (phase) {
      const selectedPhaseData = phaseList.find((item) => item.id === phase.value);

      if (selectedPhaseData && selectedPhaseData.events) {
        const events = selectedPhaseData.events.map((event) => ({
          value: event.id,
          label: event.name,
        }));
        setEventOptions(events);
      } else {
        setEventOptions([]);
      }
      setSubEventOptions([]);
    }
    setValue("Events", null);
    setValue("subEvent", null);
    setValue("Category", null);
    setValue("Activity", null);
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event);
    setValue("Events", event);
    setValue("subEvent", null);
    setValue("Category", null);
    setValue("Activity", null);

    if (event) {
      const selectedEventData = phaseList.find((item) => item.id === selectedPhase.value);

      if (selectedEventData && selectedEventData.events) {
        const selectedEventItem = selectedEventData.events.find((item) => item.id === event.value);

        if (selectedEventItem && selectedEventItem.sub_events) {
          const subEvents = selectedEventItem.sub_events.map((subEventItem) => ({
            value: subEventItem.id,
            label: subEventItem.name,
          }));
          setSubEventOptions(subEvents);
        } else {
          setSubEventOptions(null);
        }
      }
      setSelectedSubEvent(null);
      setSelectedCategory(null);
      setSelectedActivity(null);
    } else {
      setSelectedSubEvent(null);
      setSelectedCategory(null);
      setSelectedActivity(null);
    }
  };

  const handleSubEventChange = (subEvent) => {
    setSelectedSubEvent(subEvent);
    setValue("subEvent", subEvent);
    setSelectedCategory(null);
    setSelectedActivity(null);
    setValue("Category", null);
    setValue("Activity", null);
  };
  useEffect(() => {
    const payload = {
      phase: "7fd5941c-6fae-47ef-8133-17b34e0f0132",
      event: null,
      subEvent: null,
    };
    dispatch(desicionCategoryRequest(payload));
  }, []);

  useEffect(() => {
    if (selectedPhase || selectedEvent || selectedSubEvent) {
      const payload = {
        phase: selectedPhase?.value || "7fd5941c-6fae-47ef-8133-17b34e0f0132",
        event: selectedEvent?.value || null,
        subEvent: selectedSubEvent?.value || null,
      };
      dispatch(desicionCategoryRequest(payload));
    }
  }, [selectedPhase, selectedEvent, selectedSubEvent]);

  useEffect(() => {
    if (nextprops?.ListCategory) {
      const categories = [];

      nextprops?.ListCategory?.forEach((category) => {
        categories.push({
          value: category.id,
          label: category.name,
        });
      });

      setCategoryOptions(categories);
    }
  }, [nextprops.ListCategory]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setValue("Category", cat);
    setSelectedActivity(null);
    setValue("Activity", null);
    if (cat) {
      setSelectedActivity(null);
      const selectedcategoryData = nextprops?.ListCategory?.find((item) => item.id === cat.value);
      if (selectedcategoryData) {
        const activity = selectedcategoryData.activities.map((act) => ({
          value: act.id,
          label: act.name,
        }));
        setActivityOptions(activity);
      } else {
        setActivityOptions(null);
      }
    }
  };

  const handleActivityChange = (activity) => {
    setSelectedActivity(activity);
    setValue("Activity", activity);
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="form-div">
        <Col md={2}>
          <FormGroup>
            <Label for="Epidemic" className="label-text">
              Epidemic phase *
            </Label>
            <Controller
              name="Epidemic"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="Epidemic"
                  defaultValue={defaultPhase}
                  value={selectedPhase}
                  options={phaseOptions}
                  onChange={handlePhaseChange}
                />
              )}
            />
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <Label for="Events" className="label-text">
              Events
            </Label>
            <Controller
              name="Events"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="Events"
                  options={eventOptions}
                  value={selectedEvent}
                  onChange={handleEventChange}
                  isDisabled={eventOptions.length === 0}
                />
              )}
            />
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <Label for="subEvent" className="label-text">
              Sub-event
            </Label>
            <Controller
              name="subEvent"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="subEvent"
                  options={subEventOptions}
                  value={selectedSubEvent}
                  onChange={handleSubEventChange}
                  isDisabled={subEventOptions.length === 0}
                />
              )}
            />
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <Label for="Category" className="label-text">
              Category
            </Label>
            <Controller
              name="Category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="Category"
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  isDisabled={
                    !selectedPhase ||
                    (eventOptions.length !== 0 && !selectedEvent) ||
                    (subEventOptions.length !== 0 && !selectedSubEvent) ||
                    categoryOptions.length === 0
                  }
                />
              )}
            />
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <Label for="Activity" className="label-text">
              Activity
            </Label>
            <Controller
              name="Activity"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="Activity"
                  onChange={handleActivityChange}
                  value={selectedActivity}
                  options={activityOptions}
                  isDisabled={activityOptions.length === 0 || !selectedCategory}
                />
              )}
            />
          </FormGroup>
        </Col>
        <Col md={1}>
          <Button type="submit" className="apply-button">
            View Plan
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Filter;
