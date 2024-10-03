import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import {
  ExistingDestination,
  PaginationCursor,
  Transfer,
  useGetDestinations,
  useListTransfers,
} from "@prequel/react";

import fetchToken from "../fetchToken";
import { PREQUEL_HOST, REACT_ORIGIN } from "../host";
import { Button, Col, Dropdown, Row } from "react-bootstrap";

const ListTransfersExample = () => {
  const [destinations, setDestinations] = useState<ExistingDestination[]>();
  const [currentDestination, setCurrentDestination] =
    useState<ExistingDestination>();
  const [transfers, setTransfers] = useState<Transfer[]>();
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [cursors, setCursors] = useState<PaginationCursor[]>([]);

  const listTransfers = useListTransfers(
    fetchToken,
    REACT_ORIGIN,
    PREQUEL_HOST
  );
  const getDestinations = useGetDestinations(
    fetchToken,
    REACT_ORIGIN,
    PREQUEL_HOST
  );

  useEffect(() => {
    if (!destinations) {
      const fetchDestinations = async () => {
        const destinations = await getDestinations();
        setDestinations(destinations);
        setCurrentDestination(destinations[0]);
      };

      fetchDestinations();
    }
  }, [getDestinations, destinations]);

  useEffect(() => {
    fetchNextTransfers();
  }, [pageIndex, currentDestination]); // eslint-disable-line

  const resetState = (destination: ExistingDestination) => {
    setCurrentDestination(destination);
    setTransfers(undefined);
    setPageIndex(0);
    setCursors([]);
    setHasNextPage(true);
  };

  const fetchNextTransfers = async () => {
    if (currentDestination) {
      const currentCursor = pageIndex > 0 ? cursors[pageIndex - 1] : undefined;
      const { results, hasNext, cursor } = await listTransfers(
        currentDestination,
        {
          pageSize: 5,
          cursor: currentCursor,
        }
      );

      setHasNextPage(hasNext);
      setTransfers(results);
      if (cursor && pageIndex >= cursors.length) {
        setCursors([...cursors, cursor]);
      }
    }
  };

  const goForward = () => {
    if (hasNextPage) {
      setPageIndex((p) => p + 1);
    }
  };

  const goBack = () => {
    if (pageIndex > 0) {
      setPageIndex((p) => p - 1);
    }
  };

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
                  onClick={() => resetState(d)}
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
      <div className="mb-5">
        <div>
          <p className="font-weight-bold">{`Transfers for Destination: ${currentDestination?.name} (${currentDestination?.id})`}</p>
        </div>
      </div>
      <div className="table-responsive">
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
            {transfers && transfers.length ? (
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
      <Row className="justify-content-between">
        <Col xs="auto">
          <Button
            variant="secondary"
            onClick={goBack}
            disabled={pageIndex === 0}
          >
            Back
          </Button>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={goForward} disabled={!hasNextPage}>
            Next
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ListTransfersExample;
