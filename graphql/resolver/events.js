
const Event = require('../../model/event')
const User = require('../../model/user')

const  { transformEvent } = require('./merge')




module.exports =  {
    events:  async () => {
        try{
            const events = await Event.find();
            return events.map(event => {
              
                return transformEvent(event)
            })
        }catch(err){ 
            console.log(err)
            throw err}
    },
   
    createEvent: async (args, req) => {  
        if(!req.isAuth){
            throw new Error('User is not Authenticated')
        }
       const event = new Event({
           title: args.eventInput.title,
           description: args.eventInput.description,
           price: +args.eventInput.price,
           date: new Date(args.eventInput.date),
           creator: req.userId
        });
        let createdEvent
       try{
          const result = await event.save()
          createdEvent =  transformedEvent(result);
          const user = await User.findById(req.userId);
            if(!user){
              throw new Error('user not found')
               }
            user.createdEvents.push(event);
            await user.save();
             return createdEvent;
           
       }catch(err){console.log(err)
            throw err;
        }
    }

}