import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import CreateDestinationExample from "./CreateDestinationExample";
import ListDestinationsExample from "./ListDestinationsExample";
import GetDestinationsExample from "./ListDestinationsExample";
import UpdateDestinationExample from "./UpdateDestinationExample";
import DeleteDestinationExample from "./DeleteDestinationExample";
import SupportedDestinationsExample from "./SupportedDestinationsExample";
import ListTransfersExample from "./ListTransfersExample";
import ListProductsAndModelsExample from "./ListProductsAndModelsExample";

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
        <Tab eventKey="list_destinations" title="List Destinations">
          <div className="p-5">
            <ListDestinationsExample />
          </div>
        </Tab>
        <Tab eventKey="list_transfers" title="List Transfers">
          <div className="p-5">
            <ListTransfersExample />
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
        <Tab eventKey="list_products_and_models" title="List Products and Models">
          <div className="p-5">
            <ListProductsAndModelsExample />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
