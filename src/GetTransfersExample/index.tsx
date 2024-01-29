import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import {
  ExistingDestination,
  Transfer,
  useGetDestinationsForRecipient,
  useGetTransfers,
} from "@prequel/react";

import fetchToken, { fetchTokenRecipient } from "../fetchToken";
import { PREQUEL_HOST, REACT_ORIGIN } from "../host";
import { Dropdown } from "react-bootstrap";

const GetTransfersExample = () => {
  const [destinations, setDestinations] = useState<ExistingDestination[]>();
  const [currentDestination, setCurrentDestination] =
    useState<ExistingDestination>();
  const [transfers, setTransfers] = useState<Transfer[]>();
  const getTransfers = useGetTransfers(fetchToken, REACT_ORIGIN, PREQUEL_HOST);
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

  useEffect(() => {
    if (destinations?.length) {
      setTransfers(undefined);
      setCurrentDestination(destinations[0]);
    }
  }, [destinations]);

  useEffect(() => {
    if (currentDestination && !transfers) {
      const fetchTransfers = async () => {
        const transfersResponse = await getTransfers(currentDestination);
        setTransfers(transfersResponse.data?.transfers);
      };

      fetchTransfers();
    }
  }, [getTransfers, currentDestination, transfers]);

  return (
    <div>
      <div className="mb-5">
        {destinations && (
          <Dropdown>
            <Dropdown.Toggle variant="tertiary" id="dropdown-basic">
              Select a destination
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {destinations.map((d) => (
                <Dropdown.Item
                  key={d.id}
                  onClick={() => {
                    setCurrentDestination(d);
                    setTransfers(undefined);
                  }}
                  style={
                    currentDestination?.id === d.id
                      ? { backgroundColor: "lightgray" }
                      : {}
                  }
                >
                  {`${d.name} (${d.id})`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      {currentDestination && (
        <div className="mb-5">
          <div>
            <p className="font-weight-bold">{`Transfers for Destination: ${currentDestination?.name} (${currentDestination?.id})`}</p>
          </div>
          <Table bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Log</th>
                <th>Body</th>
              </tr>
            </thead>
            <tbody>
              {transfers ? (
                <>
                  {transfers.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.status}</td>
                      <td>{t.log}</td>
                      <td>{JSON.stringify(t)}</td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={4}>No transfers available.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default GetTransfersExample;
