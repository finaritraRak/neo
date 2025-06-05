const Utilisateurs = () => {
  const users = [
    { nom: 'Alice Randria', role: 'Admin', email: 'alice@neo.mg' },
    { nom: 'Marc Ravelo', role: 'Technicien', email: 'marc@neo.mg' },
    { nom: 'Clara R.', role: 'Client', email: 'clara@entreprise.com' },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Utilisateurs</h1>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Rôle</th>
              <th className="p-3 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                <td className="p-3 text-gray-700">{u.nom}</td>
                <td className="p-3 text-gray-600">{u.role}</td>
                <td className="p-3 text-gray-500">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Utilisateurs;
