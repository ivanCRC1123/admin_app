import { useState } from "react";
import {
  useIngredientMutations,
  useIngredients,
} from "../hooks/useIngredients";
import { AlertError } from "../../../shared/ui/AlertError";
import { getApiErrorMessage } from "../../../shared/services/apiError";
import type { IngredienteRead } from "../types/ingrediente.types";
import { useAuthStore } from "../../auth/store/authStore";
import { IngredientTable } from "../components/IngredientTable";
import { IngredientFormModal } from "../components/IngredientFormModal";

export const IngredientsPage = () => {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole("ADMIN");
  const { data = [], isLoading, isError, error } = useIngredients();
  const ingredientMutations = useIngredientMutations();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IngredienteRead | null>(null);
  const [formError, setFormError] = useState("");
  const [modalRevision, setModalRevision] = useState(0);

  const startCreate = () => {
    setEditing(null);
    setFormError("");
    setModalRevision((r) => r + 1);
    setOpen(true);
  };

  const startEdit = (ingredient: IngredienteRead) => {
    setEditing(ingredient);
    setFormError("");
    setModalRevision((r) => r + 1);
    setOpen(true);
  };

  const onDelete = async (id: number) => {
    try {
      await ingredientMutations.delete.mutateAsync(id);
    } catch (deleteError) {
      setFormError(getApiErrorMessage(deleteError));
    }
  };

  return (
    <section className="space-y-6 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-wide">Ingredientes</h1>

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

      <AlertError message={formError} />

      {isLoading && <p className="text-gray-400">Cargando ingredientes...</p>}
      {isError && <p className="text-red-400">{getApiErrorMessage(error)}</p>}

      {!isLoading && !isError && (
        <IngredientTable
          ingredients={data}
          isAdmin={isAdmin}
          onEdit={startEdit}
          onDelete={onDelete}
        />
      )}

      <IngredientFormModal
        key={modalRevision}
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        editing={editing}
      />
    </section>
  );
};
