import React from "react";
import ReactDOM from "react-dom"

import TextField from 'material-ui/TextField'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import injectTapEventPlugin from 'react-tap-event-plugin'

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

export default class NewsFeed extends React.Component{
   constructor(props)
   {
	   super(props)
	   const {dispatch,news} = this.props
       console.log(news)
   }

   componentWillUnmount() {

   }
// display:"inline",float:"none",textAlign: "initial",
   render(){	
       const {dispatch,news} = this.props
		return (
            <div style={{ marginLeft:"15%",}}>
                &nbsp;
                {news.map((newsItem,index)=>{
                    return <div key={index} style={col6}>
										<Card  style={cardStyle}  >
											<CardHeader title={newsItem.title} showExpandableButton={true}/>
											<CardMedia  expandable={true} >
													<img  src={newsItem.urlToImage} />
											</CardMedia>

											<CardText expandable={true}   >
													{newsItem.description}
											</CardText >
										</Card>
									</div>
               		}
					 )}
			</div>
		);
	}
}
