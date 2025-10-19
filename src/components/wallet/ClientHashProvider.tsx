"use client";

import React from "react";
import { HashProvider } from "./HashConnectProvider";

export default function ClientHashProvider({ children }: { children: React.ReactNode }) {
  return <HashProvider>{children}</HashProvider>;
}
