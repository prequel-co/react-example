import React, { Fragment, useMemo, useCallback, useRef } from "react";
import {
  Destination,
  useCreateDestination,
  useDestination,
  useDestinationForm,
  prepareDestinationWithForm,
} from "@prequel/react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

import TestConnection from "../TestConnection";
import fetchToken from "../fetchToken";
import ProductsAndModels from "../ProductsAndModels";
import { PREQUEL_HOST, REACT_ORIGIN } from "../host";

const CreateDestinationExample = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [destination, setDestination] = useDestination({
    name: "New Snowflake Example Destination",
    recipient_id: process.env.REACT_APP_RECIPIENT_ID ?? "",
    products: ["all"],
    enabled_models: ["*"],
  });
  const destinationForm = useDestinationForm(
    destination,
    process.env.REACT_APP_PREQUEL_ORG_ID ?? "",
    false,
    PREQUEL_HOST
  );
  const createDestination = useCreateDestination(
    fetchToken,
    REACT_ORIGIN,
    PREQUEL_HOST
  );

  const setDestinationField = useCallback(
    (
      key: keyof Destination,
      value: string | string[] | boolean | undefined
    ) => {
      setDestination((currentDestination) => ({
        ...currentDestination,
        [key]: value,
      }));
    },
    [setDestination]
  );

  const preparedDestination = useMemo(
    () => prepareDestinationWithForm(destination, destinationForm),
    [destination, destinationForm]
  );

  const validateForm = () =>
    formRef.current ? formRef.current.reportValidity() : false;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await createDestination(preparedDestination);
    if (response.status === "success") {
      const name = response.data?.destination.name ?? "";
      alert(`Destination '${name}' created successfully.`);
    } else {
      alert(`Destination creation failed: ${response.message}`);
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
                            <code>{JSON.stringify(field.const, null, 2)}</code>
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
                const items = field.enum.map(({ key, display }) => ({
                  key: key.toString(),
                  display,
                }));
                const selected = items.find(
                  ({ key }) => key.toString() === destination[field.name]
                );
                return (
                  <div key={field.name} className="mb-3">
                    <Form.Label className="d-flex">{field.label}</Form.Label>
                    <Form.Select
                      value={selected?.key || ""}
                      onChange={({ target }) =>
                        setDestinationField(field.name, target.value)
                      }
                      required={field.required}
                    >
                      {items.map((item) => (
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
                      value={destination[field.name]?.toString()}
                      onChange={({ target }) =>
                        setDestinationField(field.name, target.value)
                      }
                      required={field.required}
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
                        setDestinationField(field.name, target.value)
                      }
                      required={field.required}
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
                        required={field.required}
                        label={field.label}
                        checked={!!destination[field.name]}
                        onChange={({ target }) =>
                          setDestinationField(field.name, target.checked)
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
                            setDestinationField(field.name, target.value)
                          }
                        />
                      ))}
                    </div>
                  </div>
                );
              } else {
                return <></>;
              }
            })}
          </Form.Group>
          <hr />
        </Fragment>
      ))}
      <ProductsAndModels
        destination={destination}
        setDestinationField={setDestinationField}
      />
      <hr />
      <TestConnection
        preparedDestination={preparedDestination}
        validateForm={validateForm}
      />
      <hr />
      <Button type="submit">Submit form</Button>
    </Form>
  );
};

export default CreateDestinationExample;
