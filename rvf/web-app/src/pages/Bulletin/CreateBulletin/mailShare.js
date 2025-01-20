import React, { useEffect, useState, useRef } from "react";
import { Label, Modal, ModalHeader, Row, Col, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { mailListRequest } from "../../../store/actions";
import groupIcon from "../../../assests/Images/groupIcon.png";
import dropDown from "../../../assests/Images/arrow-down-drop.png";
import backArrow from "../../../assests/Images/backArrow.png";
import CrossIcon from "../../../assests/Images/crossIcon.png";

function EmailInputContainer({ isOpen, onClose, handleMailList }) {
  const dispatch = useDispatch();
  const [emailIds, setEmailIds] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("email");
  // const [showAdditionalInput, setShowAdditionalInput] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMailId, setSelectedMailId] = useState(null);
  const [list, setList] = useState(false);
  const [groupEmails, setGroupEmails] = useState([]);
  const [prevGroupEmails, setPrevGroupEmails] = useState({});
  const [mailChange, setMailChange] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [addMemberGroupName, setAddMemberGroupName] = useState("");
  const [selectedItemScrollPosition, setSelectedItemScrollPosition] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);
  const scrollPositionRef = useRef(0);

  const nextProps = useSelector((state) => ({
    mailList: state.Bulletin.mailListData,
  }));

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // const handleGroupNameChange = (event) => {
  //   setGroupName(event.target.value);
  // };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      if (validateEmail(inputValue.trim())) {
        if (emailIds.includes(inputValue.trim())) {
          setErrorMessage("Email ID is already entered");
        } else {
          setEmailIds([...emailIds, inputValue.trim()]);
          setInputValue("");
          setErrorMessage("");
        }
      } else {
        setErrorMessage("*Invalid email format");
      }
    } else {
      // Clear error message if input is valid on key down
      if (validateEmail(inputValue.trim())) {
        setErrorMessage("please press Enter to add");
      } else {
        setErrorMessage("");
      }
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    const updatedEmailIds = emailIds.filter((email) => email !== emailToRemove);
    setEmailIds(updatedEmailIds);
  };

  const handleEmailGroup = (mailId, emailToRemove) => {
    if (Object.prototype.hasOwnProperty.call(groupEmails, mailId)) {
      // Create a copy of the email array for the specified mail ID
      const updatedEmails = groupEmails[mailId].filter((email) => email !== emailToRemove);
      // Update the state with the modified email array
      setGroupEmails((prevGroupEmails) => ({
        ...prevGroupEmails,
        [mailId]: updatedEmails,
      }));
    }
  };

  const handleAddSubmit = (event) => {
    event.preventDefault();

    // Create a new array by combining emailIds and groupMails[selectedMailId]
    const combinedEmails = [...new Set([...emailIds, ...groupEmails[selectedMailId]])];

    // Create a new object that merges the existing groupEmails with the combined email IDs
    const updatedGroupEmails = {
      ...groupEmails,
      [selectedMailId]: combinedEmails,
    };
    // Update the groupEmails state with the new object
    setGroupEmails(updatedGroupEmails);

    // Close the Add Member modal
    setShowAddMemberModal(false);

    // Clear the form or perform any other necessary actions
    setEmailIds([]);
    setInputValue("");
    setGroupName("");
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Access the form data directly
    const formData = {
      emailIds: emailIds,
      inputValue: inputValue,
      groupName: groupName,
      update: false,
    };
    handleMailList(formData);
    onClose();
    // Clear the form or perform any other necessary actions
    setEmailIds([]);
    setInputValue("");
    setGroupName("");
  };

  const validateEmail = (email) => {
    // Regular expression for validating email format
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).trim().toLowerCase());
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  // const handleCheckboxChange = () => {
  //   setIsChecked(!isChecked);
  // };

  useEffect(() => {
    if (activeTab === "group") {
      dispatch(mailListRequest());
    }
  }, [activeTab]);

  useEffect(() => {
    // Set the initial value for prevGroupEmails when nextProps.mailList changes
    if (nextProps.mailList && nextProps.mailList.data && nextProps.mailList.data.data?.result) {
      const initialGroupEmails = {};
      nextProps.mailList.data.data.result.forEach((group) => {
        initialGroupEmails[group.id] = group.email;
      });
      setGroupEmails(initialGroupEmails);
      setPrevGroupEmails(initialGroupEmails);
    }
  }, [nextProps.mailList]);

  useEffect(() => {
    if (selectedMailId && groupEmails[selectedMailId]) {
      const prevEmails = prevGroupEmails[selectedMailId] || [];
      const updatedEmails = groupEmails[selectedMailId] || [];
      let mailChanged = false; // Initialize mailChanged to false

      // Check if any new email is added
      if (prevEmails.length < updatedEmails.length) {
        mailChanged = true;
      } else {
        // Check if any email from prevEmails is not found in updatedEmails
        for (const email of prevEmails) {
          if (!updatedEmails.includes(email)) {
            mailChanged = true;
            break;
          }
        }
      }
      setMailChange(mailChanged);
    }
  }, [selectedMailId, groupEmails, prevGroupEmails]);

  const handleGroupShare = (mailId) => {
    // Check if mailChange is true for the selected mailId
    if (mailChange) {
      const mail = nextProps.mailList.data.data.result.find((mail) => mail.id === mailId);
      if (mail) {
        const formData = {
          emailIds: groupEmails[mailId],
          groupName: mail.group_name, // Get the groupEmails based on the mailId
          groupId: mailId,
          update: true,
        };
        handleMailList(formData);
        setList(!list);
        setActiveTab(activeTab);
        onClose();
      }
    } else {
      const mail = nextProps.mailList.data.data.result.find((mail) => mail.id === mailId);
      if (mail) {
        const formData = {
          groupId: mailId,
          groupName: mail.group_name,
        };
        handleMailList(formData);
        setActiveTab(activeTab);
        setList(!list);
        onClose();
      }
    }
  };

  const showList = (mailId) => {
    setSelectedMailId(mailId);
    setList(!list); // Toggle list state
    scrollPositionRef.current = containerRef.current.scrollTop;
  };

  const handleAddMemberClick = (group_name) => {
    setSelectedItemScrollPosition(containerRef.current.scrollTop);
    setShowAddMemberModal(true);
    setAddMemberGroupName(group_name); // Show the Add Member modal content
  };
  const handleScroll = () => {
    // Update scroll position state when scroll event occurs
    setScrollPosition(containerRef.current.scrollTop);
  };
  useEffect(() => {
    if (!showAddMemberModal && containerRef.current) {
      // Restore the scroll position when returning to the previous container
      containerRef.current.scrollTop = selectedItemScrollPosition;
    }
  }, [showAddMemberModal, selectedItemScrollPosition]);

  const onCloseModal = () => {
    onClose();
    setShowAddMemberModal(false);
    setList(!list);
    setActiveTab("email");
    setInputValue("");
    setEmailIds([]);
    setErrorMessage("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Email Input Modal"
      className="share-popup"
      overlayClassName="email-modal-overlay"
    >
      <ModalHeader className="modalHead">
        {showAddMemberModal ? (
          <Row className="tabs-container">
            <Col>
              <p>
                <img
                  src={backArrow}
                  // className="back-arrow"
                  style={{ width: "10%" }}
                  onClick={() => setShowAddMemberModal(false)}
                  type="button"
                />
                Add Member in &quot;{addMemberGroupName}&quot;
              </p>
            </Col>
            <Col md={1}>
              <img src={CrossIcon} onClick={() => onCloseModal()} />
            </Col>
          </Row>
        ) : (
          <Row className="tabs-container">
            <Col md={3}>
              <p
                className={`tab ${
                  activeTab === "email" ? "sub-header-link active" : "sub-header-link"
                }`}
                onClick={() => toggleTab("email")}
              >
                Share
              </p>
            </Col>
            {/* <Col md={6}>
              <p
                className={`tab ${activeTab === "group" ? "active sub-header-link" : "sub-header-link"}`}
                onClick={() => toggleTab("group")}
              >
                View Groups
              </p>
            </Col> */}
            <Col md={1}>
              <img src={CrossIcon} onClick={() => onCloseModal()} />
            </Col>
          </Row>
        )}
        {/* <img src={CrossIcon} onClick={() => onCloseModal()} className="close-icon" /> */}
      </ModalHeader>
      {showAddMemberModal ? (
        <div className="email-div">
          <div className="email-input-container">
            <form onSubmit={handleAddSubmit}>
              <Label for="email" className="label-text" style={{ fontWeight: "650" }}>
                Add Email
              </Label>
              <div className="form-column">
                <div className="email-block">
                  {emailIds.length > 0 && (
                    <div className="email-tokens">
                      {emailIds.map((email) => (
                        <div key={email} className="email-token">
                          <div className="email-content">
                            <div>{email}</div>
                            <button className="cross-icon" onClick={() => handleRemoveEmail(email)}>
                              &times;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="email"
                    id="email"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter email"
                    className="input-block"
                    name="email"
                    autoComplete="off"
                  />
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <Button
                  type="submit"
                  className="send-done"
                  disabled={emailIds.length === 0 || errorMessage !== ""}
                >
                  Done
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="email-div">
          <div className="email-input-container">
            {activeTab === "email" && (
              <form onSubmit={handleSubmit}>
                <Label for="email" className="label-text" style={{ fontWeight: "650" }}>
                  Add Email
                </Label>
                <div className="form-column">
                  <div className="email-block">
                    {emailIds.length > 0 && (
                      <div className="email-tokens">
                        {emailIds.map((email) => (
                          <div key={email} className="email-token">
                            <div className="email-content">
                              <div>{email}</div>
                              <button
                                className="cross-icon"
                                onClick={() => handleRemoveEmail(email)}
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      type="email"
                      id="email"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter email"
                      className="input-block"
                      name="email"
                      autoComplete="off"
                    />
                  </div>
                  {errorMessage && <div className="error-message">{errorMessage}</div>}
                  {/* <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="showAdditionalInput"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    &nbsp;&nbsp;
                    <label htmlFor="showAdditionalInput">Create a mailing group</label>
                  </div>
                  {isChecked && (
                    <>
                      <Label className="label-text" style={{ fontWeight: "650", marginTop: "5%" }}>
                        Group Name
                      </Label>
                      <input
                        type="text"
                        id="additionalInput"
                        value={groupName}
                        onChange={handleGroupNameChange}
                        placeholder="Write group name here"
                        className="group-input"
                        maxLength={30}
                      />
                    </>
                  )} */}
                  <Button
                    type="submit"
                    className="send-done"
                    disabled={emailIds.length === 0 || errorMessage !== ""}
                  >
                    Done
                  </Button>
                </div>
              </form>
            )}
            {activeTab === "group" &&
              nextProps.mailList &&
              nextProps.mailList.data &&
              Array.isArray(nextProps.mailList.data.data?.result) && (
                <div className="other-tab-content">
                  <div className="group-tab-content" ref={containerRef} onScroll={handleScroll}>
                    <ul>
                      {/* <form onSubmit={handleSubmit}> */}
                      {nextProps.mailList.data?.data?.result.map((mail) => (
                        // <li key={mail.id}>{mail.email}</li>
                        <li
                          key={mail.id}
                          className="list-group"
                          style={{
                            backgroundColor: selectedMailId === mail.id && list ? "#e8e7e7" : "",
                          }}
                        >
                          <Row className="list-row">
                            <Row className="row-share">
                              <Col md={7}>
                                <Row className="row-share1">
                                  <Col md={3}>
                                    <img src={groupIcon} width="70%" />
                                  </Col>
                                  <Col md={8}>
                                    <h5>{mail.group_name}</h5>
                                    <p>
                                      {groupEmails[mail.id] && (
                                        <>
                                          {groupEmails[mail.id].length}{" "}
                                          {groupEmails[mail.id].length > 1 ? "members" : "member"}
                                        </>
                                      )}
                                      <img
                                        src={dropDown}
                                        width="10%"
                                        onClick={() => showList(mail.id)}
                                        style={{ cursor: "pointer" }}
                                      />
                                    </p>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md={4} className="share-button-div">
                                <Button
                                  type="submit"
                                  className="send-done show-share"
                                  style={{ marginTop: "0" }}
                                  onClick={() => handleGroupShare(mail.id)}
                                >
                                  share
                                </Button>
                              </Col>
                            </Row>
                            {selectedMailId === mail.id && list && (
                              <Row className="list-display">
                                <Col md={12}>
                                  <ul>
                                    {groupEmails[selectedMailId].map((email, index) => (
                                      // >{email}</li>
                                      <li key={index} className="email-content">
                                        <div>{email}</div>
                                        <button
                                          className="cross-icon"
                                          onClick={() => handleEmailGroup(selectedMailId, email)}
                                        >
                                          &times;
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </Col>
                                <Col>
                                  <p
                                    style={{
                                      color: "#962129",
                                      fontWeight: "600",
                                      paddingLeft: "2px",
                                    }}
                                    onClick={() => handleAddMemberClick(mail.group_name)}
                                  >
                                    {" "}
                                    + Add Member
                                  </p>
                                </Col>
                              </Row>
                            )}
                          </Row>
                        </li>
                      ))}
                      {/* </form> */}
                    </ul>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </Modal>
  );
}

export default EmailInputContainer;
