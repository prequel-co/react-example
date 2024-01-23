import React, { useState, useEffect, useMemo } from "react";
import {
  Destination,
  useModels,
  useProducts,
  ModelConfig,
} from "@prequel/react";
import Form from "react-bootstrap/Form";

import fetchToken from "../../fetchToken";
import { PREQUEL_HOST, REACT_ORIGIN } from "../../host";

const ALL_CURRENT_FUTURE_MODELS = ["*"];

type ProductsAndModelsProps = {
  destination: Destination;
  setDestinationField: (
    key: keyof Destination,
    value: string | string[] | boolean | undefined
  ) => void;
};
const ProductsAndModels = ({
  destination,
  setDestinationField,
}: ProductsAndModelsProps) => {
  const [availableModels, setAvailableModels] = useState<ModelConfig[]>([]);
  const models = useModels(fetchToken, REACT_ORIGIN, PREQUEL_HOST);
  const products = useProducts(fetchToken, REACT_ORIGIN, PREQUEL_HOST);

  useEffect(() => {
    // if selectedProducts change, update the available models list
    if (products) {
      let modelNames: string[] = [];
      products?.forEach(({ product_name, models }) => {
        // If the product is in the list, append all the models
        if (destination.products?.includes(product_name)) {
          modelNames = [...modelNames, ...models];
        }
      });

      // This also de-deduplicates the model names
      const newAvailableModels =
        models?.filter(({ model_name }) => modelNames.includes(model_name)) ??
        [];
      setAvailableModels(newAvailableModels);
    }
  }, [destination.products, models, products]);

  useEffect(() => {
    // Filter out any models that have been removed from availableModels
    const newAvailableModelNames = availableModels.map(
      ({ model_name }) => model_name
    );
    const newEnabledModels = destination.enabled_models?.filter((m) =>
      newAvailableModelNames.includes(m)
    );
    setDestinationField("enabled_models", newEnabledModels);
  }, [availableModels]); // eslint-disable-line

  const allCurrentFutureModelsSelected = useMemo(
    () =>
      destination.enabled_models?.toString() ===
      ALL_CURRENT_FUTURE_MODELS.toString(),
    [destination.enabled_models]
  );

  const updateProducts = (isEnabled: boolean, productName: string) => {
    let updatedProducts: string[] = [];
    if (isEnabled) {
      updatedProducts = [...(destination.products ?? []), productName];
    } else {
      updatedProducts =
        destination.products?.filter((p) => p !== productName) ?? [];
    }

    setDestinationField("products", updatedProducts);
  };

  const updateModels = (isEnabled: boolean, modelName: string) => {
    let updatedModels: string[] = [];
    if (isEnabled) {
      updatedModels = [...(destination.enabled_models ?? []), modelName];
    } else {
      updatedModels =
        destination.enabled_models?.filter((m) => m !== modelName) ?? [];
    }

    setDestinationField("enabled_models", updatedModels);
  };

  return (
    <div>
      <div className="mb-3 d-flex flex-column align-items-start">
        <Form.Label>
          Select what products the destination will receive
        </Form.Label>
        {products &&
          products.map(({ product_name, models }) => (
            <Form.Check
              key={product_name}
              id={product_name}
              label={product_name}
              checked={destination.products?.includes(product_name)}
              onChange={({ target }) =>
                updateProducts(target.checked, product_name)
              }
            />
          ))}
      </div>
      <div className="mb-3 d-flex flex-column align-items-start">
        <Form.Label>Select what models the destination will receive</Form.Label>
        {availableModels.length > 0 ? (
          <>
            {availableModels.map(({ model_name, description }) => {
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
                  ? setDestinationField(
                      "enabled_models",
                      ALL_CURRENT_FUTURE_MODELS
                    )
                  : setDestinationField("enabled_models", [])
              }
            />
          </>
        ) : (
          <Form.Text>You must select a product first.</Form.Text>
        )}
      </div>
    </div>
  );
};

export default ProductsAndModels;
