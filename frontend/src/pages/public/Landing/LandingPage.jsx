import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import NavbarLanding from "../../../components/LandingPage/NavbarLanding";
import HeroPage from "../../../components/LandingPage/HeroPage";
import AnimalsPreview from "../../../components/LandingPage/AnimalsPreview";
import AboutSection from "../../../components/LandingPage/AboutSection";
export default function LandingPage() {
  return (
    <>
      <NavbarLanding />
      <HeroPage />
      <AnimalsPreview />
      <AboutSection />
    </>
  );
}
