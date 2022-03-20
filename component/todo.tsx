import { Badge, Box, Button, Divider, Flex, FormControl, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Spacer, Stack, Text, Textarea, useDisclosure, useToast } from "@chakra-ui/react"
import { EventHandler, FormEvent, FormEventHandler, SyntheticEvent, useCallback, useEffect, useState } from "react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { RiEditLine, RiEraserLine, RiFileTextLine, RiFileCopy2Line } from "react-icons/ri"
import TodoService, { Todo as TypeTodo } from '../service/todo'
import color from '../component/color'
import ChakraTagInput from "./ChakraTagInput"
import Link from "next/link"
import moment from "moment"
import copy from 'clipboard-copy'

const Todo = ({ todo, updateListTodo, size}: { todo: TypeTodo, updateListTodo: { (): Promise<void> }, size: {width: undefined | number, height: undefined | number}}) => {
    let statusTodo
    let statusTodoColor
    switch (todo.status) {
        case 'todo':
            statusTodo = 'Todo'
            statusTodoColor = 'blue'
            break;
        case 'doing':
            statusTodo = 'Doing'
            statusTodoColor = 'yellow'
            break;
        case 'done':
            statusTodo = 'Done',
                statusTodoColor = 'green'
            break;
    }

    return (
        <Link href={`/todo/${todo.slug}`} passHref>
            <Box boxShadow={'lg'} padding={5} rounded={'lg'} cursor='pointer'>
                <Flex>
                    <Box marginTop={2}>
                        <Heading size={'sm'}>
                            {todo.title}
                        </Heading>
                        {todo.tag != null ? todo.tag.split(',').map((value, key) => <Badge key={key} marginRight={2} marginTop={1} rounded={'md'}>{value}</Badge>) : ''}
                    </Box>
                    <Spacer />
                    <Options todo={{ ...todo }} updateListTodo={updateListTodo} />
                </Flex>
                <Flex>
                    <Text marginTop={todo.tag != null ? 2.5 : 0} fontSize={14} dangerouslySetInnerHTML={{__html: todo.description.replace(/(?:\r\n|\r|\n)/g, '<br />')}} />
                </Flex>

                <Flex marginTop={5} width={'100%'}>
                    <Badge colorScheme={statusTodoColor} rounded='md'>{statusTodo}</Badge>
                    <Spacer />
                    <Text fontSize={13} fontWeight={'semibold'}>{moment(todo.createdAt).format('lll')}</Text>
                </Flex>
            </Box>
        </Link>
    )
}

export const Options = ({ todo, updateListTodo }: { todo: TypeTodo, updateListTodo: { (): Promise<void> } }) => {
    const controlUpdate = useDisclosure()
    const controlDelete = useDisclosure()
    const popoverOption = useDisclosure()
    const isOpenUpdate = controlUpdate.isOpen
    const onOpenUpdate = controlUpdate.onOpen
    const onCloseUpdate = controlUpdate.onClose
    const isOpenDelete = controlDelete.isOpen
    const onOpenDelete = controlDelete.onOpen
    const onCloseDelete = controlDelete.onClose
    const isOnpenPopoverOption = popoverOption.isOpen
    const onOpenPopoverOption = popoverOption.onOpen
    const onClosePopoverOption = popoverOption.onClose
    const [titleUpdate, setTitleUpdate] = useState<string>(todo.title)
    const [descriptionUpdate, setDescriptionUpdate] = useState<string>(todo.description)
    const toast = useToast({
        isClosable: true,
        position: 'top-right'
    })
    const [tags, setTags] = useState<string[]>(todo.tag != null && todo.tag != '' ? todo.tag!.split(', ') : [])
    const handleTagsChange = useCallback((event: SyntheticEvent, tags: string[]) => {
        setTags(tags)
    }, [])

    useEffect(() => {
        setTitleUpdate(todo.title)
        setDescriptionUpdate(todo.description)
        if (todo.tag != null) setTags(todo.tag!.split(','))
    }, [todo])

    const deleteTodo = async () => {
        const result = await TodoService.delete(todo.slug)
        if (result.success) {
            await updateListTodo()
            onCloseDelete()
            return toast({
                status: 'success',
                title: 'Delete Todo',
                description: 'Your todo successfully deleted'
            })
        }
        return toast({
            status: 'error',
            title: 'Delete Todo',
            description: `Delete todo failed (${result.message})`
        })
    }

    const update = async (event: FormEvent<HTMLFormElement>) => {
        console.log(todo)
        console.log(tags, 'test tag')
        event.preventDefault()
        const result = await TodoService.update(todo.slug, titleUpdate, descriptionUpdate, tags)
        if (result.success) {
            await updateListTodo()
            onCloseUpdate()
            return toast({
                status: 'success',
                title: 'Update Todo',
                description: 'Your todo successfully updated'
            })
        }
        return toast({
            status: 'error',
            title: 'Delete Todo',
            description: `Delete todo failed (${result.message})`
        })
    }

    const moveTodo = async (status: 'todo' | 'doing' | 'done') => {
        const result = await TodoService.moveTodo(todo.slug, status)
        if (result.success) {
            await updateListTodo()
            onClosePopoverOption()
            return toast({
                status: 'success',
                title: 'Move Todo',
                description: `Your todo successfully moved to ${status}`
            })
        }
        onClosePopoverOption()
        return toast({
            status: 'error',
            title: 'Move Todo',
            description: `Move todo failed (${result.message})`
        })
    }

    const copy_short_url = async () => {
        await copy(`${process.env.DOMAIN}${todo.shortUrl}`)
        onClosePopoverOption()
        toast({
            status: 'success',
            title: 'Copy Short Url',
            description: 'Short url copied'
        })
    }

    return (
        <>
            <Flex justifyContent="center" ml={5} onClick={e => e.preventDefault()}>
                <Popover isOpen={isOnpenPopoverOption} onOpen={onOpenPopoverOption} onClose={onClosePopoverOption} placement="bottom" isLazy>
                    <PopoverTrigger>
                        <IconButton
                            aria-label="More server options"
                            icon={<BsThreeDotsVertical />}
                            variant="solid"
                            w="fit-content"
                        />
                    </PopoverTrigger>
                    <PopoverContent w="fit-content" _focus={{ boxShadow: 'none' }}>
                        <PopoverArrow />
                        <PopoverBody>
                            <Stack>
                                <Button
                                    onClick={onOpenUpdate}
                                    w="194px"
                                    variant="ghost"
                                    rightIcon={<RiEditLine />}
                                    justifyContent="space-between"
                                    fontWeight="normal"
                                    colorScheme="blue"
                                    fontSize="sm">
                                    Update
                                </Button>
                                <Button
                                    onClick={onOpenDelete}
                                    w="194px"
                                    variant="ghost"
                                    rightIcon={<RiEraserLine />}
                                    justifyContent="space-between"
                                    fontWeight="normal"
                                    colorScheme="red"
                                    fontSize="sm">
                                    Delete
                                </Button>
                                <Divider />
                                {
                                    todo.status != 'todo' ? 
                                    <Button
                                        onClick={() => moveTodo('todo')}
                                        w="194px"
                                        variant="ghost"
                                        rightIcon={<RiFileTextLine />}
                                        justifyContent="space-between"
                                        fontWeight="normal"
                                        colorScheme="blue"
                                        fontSize="sm">
                                        Move to Todo
                                    </Button> : ''
                                }
                                {
                                    todo.status != 'doing' ?
                                    <Button
                                        onClick={() => moveTodo('doing')}
                                        w="194px"
                                        variant="ghost"
                                        rightIcon={<RiFileTextLine />}
                                        justifyContent="space-between"
                                        fontWeight="normal"
                                        colorScheme="yellow"
                                        fontSize="sm">
                                        Move to Doing
                                    </Button> : ''
                                }
                                {
                                    todo.status != 'done' ?
                                    <Button
                                        onClick={() => moveTodo('done')}
                                        w="194px"
                                        variant="ghost"
                                        rightIcon={<RiFileTextLine />}
                                        justifyContent="space-between"
                                        fontWeight="normal"
                                        colorScheme="green"
                                        fontSize="sm">
                                        Move to Done
                                    </Button> : ''
                                }
                                <Button
                                    onClick={() => copy_short_url()}
                                    w="194px"
                                    variant="ghost"
                                    rightIcon={<RiFileCopy2Line />}
                                    justifyContent="space-between"
                                    fontWeight="normal"
                                    colorScheme="green"
                                    fontSize="sm">
                                    Copy short url
                                </Button>
                            </Stack>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Flex>

            <Modal
                isOpen={isOpenUpdate}
                onClose={onCloseUpdate}
            >
                <ModalOverlay />
                <ModalContent maxW={'50vw'}>
                    <form onSubmit={e => update(e)}>
                        <ModalHeader>Update Todo</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl isRequired>
                                <FormLabel htmlFor={'title'}>Title</FormLabel>
                                <Input id={'title'} placeholder='Title' name="title" value={titleUpdate} onChange={e => setTitleUpdate(e.target.value)} />
                            </FormControl>

                            <FormControl mt={4} isRequired>
                                <FormLabel htmlFor={'description'}>Description</FormLabel>
                                <Textarea id={'description'} placeholder='Description' name="description" value={descriptionUpdate} onChange={e => setDescriptionUpdate(e.target.value)} />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Tag</FormLabel>
                                <ChakraTagInput tags={tags} onTagsChange={handleTagsChange} placeholder={'Tag'} />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} type='submit'>
                                Update
                            </Button>
                            <Button onClick={onCloseUpdate}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenDelete}
                onClose={onCloseDelete}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Todo</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Text>Are you sure want delete todo ?</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={deleteTodo}>
                            Delete
                        </Button>
                        <Button onClick={onCloseDelete}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default Todo