import { useState } from "react";
import { useCategories, useCategoryMutations } from "../hooks/useCategories";
import { AlertError } from "../../../shared/ui/AlertError";
import { getApiErrorMessage } from "../../../shared/services/apiError";
import type { CategoriaRead } from "../types/categoria.types";
import { useAuthStore } from "../../auth/store/authStore";
import { CategorySearch } from "../components/CategorySearch";
import { CategoryTable } from "../components/CategoryTable";
import { CategoryFormModal } from "../components/CategoryFormModal";

export const CategoriesPage = () => {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole("ADMIN");
  const { data = [], isLoading, isError, error } = useCategories();
  const categoryMutations = useCategoryMutations();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoriaRead | null>(null);
  const [formError, setFormError] = useState("");
  const [modalRevision, setModalRevision] = useState(0);

  const startCreate = () => {
    setEditing(null);
    setFormError("");
    setModalRevision((r) => r + 1);
    setOpen(true);
  };

  const startEdit = (category: CategoriaRead) => {
    setEditing(category);
    setFormError("");
    setModalRevision((r) => r + 1);
    setOpen(true);
  };

  const onDelete = async (id: number) => {
    try {
      await categoryMutations.delete.mutateAsync(id);
    } catch (deleteError) {
      setFormError(getApiErrorMessage(deleteError));
    }
  };

  return (
    <section className="space-y-6 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-wide">Categorías</h1>

        {isAdmin && (
          <button
            type="button"
            onClick={startCreate}
            className="rounded-xl bg-emerald-500 px-5 py-2 font-medium hover:bg-emerald-600 transition shadow-lg"
          >
            + Nueva
          </button>
        )}
      </div>

      <CategorySearch />

      <AlertError message={formError} />

      {isLoading && <p className="text-gray-400">Cargando categorías...</p>}
      {isError && <p className="text-red-400">{getApiErrorMessage(error)}</p>}

      {!isLoading && !isError && (
        <CategoryTable
          categories={data}
          isAdmin={isAdmin}
          onEdit={startEdit}
          onDelete={onDelete}
        />
      )}

      <CategoryFormModal
        key={modalRevision}
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        editing={editing}
        categories={data}
      />
    </section>
  );
};
