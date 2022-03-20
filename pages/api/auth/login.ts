import type { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/User'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'

const schema = Joi.object({
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

            const existUser = await User.findOne({
                where: {
                    email: validate.value.email
                }
            })
            if (!existUser) return res.status(409).json({
                'error': 'Email or password incorrect'
            })
            
            if (await bcrypt.compare(body.password, existUser.toJSON().password)) {
                const token = jsonwebtoken.sign({
                    email: body.email
                }, 'secret', {expiresIn: '7d'})
                return res.status(200).json({
                    'token': token
                })
            }
            return res.status(401).json({
                'error': 'Email or password incorrect'
            })
    
        default:
            return res.status(405).end()
            
    }
}
