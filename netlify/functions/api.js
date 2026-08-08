exports.handler = async (event) => {
    const query = event.queryStringParameters.q || "new hindi songs";
    const nodes = [
        "https://api.piped.private.coffee",
        "https://pipedapi.mha.fi",
        "https://inv.nerdvpn.de"
    ];

    try {
        const response = await fetch(`${nodes[0]}/search?q=${encodeURIComponent(query)}&filter=videos`);
        const data = await response.json();
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ error: true }) };
    }
};
