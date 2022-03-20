import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link as LinkChakra,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    Container,
    Spacer,
} from '@chakra-ui/react';
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons';
import Link from 'next/link'
import color from './color'
import AuthService from '../service/auth';
import { NextRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navigation({ auth, size}: { auth: boolean, size: {width: undefined | number, height: undefined | number}}) {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Box boxShadow={'lg'}>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={"center"}>
                <Spacer/>
                <Flex width={(typeof size.width == 'number') ? size.width < 670 ? '100%' : '80%' : '80%'} align={'center'}>
                    <Flex
                        flex={{ base: 1, md: 'auto' }}
                        ml={{ base: -2 }}
                        display={{ base: 'flex', md: 'none' }}>
                        <IconButton
                            onClick={onToggle}
                            icon={
                                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                            }
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                    </Flex>
                    <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                        <Link href={'/'} passHref>
                            <Text
                                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                                fontFamily={'heading'}
                                color={color.color1} cursor="pointer">
                                <b>Todo App</b>
                            </Text>
                        </Link>

                        <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                            <DesktopNav auth={auth} />
                        </Flex>
                    </Flex>

                    <Stack
                        flex={{ base: 1, md: 0 }}
                        justify={'flex-end'}
                        direction={'row'}
                        spacing={6}>
                        <ButtonAuth auth={auth} size={size} />
                    </Stack>
                </Flex>
                <Spacer/>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav auth={auth} />
            </Collapse>
        </Box>
    );
}

const ButtonAuth = ({ auth, size }: { auth: boolean, size: {width: undefined | number, height: undefined | number}}) => {
    const router = useRouter()
    if (auth) return (
        <Button
            size={(typeof size.width == 'number') ? size.width < 670 ? 'sm' : 'md' : 'md'}
            onClick={() => logout(router)}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={color.color1}
            _hover={{ bg: color.color1_2 }}
        >
            Log Out
        </Button>
    )

    return (
        <>
            <Link href={'/login'} passHref>
                <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'}>
                    Sign In
                </Button>
            </Link>
            <Link href={'/register'} passHref>
                <Button display={{ base: 'none', md: 'inline-flex' }} fontSize={'sm'} fontWeight={600} color={'white'} bg={color.color1} _hover={{ bg: color.color1_2 }}>
                    Sign Up
                </Button>
            </Link>
        </>
    )
}

const DesktopNav = ({ auth }: { auth: boolean }) => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Stack direction={'row'} spacing={4}>
            {auth ? NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <LinkChakra
                                p={2}
                                fontSize={'sm'}
                                fontWeight={500}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                <Link href={navItem.href!} passHref>
                                    {navItem.label}
                                </Link>
                            </LinkChakra>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={'xl'}
                                bg={popoverContentBgColor}
                                p={4}
                                rounded={'xl'}
                                minW={'sm'}>
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            )) : ''}
        </Stack>
    );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
        <Link href={href!} passHref>
            <LinkChakra
                role={'group'}
                display={'block'}
                p={2}
                rounded={'md'}
                _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
                <Stack direction={'row'} align={'center'}>
                    <Box>
                        <Text
                            transition={'all .3s ease'}
                            _groupHover={{ color: 'pink.400' }}
                            fontWeight={500}>
                            {label}
                        </Text>
                        <Text fontSize={'sm'}>{subLabel}</Text>
                    </Box>
                    <Flex
                        transition={'all .3s ease'}
                        transform={'translateX(-10px)'}
                        opacity={0}
                        _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                        justify={'flex-end'}
                        align={'center'}
                        flex={1}>
                        <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
                    </Flex>
                </Stack>
            </LinkChakra>
        </Link>
    );
};

const MobileNav = ({ auth }: { auth: boolean }) => {
    return (
        <Stack
            bg={useColorModeValue('white', 'gray.800')}
            p={4}
            display={{ md: 'none' }}>
            {auth ? NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            )) : ''}
        </Stack>
    );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                // as={Link}
                // href={href ?? '#'}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text
                    fontWeight={600}
                    color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}>
                    {children &&
                        children.map((child) => (
                            <LinkChakra key={child.label} py={2} href={child.href}>
                                {child.label}
                            </LinkChakra>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'List Todo',
        children: [
            {
                label: 'Todo',
                subLabel: 'See all task in section Todo',
                href: '/todo#todo',
            },
            {
                label: 'Doing',
                subLabel: 'See all task in section Doing',
                href: '/todo#doing',
            },
            {
                label: 'Done',
                subLabel: 'See all task in section Done',
                href: '/todo#done',
            },
        ],
        href: '/todo'
    },
];

const logout = (router: NextRouter) => {
    AuthService.logout()
    router.push('/')
}