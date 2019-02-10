const express = require('express')
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql')
const { buildSchema }  = require('graphql')
const mongoose  = require('mongoose')
const bcrypt = require('bcryptjs')

const  Event  =  require('./model/event')
const User = require('./model/user')
const app = express();



app.use(bodyParser.json());

app.get('/', (req, res, next)=> {
  res.send('hello world!')
})


app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
    type Event {
        _id:ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }
    
    type User{
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
    }

     type RootQuery{
         events: [Event!]!
         
     }

     input EventInput {
         title: String!
         description: String!
         price: Float!
         date: String!
     }

     input UserInput {
         email: String!
         password: String!
     }

     type RootMutation{
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
     }
     schema {
         query: RootQuery
         mutation: RootMutation
     }
    `),
    rootValue: {
        events: () => {
            return Event.find().then(events => {
                return events.map(event => {
                    const eve = {...event._doc, _id: event.id};
                    console.log(eve)
                    return {...event._doc , _id:event._id.toString()}
                })
            }).catch(err => { console.log(err)
                throw err})
        },
        createEvent: (args) => {
        //  const event = {
        //     _id: Math.random().toString(),
        //     title: args.eventInput.title,
        //     description: args.eventInput.description,
        //     price: +args.eventInput.price,
        //     date: args.eventInput.date
        //  }
       
        const event = new Event({
           title: args.eventInput.title,
           description: args.eventInput.description,
           price: +args.eventInput.price,
           date: new Date(args.eventInput.date),
           creator: "5c5ff05e18be5119697b62db"
        });
        let createdEvent
        return event
              .save()
              .then(result => {
                 createdEvent =  {...result._doc , _id: result.id}
                 return User.findById('5c5ff05e18be5119697b62db')
                
              })
              .then( user => {
                  if(!user){
                    throw new Error('user not found')
                  }
                  user.createdEvents.push(event);
                  return user.save()
              })
              .then(result => {
                console.log(result);
                return createdEvent
              })
              .catch(err => {console.log(err)
                throw err;
              }
              );

        },
        createUser: (args) => {
             return User.findOne({email: args.userInput.email})
                  .then(user => {
                      if(user){
                          throw new Error('user already exists')
                      }
                      return bcrypt
                  .hash(args.userInput.password, 12)
                  })
              
                  .then(hashPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashPassword
                    });
                    console.log(user)
                    return user.save()
                  })
                  .then(result => {
                      return { ...result._doc, password: null, _id: result.id }
                  })
                  .catch( err => { throw err })
            
        }
    },
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-4fp9q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
  .then(()=> { console.log('connected to mongodb atlas..')})
  .catch(err => console.log(err))


app.listen(5000,() => console.log('server started at : 5000'))