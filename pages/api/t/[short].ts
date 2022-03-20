import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import jwtAuth from "../../../middleware/jwt_auth"
import ShortUrl from "../../../service/short_url"

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    switch (req.method) {
        case 'GET':
            const {short} = req.query
            const slug = await ShortUrl.shortUrlToSlug(`/t/${short.toString()}`)
            if (slug) return res.status(200).json({
                'slug': slug
            })
            return res.status(404).end()
    
        default:
            return res.status(405).end()
    }
}

export default jwtAuth(handler)