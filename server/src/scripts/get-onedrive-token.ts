import http from "node:http";
import url from "node:url";
import fs from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.js";

const PORT = 5000;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

async function main() {
  const clientId = env.ONEDRIVE_CLIENT_ID;
  const clientSecret = env.ONEDRIVE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("\n❌ Error: ONEDRIVE_CLIENT_ID and ONEDRIVE_CLIENT_SECRET must be set in your server/.env file before running this script.");
    console.error("Please refer to the steps in implementation_plan.md to get these values.\n");
    process.exit(1);
  }

  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_mode=query&scope=offline_access%20Files.ReadWrite%20Mail.Send`;

  console.log("\n========================================================");
  console.log("Microsoft OneDrive Authorization Setup");
  console.log("========================================================\n");
  console.log("1. Open the following URL in your browser and log in with your Microsoft account:");
  console.log(`\n\x1b[36m${authUrl}\x1b[0m\n`);
  console.log("Waiting for authorization callback on port 5000...\n");

  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url || "", true);

    if (parsedUrl.pathname === "/callback") {
      const code = parsedUrl.query.code as string;

      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h1>Error</h1><p>No authorization code found in redirect URL.</p>");
        return;
      }

      try {
        console.log("⏳ Exchanging authorization code for tokens...");
        
        const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
        const bodyParams = new URLSearchParams();
        bodyParams.append("client_id", clientId);
        bodyParams.append("client_secret", clientSecret);
        bodyParams.append("code", code);
        bodyParams.append("redirect_uri", REDIRECT_URI);
        bodyParams.append("grant_type", "authorization_code");

        const response = await fetch(tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: bodyParams.toString(),
        });

        const data = await response.json() as any;

        if (!response.ok) {
          throw new Error(data.error_description || data.error || "Token exchange failed");
        }

        const refreshToken = data.refresh_token;

        if (!refreshToken) {
          throw new Error("No refresh token returned by Microsoft");
        }

        // Save to .env
        const envPath = path.resolve(process.cwd(), ".env");
        let envContent = await fs.readFile(envPath, "utf-8");

        if (envContent.includes("ONEDRIVE_REFRESH_TOKEN=")) {
          envContent = envContent.replace(
            /ONEDRIVE_REFRESH_TOKEN=.*/,
            `ONEDRIVE_REFRESH_TOKEN=${refreshToken}`
          );
        } else {
          envContent += `\nONEDRIVE_REFRESH_TOKEN=${refreshToken}\n`;
        }

        await fs.writeFile(envPath, envContent, "utf-8");

        console.log("\n========================================================");
        console.log("✅ Success! Microsoft OneDrive configured successfully.");
        console.log(`Refresh Token saved: ${refreshToken.substring(0, 15)}...`);
        console.log("The token has been automatically saved to your server/.env file.");
        console.log("========================================================\n");

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <body style="font-family: sans-serif; text-align: center; padding-top: 50px; background-color: #f3f4f6;">
              <div style="display: inline-block; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h1 style="color: #10b981; margin-top: 0;">Authorization Successful!</h1>
                <p style="color: #4b5563; font-size: 16px;">OneDrive connection has been configured. You can close this tab and return to the terminal.</p>
              </div>
            </body>
          </html>
        `);

        // Close server and exit after brief timeout to send response
        setTimeout(() => {
          server.close(() => {
            process.exit(0);
          });
        }, 1000);

      } catch (error: any) {
        console.error("❌ Error exchanging code:", error.message);
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(`<h1>Auth Failed</h1><p>${error.message}</p>`);
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(PORT);
}

main().catch((err) => {
  console.error("❌ Script Error:", err);
  process.exit(1);
});
