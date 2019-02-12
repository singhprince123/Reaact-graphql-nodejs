const bcrypt = require('bcryptjs')
const User =  require('../../model/user')
const jwt = require('jsonwebtoken');

module.exports =  {
   
    createUser: async (args) => {
        try{
            const user = await User.findOne({email: args.userInput.email})
            if(user){
                throw new Error('user already exists')
            }
         const hashPassword= await bcrypt.hash(args.userInput.password, 12);
          const newuser = new User({
              email: args.userInput.email,
              password: hashPassword
          });
        const result =  await newuser.save();
         return { ...result._doc, password: null, _id: result.id }
        }catch(err){
             throw err }
        
    }, 

    login: async ({email, password})=> {
          const user =  await User.findOne({email: email});
          if(!user){
              throw new Error('User does not exists')
          }
          const isEqual = await bcrypt.compare(password, user.password);
          if(!isEqual){
              throw new Error('Password is incoorrect');
          }
          const token = await jwt.sign({userId: user.id, email: user.email}, 'somekeysmarterone',{
              expiresIn: '1h'
          });
          return {
              userId: user.id,
              token: token,
              tokenExpiration: 1
          }

    }

}