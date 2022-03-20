import type { NextApiRequest, NextApiResponse } from 'next'
import mySql from 'mysql'
import Joi from 'joi'
import User from '../../../models/User'
import bcrypt from 'bcrypt'

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            const body = req.body
            const validate = schema.validate(body)
            if (validate.error) return res.status(400).json({
                'error': 'Body invalid'
            })
            body.password = await bcrypt.hash(body.password, await bcrypt.genSalt())
            const existUser = await User.findOne({
                where: {
                    email: validate.value.email
                }
            })
            if (existUser) return res.status(409).json({
                'error': 'User already registered'
            })
            
            await User.create(body)
            return res.status(201).end()
            
        default:
            return res.status(405).end()
    }
}
