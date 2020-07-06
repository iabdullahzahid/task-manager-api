const validator= require('validator')
const mongoose = require('mongoose')
const bcrypt= require ('bcryptjs')
const jwt= require('jsonwebtoken')
const Task= require('../models/task')


const userSchema= new mongoose.Schema({

    name:{
            type: String,
            require: true,
            validate(value){
                if (value===''){
                    throw new Error('Name can not be empty')
                }

        }
            

    },
    age:{
             type: Number,
             validate(value){
                    if(value<=0)
                    {
                        throw new Error('Age must be positive')
                    }

             }



    },
    email:{

        type: String,
        require: true,
        lowercase: true,
        trim: true,
        unique:true,
        validate(value){

            if(!validator.isEmail(value))
            {
                throw new Error('Invalid email')
            }





        }

    },

      password: {

        type: String,
        require: true,
        minlength: 6,
        trim: true,
        validate(value){

            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Password can not be Password')
            }
        }


      },

      tokens: [ {
                token: {
                        type: String,
                        require: true

                }

      
            }
      ],  avatar:{
                type: Buffer

      }

}, {
    timestamps: true
})

//creating vitual relatition betwenen task an d users

userSchema.virtual('tasks',{

    ref: 'Task',
    localField: '_id',
    foreignField:'owner'



})

//for hasing password and stoing to database //middleware for mongooe
userSchema.pre('save', async function(next){

    const user= this

    if(user.isModified('password'))
        {
            user.password= await bcrypt.hash(user.password,8)

        }

    next()

})




//2nd middleware for removing task from child table  before arent geting delelted
userSchema.pre('remove', async function(next){

    const user= this
      await Task.deleteMany({owner: user.id})
      
        next()
})


// Statics: to have function on Models

userSchema.statics.findByCredentials= async (email,password) =>{


    const user= await User.findOne({email})

    if(!user)
    {
        throw new Error('Unable to Login')
    }

    const isvalidPasword= await bcrypt.compare(password, user.password)

        if(!isvalidPasword)
        {
            throw new Error('Unable to Login')
        }

    

       return user 

}


//method: to have function on a particulalt/single object/instance of model

userSchema.methods.generateAuthToken=  async function(){

    const user= this

    const token= jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens= user.tokens.concat({token})

    await user.save()



    return token






}



// for cutoizing json object which is sent when we use res.send. it calls stringify
userSchema.methods.toJSON= function(){

    const  user=this
    const userObj = user.toObject() 

    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj

}








const User=  mongoose.model('User', userSchema)




// const user= new User({
//             name: 'Ali',
//             email: 'ali123@gmail.com',
//             password: '2343444555'

// })

// user.save().then(()=>{
//     console.log('Saved Succesfully to')

// }).catch(()=>{
// console.log('coud not save to db')

// })

module.exports=User