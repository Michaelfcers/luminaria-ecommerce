-- Create promotion_variants table
create table public.promotion_variants (
  id bigserial primary key,
  promotion_id uuid references public.promotions(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  created_at timestamptz default now(),
  unique(promotion_id, variant_id)
);

-- Add index for performance
create index idx_promotion_variants_promotion_id on public.promotion_variants(promotion_id);
create index idx_promotion_variants_variant_id on public.promotion_variants(variant_id);
