import React from "react";
import { useDestinationVendors } from "@prequel/react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";

import { PREQUEL_HOST } from "../host";

const SupportedDestinationsExample = () => {
  const supportedDestinations = useDestinationVendors(PREQUEL_HOST);

  if (!supportedDestinations) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container>
      <Row>
        {supportedDestinations.map(({ key, display, docs, icon_url }) => (
          <Col key={key.toString()} md={3} className="mb-4">
            <a href={docs} target="_blank" rel="noreferrer">
              <Card className="d-flex align-items-center pt-3">
                <Card.Img variant="top" className="w-25" src={icon_url} />
                <Card.Body>
                  <Card.Title>{display}</Card.Title>
                </Card.Body>
              </Card>
            </a>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SupportedDestinationsExample;
