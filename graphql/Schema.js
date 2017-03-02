import fetch from "node-fetch"
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import graphPageModel from "../mongoose/GraphqlPagination"

let totalCount = 0
/******************************************************************************************************/
/* NODES                                                                                              */
/******************************************************************************************************/
var nodeItem = new GraphQLObjectType({
  name: 'nodeItem',
  description: 'item object',
  fields: () => ({
    id: {
      type: (GraphQLInt),
      description: 'Item number '
    },
    item: {
      type: (GraphQLString),
      description: 'Item  '
    }
  })
});
/******************************************************************************************************/
/* EDGES                                                                                              */
/******************************************************************************************************/
var edges = new GraphQLObjectType({
  name: 'edges',
  description: 'The edge part of the query',
  fields: () => ({
    node: {
      type: (nodeItem),
      description: 'Each node item '
    },
    cursor: {
      type: GraphQLString,
      description: 'Each item cursor '
    }
  })
});
/******************************************************************************************************/
/* PAGEINFO                                                                                           */
/******************************************************************************************************/
var pageInfo = new GraphQLObjectType({
  name: 'pageInfo',
  description: 'Key information for the page',
  fields: () => ({
    endCursor: {
      type: GraphQLString,
      description: 'Last cursor '
    },
    hasNextPage:{
      type: GraphQLBoolean,
      description:"Flag to denote end of all NODES"
    }
  })
});
/******************************************************************************************************/
/* MAIN QUERY                                                                                         */
/******************************************************************************************************/
var mainQuery = new GraphQLObjectType({
  name: 'mainQuery',
  description: 'The main query',
  fields: () => ({
    totalCount: {
      type: GraphQLInt,
      description: 'Total Count of rows'
    },
    edges: {
      type: new GraphQLList(edges),
      description: 'Edges Part of the Query'
    },
    pageInfo:{
      type: pageInfo,
      description: 'Page Information Part of the Query '
    }
  })
});

/******************************************************************************************************/
/* SCHEMA                                                                                             */
/******************************************************************************************************/
var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      mainQuery: {
          type: mainQuery,
          args:{
            first:{
              name:"first",
              type: (GraphQLInt)
            },
            after:{
              name:"after",
              type: (GraphQLString)
            }
          },
          resolve: (root,{first,after}) => {
                let edgesArray = []
                //<<<Tip>>> - Decoding the cursor value from Base 64 to integer.
                let cursorNumeric =  parseInt(Buffer.from(after,'base64').toString('ascii'))
                if (!cursorNumeric) cursorNumeric = 0

                //<<<Tip>>> - Use Promise to handle Async behaviour of Mongoose
                var edgesAndPageInfoPromise = new Promise((resolve,reject)=>{
                   //<<<TIP>>> where and gt are used to check against Args.after(cursorNumeric)
                   let edges =  graphPageModel.where('id').gt(cursorNumeric).find({},(err,result)=>{
                          if (err){
                            console.error("---Error "+ err)
                          }
                          
                       }).limit(first).cursor() //<<<TIP>>> Limit is obtained from Args.first
                   
                   edges.on('data',res => {
                      edgesArray.push({
                          //<<<Tip>>> - Encoding the cursor value to Base 64 as suggested in GraphQL documentation.
                          cursor: Buffer.from((res.id).toString()).toString('base64'),
                          node: {
                            id:res.id,
                            item:res.item
                          }
                      })
                   })  

                   edges.on('error',err => {
                      reject(err)
                   })

                   edges.on('end',() => {
                      let endCursor = edgesArray.length>0?edgesArray[edgesArray.length-1].cursor:NaN
                      
                      let hasNextPageFlag = new Promise((resolve,reject)=>{
                          if (endCursor){
                            let endCursorNumeric = parseInt(Buffer.from(endCursor,'base64').toString('ascii'))
                            graphPageModel.where('id').gt(endCursorNumeric).count((err,count)=>{
                                // console.log(":::DEBUG::: Has Next Page Count? "+ count)
                                count >0 ? resolve(true):resolve(false)      
                            })   
                          }
                          else resolve(false)
                      })
                      
                      // console.info(":::info::: Cursor Ended")                     
                                                                           
                      resolve(
                        {
                          edges:edgesArray,
                          pageInfo:{
                            endCursor:endCursor,
                            hasNextPage:hasNextPageFlag
                          }
                        }
                      )
                   })                     
                }) 
                let totalCountPromise = new Promise((resolve,reject)=>{
                    if (totalCount ===0) {
                      totalCount = graphPageModel.count((err,count)=>{
                        if (err) reject(err)
                        resolve(count)
                      })
                    }
                    else resolve(totalCount)
                })

                let returnValue = Promise.all([edgesAndPageInfoPromise,totalCountPromise]).then((values) => {
                    return {
                      edges:values[0].edges,
                      totalCount:values[1],
                      pageInfo:{
                        endCursor:values[0].pageInfo.endCursor,
                        hasNextPage:values[0].pageInfo.hasNextPage
                      }
                    }                
                })
                return returnValue
          }
        }
    }
  })  
});

export default schema;