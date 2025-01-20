import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import OnlineBulletinModal from "./bulletinModel.js";
import { LOCATION, emptyPayload } from "../../Constants";
import { formatDate } from "../../helpers";
import {
  getBulletinRequest,
  locationRequest,
  locationstateRequest,
  getBulletinSuccess,
} from "../../store/actions.js";
import CardList from "./cardList.js";
import Filter from "../../assests/Images/mdi_filter.png";
import Dropdown from "../../assests/Images/dropdown.png";
import GlobalLoader from "../../components/Common/GLobalLoader.js";

function OnlineBulletinComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [country, setCountry] = useState();
  const [stateList, setStateList] = useState();
  const [isFilter, setIsFilter] = useState(false);
  const [formData, setFormData] = useState();
  const [submitData, setSubmitData] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [bulletinCards, setBulletinCards] = useState([]);
  const [filteredBulletinCards, setFilteredBulletinCards] = useState([]);
  const [locationName, setLocationName] = useState("");

  const updateFormData = (newData) => {
    setFormData(newData);
  };

  const toggleModal = () => {
    setIsOpenModel(!isOpenModel);
    setIsFilter(false);
  };

  const toggleFilter = () => {
    setIsOpenModel(!isOpenModel);
    setIsFilter(true);
  };
  const handleFormSubmit = (data, selectedLocation, submitForm) => {
    navigate("/create-news-bulletin", {
      state: { formData: data, selectedLocation: selectedLocation, submitForm: submitForm },
    });
  };

  const handlecCardPreview = (id) => {
    const cardList =
      formData && Object.values(formData)?.length > 1 ? filteredBulletinCards : bulletinCards;

    const card = cardList?.find((card) => card.id === id);
    if (card) {
      navigate(`/online-news-bulletin/${card.id}`, { state: { card } });
    }
  };

  const nextProps = useSelector((state) => ({
    LocationData: state.Location.LocationList,
    StateLocationData: state.Location.LocationstateList,
    bulletinCards: state.Bulletin.getBulletinData,
    bulletinLoader: state.Bulletin.isGetBulletinRequesting,
  }));

  useEffect(() => {
    dispatch(locationRequest({ location_type: LOCATION.Country, parent_id: "" }));
    return () => {
      dispatch(getBulletinSuccess({}));
    };
  }, []);
  useEffect(() => {
    if (!formData) {
      let formData = emptyPayload;
      dispatch(getBulletinRequest({ formData }));
    } else {
      setPageNumber(1);
      setBulletinCards([]);
      setFilteredBulletinCards([]);
      dispatch(
        getBulletinRequest({
          formData: { ...formData, page: 1, limit: 8 },
        })
      );
    }
  }, [formData]);

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
    if (nextProps.bulletinCards) {
      setPageCount(nextProps?.bulletinCards?.data?.result?.count);
      const newBulletinCards = nextProps?.bulletinCards?.data?.result?.results || [];
      if (formData && Object.values(formData).length > 1) {
        setFilteredBulletinCards((prevFilteredBulletinCards) => [
          ...prevFilteredBulletinCards,
          ...newBulletinCards.filter(
            (card) => !prevFilteredBulletinCards.some((prevCard) => prevCard.id === card.id)
          ),
        ]);
      } else {
        setBulletinCards((prevBulletinCards) => [
          ...prevBulletinCards,
          ...newBulletinCards.filter(
            (card) => !prevBulletinCards.some((prevCard) => prevCard.id === card.id)
          ),
        ]);
      }
    }
  }, [nextProps.bulletinCards]);

  const fetchNextBulletinData = () => {
    setPageNumber(pageNumber + 1);
    if (!formData) {
      // eslint-disable-next-line no-unused-vars
      const { page, ...restPayload } = emptyPayload;
      const formData = { ...restPayload, page: pageNumber + 1 };
      dispatch(
        getBulletinRequest({
          formData,
        })
      );
    } else {
      dispatch(
        getBulletinRequest({
          formData: { ...formData, page: pageNumber + 1 },
        })
      );
    }
  };

  useEffect(() => {
    if (submitData) {
      const formattedStartDate = submitData?.startDate ? formatDate(submitData?.startDate) : null;
      const formattedEndDate = submitData?.endDate ? formatDate(submitData?.endDate) : null;
      if (submitData?.startDate && submitData?.endDate) {
        if (submitData?.subCounty !== "" && submitData?.subCounty?.label !== "All") {
          setLocationName(
            `for ${submitData?.subCounty?.label} from ${formattedStartDate} to ${formattedEndDate}`
          );
        } else if (submitData?.county !== "" && submitData?.county?.label !== "All") {
          setLocationName(
            `for ${submitData?.county?.label} from ${formattedStartDate} to ${formattedEndDate}`
          );
        } else {
          setLocationName(`from ${formattedStartDate} to ${formattedEndDate}`);
        }
      } else {
        if (submitData?.subCounty !== "" && submitData?.subCounty?.label !== "All") {
          setLocationName(`for ${submitData?.subCounty?.label}`);
        } else if (submitData?.county !== "" && submitData?.county?.label !== "All") {
          setLocationName(`for ${submitData?.county?.label}`);
        }
      }
      // , ${submitData?.country?.label}`);
      // } else if (submitData?.country !== "") {
      //   setLocationName(`${submitData?.country?.label}`);
      // }
    }
  }, [submitData]);

  return (
    <>
      <GlobalLoader loader={nextProps.bulletinLoader} />
      <div className="main-container1">
        {isOpenModel && (
          <OnlineBulletinModal
            country={country}
            stateList={stateList}
            isOpenModel={isOpenModel}
            toggleModal={toggleModal}
            onFormSubmit={handleFormSubmit}
            isFilter={isFilter}
            updateFormData={updateFormData}
            setFilteredBulletinCards={setFilteredBulletinCards}
            filterFormData={formData}
            setSubmitData={setSubmitData}
            submitData={submitData}
          />
        )}
        <Row className="create-block">
          <Col md={7}>
            <h6 className="name-bulletin">
              {submitData ? (
                <p>
                  Online News Bulletin{" "}
                  <span className="notranslate" style={{ color: "#962129" }}>
                    &nbsp;{locationName}
                  </span>
                </p>
              ) : (
                "Online News Bulletin"
              )}
            </h6>
          </Col>
          <Col md={3}>
            <Row className="justify-content-end">
              <Col md={5}>
                <Button type="button" className="filter-button" onClick={() => toggleFilter()}>
                  <Row className="justify-content-around">
                    <Col md={8}>
                      <img src={Filter} alt="filter" className="filter-icon" />
                      Filter
                    </Col>
                    <Col md={2}>
                      <img src={Dropdown} alt="drpdown" className="dropDown-icon" />
                    </Col>
                  </Row>
                </Button>
              </Col>
              <Col md={6}>
                <Button type="button" className="create-button" onClick={() => toggleModal()}>
                  Create Bulletin
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="bulletin-card-div">
          {nextProps.bulletinCards?.data?.result?.results?.length ? (
            <InfiniteScroll
              dataLength={nextProps.bulletinCards?.data?.result?.results?.length || 0}
              next={fetchNextBulletinData}
              hasMore={pageNumber * 8 < pageCount}
              loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>No more bulletins to display</b>
                </p>
              }
            >
              <div>
                <CardList
                  handlecCardPreview={handlecCardPreview}
                  cardList={
                    formData && Object.values(formData)?.length > 1
                      ? filteredBulletinCards
                      : bulletinCards
                  }
                />
              </div>
            </InfiniteScroll>
          ) : (
            <p className={nextProps.bulletinLoader ? "no-bulletin1" : "no-bulletin"}>
              <b>Bulletins are not available for the selected criteria</b>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
export default React.memo(OnlineBulletinComponent);
