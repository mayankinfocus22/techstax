import { env } from "../config/env.js";

export async function getAccessToken(): Promise<string> {
  if (!env.ONEDRIVE_CLIENT_ID || !env.ONEDRIVE_CLIENT_SECRET) {
    throw new Error("OneDrive Client ID and Secret must be configured");
  }

  const tokenUrl = env.ONEDRIVE_REFRESH_TOKEN
    ? "https://login.microsoftonline.com/common/oauth2/v2.0/token"
    : `https://login.microsoftonline.com/${env.ONEDRIVE_TENANT_ID}/oauth2/v2.0/token`;

  const bodyParams = new URLSearchParams();
  bodyParams.append("client_id", env.ONEDRIVE_CLIENT_ID);
  bodyParams.append("client_secret", env.ONEDRIVE_CLIENT_SECRET);

  if (env.ONEDRIVE_REFRESH_TOKEN) {
    bodyParams.append("grant_type", "refresh_token");
    bodyParams.append("refresh_token", env.ONEDRIVE_REFRESH_TOKEN);
  } else {
    bodyParams.append("grant_type", "client_credentials");
    bodyParams.append("scope", "https://graph.microsoft.com/.default");
  }

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });

  const data = (await response.json()) as any;

  if (!response.ok) {
    throw new Error(`OneDrive Auth Failed: ${data.error_description || data.error || response.statusText}`);
  }

  return data.access_token;
}

export async function uploadFileToOneDrive(fileBuffer: Buffer, fileName: string): Promise<any> {
  if (!env.ONEDRIVE_CLIENT_ID || !env.ONEDRIVE_CLIENT_SECRET) {
    console.warn("⚠️ OneDrive is not configured. Skipping OneDrive upload.");
    return null;
  }
  const accessToken = await getAccessToken();

  // URL-encode the folder and filename to be safe with spaces/special characters
  const folder = encodeURIComponent(env.ONEDRIVE_FOLDER);
  const file = encodeURIComponent(fileName);

  // If using a refresh token (personal account), use "/me"
  // Otherwise (business account client credentials), use "/users/{email}"
  const driveRootUrl = env.ONEDRIVE_REFRESH_TOKEN
    ? "https://graph.microsoft.com/v1.0/me/drive/root"
    : `https://graph.microsoft.com/v1.0/users/${env.SMTP_TO}/drive/root`;

  const uploadUrl = `${driveRootUrl}:/${folder}/${file}:/content`;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/octet-stream",
    },
    body: fileBuffer,
  });

  const data = (await response.json()) as any;

  if (!response.ok) {
    throw new Error(`OneDrive Upload Failed: ${data.error?.message || response.statusText}`);
  }

  console.log(`✅ File ${fileName} successfully uploaded to OneDrive:`, data.webUrl);
  return {
    id: data.id,
    name: data.name,
    webUrl: data.webUrl,
  };
}
