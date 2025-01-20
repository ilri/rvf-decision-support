import React from "react";
import { Button, Col, Modal, ModalBody, Row } from "reactstrap";
import Success from "../../../assests/Images/success.png";

function Response({ isOpenModel, toggleModal, sendResponse }) {
  const handlePopup = () => {
    toggleModal();
  };
  return (
    <Modal isOpen={isOpenModel} toggle={toggleModal} className="success-popup">
      <ModalBody>
        <Row className="flex-column align-items-center">
          <Col>
            <img src={Success} alt="sucess" />
          </Col>
          <Col>{sendResponse ? "" : <h4>Congratulations</h4>}</Col>
          <Col>
            <h6>
              {sendResponse
                ? sendResponse?.data?.result
                : `The online news bulletin is successfully published`}
            </h6>
          </Col>
          <Col>
            <Button
              className="modal-button"
              style={{ padding: "0 !mportant" }}
              onClick={handlePopup}
            >
              Okay
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
}

export default Response;
