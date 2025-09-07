// Generate a client ephemeral token
import axios from "axios";

export async function GET() {
  const response = await axios.post(
    "https://api.openai.com/v1/realtime/sessions",
    {
      // Session setting
      model: "gpt-4o-realtime-preview",
      modalities: ["audio", "text"],
    },
    {
      // Setup the Open API Key in header to generate the ET
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  const tempApiKey = response.data.client_secret.value;
  console.log("tempApiKey: ", tempApiKey);
  return Response.json({ tempApiKey: tempApiKey }, { status: 201 });
}
