document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    // 1. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        :root { --gold: #ffcc00; --red: #ff0000; }
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; }
        #splash { position: fixed; inset: 0; background: #000; z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: 0.8s; }
        .crown { font-size: 70px; color: var(--gold); animation: spin 3s infinite linear; }
        @keyframes spin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        header { padding: 15px; background: #111; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 15px; padding: 20px; }
        .card { background: #111; border-radius: 10px; overflow: hidden; cursor: pointer; border: 1px solid #222; }
        .card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
        .card-t { padding: 10px; font-size: 13px; font-weight: 600; height: 35px; overflow: hidden; }
        .player-box { width: 100%; aspect-ratio: 16/9; background: #000; border-bottom: 2px solid var(--red); }
        .btn-wa { background: #25d366; color: #fff; padding: 12px; text-align: center; display: block; text-decoration: none; border-radius: 8px; margin: 15px; font-weight: bold; }
        @media (max-width: 480px) { .grid { grid-template-columns: 1fr 1fr; gap: 10px; padding: 10px; } }
    `;
    document.head.appendChild(style);

    // 2. Inject Body HTML
    document.body.innerHTML = `
        <div id="splash">
            <div class="crown">👑</div>
            <h1 style="letter-spacing:5px; font-family: sans-serif; margin-top:20px;">WASI TUBE</h1>
        </div>
        <header>
            <div onclick="location.href='/'" style="font-weight:900; color:var(--gold); font-size:1.4rem; cursor:pointer;">WASI TUBE</div>
            <input type="text" id="srch" placeholder="Search song..." style="background:#222; border:none; color:#fff; padding:8px 15px; border-radius:20px; width:45%;">
        </header>
        <div id="p-area" style="display:none">
            <div class="player-box"><iframe id="ifr" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay"></iframe></div>
            <div style="padding:15px">
                <h2 id="p-title" style="margin:0; font-size:1.2rem;"></h2>
                <a href="https://wa.me/923342002756" class="btn-wa"><i class="fab fa-whatsapp"></i> CONTACT DEVELOPER</a>
            </div>
        </div>
        <div id="v-grid" class="grid"></div>
    `;

    const vGrid = document.getElementById('v-grid');
    const pArea = document.getElementById('p-area');
    const ifr = document.getElementById('ifr');
    const pTitle = document.getElementById('p-title');

    // 3. Play Function
    window.playVid = function(id, title) {
        pArea.style.display = 'block';
        ifr.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
        pTitle.innerText = title;
        window.scrollTo({top: 0, behavior: 'smooth'});
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
        window.history.pushState({}, '', '/' + slug);
    };

    // 4. Data Loading
    async function loadData(q) {
        vGrid.innerHTML = '<p style="text-align:center; width:100%;">Loading Premium Content...</p>';
        try {
            const r = await fetch('/api/?q=' + encodeURIComponent(q));
            const d = await r.json();

            if (d.error) {
                vGrid.innerHTML = '<p style="color:red; text-align:center; width:100%;">API Server Busy. Try Again.</p>';
                return;
            }

            vGrid.innerHTML = '';
            d.items.forEach(v => {
                const id = v.url.split('v=')[1] || v.videoId;
                if(!id) return;
                const card = document.createElement('div');
                card.className = 'card';
                card.onclick = () => playVid(id, v.title);
                card.innerHTML = `
                    <img src="https://i.ytimg.com/vi/${id}/mqdefault.jpg">
                    <div class="card-t">${v.title}</div>
                `;
                vGrid.appendChild(card);
            });
        } catch (e) {
            vGrid.innerHTML = '<p style="text-align:center; width:100%;">Connection Error.</p>';
        }
    }

    // Search Input
    document.getElementById('srch').onkeypress = (e) => {
        if(e.key === 'Enter') {
            loadData(e.target.value);
            window.history.pushState({}, '', '/');
        }
    };

    // 5. Fail-safe Splash Removal
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if(splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 800);
        }
    }, 3000); // 3 Seconds fixed timer

    // Load Initial Data
    const path = window.location.pathname.replace(/\//g, '').replace(/-/g, ' ');
    loadData(path || "new bollywood songs 2024");
});
