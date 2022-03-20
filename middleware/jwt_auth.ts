import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import AuthService from "../service/auth"

const jwtAuth = (handler: NextApiHandler) => { 
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const token = req.headers.authorization?.replace('Bearer ', '') ?? undefined
        if (!token) return res.status(403).end()
        if (!await AuthService.verifyToken(token)) return res.status(401).end()
        return await handler(req, res)
    }
}

export default jwtAuth