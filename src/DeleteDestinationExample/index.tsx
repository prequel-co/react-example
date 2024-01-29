import React, { useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import {
  ExistingDestination,
  useDeleteDestination,
  useGetDestinationsForRecipient,
} from "@prequel/react";

import fetchToken, { fetchTokenRecipient } from "../fetchToken";
import { PREQUEL_HOST, REACT_ORIGIN } from "../host";

const DeleteDestinationExample = () => {
  const [destinations, setDestinations] = useState<ExistingDestination[]>();
  const getDestinations = useGetDestinationsForRecipient(
    fetchTokenRecipient,
    REACT_ORIGIN,
    PREQUEL_HOST
  );
  const deleteDestination = useDeleteDestination(
    fetchToken,
    REACT_ORIGIN,
    PREQUEL_HOST
  );
  const recipientId = process.env.REACT_APP_RECIPIENT_ID ?? "";

  async function onDelete(d: ExistingDestination) {
    const response = await deleteDestination(d);
    if (response.status === "success") {
      alert(`Destination deleted successfully.`);
    } else {
      alert(`Destination delete failed: ${response.message}`);
    }
  }

  useEffect(() => {
    if (recipientId && !destinations) {
      const fetchDestinations = async () => {
        const destinationsResponse = await getDestinations(recipientId);
        setDestinations(destinationsResponse.data?.destinations);
      };

      fetchDestinations();
    }
  }, [getDestinations, destinations, recipientId]);

  return (
    <div className="mb-5">
      <ListGroup>
        {destinations && destinations.length ? (
          destinations.map((destination) => (
            <ListGroup.Item
              key={destination.id}
              className="d-flex justify-content-between align-items-center"
            >
              {destination.name} ({destination.id})
              <Button variant="danger" onClick={() => onDelete(destination)}>
                Delete
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <div>No destinations available.</div>
        )}
      </ListGroup>
    </div>
  );
};

export default DeleteDestinationExample;
