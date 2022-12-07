import React, { useEffect, useState } from "react";
import {
  useTestConnection,
  useCreateDestination,
  useModelConfigs,
  useProductConfigs,
  prepareDestination,
  Destination,
  PreparedDestination,
  DestinationVendor,
  VendorField,
  ProductConfig,
  ModelConfig,
  LOCALHOST_8080,
} from "@prequel/react";

import Dropdown from "./Dropdown";

const fetchToken = (d: PreparedDestination | undefined) => {
  // fetch auth token via API here
  return new Promise<string>((resolve) => resolve("API KEY"));
};

type DestinationFormProps = {
  vendor: DestinationVendor;
  orgId: string;
};
const DestinationForm = ({ vendor, orgId }: DestinationFormProps) => {
  const testConnection = useTestConnection(
    fetchToken,
    "http://localhost:3000",
    LOCALHOST_8080
  );
  const createDestination = useCreateDestination(
    fetchToken,
    "http://localhost:3000",
    LOCALHOST_8080
  );
  const { model_configs } = useModelConfigs(
    fetchToken,
    "http://localhost:3000",
    LOCALHOST_8080
  );

  const { product_configs } = useProductConfigs(
    fetchToken,
    "http://localhost:3000",
    LOCALHOST_8080
  );

  const [status, setStatus] = useState("Test required");
  const [connectionValid, setConnectionValid] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<ProductConfig[]>();
  const [selectedProduct, setSelectedProduct] = useState<ProductConfig>();
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [destination, setDestination] = useState<Destination>({
    name: "",
    schema: "",
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
    vendor: vendor.vendor_name,
    id_in_provider_system: orgId,
    bucket_name: "",
    bucket_region: "",
    bucket_access_id: "",
    bucket_secret_key: "",
    enabled_models: [],
    product: "",
    use_ssh_tunnel: false,
    ssh_tunnel_host: "",
    ssh_tunnel_port: "",
    ssh_tunnel_username: "",
    frequency_minutes: "",
    bucket_vendor: "",
  });

  const required = vendor.fields
    .filter((f: VendorField) => f.required)
    .map((f: VendorField) => f.name);

  const hasField = (field: string) =>
    vendor.fields.find((f: VendorField) => f.name === field);

  const setDestinationField = (
    key: keyof Destination,
    value: string | string[] | boolean | number
  ) => {
    setDestination((oldDestination: Destination) => ({
      ...oldDestination,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (product_configs) {
      setAvailableProducts(product_configs);
      setSelectedProduct(product_configs[0]);
    }
  }, [product_configs]);

  useEffect(() => {
    if (model_configs) {
      setAvailableModels(
        model_configs.map((c: ModelConfig) => c.model_name) ?? []
      );
    }
  }, [model_configs]);

  useEffect(() => {
    if (selectedProduct) {
      setDestinationField("product", selectedProduct.product_name);
      setAvailableModels(selectedProduct.models);
    }
  }, [selectedProduct]);

  useEffect(() => {
    setSelectedModels(availableModels);
  }, [availableModels]);

  useEffect(() => {
    setDestinationField("vendor", vendor.vendor_name);
  }, [vendor]);

  const updatedSelectedModels = (isSelected: boolean, modelName: string) => {
    let newModels: string[] = [];
    if (isSelected) {
      newModels = [...selectedModels, modelName];
    } else {
      newModels = selectedModels.filter((m) => m !== modelName);
    }

    setSelectedModels(newModels);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchTestConnection();
  };

  async function fetchTestConnection() {
    setStatus("Pending");
    const prepared: PreparedDestination = prepareDestination(destination);
    const response = await testConnection(prepared);
    if (response.data === "success") {
      setStatus("Connection successful");
      setConnectionValid(true);
    } else {
      setStatus(response.message);
      setConnectionValid(false);
    }
  }

  async function saveDestination() {
    const prepared: PreparedDestination = prepareDestination(destination);
    if (connectionValid) {
      const allModelsEnabled = availableModels.length === selectedModels.length;
      if (allModelsEnabled) {
        prepared.enabled_models = ["*"];
      } else {
        prepared.enabled_models = selectedModels;
      }
      const response = await createDestination(prepared);
      alert(response.status);
    }
  }

  return (
    <div className="destination-form">
      <form onSubmit={onSubmit}>
        <label htmlFor="vendor">Destination Type: {vendor.display_name}</label>
        {hasField("name") && (
          <>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={destination.name}
              onChange={(event) =>
                setDestinationField("name", event.target.value)
              }
              required={required.includes("name")}
            />
          </>
        )}
        {hasField("host") && (
          <>
            <label htmlFor="host">Host</label>
            <input
              type="text"
              id="host"
              name="host"
              value={destination.host}
              onChange={(event) =>
                setDestinationField("host", event.target.value)
              }
              required={required.includes("host")}
            />
          </>
        )}
        {hasField("port") && (
          <>
            <label htmlFor="port">Port</label>
            <input
              type="number"
              id="port"
              name="port"
              value={destination.port}
              onChange={(event) =>
                setDestinationField("port", event.target.value)
              }
              required={required.includes("port")}
            />
          </>
        )}
        {hasField("database") && (
          <>
            <label htmlFor="database">Database</label>
            <input
              type="text"
              id="database"
              name="database"
              value={destination.database}
              onChange={(event) =>
                setDestinationField("database", event.target.value)
              }
              required={required.includes("database")}
            />
          </>
        )}
        {hasField("schema") && (
          <>
            <label htmlFor="schema">Schema</label>
            <input
              type="text"
              id="schema"
              name="schema"
              value={destination.schema}
              onChange={(event) =>
                setDestinationField("schema", event.target.value)
              }
              required={required.includes("schema")}
            />
          </>
        )}
        {hasField("username") && (
          <>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={destination.username}
              onChange={(event) =>
                setDestinationField("username", event.target.value)
              }
              required={required.includes("username")}
            />
          </>
        )}
        {hasField("password") && (
          <>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={destination.password}
              onChange={(event) =>
                setDestinationField("password", event.target.value)
              }
              required={required.includes("password")}
            />
          </>
        )}
        {hasField("frequency_minutes") && (
          <>
            <label htmlFor="frequency_minutes">{"Sync Frequency (min)"}</label>
            <input
              type="number"
              id="frequency_minutes"
              name="frequency_minutes"
              value={destination.frequency_minutes}
              onChange={(event) =>
                setDestinationField("frequency_minutes", event.target.value)
              }
              required={required.includes("frequency_minutes")}
            />
          </>
        )}
        {hasField("bucket_region") && (
          <>
            <label htmlFor="bucket_region">Bucket Region</label>
            <input
              type="text"
              id="bucket_region"
              name="bucket_region"
              value={destination.bucket_region}
              onChange={(event) =>
                setDestinationField("bucket_region", event.target.value)
              }
              required={required.includes("bucket_region")}
            />
          </>
        )}
        {hasField("bucket_access_id") && (
          <>
            <label htmlFor="bucket_access_id">Bucket Access ID</label>
            <input
              type="text"
              id="bucket_access_id"
              name="bucket_access_id"
              value={destination.bucket_access_id}
              onChange={(event) =>
                setDestinationField("bucket_access_id", event.target.value)
              }
              required={required.includes("bucket_access_id")}
            />
          </>
        )}
        {hasField("bucket_name") && (
          <>
            <label htmlFor="bucket_name">Bucket Name</label>
            <input
              type="text"
              id="bucket_name"
              name="bucket_name"
              value={destination.bucket_name}
              onChange={(event) =>
                setDestinationField("bucket_name", event.target.value)
              }
              required={required.includes("bucket_name")}
            />
          </>
        )}
        {hasField("bucket_secret_key") && (
          <>
            <label htmlFor="bucket_secret_key">Bucket Secret Key</label>
            <input
              type="text"
              id="bucket_secret_key"
              name="bucket_secret_key"
              value={destination.bucket_secret_key}
              onChange={(event) =>
                setDestinationField("bucket_secret_key", event.target.value)
              }
              required={required.includes("bucket_secret_key")}
            />
          </>
        )}
        {hasField("service_account_key") && (
          <>
            <label htmlFor="service_account_key">Service Account Key</label>
            <input
              type="text"
              id="service_account_key"
              name="service_account_key"
              value={destination.service_account_key}
              onChange={(event) =>
                setDestinationField("service_account_key", event.target.value)
              }
              required={required.includes("service_account_key")}
            />
          </>
        )}
        {hasField("bucket_vendor") && (
          <>
            <label htmlFor="bucket_vendor">Bucket Vendor</label>
            <input
              type="text"
              id="bucket_vendor"
              name="bucket_vendor"
              value={destination.bucket_vendor}
              onChange={(event) =>
                setDestinationField("bucket_vendor", event.target.value)
              }
              required={required.includes("bucket_vendor")}
            />
          </>
        )}
        {hasField("use_ssh_tunnel") && (
          <>
            <label htmlFor="use_ssh_tunnel">Use SSH Tunnel</label>
            <input
              type="checkbox"
              id="use_ssh_tunnel"
              name="use_ssh_tunnel"
              checked={destination.use_ssh_tunnel}
              onChange={() =>
                setDestinationField(
                  "use_ssh_tunnel",
                  !destination.use_ssh_tunnel
                )
              }
              required={required.includes("use_ssh_tunnel")}
            />
          </>
        )}
        {destination.use_ssh_tunnel && hasField("ssh_tunnel_host") && (
          <>
            <label htmlFor="ssh_tunnel_host">SSH Tunnel Host</label>
            <input
              type="text"
              id="ssh_tunnel_host"
              name="ssh_tunnel_host"
              value={destination.ssh_tunnel_host}
              onChange={(event) =>
                setDestinationField("ssh_tunnel_host", event.target.value)
              }
              required={required.includes("ssh_tunnel_host")}
            />
          </>
        )}
        {destination.use_ssh_tunnel && hasField("ssh_tunnel_username") && (
          <>
            <label htmlFor="ssh_tunnel_username">SSH Tunnel Username</label>
            <input
              type="text"
              id="ssh_tunnel_username"
              name="ssh_tunnel_username"
              value={destination.ssh_tunnel_username}
              onChange={(event) =>
                setDestinationField("ssh_tunnel_username", event.target.value)
              }
              required={required.includes("ssh_tunnel_username")}
            />
          </>
        )}
        {destination.use_ssh_tunnel && hasField("ssh_tunnel_port") && (
          <>
            <label htmlFor="ssh_tunnel_port">SSH Tunnel Port</label>
            <input
              type="text"
              id="ssh_tunnel_port"
              name="ssh_tunnel_port"
              value={destination.ssh_tunnel_port}
              onChange={(event) =>
                setDestinationField("ssh_tunnel_port", event.target.value)
              }
              required={required.includes("ssh_tunnel_port")}
            />
          </>
        )}
        <br />
        {availableProducts && (
          <Dropdown
            label="Select a product:"
            options={availableProducts.map((p) => ({
              value: p.product_name,
              display: p.product_name,
            }))}
            selected={selectedProduct ? selectedProduct.product_name : ""}
            setSelected={(p) =>
              setSelectedProduct(
                availableProducts.find(({ product_name }) => product_name === p)
              )
            }
          />
        )}
        <br />
        {availableModels &&
          availableModels.map((modelName) => (
            <div key={modelName}>
              <label htmlFor={modelName}>{modelName}</label>
              <input
                type="checkbox"
                id={modelName}
                checked={!!selectedModels?.find((s) => s === modelName)}
                onChange={() =>
                  updatedSelectedModels(
                    !selectedModels?.find((s) => s === modelName),
                    modelName
                  )
                }
              />
            </div>
          ))}
        <br />
        <button type="submit">Test Connection</button>
        <div>Connection Status: {status}</div>
      </form>
      <br />
      <br />
      <button
        type="button"
        onClick={saveDestination}
        disabled={!connectionValid}
      >
        Save Destination
      </button>
    </div>
  );
};

export default DestinationForm;
