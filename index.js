const express = require('express')

const server = express()
server.use(express.json())

const projects = []
let reqCount = 0;

function checkIfIdBelongs(req, res, next){
    const {id} = req.params
    if(!projects[id]){
        return res.send("Projeto não existe")
    }else{
        return next()
    }
}

function countsReq(req, res, next){
    reqCount+=1
    console.log(reqCount)
    next()
}

server.post("/projects", countsReq, (req, res)=>{
    const {id, title} = req.body

    const project = {id, title, tasks: []}

    projects.push(project)

    return res.json(project)
})

server.get("/projects", countsReq, (req, res)=>{
    res.json(projects)
})

server.put("/projects/:id", countsReq, checkIfIdBelongs, (req, res)=>{
    const {title} = req.body
    const {id} = req.params

    const {tasks} = projects[id]

    projects[id] = {id, title, tasks}
    
    return res.json(projects[id])
})

server.delete("/projects/:id", countsReq, checkIfIdBelongs, (req, res)=>{
    const {id} = req.params
  
    projects.splice(id, 1)
    
    return res.send()
})

server.post("/projects/:id/tasks", countsReq, checkIfIdBelongs, (req, res)=>{
    const {id} = req.params
    const {title} = req.body
    
    projects[id].tasks.push(title)

    return res.json(projects[id])
})

server.listen(3001)