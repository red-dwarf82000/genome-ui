import { useState } from 'react';
import { API_BASE_URL } from './config';


type ResultType = {
  organism_name: string
  tax_id: number
  genbank_common_name: string
}

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ResultType | null>(null)

  const handleSearch = () => {
    console.log('Searching for:', query);
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    const url = `${API_BASE_URL}/taxonRouter/taxon/get_taxon_by_name/${encodeURIComponent(trimmedQuery)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Response data:', data[0]);
        console.log(data[0]['organism_name'])
        // TODO: handle data
        const relevantData: ResultType = {
          organism_name: data[0]['organism_name'],
          tax_id: data[0]['tax_id'],
          genbank_common_name: data[0]['genbank_common_name'],
        }
        console.log(relevantData)
        setResult(relevantData)
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });

  };

  return (
  <div className="d-flex flex-column align-items-center justify-content-center bg-light" style={{ minHeight: '100vh' }}>
    <div className="text-center w-100" style={{ maxWidth: '500px' }}>
      <h1 className="mb-4">Genome Search</h1>

      {/* Search Box */}
      <div className="input-group mb-5">  {/* Increased bottom margin from 4 to 5 */}
        <input
          type="text"
          className="form-control"
          placeholder="Enter search value"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div className="card shadow mb-3"> {/* mb-3 adds margin below too */}
          <div className="card-body">
            <h5 className="card-title">Organism Name : {result.organism_name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">Taxon ID: {result.tax_id}</h6>
            <p className="card-text">Common Name : {result.genbank_common_name}</p>
          </div>
        </div>
      )}
    </div>
  </div>
)
}

export default App;
