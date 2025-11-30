export default function Toolbar({ filters, setFilters, authors, categories }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <select
        value={filters.category}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, category: e.target.value }))
        }
        className="border rounded p-1"
      >
        <option value="all">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={filters.author}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, author: e.target.value }))
        }
        className="border rounded p-1"
      >
        <option value="all">Todos los autores</option>
        {authors.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Buscar título..."
        value={filters.title}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, title: e.target.value }))
        }
        className="border rounded p-1"
      />
    </div>
  );
}
