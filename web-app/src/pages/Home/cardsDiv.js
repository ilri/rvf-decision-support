import React from "react";
import { Card, CardImg, CardText, CardBody, CardTitle, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";

function CardComponent({ cardData }) {
  const navigate = useNavigate();
  const handleCardClick = (name, slug) => {
    const userData = localStorage?.getItem("userDetails");

    if (name === "Climate-epidemic interactions") {
      // Only call navigate once
      navigate(userData ? "/climate-epidemic" : "/login?path=/climate-epidemic");
    } else if (name === "Decision support") {
      navigate(userData ? "/decision-support" : "/login?path=/decision-support");
    } else if (slug === "rainfall") {
      navigate(userData ? "/rainfall" : "/login?path=/rainfall");
    } else if (name === "Online News Bulletin") {
      navigate(userData ? "/online-news-bulletin" : "/login?path=/online-news-bulletin");
    } else if (name === "RVF Modelling") {
      navigate(userData ? "/rvf-modelling" : "/login?path=/rvf-modelling");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="description">
      <Row>
        <Col>
          <p className="main-text">
            This tools allows to get the analytics of Climate-epidemic interactions and also
            decision support for prevention and control of Rift Valley fever epizootics in the
            Greater Horn of Africa.
          </p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {cardData &&
          cardData.length > 0 &&
          cardData.map((card) => (
            <Col key={card.slug} md={3} className="card-div">
              <Card
                className="card-data d-flex align-items-center"
                onClick={() => handleCardClick(card.name, card?.slug)}
              >
                <CardImg top src={card.icon} alt={card.name} className="card-image" />
                <CardBody className="d-flex flex-column justify-content-center align-items-center">
                  <CardTitle className="title">{card.name}</CardTitle>
                  <CardText>{card.description}</CardText>
                </CardBody>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
}

export default CardComponent;
