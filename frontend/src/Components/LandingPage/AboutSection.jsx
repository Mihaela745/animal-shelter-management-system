import { Box, Container, Typography, Grid, Paper, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HealingIcon from "@mui/icons-material/Healing";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import styles from "./AboutSection.module.css";
const items = [
  {
    icon: <FavoriteIcon sx={{ color: "#a91111" }} />,
    title: "Adopții responsabile",
    text: "Gestionăm cererile de adopție și potrivirea cu un cămin potrivit.",
  },
  {
    icon: <HealingIcon sx={{ color: "#a91111" }} />,
    title: "Îngrijire & fișe medicale",
    text: "Urmărim controalele și tratamentele pentru siguranța animalelor.",
  },
  {
    icon: <EventAvailableIcon sx={{ color: "#a91111" }} />,
    title: "Programări ușoare",
    text: "Poți programa vizite și întâlniri direct din platformă.",
  },
];

export default function AboutSection() {
  return (
    <Box id="about" sx={{ py: 10, backgroundColor: "#a91111" }}>
      <Container maxWidth="lg" className={styles.about}>
        <Box className={styles.description}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, mb: 2, color: "white" }}
          >
            Despre Paws & Hearts
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "#febfbf", maxWidth: 780, mb: 5 }}
          >
            Paws & Hearts este o platformă de management pentru adăpost și
            adopții, creată pentru a conecta animalele cu familii responsabile.
            Ne ocupăm de îngrijire, evidențe medicale și un proces de adopție
            clar și sigur.
          </Typography>
        </Box>
        <Box className={styles.informations}>
          <Grid container spacing={3} sx={{ mb: 5, justifyContent: "center",width:"50%",marginLeft:"25%",gap:"4rem"}}>
            {items.map((it) => (
              <Grid item xs={12} md={4} key={it.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid rgba(0,0,0,0.06)",
                    height: "100%",
                  }}
                >
                  <Box>
                    {it.icon}
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {it.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {it.text}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 800,
              px: 4,
              
            }}
            className={styles.button}
          >
            Vezi animalele
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
