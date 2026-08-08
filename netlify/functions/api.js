// WASITUBE PRIVATE API - Node.js Built-in Fetch (No Error Version)
exports.handler = async (event) => {
    const allowedDomain = "wasitube.netlify.app";
    const referer = event.headers.referer || "";

    // Security: Sirf aapki domain par chalay ga
    if (!referer.includes(allowedDomain) && !event.headers.host.includes("localhost")) {
        return {
            statusCode: 403,
            body: JSON.stringify({ 
                error: "Unauthorized", 
                message: "API ACCESS DENIED! Contact Dev: +923342002756" 
            })
        };
    }

    const query = event.queryStringParameters.q || "new hindi songs";
    // Asli Nodes yahan chupi hain, browser ko nazar nahi aayengi
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
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server Busy" })
        };
    }
};
