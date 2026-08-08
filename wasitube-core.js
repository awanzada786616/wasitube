(function() {
    "use strict";

    // 1. Injected CSS
    const style = document.createElement('style');
    style.innerHTML = `
        :root { --gold: #ffcc00; --red: #ff0000; --bg: #000; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: #fff; font-family: 'Poppins', sans-serif; overflow-x: hidden; }

        /* 3D SPLASH */
        #splash { position: fixed; inset: 0; background: #000; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: 0.8s; perspective: 1000px; }
        .crown { font-size: 80px; color: var(--gold); animation: rot 3s infinite linear; filter: drop-shadow(0 0 20px rgba(255,204,0,0.4)); }
        @keyframes rot { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        
        header { background: rgba(0,0,0,0.9); padding: 12px 15px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #222; position: sticky; top: 0; z-index: 1000; }
        .logo { display: flex; align-items: center; gap: 10px; font-weight: 900; font-family: sans-serif; cursor: pointer; }
        
        #sidebar { position: fixed; top: 0; left: -300px; width: 280px; height: 100%; background: #0a0a0a; z-index: 2000; transition: 0.3s; padding: 40px 20px; box-shadow: 10px 0 30px #000; }
        #sidebar.active { left: 0; }
        .side-link { padding: 15px; display: flex; align-items: center; gap: 15px; color: #ccc; text-decoration: none; border-radius: 10px; margin-bottom: 8px; }
        .side-link i { color: var(--red); }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; z-index: 1500; }

        .container { max-width: 1100px; margin: 0 auto; }
        #p-view { display: none; width: 100%; }
        .v-box { width: 100%; aspect-ratio: 16/9; background: #000; border-bottom: 3px solid var(--red); }
        iframe { width: 100%; height: 100%; border: none; }
        
        .btn-row { display: flex; gap: 10px; padding: 20px 15px; }
        .btn { flex: 1; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-wa { background: #25d366; color: #fff; }
        .btn-dev { background: #fff; color: #000; }

        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 15px; }
        @media (min-width: 768px) { .grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); } }
        .v-card { cursor: pointer; }
        .v-card img { width: 100%; aspect-ratio: 16/9; border-radius: 10px; object-fit: cover; }
        .v-title { font-size: 13px; font-weight: 600; margin-top: 8px; height: 35px; overflow: hidden; line-height: 1.3; }

        .loader { border: 3px solid #222; border-top: 3px solid var(--gold); border-radius: 50%; width: 35px; height: 35px; animation: spin 1s linear infinite; margin: 50px auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML
    document.body.innerHTML = `
        <div id="splash">
            <div class="crown">👑</div>
            <h1 style="letter-spacing:5px; margin-top:20px;">WASI TUBE</h1>
        </div>
        <div class="overlay" onclick="toggleMenu()"></div>
        <div id="sidebar">
            <h2 style="color:var(--gold); margin-bottom:30px;">WASI TUBE</h2>
            <a href="/" class="side-link" onclick="location.href='/'; return false;"><i class="fas fa-home"></i> Home</a>
            <a href="https://chat.whatsapp.com/EZhxFOubSr4IWqANqsi2AL" class="side-link"><i class="fab fa-whatsapp"></i> WhatsApp Group</a>
            <a href="https://wa.me/923342002756" class="side-link" style="border:1px solid #333;"><i class="fas fa-code"></i> Contact Dev</a>
        </div>
        <header>
            <div onclick="toggleMenu()" style="cursor:pointer; font-size:1.3rem;"><i class="fas fa-bars"></i></div>
            <div class="logo" onclick="location.href='/'">👑 WASI TUBE</div>
            <div style="background:#1a1a1a; padding:8px 12px; border-radius:20px; flex:0.6; display:flex; align-items:center;">
                <input type="text" id="s-in" placeholder="Search..." style="background:transparent; border:none; color:#fff; width:100%; outline:none;">
            </div>
        </header>
        <div class="container">
            <div id="p-view">
                <div class="v-box"><iframe id="ifr" src="" allowfullscreen allow="autoplay"></iframe></div>
                <div style="padding:15px">
                    <h2 id="vt" style="font-size:1.1rem; margin-bottom:15px;"></h2>
                    <div class="btn-row">
                        <a href="https://chat.whatsapp.com/EZhxFOubSr4IWqANqsi2AL" class="btn btn-wa"><i class="fab fa-whatsapp"></i> JOIN GROUP</a>
                        <a href="https://wa.me/923342002756" class="btn btn-dev"><i class="fas fa-comment-dots"></i> CONTACT DEV</a>
                    </div>
                </div>
            </div>
            <h3 id="g-head" style="padding:15px 15px 0;">Trending</h3>
            <div class="grid" id="main-grid"></div>
        </div>
    `;

    // 3. Logic
    const grid = document.getElementById('main-grid');
    const playerView = document.getElementById('p-view');
    const ifr = document.getElementById('ifr');
    const vt = document.getElementById('vt');

    window.toggleMenu = () => {
        const s = document.getElementById('sidebar');
        const o = document.querySelector('.overlay');
        s.classList.toggle('active');
        o.style.display = s.classList.contains('active') ? 'block' : 'none';
    };

    async function loadData(q, isAuto = false) {
        grid.innerHTML = '<div class="loader"></div>';
        try {
            const r = await fetch(`/.netlify/functions/api?q=${encodeURIComponent(q)}`);
            const d = await r.json();
            
            if (d.error) {
                grid.innerHTML = `<p style="color:red; text-align:center; padding:20px;">${d.message || d.error}</p>`;
                return;
            }

            if (isAuto && d.items.length > 0) {
                const first = d.items[0];
                playVid(first.url.split('v=')[1] || first.videoId, first.title);
            }

            grid.innerHTML = '';
            d.items.forEach(v => {
                const id = v.url.split('v=')[1] || v.videoId;
                if(!id) return;
                grid.innerHTML += `
                    <div class="v-card" onclick="playVid('${id}', '${v.title.replace(/'/g,"")}')">
                        <img src="https://i.ytimg.com/vi/${id}/mqdefault.jpg">
                        <div class="v-title">${v.title}</div>
                    </div>`;
            });
        } catch (e) {
            grid.innerHTML = '<p style="text-align:center; padding:20px;">Connection Error. Please Refresh.</p>';
        }
    }

    window.playVid = (id, title) => {
        playerView.style.display = 'block';
        ifr.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
        vt.innerText = title;
        document.getElementById('g-head').innerText = "Related Videos";
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
        window.history.pushState({}, '', '/' + slug);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    document.getElementById('s-in').onkeypress = (e) => {
        if(e.key === 'Enter') {
            loadData(e.target.value);
            window.history.pushState({}, '', '/');
        }
    };

    // Initial Start
    const path = window.location.pathname.replace(/^\/|\/$/g, '').replace(/-/g, ' ');
    if (path && path !== 'index.html') {
        loadData(path, true);
    } else {
        loadData("new hindi songs 2024");
    }

    // Splash Removal
    setTimeout(() => {
        const s = document.getElementById('splash');
        if(s) { s.style.opacity = '0'; setTimeout(() => s.remove(), 800); }
    }, 2800);

})();
