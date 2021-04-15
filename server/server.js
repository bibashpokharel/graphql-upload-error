const { ApolloServer, gql } = require('apollo-server');
const AWS = require('aws-sdk')
const {createWriteStream} = require('fs')

// AWS.config.loadFromPath('./credentials.json');

// const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const typeDefs = gql`  
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  
  type Query {
    _ : Boolean
  }
  
  type Mutation {
    singleUpload(file: Upload!): File!,
    # singleUploadStream(file: Upload!): File!
  }
`;

const resolvers = {
  Mutation: {
    async singleUpload(parent, args) {
      try {
        
        const file = await args.file
        const { createReadStream, filename, mimetype } = file
        return new Promise((resolve, reject) => {
          console.log('inside promise')
          createReadStream()
            .pipe(createWriteStream(`./uploadFile/${filename}`))
            .on('data',(chunk)=>console.log(chunk))
            .on('end', () => {
              console.log('after finish')
              return resolve(file)
            })
            .on('error', () => {
              console.log('on error')
              return reject('error')
            })
        })

        // return new Promise(async (resolve, reject) =>
        //   fs.createReadStream()
        //     .pipe(createWriteStream(`./uploadFile/${filename}`))
        //     .on('finish', () => resolve(true))
        //     .on('error', () => reject(false)),
        // );


      } catch (err) {
        console.log(err)
      }
      // singleUploadStream: async (parent, args) => {
      //     const file = await args.file
      //     const { createReadStream, filename, mimetype } = file
      //     const fileStream = createReadStream()

      //     const uploadParams = { Bucket: 'apollo-file-upload-test', Key: filename, Body: fileStream };
      //     const result = await s3.upload(uploadParams).promise()

      //     console.log(result)


      //     return file;
      // }
    },
  }
}
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`\`🚀  Server ready at ${url}`);
});