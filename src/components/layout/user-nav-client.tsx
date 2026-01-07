"use client"

import { Avatar, Menu, Button, Text, Stack, UnstyledButton } from "@mantine/core"
import { IconLayoutDashboard, IconPackage, IconUser, IconLogout } from "@tabler/icons-react"
import Link from "next/link"
import { signOutAction } from "@/actions/auth"

interface UserNavClientProps {
    user: any
    storeName: string
    userDisplayName: string | null
    userRole: string | null
}

export function UserNavClient({ user, storeName, userDisplayName, userRole }: UserNavClientProps) {
    if (!user) {
        return (
            <Link href="/login">
                <Button variant="subtle" size="compact-md">
                    <IconUser size={20} />
                </Button>
            </Link>
        )
    }

    return (
        <Menu shadow="md" width={220} position="bottom-end">
            <Menu.Target>
                <UnstyledButton>
                    <Avatar src={user.user_metadata?.avatar_url} radius="xl" color="blue" alt={user.email?.[0]?.toUpperCase()}>
                        {user.email?.[0]?.toUpperCase()}
                    </Avatar>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>
                    <Stack gap={0}>
                        <Text size="sm" fw={700} truncate>{storeName}</Text>
                        <Text size="xs" fw={500} truncate>{userDisplayName || user.email}</Text>
                        <Text size="xs" c="dimmed" truncate>{user.email}</Text>
                    </Stack>
                </Menu.Label>
                <Menu.Divider />
                <Menu.Item leftSection={<IconUser size={14} />} component={Link} href="/account">
                    Mi Cuenta
                </Menu.Item>
                {userRole !== 'buyer' && (
                    <>
                        <Menu.Item leftSection={<IconLayoutDashboard size={14} />} component={Link} href="/dashboard">
                            Dashboard
                        </Menu.Item>
                        <Menu.Item leftSection={<IconPackage size={14} />} component={Link} href="/products">
                            Products
                        </Menu.Item>
                    </>
                )}
                <Menu.Divider />
                <form action={signOutAction}>
                    <Menu.Item
                        leftSection={<IconLogout size={14} />}
                        component="button"
                        type="submit"
                        color="red"
                    >
                        Log out
                    </Menu.Item>
                </form>
            </Menu.Dropdown>
        </Menu>
    )
}
