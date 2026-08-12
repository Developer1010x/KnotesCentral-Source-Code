import { ImageResponse } from "next/og";
import { catalogStats } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — RVCE notes, labs and question papers`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const stats = catalogStats();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#020617",
          color: "#f1f5f9",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            K
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{SITE.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
            Every note, lab manual and
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
            question paper — in one place.
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 26, color: "#94a3b8" }}>
          <div style={{ display: "flex" }}>{stats.departments} departments</div>
          <div style={{ display: "flex" }}>{stats.subjects} subjects</div>
          <div style={{ display: "flex" }}>{stats.notes} resources</div>
          <div style={{ display: "flex" }}>RVCE</div>
        </div>
      </div>
    ),
    size
  );
}
