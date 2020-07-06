const express= require('express')
const Task= require('../models/task')
const auth = require('../middleware/auth')

const router= new express.Router()





//Cceating Resources - C operation - POST method



router.post('/tasks',auth, async (req,res)=>{


    const task= new Task({

            ...req.body,
            owner: req.user._id

    })
    try{
            await task.save()
            res.status(201).send(task)

    } catch(e){

            res.status(400).send(e)

        }  


            // const task= new Task(req.body)
            // task.save().then((task)=>{
        
            //     console.log('1 Task added')
            //         res.staus(201).send(task)
        
            // }).catch((e)=>{
        
            //         console.log('Unable to add task')
            //         res.status(400).send(e)
                 


})


// Reading Rresources - R Operation - GET Method


//setting pagination limit and skip
// sorting desc=-1, asc=1   /tasks?sortBy= createdAt:desc    -- fieldname:descednign or ascening
  //GET /tasks?completed=true  
router.get('/tasks',auth, async(req,res)=>{


  //  console.log(req.console.limit)
    const match= {}
    const sort={}
        if(req.query.sortBy) {
            const parts= req.query.sortBy.split(':')
            sort[parts[0]]= parts[1]=== 'desc'? -1 : 1

        }

            if(req.query.completed) {
                match.completed= req.query.completed==='true'
            }
            


    try{

    //const tasks= await Task.find({owner: req.user._id}) alternative

     await req.user.populate({
        path: 'tasks',
        match,
        options: {

            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
     }).execPopulate()   //alternative method using virtual field of user
    
     //res.send(tasks)
     res.send(req.user.tasks)

    }catch(e){

        res.status(500).send(e)
    }




})

router.get('/tasks/:id', auth, async (req,res)=>{

    const _id= req.params.id 

    try{
    const task= await Task.findOne({_id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }

        res.send(task)



    }catch(e){

        res.status(500).send()
    }





})



//Updating Resources - U Operation



router.patch('/tasks/:id', auth, async (req, res) => {
    console.log(req.params)
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner:req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((element)=>{
            task[element]= req.body[element]

        })
        await task.save()
        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }



})




// Resource Deleting - D Operation




router.delete('/tasks/:id', auth, async (req,res)=>{


    try{

        const task= await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
             if(!task)
             {
                 return res.status(404).send({error: 'Task not found'})
             }
            res.send(task)

    }catch(e){
           
         res.status(500).send()

    }




})














module.exports= router