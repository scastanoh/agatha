import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckSquare, StickyNote, Bell, Trash2, Search } from 'lucide-react';

const AsistenteApp = () => {
  const [activeTab, setActiveTab] = useState('tareas');
  const [tareas, setTareas] = useState([]);
  const [notas, setNotas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [nuevaNota, setNuevaNota] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '',
    fecha: '',
    hora: '',
    recordatorio: false
  });

  // Cargar datos del localStorage
  useEffect(() => {
    const tareasGuardadas = localStorage.getItem('tareas');
    const notasGuardadas = localStorage.getItem('notas');
    const eventosGuardados = localStorage.getItem('eventos');
    
    if (tareasGuardadas) setTareas(JSON.parse(tareasGuardadas));
    if (notasGuardadas) setNotas(JSON.parse(notasGuardadas));
    if (eventosGuardados) setEventos(JSON.parse(eventosGuardados));
  }, []);

  // Guardar datos en localStorage
  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas));
    localStorage.setItem('notas', JSON.stringify(notas));
    localStorage.setItem('eventos', JSON.stringify(eventos));
  }, [tareas, notas, eventos]);

  const agregarTarea = (e) => {
    e.preventDefault();
    if (nuevaTarea.trim()) {
      setTareas([...tareas, { 
        id: Date.now(), 
        texto: nuevaTarea, 
        completada: false,
        fecha: new Date().toISOString()
      }]);
      setNuevaTarea('');
    }
  };

  const agregarNota = (e) => {
    e.preventDefault();
    if (nuevaNota.trim()) {
      setNotas([...notas, {
        id: Date.now(),
        texto: nuevaNota,
        fecha: new Date().toISOString()
      }]);
      setNuevaNota('');
    }
  };

  const agregarEvento = (e) => {
    e.preventDefault();
    if (nuevoEvento.titulo && nuevoEvento.fecha) {
      setEventos([...eventos, {
        id: Date.now(),
        ...nuevoEvento
      }]);
      setNuevoEvento({
        titulo: '',
        fecha: '',
        hora: '',
        recordatorio: false
      });
    }
  };

  const eliminarItem = (id, tipo) => {
    switch(tipo) {
      case 'tarea':
        setTareas(tareas.filter(t => t.id !== id));
        break;
      case 'nota':
        setNotas(notas.filter(n => n.id !== id));
        break;
      case 'evento':
        setEventos(eventos.filter(e => e.id !== id));
        break;
    }
  };

  const filtrarItems = (items) => {
    return items.filter(item => 
      item.texto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.titulo?.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header con búsqueda */}
      <div className="bg-purple-600 p-4 text-white">
        <h1 className="text-xl font-bold mb-2">Mi Asistente Personal</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full p-2 rounded text-gray-800 pl-8"
          />
          <Search className="absolute left-2 top-2.5 text-gray-500" size={16} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex border-b">
        <button 
          onClick={() => setActiveTab('tareas')}
          className={`flex items-center space-x-2 px-4 py-3 flex-1 ${activeTab === 'tareas' ? 'border-b-2 border-purple-600' : ''}`}
        >
          <CheckSquare size={20} />
          <span>Tareas</span>
        </button>
        <button 
          onClick={() => setActiveTab('eventos')}
          className={`flex items-center space-x-2 px-4 py-3 flex-1 ${activeTab === 'eventos' ? 'border-b-2 border-purple-600' : ''}`}
        >
          <Calendar size={20} />
          <span>Eventos</span>
        </button>
        <button 
          onClick={() => setActiveTab('notas')}
          className={`flex items-center space-x-2 px-4 py-3 flex-1 ${activeTab === 'notas' ? 'border-b-2 border-purple-600' : ''}`}
        >
          <StickyNote size={20} />
          <span>Notas</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'tareas' && (
          <div>
            <form onSubmit={agregarTarea} className="flex mb-4">
              <input
                type="text"
                value={nuevaTarea}
                onChange={(e) => setNuevaTarea(e.target.value)}
                placeholder="Nueva tarea..."
                className="flex-1 p-2 border rounded-l"
              />
              <button 
                type="submit"
                className="bg-purple-600 text-white px-4 rounded-r hover:bg-purple-700"
              >
                <Plus size={20} />
              </button>
            </form>

            <ul className="space-y-2">
              {filtrarItems(tareas).map(tarea => (
                <li 
                  key={tarea.id}
                  className="flex items-center p-2 border rounded hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={tarea.completada}
                    onChange={() => setTareas(tareas.map(t => 
                      t.id === tarea.id ? {...t, completada: !t.completada} : t
                    ))}
                    className="mr-2"
                  />
                  <span className={`flex-1 ${tarea.completada ? 'line-through text-gray-500' : ''}`}>
                    {tarea.texto}
                  </span>
                  <button 
                    onClick={() => eliminarItem(tarea.id, 'tarea')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'eventos' && (
          <div>
            <form onSubmit={agregarEvento} className="space-y-3 mb-4">
              <input
                type="text"
                value={nuevoEvento.titulo}
                onChange={(e) => setNuevoEvento({...nuevoEvento, titulo: e.target.value})}
                placeholder="Título del evento..."
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={nuevoEvento.fecha}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, fecha: e.target.value})}
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="time"
                  value={nuevoEvento.hora}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, hora: e.target.value})}
                  className="flex-1 p-2 border rounded"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={nuevoEvento.recordatorio}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, recordatorio: e.target.checked})}
                  className="mr-2"
                />
                <label>Activar recordatorio</label>
              </div>
              <button 
                type="submit"
                className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
              >
                Agregar Evento
              </button>
            </form>

            <ul className="space-y-2">
              {filtrarItems(eventos).map(evento => (
                <li 
                  key={evento.id}
                  className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium">{evento.titulo}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(evento.fecha).toLocaleDateString()} {evento.hora}
                    </div>
                  </div>
                  <button 
                    onClick={() => eliminarItem(evento.id, 'evento')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'notas' && (
          <div>
            <form onSubmit={agregarNota} className="mb-4">
              <textarea
                value={nuevaNota}
                onChange={(e) => setNuevaNota(e.target.value)}
                placeholder="Nueva nota..."
                className="w-full p-2 border rounded mb-2"
                rows="3"
              />
              <button 
                type="submit"
                className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
              >
                Agregar Nota
              </button>
            </form>

            <ul className="space-y-2">
              {filtrarItems(notas).map(nota => (
                <li 
                  key={nota.id}
                  className="p-2 border rounded hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-sm text-gray-500">
                      {new Date(nota.fecha).toLocaleDateString()}
                    </div>
                    <button 
                      onClick={() => eliminarItem(nota.id, 'nota')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap">{nota.texto}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AsistenteApp;
