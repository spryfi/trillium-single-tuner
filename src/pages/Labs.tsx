import React from "react";
import { Header } from "@/components/Header";
import { LessonRunner } from "../widgets/LessonRunner";
import "../styles/labs.css";

export default function LabsPage() {
  return (
    <>
      <Header />
      <main className="labs-root" aria-label="Labs learning page">
      <header className="labs-header">
        <h1>Labs</h1>
        <p className="subtitle">
          Hands-on practice for Trillium v7.16 pattern writing — learn, then build, with instant feedback.
        </p>
      </header>
      <LessonRunner />
    </main>
    </>
  );
}
