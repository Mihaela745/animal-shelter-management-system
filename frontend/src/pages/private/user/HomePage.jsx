import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import PetsIcon from "@mui/icons-material/Pets";
import PsychologyIcon from "@mui/icons-material/Psychology";

export default function HomePage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  return (
    <Box className={styles.mainContainer}>
      <Box className={styles.header}>
        <Typography className={styles.title}>
          Bun venit, {user?.username}
        </Typography>
        <Typography className={styles.subtitle}>
          Alege cum să continui mai departe...
        </Typography>
      </Box>
      <Box className={styles.cardsContainer}>
        <Card className={styles.card}>
          <CardActionArea onClick={() => navigate("/user/animals")}>
            <CardContent className={styles.cardContent}>
              <PetsIcon className={styles.icon} />
              <Typography className={styles.cardTitle}>
                Caută animale
              </Typography>
              <Typography className={styles.cardDescription}>
                Explorează toate animalele disponibile.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={styles.card}>
          <CardActionArea onClick={() => navigate("/user/match")}>
            <CardContent className={styles.cardContent}>
              <PsychologyIcon className={styles.icon} />
              <Typography className={styles.cardTitle}>
                Gasește-mi match-ul
              </Typography>
              <Typography className={styles.cardDescription}>
                Oferă o descriere cât mai bună, iar noi îți dăm animalul
                perfect!
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
      <Button className={styles.button} component={Link} to="/user/dashboard">
        dashboard
      </Button>
    </Box>
  );
}
