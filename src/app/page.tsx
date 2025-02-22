"use client"
import { Card, CardContent } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts'

const monthlyData = [
  { month: "Ene", value: 400 },
  { month: "Feb", value: 300 },
  { month: "Mar", value: 800 },
  { month: "Abr", value: 500 },
  { month: "May", value: 500 },
  { month: "Jun", value: 900 },
  { month: "Jul", value: 800 },
  { month: "Ago", value: 950 },
  { month: "Sep", value: 900 },
  { month: "Oct", value: 700 },
  { month: "Nov", value: 800 },
  { month: "Dic", value: 850 },
]

const departmentData = [
  { name: "RR.HH.", value: 245 },
  { name: "Ventas", value: 384 },
  { name: "IT", value: 164 },
  { name: "Marketing", value: 293 },
  { name: "Operaciones", value: 426 },
  { name: "Finanzas", value: 173 },
]

const faultTypeData = [
  { name: "Retraso", value: 35 },
  { name: "Ausencia", value: 25 },
  { name: "Sin Justificar", value: 20 },
  { name: "Permiso", value: 20 },
]

const GRAYS = ["#333333", "#666666", "#999999", "#CCCCCC"]

const accumulatedData = [
  { month: "Ene", Faltas: 30, Incidencias: 45 },
  { month: "Feb", Faltas: 25, Incidencias: 38 },
  { month: "Mar", Faltas: 40, Incidencias: 55 },
  { month: "Abr", Faltas: 35, Incidencias: 42 },
  { month: "May", Faltas: 28, Incidencias: 39 },
  { month: "Jun", Faltas: 45, Incidencias: 62 },
]

const commonTooltipStyle = {
  contentStyle: {
    backgroundColor: "#fff",
    border: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "4px",
  },
}

const commonAxisStyle = {
  axisLine: false,
  tickLine: false,
  tick: { fontSize: 12, fill: "#666" },
}

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-medium mb-4">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Incidencias</p>
              <p className="text-3xl font-medium">2,345</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Incidencias Activas</p>
              <p className="text-3xl font-medium">123</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Faltas</p>
              <p className="text-3xl font-medium">456</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Faltas del Mes</p>
              <p className="text-3xl font-medium">45</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-sm text-muted-foreground">Incidencias por Mes</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" {...commonAxisStyle} />
                  <YAxis {...commonAxisStyle} />
                  <Tooltip {...commonTooltipStyle} />
                  <Line type="monotone" dataKey="value" stroke="#000" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-sm text-muted-foreground">Incidencias por Departamento</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" {...commonAxisStyle} />
                  <YAxis {...commonAxisStyle} />
                  <Tooltip {...commonTooltipStyle} />
                  <Bar dataKey="value" fill="#000" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-sm text-muted-foreground">Distribución de Tipos de Faltas</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={faultTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {faultTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GRAYS[index % GRAYS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...commonTooltipStyle} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-sm text-muted-foreground">Tendencias Acumuladas</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={accumulatedData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" {...commonAxisStyle} />
                  <YAxis {...commonAxisStyle} />
                  <Tooltip {...commonTooltipStyle} />
                  <Area type="monotone" dataKey="Faltas" stackId="1" stroke="#000" fill="#000" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="Incidencias" stackId="1" stroke="#666" fill="#666" fillOpacity={0.3} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

