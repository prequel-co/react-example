import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import CreateDestinationExample from "./CreateDestinationExample";
import GetTransfersExample from "./GetTransfersExample";
import GetDestinationsExample from "./GetDestinationsExample";
import UpdateDestinationExample from "./UpdateDestinationExample";
import DeleteDestinationExample from "./DeleteDestinationExample";
import SupportedDestinationsExample from "./SupportedDestinationsExample";

import "./App.css";

function App() {
  return (
    <div className="App w-75 mx-auto">
      <Tabs defaultActiveKey="create_destination">
        <Tab eventKey="create_destination" title="Create Destination">
          <div className="p-5">
            <CreateDestinationExample />
          </div>
        </Tab>
        <Tab eventKey="get_destinations" title="Get Destinations">
          <div className="p-5">
            <GetDestinationsExample />
          </div>
        </Tab>
        <Tab eventKey="get_transfers" title="Get Transfers">
          <div className="p-5">
            <GetTransfersExample />
          </div>
        </Tab>
        <Tab eventKey="update_destination" title="Update Destination">
          <div className="p-5">
            <UpdateDestinationExample />
          </div>
        </Tab>
        <Tab eventKey="delete_destination" title="Delete Destination">
          <div className="p-5">
            <DeleteDestinationExample />
          </div>
        </Tab>
        <Tab eventKey="supported_destinations" title="Supported Destinations">
          <div className="p-5">
            <SupportedDestinationsExample />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
