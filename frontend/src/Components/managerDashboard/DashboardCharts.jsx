import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { Box, Typography, Card } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PetsIcon from "@mui/icons-material/Pets";

const months = [
  "Ian",
  "Feb",
  "Mar",
  "Apr",
  "Mai",
  "Iun",
  "Iul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function parseDateValue(dateValue) {
  if (!dateValue) {
    return null;
  }

  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return new Date(`${dateValue}T00:00:00`);
  }

  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: "12px",
          px: 2,
          py: 1.5,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <Typography fontSize="0.75rem" color="#999" fontWeight={600} mb={0.5}>
          {label}
        </Typography>
        {payload.map((p, i) => (
          <Typography
            key={i}
            fontSize="0.88rem"
            fontWeight={700}
            color={p.color}
          >
            {p.value} {p.name}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const ChartCard = ({ icon, title, subtitle, color, children }) => (
  <Card
    sx={{
      borderRadius: "20px",
      p: 3,
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      border: "1px solid #f5f5f5",
      height: "100%",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "12px",
          backgroundColor: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ color, display: "flex" }}>{icon}</Box>
      </Box>
      <Box>
        <Typography fontWeight={700} fontSize="0.95rem" color="#1a1a1a">
          {title}
        </Typography>
        {subtitle && (
          <Typography fontSize="0.72rem" color="#bbb">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
    {children}
  </Card>
);

export default function DashboardCharts({
  animals,
  adoptions,
  requests,
  appointments,
}) {
  const monthlyData = months.map((m, i) => ({
    month: m,
    adoptions: adoptions.filter((a) => {
      const date = parseDateValue(a.adoption_date);
      return date && date.getMonth() === i;
    }).length,
    requests: requests.filter((r) => {
      const date = parseDateValue(r.createdAt || r.created_at || r.request_date);
      return date && date.getMonth() === i;
    }).length,
    appointments: appointments.filter((a) => {
      const date = parseDateValue(a.date);
      return date && date.getMonth() === i;
    }).length,
  }));

  const speciesCount = {};
  animals.forEach((a) => {
    const name = a.Species?.name || "Alta specie";
    speciesCount[name] = (speciesCount[name] || 0) + 1;
  });
  const speciesData = Object.entries(speciesCount).map(([name, value]) => ({
    name,
    value,
  }));

  const PIE_COLORS = [
    "#a91111",
    "#1565c0",
    "#2e7d32",
    "#e65100",
    "#6a1b9a",
    "#00695c",
  ];

  const axisStyle = { fontSize: 11, fill: "#bbb", fontWeight: 600 };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 10,
        marginBottom: "10rem",
      }}
    >
      <ChartCard
        icon={<TrendingUpIcon fontSize="small" />}
        title="Adopții pe lună"
        subtitle="Evoluție anuală"
        color="#2e7d32"
      >
        <Box sx={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="adoptGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis
                dataKey="month"
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="adoptions"
                stroke="#2e7d32"
                strokeWidth={2.5}
                fill="url(#adoptGrad)"
                dot={{ r: 3, fill: "#2e7d32" }}
                activeDot={{ r: 5 }}
                name="adopții"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </ChartCard>

      <ChartCard
        icon={<BarChartIcon fontSize="small" />}
        title="Cereri de adopție"
        subtitle="Per lună"
        color="#a91111"
      >
        <Box sx={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f5f5f5"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="requests"
                fill="#a91111"
                radius={[6, 6, 0, 0]}
                name="cereri"
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </ChartCard>

      <ChartCard
        icon={<EventNoteIcon fontSize="small" />}
        title="Programări pe lună"
        subtitle="Evoluție anuală"
        color="#e65100"
      >
        <Box sx={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="apptGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e65100" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#e65100" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis
                dataKey="month"
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke="#e65100"
                strokeWidth={2.5}
                fill="url(#apptGrad)"
                dot={{ r: 3, fill: "#e65100" }}
                activeDot={{ r: 5 }}
                name="programări"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </ChartCard>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <ChartCard
          icon={<PetsIcon fontSize="small" />}
          title="Distribuție specii"
          subtitle="Animale în adăpost"
          color="#1565c0"
        >
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={speciesData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={40}
                  paddingAngle={3}
                  label={({ name, percent }) =>
                    percent > 0.05
                      ? `${name} ${(percent * 100).toFixed(0)}%`
                      : ""
                  }
                  labelLine={false}
                >
                  {speciesData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </ChartCard>
      </Box>
    </Box>
  );
}
