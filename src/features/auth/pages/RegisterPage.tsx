import { useState } from "react";
import { Link } from "react-router-dom";
import { register as registerApi } from "../services/auth";
import { AlertError } from "../../../shared/ui/AlertError";
import { InputField } from "../../../shared/ui/InputField";
import { getApiErrorMessage } from "../../../shared/services/apiError";

export const RegisterPage = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !apellido.trim()) {
      setError("Complete nombre y apellido");
      return;
    }
    if (!email.trim()) {
      setError("Ingrese su email");
      return;
    }
    if (!password.trim()) {
      setError("Ingrese una contraseña");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      // Registrar al usuario (crea usuario + asigna rol de CLIENTE)
      await registerApi({
        email: email.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        password,
      });

      // Mostrar mensaje de éxito — el usuario no tiene roles de admin,
      // así que redirigir al dashboard causaría pantalla en blanco
      setSuccess(true);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-2xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Crear Cuenta
        </h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          Regístrese para acceder a MiTiendita
        </p>

        {success ? (
          <div className="text-center">
            <div className="mb-4 text-4xl">✅</div>
            <p className="mb-2 text-lg font-semibold text-white">
              Cuenta creada exitosamente
            </p>
            <p className="mb-6 text-sm text-gray-400">
              Un administrador te asignará los roles de acceso.
              Mientras tanto, puedes cerrar esta ventana.
            </p>
            <Link
              to="/login"
              className="inline-block rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-600 transition"
            >
              Ir a iniciar sesión
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="flex gap-2">
                <InputField
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                  className="w-1/2"
                  autoFocus
                />
                <InputField
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Apellido"
                  className="w-1/2"
                />
              </div>
              <InputField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <InputField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
              />
              <InputField
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
              />

              <AlertError message={error} className="p-2 text-center" />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
              >
                {loading ? "Registrando..." : "Crear Cuenta"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              ¿Ya tiene cuenta?{" "}
              <Link
                to="/login"
                className="font-medium text-emerald-400 hover:text-emerald-300"
              >
                Iniciar sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
