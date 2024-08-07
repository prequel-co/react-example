import React, { useState, useEffect, useMemo } from "react";
import {
  Destination,
  ModelConfig,
  useGetModelsForRecipient,
} from "@prequel/react";
import Form from "react-bootstrap/Form";

import fetchToken from "../fetchToken";
import { PREQUEL_HOST, REACT_ORIGIN } from "../host";

const ALL_CURRENT_FUTURE_MODELS = ["*"];

type ProductsAndModelsProps = {
  destination: Destination;
  setDestination: React.Dispatch<React.SetStateAction<Partial<Destination>>>;
};
const ProductsAndModels = ({
  destination,
  setDestination,
}: ProductsAndModelsProps) => {
  const [recipientModels, setRecipientModels] = useState<ModelConfig[]>();
  const getRecipientModels = useGetModelsForRecipient(
    fetchToken,
    REACT_ORIGIN,
    PREQUEL_HOST
  );

  useEffect(() => {
    if (getRecipientModels && !recipientModels) {
      const fetchModels = async () => {
        const m = await getRecipientModels();
        if (m) {
          setRecipientModels(m);
        }
      };
      fetchModels();
    }
  }, [getRecipientModels, recipientModels]);

  const allCurrentFutureModelsSelected = useMemo(
    () =>
      destination.enabled_models?.toString() ===
      ALL_CURRENT_FUTURE_MODELS.toString(),
    [destination.enabled_models]
  );

  const updateModels = (isEnabled: boolean, modelName: string) => {
    let updatedModels: string[] = [];
    if (isEnabled) {
      updatedModels = [...(destination.enabled_models ?? []), modelName];
    } else {
      updatedModels =
        destination.enabled_models?.filter((m) => m !== modelName) ?? [];
    }

    setDestination({ enabled_models: updatedModels });
  };

  return (
    <div className="mb-3 d-flex flex-column align-items-start">
      <Form.Label>Select what models the destination will receive</Form.Label>
      {recipientModels && (
        <>
          {recipientModels.map(({ model_name, description }) => {
            const label = description
              ? `${model_name} - ${description}`
              : model_name;
            return (
              <div key={model_name} className="mb-3">
                <Form.Check
                  id={model_name}
                  label={label}
                  checked={
                    destination.enabled_models?.includes(model_name) ||
                    allCurrentFutureModelsSelected
                  }
                  onChange={({ target }) =>
                    updateModels(target.checked, model_name)
                  }
                  disabled={allCurrentFutureModelsSelected}
                />
              </div>
            );
          })}
          <Form.Check
            key={"all_models_present_future"}
            id={"all_models_present_future"}
            label={
              "All current and future models (Any model added to these products in the future will be synced)"
            }
            checked={allCurrentFutureModelsSelected}
            onChange={({ target }) =>
              target.checked
                ? setDestination({
                    enabled_models: ALL_CURRENT_FUTURE_MODELS,
                  })
                : setDestination({ enabled_models: [] })
            }
          />
        </>
      )}
    </div>
  );
};

export default ProductsAndModels;
