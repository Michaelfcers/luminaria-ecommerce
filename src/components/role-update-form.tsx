import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { updateMemberRole } from "@/app/(admin)/dashboard/members/page"; // Import the server action

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {roles.map((role) => (
          <form key={role.value} action={updateMemberRole}>
            <input type="hidden" name="storeId" value={storeId} />
            <input type="hidden" name="memberId" value={memberId} />
            <input type="hidden" name="newRole" value={role.value} />
            <DropdownMenuItem asChild>
              <button
                type="submit"
                className="w-full text-left"
                disabled={currentRole === role.value} // Disable if already this role
              >
                Hacer {role.name}
              </button>
            </DropdownMenuItem>
          </form>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
