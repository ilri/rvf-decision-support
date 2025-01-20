import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import backArrow from "../../assests/Images/backArrow.png";
import Download from "../../assests/Images/download.png";
import Share from "../../assests/Images/share.png";
import GlobalLoader from "../../components/Common/GLobalLoader";
import Response from "./CreateBulletin/response.js";
import EmailInputContainer from "../Bulletin/CreateBulletin/mailShare.js";
import { shareBulletinRequest, shareBulletinSuccess } from "../../store/actions.js";

function BulletinPreviewComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedCard = location?.state?.card;
  const [pdfLoading, setPdfLoading] = useState(true);
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailIds, setEmailIds] = useState([]);
  const [mailGroupName, setMailGroupName] = useState("");
  const [mailGroupId, setGroupMailId] = useState("");
  const [update, setUpdate] = useState(false);
  const form = new FormData();
  form.append("country_name", selectedCard?.country_name);
  form.append("county_name", selectedCard?.county_name);
  form.append("sub_county_name", selectedCard?.sub_county_name);

  useEffect(() => {
    return () => {
      dispatch(shareBulletinSuccess({}));
    };
  }, []);

  const nextProps = useSelector((state) => ({
    sendBulletin: state.Bulletin.shareBulletinData,
  }));

  const toggleModal = () => {
    setIsOpenModel(!isOpenModel);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Initialize PDF.js worker
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  const handlePdfLoad = () => {
    setPdfLoading(false);
  };

  const handleBack = () => {
    navigate("/online-news-bulletin");
  };

  const handleShareMail = async (emailIds, mailGroupName, update) => {
    setPdfLoading(true);
    if (emailIds.length > 0 && mailGroupName !== "" && update === false) {
      if (Array.isArray(emailIds) && emailIds.length > 0) {
        emailIds.forEach((email) => {
          form.append("email[]", email);
        });
        form.append("pdf_base64", selectedCard?.pdf_base_64);
        form.append("email_group_name", mailGroupName);
        form.append("email_group_id", "");
        dispatch(shareBulletinRequest(form));
      }
    } else if (emailIds.length > 0 && mailGroupName === "" && update === false) {
      if (Array.isArray(emailIds) && emailIds.length > 0) {
        emailIds.forEach((email) => {
          form.append("email[]", email);
        });
        form.append("pdf_base64", selectedCard?.pdf_base_64);
        form.append("email_group_name", "");
        form.append("email_group_id", "");
        dispatch(shareBulletinRequest(form));
      }
    }
  };

  const handleShareGroupMail = async (mailGroupId, mailGroupName) => {
    setPdfLoading(true);
    if (mailGroupName !== "" && mailGroupId !== undefined && emailIds.length === 0) {
      //   // form.append("email[]", emailIds);
      form.append("pdf_base64", selectedCard?.pdf_base_64);
      form.append("email_group_name", mailGroupName);
      form.append("email_group_id", mailGroupId);
      dispatch(shareBulletinRequest(form));
    }
  };

  const handleShareNewGroupMail = async (mailGroupId, mailGroupName, emailIds, update) => {
    setPdfLoading(true);
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
        form.append("pdf_base64", selectedCard?.pdf_base_64);
        // form.append("email_group_name", mailGroupName);
        form.append("email_group_id", mailGroupId);
        dispatch(shareBulletinRequest(form));
      }
      // setIsLoadingPDF(false);
    }
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
    if (nextProps.sendBulletin === false) {
      setPdfLoading(true);
    } else if (nextProps.sendBulletin !== undefined) {
      setPdfLoading(false);
      toggleModal();
    }
  }, [nextProps.sendBulletin]);

  return (
    <>
      <GlobalLoader loader={pdfLoading} height="50%" />
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
        <Row className="create-block1 justify-content-between">
          <Col md={3}>
            <div className="name-block">
              <img
                src={backArrow}
                alt="arrow"
                className="back-arrow"
                style={{ width: "20%" }}
                onClick={handleBack}
              />
              <h6 className="name-preview"> Bulletin Preview</h6>
            </div>
          </Col>
          <Col md={5}></Col>
          <Col md={3}>
            <Row className="col-icon1 mt-3">
              <Col md={4} className="col-icon">
                <img
                  src={Download}
                  alt="download"
                  className="download-image"
                  style={{ cursor: "pointer", width: "32%" }}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = selectedCard?.pdf_file;
                    link.setAttribute("download", "filename.pdf");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  aria-label="documetDownload"
                />
              </Col>
              <Col md={4}>
                <img
                  src={Share}
                  alt="share"
                  className="pointer-image"
                  style={{ marginRight: "2%", cursor: "pointer", width: "32%" }}
                  onClick={openModal}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="pdf-div notranslate">
          <Document file={`data:application/pdf;base64,${selectedCard?.pdf_base_64}`}>
            <Page pageNumber={1} onLoadSuccess={handlePdfLoad} />
          </Document>
        </div>
      </div>
    </>
  );
}

export default BulletinPreviewComponent;
