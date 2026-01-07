
import { createClient } from "@/lib/supabase/server"
import { ProductsGrid } from "@/features/products/components/products-grid"
import { ProductFilters } from "@/features/products/components/product-filters"
import { getLocalProductImage } from "@/lib/local-images"

// Define a type for the data structure returned by the Supabase query for products
type ProductWithRelations = {
  id: string
  name: string
  code: string | null
  created_at: string
  brands: { name: string } | null
  product_media: { url: string; is_primary: boolean }[] | null
  product_categories: { category_id: string }[] | null // Added for filtering
  product_variants: { id: string; code: string; attributes: Record<string, any>; name: string | null }[] | null
}

// Define a type for the filter items
type FilterItem = {
  id: string
  name: string
  count: number
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const supabase = await createClient()

  // Fetch all categories to determine hierarchy
  const { data: allCategoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name, parent_id")

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError)
  }
  const allCategories = allCategoriesData || []

  // Extract filter values from searchParams
  const selectedCategoryIds = Array.isArray(resolvedSearchParams.categories)
    ? resolvedSearchParams.categories
    : resolvedSearchParams.categories
      ? resolvedSearchParams.categories.split(",")
      : []
  const selectedBrandIds = Array.isArray(resolvedSearchParams.brands)
    ? resolvedSearchParams.brands
    : resolvedSearchParams.brands
      ? resolvedSearchParams.brands.split(",")
      : []
  const selectedFamilies = Array.isArray(resolvedSearchParams.families)
    ? resolvedSearchParams.families
    : resolvedSearchParams.families
      ? resolvedSearchParams.families.split(",")
      : []
  const selectedGroups = Array.isArray(resolvedSearchParams.groups)
    ? resolvedSearchParams.groups
    : resolvedSearchParams.groups
      ? resolvedSearchParams.groups.split(",")
      : []

  // Expand selected categories to include sub-categories
  let idsToFilter = [...selectedCategoryIds]
  selectedCategoryIds.forEach((id) => {
    const subCategories = allCategories
      .filter((cat) => String(cat.parent_id) === String(id))
      .map((cat) => String(cat.id))
    idsToFilter.push(...subCategories)
  })
  // Remove duplicates
  idsToFilter = [...new Set(idsToFilter)]

  // Build the Supabase query for products
  let productsQuery = supabase
    .from("products")
    .select(
      `
      id,
      name,
      code,
      created_at,
      brands ( name ),
      product_media ( url, is_primary ),
      product_categories!inner(category_id),
      product_variants ( id, code, attributes, name )
    `
    )
    .eq("status", "active")

  if (selectedBrandIds.length > 0) {
    productsQuery = productsQuery.in("brand_id", selectedBrandIds)
  }

  if (idsToFilter.length > 0) {
    productsQuery = productsQuery.in("product_categories.category_id", idsToFilter)
  }

  const { data: productsData, error: productsError } = await productsQuery

  if (productsError) {
    console.error("Error fetching products:", productsError)
    // Optionally, render an error state
  }

  // Cast the fetched product data to our new type to ensure type safety
  const typedProductsData = productsData as ProductWithRelations[] | null

  // Extract Families and Groups from all fetched products (before filtering by them to show all options, 
  // OR after filtering if we only want to show relevant options. Usually show all or context aware. 
  // Let's extracting from the CURRENT fetched set might be limited if we filter in DB.
  // Ideally we should fetch ALL options separately or fetch ALL products then filter in memory for this specific UI requirement ("Show ALL products... and sidebar filters").
  // The user said "cheque que todos los productos se muestren en pantalla absolutamente todos".
  // So we should probably fetch ALL active products first, then filter in memory? 
  // Or fetch attributes definitions separately. 
  // Since we don't have a separate table, we'll extract from products.

  // However, we are currently filtering by Brand and Category in the DB query.
  // If we filter, we might hide available families/groups. 
  // But usually, filters are context-dependent.
  // Let's proceed with current fetched data which respects Brand/Category filters.

  const familiesSet = new Set<string>()
  const groupsSet = new Set<string>()

  // Helper to normalize strings (trim)
  const normalize = (str: string) => str?.trim()

  typedProductsData?.forEach((product) => {
    product.product_variants?.forEach((variant) => {
      const attrs = variant.attributes || {}
      // Check for Familia
      if (attrs["Familia"]) familiesSet.add(normalize(attrs["Familia"]))
      if (attrs["Family"]) familiesSet.add(normalize(attrs["Family"]))

      // Check for Grupo
      if (attrs["Grupo"]) groupsSet.add(normalize(attrs["Grupo"]))
      if (attrs["Group"]) groupsSet.add(normalize(attrs["Group"]))
    })
  })

  const families: FilterItem[] = Array.from(familiesSet)
    .sort()
    .map((name) => ({
      id: name,
      name: name,
      count: 0,
    }))

  const groups: FilterItem[] = Array.from(groupsSet)
    .sort()
    .map((name) => ({
      id: name,
      name: name,
      count: 0,
    }))


  // Flatten variants and apply filters
  const variantsList: { product: ProductWithRelations; variant: any }[] = []

  // Iterate over ALL fetched products to flatten them into variants
  typedProductsData?.forEach((product) => {
    product.product_variants?.forEach((variant) => {
      const attrs = variant.attributes || {}
      const family = normalize(attrs["Familia"] || attrs["Family"] || "")
      const group = normalize(attrs["Grupo"] || attrs["Group"] || "")

      // Filter by Family if selected
      if (selectedFamilies.length > 0 && !selectedFamilies.includes(family)) {
        return
      }

      // Filter by Group if selected
      if (selectedGroups.length > 0 && !selectedGroups.includes(group)) {
        return
      }

      // Also filter by category/brand implicitly because we only iterate over fetched products
      // which are already filtered by brand and category in the DB query.

      variantsList.push({
        product,
        variant,
      })
    })
  })

  const categoriesForFilter: FilterItem[] =
    allCategories.map((cat) => ({
      id: String(cat.id),
      name: cat.name,
      count: 0, // Placeholder
    })) || []

  // Fetch brands
  const { data: brandsData, error: brandsError } = await supabase
    .from("brands")
    .select("id, name")

  if (brandsError) {
    console.error("Error fetching brands:", brandsError)
  }

  const brands: FilterItem[] =
    brandsData?.map((brand) => ({
      id: String(brand.id),
      name: brand.name,
      count: 0, // Placeholder
    })) || []




  // Transform the flattened data to match the structure expected by ProductsGrid
  const products = await Promise.all(
    variantsList.map(async ({ product, variant }) => {
      let imageUrl = "/placeholder-image.jpg"

      // Determine the code to use for image lookup
      // Use variant code
      let codeToUse = variant.code

      // Try to get local image first
      const localImage = await getLocalProductImage(codeToUse)

      if (localImage) {
        imageUrl = localImage
      } else {
        // Fallback to product primary media if no local variant image
        const primaryMedia = Array.isArray(product.product_media)
          ? product.product_media.find((media) => media.is_primary)
          : null

        if (primaryMedia) {
          imageUrl = primaryMedia.url
        }
      }

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const isNew = new Date(product.created_at) > sevenDaysAgo

      // Construct name: Product Name + Variant Name (if available and different)
      let displayName = product.name
      if (variant.name && variant.name.trim() !== "" && variant.name !== product.name) {
        displayName = `${product.name} - ${variant.name}`
      }

      return {
        id: variant.id, // Unique ID for ProductsGrid key
        productId: product.id, // Parent Product ID for Link
        name: displayName,
        image: imageUrl,
        brand: product.brands?.name || "Sin Marca",
        isNew: isNew,
      }
    })
  )

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Nuestros Productos
        </h1>
        <p className="text-muted-foreground">
          Descubre nuestra completa colección de luminarias y accesorios de alta
          calidad
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilters
            categories={categoriesForFilter}
            brands={brands}
            families={families}
            groups={groups}
          />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <ProductsGrid products={products} />
        </div>
      </div>
    </main>
  )
}
