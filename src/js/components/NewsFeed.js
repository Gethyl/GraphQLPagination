import React from "react";
import ReactDOM from "react-dom"

import TextField from 'material-ui/TextField'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import injectTapEventPlugin from 'react-tap-event-plugin'

import {InfiniteLoader,AutoSizer,List} from "react-virtualized"

injectTapEventPlugin()

let cardStyle = {
   //  maxWidth:"100%",
   //  minHeight:"20%",
     minHeight:100
}

let col6 = {
    width: "40%",
    float: "left",
    padding: "15px",
}

let virtualizingList = []

export default class NewsFeed extends React.Component{
   constructor(props)
   {
	   super(props)
       const {loadMoreRows,mainQuery} = this.props
       this._loadMoreRows = this._loadMoreRows.bind(this)
       this._isRowLoaded = this._isRowLoaded.bind(this)
       this._rowRenderer = this._rowRenderer.bind(this)

       this.state = {
            loadedRowsMap: {}
        }
   }

   componentWillUnmount() {

   }

   _isRowLoaded ({ index }) {
        return !!virtualizingList[index];
   }

   _loadMoreRows({ startIndex, stopIndex }) {
		return loadMoreRows()
        // .then((res)=>{
        //     console.log("Returned Value ==>"+ res)
        //     return res
        // })
   } 

   _rowRenderer({ key, index, style}) {
        let content
        if (index<virtualizingList.length) {
            content = virtualizingList[index].node.item
        } 
        else {
            content = (
                <div>Loading.....</div>       
            )
        }

        return (
            <div
                key={key}
                style={style}
            >
                {content}
            </div>
        )
    }


   render(){	
        const {loadMoreRows,mainQuery} = this.props
        virtualizingList = mainQuery.edges
        console.log("Virtualizing List ============>")
        console.dir(virtualizingList)
		return (
            <div style={{ marginLeft:"15%",}}>
                <InfiniteLoader
                    isRowLoaded={this._isRowLoaded}
                    loadMoreRows={loadMoreRows}
                    rowCount={mainQuery.totalCount-1}
                >
                    {({ onRowsRendered, registerChild }) => (
                    <List
                        height={300}
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        rowCount={mainQuery.totalCount-1}
                        rowHeight={20}
                        rowRenderer={this._rowRenderer}
                        width={300}
                    />
                    )}
				</InfiniteLoader>
			</div>
		);
	}
}

/*
<InfiniteLoader
                    isRowLoaded={this._isRowLoaded}
                    loadMoreRows={this._loadMoreRows}
                    rowCount={mainQuery.totalCount}
                >
                    {({ onRowsRendered, registerChild }) => (
                    <List
                        height={200}
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        rowCount={mainQuery.totalCount}
                        rowHeight={20}
                        rowRenderer={this._rowRenderer}
                        width={300}
                    />
                    )}
				</InfiniteLoader>*/