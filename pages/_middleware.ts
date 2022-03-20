import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import AuthService from '../service/auth'
import ShortUrl from "../service/short_url";
import {getCookie} from 'cookies-next'

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const auth = await AuthService.isAuthenticated(req, NextResponse)
    const url = req.nextUrl.clone()

    if ((req.page.name == '/login' || req.page.name == '/register') && auth) {
        url.pathname = '/'
        return NextResponse.redirect(url)
    }
    
    if (req.page.name == '/todo' && (!auth)) {
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    if (req.page.name == '/todo/[slug]' && (!auth)) {
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    if (url.pathname.split('/')[1] == 't' && auth) {
        const token = getCookie('token', {req: req as any, res: NextResponse as any})?.toString()
        const short_url = url.pathname.split('/')[2]
        const slug = await fetch(`${process.env.DOMAIN}/api/t/${short_url}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        url.pathname = `/`
        if (slug.status == 200) url.pathname = `/todo/${(await slug.json()).slug}`
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}