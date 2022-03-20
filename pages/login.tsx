import { Box, Button, Checkbox, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, Link as LinkChakra, Text, useToast } from "@chakra-ui/react";
import { Formik } from "formik";
import { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import { NextRouter, useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import color from '../component/color'
import AuthService from "../service/auth";
import Navbar from '../component/navbar'
import { getCookie, removeCookies } from "cookies-next";

const Login: NextPage = (props: any) => {
    const size: {width: undefined | number, height: undefined | number} = props.size
    const router = useRouter()
    const toast = useToast({
        position: 'top-right',
        isClosable: true
    })
    const [loadingSignIn, setLoadingSignIn] = useState(false)

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoadingSignIn(true)
        const formData = new FormData(event.currentTarget)
        const result = await AuthService.login(formData.get('email')!.toString(), formData.get('password')!.toString())
        if (result.succces) {
            setLoadingSignIn(false)
            return router.push('/todo')
        }
        setLoadingSignIn(false)
        return toast({
            status: 'error',
            title: 'Sign In',
            description: `Failed sign in (${result.message})`
        })
        
    }

    const toast_alert = () => {
        const toast_alert = getCookie('toast_alert')?.toString() ?? undefined
        if (toast_alert) {
            removeCookies('toast_alert')
            const json = JSON.parse(toast_alert)
            toast({
                status: json.status,
                title: json.title,
                description: json.description
            })
        }
    }
    
    useEffect(() => {
        toast_alert()
    })

    return (
        <>
            <Navbar auth={false} size={size} />
            <Flex
                minH={'95vh'}
                align={'center'}
                justify={'center'}
                bg={'gray.50'}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} width={'24vw'}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>Sign In</Heading>
                        <Text fontSize={'lg'} color={'gray.600'}>
                            Do you already to manage your task today ?
                        </Text>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <form action="" onSubmit={e => submit(e)}>
                            <Stack spacing={4}>
                                <FormControl id="email" isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input type="email" placeholder="Email" name="email" />
                                </FormControl>
                                <FormControl id="password" isRequired>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" placeholder="Password" name="password" />
                                </FormControl>
                                <Stack spacing={10}>
                                    <Button
                                        isLoading={loadingSignIn}
                                        loadingText={'Sign In...'}
                                        marginTop={'5'}
                                        bgColor={color.color1}
                                        color={'white'}
                                        type={'submit'}
                                        _hover={{
                                            bgColor: color.color1_2,
                                        }}>
                                        Sign In
                                    </Button>
                                </Stack>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Flex>
        </>
    )
}

export default Login