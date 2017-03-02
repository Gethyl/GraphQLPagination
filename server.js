import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors"

import {graphql} from 'graphql'
import graphqlHTTP from 'express-graphql';
import schema from './graphql/Schema'

import mongoose from "mongoose"
import graphPageModel from "./mongoose/GraphqlPagination"

const app = express();

mongoose.connect('mongodb://localhost:27017/local')

var db = mongoose.connection;
db.on('error', ()=> {console.log( '---FAILED to connect to mongoose')})
db.once('open', () => {
	console.log( '+++Connected to mongoose')
})

// middleware to use for all requests
app.use((req, res, next) => {
    // do logging
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // console.log('+++Gethyl entering the middleware');
    next(); // make sure we go to the next routes and don't stop here
});

app.options('/graphql', cors())
app.use('/graphql',bodyParser.json(), graphqlHTTP (req => ({
	schema
	,graphiql:true
})))

app.get('/insertdb', (req,res) => {
    var maxid = graphPageModel.count({},(err,count)=>{
        if (err) console.log("Count "+err)
        else {
            let insertArray =[]
            for(var i=count+1;i<=100;i++){
                // console.log(i)
                insertArray.push({id:i,item:"Item "+i})
            }
            console.dir(insertArray)
            if (insertArray.length > 0){
                graphPageModel.insertMany(insertArray,(err,doc)=>{
                    if (err) return console.log("Error in Insert Many "+ err)
                    // console.log("Insert Success "+ doc)
                    res.send("Database Initial Dummy Load completed :-) ... Please go to <strong>/graphql</strong> to start playing with pagination")
                })
            }
            else
             res.send("<strong>InsertArry is empty</strong> Maybe you have inserted 500 Rows already?")
        }
    }) 
})


app.listen(5000,()=> {console.log("+++Express Server is Running!!!")})