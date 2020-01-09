3 Options

* Putting user info on the context

`
const server = new ApolloServer({
 typeDefs,
 resolvers,
 context: ({ req }) => {
   // get the user token from the headers
   const token = req.headers.authorization || '';
  
   // try to retrieve a user with the token
   const user = getUser(token);
  
   // add the user to the context
   return { user };
 },
});
`

* Schema authorization

Blanket ban across all enpoints.

`
context: ({ req }) => {
 // get the user token from the headers
 const token = req.headers.authorization || '';

 // try to retrieve a user with the token
 const user = getUser(token);

 // optionally block the user
 // we could also check user roles/permissions here
 if (!user) throw new AuthenticationError('you must be logged in'); 

 // add the user to the context
 return { user };
},
`

* Authorization in resolvers

Individual

users: (parent, args, context) => {
 if (!context.user || !context.user.roles.includes('admin')) return null;
 return context.models.User.getAll();
}

* Authorization in data models

`

export const generateUserModel = ({ user }) => ({
 getAll: () => { /* fetching/transform logic for all users */ },
 getById: (id) => { /* fetching/transform logic for a single user */ },
 getByGroupId: (id) => { /* fetching/transform logic for a group of users */ },
});

context: ({ req }) => {
 // get the user token from the headers
 const token = req.headers.authentication || '';
  
 // try to retrieve a user with the token
 const user = getUser(token);

 // optionally block the user
 // we could also check user roles/permissions here
 if (!user) throw new AuthenticationError('you must be logged in to query this schema');  

 // add the user to the context
 return {
   user,
   models: {
     User: generateUserModel({ user }),
     ...
   }
 };
},

`

* Authorization via Custom Directives

const typeDefs = `
  directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION

  enum Role {
    ADMIN
    REVIEWER
    USER
  }

  type User @auth(requires: USER) {
    name: String
    banned: Boolean @auth(requires: ADMIN)
    canPost: Boolean @auth(requires: REVIEWER)
  }
`

The @auth directive can be called directly on the type, or on the fields if you want to limit access to specific fields as shown in the example above. The logic behind authorization is hidden away in the directive implementation.

One way of implementing the @auth directive is via the SchemaDirectiveVisitor class from graphql-tools. Ben Newman covered creating a sample @deprecated and @rest directive in this excellent article. You can draw inspiration from these examples.

[Examples](https://www.apollographql.com/docs/apollo-server/security/authentication/)

* Authorization outside of GraphQL

If your REST endpoint is already backed by some form of authorization, this cuts down a lot of the logic that needs to get built in the GraphQL layer. This can be a great option when building a GraphQL API over an existing REST API that has everything you need already built in.

`
// src/server.js
context: ({ req }) => {
 // pass the request information through to the model
 return {
   user,
   models: {
     User: generateUserModel({ req }),
     ...
   }
 };
},

// src/models/user.js
export const generateUserModel = ({ req }) => ({
 getAll: () => {
   return fetch('http://myurl.com/users', { headers: req.headers });
 },
});
`