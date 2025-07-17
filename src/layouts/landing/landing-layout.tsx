import React from "react";
import Nav from "./nav";
import Footer from "./footer";

/* ---------------------------------------------- */

/**
 * Landing page layout
 *
 * @returns ReactElement
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <main>
      <Nav />
      {children}
      <Footer />
    </main>
  );
}
