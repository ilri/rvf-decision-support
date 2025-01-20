import React from "react";
import { Button, Col, Row } from "reactstrap";
// import ILRI from "../../assests/Images/logoIlri.svg";

function AboutUs() {
  return (
    <div className="description1">
      <Row>
        <Col md={12}>
          <h2>About us</h2>
          <p className="text-div">
            The International Livestock Research Institute (ILRI) works for better lives through
            livestock in developing countries. ILRI is co-hosted by Kenya and Ethiopia, has 14
            offices across Asia and Africa, employs some 700 staff and has an annual operating
            budget of about USD 80 million. ILRI is a CGIAR research centre, a global research
            partnership for a food-secure future. CGIAR science is dedicated to reducing poverty,
            enhancing food and nutrition security, and improving natural resources and ecosystem
            services. Its research is carried out by 15 CGIAR centres in close collaboration with
            hundreds of partners, including national and regional research institutes, civil society
            organizations, academia, development organizations and the private sector.
          </p>
          <Button className="view-button">View More</Button>
        </Col>
        {/* <Col md={6}>
          <img src={ILRI} alt="tool" className="img-fluid" />
        </Col> */}
      </Row>
    </div>
  );
}

export default AboutUs;
