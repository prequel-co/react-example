import React, { useState } from "react";
import {
  Destination,
  prepareDestination,
  useTestConnection,
} from "@prequel/react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

import fetchToken from "./fetchToken";

type TestConnectionProps = {
  destination: Destination;
  validateForm: () => boolean;
};
const TestConnection = ({ destination, validateForm }: TestConnectionProps) => {
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const testConnection = useTestConnection(fetchToken, "localhost:9999");

  async function testDestinationConnection() {
    validateForm();
    setTestRunning(true);
    setTestResult("Testing new connection...");
    const preparedDestination = prepareDestination(destination);
    const { data, message } = await testConnection(preparedDestination);
    if (data) {
      setTestResult("Connection test successful.");
    } else {
      setTestResult(message);
    }
    setTestRunning(false);
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title className="d-flex">Test Connection</Card.Title>
        <Card.Text className="d-flex">
          Test destination connection status before submitting.
        </Card.Text>
        {testResult && <Card.Text className="d-flex">{testResult}</Card.Text>}
        {}
        <div className="d-flex justify-content-end">
          <Button
            variant="success"
            className="d-flex align-items-center"
            onClick={testDestinationConnection}
          >
            Test Connection
            {testRunning && (
              <Spinner size="sm" animation="border" role="status" />
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TestConnection;
