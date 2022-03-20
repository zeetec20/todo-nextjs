import React from "react";
import Navbar from './navbar'
import AuthService from '../service/auth'
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";

const Layout = (props: {children: React.ReactNode}) => {
    return (
        <>
            <Head>
                <title>
                    Todo App
                </title>
            </Head>
            {props.children}
        </>
    )
}

export default Layout