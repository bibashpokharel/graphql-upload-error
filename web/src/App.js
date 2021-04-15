// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import logo from './logo.svg';
import './App.css';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloClient } from "apollo-client"
import { ApolloProvider, Mutation } from "react-apollo"
import gql from "graphql-tag"

const apolloCache = new InMemoryCache()

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000', // Apollo Server is served from port 4000
})

const client = new ApolloClient({
  cache: apolloCache,
  link: uploadLink
})

const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    singleUpload(file: $file) {
      filename
      mimetype
      encoding
    }
  }
`;


function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Save Local</h2>
          <Mutation mutation={UPLOAD_FILE}>
            {(singleUpload, { data, loading }) => {
              console.log('data: ',data,"loading: ",loading)
              return (<form onSubmit={() => { console.log("Submitted") }} encType={'multipart/form-data'}>
                <input name={'document'} type={'file'} onChange={({ target: { files } }) => {
                  const file = files[0]
                  file && singleUpload({ variables: { file: file } })
                }} />{loading && <p>Loading.....</p>}</form>)
            }
            }
          </Mutation>
        </header>
      </ApolloProvider>
    </div>
  );
}

export default App;
