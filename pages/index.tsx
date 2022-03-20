import { Box, Button, Container, Flex, Heading, Icon, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import type { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType, InferGetStaticPropsType, NextPage } from 'next'
import Navbar from '../component/navbar'
import Link from 'next/link'
import color from '../component/color'
import AuthService from '../service/auth'

const Home: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const size: {width: undefined | number, height: undefined | number} = props.size

  return (
    <>
      <Navbar auth={props.auth} size={size} />
      <Flex bgColor={color.color3}>
        <Container maxW={'3xl'} minHeight={'95vh'}>
          <Stack
            as={Box}
            textAlign={'center'}
            spacing={{ base: 8, md: 14 }}
            py={{ base: 20, md: 36 }}>
            <Heading
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}>
              Manage Your Task <br />
              <Text as={'span'} color={'green.400'}>
                For Best Result
              </Text>
            </Heading>
            <Text color={'gray.500'}>
              Todo App can make your task management more easier than other task management and flexible system you can do it in all work.
            </Text>
            <Stack
              direction={'column'}
              spacing={3}
              align={'center'}
              alignSelf={'center'}
              position={'relative'}>
              <Link href={props.auth ? '/todo' : '/login'} passHref>
                <Button
                  colorScheme={'green'}
                  bg={'green.400'}
                  rounded={'full'}
                  px={6}
                  _hover={{
                    bg: 'green.500',
                  }}>
                  Create To Do
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Flex>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await AuthService.isAuthenticated(context.req, context.res)
  return {
    props: {
      auth
    }
  }
}
