const { ApolloServer, gql } = require('apollo-server');

class BasicLogging {
    requestDidStart({queryString, parsedQuery, variables}) {
      const query = queryString || print(parsedQuery);
      console.log(query);
      console.log(variables);
    }

    willSendResponse({graphqlResponse}) {
        console.log(JSON.stringify(graphqlResponse, null, 2));
      }
  }

let books = [
    {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
    },
    {
      title: 'Jurassic Park',
      author: 'Michael Crichton',
    },
  ];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      getBooks: () => books,
    },
    Mutation: {
        addBook: (parent, {book: { author, title }}) => {
            const book = { title, author };
            books.push(book);
            return book;
        },
        updateBook: (parent, { title, author }) => {
            books = books.map((o => o.title === title ? { ...o, author } : o));
            return { isSuccess: true }
        },
        deleteBook: (parent, { title }) => {
            books = books.filter((o => o.title !== title));
            return { isSuccess: true }
        }
    }
  };

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Book {
    title: String
    author: String
  }

  type Author {
    name: String
    books: [Book]
  }

  type Success {
    isSuccess: Boolean
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getBooks: [Book]
    getAuthors: [Author]
  }

  type Mutation {
    addBook(book: AddBook): Book
    updateBook(title: String): Success
    deleteBook(title: String): Success
  }

  input AddBook {
      "A main title for the book"
      title: String
      "Author of book"
      author: String
  }
`;


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers, playground: true, introspection: true, tracing: true });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});