import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/server"

import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Package, User } from "lucide-react"

export async function UserNav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let storeName = "My Store"; // Default store name
  let userDisplayName: string | null = null;
  let userRole: string | null = null;

  if (user) {
    // Fetch user's role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('display_name, role')
      .eq('id', user.id)
      .single();

    if (profile && !profileError) {
      userDisplayName = profile.display_name;
      userRole = profile.role;
    }

    // Try to find a store where the user is the owner
    const { data: ownedStore, error: ownedStoreError } = await supabase
      .from('stores')
      .select('name')
      .eq('owner_id', user.id)
      .single();

    if (ownedStore && !ownedStoreError) {
      storeName = ownedStore.name;
    } else {
      // If not an owner, check if the user is a member of any store
      const { data: memberStores, error: memberStoresError } = await supabase
        .from('store_members')
        .select('store_id')
        .eq('user_id', user.id)
        .limit(1); // Get the first store the user is a member of

      if (memberStores && memberStores.length > 0 && !memberStoresError) {
        const { data: storeData, error: storeDataError } = await supabase
          .from('stores')
          .select('name')
          .eq('id', memberStores[0].store_id)
          .single();

        if (storeData && !storeDataError) {
          storeName = storeData.name;
        }
      }
    }
  }

  const signOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect("/login")
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt="User avatar" />
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-lg font-bold leading-none">
              {storeName}
            </p>
            <p className="text-sm font-medium leading-none">
              {userDisplayName || user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/account">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Mi Cuenta</span>
            </DropdownMenuItem>
          </Link>
          {userRole !== 'buyer' && (
            <>
              <Link href="/dashboard">
                <DropdownMenuItem>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/products">
                <DropdownMenuItem>
                  <Package className="mr-2 h-4 w-4" />
                  <span>Products</span>
                </DropdownMenuItem>
              </Link>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={signOut}>
          <button type="submit" className="w-full text-left">
            <DropdownMenuItem>
              Log out
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
