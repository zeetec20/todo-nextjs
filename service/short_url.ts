import {nanoid, customAlphabet} from 'nanoid'
import Todo from '../models/Todo'
import TodoService from './todo'

export default class ShortUrl {
    static async generateUniqeId(): Promise<string> {
        return await (new Promise<string>(async (resolve, reject) => {
            let loop = true
            const short_url = (await Todo.findAll()).map(todo => {
                return todo.toJSON().shortUrl
            })
            while (loop) {
                const short_url_new = `/t/${nanoid(8)}`
                console.log(short_url.filter(url => url == short_url_new).length == 0)
                if (short_url.filter(url => url == short_url_new).length == 0) {
                    resolve(short_url_new)
                    loop = false
                }   
            }
        }))
    }

    static async shortUrlToSlug(short_url: string): Promise<string | null> {
        const todo = await Todo.findOne({
            where: {
                shortUrl: short_url
            }
        })
        if (todo) return todo.toJSON().slug
        return null
    }
}