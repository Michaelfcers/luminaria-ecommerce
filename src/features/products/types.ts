export type ProductVariant = {
  id: string;
  name: string;
  attributes: Record<string, any>;
  life_hours: number;
  lumens: number;
  pieces_per_box: number;
  list_price_usd: number;
  code: string;
  sourcing_status: string;
  stock: number;
  product_variant_media: ProductMedia[] | null;
  localImage?: string; // Added for local image support
};

export type Product = {
  id: string;
  name: string;
  code: string | null; // Added code
  description: string | null;
  attributes: Record<string, any> | null;
  product_variants: ProductVariant[] | null;
  product_media: ProductMedia[] | null;
};

export type ProductMedia = {
  url: string;
  type: string;
  alt_text: string | null;
  is_primary: boolean;
};
