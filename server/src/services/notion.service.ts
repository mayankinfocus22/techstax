import { env } from "../config/env.js";

interface NotionCandidateParams {
  name: string;
  email: string;
  phone?: string | null;
  expectedDailyRate?: number | null;
  cvUrl: string;
}

export async function addCandidateToNotion(params: NotionCandidateParams): Promise<string> {
  const { name, email, phone, expectedDailyRate, cvUrl } = params;

  const url = "https://api.notion.com/v1/pages";

  // Build Notion database page properties
  const properties: Record<string, any> = {
    Name: {
      title: [
        {
          text: {
            content: name,
          },
        },
      ],
    },
    Email: {
      email: email,
    },
  };

  if (phone) {
    properties.Phone = {
      phone_number: phone,
    };
  }

  if (expectedDailyRate !== undefined && expectedDailyRate !== null) {
    properties["Expected Daily Rate"] = {
      number: expectedDailyRate,
    };
  }

  if (cvUrl) {
    properties["CV File"] = {
      files: [
        {
          name: name.replace(/\s+/g, "_") + "_CV.pdf",
          type: "external",
          external: {
            url: cvUrl
          }
        }
      ]
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: {
        database_id: env.NOTION_DATABASE_ID,
      },
      properties,
    }),
  });

  const responseData = (await response.json().catch(() => null)) as any;

  if (!response.ok) {
    console.error("❌ Notion API insertion failed:", responseData);
    throw new Error(`Notion API returned status ${response.status}: ${JSON.stringify(responseData)}`);
  }

  console.log(`✅ Candidate ${name} successfully populated in Notion database`);
  return responseData?.id || "";
}
