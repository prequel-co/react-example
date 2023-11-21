import { PreparedDestination } from "@prequel/react";

const fetchToken: (d?: PreparedDestination) => Promise<string> = (destination) =>
  fetch("http://localhost:9999/auth-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(destination ?? {}),
  })
    .then((response: Response) => response.json())
    .then((body) => body.scoped_token)
    .catch((reason) => {
      console.error(reason);
  });

export default fetchToken;