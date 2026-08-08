(function() {
    "use strict";

    // 1. Inject CSS Immediately
    const style = document.createElement('style');
    style.innerHTML = `
        :root { --gold: #ffcc00; --primary: #ff0000; }
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; }
        #splash { position: fixed; inset: 0; background: #000; z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: 0.5s; }
        .logo-3d { font-size: 60px; color: var(--gold); animation: spin 3s infinite linear; }
        @keyframes spin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        header { padding: 15px; background: #111; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; padding: 15px; }
        .card { background: #111; border-radius: 8px; overflow: hidden; cursor: pointer; }
        .card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
        .card div { padding: 8px; font-size: 12px; height: 35px; overflow: hidden; }
        .player { width: 100%; aspect-ratio: 16/9; background: #000; }
        .btn-wa { background: #25d366; color: #fff; padding: 12px; text-align: center; display: block; text-decoration: none; font-weight: bold; margin: 10px; border-radius: 5px; }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML
    document.body.innerHTML = `
        <div id="splash">
            <div class="logo-3d">👑</div>
            <h1 style="letter-spacing:5px">WASI TUBE</h1>
        </div>
        <header>
            <div onclick="location.href='/'" style="font-weight:bold; color:var(--gold)">WASI TUBE</div>
            <input type="text" id="search" placeholder="Search..." style="background:#222; border:none; color:#fff; padding:8px; border-radius:5px; width:40%;">
        </header>
        <div id="video-player" style="display:none">
            <iframe id="ifr" class="player" src="" allowfullscreen allow="autoplay"></iframe>
            <div id="v-title" style="padding:15px; font-weight:bold"></div>
            <a href="https://wa.me/923342002756" class="btn-wa">CONTACT DEVELOPER</a>
        </div>
        <div class="grid" id="main-grid"></div>
    `;

    const grid = document.getElementById('main-grid');
    const player = document.getElementById('video-player');
    const ifr = document.getElementById('ifr');
    const vTitle = document.getElementById('v-title');

    window.play = (id, title) => {
        player.style.display = 'block';
        ifr.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
        vTitle.innerText = title;
        window.scrollTo(0,0);
        // Change URL to song title
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
        window.history.pushState({}, '', '/' + slug);
    };

    async function load(q) {
        grid.innerHTML = '<p style="text-align:center">Loading...</p>';
        try {
            const res = await fetch('/.netlify/functions/api?q=' + encodeURIComponent(q));
            const data = await res.json();

            if (data.error) {
                grid.innerHTML = `<div style="text-align:center; padding:20px; color:red;">${data.message}</div>`;
                return;
            }

            grid.innerHTML = '';
            data.items.forEach(v => {
                const id = v.url.split('v=')[1] || v.videoId;
                grid.innerHTML += `
                    <div class="card" onclick="play('${id}', '${v.title.replace(/'/g,"")}')">
                        <img src="https://i.ytimg.com/vi/${id}/mqdefault.jpg">
                        <div>${v.title}</div>
                    </div>`;
            });
        } catch (e) {
            grid.innerHTML = '<p style="text-align:center">Failed to load data. Refresh page.</p>';
        }
    }

    // Event Listeners
    document.getElementById('search').onkeypress = (e) => {
        if(e.key === 'Enter') load(e.target.value);
    };

    // Splash Timeout
    setTimeout(() => {
        const s = document.getElementById('splash');
        if(s) { s.style.opacity = '0'; setTimeout(() => s.remove(), 500); }
    }, 2500);

    // Auto load based on path or default
    const currentPath = window.location.pathname.replace(/\//g, '').replace(/-/g, ' ');
    load(currentPath || "new hindi songs 2024");

})();
