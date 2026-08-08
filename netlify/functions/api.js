exports.handler = async (event, context) => {
    // 1. Domain Locking Logic
    const allowedDomain = "wasitube.netlify.app"; 
    
    // Headers fetch kar rahe hain
    const origin = event.headers.origin || "";
    const referer = event.headers.referer || "";
    const host = event.headers.host || "";

    // Check kar rahe hain ke request hamari apni domain se hi aa rahi hai
    const isAuthorized = 
        origin.includes(allowedDomain) || 
        referer.includes(allowedDomain) || 
        host.includes(allowedDomain);

    if (!isAuthorized) {
        return {
            statusCode: 403,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                error: "Unauthorized Access!", 
                message: "Contact Developer for API License: +923342002756" 
            })
        };
    }

    // 2. Private API Logic
    const query = event.queryStringParameters.q || "new songs";
    const API_NODES = [
        "https://api.piped.private.coffee",
        "https://pipedapi.mha.fi",
        "https://inv.nadeko.net"
    ];

    try {
        // First node se try karte hain
        const response = await fetch(`${API_NODES[0]}/search?q=${encodeURIComponent(query)}&filter=videos`);
        
        if (!response.ok) throw new Error("Node 1 failed");
        
        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Backend security function handle kar raha hai
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        // Agar pehla node down ho to dusra try karein
        try {
            const response2 = await fetch(`${API_NODES[1]}/search?q=${encodeURIComponent(query)}&filter=videos`);
            const data2 = await response2.json();
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data2)
            };
        } catch (e) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "All API Nodes Busy" })
            };
        }
    }
};
