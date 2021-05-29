'use strict';
/** You can define other models as well, e.g. postgres */
const model = require('../model/task-list-model-no-db.js');

exports.getAllTasks = (req, res) => {
    console.log("getAllTasks")
    model.getAllTasks((err, tasks) => {
        if (err) {
            res.send(err);
        }
        res.render('tasks', tasks);
    });
}

exports.addTask = (req, res) => {
    console.log("addTask")
    model.Task(req.params.taskName, 0, new Date().toISOString().replace('T',' ').slice(0,19));
    model.addTask(null , (err) => {
        if (err) {
            res.send(err);
        }
        res.end();
    });
}


exports.toggleTask = (req, res) => {
    console.log("toggleTask")
    model.toggleTask(Number(req.params.taskId) , (err) => {
        if (err) {
            res.send(err);
        }
        res.end();
    });
}

exports.removeTask = (req, res) => {
    console.log("removeTask")
    model.removeTask(Number(req.params.taskId) , (err) => {
        if (err) {
            res.send(err);
        }
        res.end();
    });
}

//add more controller functions, to be called when a user requests a specific
//route. each function will call the 'model', perform whatever calculations are
//necessary, and send the response to the client