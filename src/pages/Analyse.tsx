const Analyse = () => {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Analyse</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded p-4 shadow">
          <p className="text-sm text-gray-500">Autonomie solaire</p>
          <p className="text-xl text-green-600 font-semibold">67%</p>
          <div className="w-full h-2 bg-gray-200 rounded mt-2">
            <div className="h-2 bg-green-500 rounded transition-all duration-500" style={{ width: '67%' }} />
          </div>
        </div>
        <div className="bg-white rounded p-4 shadow">
          <p className="text-sm text-gray-500">Temps groupe électrogène</p>
          <p className="text-xl text-yellow-500 font-semibold">02h14</p>
        </div>
      </div>
    </div>
  );
};

export default Analyse;
