import { ImageResponse } from "next/og";
import { getTicket, shortHash } from "@/lib/tickets";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Kairon — sealed ticket receipt";

type OgParams = { params: Promise<{ id: string }> };

export default async function OgImage({ params }: OgParams) {
  const { id } = await params;
  const ticket = getTicket(id);

  const paper = "#F4EFE4";
  const paper2 = "#EAE3D3";
  const ink = "#1A1713";
  const muted = "#7A7466";
  const border = "#D8D0BE";
  const seal = "#8A6E3E";

  const title = ticket?.title ?? "ticket not found";
  const ticketId = ticket?.id ?? id;
  const status = ticket?.status ?? "unknown";
  const proof = ticket?.proofHash ?? null;
  const agent = ticket?.agent ?? "—";
  const block = ticket?.blockNumber?.toLocaleString() ?? null;
  const sealed = status === "sealed";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: paper,
          color: ink,
          display: "flex",
          flexDirection: "column",
          padding: "80px 96px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* warm vignette layered flat (satori doesn't do radial gradients well) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: paper2,
            opacity: 0.35,
          }}
        />

        {/* top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: muted,
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              border: `1px solid ${seal}`,
              color: seal,
              fontStyle: "italic",
              fontFamily: "serif",
              fontSize: 22,
            }}
          >
            k
          </div>
          <span style={{ color: ink }}>kairon</span>
          <span style={{ color: border }}>/</span>
          <span>ticket</span>
          <span style={{ color: border }}>/</span>
          <span style={{ color: ink }}>#{ticketId}</span>
          <span style={{ flex: 1 }} />
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: sealed ? "#4C6A2F" : muted,
              fontSize: 18,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                background: sealed ? "#4C6A2F" : muted,
              }}
            />
            {status}
          </span>
        </div>

        {/* title */}
        <div
          style={{
            marginTop: 64,
            fontSize: 78,
            lineHeight: 1.02,
            letterSpacing: "-0.015em",
            maxWidth: 960,
            zIndex: 2,
          }}
        >
          {title}
        </div>

        {/* hash callout */}
        <div
          style={{
            marginTop: 56,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 16,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: muted,
            }}
          >
            sha-256 ( ticket + criteria + outcome + commit )
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 34,
              letterSpacing: 4,
              color: ink,
            }}
          >
            {proof ? shortHash(proof, 6, 4) : "pending"}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            borderTop: `1px solid ${border}`,
            paddingTop: 24,
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontFamily: "monospace",
              fontSize: 16,
              color: muted,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            <span>agent · {agent}</span>
            {block && <span>monad block · {block}</span>}
            {!block && <span>monad testnet</span>}
          </div>

          {/* sealed stamp */}
          {sealed && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "serif",
                fontStyle: "italic",
                fontSize: 60,
                color: seal,
                letterSpacing: -2,
                transform: "rotate(-3deg)",
              }}
            >
              sealed
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
