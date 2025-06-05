const Alertes = () => {
  const alertes = [
    { time: '14:22', site: 'Station Mahajanga', message: 'Tension batterie critique' },
    { time: '10:17', site: 'Base Tamatave', message: 'Panne PV temporaire' },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Alertes</h1>
      <div className="space-y-2">
        {alertes.map((a, i) => (
          <div key={i} className="bg-white p-3 rounded shadow border-l-4 border-red-500 hover:bg-red-50 transition">
            <p className="text-sm text-gray-700 font-medium">{a.message}</p>
            <p className="text-xs text-gray-500">{a.site} — {a.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alertes;
