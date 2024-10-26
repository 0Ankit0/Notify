"use client";
import Link from "next/link";
import React from "react";
export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <Link href="/dashboard">Go to Dashboard</Link>
    </>
  );
}
