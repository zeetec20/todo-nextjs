import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import Joi from 'joi'
import Todo from '../../../models/Todo'
import User from '../../../models/User'
import jwtAuth from '../../../middleware/jwt_auth'
import * as uuid from 'uuid'
import { nanoid } from 'nanoid'
import AuthService from '../../../service/auth'
import ShortUrl from '../../../service/short_url'

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    switch (req.method) {
        case 'GET':
            return await getAll(req, res)

        case 'POST':
            return await add(req, res)

        default:
            return res.status(405).end()
    }
}

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization!.replace('Bearer ', '')
    const result = AuthService.decodeToken(token)!
    const user = await User.findOne({
        where: {
            email: JSON.parse(JSON.stringify(result)).email
        }
    })
    const todoAll = await Todo.findAll({
        order: [['createdAt', 'DESC']], 
        where: {
            user: user!.toJSON().id
        }
    })
    return res.status(200).json(todoAll)
}

const add = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        tag: Joi.string().allow('')
    })
    const validate = schema.validate(body)
    if (validate.error) return res.status(400).json({
        'error': 'Body invalid'
    })
    console.log(body)
    const token = req.headers.authorization!.replace('Bearer ', '')
    const result = AuthService.decodeToken(token)!
    const user = await User.findOne({
        where: {
            email: JSON.parse(JSON.stringify(result)).email
        }
    })
    const slug = `${(body.title as string).toLowerCase().replace(/[^\w\s]/gi, '').replaceAll(' ', '-')}-${uuid.v4()}`
    const short_url = await ShortUrl.generateUniqeId()
    Todo.create({
        ...body,
        user: user!.toJSON().id,
        slug: slug,
        shortUrl: short_url
    })
    return res.status(201).end()
}

export default jwtAuth(handler)