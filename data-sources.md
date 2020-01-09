## Source
Taken from (https://www.apollographql.com/docs/apollo-server/data/data-sources/)[https://www.apollographql.com/docs/apollo-server/data/data-sources/]

## Overview
Data sources are classes that encapsulate fetching data from a particular service, with built-in support for caching, deduplication, and error handling. You write the code that is specific to interacting with your backend, and Apollo Server takes care of the rest.

apollo-datasource-rest package provides utility classes for building resolvers over restful api endpoints

`
const { RESTDataSource } = require('apollo-datasource-rest');

class MoviesAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://movies-api.example.com/';
  }

  async getMovie(id) {
    return this.get(`movies/${id}`);
  }

  async getMostViewedMovies(limit = 10) {
    const data = await this.get('movies', {
      per_page: limit,
      order_by: 'most_viewed',
    });
    return data.results;
  }
}
`

## Dataloader
Only use dataloader  when caching is impossible as it will bust any cache in place. 

Do not use for rest apis as they are not built for batching

"What we’ve found to be far more important when layering GraphQL over REST APIs is having a resource cache that saves data across multiple GraphQL requests, can be shared across multiple GraphQL servers, and has cache management features like expiry and invalidation that leverage standard HTTP cache control headers."

