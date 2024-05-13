import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// Get the API key from .env
dotenv.config();
const API_KEY = process.env.API_KEY;
const PREQUEL_HOST = process.env.REACT_APP_PREQUEL_HOST;
const REACT_APP_PORT = process.env.REACT_APP_PORT ?? 3000;
const NODE_SERVER_PORT = process.env.REACT_APP_NODE_SERVER_PORT ?? 9999;
const ENV_RECIPIENT_ID = process.env.REACT_APP_RECIPIENT_ID;
const app = express();

// Allow all origins
app.use(cors());
app.use(express.json());

const AUTH_TOKEN = "/auth-token"

const REACT_EXAMPLE_ORIGIN = `http://localhost:${REACT_APP_PORT}`
const GENERATE_AUTH_TOKEN = `${PREQUEL_HOST}/actions/generate-scoped-auth-token`;

app.post(AUTH_TOKEN, async (req, res) => {
  console.log(`POST Request received: ${AUTH_TOKEN}`)

  // This Recipient ID value is pulled from the environment for the purpose of this example.
  // When implementing against the Prequel API, you should set this value in your backend
  // using a server-side token or your preferred method to associate user sessions with Recipient ID values.
  // This Recipient ID value should not be accepted from the frontend without validation.
  const recipientId = ENV_RECIPIENT_ID;

  const scopedToken = await fetch(GENERATE_AUTH_TOKEN, {
    method: "POST",
    headers: {
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json",
      "X-Prequel-Api-Version": "2023-12-01",
    },
    body: JSON.stringify({
      application_origin: REACT_EXAMPLE_ORIGIN,
      recipient_id: recipientId, // This is a validated Recipient ID value
      destination: req.body,
    }),
  }).then((response) => response.json())
  .then((body) => body.data.scoped_token)
  .catch((reason) => {
    console.error(reason);
    return ""
  });

  res.json({ scoped_token: scopedToken });
});

app.listen(NODE_SERVER_PORT, () => {
  console.log(`Server listening on port ${NODE_SERVER_PORT}`);
});
