import { createContext, useContext, useReducer, useState, ReactNode } from "react";

           // ----- tipos -----
interface ITarea {
  id: number;
  texto: string;
}

type TareaAction =
  | { type: "agregar"; payload: string }
  | { type: "borrar"; payload: number };

//  Actividad 4: reducer con las acciones agregar y borrar 
const tareasReducer = (state: ITarea[], action: TareaAction): ITarea[] => {
  switch (action.type) {
    case "agregar":
      // Se devuelve un arreglo nuevo, no se modifica el anterior
      return [...state, { id: Date.now(), texto: action.payload }];
    case "borrar":
      return state.filter((tarea) => tarea.id !== action.payload);
    default:
      return state;
  }
};

// Actividad 6: contexto y provider para compartir el estado --
interface ITareasContext {
  tareas: ITarea[];
  dispatch: React.Dispatch<TareaAction>;
}

const TareasContext = createContext<ITareasContext | undefined>(undefined);

const TareasProvider = ({ children }: { children: ReactNode }) => {
  const [tareas, dispatch] = useReducer(tareasReducer, []);
  return (
    <TareasContext.Provider value={{ tareas, dispatch }}>
      {children}
    </TareasContext.Provider>
  );
};

const useTareas = () => {
  const context = useContext(TareasContext);
  if (!context) {
    throw new Error("useTareas debe usarse dentro de un TareasProvider");
  }
  return context;
};

// Actividad 5: los componentes solo hacen dispatch 
const FormularioTarea = () => {
  const { dispatch } = useTareas();
  const [texto, setTexto] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    dispatch({ type: "agregar", payload: texto.trim() });
    setTexto("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Nueva tarea"
      />
      <button type="submit">Agregar</button>
    </form>
  );
};

const ListaTareas = () => {
  const { tareas, dispatch } = useTareas();

  if (tareas.length === 0) return <p>No hay tareas todavía.</p>;

  return (
    <ul>
      {tareas.map((tarea) => (
        <li key={tarea.id}>
          {tarea.texto}{" "}
          <button onClick={() => dispatch({ type: "borrar", payload: tarea.id })}>
            Borrar
          </button>
        </li>
      ))}
    </ul>
  );
};

// Página de la práctica
const Clase6Practica = () => {
  return (
    <article>
      <h2>Lista de tareas con acciones</h2>
      <TareasProvider>
        <FormularioTarea />
        <ListaTareas />
      </TareasProvider>
    </article>
  );
};

export default Clase6Practica;