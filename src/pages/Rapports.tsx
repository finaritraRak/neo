const Rapports = () => {
  const rapports = [
    { date: '2025-06-01', titre: 'Rapport - Mai 2025', lien: '/rapports/mai.pdf' },
    { date: '2025-05-01', titre: 'Rapport - Avril 2025', lien: '/rapports/avril.pdf' },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Rapports</h1>
      <div className="space-y-2">
        {rapports.map((r, i) => (
          <div key={i} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-800">{r.titre}</p>
              <p className="text-xs text-gray-500">{r.date}</p>
            </div>
            <a href={r.lien} className="text-blue-600 text-sm hover:underline">Télécharger</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rapports;
