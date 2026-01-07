"use client";

import { useState } from "react";
import Link from "next/link";
import { IconChevronDown } from "@tabler/icons-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
};

export function ProductsDropdown({ mainCategories }: { mainCategories: Category[] }) {
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsProductsDropdownOpen(true)} onMouseLeave={() => setIsProductsDropdownOpen(false)}>
      <button
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        Productos
        <IconChevronDown
          className="relative top-[1px] ml-1 size-3 transition duration-300 group-hover:rotate-180"
          aria-hidden="true"
        />
      </button>

      {isProductsDropdownOpen && (
        <div className="absolute left-0 top-full z-50 w-[400px] rounded-md border bg-white p-4 shadow-lg">
          {mainCategories.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3">
              {mainCategories.map((category) => (
                <li key={category.id}>
                  <Link href={`/productos?categories=${category.id}`} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:focus:text-accent-foreground text-gray-800">
                    <div className="text-sm font-medium leading-none">{category.name}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-center text-muted-foreground">
              No hay categorías de productos disponibles.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
