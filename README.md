This example app shows how you can use hooks from [@prequel/react](https://www.npmjs.com/package/@prequel/react) in your React application. These hooks enable you to build a dynamic form that allows users to register their warehouses as Prequel destinations. This example uses React Bootstrap components to build a styled form, but it can be easily substituted with any component library. For more details on usage of [@prequel/react](https://www.npmjs.com/package/@prequel/react), please see our [docs](https://docs.prequel.co/docs/react).

## Getting Started with the Prequel React Example App

1. Clone the repo using your desired method
2. Run `npm install`
3. Create a `.env` file in the top level of the repo
4. Add `API_KEY` with your Prequel API Key as a value to the `.env` file
    1. We recommend you use a staging API key
5. Add `PREQUEL_HOST` with your Prequel Host as a value to the `.env` file
    1. Be sure to prefix with `https://`, i.e. `PREQUEL_HOST=https://<your-prequel-api>`
6. Add `REACT_APP_PREQUEL_ORG_ID` with your Prequel Org ID as a value to the `.env` file
    1. This isn't strictly required, if you omit the Org ID you will get a form, but it will not contain any of the relevant IAM authentication objects
7. Run both the Node server and React app with `npm run example`
    1. The React app will default to run on port `3000`
    2. The Node server will default to run on port `9999`

### Optional Environment Variables

You can set what port the React app and the sample Node server run on. To set the React port, add the variable `REACT_APP_PORT` to the `.env` file with your desired value. To set the Node port, add the variable `NODE_SERVER_PORT` to the `.env` file with your desired value.

## Available Scripts

This example app was built with Create React App. In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run server`

Runs the Node server on the specified port.

### `npm run server:bg`

Runs the Node server in the background on the specified port.
