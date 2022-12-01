export default function FilterBar({categories, filters, filtersDispatch}) {
  return (
    <div className="filters">
        {categories.map(categorie => 
            <button 
                key={categorie} 
                className={`filter ${filters.some(filter => filter === categorie) ? 'active' : ''}`}
                onClick={() =>{
                    filtersDispatch({filter: categorie, action: 'toggle'});
                } }
                >
                {categorie}
            </button>
        )}
        <button
            className={`filter ${filters.length === 0 ? 'active' : ''}`}
            onClick={() =>{
                filtersDispatch({action: 'clear'});
            }}
        >
            Alle
        </button>
    </div>
  )
}