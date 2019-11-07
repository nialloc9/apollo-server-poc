# Schema basics

## Query-driven schema design
A GraphQL schema is most powerful when it's designed for the needs of the clients that will execute operations against it. Although you can structure your types so they match the structure of your back-end data stores, you don't have to! A single object type's fields can be populated with data from any number of different sources. Design your schema based on how data is used, not based on how it's stored.

If your data store includes a field or relationship that your clients don't need yet, omit it from your schema. It's easier and safer to add a new field to a schema than it is to remove an existing field that some of your clients are using.

Reference: (https://www.apollographql.com/docs/apollo-server/schema/schema/#object-types)[https://www.apollographql.com/docs/apollo-server/schema/schema/#object-types]

## Designing mutations
In GraphQL, it's recommended for every mutation's response to include the data that the mutation modified. This enables clients to obtain the latest persisted data without needing to send a followup query.

Reference: (https://www.apollographql.com/docs/apollo-server/schema/schema/#object-types)[https://www.apollographql.com/docs/apollo-server/schema/schema/#object-types]

## Structuring mutation responses
To help resolve both of these concerns, we recommend defining a MutationResponse interface in your schema, along with a collection of object types that implement that interface (one for each of your mutations).

`
    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }

    type UpdateUserEmailMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        user: User
    }
`

Reference: (https://www.apollographql.com/docs/apollo-server/schema/schema/#object-types)[https://www.apollographql.com/docs/apollo-server/schema/schema/#object-types]

Not from docs idea: Should create an error interface that extends all errors too.

# Fetching data with resolvers

## Modulizing resolvers

Resolvers can be modulized.

Reference (https://www.apollographql.com/docs/apollo-server/data/data/#modularizing-resolvers)[https://www.apollographql.com/docs/apollo-server/data/data/#modularizing-resolvers]

A resolver has 4 positional arguements:

- parent: The object that contains the result returned from the resolver on the parent field, or, in the case of a top-level Query field, the rootValue passed from the server configuration. This argument enables the nested nature of GraphQL queries.

- args: An object with the arguments passed into the field in the query. For example, if the field was called with query{ key(arg: "you meant") }, the args object would be:  { "arg": "you meant" }.

- context: This is an object shared by all resolvers in a particular query, and is used to contain per-request state, including authentication information, dataloader instances, and anything else that should be taken into account when resolving the query. Read this section for an explanation of when and how to use context.

- info: This argument contains information about the execution state of the query, including the field name, path to the field from the root, and more. It's only documented in the (https://github.com/graphql/graphql-js/blob/c82ff68f52722c20f10da69c9e50a030a1f218ae/src/type/definition.js#L489-L500)[GraphQL.js] source code, but is extended with additional functionality by other modules, like  apollo-cache-control.

Resolvers can return differant types:

- null or undefined
- An array
- A promise
- A scaler or object