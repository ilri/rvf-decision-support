import React, { useState, useEffect, Suspense, useRef } from "react";
import { Button, Col, Row } from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RcTextarea from "rc-textarea";
import domtoimage from "dom-to-image-more";
import _ from "lodash";
import { jsPDF as JSPDF } from "jspdf";
/* eslint-disable no-unused-vars */
import FileSaver from "file-saver";
import backArrow from "../../../assests/Images/backArrow.png";
import Download from "../../../assests/Images/download.png";
import Share from "../../../assests/Images/share.png";
import {
  getTimeSeriesRequest,
  getTimeSeriesSuccess,
  getGfsNovaRequest,
  getGfsNovaSuccess,
  addMapSuccess,
  addMap1Request,
  addMap1Success,
  dashboardSourceRequest,
  addBulletinRequest,
  addBulletinSuccess,
  shareBulletinRequest,
  shareBulletinSuccess,
} from "../../../store/actions.js";
import { getEndDate, getStartDate, getMonthYearArray, convertToFullDate } from "../../../helpers";
import { gfsNovaIntial, defaultDescription, DOWNLOAD_PAGE_IDS, Months } from "../../../Constants";
import NovaChart from "../../Rainfall/novaChart.js";
import RainFallChart from "../../Rainfall/currentRainfall.js";
import RenderMapContainer from "../../Rainfall/mapContainer.js";
import Header from "./header.js";
import Footer from "../../../components/Common/footer.js";
import QuilTextEditor from "./quillEditor.js";
import GlobalLoader from "../../../components/Common/GLobalLoader.js";
import Response from "./response.js";
import EmailInputContainer from "./mailShare.js";

function CreateBulletinComponent() {
  const location = useLocation();
  const formData = location.state?.formData;
  const selectedLocation = location.state?.selectedLocation;
  const submitForm = location.state?.submitForm;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiUrl, setApiUrl] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [date, setDate] = useState();
  const monthArray = getMonthYearArray(getStartDate(endDate), endDate);
  const [indicatorList, setIndicatorList] = useState([]);
  const [isSubCounty, setIsSubCounty] = useState(false);
  const [isCounty, setIsCounty] = useState(false);
  const [isCountry, setIsCountry] = useState(false);
  const [currentMonth, setCurrentMonth] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [description, setDescription] = useState(defaultDescription);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const [locationName, setLocationName] = useState("");
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailIds, setEmailIds] = useState([]);
  const formContainerRef = useRef(null);
  const descriptionContainerRef = useRef(null);
  const [formContainerHeight, setFormContainerHeight] = useState(0);
  const [descriptionContainerHeight, setDescriptionContainerHeight] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [colHeight, setColHeight] = useState(520);
  const [mailGroupName, setMailGroupName] = useState("");
  const [mailGroupId, setGroupMailId] = useState("");
  const [update, setUpdate] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { adm0_id, adm1_id, adm2_id, adm0_name, adm1_name, adm2_name } = formData || {};

  const form = new FormData();
  form.append("country_name", adm0_name || "");
  form.append("county_name", adm1_name || "");
  form.append("sub_county_name", adm2_name || "");

  useEffect(() => {
    if (adm2_name !== "") {
      setLocationName(`${adm2_name}, ${adm1_name}, ${adm0_name}`);
    } else if (adm1_name !== "") {
      setLocationName(`${adm1_name}, ${adm0_name}`);
    } else if (adm0_name !== "") {
      setLocationName(`${adm0_name}`);
    }
  }, []);

  useEffect(() => {
    if (adm2_id) {
      if (adm2_id === "") {
        setIsSubCounty(false);
        setIsCountry(false);
        setIsCounty(true);
      } else {
        setIsSubCounty(true);
        setIsCountry(false);
        setIsCounty(false);
      }
    } else if (adm1_id) {
      if (adm1_id === "") {
        setIsSubCounty(false);
        setIsCountry(true);
        setIsCounty(false);
      } else {
        setIsSubCounty(false);
        setIsCounty(true);
        setIsCountry(false);
      }
    } else if (adm0_id) {
      setIsSubCounty(false);
      setIsCountry(true);
      setIsCounty(false);
    }
  }, []);

  const toggleModal = () => {
    setIsOpenModel(!isOpenModel);
  };

  const handleBack = () => {
    navigate("/online-news-bulletin");
  };
  const handleBackPreview = () => {
    setPreviewMode(!previewMode);
    if (isPublished) {
      navigate("/online-news-bulletin");
    }
  };
  const spatialData = {
    spatial_aggregation: "mean",
  };
  const timeSeriesFormData = { ...formData, ...spatialData };
  const nextProps = useSelector((state) => ({
    LocationData: state.Location.LocationList,
    StateLocationData: state.Location.LocationstateList,
    TimeSeriesData: state.Dashboard.timeseriesData,
    GfsNovaData: state.Dashboard.timeseriesGfsNova,
    MapData: state.Dashboard.mapData,
    SourceData: state.Dashboard.SourceList,
    LoadingMap: state.Dashboard.mapRainLoading,
    LoadingGraph: state.Dashboard.timeSeriesloading,
    LoadingGfs: state.Dashboard.timeSeriesGfsNovaloading,
    MapData1: state.Dashboard.mapData1,
    LoadingMap1: state.Dashboard.mapRain1Loading,
    AddBulletinResponse: state.Bulletin.addBulletinData,
    addBulletinLoader: state.Bulletin.isAddBulletinRequesting,
    sendBulletin: state.Bulletin.shareBulletinData,
  }));

  useEffect(() => {
    if (nextProps.AddBulletinResponse || nextProps.sendBulletin) {
      toggleModal();
    }
  }, [nextProps.AddBulletinResponse, nextProps.sendBulletin]);
  useEffect(() => {
    dispatch(dashboardSourceRequest());
    setIndicatorList([{ label: "GPM" }]);
    return () => {
      dispatch(getTimeSeriesSuccess());
      dispatch(addMapSuccess());
      dispatch(addMap1Success());
      dispatch(getGfsNovaSuccess());
      dispatch(addBulletinSuccess({}));
      dispatch(shareBulletinSuccess({}));
    };
  }, []);

  useEffect(() => {
    if (nextProps.SourceData) {
      setApiUrl(nextProps?.SourceData[1].api_url);
      setEndDate(nextProps?.SourceData[1].dataset_max_date);
    }
  }, [nextProps.SourceData]);

  useEffect(() => {
    if (formData && submitForm && apiUrl) {
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
      const data3 = {
        ...timeSeriesFormData,
        api_url: apiUrl,
        start_date: startDate,
        end_date: getEndDate(startDate),
      };
      dispatch(getTimeSeriesRequest(data1));
      dispatch(getGfsNovaRequest(data));
      dispatch(addMap1Request(data3));
      setDate(monthArray[monthArray.length - 2]);
    }
  }, [formData, submitForm, apiUrl]);

  useEffect(() => {
    if (date && formData && submitForm && apiUrl) {
      const dateString = date;
      const parts = dateString.split("-");
      if (parts.length === 2) {
        const [monthAbbreviation, year] = parts;
        // Find the month object in the Months array
        const monthObject = Months.find((month) => month.id === monthAbbreviation);
        if (monthObject) {
          const fullMonthName = monthObject.label;
          setCurrentMonth(fullMonthName);
        } else {
          console.error("Invalid month abbreviation:", monthAbbreviation);
        }
      } else {
        console.error("Invalid date format:", dateString);
      }
    }
  }, [date, formData, submitForm, apiUrl]);

  const defaultText = `RVF cases expected to rise in ${currentMonth} end 2024 in ${locationName}`;

  useEffect(() => {
    if (currentMonth !== "") {
      setTextareaValue(defaultText);
    }
  }, [currentMonth]);

  const handlePreview = () => {
    setPreviewMode(!previewMode); // Toggle preview mode
  };

  const handleAddDescription = (data) => {
    setDescription(data);
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const generatePdf = async () => {
    /* eslint-disable no-await-in-loop */
    setIsLoadingPDF(true);
    const margin = 30; // Adjust the margin for pdf

    const pdf = new JSPDF({ compress: true, format: "a4" });

    for (let i = 0; i < DOWNLOAD_PAGE_IDS.length; i += 1) {
      const componentId = DOWNLOAD_PAGE_IDS[i];

      const component = document.getElementById(componentId);
      // converting to image
      const componentImage = await domtoimage.toPng(component);
      // Get width and height of the component element
      const height = component.offsetHeight;
      const width = component.offsetWidth;

      const newWidth = 1400 + 2 * margin; // adding margin to width
      const newHeight = height + 2 * margin; // adding margin to height

      pdf.internal.pageSize.width = newWidth; // setting pdf page width
      pdf.internal.pageSize.height = newHeight; // setting pdf page height

      pdf.addImage(componentImage, "PNG", -1, margin, width, height);
      if (i !== DOWNLOAD_PAGE_IDS.length - 1) {
        pdf.addPage();
      }
    }
    setIsLoadingPDF(false);
    return pdf;
  };

  const generateImage = async () => {
    const component = document.getElementById("map-image");
    const image = await domtoimage.toPng(component);
    return image;
  };
  const downloadPdf = async () => {
    const doc = await generatePdf();
    doc.save("BULLETIN_REPORT.pdf");
  };

  const handlePublish = async () => {
    setIsLoadingPDF(true);
    const imageDoc = await generateImage();
    const slicedImageString = imageDoc.slice(22);
    const doc = await generatePdf();
    const pdf = doc.output("blob");
    const reader = new window.FileReader();
    reader.readAsDataURL(pdf);
    reader.onloadend = () => {
      const pdfResult = reader.result;
      const slicedResult = pdfResult.slice(28);
      if (!_.isEmpty(pdfResult) && imageDoc !== "undefined") {
        form.append("image_base64", slicedImageString);
        form.append("pdf_base64", slicedResult);
        dispatch(addBulletinRequest(form));
      }
    };
    setIsLoadingPDF(false);
    setIsPublished(true);
  };

  const handleShareMail = async (emailIds, mailGroupName, update) => {
    setIsLoadingPDF(true);
    const doc = await generatePdf();
    const pdf = doc.output("blob");
    const reader = new window.FileReader();
    reader.readAsDataURL(pdf);
    reader.onloadend = () => {
      const pdfResult = reader.result;
      const slicedResult = pdfResult.slice(28);
      if (!_.isEmpty(pdfResult) && Array.isArray(emailIds) && emailIds.length > 0) {
        if (emailIds.length > 0 && mailGroupName !== "" && update === false) {
          emailIds.forEach((email) => {
            form.append("email[]", email);
          });
          form.append("pdf_base64", slicedResult);
          form.append("email_group_name", mailGroupName);
          form.append("email_group_id", "");
          dispatch(shareBulletinRequest(form));
        } else if (emailIds.length > 0 && mailGroupName === "" && update === false) {
          emailIds.forEach((email) => {
            form.append("email[]", email);
          });
          form.append("pdf_base64", slicedResult);
          form.append("email_group_name", "");
          form.append("email_group_id", "");
          dispatch(shareBulletinRequest(form));
        }
      }
    };
    // setIsLoadingPDF(false);
  };

  const handleShareGroupMail = async (mailGroupId, mailGroupName) => {
    setIsLoadingPDF(true);
    const doc = await generatePdf();
    const pdf = doc.output("blob");
    const reader = new window.FileReader();
    reader.readAsDataURL(pdf);
    reader.onloadend = () => {
      const pdfResult = reader.result;
      const slicedResult = pdfResult.slice(28);
      if (mailGroupName !== "" && mailGroupId !== undefined && emailIds.length === 0) {
        //   // form.append("email[]", emailIds);
        form.append("pdf_base64", slicedResult);
        form.append("email_group_name", mailGroupName);
        form.append("email_group_id", mailGroupId);
        dispatch(shareBulletinRequest(form));
      }
    };
    // setIsLoadingPDF(false);
  };

  const handleShareNewGroupMail = async (mailGroupId, mailGroupName, emailIds, update) => {
    setIsLoadingPDF(true);
    const doc = await generatePdf();
    const pdf = doc.output("blob");
    const reader = new window.FileReader();
    reader.readAsDataURL(pdf);
    reader.onloadend = () => {
      const pdfResult = reader.result;
      const slicedResult = pdfResult.slice(28);
      if (
        mailGroupName !== "" &&
        emailIds.length > 0 &&
        mailGroupId !== undefined &&
        update === true
      ) {
        if (Array.isArray(emailIds) && emailIds.length > 0) {
          emailIds.forEach((email) => {
            form.append("email[]", email);
          });
          form.append("pdf_base64", slicedResult);
          // form.append("email_group_name", mailGroupName);
          form.append("email_group_id", mailGroupId);
          dispatch(shareBulletinRequest(form));
        }
        // setIsLoadingPDF(false);
      }
    };
    // setIsLoadingPDF(false);
  };

  const handleMailList = (formData) => {
    if (formData && formData.emailIds) {
      try {
        setEmailIds(formData.emailIds);
        setMailGroupName(formData?.groupName);
        setGroupMailId(formData?.groupId);
        setUpdate(formData?.update);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else if (formData && formData.groupName) {
      try {
        // setEmailIds([]);
        setMailGroupName(formData?.groupName);
        setGroupMailId(formData?.groupId);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  };

  useEffect(() => {
    handleShareMail(emailIds, mailGroupName, update);
  }, [emailIds, mailGroupName, update]);

  useEffect(() => {
    handleShareGroupMail(mailGroupId, mailGroupName);
  }, [mailGroupId, mailGroupName]);

  useEffect(() => {
    handleShareNewGroupMail(mailGroupId, mailGroupName, emailIds, update);
  }, [mailGroupId, mailGroupName, emailIds, update]);

  useEffect(() => {
    if (previewMode) {
      if (formContainerRef.current) {
        const height = formContainerRef.current.getBoundingClientRect().height;
        setFormContainerHeight(height);
      }
      if (descriptionContainerRef.current) {
        const height = descriptionContainerRef.current.getBoundingClientRect().height;
        setDescriptionContainerHeight(height);
      }
    } else {
      setFormContainerHeight(0);
      setDescriptionContainerHeight(0);
    }
  }, [previewMode]);

  useEffect(() => {
    if (formContainerHeight !== 0 && descriptionContainerHeight !== 0) {
      const sum = formContainerHeight + descriptionContainerHeight;
      if (sum > 520) {
        setColHeight(sum);
      } else {
        setColHeight(520);
      }
    } else {
      setColHeight(520);
    }
  }, [formContainerHeight, descriptionContainerHeight]);

  useEffect(() => {
    if (nextProps.sendBulletin === false) {
      setIsLoadingPDF(true);
    } else {
      setIsLoadingPDF(false);
    }
  }, [nextProps.sendBulletin]);

  useEffect(() => {
    if (isLoadingPDF || nextProps.addBulletinLoader) {
      // Add class to body to disable scrolling
      document.body.classList.add("no-scroll");
    } else {
      // Remove class to enable scrolling
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isLoadingPDF, nextProps.addBulletinLoader]);

  return (
    <>
      <GlobalLoader loader={isLoadingPDF || nextProps.addBulletinLoader} height="50%" />
      {isOpenModel && (
        <Response
          isOpenModel={isOpenModel}
          toggleModal={toggleModal}
          sendResponse={nextProps.sendBulletin}
        />
      )}
      <EmailInputContainer
        isOpen={isModalOpen}
        onClose={closeModal}
        handleMailList={handleMailList}
        // setGroupName={setGroupName}
      />
      <div className="main-container1">
        <Row className="create-block1 justify-content-between" style={{ paddingRight: "4%" }}>
          <Col md={1}>
            {previewMode ? (
              <div className="name-block">
                <img
                  src={backArrow}
                  alt="arrow"
                  className="back-arrow"
                  onClick={handleBackPreview}
                />
                <h6 className="name-preview">{previewMode ? "Preview" : ""}</h6>
              </div>
            ) : (
              <img src={backArrow} alt="arrow" className="back-arrow" onClick={handleBack} />
            )}
          </Col>
          <Col md={6}></Col>
          <Col md={4}>
            <Row className="justify-content-between">
              {/* <Col md={5}></Col> */}
              {previewMode ? (
                <Row className="col-icon1 mt-3">
                  <Col md={4}></Col>
                  <Col md={4} className="col-icon">
                    <img
                      src={Download}
                      alt="download"
                      className="download-image"
                      style={{ cursor: "pointer", width: "22%", marginLeft: "0%" }}
                      onClick={downloadPdf}
                    />
                  </Col>
                  <Col md={2} className="col-icon2">
                    <img
                      src={Share}
                      alt="share"
                      className="pointer-image"
                      style={{ marginRight: "2%", cursor: "pointer", width: "45%" }}
                      onClick={openModal}
                    />
                  </Col>
                </Row>
              ) : (
                <Row className="col-icon1 mt-1">
                  <Col md={6}></Col>
                  <Col md={4} className="col-icon1">
                    <Button
                      type="button"
                      className="create-button"
                      disabled={
                        nextProps.LoadingMap ||
                        nextProps.LoadingMap1 ||
                        nextProps.LoadingGraph ||
                        nextProps.LoadingGfs
                      }
                      onClick={handlePreview}
                    >
                      Preview
                    </Button>
                  </Col>
                </Row>
              )}

              {/* <Col md={6} className="d-flex justify-content-end align-items-start">
                {previewMode ? (
                    <div className="logo-block">
                      <img
                        src={Download}
                        alt="download"
                        className="download-image"
                        onClick={downloadPdf}
                      />
                      <img src={Share} alt="share" className="pointer-image" onClick={openModal} />
                    </div>
                  ) : (
                  <Button
                  type="button"
                  className="create-button"
                  disabled={
                  nextProps.LoadingMap || nextProps.LoadingMap1 || nextProps.LoadingGraph ||nextProps.LoadingGfs
                  }
                    onClick={handlePreview}
                  >
                    Preview
                  </Button>
                )}
              </Col> */}
              {/* <Col md={6} className="d-flex justify-content-end align-items-start">
                {previewMode ? (
                  <Button
                    type="button"
                    className="create-button"
                    onClick={handlePublish}
                    disabled={isPublished}
                  >
                    Publish
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="create-button"
                    disabled={
                      nextProps.LoadingMap || nextProps.LoadingMap1 || nextProps.LoadingGraph ||nextProps.LoadingGfs
                    }
                    onClick={handlePreview}
                  >
                    Preview
                  </Button>
                )}
              </Col> */}
            </Row>
          </Col>
        </Row>
        <div
          id="report-page"
          // className={"table-container bulletin-card-div"}
          className="table-container"
          style={{ margin: "0% 0% 0% 0%", paddingTop: "0%", height: "auto" }}
        >
          <Header location={locationName} />
          <div className="hr-line" />
          <Row>
            <Col md={5}>
              <div id="map-image">
                <RenderMapContainer
                  MapData={nextProps?.MapData}
                  MapData2={nextProps?.MapData1}
                  selectedLocation={selectedLocation}
                  isSubCounty={isSubCounty}
                  isCounty={isCounty}
                  isCountry={isCountry}
                  indicatorList={indicatorList}
                  graphData={nextProps?.TimeSeriesData?.graph_data}
                  formattedDateRange={date}
                  isLoader={nextProps.LoadingMap || nextProps.LoadingMap1}
                  ButtonLoader={
                    nextProps.LoadingMap ||
                    nextProps.LoadingMap1 ||
                    nextProps.LoadingGraph ||
                    nextProps.LoadingGfs
                  }
                  colHeight={colHeight}
                  previewMode={previewMode}
                />
              </div>
            </Col>
            <Col md={7}>
              <Row className="flex-column">
                <Col md={12}>
                  {previewMode ? (
                    <div className="new-heading notranslate" ref={formContainerRef}>
                      <h3 className="heading-name">{textareaValue}</h3>
                      <div className="hr1-line" />
                    </div>
                  ) : (
                    <>
                      <RcTextarea
                        autoSize={{ minRows: 2 }}
                        //   name={name}
                        maxLength={500}
                        className="text-area notranslate"
                        style={{ fontSize: "1.8rem", fontWeight: "640" }}
                        value={textareaValue}
                        placeholder="Enter text"
                        onChange={handleTextareaChange}
                      />
                      <div className="hr1-line" />
                    </>
                  )}
                </Col>
                <Col md={12}>
                  {previewMode ? (
                    <div
                      className="preview-html notranslate"
                      dangerouslySetInnerHTML={{ __html: description }}
                      ref={descriptionContainerRef}
                    />
                  ) : (
                    <QuilTextEditor onEditorChange={handleAddDescription} />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3 mb-3">
            <Col md={6}>
              <Suspense fallback={<div>Loading RainFallChart...</div>}>
                <RainFallChart
                  graph_data={nextProps?.TimeSeriesData?.graph_data}
                  isLoader={nextProps.LoadingGraph}
                  previewMode={previewMode}
                />
              </Suspense>
            </Col>
            <Col md={6}>
              <Suspense fallback={<div>Loading NoaaChart...</div>}>
                <NovaChart
                  graphData={nextProps?.GfsNovaData?.total_precipitation_surface}
                  isLoader={nextProps.LoadingGfs}
                  previewMode={previewMode}
                />
              </Suspense>
            </Col>
          </Row>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default CreateBulletinComponent;
