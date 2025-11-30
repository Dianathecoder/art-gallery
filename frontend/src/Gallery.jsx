import React, { useEffect, useState } from "react";
import axios from "axios";
import Toolbar from "./Toolbar";

const API = import.meta.env.VITE_API_URL || "http://localhost:1337";

export default function Gallery() {
  const [arts, setArts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: "all",
    author: "all",
    date: "all", // podrías usar rangos
    title: "", // búsqueda por texto
  });

  const [categories, setCategories] = useState([
    "renacentismo",
    "romanticismo",
    "impresionismo",
    "modernismo",
    "realismo",
  ]);

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/galleries?populate=image`);
        // strapi returns data array: map to simpler object
        const items = res.data.data.map((item) => {
          const attr = item;
          const imgData = attr.image ?? null;
          const imageUrl = imgData
            ? imgData.url.startsWith("http")
              ? imgData.url
              : `${API}${imgData.url}`
            : null;
          return {
            id: item.id,
            title: attr.title,
            description: attr.description,
            image: imageUrl,
            categories: attr.categories,
            author: attr.author,
          };
        });

        setArts(items);

        // Extraer categorías únicas
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Cargando...</div>;

  if (!arts.length) return <div>No hay cuadros. Sube algunos en el CMS.</div>;

  // FILTRO
  const filteredArts = arts.filter((art) => {
    return (
      (filters.category === "all" || art.category === filters.category) &&
      (filters.author === "all" || art.author === filters.author) &&
      (filters.date === "all" || art.date === filters.date) &&
      (!filters.title ||
        art.title.toLowerCase().includes(filters.title.toLowerCase()))
    );
  });

  return (
    <>
      <Toolbar
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        authors={authors}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredArts.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded shadow p-2 cursor-pointer"
            onClick={() => setSelected(a)}
          >
            {a.image ? (
              <img
                src={a.image}
                alt={a.title}
                className="w-full h-48 object-cover rounded"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                Sin imagen
              </div>
            )}

            <h2 className="mt-2 font-semibold">{a.title}</h2>
            <span
              key={a.categories}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full"
            >
              {a.categories}
            </span>
          </div>
        ))}
      </div>
      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded p-4 max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold">{selected.title}</h3>
              <button
                className="text-gray-600"
                onClick={() => setSelected(null)}
              >
                Cerrar
              </button>
            </div>
            <div className="mt-4">
              {selected.image ? (
                <img
                  src={selected.image}
                  className="w-full h-auto rounded"
                  alt={selected.title}
                />
              ) : null}
              {selected.description ? (
                <p className="mt-2">{selected.description}</p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
