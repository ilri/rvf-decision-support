import React from "react";
import { Col, Row } from "reactstrap";
import Health from "../../../assests/Images/OHRECA.png";
import { generateTimestamp } from "../../../helpers";

function Header({ location }) {
  const timestamp = generateTimestamp();
  return (
    <div>
      <Row className="header-block">
        {/* <Col md={1}></Col> */}
        <Col md={3} className="col-border">
          <img src={Health} alt="logo" className="brand-logo" />
        </Col>
        {/* <Col md={1}>
          <div className="vertical-divider"></div>
        </Col> */}
        <Col md={8}>
          <h1 className="heading-text">Online News Bulletin for RVF Epidemics</h1>
          <Row className="para">
            <Col md={4} className="col-border1">
              <p>{timestamp}</p>
            </Col>
            {/* <Col md={1}>
              <div className="vertical-divider"></div>
            </Col> */}
            <Col md={6}>
              <p className="location">Location: {location}</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Header;
