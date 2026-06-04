import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "../../categories/hooks/useCategories";
import { useIngredients } from "../../ingredients/hooks/useIngredients";
import { useProductMutations, useProducts } from "../hooks/useProducts";
import { AlertError } from "../../../shared/ui/AlertError";
import { getApiErrorMessage } from "../../../shared/services/apiError";
import type { ProductoRead } from "../types/producto.types";
import { useAuthStore } from "../../auth/store/authStore";
import { ProductFilters } from "../components/ProductFilters";
import { ProductTable } from "../components/ProductTable";
import { ProductFormModal } from "../components/ProductFormModal";

export const ProductsPage = () => {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole("ADMIN");
  const isStockOrAdmin = hasRole("ADMIN") || hasRole("STOCK");

  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaFilter = searchParams.get("categoria_id")
    ? Number(searchParams.get("categoria_id"))
    : undefined;

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const queryParams = useMemo(() => {
    const p: Record<string, unknown> = {};
    if (categoriaFilter) {
      p.categoria_id = categoriaFilter;
      p.limit = 100;
    }
    if (debouncedSearch) {
      p.search = debouncedSearch;
    }
    return Object.keys(p).length > 0 ? p : undefined;
  }, [categoriaFilter, debouncedSearch]);

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useProducts(
    queryParams as
      | {
          min_precio?: number;
          max_precio?: number;
          limit?: number;
          offset?: number;
          categoria_id?: number;
          search?: string;
        }
      | undefined,
  );
  const { data: categories = [] } = useCategories();
  const { data: ingredients = [] } = useIngredients();

  const productMutations = useProductMutations();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductoRead | null>(null);
  const [formError, setFormError] = useState<string>("");
  const [modalRevision, setModalRevision] = useState(0);

  const startCreate = () => {
    setEditing(null);
    setFormError("");
    setModalRevision((r) => r + 1);
    setOpen(true);
  };

  const startEdit = (product: ProductoRead) => {
    setEditing(product);
    setFormError("");
    setModalRevision((r) => r + 1);
    setOpen(true);
  };

  const onDelete = async (id: number) => {
    try {
      await productMutations.delete.mutateAsync(id);
    } catch (deleteError) {
      setFormError(getApiErrorMessage(deleteError));
    }
  };

  return (
    <section className="space-y-6 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos</h1>

        {isAdmin && (
          <button
            type="button"
            onClick={startCreate}
            className="rounded-xl bg-emerald-500 px-5 py-2 font-medium hover:bg-emerald-600 transition shadow-lg"
          >
            + Nuevo
          </button>
        )}
      </div>

      <ProductFilters
        onSearchChange={setDebouncedSearch}
        categoriaFilter={categoriaFilter}
        onClearCategoryFilter={() => setSearchParams({})}
      />

      <AlertError message={formError} />

      {isLoading && <p className="text-gray-400">Cargando productos...</p>}
      {isError && (
        <p className="text-red-400">Error: {getApiErrorMessage(error)}</p>
      )}

      {!isLoading && !isError && (
        <ProductTable
          products={data}
          isAdmin={isAdmin}
          isStockOrAdmin={isStockOrAdmin}
          onEdit={startEdit}
          onDelete={onDelete}
        />
      )}

      <ProductFormModal
        key={modalRevision}
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        editing={editing}
        categories={categories}
        ingredients={ingredients}
      />
    </section>
  );
};
