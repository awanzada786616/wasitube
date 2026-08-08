exports.handler = async (event) => {
    const allowedDomain = "wasitube.netlify.app";
    const host = event.headers.host || "";
    const referer = event.headers.referer || "";

    // Domain Locking
    const isAuth = host.includes(allowedDomain) || referer.includes(allowedDomain) || host.includes("localhost");

    if (!isAuth) {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: "Unauthorized! Dev: +923342002756" })
        };
    }

    const query = event.queryStringParameters.q || "trending songs";
    const nodes = ["https://api.piped.private.coffee", "https://pipedapi.mha.fi", "https://inv.nadeko.net"];

    try {
        const response = await fetch(`${nodes[0]}/search?q=${encodeURIComponent(query)}&filter=videos`);
        const data = await response.json();
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ error: "API Busy" }) };
    }
};
