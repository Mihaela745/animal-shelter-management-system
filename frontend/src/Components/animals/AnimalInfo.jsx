import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import { formatAnimalStatus, formatGender } from "../../utils/labels";

const formatDate = (value) => {
  if (!value) return "-";
  const normalized =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00`
      : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("ro-RO");
};

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
    <Typography color="text.secondary">{label}</Typography>
    <Typography fontWeight={600} textAlign="right">
      {value}
    </Typography>
  </Box>
);

export default function AnimalInfo({ animal }) {
  const { metadata, loading } = useSelector((state) => state.breedMetadata);

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Typography variant="h4" fontWeight={600} sx={{ color: "#a91111" }}>
          {animal.name}
        </Typography>
        <Chip
          label={formatAnimalStatus(animal.status)}
          color={animal.status === "Available" ? "success" : "error"}
          sx={{ fontWeight: 500, borderRadius: "8px" }}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={0.1}>
        <InfoRow
          label="Varsta"
          value={animal.age != null ? `${animal.age} ani` : "-"}
        />
        <InfoRow label="Sex" value={formatGender(animal.gender)} />
        <InfoRow label="Rasa" value={animal.breed || "-"} />
        <InfoRow label="Adaugat in sistem" value={formatDate(animal.date_added)} />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} sx={{ color: "#a91111" }} />
          </Box>
        )}

        {metadata && (
          <>
            <Divider sx={{ my: 1 }} />
            {metadata.size && <InfoRow label="Talie" value={metadata.size} />}
            {metadata.temperament && (
              <InfoRow label="Temperament" value={metadata.temperament} />
            )}
            {metadata.life_expectancy && (
              <InfoRow label="Durata viata" value={metadata.life_expectancy} />
            )}
          </>
        )}
      </Stack>
    </Box>
  );
}
