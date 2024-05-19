# QTFRenderer

---
## ⚠️ Alert: **QTFRenderer is still a proof of concept implementation and is not out of alpha stage yet. There may be many bugs and unresolved issues.**
---

**QTFRenderer** is a library for generating dynamic work trays and forms using React, TypeScript, Apollo, and GraphQL. This library is designed to help developers quickly create interactive and data-driven forms and trays based on backend data.

## Features

- **Dynamic Forms**: Automatically generate forms based on GraphQL data.
- **Work Trays**: Create dynamic work trays to manage and display data.
- **TypeScript Support**: Fully written in TypeScript with type definitions included.
- **React Components**: Easy-to-use React components for seamless integration.

## Installation

Install the library via npm:

```sh
npm install qtf-renderer
```
## Peer Dependencies

Ensure you have the following peer dependencies installed in your project:

```sh
{
  "peerDependencies": {
    "@ag-grid-community/client-side-row-model": "^31.3.1",
    "@ag-grid-community/core": "^31.3.1",
    "@ag-grid-community/react": "^31.3.1",
    "@apollo/client": "^3.10.3",
    "@emotion/react": "^11.11.4",
    "@emotion/styled": "^11.11.5",
    "@mui/material": "^5.15.17",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "ag-grid-community": "^31.3.1",
    "ag-grid-react": "^31.3.1",
    "graphql": "^16.8.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^5.3.4"
    }
}
```

## Usage

Here's a basic example of how to use QTFRenderer:

```sh
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client'; // Replace with your Apollo client setup
import { FormContainer, TrayContainer } from 'qtf-renderer';

const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <div>
                <h1>Dynamic Forms and Work Trays</h1>
                <FormContainer />
                <TrayContainer />
            </div>
        </ApolloProvider>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
```

## Components

### FormContainer
The FormContainer component dynamically generates forms based on backend data.

### Props
data: The data to populate the form (optional).
TrayContainer
The TrayContainer component creates dynamic work trays to manage and display data.

### Props
data: The data to populate the tray (optional).
Contributing
We welcome contributions! Please read our Contributing Guide to learn how you can help.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Repository
For more information, visit the [GitHub repository](https://github.com/Sagadark666/qtf-renderer).

## Keywords
react
typescript
apollo
graphql
forms
dynamic
renderer


### Additional Files
- **`CONTRIBUTING.md`**: Include guidelines for contributing to your project.
- **`LICENSE`**: Include the MIT license text.


