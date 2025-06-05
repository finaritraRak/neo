import { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const Dashboard = () => {
  // Données fictives pour les graphiques
  const productionConsommationData = [
    { heure: '00h', production: 0, consommation: 1 },
    { heure: '03h', production: 0, consommation: 1.2 },
    { heure: '06h', production: 3, consommation: 1.5 },
    { heure: '09h', production: 8, consommation: 2.5 },
    { heure: '12h', production: 12, consommation: 3 },
    { heure: '15h', production: 10, consommation: 2.8 },
    { heure: '18h', production: 4, consommation: 2 },
    { heure: '21h', production: 1, consommation: 1.5 },
    { heure: '24h', production: 0, consommation: 1 },
  ];

  const socData = [
    { heure: '00h', soc: 65 },
    { heure: '03h', soc: 62 },
    { heure: '06h', soc: 60 },
    { heure: '09h', soc: 70 },
    { heure: '12h', soc: 80 },
    { heure: '15h', soc: 76 },
    { heure: '18h', soc: 68 },
    { heure: '21h', soc: 66 },
    { heure: '24h', soc: 65 },
  ];

  const historiqueProductionData = [
    { periode: 'Lun', production: 20 },
    { periode: 'Mar', production: 25 },
    { periode: 'Mer', production: 18 },
    { periode: 'Jeu', production: 30 },
    { periode: 'Ven', production: 28 },
    { periode: 'Sam', production: 22 },
    { periode: 'Dim', production: 24 },
  ];

  const sourcesUtiliseesData = [
    { source: 'PV', valeur: 60 },
    { source: 'Batterie', valeur: 20 },
    { source: 'Réseau', valeur: 15 },
    { source: 'Groupe', valeur: 5 },
  ];

  const COLORS = ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Vue Accueil</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* ✅ État global du site */}
        <div className="rounded-xl border p-4 shadow-sm flex flex-col items-center text-center bg-white">
          <span className="text-sm font-semibold text-gray-700 mb-2">État global</span>
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-500 mt-2">Tout fonctionne normalement</span>
        </div>

        {/* ⚡ Production solaire aujourd’hui */}
        <div className="rounded-xl border p-4 shadow-sm text-center bg-white">
          <div className="text-sm font-semibold text-gray-700 mb-2">Production aujourd’hui</div>
          <div className="text-xl font-bold text-yellow-600">12.4 kWh</div>
          <div className="text-xs text-gray-500">+8% par rapport à hier</div>
        </div>

        {/* 🔋 État batterie */}
        <div className="rounded-xl border p-4 shadow-sm text-center bg-white">
          <div className="text-sm font-semibold text-gray-700 mb-2">État de la batterie</div>
          <div className="text-xl font-bold text-blue-600">76%</div>
          <div className="w-full h-3 bg-gray-200 rounded mt-2">
            <div className="h-3 bg-blue-500 rounded" style={{ width: '76%' }}></div>
          </div>
        </div>

        {/* 🔌 Source actuelle - avec image batterie */}
        <div className="rounded-xl border p-4 shadow-sm text-center bg-white flex flex-col items-center">
          <div className="text-sm font-semibold text-gray-700 mb-2">Source actuelle</div>
          <img
            src="/images/batterie-pleine.png"
            alt="Batterie pleine"
            className="h-8 w-8 object-contain"
          />
          <div className="text-sm text-gray-600 mt-1">Batterie</div>
        </div>

        {/* 🔔 Alertes actives - améliorée */}
        <div className="rounded-xl border p-4 shadow-sm text-left bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Alertes</span>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <ul className="text-sm space-y-1 text-left">
            <li className="text-red-600 flex items-start">
              <span className="mr-1">⚠️</span>
              <span>Surcharge détectée à 15h20</span>
            </li>
            <li className="text-orange-500 flex items-start">
              <span className="mr-1">⚠️</span>
              <span>Batterie faible ce matin</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-10">Vue Performances Énergétiques</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Graphique production vs consommation */}
        <div className="rounded-lg border p-4 shadow-sm bg-white">
          <div className="text-sm font-semibold text-gray-700 mb-2">Production vs Consommation</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionConsommationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="heure" />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={24} />
                <Line
                  type="monotone"
                  dataKey="production"
                  name="Production (kWh)"
                  stroke="#10B981"
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={800}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="consommation"
                  name="Consommation (kWh)"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={800}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* État de charge batterie (SOC) */}
        <div className="rounded-lg border p-4 shadow-sm bg-white">
          <div className="text-sm font-semibold text-gray-700 mb-2">État de charge (SOC)</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={socData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="heure" />
                <YAxis domain={[50, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="soc"
                  name="SOC (%)"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={800}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historique de la production */}
        <div className="rounded-lg border p-4 shadow-sm bg-white">
          <div className="text-sm font-semibold text-gray-700 mb-2">Historique production</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historiqueProductionData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periode" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="production"
                  name="Production (kWh)"
                  fill="#F59E0B"
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sources utilisées dans la journée */}
        <div className="rounded-lg border p-4 shadow-sm bg-white">
          <div className="text-sm font-semibold text-gray-700 mb-2">Sources utilisées</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend verticalAlign="bottom" height={24} />
                <Pie
                  data={sourcesUtiliseesData}
                  dataKey="valeur"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={{ fontSize: 10 }}
                  isAnimationActive={true}
                  animationDuration={800}
                >
                  {sourcesUtiliseesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Autonomie solaire */}
        <div className="rounded-lg border p-4 shadow-sm col-span-1 lg:col-span-2 bg-white">
          <div className="text-sm font-semibold text-gray-700 mb-2">Autonomie solaire</div>
          <div className="text-center text-xl font-bold text-green-600">68%</div>
          <div className="text-xs text-center text-gray-500">Énergie PV / énergie totale</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
