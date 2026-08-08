(function() {
    "use strict";

    // 1. CSS Injection (Security: UI design hidden in JS)
    const style = document.createElement('style');
    style.innerHTML = `
        :root { --primary: #ff0000; --gold: #ffcc00; --bg: #000; --card: #121212; }
        body { background: var(--bg); color: #fff; font-family: 'Poppins', sans-serif; margin: 0; padding: 0; overflow-x: hidden; }
        
        #splash-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle, #1a1a1a, #000); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; perspective: 1000px; transition: opacity 0.8s ease; }
        .logo-3d { animation: rot 3s infinite linear; transform-style: preserve-3d; font-size: 80px; color: var(--gold); filter: drop-shadow(0 0 20px rgba(255,204,0,0.5)); }
        @keyframes rot { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        
        header { background: rgba(0,0,0,0.95); padding: 12px 5%; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #222; position: sticky; top: 0; z-index: 1000; backdrop-filter: blur(10px); }
        .logo { display: flex; align-items: center; gap: 10px; font-weight: 900; font-family: 'Montserrat', sans-serif; cursor: pointer; font-size: 1.4rem; }
        
        .search-bar { background: #111; border: 1px solid #333; border-radius: 25px; padding: 8px 15px; display: flex; align-items: center; flex: 1; margin: 0 20px; max-width: 500px; }
        .search-bar input { background: transparent; border: none; color: #fff; width: 100%; outline: none; font-size: 14px; }
        
        .v-container { width: 100%; aspect-ratio: 16/9; background: #000; border-bottom: 1px solid #222; }
        iframe { width: 100%; height: 100%; border: none; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; padding: 20px; }
        .v-card { background: var(--card); border-radius: 12px; overflow: hidden; cursor: pointer; transition: 0.3s; border: 1px solid #222; }
        .v-card:hover { transform: translateY(-5px); border-color: var(--primary); }
        .v-card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
        .v-title { padding: 10px; font-size: 13px; font-weight: 600; height: 40px; overflow: hidden; line-height: 1.3; }
        
        .btn-wa { background: #25d366; color: #fff; padding: 12px; text-align: center; display: block; text-decoration: none; border-radius: 8px; margin: 20px; font-weight: bold; font-size: 14px; }
        
        .loader { border: 3px solid #222; border-top: 3px solid var(--primary); border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 40px auto; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 480px) { .grid { grid-template-columns: 1fr 1fr; gap: 10px; padding: 10px; } .logo span { display: none; } }
    `;
    document.head.appendChild(style);

    // 2. HTML Injection
    document.body.innerHTML = `
        <div id="splash-screen">
            <div class="logo-3d"><i class="fas fa-crown"></i></div>
            <h1 style="margin-top:25px; letter-spacing:5px; font-family:'Montserrat'">WASI TUBE</h1>
        </div>
        <header>
            <div class="logo" onclick="location.href='/'"><i class="fas fa-crown" style="color:var(--gold)"></i> <span>WASI TUBE</span></div>
            <div class="search-bar"><input type="text" id="q-in" placeholder="Search premium content..."><i class="fas fa-search" style="color:#555"></i></div>
        </header>
        <main>
            <div id="p-box" style="display:none">
                <div class="v-container"><iframe id="ifr" src="" allowfullscreen allow="autoplay"></iframe></div>
                <div style="padding:15px">
                    <h2 id="v-title" style="margin:0; font-size:1.2rem;"></h2>
                    <a href="https://wa.me/923342002756" class="btn-wa"><i class="fab fa-whatsapp"></i> CONTACT DEVELOPER</a>
                </div>
            </div>
            <div class="grid" id="v-grid"></div>
        </main>
    `;

    // 3. API Logic
    window.playVid = function(id, title) {
        document.getElementById('p-box').style.display = 'block';
        document.getElementById('ifr').src = `https://www.youtube.com/embed/${id}?autoplay=1`;
        document.getElementById('v-title').innerText = title;
        window.history.pushState({}, '', '/' + title.toLowerCase().replace(/\s+/g, '-'));
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    async function load(q) {
        const g = document.getElementById('v-grid');
        g.innerHTML = '<div class="loader"></div>';

        try {
            // Relative path for Netlify function
            const r = await fetch(`/.netlify/functions/api?q=${encodeURIComponent(q)}`);
            const d = await r.json();

            if (d.error) {
                g.innerHTML = `<p style="color:red; text-align:center; padding:20px;">${d.message}</p>`;
                return;
            }

            g.innerHTML = '';
            d.items.forEach(v => {
                const id = v.url.split('v=')[1] || v.videoId;
                if(!id) return;
                const card = document.createElement('div');
                card.className = 'v-card';
                card.onclick = () => playVid(id, v.title);
                card.innerHTML = `
                    <img src="https://i.ytimg.com/vi/${id}/mqdefault.jpg" alt="thumb">
                    <div class="v-title">${v.title}</div>
                `;
                g.appendChild(card);
            });
        } catch(e) {
            g.innerHTML = '<p style="text-align:center">Server busy. Please refresh.</p>';
        }
    }

    // Input Events
    document.getElementById('q-in').onkeypress = (e) => {
        if(e.key === 'Enter') {
            load(e.target.value);
            window.history.pushState({}, '', '/');
        }
    };

    // Splash Timeout
    setTimeout(() => {
        const ss = document.getElementById('splash-screen');
        ss.style.opacity = '0';
        setTimeout(() => ss.style.display = 'none', 800);
    }, 2500);

    // Initial Load
    const p = window.location.pathname.replace(/\//g, '').replace(/-/g, ' ');
    load(p || "new bollywood songs 2024");

})();
