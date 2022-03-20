import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import TodoService from "../../service/todo"
import { Todo as TypeTodo } from '../../service/todo'
import Navbar from '../../component/navbar'
import color from '../../component/color'
import { Badge, Box, Button, Center, Container, Divider, Flex, Heading, IconButton, List, ListItem, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Spacer, Stack, Text } from "@chakra-ui/react"
import AuthService from "../../service/auth"
import { BsChatSquareQuote, BsThreeDotsVertical } from "react-icons/bs"
import { RiFileShredLine, RiRestartLine, RiShutDownLine, RiArrowGoBackFill } from "react-icons/ri"
import moment from "moment"
import Link from "next/link"
import {Options} from '../../component/todo'
import { useState } from "react"

const TodoSpecific = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [todo, setTodo] = useState<TypeTodo>(props.todo)
    const size: {width: undefined | number, height: undefined | number} = props.size
    let badgeColor
    let badgeText
    switch (todo.status) {
        case 'done':
            badgeColor = 'green'
            badgeText = 'Done'
            break;

        case 'doing':
            badgeColor = 'yellow'
            badgeText = 'Doing'
            break;

        case 'todo':
            badgeColor = 'blue'
            badgeText = 'Todo'
            break;
    }

    const updateTodo = async () => {
        const result = await TodoService.get(props.slug)
        setTodo(result.todo as TypeTodo)
    }

    let width_list_todo = '58%'

    if (typeof size.width == 'number') {
        if (size.width < 1230) {
            width_list_todo = '70%'
        }
    }

    return (
        <>
            <Navbar auth={props.auth} size={size} />
            <Flex minHeight={'95vh'} backgroundColor={color.color3} padding={0} margin={0}>
                <Center width={'100vw'}>
                    <List width={width_list_todo} alignSelf={'start'}>
                        <ListItem>
                            <Link href={'/todo'} passHref>
                                <Button marginTop={'12'} display={'block'} leftIcon={<RiArrowGoBackFill size={13}/>}>
                                    Back
                                </Button>
                            </Link>
                            <Flex marginTop={5}>
                                <Heading marginTop={'2'} size={'lg'}>
                                    {todo.title}
                                </Heading>
                                <Spacer/>
                                <Options todo={todo} updateListTodo={updateTodo} />
                            </Flex>
                            <Box marginTop={3}>
                                <Badge fontSize={'sm'} colorScheme={badgeColor} rounded={'md'} marginRight={3}>{badgeText}</Badge>
                                <Text display={'inline'} fontSize={13} fontWeight={'semibold'}>{moment(todo.createdAt).format('lll')}</Text>
                            </Box>
                            <Box marginTop={3}>
                            {todo.tag != null ? todo.tag.split(',').map((value, key) => <Badge key={key} marginRight={2} rounded={'md'}>{value}</Badge>) : ''}
                            </Box>
                            <Box marginTop={6} padding={4} border={'1px'} borderColor='gray.200' rounded={'md'}>
                                <Text size={'md'} dangerouslySetInnerHTML={{__html: todo.description.replace(/(?:\r\n|\r|\n)/g, '<br />')}}>
                                </Text>
                            </Box>
                            <Divider marginTop={4}/>
                        </ListItem>
                    </List>
                </Center>
            </Flex>
        </>
    )
}

export default TodoSpecific

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.query
    const auth = await AuthService.isAuthenticated(context.req, context.res)
    const result = await TodoService.get(slug!.toString(), context.req, context.res)
    return {
        props: {
            auth: auth,
            todo: result.todo,
            slug: slug
        }
    }
}