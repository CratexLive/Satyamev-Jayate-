export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    const cookie = url.searchParams.get('cookie') || "";

    if (!targetUrl) {
      return new Response('Missing target URL', { status: 400 });
    }

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': '*'
        }
      });
    }

    const modifiedReq = new Request(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cookie': cookie,
        'Referer': 'https://www.jiotv.com/',
        'Origin': 'https://www.jiotv.com/'
      }
    });

    try {
      const response = await fetch(modifiedReq);
      const newResp = new Response(response.body, response);
      newResp.headers.set('Access-Control-Allow-Origin', '*');
      newResp.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      return newResp;
    } catch (err) {
      return new Response('Worker Proxy Error: ' + err.message, { status: 500 });
    }
  }
};
