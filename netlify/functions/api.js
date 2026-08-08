exports.handler = async (event, context) => {
    const allowedDomain = "wasitube.netlify.app"; 
    const host = event.headers.host || "";
    const referer = event.headers.referer || "";

    // Security Check
    const isAllowed = host.includes(allowedDomain) || referer.includes(allowedDomain) || host.includes("localhost");

    if (!isAllowed) {
        return {
            statusCode: 403,
            body: JSON.stringify({ 
                error: true, 
                message: "Unauthorized! Contact Dev: +923342002756" 
            })
        };
    }

    const query = event.queryStringParameters.q || "new songs";
    const nodes = [
        "https://api.piped.private.coffee",
        "https://pipedapi.mha.fi",
        "https://inv.nadeko.net"
    ];

    try {
        const response = await fetch(`${nodes[0]}/search?q=${encodeURIComponent(query)}&filter=videos`);
        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: true, message: "Server Busy" })
        };
    }
};
