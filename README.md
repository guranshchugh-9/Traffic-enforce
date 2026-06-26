# TrafficEnforcer — Submission

TrafficEnforcer is a production-oriented prototype that converts road imagery into structured enforcement evidence and case records. This repository combines a modern Next.js frontend (UI, pipeline simulator) and multiple model subprojects (detection, ANPR, enhancement, analytics) used by the platform.

This README gives a concise but expert overview: how to run the frontend demo, the pipeline contract, and a reproducible example using the bundled sample images and annotated outputs.

---

## Repository layout

```
TrafficEnforcer_Submission/
├── frontend/                 # Next.js app (UI, demo images, client pipeline)
└── models/                   # Research modules and supporting code
	├── DashCop/
	├── licensePlateDetection/
	├── DarkIR/
	├── Illegal_Parking/
	└── vehicle_detection_count/
```

The runnable component is the `frontend/` app. The `models/` folders contain research code, training scripts, and references to model weights.

## Frontend stack & scripts

- Next.js 16, React 19, TypeScript
- Tailwind CSS v4, Zustand for client state

Install and run the frontend locally:

```bash
cd frontend
npm install
npm run dev
# open http://localhost:3000
```

Key package scripts (in `frontend/package.json`): `dev`, `build`, `start`, `lint`.

## User flow & pipeline (high level)

The UI implements an upload → staged analysis → report flow. The UI-side pipeline mirrors an 8-stage processing contract (see `frontend/src/types/index.ts`):

1. Image Preprocessing
2. Vehicle & Road User Detection
3. Traffic Violation Detection
4. Violation Classification
5. License Plate Recognition (LPR)
6. Evidence Generation (annotated image)
7. Analytics Generation
8. Final Report compilation

- Stage names and descriptions are defined in `frontend/src/lib/utils.ts`.
- Session lifecycle and stage updates are handled by `frontend/src/store/analysisStore.ts`.

The frontend will simulate realistic stage durations when no backend is connected, enabling a fully demo-able local experience.

## Data contract (important for integration)

Backend responses should conform to the TypeScript types in `frontend/src/types/index.ts`. At minimum, an incremental `StageProcessingResponse` or final `AnalysisReport` should include:

- `stageId`, `status` (completed/error), `imageUrl` (annotated), `metadata`, and `processingTimeMs`.

Suggested minimal API endpoints to integrate a real backend:

- `POST /api/upload` — accept image, respond with session id
- `GET /api/session/:id/status` — return current pipeline stage statuses
- `GET /api/session/:id/report` — return the final `AnalysisReport`

## Example task: Illegal-Parking Review (reproducible)

The frontend ships with three sample images in `frontend/public/`. Use them to reproduce the demo without any backend:

- `frontend/public/testImage1.png`
- `frontend/public/testImage2.jpeg`
- `frontend/public/testImage3.avif`

Step-by-step demo (local):

1. Start the frontend dev server (see commands above).
2. On the dashboard, click the upload area and choose one of the sample images above.
3. Observe the pipeline progress and wait for the final report view.
4. Inspect panels: Evidence header, annotated image, detection summary, violations, LPR results, and system metrics.

Rendered preview images (embedded for quick review):

![Sample 1](frontend/public/testImage1.png)

![Sample 2](frontend/public/testImage2.jpeg)

![Sample 3](frontend/public/testImage3.avif)

What you will see in the final report (example expectations):

- Evidence header with `evidenceId`, case number and timestamp
- Annotated image with bounding boxes and violation overlays
- Detection summary: counts per category, processing time
- Violations panel: type, severity, confidence, suggested fine
- License plate card: OCR result, confidence, bounding box
- System metrics: overall confidence, processing time, model version

> Note: the frontend includes mocked generation of these fields when a backend is not present. When integrating a backend, the real values should replace the client-side simulated outputs.

## Developer notes & pointers

- Types: `frontend/src/types/index.ts` — keep backend responses compatible.
- Stage labels/descriptions: `frontend/src/lib/utils.ts` — update these constants if you change pipeline order.
- Store: `frontend/src/store/analysisStore.ts` — actions to start/reset sessions and update stages.
- Pages: `frontend/src/app/page.tsx` (dashboard) and `frontend/src/app/analysis/[id]/page.tsx` (processing/report view).

## Integrating a backend (practical tips)

1. Implement `POST /api/upload` that returns a session id immediately.
2. Execute inference in background and emit stage-level results as they complete (via websocket or polling `GET /api/session/:id/status`).
3. Store and expose annotated images (`imageUrl`) for evidence and display in the UI.

Security and tamper-resistance recommendations:

- Sign or checksum evidence images and store chain-of-custody metadata.
- Keep original image and annotated image immutably stored (S3 with write-once policies or hashed storage).

## Recommended next steps

1. Wire the frontend to a FastAPI/Flask backend that returns `StageProcessingResponse` objects.
2. Add an OpenAPI spec for the minimal API described above.
3. Add one or two precomputed sample `AnalysisReport` JSON files (for unit tests and CI demos).
4. Capture a screenshot of the finished report and include it in this README for reviewers.

---

I recreated this README at the repository root: `README.md`. If you want, I can now add an OpenAPI spec or include a captured report screenshot next.
