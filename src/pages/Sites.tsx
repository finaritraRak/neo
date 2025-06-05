const Sites = () => {
  const sites = [
    { name: 'Station Mahajanga', status: 'Actif', power: '12.7 kWh', soc: 74 },
    { name: 'Base Tamatave', status: 'Alerte', power: '7.2 kWh', soc: 51 },
    { name: 'Bureau Tana', status: 'Inactif', power: '0.0 kWh', soc: 0 },
  ];

  const statusColor = {
    Actif: 'text-green-600 bg-green-100',
    Alerte: 'text-yellow-600 bg-yellow-100',
    Inactif: 'text-gray-400 bg-gray-100',
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Sites</h1>
      <div className="space-y-3">
        {sites.map((site, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <div>
              <p className="text-sm font-medium text-gray-700">{site.name}</p>
              <p className={`text-xs px-2 py-0.5 mt-1 rounded ${statusColor[site.status]}`}>
                {site.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Prod: <strong>{site.power}</strong></p>
              <div className="w-32 h-2 bg-gray-200 rounded mt-1">
                <div
                  className="h-2 bg-blue-500 rounded"
                  style={{ width: `${site.soc}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{site.soc}% SOC</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sites;
