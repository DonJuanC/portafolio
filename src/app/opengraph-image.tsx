import { ImageResponse } from "next/og";

export const alt = "JCamilo Castellanos · Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#14120e",
        color: "#e9e3d4",
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", fontSize: 34, color: "#e5a93d" }}>
        jcamilo@dev:~/cali$
      </div>
      <div style={{ display: "flex", fontSize: 84, marginTop: 24 }}>
        JCamilo Castellanos
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 38,
          marginTop: 20,
          color: "#a89f8c",
        }}
      >
        Full Stack Developer · Ingeniero industrial · Cali
      </div>
    </div>,
    size,
  );
}
