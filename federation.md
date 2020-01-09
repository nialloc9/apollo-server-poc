# Overview

Apollo Server implements a spec-compliant GraphQL server which can be queried from any GraphQL client

## Core concepts

Works through a declarative composition model where services expose their capabilities and together they can be formed into a single graph.

## Entities and keys

An entity is a type that can be referenced by another service. 

Entities have a primary key whose value uniquely identifies a specific instance of the type, similar to the function of a primary key in a SQL table

`
    type Product @key(fields: "upc") {
    upc: String!
    name: String!
    price: Int
    }
`

Unlike relay keys can be any field and they tell graphql to fetch by that value. Apollo also supports multiple keys.

Once an entity is part of the graph all services can reference it .

`
    # in the reviews service
        type Review {
        product: Product
    }

    extend type Product @key(fields: "upc") {
        upc: String! @external
    }
`

In this example we have a Review type with a field called product that returns the Product type. Since Product is an entity that lives in another service, we define a stub of that type in this service with just enough information to enable composition

* extend keyword declares that Product is an entity defined elsewhere, in this case the product catalog service.
* @key directive declares that we'll use a UPC to reference a particular product. This must match the referenced entity's own key as defined in the product catalog service
* definition of the upc field with an @external directive declares the type of the upc field (String!, in this case) that is implemented in another service.

In one entity we can't show a whole extenal entitiy as it's not in the service but we reference it:

`
{
  Review: {
    product(review) {
      return { __typename: "Product", upc: review.product_upc };
    }
  }
}
`

The { __typename: "Product", upc: review.product_upc } object is a representation of a Product entity. Representations are how services reference each others' types. They contain an explicit typename definition and a value for the key.


The gateway will use the representation as an input to the service that owns the referenced entity. So to allow the gateway to enter the graph in this manner and resume execution of the query, the last thing we need is a reference resolver back in the product catalog service. We only write this once per entity and it lives in the entity.

`
{
  Product: {
    __resolveReference(reference) {
      return fetchProductByUPC(reference.upc);
    }
  }
}
`

