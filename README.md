# GraphQL Cursor pagination example

GraphQL cursor pagination example using 
* Express, Node.Js and MongoDB on the server
* React, Redux, Apollo-Client and React-virtualized on the client.

## This repository will help you understand the following:-

#### Server
1. How to setup a GraphQL server on Node.JS
2. How to write a GraphQL schema to handle Cursor pagination

#### Client - React
1. How to use Apollo Client to handle GraphQL queries
2. How to use React Virtualized to handle Infinite Scrolling of a list. 
---

## Running this example.

### Bring up the server.
Before starting the server, make sure that the MongoDB service is running. You can check this by issuing this command on Ubuntu.

```
    service mongod status
```
If the status is **Active** then you can proceed with bringing up the server, else start the `mongod` service by issuing
```
    sudo service mongod start
```

Check the status again to make sure that the service is up and running.

Next bring up the server by running

```
    npm run server
```

This will bring up the GraphQL server on port 5000. 

Now before you proceed to running this example, first step is to setup the data. For this you can follow the next section.
---

### Setting up the data.

This example uses MongoDB with a collection **GraphqlPagination** which will have documents of structure

```JSON
    {
        "id" : <id_number>,
        "item" : <item_text>
    }
```

 Inorder to make testing easy, once you bring up the server by running `npm run server`, go to the url http://localhost:5000/insertdb

> This will insert 100 records for you as shown in the below example.

```
    {
        "_id" : ObjectId("58b7ead77431065e7db74c93"),
        "__v" : 0,
        "id" : 1,
        "item" : "Item 1"
    }

    /* 2 */
    {
        "_id" : ObjectId("58b7ead77431065e7db74c94"),
        "__v" : 0,
        "id" : 2,
        "item" : "Item 2"
    }
```
---

### Running the query via GraphiQL.

Great! Now you have the **Server** running and also some data in the **MongoDB Collection**.

Now go to http://localhost:5000/graphql

This will open GraphiQL where you can play around with some queries. 

The query which will be used in **Client** is

```
    mainQuery(first:10,after:"") {
        totalCount
        edges {
            cursor
            node {
                id
                item
            }
        }
        pageInfo{
            endCursor
            hasNextPage
        }
    }
```
***first*** is the number of rows you want to retrieve.
***after*** is the cursor position after which the rows should be retrieved.
**So you can read the query as retrieve the `first` rows `after` this cursor.**
>How you change the `after` parameter is the basic fundamental for achieving ***Pagination*** 
---

### Running from the Client

Once you are all set at the server, bring up you client as well by issuing the below command in another console.

```
    npm start
```

This will run the **Webpack Development Server[WDS]**

Go to http://localhost:8080 to see the data retrieved on to the client. 
---

### Infinite Scrolling
As you can see only few rows are loaded, and as and when you scroll, more rows are fetched from the server. 
This is the basic idea of cursor pagination to fetch only a few records initial and retrieve the rest as and when required.

I have used React-Virtualized's InfiniteLoader and List to achieve this.

> Imagine how you see your feeds on Facebook, as you keep scrolling down, more data is fetched. This my friends is cursor pagination.