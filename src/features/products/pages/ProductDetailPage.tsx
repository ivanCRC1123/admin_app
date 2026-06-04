import { Link, useParams } from "react-router-dom";
import { useProductById } from "../hooks/useProducts";
import { AlertError } from "../../../shared/ui/AlertError";
import { Badge } from "../../../shared/ui/Badge";
import { getApiErrorMessage } from "../../../shared/services/apiError";

export const ProductDetailPage = () => {
  const params = useParams();
  const productId = Number(params.id);

  const { data, isLoading, isError, error } = useProductById(productId);

  if (!productId || Number.isNaN(productId)) {
    return <p>El id es inválido.</p>;
  }

  if (isLoading) return <p>Cargando detalle...</p>;
  if (isError)
    return (
      <AlertError message={getApiErrorMessage(error)} className="px-4 py-2" />
    );
  if (!data) return <p>No se encontró el producto.</p>;

  return (
    <section className="space-y-6 text-white">
      {/* VOLVER */}
      <Link
        to="/productos"
        className="text-sm text-emerald-400 hover:underline"
      >
        ? Volver
      </Link>

      {/* TITULO */}
      <div>
        <h1 className="text-3xl font-bold">{data.nombre}</h1>
        <p className="text-gray-400 mt-1">
          {data.descripcion || "Sin descripción"}
        </p>
      </div>

      {/* IMAGENES */}
      {data.imagenes_url.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {data.imagenes_url.map((imageUrl, index) => (
            <img
              key={`${imageUrl}-${index}`}
              src={imageUrl}
              alt={`${data.nombre} ${index + 1}`}
              className="h-56 w-80 flex-none rounded-xl border border-zinc-700 object-cover hover:scale-105 transition"
              referrerPolicy="no-referrer"
            />
          ))}
        </div>
      )}

      {/* INFO CARD */}
      <div className="grid gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 p-5 text-sm shadow-xl">
        <div className="flex justify-between">
          <span className="text-gray-400">Precio</span>
          <span className="font-semibold text-emerald-400">
            ${data.precio_base}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Stock</span>
          <span>{data.stock_cantidad}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Disponible</span>
          <Badge variant={data.disponible ? "success" : "error"}>
            {data.disponible ? "Sí" : "No"}
          </Badge>
        </div>

        <div>
          <span className="text-gray-400">Categorías</span>
          <p className="mt-1">
            {data.categorias.length
              ? data.categorias.map((c) => c.nombre).join(", ")
              : "Sin categorías"}
          </p>
        </div>

        <div>
          <span className="text-gray-400">Ingredientes</span>
          <p className="mt-1">
            {data.ingredientes.length
              ? data.ingredientes.map((i) => i.nombre).join(", ")
              : "Sin ingredientes"}
          </p>
        </div>
      </div>
    </section>
  );
};
