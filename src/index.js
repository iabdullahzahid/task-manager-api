const express= require('express')
require('./db/mongoose')
const userRouter= require('./routers/users')
const taskRouter= require('./routers/tasks')


const app= express()
const port= process.env.PORT


app.use(express.json()) // customizing our express to automatically parse json to object
app.use(userRouter)  //Setting user router
app.use(taskRouter) //setting task router




app.listen(port, ()=>{


    console.log('Express server runingn on ' + port)
})



// app.use((req,res,next)=>{

//     res.status(502).send('Site Under Maintenance :(')



// })

// const multer= require('multer')
// const upload = multer({
//     dest: 'images'
// })



// app.post('/upload', upload.single('upload'), (req,res)=>{

// res.send()

// })







