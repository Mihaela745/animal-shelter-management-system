import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import TableViewOutlinedIcon from "@mui/icons-material/TableViewOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../../sercives/axiosInstance";
import { exportToCSV, exportToPDF } from "../../../utils/reportExport";
import {
  formatAnimalStatus,
  formatAppointmentStatus,
  formatGender,
  formatRequestStatus,
  formatSpecies,
} from "../../../utils/labels";

const RED = "#a91111";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    "& fieldset": { borderColor: "#ececec" },
    "&:hover fieldset": { borderColor: "#d3d3d3" },
    "&.Mui-focused fieldset": { borderColor: RED, borderWidth: "1.5px" },
  },
  "& label.Mui-focused": { color: RED },
};

const reportConfigs = [
  {
    id: "availableAnimals",
    title: "Animale disponibile",
    description: "Lista animalelor gata pentru adopții sau vizite.",
    endpoint: "/reports/animals",
    icon: <PetsOutlinedIcon sx={{ color: RED }} />,
    defaultFilters: { status: "Available" },
  },
  {
    id: "adoptedAnimals",
    title: "Animale adoptate",
    description: "Animale marcate deja ca adoptate în sistem.",
    endpoint: "/reports/animals",
    icon: <PetsOutlinedIcon sx={{ color: RED }} />,
    defaultFilters: { status: "Adopted" },
  },
  {
    id: "adoptionRequests",
    title: "Cereri de adopție",
    description: "Cereri trimise de utilizatori și starea lor curentă.",
    endpoint: "/reports/adoption-requests",
    icon: <FavoriteBorderOutlinedIcon sx={{ color: RED }} />,
    defaultFilters: {},
  },
  {
    id: "appointments",
    title: "Programări",
    description: "Vizite planificate, finalizate sau anulate.",
    endpoint: "/reports/appointments",
    icon: <EventOutlinedIcon sx={{ color: RED }} />,
    defaultFilters: {},
  },
  {
    id: "activeTreatments",
    title: "Tratamente active",
    description: "Medicamentele aflate în perioada activă de administrare.",
    endpoint: "/reports/medications",
    icon: <MedicalServicesOutlinedIcon sx={{ color: RED }} />,
    defaultFilters: {},
    extraParams: { active: true },
  },
  {
    id: "boxOccupancy",
    title: "Grad ocupare boxe",
    description: "Capacitate, locuri libere și procent de ocupare per boxă.",
    endpoint: "/reports/boxes/occupancy",
    icon: <Inventory2OutlinedIcon sx={{ color: RED }} />,
    defaultFilters: {},
  },
];

const statusOptions = {
  availableAnimals: ["Available", "Adopted", "Fostered"],
  adoptedAnimals: ["Adopted", "Available", "Fostered"],
  adoptionRequests: ["Pending", "Approved", "Rejected"],
  appointments: ["Scheduled", "Completed", "Cancelled"],
  activeTreatments: [],
  boxOccupancy: [],
};

function parseDateValue(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = parseDateValue(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createRows(reportId, data) {
  switch (reportId) {
    case "availableAnimals":
    case "adoptedAnimals":
      return data.map((animal) => ({
        ID: animal.id,
        Nume: animal.name,
        Specie: formatSpecies(animal.Species?.name),
        Rasa: animal.breed || "-",
        Vârstă: animal.age ?? "-",
        Gen: formatGender(animal.gender),
        Status: formatAnimalStatus(animal.status),
        Boxa: animal.Box?.box_number || animal.Boxes?.box_number || "-",
        "Data intrării": formatDate(animal.date_added),
      }));
    case "adoptionRequests":
      return data.map((request) => ({
        ID: request.id,
        Utilizator: request.User?.username || "-",
        Email: request.User?.email || "-",
        Animal: request.Animal?.name || "-",
        Specie: formatSpecies(request.Animal?.Species?.name),
        Status: formatRequestStatus(request.status),
        "Data cererii": formatDateTime(request.request_date),
      }));
    case "appointments":
      return data.map((appointment) => ({
        ID: appointment.id,
        Utilizator: appointment.User?.username || "-",
        Animal: appointment.Animal?.name || "-",
        Specie: formatSpecies(appointment.Animal?.Species?.name),
        Personal: appointment.Staff?.name || "-",
        Camera: appointment.Room?.room_number || "-",
        Data: formatDate(appointment.date),
        Ora: appointment.hour ? appointment.hour.slice(0, 5) : "-",
        Status: formatAppointmentStatus(appointment.status),
      }));
    case "activeTreatments":
      return data.map((medication) => ({
        ID: medication.id,
        Medicament: medication.name,
        Animal: medication.Medical_file?.Animal?.name || "-",
        Specie: formatSpecies(medication.Medical_file?.Animal?.Species?.name),
        Dozaj: medication.dosage || "-",
        Frecvență: medication.frequency || "-",
        "Data start": formatDate(medication.start_date),
        "Data finală": formatDate(medication.end_date),
        Veterinar: medication.Staff?.name || "-",
      }));
    case "boxOccupancy":
      return data.map((box) => ({
        ID: box.id,
        Boxa: box.box_number,
        Specie: formatSpecies(box.Species?.name),
        Capacitate: box.capacity,
        Ocupare: box.current_occupancy,
        "Locuri libere": box.available_places,
        "Grad de ocupare": box.occupancy_label,
      }));
    default:
      return [];
  }
}

export default function ReportsPage() {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;
  const isStaffMember = ["Manager", "Vet", "Caretaker"].includes(role);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(reportConfigs[0].id);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: reportConfigs[0].defaultFilters.status || "",
    species_id: "",
  });
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedReport = useMemo(
    () => reportConfigs.find((report) => report.id === selectedReportId) || reportConfigs[0],
    [selectedReportId],
  );

  const rows = useMemo(
    () => createRows(selectedReport.id, reportData),
    [selectedReport.id, reportData],
  );

  useEffect(() => {
    let ignore = false;

    async function loadSpecies() {
      try {
        const response = await axiosInstance.get("/species");
        if (!ignore) {
          setSpeciesOptions(response.data);
        }
      } catch {
        if (!ignore) {
          setSpeciesOptions([]);
        }
      }
    }

    if (isStaffMember) {
      loadSpecies();
    }

    return () => {
      ignore = true;
    };
  }, [isStaffMember]);

  useEffect(() => {
    setFilters({
      startDate: "",
      endDate: "",
      status: selectedReport.defaultFilters.status || "",
      species_id: "",
    });
  }, [selectedReport]);

  useEffect(() => {
    if (!isStaffMember) {
      return undefined;
    }

    let ignore = false;

    async function loadReport() {
      setLoading(true);
      setError("");

      try {
        const params = {
          ...selectedReport.extraParams,
          ...selectedReport.defaultFilters,
        };

        if (filters.startDate) {
          params.startDate = filters.startDate;
        }
        if (filters.endDate) {
          params.endDate = filters.endDate;
        }
        if (filters.status) {
          params.status = filters.status;
        }
        if (filters.species_id) {
          params.species_id = filters.species_id;
        }

        const response = await axiosInstance.get(selectedReport.endpoint, { params });
        if (!ignore) {
          setReportData(response.data);
        }
      } catch (fetchError) {
        if (!ignore) {
          setReportData([]);
          setError(
            fetchError.response?.data?.message ||
              "Raportul nu a putut fi încărcat acum.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      ignore = true;
    };
  }, [filters, isStaffMember, selectedReport]);

  if (!isStaffMember) {
    return (
      <Alert severity="error">
        Această pagină este disponibilă doar pentru manager, îngrijitor și veterinar.
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 4 },
        pb: { xs: 10, sm: 4, md: 5 },
        maxWidth: 1320,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                backgroundColor: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AssessmentOutlinedIcon sx={{ color: "white" }} />
            </Box>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#1d1d1d" }}>
              Rapoarte
            </Typography>
          </Box>
          <Typography sx={{ color: "#7b7b7b", ml: "56px", maxWidth: 700 }}>
            Selectează un raport, aplică filtrele dorite și exportă rezultatele în CSV
            sau PDF.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
          <Button
            variant="outlined"
            startIcon={<TableViewOutlinedIcon />}
            disabled={!rows.length}
            onClick={() =>
              exportToCSV(rows, `${selectedReport.title.toLowerCase().replaceAll(" ", "-")}.csv`)
            }
            sx={{
              borderColor: "#d7d7d7",
              color: "#333",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "12px",
            }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfOutlinedIcon />}
            disabled={!rows.length}
            onClick={() => exportToPDF(rows, selectedReport.title)}
            sx={{
              backgroundColor: RED,
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "12px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#8f0d0d", boxShadow: "none" },
            }}
          >
            Export PDF
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {reportConfigs.map((report) => {
          const active = report.id === selectedReport.id;

          return (
            <Card
              key={report.id}
              sx={{
                borderRadius: "18px",
                border: active ? `1.5px solid ${RED}` : "1.5px solid #efefef",
                boxShadow: active ? "0 18px 40px rgba(169,17,17,0.12)" : "none",
                overflow: "visible",
              }}
            >
              <CardActionArea onClick={() => setSelectedReportId(report.id)} sx={{ p: 0 }}>
                <CardContent sx={{ p: 2.2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "14px",
                        backgroundColor: "#fff4f4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {report.icon}
                    </Box>
                    {active && (
                      <Chip
                        label="Selectat"
                        size="small"
                        sx={{ color: RED, backgroundColor: "#fff1f1" }}
                      />
                    )}
                  </Box>

                  <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.6 }}>
                    {report.title}
                  </Typography>
                  <Typography sx={{ color: "#777", fontSize: "0.88rem", lineHeight: 1.5 }}>
                    {report.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>

      <Paper
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: "18px",
          border: "1px solid #efefef",
          mb: 3,
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 2 }}>
          Filtre raport
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          <TextField
            label="Data de început"
            type="date"
            value={filters.startDate}
            onChange={(event) =>
              setFilters((current) => ({ ...current, startDate: event.target.value }))
            }
            InputLabelProps={{ shrink: true }}
            sx={fieldSx}
          />
          <TextField
            label="Data de sfârșit"
            type="date"
            value={filters.endDate}
            onChange={(event) =>
              setFilters((current) => ({ ...current, endDate: event.target.value }))
            }
            InputLabelProps={{ shrink: true }}
            sx={fieldSx}
          />
          <TextField
            select
            label="Status"
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({ ...current, status: event.target.value }))
            }
            sx={fieldSx}
            disabled={!statusOptions[selectedReport.id].length}
          >
            <MenuItem value="">Toate statusurile</MenuItem>
            {statusOptions[selectedReport.id].map((status) => (
              <MenuItem key={status} value={status}>
                {selectedReport.id === "appointments"
                  ? formatAppointmentStatus(status)
                  : selectedReport.id === "adoptionRequests"
                    ? formatRequestStatus(status)
                    : formatAnimalStatus(status)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Specie"
            value={filters.species_id}
            onChange={(event) =>
              setFilters((current) => ({ ...current, species_id: event.target.value }))
            }
            sx={fieldSx}
          >
            <MenuItem value="">Toate speciile</MenuItem>
            {speciesOptions.map((species) => (
              <MenuItem key={species.id} value={String(species.id)}>
                {species.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      <Paper
        sx={{
          borderRadius: "18px",
          border: "1px solid #efefef",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: "1px solid #f2f2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1rem" }}>
              {selectedReport.title}
            </Typography>
            <Typography sx={{ color: "#8a8a8a", fontSize: "0.86rem" }}>
              {rows.length} rezultate
            </Typography>
          </Box>
          <IconButton
            size="small"
            disabled={!rows.length}
            title="Descarcă CSV"
            onClick={() =>
              exportToCSV(rows, `${selectedReport.title.toLowerCase().replaceAll(" ", "-")}.csv`)
            }
            sx={{
              color: "#c2c2c2",
              "&:hover": { color: RED, backgroundColor: "#fff1f1" },
            }}
          >
            <DownloadOutlinedIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: RED }} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2.5 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : !rows.length ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 700, color: "#9a9a9a", mb: 0.6 }}>
              Nu există rezultate pentru filtrele selectate.
            </Typography>
            <Typography sx={{ color: "#b2b2b2", fontSize: "0.9rem" }}>
              Încearcă altă perioadă, specie sau alt status.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 560 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {Object.keys(rows[0]).map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        backgroundColor: "#faf7f7",
                        color: "#5a5a5a",
                        fontWeight: 800,
                        borderBottom: "1px solid #ececec",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={`${selectedReport.id}-${index}`} hover>
                    {Object.entries(row).map(([key, value]) => (
                      <TableCell key={`${key}-${index}`}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
