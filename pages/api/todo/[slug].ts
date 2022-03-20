import Joi from "joi"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import jwtAuth from "../../../middleware/jwt_auth"
import Todo from "../../../models/Todo"

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    const {slug} = req.query
    switch (req.method) {
        case 'GET':
            return await get(req, res, slug.toString())

        case 'POST':
            return await moveTodo(req, res, slug.toString())

        case 'PUT':
            return await update(req, res, slug.toString())
        
        case 'DELETE':
            return await deleteTodo(req, res, slug.toString())
    
        default:
            return res.status(405).end()
    }
}

const get = async (req: NextApiRequest, res: NextApiResponse, slug: string) => {
    const todo = await Todo.findOne({
        where: {
            slug: slug
        }
    })
    if (!todo) return res.status(404).end()
    return res.status(200).json(todo)
}

const deleteTodo = async (req: NextApiRequest, res: NextApiResponse, slug: string) => {
    await Todo.destroy({
        where: {
            slug: slug
        }
    })
    return res.status(204).end()
}

const update = async (req: NextApiRequest, res: NextApiResponse, slug: string) => {
    const body = req.body
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        tag: Joi.string()
    })
    const validate = schema.validate(body)
    if (validate.error) return res.status(400).json({
        'error': 'Body invalid'
    })
    if (!('tag' in body)) body.tag = null
    await Todo.update(
        {
            title: body.title,
            description: body.description,
            tag: body.tag
        },
        {
            where: {
                slug: slug
            }
        }
    )
    return res.status(204).end()
}

const moveTodo = async (req: NextApiRequest, res: NextApiResponse, slug: string) => {
    const body = req.body
    const schema = Joi.object({
        status: Joi.string().required()
    })
    const validate = schema.validate(body)
    if (validate.error) return res.status(400).json({
        'error': 'Body invalid'
    })
    if (!(body.status == 'todo' || body.status == 'doing' || body.status == 'done')) return res.status(400).json({
        'error': 'Body invalid'
    })

    await Todo.update(
        {
            status: body.status
        }, 
        {
            where: {
                slug: slug
            }
        }
    )
    return res.status(204).end()
}

export default jwtAuth(handler)