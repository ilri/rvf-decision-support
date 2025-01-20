import React from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  // CardTitle,
  Row,
  Col,
} from "reactstrap";

function CardList({ cardList, handlecCardPreview }) {
  // const [selectedCard, setSelectedCard] = useState(null);
  // const handlePreview = (id) => {
  //   const card = cardList.find((card) => card.id === id);
  //   if (card) {
  //     window.open(card.pdf_file);
  //   }
  // };

  const handlePreview = (id) => {
    handlecCardPreview(id);
  };
  return (
    <Row className="justify-content-start">
      {cardList &&
        cardList.length > 0 &&
        cardList.map((card) => (
          <Col key={card.title} md={3} className="card-div1">
            <Card className="card-data" onClick={() => handlePreview(card.id)}>
              {/* onClick={() => handleCardClick(card.title)}> */}
              <CardImg top src={card.image_file} alt={card.id} className="card-list-image" />
              <CardBody>
                {/* <CardTitle className="card-list-title">{card.title}</CardTitle> */}
                <CardText className="card-list-date">Published on: {card.published_date}</CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
    </Row>
  );
}

export default CardList;
