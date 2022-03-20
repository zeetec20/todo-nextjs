import {getCookie} from 'cookies-next'

export interface TodoResult {
    success: boolean,
    message?: string,
    todo?: Todo | Todo[]
}

export interface Todo {
    id: number,
    title: string,
    description: string,
    tag?: string,
    status: string,
    slug: string,
    shortUrl: string,
    createdAt: string,
    updatedAt: string
}

export default class TodoService {
    static async get(slug: string, req?: any, res?: any): Promise<TodoResult> {
        const token = getCookie('token', {req: req, res: res})
        const response = await fetch(`${process.env.DOMAIN}/api/todo/${slug}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        if (response.status == 200) {
            return {
                success: true,
                todo: await response.json()
            }
        }
        return {
            success: false,
            message: 'Something wrong in system'
        }
    }

    static async getAll(req?: any, res?: any): Promise<TodoResult> {
        const token = getCookie('token', {req: req, res: res})
        const response = await fetch(`${process.env.DOMAIN}/api/todo`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        if (response.status == 200) {
            return {
                success: true,
                todo: await response.json()
            }
        }
        return {
            success: false,
            message: 'Something wrong in system'
        }
    }

    static async add(title: string, description: string, tags: string[]): Promise<TodoResult> {
        const token = getCookie('token')
        const body: any = {
            title,
            description,
        }
        if (tags.length != 0) body.tag = tags.toString()
        const response = await fetch(`${process.env.DOMAIN}/api/todo`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify(body)
        })
        if (response.status == 201) return {
            success: true,
        }
        
        const json = await response.json()
        return {
            success: false,
            message: json.error
        }
    }

    static async delete(slug: string): Promise<TodoResult> {
        const token = getCookie('token')
        const response = await fetch(`${process.env.DOMAIN}/api/todo/${slug}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'DELETE'
        })
        if (response.status == 204) return {
            success: true
        }
        return {
            success: false,
            message: 'Something wrong in system'
        }
    }

    static async update(slug: string, title: string, description: string, tag?: string[]): Promise<TodoResult> {
        const token = getCookie('token')
        const body: any = {
            title,
            description   
        }
        if (tag != null && tag.length != 0) body.tag = tag!.toString()
        const response = await fetch(`${process.env.DOMAIN}/api/todo/${slug}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'PUT',
            body: JSON.stringify(body)
        })
        if (response.status == 204) return {
            success: true
        }
        return {
            success: false,
            message: 'Something wrong in system'
        }
    }
    
    static async moveTodo(slug: string, status: 'todo' | 'doing' | 'done'): Promise<TodoResult> {
        const token = getCookie('token')
        const response = await fetch(`${process.env.DOMAIN}/api/todo/${slug}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify({
               status: status
            })
        })
        if (response.status == 204) return {
            success: true
        }
        return {
            success: false,
            message: 'Something wrong in system'
        }
    }
}