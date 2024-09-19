// app/client.tsx
import { StartClient } from "@tanstack/start";
import { hydrateRoot } from "react-dom/client";
import "./globals.css";
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(document.getElementById("root")!, <StartClient router={router} />);
