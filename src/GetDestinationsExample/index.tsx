import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import {
  ExistingDestination,
  useGetDestinationsForRecipient,
} from "@prequel/react";

import { fetchTokenRecipient } from "../fetchToken";
import { PREQUEL_HOST, REACT_ORIGIN } from "../host";

const GetDestinationsExample = () => {
  const [destinations, setDestinations] = useState<ExistingDestination[]>();
  const getDestinations = useGetDestinationsForRecipient(
    fetchTokenRecipient,
    REACT_ORIGIN,
    PREQUEL_HOST
  );
  const recipientId = process.env.REACT_APP_RECIPIENT_ID ?? "";

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
      <Table bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Vendor</th>
          </tr>
        </thead>
        <tbody>
          {destinations?.length ? (
            <>
              {destinations.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.vendor}</td>
                </tr>
              ))}
            </>
          ) : (
            <tr>
              <td colSpan={4}>No destinations available.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default GetDestinationsExample;
