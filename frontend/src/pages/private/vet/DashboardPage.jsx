import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import { fetchAllMedicalFiles } from "../../../features/medicalFiles/medicalFilesSlice";

const RED = "#a91111";
const RED_DARK = "#8a0d0d";

function StatCard({ title, value, subtitle, color, icon }) {
  return (
    <Card
      sx={{
        borderRadius: "18px",
        border: "1px solid #f1f1f1",
        boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "#999",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontSize: { xs: "1.7rem", md: "2rem" },
                fontWeight: 800,
                color,
              }}
            >
              {value}
            </Typography>
            {subtitle ? (
              <Typography sx={{ mt: 0.5, fontSize: "0.8rem", color: "#999" }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              backgroundColor: `${color}15`,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SectionCard({ title, subtitle, action, children }) {
  return (
    <Card
      sx={{
        borderRadius: "20px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 8px 28px rgba(0,0,0,0.05)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: 800, fontSize: "1rem", color: "#1a1a1a" }}
            >
              {title}
            </Typography>
            {subtitle ? (
              <Typography sx={{ fontSize: "0.8rem", color: "#999", mt: 0.4 }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {action}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { files, loading: medicalLoading, error: medicalError } = useSelector(
    (state) => state.medicalFiles,
  );

  useEffect(() => {
    dispatch(fetchAllMedicalFiles());
  }, [dispatch]);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const tomorrowStart = new Date();
  tomorrowStart.setHours(0, 0, 0, 0);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(23, 59, 59, 999);

  const animalsNeedingCheckup = useMemo(
    () =>
      (files || [])
        .filter((file) => {
          if (!file?.Animal) {
            return false;
          }
          if (!file.last_checkup_date) {
            return true;
          }
          return new Date(file.last_checkup_date) < oneMonthAgo;
        })
        .sort((a, b) => {
          const aTime = a.last_checkup_date
            ? new Date(a.last_checkup_date).getTime()
            : 0;
          const bTime = b.last_checkup_date
            ? new Date(b.last_checkup_date).getTime()
            : 0;
          return aTime - bTime;
        }),
    [files, oneMonthAgo],
  );

  const recentPrescriptions = useMemo(
    () =>
      (files || [])
        .flatMap((file) =>
          (file.Medications || []).map((medication) => ({
            ...medication,
            animal: file.Animal,
            medicalFileId: file.id,
          })),
        )
        .filter((medication) => new Date(medication.start_date) >= oneMonthAgo)
        .sort((a, b) => new Date(b.start_date) - new Date(a.start_date)),
    [files, oneMonthAgo],
  );

  const medicationsEndingSoon = useMemo(
    () =>
      (files || [])
        .flatMap((file) =>
          (file.Medications || []).map((medication) => ({
            ...medication,
            animal: file.Animal,
            medicalFileId: file.id,
          })),
        )
        .filter((medication) => {
          if (!medication.end_date) {
            return false;
          }

          const endDate = new Date(medication.end_date);
          return endDate >= tomorrowStart && endDate <= tomorrowEnd;
        })
        .sort((a, b) => new Date(a.end_date) - new Date(b.end_date)),
    [files, tomorrowEnd, tomorrowStart],
  );

  const handleOpenMedicalFile = (animalId, medicalFileId) => {
    navigate(`/vet/animals/${animalId}/medical/${medicalFileId}`);
  };

  const isLoading = medicalLoading;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%", pb: { xs: 10, md: 5 } }}>
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, md: 3 },
          borderRadius: "22px",
          background: "linear-gradient(135deg, #8f1111 0%, #c53a1c 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.5px",
            fontSize: { xs: "1.2rem", md: "1.5rem" },
          }}
        >
          Panou veterinar
        </Typography>
        <Typography sx={{ opacity: 0.86, mt: 0.6, fontSize: "0.9rem" }}>
          Urmărește animalele care au nevoie de control și tratamentele recente.
        </Typography>
      </Box>

      {medicalError ? (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "14px" }}>
          {typeof medicalError === "string"
            ? medicalError
            : "Nu am putut încărca datele pentru panou."}
        </Alert>
      ) : null}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: RED }} />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 1.5, md: 2.5 },
              mb: 4,
            }}
          >
            <StatCard
              title="Controale necesare"
              value={animalsNeedingCheckup.length}
              subtitle="peste 30 de zile de la ultimul control"
              color="#d32f2f"
              icon={<WarningAmberRoundedIcon />}
            />
            <StatCard
              title="Medicații recente"
              value={recentPrescriptions.length}
              subtitle="prescrise în ultima lună"
              color="#a91111"
              icon={<MedicationOutlinedIcon />}
            />
            <StatCard
              title="Se încheie curând"
              value={medicationsEndingSoon.length}
              subtitle="medicații cu final mâine"
              color="#ef6c00"
              icon={<MonitorHeartOutlinedIcon />}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr" },
              gap: 3,
              mb: 3,
            }}
          >
            <SectionCard
              title="Animale care trebuie verificate"
              subtitle="fișe fără control recent sau fără control înregistrat"
              action={
                <Button
                  size="small"
                  onClick={() => navigate("/vet/animals")}
                  endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />}
                  sx={{
                    textTransform: "none",
                    color: RED,
                    fontWeight: 700,
                  }}
                >
                  Vezi animale
                </Button>
              }
            >
              {animalsNeedingCheckup.length === 0 ? (
                <Typography sx={{ fontSize: "0.86rem", color: "#999" }}>
                  Nu există animale care să depășească pragul de o lună.
                </Typography>
              ) : (
                <Stack spacing={1.2}>
                  {animalsNeedingCheckup.slice(0, 6).map((file) => (
                    <Box
                      key={file.id}
                      sx={{
                        p: 1.5,
                        borderRadius: "14px",
                        backgroundColor: "#fff8f8",
                        border: "1px solid #ffe3e3",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 1.5,
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: "0.92rem" }}>
                            {file.Animal?.name}
                          </Typography>
                          <Typography sx={{ fontSize: "0.78rem", color: "#999", mt: 0.4 }}>
                            Ultimul control:{" "}
                            {file.last_checkup_date
                              ? new Date(file.last_checkup_date).toLocaleDateString("ro-RO")
                              : "niciun control înregistrat"}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<MedicalServicesOutlinedIcon />}
                          onClick={() =>
                            handleOpenMedicalFile(file.Animal?.id, file.id)
                          }
                          sx={{
                            backgroundColor: RED,
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: 700,
                            flexShrink: 0,
                            "&:hover": { backgroundColor: RED_DARK },
                          }}
                        >
                          Verifică
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </SectionCard>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: 3,
            }}
          >
            <SectionCard
              title="Medicații prescrise în ultima lună"
              subtitle="ultimele tratamente adăugate"
              action={
                <Button
                  size="small"
                  onClick={() => navigate("/vet/add-medication")}
                  endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />}
                  sx={{
                    textTransform: "none",
                    color: RED,
                    fontWeight: 700,
                  }}
                >
                  Adaugă medicament
                </Button>
              }
            >
              {recentPrescriptions.length === 0 ? (
                <Typography sx={{ fontSize: "0.86rem", color: "#999" }}>
                  Nu există medicații prescrise în ultima lună.
                </Typography>
              ) : (
                <Stack spacing={1.2}>
                  {recentPrescriptions.slice(0, 6).map((medication) => (
                    <Box
                      key={`${medication.medicalFileId}-${medication.id}`}
                      sx={{
                        p: 1.5,
                        borderRadius: "14px",
                        backgroundColor: "#fffafa",
                        border: "1px solid #f6e4e4",
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: "0.9rem" }}>
                        {medication.name}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "#666", mt: 0.4 }}>
                        {medication.animal?.name || "Animal necunoscut"} • {medication.dosage} •{" "}
                        {medication.frequency}
                      </Typography>
                      <Typography sx={{ fontSize: "0.76rem", color: "#999", mt: 0.5 }}>
                        Început: {new Date(medication.start_date).toLocaleDateString("ro-RO")}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </SectionCard>

            <SectionCard
              title="Medicații care se încheie curând"
              subtitle="medicații care se termină în următoarea zi"
            >
              {medicationsEndingSoon.length === 0 ? (
                <Typography sx={{ fontSize: "0.86rem", color: "#999" }}>
                  Nicio medicație nu se termină mâine.
                </Typography>
              ) : (
                <Stack spacing={1.2}>
                  {medicationsEndingSoon.slice(0, 6).map((medication) => (
                    <Box
                      key={`${medication.medicalFileId}-${medication.id}`}
                      sx={{
                        p: 1.5,
                        borderRadius: "14px",
                        backgroundColor: "#fffaf2",
                        border: "1px solid #ffe6bf",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 1.5,
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: "0.9rem" }}>
                            {medication.name}
                          </Typography>
                          <Typography sx={{ fontSize: "0.8rem", color: "#666", mt: 0.4 }}>
                            {medication.animal?.name || "Animal necunoscut"}
                          </Typography>
                          <Typography sx={{ fontSize: "0.76rem", color: "#999", mt: 0.5 }}>
                            Se încheie la{" "}
                            {new Date(medication.end_date).toLocaleDateString("ro-RO")}
                          </Typography>
                        </Box>
                        <Chip
                          icon={<PetsOutlinedIcon />}
                          label="Reevaluare"
                          size="small"
                          sx={{
                            backgroundColor: "#fff",
                            border: "1px solid #f0d7ab",
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </SectionCard>
          </Box>
        </>
      )}
    </Box>
  );
}
