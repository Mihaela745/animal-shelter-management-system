import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import NavbarLanding from "../../../Components/LandingPage/NavbarLanding";
import HeroPage from "../../../Components/LandingPage/HeroPage";
import AnimalsPreview from "../../../Components/LandingPage/AnimalsPreview";
import AboutSection from "../../../Components/LandingPage/AboutSection";
export default function LandingPage() {
  return (
    <>
      <NavbarLanding />
      <HeroPage />
      <AnimalsPreview />
      <AboutSection/>
    </>
  );
}
