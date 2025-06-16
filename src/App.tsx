import React, { useState } from 'react';
import { API_BASE_URL } from './config';
import searchpagelogo from './assets/searchpagelogo.jpg';
import './App.css'; 



type ResultType = {
  organism_name: string
  tax_id: number
  genbank_common_name: string
}

function App() {
  const [details, setDetails] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ResultType | null>(null);
  const [showMolecularInfo, setShowMolecularInfo] = useState(false);

  const handleSearch = () => {
    setLoading(true);
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
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });

  };

  const fetchDetails = async (taxId: number) => {
  try {
    const url = `${API_BASE_URL}/taxonRouter/taxon/${taxId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch details");

    const data = await response.json();
    setDetails(data);
    setShowModal(true);
  } catch (error) {
    console.error("Error fetching details:", error);
  }
};


  return (
  <div className="d-flex flex-column align-items-center justify-content-center bg-light" style={{ minHeight: '100vh' }}>
    <div className="text-center w-100" style={{ maxWidth: '500px' }}>
      {/*<h1 className="mb-4">Genome Search</h1>*/}
      <img src={searchpagelogo} alt="Logo" className="h-24 w-auto mb-4" />

      {/* Search Box */}
      <div className="glass-container mb-5 d-flex">  {/* Increased bottom margin from 4 to 5 */}
        <input
          type="text"
          className="form-control glass-input flex-grow-1 border-0 px-4 py-3 grey-gradient"
          placeholder="Enter the name of a animal"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn glass-button px-4 blue-gradient" onClick={handleSearch} disabled={loading}>
          {loading ? (
          <>
        Searching
        <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
        </>
          ) : (
        'Search'
      )}
        </button>
      </div>

      {/* Result Card */}
      {result && (
  <>
    <div
      className="result-card mb-3"
      onClick={() => fetchDetails(result.tax_id)}
    >
      <h5 className="result-title">Organism Name: {result.organism_name}</h5>
      <h6 className="result-subtitle">Taxon ID: {result.tax_id}</h6>
      <p className="result-text">Common Name: {result.genbank_common_name}</p>
    </div>

    {showModal && details && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2 className="modal-title">Taxon Details</h2>
      <form className="modal-form">
        <div className="form-row">
        <div className="form-group">
          <label>Organism Name</label>
          <input type="text" value={details.organism_name} readOnly />
        </div>
        <div className="form-group">
          <label>Taxon ID</label>
          <input type="text" value={details.tax_id} readOnly />
        </div>
        </div>
        <div className="form-row">
        <div className="form-group">
          <label>Common Name</label>
          <input type="text" value={details.genbank_common_name} readOnly />
        </div>
        <div className="form-group">
          <label>Rank</label>
          <input type="text" value={details.rank} readOnly />
        </div>
        </div>
        <div className="form-row">
        <div className="form-group">
          <label>Blast Name</label>
          <input type="text" value={details.blast_name} readOnly />
        </div>
        <div className="form-group">
          <label>Lineage</label>
          <input type="text" value={details.rank} readOnly />
        </div>
        </div>
        {/* --- Molecular Information Collapsible Section --- */}
        <div className="molecular-section">
          <div
            className="molecular-header"
            onClick={() => setShowMolecularInfo(!showMolecularInfo)}
          >
            <h3>Molecular Information</h3>
            <span className="toggle-icon">{showMolecularInfo ? '▼' : '▶'}</span>
          </div>

          {showMolecularInfo && (
            <div className="molecular-table">
              <div className="molecular-table-header">
                <div className="col">Type</div>
                <div className="col">Count</div>
              </div>

              {(details.counts as { type: string; count: number }[])
                .filter((entry) =>
                  [
                    'COUNT_TYPE_GENE',
                    'COUNT_TYPE_PROTEIN_CODING',
                    'COUNT_TYPE_ncRNA',
                    'COUNT_TYPE_BIOLOGICAL_REGION'
                  ].includes(entry.type)
                )
                .map((entry) => (
                  <div key={entry.type} className="molecular-table-row">
                    <div className="col">{entry.type.replace('COUNT_TYPE_', '')}</div>
                    <div className="col">{entry.count}</div>
                  </div>
                ))}
            </div>
          )}
        </div>
        {/* Add more fields as needed */}
      </form>
      <button className="btn close-button mt-3" onClick={() => setShowModal(false)}>Close</button>
    </div>
  </div>
)}
  </>
)}
    </div>
  </div>
)
}

export default App;
