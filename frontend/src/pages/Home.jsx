import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AnnouncementsBar from "../components/AnnouncementsBar";
import ModulesSection from "../components/ModulesSection";
import ResourcesSection from "../components/ResourcesSection";
import PricingSection from "../components/PricingSection";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";

export default function Home() {
  const [modules, setModules] = useState([]);
  const [resources, setResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/modules").then((r) => setModules(r.data)).catch(() => {});
    api.get("/resources").then((r) => setResources(r.data)).catch(() => {});
    api.get("/announcements").then((r) => setAnnouncements(r.data)).catch(() => {});
    api.get("/settings").then((r) => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <div className="relative">
      <Navbar />
      <AnnouncementsBar announcements={announcements} />
      <Hero />
      <ModulesSection modules={modules} />
      <ResourcesSection resources={resources} />
      <AboutSection settings={settings} />
      <PricingSection settings={settings} />
      <Footer />
    </div>
  );
}
