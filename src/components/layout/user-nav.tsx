import { createClient } from "@/lib/supabase/server";
import { UserNavClient } from "./user-nav-client";

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

  return (
    <UserNavClient
      user={user}
      storeName={storeName}
      userDisplayName={userDisplayName}
      userRole={userRole}
    />
  )
}
