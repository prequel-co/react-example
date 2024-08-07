## Prerequisites
- [ ] You must have a Prequel API key and know the corresponding Prequel host URL to successfully run the webapp. If you're unsure where to find these, please ask your Prequel support contact.

## About this Example App

This example app shows how you can use hooks from [@prequel/react](https://www.npmjs.com/package/@prequel/react) in your React application. These hooks enable you to easily embed all of Prequel's functionality directly in your customer-facing app - including adding, viewing, updating, and deleting connections as well as viewing historical transfers & sync activity. This example uses React Bootstrap components to build a styled form, but it can be easily substituted with any component library, including your own. For more details on usage of [@prequel/react](https://www.npmjs.com/package/@prequel/react), please see our [docs](https://docs.prequel.co/docs/react). 

By cloning the repository, entering your API key, and running `npm run example`, your browser should open to an interactive reference implementation of Prequel's embedded data sharing feature, as seen in the screenshots below. 

### Screenshots

#### Example "Connect Destination" form
![Example "Connect Destination" form, unstyled](https://storage.googleapis.com/prequel_docs/images/react-example-add-databricks.png)

#### Example "Destination Options" list
![Example "Destination Options" list](https://storage.googleapis.com/prequel_docs/images/react-example-destinations.png)

## Getting Started with the Prequel React Example App

1. Clone the repo using your desired method
2. Run `npm install`
3. Create a `.env` file in the top level of the repo
```bash
API_KEY=sk_staging_1234567890abcdef
REACT_APP_PREQUEL_HOST=https://your-prequel-api.com
REACT_APP_PREQUEL_ORG_ID=12345678-abcd-1234-efgh-ijklmnopqrst
```
4. Populate the following environment variables in the `.env` file:
  * `API_KEY` with your Prequel API Key
    * We recommend you use a staging API key
  * `REACT_APP_PREQUEL_HOST` with your Prequel Host
    * Be sure to prefix with `https://`, i.e. `REACT_APP_PREQUEL_HOST=https://<your-prequel-api>`
  * `REACT_APP_PREQUEL_ORG_ID` with your Prequel Org ID 
    * Your Org ID is a unique UUID assigned to your Prequel account. Reach out to your Prequel support contact to confirm this value. 
    * This isn't strictly required, but if you omit the Org ID, you will not be able to retrieve your account specific public keys (and related values) used for connection authentication
5. Run both the Node server and React app with `npm run example`
    * The React app will default to run on port `3000`
    * The Node server will default to run on port `9999`

### Additional Environment Variables

In addition to demonstrating how to build a destination form, this example app illustrates other hook usages as well. To test other hook examples, you'll need to set the appropriate environment variables, documented below.
| Example        | Environment Variables     |
|----------------|---------------------------|
| `Get Transfers`| `REACT_APP_RECIPIENT_ID`  |


### Optional Environment Variables

You can set what port the React app and the sample Node server run on. To set the React port, add the variable `REACT_APP_PORT` to the `.env` file with your desired value. To set the Node port, add the variable `REACT_APP_NODE_SERVER_PORT` to the `.env` file with your desired value.
