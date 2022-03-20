import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/User'
import AuthService from '../../../service/auth'
import jwtAuth from '../../../middleware/jwt_auth'

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    switch (req.method) {
        case 'GET':
            const token = req.headers.authorization!.replace('Bearer ', '')
            const result = AuthService.decodeToken(token)!

            const existUser = await User.findOne({
                where: {
                    email: JSON.parse(JSON.stringify(result)).email
                }
            })
            if (!existUser) return res.status(404).end()
            const user = existUser!.toJSON()
            return res.status(200).json({
                name: user.name,
                email: user.email,
            })
    
        default:
            return res.status(405).end()
            
    }
}

export default jwtAuth(handler)