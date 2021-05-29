'use strict';
const fs = require('fs');
const lockFile = require('lockfile')

//where tasks are stored
const tasksFile = './model/tasks.json'

const lock = './model/lock-file'

let id=4;
let data = fs.readFileSync(tasksFile)
id = JSON.parse(data).tasks.slice(-1)[0].id + 1;

//Δημιουργός (constructor) ενός αντικειμένου τύπου Task
//Αν περαστεί ένα μόνο όρισμα, τότε τα άλλα δύο 
//status=0 σημαίνει η εργασία είναι ενεργή, 1 σημαίνει έχει ολοκληρωθεί 
//Constructor for a Task object. status 0 means that the task is active,
//status 1 means task is completed (striked-through)
exports.Task = function (taskName, status = 0, created_at = '') {
    this.task = taskName;
    this.status = status;  //0 -> active, 1 -> completed
    this.created_at = created_at; //date of creation
    // new Date().toISOString().replace('T',' ').slice(0,19)
}

//Προβολή όλων των εργασιών - show all tasks
exports.getAllTasks = function (callback) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(tasksFile, (err, data) => {
                lockFile.unlockSync(lock)
                if (err) {
                    callback(err)
                }
                callback(null, JSON.parse(data))
            })
        }
    })
}

//Προσθήκη εργασίας - Add a new task
exports.addTask = function (newTask, result) {
    //Συμπληρώστε - Code here 
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            result(err)
        }
        else {
            fs.readFile(tasksFile, (err, data) => {
                if (err) {
                    lockFile.unlockSync(lock)
                    result(err)
                }
                const obj = JSON.parse(data); //now it an object

                obj['tasks'].push({
                    'id' : id++,
                    'task' : this.task, 
                    'status' : this.status,
                    'created_at' : this.created_at
                }); //add some data
                const json = JSON.stringify(obj); //convert it back to json
                fs.writeFile(tasksFile, json, 'utf8', (err) => {
                    if (err) return console.log(err);
                }); // write it back 
                lockFile.unlockSync(lock)
                result(null)
            })
        }
    })
}

//Αφαίρεση μιας εργασίας - remove a task
exports.removeTask = function (taskId, result) {
    // setTimeout( f(), 3000);
    // function f() {
    lockFile.lock(lock, {"wait" : 1000}, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            result(err)
        }
        else {
            if (taskId == -1) {
                const json = JSON.stringify({"tasks":[]}); //convert it back to json
                fs.writeFile(tasksFile, json, 'utf8', (err) => {
                    if (err) {
                        lockFile.unlockSync(lock) 
                        result(err);
                    }
                }); // write it back 
                id = 1
                lockFile.unlockSync(lock)
                result(null)
            }
            else {
                fs.readFile(tasksFile, (err, data) => {
                    if (err) {
                        lockFile.unlockSync(lock)
                        result(err)
                    }
                    const obj = JSON.parse(data); //now it an object
                    for( let i = 0; i < obj.tasks.length; i++){ 
                                    
                        if ( obj.tasks[i].id === taskId) { 
                            obj.tasks.splice(i, 1); 
                            break
                        }
                    }
                    if (obj.tasks.length != 0) {
                        id = obj.tasks.slice(-1)[0].id + 1
                    }
                    else {
                        id = 1
                    }
                    // const task = obj.tasks.find(el => el.id === taskId)
                    // task.status = task.status === 0 ? 1 : 0;

                    const json = JSON.stringify(obj); //convert it back to json
                    fs.writeFile(tasksFile, json, 'utf8', (err) => {
                        if (err) {
                            lockFile.unlockSync(lock) 
                            result(err);
                        } 
                    }); // write it back 
                    lockFile.unlockSync(lock)
                    result(null)
                })
            }
        }
    })
    // 
}


//Αλλαγή της κατάστασης μιας εργασίας - toggle task status
exports.toggleTask = function (taskId, result) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            result(err)
        }
        else {
            fs.readFile(tasksFile, (err, data) => {
                if (err) {
                    lockFile.unlockSync(lock)
                    result(err)
                }
                const obj = JSON.parse(data); //now it an object
                const task = obj.tasks.find(el => el.id === taskId)
                if (task==undefined) {
                    lockFile.unlockSync(lock)
                    result(null)
                }
                else {
                    task.status = task.status === 0 ? 1 : 0;

                const json = JSON.stringify(obj); //convert it back to json
                fs.writeFile(tasksFile, json, 'utf8', (err) => {
                    if (err) {
                        lockFile.unlockSync(lock)
                        result(err)
                    };
                }); // write it back 
                lockFile.unlockSync(lock)
                result(null)
                }
                
            })
        }
    })
}