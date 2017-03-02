import React from "react";
import ReactDOM from "react-dom"
import {connect} from 'react-redux'

import ItemList from "../components/ItemList"

import CircularProgress from 'material-ui/CircularProgress'
import Divider from 'material-ui/Divider'
import AppBar from 'material-ui/AppBar'
import {List as MaterialList,ListItem} from 'material-ui/List'
import {loadInitialData} from  '../actions/action'

import { graphql } from 'react-apollo'
import gql from "graphql-tag"


import {InfiniteLoader,AutoSizer,List} from "react-virtualized"
import 'react-virtualized/styles.css'

// import {List} from "immutable"

const mapStateToProps = (state = {}) => {
    // console.dir(state)
    return {...state};
};

let headStyle = {
    fontFamily: "'Roboto', sans-serif",
    color: '#00BCD4',
	textAlign:"center",	
}

let progressStyle = {
	paddingLeft:"45%",
	paddingTop:"10%"
}

/******************************************************************************************************************
 *  GraphQL  Query to be executed
 ******************************************************************************************************************/
const MyQuery = gql`query MainQuery($first:Int!,$after:String){
						mainQuery(first:$first,after:$after) {
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
					}`

/******************************************************************************************************************
 *  GraphQL  Query to be executed
 ******************************************************************************************************************/
const configObject = {
	options: (props) => {
		let after = props.endCursor || ""; 
		return {
			variables: { first: 5, after: after },
		}
	} ,
	force:true,
	props:({ownProps,data})=>{
		// console.log("DATAA ===> ")
		// console.dir(data)
		const  { loading, mainQuery,  fetchMore } = data
/******************************************************************************************************************
 *  This callback function is called to load more rows from GraphQL Server.
 ******************************************************************************************************************/		
		const loadMoreRows = ()=>{
				return fetchMore({
					variables:{
						after:mainQuery.pageInfo.endCursor,
					},
					updateQuery:(previousResult,{fetchMoreResult})=> {
						const totalCount=fetchMoreResult.data.mainQuery.totalCount
						const newEdges=fetchMoreResult.data.mainQuery.edges
						const pageInfo=fetchMoreResult.data.mainQuery.pageInfo

						return {
							// By returning `cursor` here, we update the `loadMore` function
							// to the new cursor.
							mainQuery:{
								totalCount,
								edges:[...previousResult.mainQuery.edges, ...newEdges],
								pageInfo
							}
						};
					}
				})
			}
/******************************************************************************************************************
 *  props to be passed to subsequent children.
 ******************************************************************************************************************/
		return {
			loading,
			mainQuery,
			loadMoreRows
		}
	}
}


/******************************************************************************************************************
 *  PaginationContainer 
 ******************************************************************************************************************/

export  class PaginationContainer extends React.Component{
   render(){	
       const {dispatch,loading,mainQuery,loadMoreRows} = this.props
	   
	   let renderChild;
	   if (loading){
			renderChild = <CircularProgress size={80} thickness={7} style={progressStyle} />
	   }
	   else {
			renderChild= <ItemList loadMoreRows={loadMoreRows} mainQuery={mainQuery}/>
		}

	   return (
		   <div>
			   <AppBar
					title="Implement GraphQL Cursor Pagination on Server + Infinite Scroll using React Virtualized and Apollo on Client"
					showMenuIconButton={false}
				/>
			   <Divider/>
			   &nbsp;
			   {renderChild}
		   </div>
	   )
	}
}

const PaginationContainerWithData = graphql(MyQuery,configObject)(PaginationContainer)
export default  connect(mapStateToProps)(PaginationContainerWithData)