# FastTube

A lightweight HTML, CSS, Vanilla JavaScript and Vercel Functions starter project.

## Important capability note

This project **does not download arbitrary YouTube videos or extract YouTube audio**. The YouTube oEmbed endpoint is used only to retrieve public metadata (title, channel name and thumbnail). It does not provide media files.

The download API intentionally returns `501 Not Implemented` until you connect a media provider that explicitly authorizes downloading and processing. Do not add code that bypasses platform restrictions, access controls or copyright protections. The interface does not fabricate quality options or download links.

## Requirements

- Windows, macOS or Linux
- Node.js 20 or newer
- VS Code
- A Vercel account (free Hobby account is enough for a personal starter deployment)
- Git and a GitHub account for the recommended deployment flow

## Open in VS Code

1. Extract `FastTube.zip`.
2. Open VS Code.
3. Select **File → Open Folder** and choose the extracted `FastTube` folder.
4. Open **Terminal → New Terminal**.

## Run locally

Install dependencies:

```bash
npm install
```

Start Vercel's local development server:

```bash
npm run dev
```

Open the local URL printed in the terminal (normally `http://localhost:3000`).

The project uses Vercel Functions in the `/api` directory. Running `index.html` directly with Live Server will show the interface, but API requests will not work correctly. Use `npm run dev`.

Check the API:

- `http://localhost:3000/api/health`

## Project structure

```text
FastTube/
├── api/
│   ├── analyze.js       # Public YouTube metadata only (oEmbed)
│   ├── download.js      # Safe placeholder; no provider configured
│   └── health.js        # API health check
├── css/
│   └── style.css
├── js/
│   └── script.js
├── index.html
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

## Publish on Vercel — recommended GitHub method

### 1. Create a GitHub repository

1. Sign in to GitHub and create a new repository named `fasttube`.
2. Keep the repository empty (do not add a README or `.gitignore`, because these are already included in this project).

### 2. Push the project from VS Code

In the VS Code terminal, run these commands from the `FastTube` project folder. Replace the URL with your own GitHub repository URL.

```bash
git init
git add .
git commit -m "Initial FastTube project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/fasttube.git
git push -u origin main
```

### 3. Import it into Vercel

1. Open [Vercel New Project](https://vercel.com/new).
2. Sign in and connect GitHub if asked.
3. Find the `fasttube` repository and click **Import**.
4. Configure the project:
   - Project Name: `fasttube` (or another available name)
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: leave blank
   - Output Directory: leave blank
   - Install Command: `npm install` (or leave the detected default)
5. Click **Deploy**.
6. When deployment completes, open the `.vercel.app` URL shown by Vercel.

No environment variables are required for this starter version.

### 4. Update your website later

Make changes in VS Code, then run:

```bash
git add .
git commit -m "Update FastTube"
git push
```

Vercel automatically creates a new deployment when you push to the connected GitHub branch.

## Alternative: deploy without GitHub

Vercel Drop can publish a project folder or ZIP:

1. Open [https://vercel.com/drop](https://vercel.com/drop).
2. Drag the extracted `FastTube` folder or the ZIP file into the page.
3. Choose your Vercel team and project name, then deploy.

For a long-term project, GitHub integration is better because pushes can automatically deploy updates.

## API endpoints

### `GET /api/health`

Returns the API status.

### `POST /api/analyze`

Request:

```json
{ "url": "https://www.youtube.com/watch?v=VIDEO_ID" }
```

Returns public oEmbed metadata: video ID, title, author and thumbnail. It does not return duration, available formats, or media streams.

### `POST /api/download`

Returns HTTP `501` until an authorized provider adapter is implemented. This is deliberate and prevents the UI from pretending a download is available.

## Adding an authorized provider

Implement the integration server-side only after confirming that the provider and the specific content authorize downloading and processing. A future adapter should:

- Validate the provider and content permissions on the server.
- Return only formats actually supplied by that provider.
- Keep provider credentials in Vercel Environment Variables, never in frontend JavaScript.
- Stream large files rather than loading them entirely into memory.
- Enforce request limits, rate limits, timeouts and safe filenames.
- Never accept arbitrary remote URLs as a server-side fetch target; use a strict provider/domain allowlist to prevent SSRF.
- Clean up temporary files and follow the provider's retention requirements.

Vercel Functions are request/response serverless functions, not a persistent background media-processing server. Long-running or large media-processing workloads may require a separate provider or dedicated backend host. Review current Vercel function limits before implementing such a workflow.

## Troubleshooting

- **`npm` is not recognized:** Install Node.js LTS from [nodejs.org](https://nodejs.org), restart VS Code, then run `node -v` and `npm -v`.
- **`git` is not recognized:** Install Git from [git-scm.com](https://git-scm.com), restart VS Code and retry.
- **API returns 404 locally:** Make sure you started the project with `npm run dev` (Vercel CLI), not VS Code Live Server.
- **Video preview fails:** The video may be private, removed, age-restricted, or unavailable through YouTube oEmbed.
- **Deployment fails:** Check the Vercel deployment build/function logs and confirm that the project root is the folder containing `vercel.json`.

## License

Use and modify this starter project for your own learning and development. Respect the terms of service and rights attached to every media source you integrate.
