# Testing

## Mocks

Will mock based on schema, i.e string is string, number is number

`
    const server = new ApolloServer({
        typeDefs,
        mocks: true,
    });
`

If typeDefs has custom scalar types, resolvers must still contain the serialize,  parseValue, and parseLiteral functions

Also mocks can be customized:

`
const mocks = {
  Int: () => 6,
  Float: () => 22.1,
  String: () => 'Hello',
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks,
});
`

### Customizing movks

mocks can accepts functions for specific types in the schema that are called when that type is expected. By default, the functions in mocks will overwrite the resolvers in resolvers

`
    const mocks = {
      Int: () => 6,
      Float: () => 22.1,
      String: () => 'Hello',
    };

    const server = new ApolloServer({
            typeDefs,
            mocks,
        });
`

Also objects can be returned:


`
    const mocks = {
      Person: () => ({
        name: casual.name,
        age: () => casual.integer(0, 120),
      }),
    };
`


### Automating mocks

To automate mocking a list, return an instance of MockList:

`
    const mocks = {
      Person: () => ({
        // a list of length between 2 and 6 (inclusive)
        friends: () => new MockList([2,6]),
        // a list of three lists each with two items: [[1, 1], [2, 2], [3, 3]]
        listOfLists: () => new MockList(3, () => new MockList(2)),
      }),
    };  
`

mock functions on fields are actually just GraphQL resolvers, which can use arguments and context:

`
    const mocks = {
      Person: () => ({
        // the number of friends in the list now depends on numPages
        paginatedFriends: (parent, args, context, info) => new MockList(args.numPages * PAGE_SIZE),
      }),
    };
`

Mock false uses existing resolvers instead od overriding with mock resolvers

Under the hood, Apollo Server uses a library for building GraphQL servers, called graphql-tools

## Integration tests

Testing apollo-server can be done in many ways. The apollo-server-testing package provides tooling to make testing easier and accessible to users of all of the apollo-server integrations.

Integration testing a GraphQL server means testing many things. apollo-server has a request pipeline that can support many plugins that can affect the way an operation is executed. createTestClient provides a single hook to run operations through the request pipeline, enabling the most thorough tests possible without starting up an HTTP server.

`
    const { createTestClient } = require('apollo-server-testing');

    it('fetches single launch', async () => {
      const userAPI = new UserAPI({ store });
      const launchAPI = new LaunchAPI();

      // create a test server to test against, using our production typeDefs,
      // resolvers, and dataSources.
      const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({ userAPI, launchAPI }),
        context: () => ({ user: { id: 1, email: 'a@a.a' } }),
      });

      // mock the dataSource's underlying fetch methods
      launchAPI.get = jest.fn(() => [mockLaunchResponse]);
      userAPI.store = mockStore;
      userAPI.store.trips.findAll.mockReturnValueOnce([
        { dataValues: { launchId: 1 } },
      ]);

      // use the test server to create a query function
      const { query } = createTestClient(server);

      // run query against the server and snapshot the output
      const res = await query({ query: GET_LAUNCH, variables: { id: 1 } });
      expect(res).toMatchSnapshot();
    });
`

Query and mutate only supported

