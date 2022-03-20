import {
    Center,
    Flex,
    List,
    ListItem,
    Heading,
    Divider,
    Spacer,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    ModalFooter,
    useDisclosure,
    Container,
    useToast,
    Textarea
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import color from '../../component/color'
import { FormEvent, SyntheticEvent, useCallback, useState } from "react";
import Navbar from '../../component/navbar'
import AuthService from "../../service/auth";
import TodoCom from '../../component/todo'
import ChakraTagInput from '../../component/ChakraTagInput'
import TodoService, { Todo as TypeTodo } from "../../service/todo";

const Todo: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [listTodo, setListTodo] = useState<TypeTodo[]>(props.todo.todo)
    const [listDoing, setListDoing] = useState<TypeTodo[]>(props.todo.doing)
    const [listDone, setListDone] = useState<TypeTodo[]>(props.todo.done)
    const [loadingCreate, setLoadingCreate] = useState(false)
    const controlCreate = useDisclosure()
    const isOpenCreate = controlCreate.isOpen
    const onOpenCreate = controlCreate.onOpen
    const onCloseCreate = controlCreate.onClose
    const [tags, setTags] = useState<string[]>()
    const size: {width: undefined | number, height: undefined | number} = props.size
    const handleTagsChange = useCallback((event: SyntheticEvent, tags: string[]) => {
        setTags(tags)
    }, [])
    const toast = useToast({
        isClosable: true,
        position: 'top-right'
    })

    const updateListTodo = async () => {
        const resultTodo = await TodoService.getAll()
        const list = separatedTodo(resultTodo!.todo as TypeTodo[])
        setListTodo(list.todo)
        setListDoing(list.doing)
        setListDone(list.done)
    }

    const addTodo = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        setLoadingCreate(true)
        const formData = new FormData(form)
        const result = await TodoService.add(formData.get('title')!.toString(), formData.get('description')!.toString(), tags ?? [])
        setLoadingCreate(false)
        if (result.success) {
            onCloseCreate()
            form.reset()
            setTags([])
            await updateListTodo()
            return toast({
                status: 'success',
                title: 'Add Todo',
                description: 'Successfully added todo'
            })
        }
        return toast({
            status: 'error',
            title: 'Add Todo',
            description: `Add todo failed (${result.message})`
        })
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
            <Flex minHeight={'95vh'} backgroundColor={color.color3} align={'center'} padding={0} margin={0}>
                <Center width={'100vw'}>
                    <List width={width_list_todo}>
                        <ListItem>
                            <Heading marginTop={'16'}>
                                Hi Firman don&apos;t forget to clear all you task 😊
                            </Heading>
                            <Text fontSize={20} fontWeight={'bold'} marginTop={3}>
                                Or any new task ? <Button size={'sm'} marginLeft={3} textColor={color.color1} outlineColor={color.color1} onClick={onOpenCreate}>New Todo</Button>
                            </Text>
                        </ListItem>

                        <ListItem>
                            <ListTodo list={listTodo} updateListTodo={updateListTodo} size={size} />
                        </ListItem>

                        <ListItem>
                            <ListDoing list={listDoing} updateListTodo={updateListTodo} size={size} />
                        </ListItem>

                        <ListItem>
                            <ListDone list={listDone} updateListTodo={updateListTodo} size={size} />
                        </ListItem>

                        <ListItem>
                            <Spacer height={'28'} />
                        </ListItem>
                    </List>
                </Center>
            </Flex>

            <Modal
                isOpen={isOpenCreate}
                onClose={onCloseCreate}
            >
                <ModalOverlay />
                <ModalContent maxW={'50vw'}>
                    <form onSubmit={e => addTodo(e)}>
                        <ModalHeader>New Todo</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl isRequired>
                                <FormLabel htmlFor={'title'}>Title</FormLabel>
                                <Input id={'title'} placeholder='Title' name="title" />
                            </FormControl>
                            <FormControl mt={4} isRequired>
                                <FormLabel htmlFor={'description'}>Description</FormLabel>
                                <Textarea id={'description'} placeholder='Description' name="description" />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Tag</FormLabel>
                                <ChakraTagInput tags={tags} onTagsChange={handleTagsChange} placeholder={'Tag'} />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='green' mr={3} type='submit' isLoading={loadingCreate}>Add Todo</Button>
                            <Button onClick={onCloseCreate}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}

const ListTodo = ({ list, updateListTodo, size}: { list: TypeTodo[], updateListTodo: {(): Promise<void>}, size: {width: undefined | number, height: undefined | number} }) => {
    return (
        <>
            <Heading marginTop={'16'} id={'todo'}>
                List Todo
            </Heading>
            <List spacing={4} marginTop={7}>
                {list.map((todo, key) => (
                    <ListItem key={key}>
                        <TodoCom
                            todo={todo}
                            updateListTodo={updateListTodo}
                            size={size}
                        />
                    </ListItem>
                ))}
                {list.length == 0 ? <Text align={'center'} color='gray'>List todo empty, don&apos;t forget to manage all your task, for best result</Text> : ''}
            </List>
            <Divider marginTop={8} />
        </>
    )
}

const ListDoing = ({ list, updateListTodo, size}: { list: TypeTodo[], updateListTodo: {(): Promise<void>}, size: {width: undefined | number, height: undefined | number} }) => {
    return (
        <>
            <Heading marginTop={'16'} id={'doing'}>
                List Doing
            </Heading>
            <List spacing={4} marginTop={7}>
                {list.map((todo, key) => (
                    <ListItem key={key}>
                        <TodoCom
                            todo={todo}
                            updateListTodo={updateListTodo}
                            size={size}
                        />
                    </ListItem>
                ))}
                {list.length == 0 ? <Text align={'center'} color='gray'>List doing empty, please move your task to doing to start work</Text> : ''}
            </List>
            <Divider marginTop={8} />
        </>
    )
}

const ListDone = ({ list, updateListTodo, size}: { list: TypeTodo[], updateListTodo: {(): Promise<void>}, size: {width: undefined | number, height: undefined | number} }) => {
    return (
        <>
            <Heading marginTop={'16'} id={'done'}>
                List Done
            </Heading>
            <List spacing={4} marginTop={7}>
                {list.map((todo, key) => (
                    <ListItem key={key}>
                        <TodoCom
                            todo={todo}
                            updateListTodo={updateListTodo}
                            size={size}
                        />
                    </ListItem>
                ))}
                {list.length == 0 ? <Text align={'center'} color='gray'>List done empty, don&apos;t forget to finish all your task on doing</Text> : ''}
            </List>
            <Divider marginTop={8} />
        </>
    )
}

export default Todo

export const getServerSideProps: GetServerSideProps = async (context) => {
    const auth = await AuthService.isAuthenticated(context.req, context.res)
    const todo = await TodoService.getAll(context.req, context.res)

    return {
        props: {
            auth,
            todo: {
                ...separatedTodo(todo!.todo as TypeTodo[])
            }
        }
    }
}

const separatedTodo = (todo: TypeTodo[]) => {
    return {
        todo: todo.filter((e: TypeTodo) => e.status == 'todo'),
        doing: todo.filter((e: TypeTodo) => e.status == 'doing'),
        done: todo.filter((e: TypeTodo) => e.status == 'done')
    }
}
