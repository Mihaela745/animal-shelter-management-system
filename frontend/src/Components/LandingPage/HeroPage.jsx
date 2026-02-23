import { Box, Typography, Button, Container } from "@mui/material";
import styles from "./HeroPage.module.css";
import heroImg from "../../assets/cats-dogs-curiously-peeking-over-white-web-banner-playful-moment-companionship-where-group-clean-423319524.webp";
export default function HeroPage() {
  return (
    <Box id="home" className={styles.heroPage}>
      <Box className={styles.left}>
        <Typography
          variant="h3"
          style={{ color: "white" }}
          className={styles.typo}
        >
          Oferă-le o casă.
        </Typography>
        <Typography
          variant="h4"
          style={{ color: "white" }}
          className={styles.typo}
        >
          <span style={{ color: "#000000" }}>
            Iar ei o să-ți ofere iubire...
          </span>
        </Typography>
        <Typography
          variant="h5"
          style={{ color: "black" }}
          className={styles.typo}
        >
          Adoptă un animal și schimbă-i viața.
        </Typography>
        <Button className={styles.adoptionButton}>Adoptă</Button>
      </Box>
      <Box className={styles.right}>
        <img src={heroImg}></img>
      </Box>
    </Box>
  );
}
