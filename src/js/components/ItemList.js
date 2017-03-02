import React from "react";
import ReactDOM from "react-dom"

// import TextField from 'material-ui/TextField'
// import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {ListItem} from 'material-ui/List'
import LinearProgress from 'material-ui/LinearProgress'

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

export default class ItemList extends React.Component{
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
                // <LinearProgress mode="indeterminate" />
                 <div>Loading.....</div>       
            )
        }

        return (
            <ListItem
                key={key}
                style={style}
                primaryText={content}
            />
        )
    }


   render(){	
        const {loadMoreRows,mainQuery} = this.props
        virtualizingList = mainQuery.edges

		return (
            <div style={{ marginLeft:"30%",}}>
                <InfiniteLoader
                    isRowLoaded={this._isRowLoaded}
                    loadMoreRows={loadMoreRows}
                    rowCount={mainQuery.totalCount}
                >
                    {({ onRowsRendered, registerChild }) => (
                    <List
                        height={500}
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        rowCount={mainQuery.totalCount}
                        rowHeight={40}
                        rowRenderer={this._rowRenderer}
                        width={500}
                        overscanRowCount={0}
                    />
                    )}
				</InfiniteLoader>
			</div>
		);
	}
}