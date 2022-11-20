const { Sequelize, DataTypes } = require('sequelize');
const express = require('express')
const request = require("request-promise")
const app = express()

// Middlware For App
app.use(express.json())

const sequelize = new Sequelize('dummy', 'postgres', '12345', {
  host: 'localhost',
  dialect:"postgres" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
 
const User = sequelize.define('newusers', 
{
  email: DataTypes.STRING,
  title: DataTypes.STRING,
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  picture:DataTypes.STRING,
},
{ timestamps: false });

const task = sequelize.define('tasks', 
{
  tasks: DataTypes.STRING,
  description: DataTypes.STRING,
},
{ timestamps: false });

User.hasMany(task);
task.belongsTo(User);

app.post("/createtask",async (req,res)=>{
  const {tasks,description} = req.body
  const s = await task.create({tasks,description})
  res.status(200).send(s)
})

app.post("/createuser",(req,res)=>{
  const options = {
      method: "POST",
      uri: "https://dummyapi.io/data/v1/user/create",
      body: req.body,
      json: true,
      headers: {
        "Content-Type": "application/json",
        "app-id":"630cf12a1aa60048c06adea1"
      },
     
    }
    request(options)
    .then(async function (response){
          const data = response;
          const s =  await User.create(options.body)
          res.status(200).send(data)
      }
    );
})




app.get("/getuser",(req,res)=>{
  const options = {
      method: "GET",
      uri: "https://dummyapi.io/data/v1/user",
      json: true,
      headers: {
        "Content-Type": "form-data",
        "app-id":"630cf12a1aa60048c06adea1"
      },
    }


    request(options)
    .then(async function (response){
          const m = await User.findAll(
            
            {include:task},
          )
          res.status(200).send(m)
         
      }
    ).catch((error)=>{
      console.log(error);
    })
})



app.put("/updateuser/:id",(req,res)=>{
  const id = req.params.id
  const options = {
      method: "PUT",
      uri: "https://dummyapi.io/data/v1/user/"+id,
      body: req.body,
      json: true,
      headers: {
        "Content-Type": "application/json",
        "app-id":"630cf12a1aa60048c06adea1"
      },
    }
    request(options)
    .then(async function (response){
          const data = response;
          const m = User.update(data)
          res.status(200).json(response)

      }
    );
})



app.delete("/deleteuser/:id",(req,res)=>{
  const id = req.params.id
  const options = {
      method: "DELETE",
      uri: "https://dummyapi.io/data/v1/user/"+id,
      json: true,
      headers: {
        "Content-Type": "application/json",
        "app-id":"630cf12a1aa60048c06adea1"
      },
     
    }
    request(options)
    .then(async function (response){
          console.log(response)
          res.status(200).json({message:"User Deleted Successfully"})

      }
    );
})

app.get("/getoneuser/:id",(req,res)=>{
  const id = req.params.id
  const options = {
      method: "GET",
      uri: "https://dummyapi.io/data/v1/user/"+id,
      json: true,
      headers: {
        "Content-Type": "application/json",
        "app-id":"630cf12a1aa60048c06adea1"
      },
     
    }
    request(options)
    .then(async function (response){
          console.log(response)
          res.status(200).json(response)

      }
    );
})





sequelize.authenticate().then(()=>{
    console.log('Connection has been established successfully.');

}).catch(()=>{
    console.error('Unable to connect to the database:', error);

})
  

 
  // const Task = sequelize.define('task', { name: DataTypes.STRING }, { timestamps: false });
  // const Tool = sequelize.define('tool', {
  //   name: DataTypes.STRING,
  //   size: DataTypes.STRING
  // }, { timestamps: false })

  




  sequelize.sync({ alter: true })
  .then(() => {
    console.log("database created");
  })
  .catch((error) => {
    console.log(error);
  })



  app.listen(8000,()=>{
    console.log("Running on port 8000");
  })