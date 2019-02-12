const express = require('express')
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql')
const mongoose  = require('mongoose')

const graphqlSchema = require('./graphql/schema/index')
const graphqlResover = require('./graphql/resolver/index')
const isAuth = require('./middleware/is-auth')

const app = express();



app.use(bodyParser.json());

app.use(isAuth)

app.get('/', (req, res, next)=> {
  res.send('hello world!')
})


app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResover,
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-4fp9q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
  .then(()=> { console.log('connected to mongodb atlas..')})
  .catch(err => console.log(err))


app.listen(5000,() => console.log('server started at : 5000'))