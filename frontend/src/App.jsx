import { useState } from "react";
import "./App.css";

function App() {
  const [nombre, setnombre] = useState("");
  const [correo, setcorreo] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  async function registrarUsuario(evento) {
    evento.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim(),
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        alert(
          datos.mensaje || datos.error || "No se pudo registrar el usuario",
        );
        return;
      }

      alert("Usuario registrado correctamente");
      setnombre("");
      setcorreo("");
      await consultarUsuarios();
    } catch (error) {
      console.error("Error al registrar:", error);
      alert(
        "No se pudo completar la solicitud. Revisa el backend y su terminal.",
      );
    }
  }

  async function consultarUsuarios() {
    try {
      const respuesta = await fetch("http://localhost:3001/usuarios");
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        alert(
          datos.mensaje ||
            datos.error ||
            "No se pudieron consultar los usuarios",
        );
        return;
      }

      setUsuarios(datos);
    } catch (error) {
      console.error("Error al consultar:", error);
      alert("No se pudo completar la consulta. Revisa el backend.");
    }
  }

  async function eliminarUsuario(id) {
    const confirmar = window.confirm("¿Deseas eliminar este usuario?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3001/usuarios/${id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        const datos = await respuesta.json();
        alert(datos.mensaje || datos.error || "No se pudo eliminar el usuario");
        return;
      }

      setUsuarios((listaActual) =>
        listaActual.filter((usuario) => usuario.id !== id),
      );

      alert("Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo completar la eliminación. Revisa el backend.");
    }
  }

  return (
    <main className="contenedor">
      <h1>Registro de usuarios</h1>
      <p>Registra y administra los usuarios del proyecto.</p>

      <form onSubmit={registrarUsuario}>
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(evento) => setnombre(evento.target.value)}
          maxLength={100}
          placeholder="Escriba el nombre"
          required
        />

        <label htmlFor="correo">Correo electrónico</label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(evento) => setcorreo(evento.target.value)}
          maxLength={150}
          placeholder="usuario@ejemplo.com"
          required
        />

        <button type="submit">Registrar usuario</button>

        <button
          type="button"
          onClick={() => {
            setnombre("");
            setcorreo("");
          }}
        >
          Limpiar formulario
        </button>
      </form>

      <section>
        <h2>Usuarios registrados</h2>

        <button type="button" onClick={consultarUsuarios}>
          Consultar usuarios
        </button>

        <ul>
          {usuarios.map((usuario) => (
            <li key={usuario.id}>
              {usuario.nombre} — {usuario.correo}
              <button
                type="button"
                className="boton-eliminar"
                onClick={() => eliminarUsuario(usuario.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
