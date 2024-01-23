import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import DestinationForm from "./DestinationFormExample";
import GetTransfersExample from "./GetTransfersExample";
import "./App.css";

function App() {
  return (
    <div className="App w-75 mx-auto">
      <Tabs defaultActiveKey="create_form">
        <Tab eventKey="create_form" title="Create Destination">
          <div className="p-5">
            <DestinationForm />
          </div>
        </Tab>
        <Tab eventKey="get_transfers" title="Get Transfers">
          <div className="p-5">
            <GetTransfersExample />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
