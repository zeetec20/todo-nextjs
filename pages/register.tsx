import { Box, Button, Checkbox, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, Link as LinkChakra, Text, Center, toast, useToast } from "@chakra-ui/react";
import { setCookies } from "cookies-next";
import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { FormEvent } from "react";
import color from '../component/color'
import Navbar from '../component/navbar'
import AuthService from '../service/auth'

const Register: NextPage = (props: any) => {
    const size: {width: undefined | number, height: undefined | number} = props.size
    const router = useRouter()
    const toast = useToast({
        isClosable: true,
        position: 'top-right'
    })

    const submit = async (event: FormEvent<HTMLFormElement>, router: NextRouter) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const result = await AuthService.register(formData.get('name')!.toString(), formData.get('email')!.toString(), formData.get('password')!.toString())
        if (result.succces) {
            setCookies('toast_alert', {
                status: 'success',
                title: 'Sign Up',
                description: 'You successfully create user'
            })
            return router.push('/login')
        } 
        return toast({
            status: 'error',
            title: 'Sign Up',
            description: `Failed sign up (${result.message})`
        })
    }

    return (
        <>
            <Navbar auth={false} size={size} />
            <Flex
                minH={'95vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} minWidth={'24vw'}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>Sign Up</Heading>
                        <Text fontSize={'lg'} color={'gray.600'}>
                            Please fill input correctly to create your account
                        </Text>
                    </Stack>

                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <form onSubmit={e => submit(e, router)}>
                            <Stack spacing={4}>
                                <FormControl id="name" isRequired>
                                    <FormLabel>Name</FormLabel>
                                    <Input type="text" placeholder="Name" name="name" />
                                </FormControl>
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
                                        type={'submit'}
                                        marginTop={'5'}
                                        bgColor={color.color1}
                                        color={'white'}
                                        _hover={{
                                            bgColor: color.color1_2,
                                        }}>
                                        Sign Up
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

export default Register