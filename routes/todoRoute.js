const Models = require('../models/index')
const Joi = require('@hapi/joi')
let response_ok= 200
let response_not_found= 404
const todosHandler = async (request,h)=> {
    try {
        const todos = await Models.Todos.findAll({})
        console.log(todos.length)
        if(todos.length==0){
            return {  
                haha: todos,
                statusCode: response_not_found,
                error: 'Not Found',
                message: 'Not Found'
            }
        }else{
            return { 
                data: todos, 
                statusCode: response_ok,
                error: '',
                message: 'select * from Todos'
            }
        }
    }catch (error) {
        return h.response({ error: error.message }).code(400)
    }
}

const createTodoHandler = async (request,h) => {
    try {
        const {titleReq, descriptionReq, userIdReq, completedReq, dateReq,emailReq} = request.payload;
        console.log(request.payload);
        const todo = await Models.Todos.create({
            title: titleReq,
            description: descriptionReq,
            userId: userIdReq,
            completed: completedReq,
            dateActivity: dateReq,
            email: emailReq
        })
        return{
            data: todo,
            statusCode: response_ok,
            error: '',
            message: 'New todo has been created.'
        }
    }catch (error){
        return h.response({
            error: error.message
        }).code(400)
    }
}

const updateTodoHandler = async (request, h) => {
    try{
        const todo_id = request.params.id;
        const { titleReq, descriptionReq, completedReq, dateReq, userIdReq, emailReq} = request.payload;
        const todos = await Models.Todos.update({
            title: titleReq,
            description: descriptionReq,
            userId: userIdReq,
            completed: completedReq,
            dateActivity: dateReq,
            email: emailReq
        },{
            where:{
                id: todo_id
            }
        })
        const dataRequest = request.payload
        console.log('dataRequest');
        console.log(todos);
        return{
            data: dataRequest,
            statusCode: response_ok,
            error: '',
            message: 'Todo hass been updated'
        }
    } catch (error){
        return h.response({
            error: error.message
        }).code(400)
    }
}

const deleteTodoHandler = async (request,h) => {
    try{
        const todo_id = request.params.id;
        await Models.Todos.destroy({
            where:{
                id: todo_id
            }
        })
        return { 
            statusCode: response_ok,
            error: '',
            message: 'Todo has been deleted.' }
    } catch (error){
        return h.response({
            error: error.message
        }).code(400)
    }
}

module.exports = [
    { method: 'GET', path: '/todos', handler: todosHandler},
    { 
        method: 'POST', 
        path: '/todo', 
        options:{
            validate:{
                payload:{
                    titleReq: Joi.required(), 
                    descriptionReq: Joi.required(), 
                    userIdReq: Joi.required(), 
                    completedReq: Joi.number().required().max(1).min(0),
                    dateReq: Joi.date().required(),
                    emailReq: Joi.string().email().required()
                }
            }
        },
        handler: createTodoHandler},
    { 
        method: 'PUT', 
        path: '/todo/{id}', 
        options:{
            validate:{
                payload:{
                    titleReq: Joi.required(), 
                    descriptionReq: Joi.required(), 
                    userIdReq: Joi.required(), 
                    completedReq: Joi.number().required().max(1).min(0),
                    dateReq: Joi.date().required(),
                    emailReq: Joi.string().email().required()
                }
            }
        },
        handler: updateTodoHandler},
    { method: 'DELETE', path: '/todo/{id}', handler: deleteTodoHandler}
]