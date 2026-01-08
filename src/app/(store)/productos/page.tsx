
import { createClient } from "@/lib/supabase/server"
import { ProductsGrid } from "@/features/products/components/products-grid"
import { ProductFilters } from "@/features/products/components/product-filters"
import { getLocalProductImage } from "@/lib/local-images"
import Link from "next/link"

// Define a type for the data structure returned by the Supabase query for products
type ProductWithRelations = {
  id: string
  name: string
  code: string | null
  description: string | null
  created_at: string
  brands: { name: string } | { name: string }[] | null
  product_media: { url: string; is_primary: boolean }[] | null
  product_categories: { category_id: string }[] | null // Added for filtering
  product_variants: { 
    id: string; 
    code: string; 
    attributes: Record<string, any>; 
    name: string | null;
    list_price_usd: number | null;
  }[] | null
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
  const [resolvedSearchParams, supabase] = await Promise.all([
    searchParams,
    createClient()
  ])

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

  // Configuración de paginación (50 por página)
  const currentPage = Number(resolvedSearchParams.page) || 1
  const pageSize = 20

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

  // Solo usamos !inner si hay un filtro de categoría activo para no excluir productos sin categoría
  const categoryJoin = idsToFilter.length > 0 ? "product_categories!inner" : "product_categories"

  // Build the Supabase query for products
  let productsQuery = supabase
    .from("products")
    .select(
      `
      id,
      name,
      code,
      description,
      created_at,
      brands ( name ),
      product_media ( url, is_primary ),
      ${categoryJoin}(category_id),
      product_variants ( id, code, attributes, name, list_price_usd )
    `,
    { count: 'exact' }
    )
    .eq("status", "active")

  if (selectedBrandIds.length > 0) {
    productsQuery = productsQuery.in("brand_id", selectedBrandIds)
  }

  if (idsToFilter.length > 0) {
    productsQuery = productsQuery.in("product_categories.category_id", idsToFilter)
  }

  // Aplicar rango de paginación y orden para que los resultados sean consistentes
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1
  productsQuery = productsQuery.range(from, to).order('created_at', { ascending: false })

  // Fetch products and brands in parallel to avoid waterfall
  const [productsResult, brandsResult] = await Promise.all([
    productsQuery,
    supabase.from("brands").select("id, name")
  ])

  if (productsResult.error) {
    console.error("Error fetching products:", productsResult.error.message)
  }

  const typedProductsData = (productsResult.data as unknown as ProductWithRelations[]) || []

  // Lógica de paginación
  const totalCount = productsResult.count || 0
  const totalPages = Math.ceil(totalCount / pageSize)

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams()
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (value) params.set(key, Array.isArray(value) ? value.join(",") : String(value))
    })
    params.set("page", String(pageNumber))
    return `?${params.toString()}`
  }

  const familiesSet = new Set<string>()
  const groupsSet = new Set<string>()
  const variantsList: { product: ProductWithRelations; variant: any }[] = []

  const normalize = (str: any) => (typeof str === 'string' ? str.trim() : "")

  // Single pass to extract filters and flatten variants
  typedProductsData.forEach((product) => {
    product.product_variants?.forEach((variant) => {
      const attrs = variant.attributes || {}
      const family = normalize(attrs["Familia"] || attrs["Family"] || "")
      const group = normalize(attrs["Grupo"] || attrs["Group"] || "")

      if (family) familiesSet.add(family)
      if (group) groupsSet.add(group)

      const familyMatch = selectedFamilies.length === 0 || selectedFamilies.includes(family)
      const groupMatch = selectedGroups.length === 0 || selectedGroups.includes(group)

      if (familyMatch && groupMatch) {
        variantsList.push({ product, variant })
      }
    })
  })

  const families: FilterItem[] = Array.from(familiesSet).sort().map(name => ({ id: name, name, count: 0 }))
  const groups: FilterItem[] = Array.from(groupsSet).sort().map(name => ({ id: name, name, count: 0 }))

  const categoriesForFilter: FilterItem[] =
    allCategories.map((cat) => ({
      id: String(cat.id),
      name: cat.name,
      count: 0, // Placeholder
    })) || []

  const brands: FilterItem[] =
    brandsResult.data?.map((brand) => ({
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

      // Handle brands being either an object or an array of objects (Supabase join behavior)
      const brandName = Array.isArray(product.brands) 
        ? product.brands[0]?.name 
        : (product.brands as { name: string } | null)?.name

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
        brand: brandName || "Sin Marca",
        isNew: isNew,
        price: variant.list_price_usd, // Enviamos el número puro
        description: product.description || "", // Enviamos la descripción limpia
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
              <Link
                href={createPageUrl(currentPage - 1)}
                className={`px-4 py-2 rounded-md border ${
                  currentPage <= 1 
                    ? "pointer-events-none opacity-50 bg-muted" 
                    : "hover:bg-accent"
                }`}
              >
                Anterior
              </Link>
              <span className="text-sm font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <Link
                href={createPageUrl(currentPage + 1)}
                className={`px-4 py-2 rounded-md border ${
                  currentPage >= totalPages 
                    ? "pointer-events-none opacity-50 bg-muted" 
                    : "hover:bg-accent"
                }`}
              >
                Siguiente
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
