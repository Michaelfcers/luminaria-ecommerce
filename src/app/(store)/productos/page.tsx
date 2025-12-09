
import { createClient } from "@/lib/supabase/server"
import { ProductsGrid } from "@/features/store/components/products-grid"
import { ProductFilters } from "@/features/store/components/product-filters"
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
  product_variants: { code: string }[] | null
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
      product_variants ( code )
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

  // Cast the fetched product data to our new type to ensure type safety
  const typedProductsData = productsData as ProductWithRelations[] | null

  // Transform the data to match the structure expected by ProductsGrid
  const products = await Promise.all(
    (typedProductsData || []).map(async (product) => {
      let imageUrl = "/placeholder-image.jpg"

      // Determine the code to use for image lookup
      let codeToUse = product.code
      if (!codeToUse && product.product_variants && product.product_variants.length > 0) {
        codeToUse = product.product_variants[0].code
      }

      // Try to get local image first
      const localImage = await getLocalProductImage(codeToUse)

      // console.log(`Product: ${product.name}, Code: ${codeToUse}, LocalImage: ${localImage}`);

      if (localImage) {
        imageUrl = localImage
      } else {
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

      return {
        id: product.id,
        name: product.name,
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
          <ProductFilters categories={categoriesForFilter} brands={brands} />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <ProductsGrid products={products} />
        </div>
      </div>
    </main>
  )
}
