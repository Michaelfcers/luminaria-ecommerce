

import { Button, ButtonProps } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";

interface LinkButtonProps extends ButtonProps {
    href: string;
    children: ReactNode;
}

export function LinkButton({ href, children, ...props }: LinkButtonProps) {
    return (
        <Button component={Link} href={href} {...props}>
            {children}
        </Button>
    );
}
