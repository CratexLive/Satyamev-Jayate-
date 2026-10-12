export async function onRequest(context) {
  const request = context.request;
  const clientToken = request.headers.get("x-app-verify");

  if (clientToken !== "CricXCrateSecure2026") {
    return new Response(JSON.stringify({ error: "Access Denied" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }

  const keyUrl = context.env.API_KEY;

  if (!keyUrl) {
    return new Response(JSON.stringify({ error: "API_KEY environment variable is not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const response = await fetch(keyUrl);
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch Key source" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
