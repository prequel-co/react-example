import { PREQUEL_US } from "@prequel/react";

export const REACT_ORIGIN = process.env.REACT_APP_PORT ? `localhost:${process.env.REACT_APP_PORT}` : "localhost:3000"
export const API_HOST = process.env.REACT_APP_NODE_SERVER_PORT ? `localhost:${process.env.REACT_APP_NODE_SERVER_PORT}` : "localhost:9999";
export const PREQUEL_HOST = process.env.REACT_APP_PREQUEL_HOST ? process.env.REACT_APP_PREQUEL_HOST : PREQUEL_US;
