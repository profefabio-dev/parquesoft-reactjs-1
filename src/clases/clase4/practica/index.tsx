/*
  Enunciado:
  1. Pedir los usuarios dentro de un useEffect.
  2. Mostrar tres estados: cargando, error y lista.
  3. Cancelar la petición con AbortController al desmontar.
*/

import { useEffect, useState } from "react";

interface IUser {
  id: number;
  name: string;
}

const Clase4Practica = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Actividad 1: pedir los usuarios dentro de un useEffect
  useEffect(() => {
    // Actividad 3: controlador para cancelar la petición
    const controlador = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users?_limit=3",
          { signal: controlador.signal }
        );
        if (!response.ok) {
          throw new Error("No se pudieron cargar los usuarios");
        }
        const data: IUser[] = await response.json();
        setUsers(data);
      } catch (err: unknown) {
        // Si se canceló al desmontar, no se muestra error
        if (err instanceof Error && err.name === "AbortError") return;
        if (err instanceof Error) setError(err.message);
      } finally {
        if (!controlador.signal.aborted) setLoading(false);
      }
    };

    fetchUsers();

    // Actividad 3: al desmontar el componente se cancela la petición
    return () => {
      controlador.abort();
    };
  }, []);

  // Actividad 2: tres estados -> cargando, error y lista
  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <article>
      <h2>Usuarios con carga y error</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </article>
  );
};

export default Clase4Practica;