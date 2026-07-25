import readline from "node:readline";
import { env } from "../config/env.js";

const REDIRECT_URI = "https://login.microsoftonline.com/common/oauth2/nativeclient";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  const clientId = env.ONEDRIVE_CLIENT_ID;
  const clientSecret = env.ONEDRIVE_CLIENT_SECRET;

  if (!clientId || clientId === "your_client_id") {
    console.error("❌ Please configure ONEDRIVE_CLIENT_ID in server/.env first.");
    process.exit(1);
  }
  if (!clientSecret || clientSecret === "your_client_secret") {
    console.error("❌ Please configure ONEDRIVE_CLIENT_SECRET in server/.env first.");
    process.exit(1);
  }

  console.log("=== OneDrive Refresh Token Generator ===");
  console.log("1. Ensure your Azure App Registration has standard Mobile and Desktop Redirect URI configured as:");
  console.log(`   ${REDIRECT_URI}`);
  console.log("2. Ensure API Permissions include: Files.ReadWrite, offline_access (under Delegated permissions)\n");

  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_mode=query&scope=${encodeURIComponent("offline_access Files.ReadWrite")}`;

  console.log("👉 Open the following URL in your browser and log in:");
  console.log(`\n${authUrl}\n`);

  const redirectedUrl = await question("👉 Paste the complete redirect URL (starting with https://login.microsoftonline...) here: ");
  rl.close();

  try {
    const urlObj = new URL(redirectedUrl.trim());
    const code = urlObj.searchParams.get("code");

    if (!code) {
      throw new Error("Could not find 'code' parameter in the pasted URL.");
    }

    console.log("\n🔄 Exchanging code for tokens...");
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

    const data = (await response.json()) as any;

    if (!response.ok) {
      throw new Error(data.error_description || data.error || "Token exchange failed");
    }

    console.log("\n✅ Success! Copy the refresh token below and add it to your server/.env file:");
    console.log(`\nONEDRIVE_REFRESH_TOKEN=${data.refresh_token}\n`);
  } catch (error: any) {
    console.error("\n❌ Error generating tokens:", error.message || error);
  }
}

main().catch(console.error);
