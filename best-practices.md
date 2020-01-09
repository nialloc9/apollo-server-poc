# Best practices

## Paypal engineering blog
(https://medium.com/paypal-engineering/graphql-resolvers-best-practices-cd36fdbcef55)[https://medium.com/paypal-engineering/graphql-resolvers-best-practices-cd36fdbcef55]

- Fetching and passing data from parent-to-child should be used sparingly.
- Use libraries like dataloader to de-dupe downstream requests.
- Be aware of any pressure you’re causing on your data sources.
- Don’t mutate “context”. Ensures consistent, less buggy code.
- Write resolvers that are readable, maintainable, testable. Not too clever.
- Make your resolvers as thin as possible. Extract out data fetching logic to re-usable async functions.

# Dataloader 
Data loader solves the n+1 issue where for each event it has multiple attendees so multiple requests for each attendees data 
would have to be made as graphql resolvers resolve for each 1. Dataloaders primary function is the batching of theses requests 
so that DataLoader will coalesce all individual loads which occur within a single frame of execution (a single tick of the event loop) 
and then call your batch function with all requested keys.