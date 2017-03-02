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
			variables: { first: 2, after: after },
		}
	} ,
	force:true,
	props:({ownProps,data})=>{
		console.log("DATAAAAAAA ===> ")
		console.dir(data)
		const  { loading, mainQuery,  fetchMore } = data
		console.log("mainQuery ==> "+mainQuery+" <<<>>> "+ loading)
		const loadMoreRows = ()=>{
				return fetchMore({
					variables:{
						after:mainQuery.pageInfo.endCursor,
					},
					updateQuery:(previousResult,{fetchMoreResult})=> {
						// console.log("previousResult "+ previousResult)
						// console.log("fetchMoreResult "+ fetchMoreResult)
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
//    constructor(props)
//    {
// 	   super(props)

//    }

//    componentWillUnmount() {

//    }

   render(){	
	   console.log("PROOOOOOOOOOOOPS ===> ")
	   console.dir(this.props)
       const {dispatch,loading,mainQuery,loadMoreRows} = this.props
	   console.dir(loadMoreRows)
	   
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