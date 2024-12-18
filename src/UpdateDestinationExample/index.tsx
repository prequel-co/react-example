import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  ExistingDestination,
  prepareDestinationFromExisting,
  prepareDestinationWithForm,
  useDestination,
  useDestinationForm,
  useGetDestinations,
  useUpdateDestination,
} from "@prequel/react";

import fetchToken from "../fetchToken";
import { PREQUEL_HOST, REACT_ORIGIN } from "../host";
import { Button, Card, Dropdown, Form, Spinner } from "react-bootstrap";
import TextExistingConnection from "./TestExistingConnection";
import ProductsAndModels from "../ProductsAndModels";

const UpdateDestinationExample = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [destination, setDestination] = useDestination();
  const destinationForm = useDestinationForm(
    destination,
    process.env.REACT_APP_PREQUEL_ORG_ID ?? "",
    {
      includeInternalFields: false,
      host: PREQUEL_HOST,
    }
  );
  const [destinations, setDestinations] = useState<ExistingDestination[]>();
  const [destinationPopulated, setDestinationPopulated] = useState(false);
  const [currentDestination, setCurrentDestination] =
    useState<ExistingDestination>();
  const getDestinations = useGetDestinations(
    fetchToken,
    REACT_ORIGIN,
    PREQUEL_HOST
  );
  const updateDestination = useUpdateDestination(
    fetchToken,
    REACT_ORIGIN,
    PREQUEL_HOST
  );
  const recipientId = process.env.REACT_APP_RECIPIENT_ID ?? "";

  useEffect(() => {
    if (recipientId && !destinations) {
      const fetchDestinations = async () => {
        const destinations = await getDestinations();
        setDestinations(destinations);
      };

      fetchDestinations();
    }
  }, [getDestinations, destinations, recipientId]);

  useEffect(() => {
    if (destinations?.length) {
      setCurrentDestination(destinations[0]);
    }
  }, [destinations]);

  useEffect(() => {
    if (currentDestination && !destinationPopulated) {
      const converted = prepareDestinationFromExisting(currentDestination);
      setDestination(converted);
      setDestinationPopulated(true);
    }
  }, [setDestination, currentDestination, destinationPopulated]);

  const preparedDestination = useMemo(
    () => prepareDestinationWithForm(destination, destinationForm),
    [destination, destinationForm]
  );

  const validateForm = () =>
    formRef.current ? formRef.current.reportValidity() : false;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentDestination) {
      const response = await updateDestination(
        currentDestination,
        preparedDestination
      );
      if (response.status === "success") {
        const name = response.data?.destination.name ?? "";
        alert(`Destination '${name}' updated successfully.`);
      } else {
        alert(`Destination update failed: ${response.message}`);
      }
    }
  }

  if (!destinationForm) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

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
                  onClick={() => setCurrentDestination(d)}
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
      <Form ref={formRef} className="d-flex flex-column" onSubmit={onSubmit}>
        {destinationForm.map((section) => (
          <Fragment key={section.id}>
            <Form.Group className="">
              <div>
                <div>
                  <Form.Label>{section.title}</Form.Label>
                </div>
                {section.subtitle ? (
                  <Form.Text>{section.subtitle}</Form.Text>
                ) : (
                  <br />
                )}
              </div>
              {section.fields.map((field) => {
                if (field.const) {
                  return (
                    <div key={field.name} className="mb-3">
                      <Form.Label className="d-flex">{field.label}</Form.Label>
                      {typeof field.const === "object" ? (
                        <Card className="m-3 bg-light border border-dark">
                          <Card.Body>
                            <pre
                              style={{ textAlign: "left", marginBottom: "0px" }}
                            >
                              <code>
                                {JSON.stringify(field.const, null, 2)}
                              </code>
                            </pre>
                          </Card.Body>
                        </Card>
                      ) : (
                        <Card
                          style={{
                            maxWidth: "100%",
                            wordBreak: "break-all",
                            whiteSpace: "pre-wrap",
                          }}
                          className="p-3 text-monospace bg-light border border-dark rounded p-3 break-all"
                        >
                          {field.const}
                        </Card>
                      )}
                    </div>
                  );
                } else if (field.form_element === "select") {
                  const items = field.enum?.map(({ key, display }) => ({
                    key: key.toString(),
                    display,
                  }));
                  const selected = items?.find(
                    ({ key }) => key.toString() === destination[field.name]
                  );
                  return (
                    <div key={field.name} className="mb-3">
                      <Form.Label className="d-flex">{field.label}</Form.Label>
                      <Form.Select
                        value={selected?.key || ""}
                        onChange={({ target }) =>
                          setDestination({ [field.name]: target.value })
                        }
                        required={field.required}
                      >
                        {items &&
                          items.map((item) => (
                            <option key={item.key} value={item.key}>
                              {item.display}
                            </option>
                          ))}
                      </Form.Select>
                      {field.description && (
                        <Form.Text className="text-muted d-flex">
                          {field.description}
                        </Form.Text>
                      )}
                    </div>
                  );
                } else if (field.form_element === "input") {
                  return (
                    <div key={field.name} className="mb-3">
                      <Form.Label className="d-flex">{field.label}</Form.Label>
                      <Form.Control
                        type={field.input_type ?? "text"}
                        placeholder={field.placeholder}
                        value={destination[field.name]?.toString() ?? ""}
                        onChange={({ target }) =>
                          setDestination({ [field.name]: target.value })
                        }
                        required={
                          field.name === "password" ? false : field.required
                        }
                      />
                      {field.description && (
                        <Form.Text className="text-muted d-flex text-start">
                          {field.description}
                        </Form.Text>
                      )}
                    </div>
                  );
                } else if (field.form_element === "textarea") {
                  return (
                    <div key={field.name} className="mb-3">
                      <Form.Label className="d-flex">{field.label}</Form.Label>
                      <Form.Control
                        type="textarea"
                        placeholder={field.placeholder}
                        value={destination[field.name]?.toString()}
                        onChange={({ target }) =>
                          setDestination({ [field.name]: target.value })
                        }
                        required={
                          field.name === "service_account_key"
                            ? false
                            : field.required
                        }
                      />
                      {field.description && (
                        <Form.Text className="text-muted d-flex">
                          {field.description}
                        </Form.Text>
                      )}
                    </div>
                  );
                } else if (field.form_element === "radio") {
                  if (field.type === "boolean") {
                    return (
                      <div key={field.name} className="mb-3">
                        <Form.Switch
                          id={field.name}
                          inline={true}
                          label={field.label}
                          checked={!!destination[field.name]}
                          onChange={({ target }) =>
                            setDestination({ [field.name]: target.checked })
                          }
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={field.name} className="mb-3">
                      <Form.Label className="d-flex">{field.label}</Form.Label>
                      <div className="d-flex justify-content-around">
                        {field.enum.map(({ key, display }) => (
                          <Form.Check
                            id={key.toString()}
                            name={field.name}
                            required={field.required}
                            type="radio"
                            key={key.toString()}
                            value={key.toString()}
                            label={display}
                            checked={destination[field.name] === key}
                            onChange={({ target }) =>
                              setDestination({ [field.name]: target.value })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  return <div key={field.name}></div>;
                }
              })}
            </Form.Group>
            <hr />
          </Fragment>
        ))}
        <ProductsAndModels
          destination={destination}
          setDestination={setDestination}
        />
        <hr />
        {currentDestination && (
          <TextExistingConnection
            destination={currentDestination}
            preparedDestination={preparedDestination}
            validateForm={validateForm}
          />
        )}
        <hr />
        <Button type="submit">Submit form</Button>
      </Form>
    </div>
  );
};

export default UpdateDestinationExample;
