import React, { useState, useEffect } from "react";
import {
  useDestinationVendors,
  DestinationVendor,
  LOCALHOST_8080,
} from "@prequel/react";

import DestinationForm from "./DestinationForm";
import Dropdown, { Option } from "./Dropdown";

import "./App.css";

function App() {
  const [vendorOptions, setVendorOptions] = useState<Option[]>([]);
  const [vendorsList, setVendorsList] = useState<DestinationVendor[]>();
  const [selectedVendor, setSelectedVendor] = useState<DestinationVendor>();
  const destinationVendorsResponse = useDestinationVendors(LOCALHOST_8080);

  useEffect(() => {
    if (destinationVendorsResponse?.destinations && !vendorsList) {
      setVendorsList(destinationVendorsResponse.destinations);
      setVendorOptions(
        destinationVendorsResponse.destinations.map((dest) => ({
          value: dest.vendor_name,
          display: dest.display_name,
        }))
      );
    }
  }, [destinationVendorsResponse, vendorsList]);

  useEffect(() => {
    if (vendorsList) {
      setSelectedVendor(vendorsList[0]);
    }
  }, [vendorsList]);

  return (
    <div className="App">
      <Dropdown
        label="Choose a vendor:"
        options={vendorOptions}
        selected={selectedVendor?.vendor_name ?? ""}
        setSelected={(vendor: string) => {
          const found = vendorsList?.find((v) => v.vendor_name === vendor);
          setSelectedVendor(found);
        }}
      />
      {selectedVendor && (
        <DestinationForm vendor={selectedVendor} orgId={"org_id_here"} />
      )}
    </div>
  );
}

export default App;
