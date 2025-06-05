const GenererRapport = () => {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-4 text-gray-800">Générer un rapport</h1>
        <form className="bg-white rounded shadow p-4 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Période</label>
            <select className="w-full border mt-1 p-2 rounded text-sm">
              <option>Juin 2025</option>
              <option>Mai 2025</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Format</label>
            <select className="w-full border mt-1 p-2 rounded text-sm">
              <option>PDF</option>
              <option>HTML</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition">
            Générer
          </button>
        </form>
      </div>
    );
  };
  
  export default GenererRapport;
  