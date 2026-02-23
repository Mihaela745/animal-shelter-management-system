import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import styles from "./AnimalCard.module.css";

export default function AnimalCard({ animal }) {
  const { name, species, age, gender, image_url, status } = animal;
  return (
    <Card className={styles.card}>
      <CardMedia
        component="img"
        height="180"
        image={image_url}
        alt={name}
        sx={{ pbjectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
          className={styles.cardInfo}
        >
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#555" }}>
            {species} | {age} ani | {gender}
          </Typography>
          <Chip
            size="small"
            label={status}
            sx={{
              fontWeight: 600,
            }}
          />
          <CardActions>
            <Button
              variant="contained"
              fullWidth
              sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
              className={styles.button}
            >
              Vezi detalii
            </Button>
          </CardActions>
        </Box>
      </CardContent>
    </Card>
  );
}
