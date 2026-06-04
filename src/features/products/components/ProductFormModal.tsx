import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  addProductToCategory,
  removeProductFromCategory,
} from "../services/productoCategoria.api";
import {
  addIngredientToProduct,
  removeIngredientFromProduct,
} from "../services/productoIngrediente.api";
import { useProductMutations } from "../hooks/useProducts";
import { Modal } from "../../../shared/components/Modal";
import { InputField } from "../../../shared/ui/InputField";
import { getApiErrorMessage } from "../../../shared/services/apiError";
import type { ProductoRead } from "../types/producto.types";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  editing: ProductoRead | null;
  categories: { id: number; nombre: string }[];
  ingredients: { id: number; nombre: string }[];
}

type ProductFormState = {
  nombre: string;
  descripcion: string;
  precio_base: string;
  imagenes_url: string;
  stock_cantidad: string;
  disponible: boolean;
  categoriaIds: number[];
  ingredienteIds: number[];
};

const emptyForm: ProductFormState = {
  nombre: "",
  descripcion: "",
  precio_base: "",
  imagenes_url: "",
  stock_cantidad: "0",
  disponible: true,
  categoriaIds: [],
  ingredienteIds: [],
};

const toForm = (product: ProductoRead): ProductFormState => ({
  nombre: product.nombre,
  descripcion: product.descripcion ?? "",
  precio_base: String(product.precio_base),
  imagenes_url: product.imagenes_url.join(", "),
  stock_cantidad: String(product.stock_cantidad),
  disponible: product.disponible,
  categoriaIds: product.categorias.map((item) => item.id),
  ingredienteIds: product.ingredientes.map((item) => item.id),
});

const toggleId = (ids: number[], id: number) => {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
};

export const ProductFormModal = ({
  open,
  onClose,
  editing,
  categories,
  ingredients,
}: ProductFormModalProps) => {
  const queryClient = useQueryClient();
  const productMutations = useProductMutations();

  const [form, setForm] = useState<ProductFormState>(
    editing ? toForm(editing) : emptyForm,
  );
  const [formError, setFormError] = useState<string>("");

  const syncRelations = async (
    productId: number,
    selectedCategoryIds: number[],
    selectedIngredientIds: number[],
    currentProduct?: ProductoRead,
  ) => {
    const currentCategoryIds =
      currentProduct?.categorias.map((item) => item.id) ?? [];
    const currentIngredientIds =
      currentProduct?.ingredientes.map((item) => item.id) ?? [];

    const categoriesToAdd = selectedCategoryIds.filter(
      (id) => !currentCategoryIds.includes(id),
    );
    const categoriesToRemove = currentCategoryIds.filter(
      (id) => !selectedCategoryIds.includes(id),
    );

    const ingredientsToAdd = selectedIngredientIds.filter(
      (id) => !currentIngredientIds.includes(id),
    );
    const ingredientsToRemove = currentIngredientIds.filter(
      (id) => !selectedIngredientIds.includes(id),
    );

    await Promise.all([
      ...categoriesToAdd.map((categoriaId, index) =>
        addProductToCategory({
          producto_id: productId,
          categoria_id: categoriaId,
          es_principal: index === 0,
        }),
      ),
      ...categoriesToRemove.map((categoriaId) =>
        removeProductFromCategory({
          producto_id: productId,
          categoria_id: categoriaId,
        }),
      ),
      ...ingredientsToAdd.map((ingredienteId) =>
        addIngredientToProduct({
          producto_id: productId,
          ingrediente_id: ingredienteId,
          es_removible: true,
        }),
      ),
      ...ingredientsToRemove.map((ingredienteId) =>
        removeIngredientFromProduct({
          producto_id: productId,
          ingrediente_id: ingredienteId,
        }),
      ),
    ]);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nombre.trim()) {
      setFormError("El nombre es obligatorio.");
      return;
    }

    const precio = Number(form.precio_base);
    const stock = Number(form.stock_cantidad);

    if (Number.isNaN(precio) || precio < 0) {
      setFormError("El precio debe ser un número válido mayor o igual a 0.");
      return;
    }

    if (Number.isNaN(stock) || stock < 0) {
      setFormError("El stock debe ser un número válido mayor o igual a 0.");
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || undefined,
      precio_base: precio,
      imagenes_url: form.imagenes_url
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      stock_cantidad: stock,
      disponible: form.disponible,
    };

    try {
      let productId = editing?.id;

      if (editing) {
        await productMutations.update.mutateAsync({ id: editing.id, payload });
      } else {
        const createdProduct =
          await productMutations.create.mutateAsync(payload);
        productId = createdProduct.id;
      }

      if (!productId) {
        throw new Error("No se pudo resolver el id del producto.");
      }

      await syncRelations(
        productId,
        form.categoriaIds,
        form.ingredienteIds,
        editing ?? undefined,
      );

      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["products", productId] });

      onClose();
    } catch (submitError) {
      setFormError(getApiErrorMessage(submitError));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Editar producto" : "Nuevo producto"}
    >
      <form className="grid gap-4" onSubmit={(event) => void onSubmit(event)}>
        <InputField
          value={form.nombre}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, nombre: event.target.value }))
          }
          placeholder="Nombre"
        />

        <textarea
          value={form.descripcion}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, descripcion: event.target.value }))
          }
          className="rounded-lg bg-zinc-800 border border-zinc-700 p-3 text-white focus:ring-2 focus:ring-emerald-500"
          placeholder="Descripción"
        />

        <InputField
          value={form.precio_base}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, precio_base: event.target.value }))
          }
          placeholder="Precio"
          type="number"
        />

        <InputField
          value={form.stock_cantidad}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              stock_cantidad: event.target.value,
            }))
          }
          placeholder="Stock"
          type="number"
        />

        <InputField
          value={form.imagenes_url}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              imagenes_url: event.target.value,
            }))
          }
          placeholder="URL de imagen"
        />

        <label className="flex items-center gap-3 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={form.disponible}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                disponible: event.target.checked,
              }))
            }
            className="accent-emerald-500"
          />
          Disponible
        </label>

        {/* SCROLL CHECKBOXES MÁS LIMPIO */}
        <fieldset className="space-y-2 rounded-xl border border-zinc-700 p-3">
          <legend className="text-sm text-gray-400">Categorías</legend>
          <div className="grid max-h-32 gap-1 overflow-y-auto text-sm text-gray-300">
            {categories.map((category) => (
              <label key={category.id} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={form.categoriaIds.includes(category.id)}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      categoriaIds: toggleId(prev.categoriaIds, category.id),
                    }))
                  }
                  className="accent-emerald-500"
                />
                {category.nombre}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2 rounded-xl border border-zinc-700 p-3">
          <legend className="text-sm text-gray-400">Ingredientes</legend>
          <div className="grid max-h-32 gap-1 overflow-y-auto text-sm text-gray-300">
            {ingredients.map((ingredient) => (
              <label key={ingredient.id} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={form.ingredienteIds.includes(ingredient.id)}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      ingredienteIds: toggleId(
                        prev.ingredienteIds,
                        ingredient.id,
                      ),
                    }))
                  }
                  className="accent-emerald-500"
                />
                {ingredient.nombre}
              </label>
            ))}
          </div>
        </fieldset>

        {formError && <p className="text-sm text-red-400">{formError}</p>}

        <button
          type="submit"
          className="rounded-xl bg-emerald-500 py-2 font-semibold hover:bg-emerald-600"
          disabled={
            productMutations.create.isPending ||
            productMutations.update.isPending
          }
        >
          {editing ? "Guardar cambios" : "Crear producto"}
        </button>
      </form>
    </Modal>
  );
};
