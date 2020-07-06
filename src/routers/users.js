const express= require('express')
const User= require('../models/user.js')
const mongoose = require('mongoose')
const auth= require('../middleware/auth')
const multer= require('multer')
const sharp= require('sharp')
//const {sendWelcomeEmail} = require ('../Email/test')


const router= new express.Router()




//Cceating Resources - C operation - POST method



router.post('/users', async (req,res)=>{


    const user= new User(req.body)
    try{
        await user.save()
       // sendWelcomeEmail()
        const token= await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch(e) {
        res.status(400).send('Unable to save')   //one  line chaining
       // res.status(400)
       // res.send('Unable to save')

    }






})


//logging in


router.post('/users/login', async (req,res)=>{


    try{
    const user= await User.findByCredentials(req.body.email,req.body.password)
   const token= await user.generateAuthToken()

    if(!user) {
        return res.status(404).send()

       }

        res.send({ user,token })


    }catch(e){
        res.status(400).send(e)
    }


})



//logging out

router.post('/users/logout',auth, async (req,res)=>{

    try{

    req.user.tokens= req.user.tokens.filter((element)=>{

            return element.token!== req.token
        })

            await req.user.save()
        res.send('Succesfully Logged out')

    } catch(e){

        res.status(500).send()
    }



 })



//log out from all sessisions

router.post('/users/logoutAll',auth, async(req,res)=>{

try{

    req.user.tokens=[]
    await req.user.save()
    res.send('Succesfully logget out from all sessions')

}catch(e){

    res.status(500).send()
}



})




// Reading Rresources - R Operation - GET Method

router.get('/users/me', auth, (req,res)=>{     // for reading user profile

    res.send(req.user)

})



// router.get('/users/:id', async (req,res)=>{      //route paramaters  : part of url used to get dynamic values - syntax  is :

//     const _id= req.params.id  //req.params return object with the properties and values passed in url
// try{
// const user= await User.findById(_id)

//    if(!user){
//        return res.status(404).send()
//    }

//        res.send(user)


// } catch(e){

//    res.status(500).send()
// }


// })










//Updating Resources - U Operation


router.patch('/users/me',auth, async(req,res)=>{

    const update= Object.keys(req.body)
    const allowedUpdates=['name', 'emaol', 'password', 'age']
    const isvalidUpdate= update.every((element)=> allowedUpdates.includes(element))

              //  return allowedUpdates.includes(element)



    if(!isvalidUpdate)
    {
        return res.status(404).send({error: "Invalied Updates"})
    }

    try{
    
        update.forEach((element)=>{
            req.user[element]= req.body[element]

        })

        await req.user.save()

    //const user= await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true}) //runvalidator ensures it run the validate in model scheme so data is added to db as our model
 
      res.send(req.user)

    }catch(e){

        res.status(404).send(e)


        }


})



// Resource Deleting - D Operation


router.delete('/users/me', auth, async (req,res)=>{


    try{

                                              // const user= await User.findByIdAndDelete(req.user._id)
         await req.user.remove()
         res.send(req.user)
                                               //  if(!user)
                                                   //  {
                                                    //      return res.status(404).send({error: 'User not found'})
                                                           //  }

    }catch(e){
           
         res.status(500).send()

    }




})











//setting user profile avatatr
const upload= multer({
    limits: {
        
      fileSize: 1000000
    },
    fileFilter(req,file,cb)
    {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please Upload image in jpg,jpeg,png'))
        }

        cb(undefined,true)

    }


})
router.post('/users/me/avatar',auth, upload.single('avatar'),async (req,res)=>{

    const buffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer    //to store modified spictur by sharp 
   // req.user.avatar= req.file.buffer     // for storing direct original file data
  await req.user.save()
res.send()

},(error,req,res,next)=>{

res.status(400).send({error: error.message})
})



//getting avatar

router.get('/users/:id/avatar', async(req,res)=>{

    try{

        const user= await User.findById(req.params.id)
        if(!user || !user.avatar){
             throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){

        res.status(404).send()
    }



})

//delelting avatar

router.delete('/users/me/avatar', auth, async(req,res)=>{

    try{
    req.user.avatar= undefined
    await req.user.save()
    res.send()
    } catch(e)
    {
        res.status(500).send()
    }
})






module.exports= router