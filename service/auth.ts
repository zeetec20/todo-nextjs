import moment from 'moment'
import jsonwebtoken from 'jsonwebtoken'
import { any, boolean, string } from 'joi'
import {getCookie, setCookies, removeCookies} from 'cookies-next'

interface AuthResult{
    succces: boolean,
    message?: string
}

export default class AuthService {
    static decodeToken(token: string) {
        return jsonwebtoken.decode(token)
    }

    static async verifyToken(token: string): Promise<boolean> {
        const verify = await (new Promise<boolean>((resolve, reject) => {
            jsonwebtoken.verify(token.toString(), 'secret', (err: any, decode: any) => {
                resolve(err == null)
            })
        }))
        return verify
    }

    static async isAuthenticated(req?: any, res?: any): Promise<boolean> {
        const token = (req != null && res != null) ? getCookie('token', {req: req, res: res})?.toString() : getCookie('token')?.toString()
        if (!token) return false
        return await this.verifyToken(token)
    }

    static async login(email: string, password: string): Promise<AuthResult> {
        const response = await fetch(`${process.env.DOMAIN}/api/auth/login`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        })
        if (response.body != null) {
            const json = await response.json()
            if (json.error) return {
                succces: false,
                message: json.error
            }
            const responseProfile = await fetch(`${process.env.DOMAIN}/api/auth/profile`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${json.token}`
                },
            })
            const profile = await responseProfile.json()
            setCookies('token', json.token, {
                expires: moment().add(7, 'days').toDate()
            })
            setCookies('user', profile, {
                expires: moment().add(7, 'days').toDate()
            })
            return {
                succces: true
            }
        }
        return {
            succces: false,
            message: 'Something wrong in system'
        }
    }

    static async register(name: string, email: string, password: string): Promise<AuthResult> {
        const response = await fetch(`${process.env.DOMAIN}/api/auth/register`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                password
            })
        })
        if (response.status == 201) {
            return {
                succces: true
            }
        }
        if (response.body) {
            const json = await response.json()
            if (json.error) return {
                succces: false,
                message: json.error
            }
        }
        return {
            succces: false,
            message: 'Something wrong in system'
        }
    }

    static async logout() {
        removeCookies('token')
    }
}
