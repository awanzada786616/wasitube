(function() {
    "use strict";

    // 1. Injected CSS (Premium UI Design)
    const style = document.createElement('style');
    style.innerHTML = `
        :root { --primary: #ff0000; --gold: #ffcc00; --bg: #000; --card: #121212; }
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { background: var(--bg); color: #fff; font-family: 'Poppins', sans-serif; overflow-x: hidden; }

        /* 3D SPLASH SCREEN */
        #splash-screen {
            position: fixed; inset: 0; background: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
            z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center;
            perspective: 1000px; transition: opacity 0.8s ease;
        }
        .logo-3d { animation: rotate3d 3s infinite linear; font-size: 80px; color: var(--gold); filter: drop-shadow(0 0 20px rgba(255, 204, 0, 0.5)); }
        @keyframes rotate3d { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        .splash-text { margin-top: 25px; font-family: 'Montserrat', sans-serif; font-size: 2.2rem; letter-spacing: 5px; animation: pulse 1.5s infinite alternate; }
        @keyframes pulse { from { opacity: 0.5; transform: scale(0.95); } to { opacity: 1; transform: scale(1.05); } }

        /* HEADER */
        header {
            background: rgba(0,0,0,0.9); backdrop-filter: blur(15px); padding: 12px 15px; 
            display: flex; align-items: center; justify-content: space-between;
            position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .logo { display: flex; align-items: center; gap: 8px; cursor: pointer; font-family: 'Montserrat'; font-weight: 900; }
        .logo i { color: var(--gold); }
        .search-trigger { font-size: 1.2rem; color: #fff; cursor: pointer; padding: 5px; }

        /* SEARCH EXPANDABLE */
        #search-box { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; display: none; align-items: center; padding: 0 15px; z-index: 1001; }
        #search-box input { flex: 1; background: transparent; border: none; color: #fff; outline: none; font-size: 16px; }

        /* SIDEBAR */
        #sidebar { position: fixed; top: 0; left: -100%; width: 80%; max-width: 300px; height: 100%; background: #080808; z-index: 2000; transition: 0.4s; padding: 40px 20px; box-shadow: 20px 0 50px #000; }
        #sidebar.active { left: 0; }
        .side-link { padding: 15px; display: flex; align-items: center; gap: 15px; color: #ccc; text-decoration: none; border-radius: 12px; margin-bottom: 8px; font-weight: 600; }
        .side-link:hover { background: #1a1a1a; color: var(--gold); }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; z-index: 1500; }

        /* MAIN CONTENT */
        .main-container { width: 100%; max-width: 1200px; margin: 0 auto; }
        #player-view { display: none; margin-bottom: 20px; }
        .video-box { width: 100%; aspect-ratio: 16/9; background: #000; border-bottom: 2px solid var(--primary); }
        .details { padding: 20px 15px; }
        .video-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 15px; line-height: 1.4; }
        
        /* ACTIONS */
        .btn-row { display: flex; gap: 10px; margin-bottom: 20px; }
        .btn { flex: 1; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-wa { background: #25d366; color: #fff; }
        .btn-dev { background: #fff; color: #000; }

        /* GRID */
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 15px; }
        @media (min-width: 768px) { .grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); } }
        .v-card { cursor: pointer; }
        .thumb { width: 100%; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; background: #111; }
        .thumb img { width: 100%; height: 100%; object-fit: cover; }
        .v-t { font-size: 13px; font-weight: 600; margin-top: 8px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; min-height: 34px; }
        .v-m { font-size: 10px; color: #888; margin-top: 4px; }

        .loader { width: 40px; height: 40px; border: 3px solid #1a1a1a; border-top: 3px solid var(--gold); border-radius: 50%; animation: spin 1s linear infinite; margin: 40px auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML Structure
    document.body.innerHTML = `
        <div id="splash-screen">
            <div class="logo-3d"><i class="fas fa-crown"></i></div>
            <div class="splash-text">WASI TUBE</div>
        </div>
        <div class="overlay" onclick="toggleMenu()"></div>
        <div id="sidebar">
            <h2 style="color:var(--gold); font-family:'Montserrat'; margin-bottom:30px;">WASI TUBE</h2>
            <a href="/" class="side-link" onclick="location.href='/'; return false;"><i class="fas fa-home"></i> Home Feed</a>
            <a href="https://chat.whatsapp.com/EZhxFOubSr4IWqANqsi2AL" class="side-link"><i class="fab fa-whatsapp"></i> WhatsApp Group</a>
            <a href="https://wa.me/923342002756" class="side-link" style="border:1px solid #333;"><i class="fas fa-user-shield"></i> Contact Developer</a>
        </div>
        <header>
            <div style="font-size:1.3rem; cursor:pointer;" onclick="toggleMenu()"><i class="fas fa-bars"></i></div>
            <div class="logo" onclick="location.href='/'">
                <i class="fas fa-crown"></i>
                <span>WASI TUBE</span>
            </div>
            <div class="search-trigger" onclick="openSearch()"><i class="fas fa-search"></i></div>
            <div id="search-box">
                <i class="fas fa-arrow-left" onclick="closeSearch()" style="margin-right:15px; cursor:pointer;"></i>
                <input type="text" id="srch-in" placeholder="Search songs, movies, videos...">
            </div>
        </header>
        <main class="main-container">
            <div id="player-view">
                <div class="video-box"><iframe id="ifr" src="" allowfullscreen allow="autoplay"></iframe></div>
                <div class="details">
                    <h1 id="v-title" class="video-title">Loading Video...</h1>
                    <div class="btn-row">
                        <a href="https://chat.whatsapp.com/EZhxFOubSr4IWqANqsi2AL" class="btn btn-wa"><i class="fab fa-whatsapp"></i> JOIN GROUP</a>
                        <a href="https://wa.me/923342002756" class="btn btn-dev"><i class="fas fa-comment-dots"></i> CONTACT DEV</a>
                    </div>
                </div>
            </div>
            <div id="grid-header" style="padding:15px 15px 0; font-weight:800; font-size:1.2rem;">Trending Now</div>
            <div class="grid" id="main-grid"></div>
        </main>
    `;

    // 3. Routing & API Logic
    function slugify(t) { return t.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, ''); }

    window.toggleMenu = function() {
        const s = document.getElementById('sidebar');
        const o = document.querySelector('.overlay');
        s.classList.toggle('active');
        o.style.display = s.classList.contains('active') ? 'block' : 'none';
    };

    window.openSearch = () => document.getElementById('search-box').style.display = 'flex';
    window.closeSearch = () => document.getElementById('search-box').style.display = 'none';

    async function load(q, autoPlay = false) {
        const g = document.getElementById('main-grid');
        g.innerHTML = '<div class="loader"></div>';
        try {
            const res = await fetch(`/.netlify/functions/api?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            if (data.error) { g.innerHTML = `<p style="color:red; text-align:center">${data.message}</p>`; return; }
            
            if (autoPlay && data.items.length > 0) {
                const first = data.items[0];
                play(first.url.split('v=')[1] || first.videoId, first.title);
            }

            g.innerHTML = '';
            data.items.forEach(v => {
                const id = v.url.split('v=')[1] || v.videoId;
                if(!id) return;
                g.innerHTML += `
                    <div class="v-card" onclick="play('${id}', '${v.title.replace(/'/g,"")}')">
                        <div class="thumb"><img src="https://i.ytimg.com/vi/${id}/mqdefault.jpg"></div>
                        <div class="v-t">${v.title}</div>
                        <div class="v-m">${v.uploaderName || "WasiTube"} • ${v.uploadedDate || "Recently"}</div>
                    </div>`;
            });
        } catch(e) { g.innerHTML = '<p style="text-align:center">Error loading stream.</p>'; }
    }

    window.play = (id, title) => {
        const pv = document.getElementById('player-view');
        pv.style.display = 'block';
        document.getElementById('ifr').src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
        document.getElementById('v-title').innerText = title;
        document.getElementById('grid-header').innerText = "Up Next";
        window.history.pushState({id}, title, `/${slugify(title)}`);
        window.scrollTo({top: 0, behavior: 'smooth'});
        closeSearch();
    };

    document.getElementById('srch-in').onkeypress = (e) => {
        if(e.key === 'Enter') {
            load(e.target.value);
            closeSearch();
            window.history.pushState({}, '', '/');
        }
    };

    // Splash Timer
    setTimeout(() => {
        const s = document.getElementById('splash-screen');
        s.style.opacity = '0';
        setTimeout(() => s.remove(), 800);
    }, 2800);

    // Init App
    const path = window.location.pathname.replace(/^\/|\/$/g, '').replace(/-/g, ' ');
    if (path && path !== 'index.html') { load(path, true); }
    else { load("new bollywood songs 2024"); }

})();
