import React from "react";
import Hero from "../../components/header/hero/Hero";
import Properties from "../../components/properties/Properties";
import './home.scss'

export default function Home() {
  return (
    <section className="home">
      <Hero />
      <Properties />
    </section>
  );
}
