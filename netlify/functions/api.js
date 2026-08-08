exports.handler = async (event) => {
    // Domain Protection
    const allowedDomain = "wasitube.netlify.app";
    const referer = event.headers.referer || "";
    const host = event.headers.host || "";

    // Check if request is from allowed domain or localhost (for testing)
    const isAuthorized = referer.includes(allowedDomain) || host.includes(allowedDomain) || host.includes("localhost");

    if (!isAuthorized) {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: "Unauthorized! Contact Dev: +923342002756" })
        };
    }

    const query = event.queryStringParameters.q || "trending songs";
    
    // Multiple API Nodes for fallback
    const nodes = [
        "https://api.piped.private.coffee",
        "https://pipedapi.mha.fi",
        "https://inv.nadeko.net"
    ];

    for (let node of nodes) {
        try {
            const response = await fetch(`${node}/search?q=${encodeURIComponent(query)}&filter=videos`);
            if (!response.ok) continue;
            const data = await response.json();
            
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            };
        } catch (e) {
            console.error(`Node ${node} failed`);
            continue;
        }
    }

    return {
        statusCode: 500,
        body: JSON.stringify({ error: "All nodes are busy. Try again." })
    };
};
