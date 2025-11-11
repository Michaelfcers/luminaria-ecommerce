import { createClient } from "@/lib/supabase/server"
import { ProductsGrid } from "@/features/store/components/products-grid"
import { ProductFilters } from "@/features/store/components/product-filters"

// Define a type for the data structure returned by the Supabase query for products
type ProductWithRelations = {
  id: string
  name: string
  list_price_usd: number | null
  created_at: string
  brands: { name: string } | null
  product_media: { url: string; is_primary: boolean }[] | null
  product_categories: { category_id: string }[] | null // Added for filtering
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
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()

  // Extract filter values from searchParams
  const selectedCategoryIds = Array.isArray(searchParams.categories)
    ? searchParams.categories
    : searchParams.categories
    ? searchParams.categories.split(",")
    : []
  const selectedBrandIds = Array.isArray(searchParams.brands)
    ? searchParams.brands
    : searchParams.brands
    ? searchParams.brands.split(",")
    : []

  // Build the Supabase query for products
  let productsQuery = supabase
    .from("products")
    .select(
      `
      id,
      name,
      list_price_usd,
      created_at,
      brands ( name ),
      product_media ( url, is_primary ),
      product_categories!inner(category_id)
    `
    )
    .eq("status", "active")

  if (selectedBrandIds.length > 0) {
    productsQuery = productsQuery.in("brand_id", selectedBrandIds)
  }

  if (selectedCategoryIds.length > 0) {
    productsQuery = productsQuery.in(
      "product_categories.category_id",
      selectedCategoryIds
    )
  }

  const { data: productsData, error: productsError } = await productsQuery

  if (productsError) {
    console.error("Error fetching products:", productsError)
    // Optionally, render an error state
  }

  // Fetch categories
  const { data: categoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name")

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError)
  }

  const categories: FilterItem[] =
    categoriesData?.map((cat) => ({
      id: String(cat.id), // Ensure ID is string for FilterItem
      name: cat.name,
      count: 0, // Placeholder, actual count would require a more complex query
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
      id: String(brand.id), // Ensure ID is string for FilterItem
      name: brand.name,
      count: 0, // Placeholder
    })) || []

  // Cast the fetched product data to our new type to ensure type safety
  const typedProductsData = productsData as ProductWithRelations[] | null

  // Transform the data to match the structure expected by ProductsGrid
  const products =
    typedProductsData?.map((product) => {
      const primaryMedia = Array.isArray(product.product_media)
        ? product.product_media.find((media) => media.is_primary)
        : null

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const isNew = new Date(product.created_at) > sevenDaysAgo

      return {
        id: product.id,
        name: product.name,
        price: product.list_price_usd ?? 0,
        image: primaryMedia?.url || "/placeholder.svg",
        brand: product.brands?.name || "Sin Marca",
        isNew: isNew,
        // category, rating, and reviews are not in the DB schema provided
      }
    }) ?? []

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
          <ProductFilters categories={categories} brands={brands} />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <ProductsGrid products={products} />
        </div>
      </div>
    </main>
  )
}
