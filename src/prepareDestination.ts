import { Destination, Form, PreparedDestination, prepareDestination as prepare } from "@prequel/react";

const prepareDestination: (d: Destination, f: Form | undefined) => PreparedDestination = (d, form) => {
  if (!form) {
      return {} as PreparedDestination
  }

  const fieldNames = form.reduce((accumulator: (keyof Destination)[], { fields }) => {
    const names = fields.map(({ name }) => name);
    return [...accumulator, ...names];
  }, []);

  const result = fieldNames.reduce(
    (accumulator: Destination, name: keyof Destination) => {
      return { ...accumulator, [name]: d[name] };
    },
    {} as Destination
  );
  const prepared = prepare(result);

  return {
    ...prepared,
    name: d.name,
    id_in_provider_system: d.id_in_provider_system,
    recipient_id: d.recipient_id,
    products: d.products,
    enabled_models: d.enabled_models,
  };
}

export default prepareDestination