const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify: false

})




    


    // const task1= new Task({
    //         description: 'Need to slep',
    //         completed: false


    // })


    // task1.save().then((task1)=>{

    //         console.log(task1)

    // }). catch((error)=>{

    //     console.log(error)

    // })



    // /Users/haier/mongodb/bin/mongod.exe --dbpath=/Users/haier/