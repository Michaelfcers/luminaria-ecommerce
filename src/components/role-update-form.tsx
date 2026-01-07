"use client"
import { Menu, Button, ActionIcon } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { updateMemberRoleAction } from "@/actions/members";

interface RoleUpdateFormProps {
  storeId: string;
  memberId: string;
  currentRole: string;
}

export function RoleUpdateForm({ storeId, memberId, currentRole }: RoleUpdateFormProps) {
  const roles = [
    { name: "Propietario", value: "owner" },
    { name: "Gerente", value: "manager" },
    { name: "Personal", value: "staff" },
  ];

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {roles.map((role) => (
          <form key={role.value} action={updateMemberRoleAction}>
            <input type="hidden" name="storeId" value={storeId} />
            <input type="hidden" name="memberId" value={memberId} />
            <input type="hidden" name="newRole" value={role.value} />
            <Menu.Item
              component="button"
              type="submit"
              disabled={currentRole === role.value}
            >
              Hacer {role.name}
            </Menu.Item>
          </form>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
