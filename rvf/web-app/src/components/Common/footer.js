import React from "react";
import { Row, Col } from "reactstrap";
import { logoList, partnerList } from "../../Constants";
import { useLocation } from "react-router-dom";
import Email from "../../assests/Images/email.svg";

function Footer() {
  const location = useLocation();
  const isCreateBulletinPath = location.pathname == "/create-news-bulletin";
  const footerClassName = isCreateBulletinPath ? "rounded-footer" : "";
  const footerClassName1 = isCreateBulletinPath ? "rounded-footer1" : "";
  return (
    <footer className={`text-light custom-navbar-footer ${footerClassName}`}>
      <div className="footer-div">
        <Row className="justify-content-between">
          <Col md={5} className="footer-text">
            <Row>
              <h4>
                Decision support tool for prevention &
                <br />
                control of RVF epizootic
              </h4>
            </Row>
            {isCreateBulletinPath ? (
              <Row>
                {/* <Col md={1}></Col> */}
                <Col md={10}>
                  <img src={Email} alt="email" />
                  &nbsp; For further information please contact :
                  <a
                    href="mailto:B.BETT@cgiar.org"
                    style={{ textDecoration: "underline", color: "white" }}
                  >
                    B.BETT@cgiar.org
                  </a>
                </Col>
              </Row>
            ) : null}
            <Row className="follow-row">
              <Col md={2} className="icon-text">
                <p>Follow Us</p>
              </Col>
              <Col md={4} className="social-icon">
                {logoList.map((logo) => (
                  <div key={logo}>
                    <a href={logo.link} target="_blank" rel="noopener noreferrer">
                      <img src={logo.src} alt={logo.alt} className="mr-5" />
                    </a>
                  </div>
                ))}
              </Col>
            </Row>
          </Col>
          <Col md={6} className="social-icon">
            {partnerList.map((logo) => (
              <div key={logo} className="logo-div">
                <img src={logo.src} alt={logo.alt} className="partner-list" />
              </div>
            ))}
            {/* <ul className="list-unstyled">
              <li>About Us</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul> */}
          </Col>
        </Row>
      </div>
      <Row className={`copy-right ${footerClassName1}`}>
        <p className="text-center mt-1 mb-1">
          &copy; Decision support tool for prevention & control of RVF epizootic All Rights
          Reserved.
        </p>
      </Row>
    </footer>
  );
}

export default Footer;
