function init() {
  const host = $ui.register(ctx => {
    ctx.registerComponent({
      id: "ptscans-search-root",
      load: `
<div id="ptscans-search-root"></div>
<style>
  .pts-root{
    --bg:#0b0d10; --bg2:#131720; --panel:#171b24; --text:#ecf2ff; --muted:#9fb0d0; --line:#263046;
    --primary:#6aa2ff; --accent:#8bffb0; --danger:#ff7a7a; --warn:#ffd36a;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    color:var(--text); background:linear-gradient(180deg,var(--bg),var(--bg2)); min-height:100vh;
  }
  .pts-wrap{max-width:1400px;margin:0 auto;padding:20px;}
  .hero{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:16px}
  .brand{display:flex;gap:14px;align-items:center}
  .brand img{width:52px;height:52px;border-radius:14px;box-shadow:0 8px 20px rgba(0,0,0,.3)}
  .title{font-size:24px;font-weight:800;letter-spacing:.2px}
  .subtitle{color:var(--muted);font-size:13px;margin-top:2px}
  .nav{display:flex;gap:8px;flex-wrap:wrap}
  .tab{border:1px solid var(--line);background:#121722;color:var(--text);padding:10px 14px;border-radius:999px;cursor:pointer;font-weight:700}
  .tab.active{background:linear-gradient(180deg,#1b2332,#141b28);border-color:#42609a}
  .panel{background:rgba(18,23,34,.8);backdrop-filter: blur(10px);border:1px solid var(--line);border-radius:18px;box-shadow:0 10px 30px rgba(0,0,0,.18)}
  .search-bar{display:flex;gap:10px;align-items:center;padding:16px;flex-wrap:wrap}
  .input, .select{
    background:#0f1420;border:1px solid var(--line);color:var(--text);padding:12px 14px;border-radius:12px;outline:none;
  }
  .input{flex:1;min-width:260px}
  .btn{
    border:1px solid var(--line);background:#182033;color:var(--text);padding:12px 14px;border-radius:12px;cursor:pointer;font-weight:800
  }
  .btn-primary{background:linear-gradient(180deg,#2c62ff,#214ed0);border-color:#4878ff}
  .btn-soft{background:#131b2a}
  .btn-danger{background:#2a1318;border-color:#5a2631;color:#ffb7c1}
  .btn:disabled{opacity:.6;cursor:not-allowed}
  .status{padding:0 16px 16px 16px;color:var(--muted);font-size:13px}
  .chips{display:flex;gap:8px;flex-wrap:wrap;padding:0 16px 16px 16px}
  .chip{padding:6px 10px;border-radius:999px;background:#111827;border:1px solid var(--line);font-size:12px;color:var(--muted)}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;padding:16px}
  .card{
    background:linear-gradient(180deg,#161d2b,#111722);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column
  }
  .thumb{aspect-ratio: 2 / 3; width:100%; object-fit:cover; background:#0b1019}
  .card-body{padding:12px}
  .card-title{font-weight:800;font-size:14px;line-height:1.3;min-height:38px}
  .meta{display:flex;justify-content:space-between;gap:8px;color:var(--muted);font-size:12px;margin-top:8px}
  .badge{display:inline-flex;align-items:center;gap:6px;background:#102417;border:1px solid #204b2d;color:#c8ffd8;padding:6px 10px;border-radius:999px;font-size:12px;font-weight:700}
  .empty{padding:28px 20px;color:var(--muted)}
  .chapter-list{display:flex;flex-direction:column;gap:10px;padding:16px}
  .chapter-item{
    display:flex;justify-content:space-between;gap:10px;align-items:center;background:#111827;border:1px solid var(--line);padding:12px;border-radius:12px
  }
  .chapter-main{display:flex;flex-direction:column;gap:4px;min-width:0}
  .chapter-title{font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .chapter-sub{font-size:12px;color:var(--muted)}
  .reader{display:grid;grid-template-columns:300px 1fr;gap:16px;padding:16px}
  .reader-side{padding:14px}
  .reader-pages{padding:16px;display:flex;flex-direction:column;gap:12px}
  .page-img{width:100%;border-radius:12px;border:1px solid var(--line);background:#0d1118}
  .topbar{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line)}
  .kpi{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:16px}
  .kpi-box{background:#111827;border:1px solid var(--line);border-radius:14px;padding:14px}
  .kpi-label{font-size:12px;color:var(--muted)}
  .kpi-value{font-size:24px;font-weight:900;margin-top:6px}
  .progress{height:8px;background:#0d1320;border-radius:999px;overflow:hidden;border:1px solid var(--line);margin-top:8px}
  .progress > span{display:block;height:100%;background:linear-gradient(90deg,#6aa2ff,#8bffb0)}
  .small{font-size:12px;color:var(--muted)}
  .list{display:flex;flex-direction:column;gap:10px;padding:16px}
  .row{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:12px;background:#111827;border:1px solid var(--line);border-radius:12px}
  @media (max-width: 900px){ .reader{grid-template-columns:1fr} .hero{flex-direction:column;align-items:flex-start} .kpi{grid-template-columns:1fr} }
</style>
<script>
(() => {
  const mount = document.getElementById("ptscans-search-root");
  const state = {
    view: "search",
    q: "",
    provider: "all",
    status: "Pronto.",
    loading: false,
    results: [],
    selectedManga: null,
    chapters: [],
    pages: [],
    libraryData: [],
    chapterCache: {},
    _libLoaded: false
  };

  const providers = [
    { id:"all", name:"Todos" },
    { id:"mangaflix", name:"Mangaflix" },
    { id:"mangalivre", name:"Mangalivre" },
    { id:"hiper", name:"Hiper" },
    { id:"tiamanhwa", name:"Tia Manhwa" },
    { id:"mangafire", name:"Mangafire" }
  ];

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
  const setState = (patch) => { Object.assign(state, patch); render(); };
  const status = { set(v){ state.status = v; render(); } };
  const loading = { set(v){ state.loading = !!v; render(); } };
  const libraryData = { set(v){ state.libraryData = Array.isArray(v) ? v : []; render(); } };

  function topNav(){
    return \`
      <div class="hero">
        <div class="brand">
          <img src="https://raw.githubusercontent.com/SKRAPT/PT-Scans/main/upscan.png" alt="PT Scans">
          <div>
            <div class="title">PT Scans Search</div>
            <div class="subtitle">Pesquisa, capítulos, leitor e biblioteca AniList</div>
          </div>
        </div>
        <div class="nav">
          <button class="tab \${state.view==="search"?"active":""}" data-nav="search">Pesquisar</button>
          <button class="tab \${state.view==="library"?"active":""}" data-nav="library">Biblioteca</button>
          <button class="tab \${state.view==="stats"?"active":""}" data-nav="stats">Stats</button>
        </div>
      </div>
    \`;
  }

  function renderSearch(){
    let html = '<div class="panel">';
    html += '<div class="search-bar">';
    html += '<input id="searchInput" class="input" placeholder="Pesquisar manga..." value="'+esc(state.q)+'" />';
    html += '<select id="providerSelect" class="select">';
    providers.forEach(p => html += '<option value="'+esc(p.id)+'" '+(p.id===state.provider?'selected':'')+'>'+esc(p.name)+'</option>');
    html += '</select>';
    html += '<button id="searchBtn" class="btn btn-primary">Pesquisar</button>';
    html += '</div>';
    html += '<div class="status">'+esc(state.status)+'</div>';

    if(!state.results.length){
      html += '<div class="empty">Faz uma pesquisa para ver resultados.</div>';
    } else {
      html += '<div class="grid">';
      state.results.forEach(item => {
        html += '<div class="card">';
        html += '<img class="thumb" src="'+esc(item.image || "")+'" alt="'+esc(item.title)+'">';
        html += '<div class="card-body">';
        html += '<div class="card-title">'+esc(item.title)+'</div>';
        html += '<div class="meta"><span>'+esc(item.provider || "fonte")+'</span><span>'+(item.chapters != null ? esc(item.chapters+" ch.") : "—")+'</span></div>';
        html += '<div style="display:flex;gap:8px;margin-top:10px">';
        html += '<button class="btn btn-soft open-manga" data-id="'+esc(item.id)+'">Abrir</button>';
        html += '</div>';
        html += '</div></div>';
      });
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function renderLibrary(){
    if(!state.loading && state.libraryData.length===0 && !state._libLoaded){
      state._libLoaded=true;
      window.webview.send("fetchAniList");
    }
    let html='<div style="padding:20px;">';
    html+='<div class="panel">';
    html+='<div class="topbar"><div><strong>Biblioteca AniList</strong><div class="small">Carregamento automático da tua lista</div></div>';
    html+='<button id="loadLibBtn" class="btn btn-primary">↻ Recarregar</button></div>';
    html+='<div class="status">'+esc(state.status)+'</div>';
    if(!state.libraryData.length){
      html+='<div class="empty">A carregar a tua lista de leitura do AniList...</div>';
    } else {
      html+='<div class="grid">';
      state.libraryData.forEach(item=>{
        const pct = item.chapters ? Math.min(100, Math.round(((item.progress||0)/(item.chapters||1))*100)) : 0;
        html+='<div class="card">';
        html+='<img class="thumb" src="'+esc(item.image || "")+'" alt="'+esc(item.title)+'">';
        html+='<div class="card-body">';
        html+='<div class="card-title">'+esc(item.title)+'</div>';
        html+='<div style="margin-top:8px" class="badge">Progresso: '+esc(item.progress||0)+(item.chapters?"/"+esc(item.chapters):"")+'</div>';
        html+='<div class="progress"><span style="width:'+pct+'%"></span></div>';
        html+='<div class="meta"><span>'+esc(item.listStatus || "")+'</span><span>'+pct+'%</span></div>';
        html+='</div></div>';
      });
      html+='</div>';
    }
    html+='</div></div>';
    return html;
  }

  function renderStats(){
    const total = state.libraryData.length;
    const finished = state.libraryData.filter(x => x.chapters && x.progress >= x.chapters).length;
    const inProgress = state.libraryData.filter(x => (x.progress||0) > 0 && (!x.chapters || x.progress < x.chapters)).length;
    let avg = 0;
    const withPct = state.libraryData.filter(x => x.chapters && x.chapters > 0);
    if(withPct.length){
      avg = Math.round(withPct.reduce((a,x)=>a+Math.min(100,((x.progress||0)/x.chapters)*100),0)/withPct.length);
    }

    let html='<div class="panel">';
    html+='<div class="topbar"><div><strong>Stats</strong><div class="small">Resumo da tua biblioteca</div></div></div>';
    html+='<div class="kpi">';
    html+='<div class="kpi-box"><div class="kpi-label">Total</div><div class="kpi-value">'+total+'</div></div>';
    html+='<div class="kpi-box"><div class="kpi-label">Em progresso</div><div class="kpi-value">'+inProgress+'</div></div>';
    html+='<div class="kpi-box"><div class="kpi-label">Concluídos</div><div class="kpi-value">'+finished+'</div></div>';
    html+='</div>';
    html+='<div class="list">';
    html+='<div class="row"><span>Progresso médio</span><strong>'+avg+'%</strong></div>';
    html+='<div class="row"><span>Com capítulos conhecidos</span><strong>'+withPct.length+'</strong></div>';
    html+='</div></div>';
    return html;
  }

  function bindCommon(){
    mount.querySelectorAll("[data-nav]").forEach(btn=>{
      btn.addEventListener("click",()=>setState({view:btn.getAttribute("data-nav")}));
    });
  }

  function bindSearch(){
    const input = document.getElementById("searchInput");
    const select = document.getElementById("providerSelect");
    const btn = document.getElementById("searchBtn");
    if(input) input.addEventListener("input", e => state.q = e.target.value);
    if(select) select.addEventListener("change", e => state.provider = e.target.value);
    if(btn) btn.addEventListener("click", ()=>window.webview.send("performSearch", { q: state.q, provider: state.provider }));
  }

  function bindLibrary(){
    const loadBtn=document.getElementById("loadLibBtn");
    if(loadBtn){
      loadBtn.addEventListener("click",()=>{
        state._libLoaded=false;
        window.webview.send("fetchAniList");
      });
    }
  }

  function render(){
    let html = '<div class="pts-root"><div class="pts-wrap">';
    html += topNav();
    if(state.view==="search") html += renderSearch();
    if(state.view==="library") html += renderLibrary();
    if(state.view==="stats") html += renderStats();
    html += '</div></div>';
    mount.innerHTML = html;
    bindCommon();
    if(state.view==="search") bindSearch();
    if(state.view==="library") bindLibrary();
  }

  window.webview.on("searchResults", (results) => {
    setState({ results: Array.isArray(results) ? results : [], status: "Pesquisa concluída." });
  });

  window.webview.on("statusUpdate", (msg) => {
    setState({ status: String(msg || "") });
  });

  render();
})();
</script>
      `,
    });

    const panel = ctx.registerPanel({
      id: "ptscans-search-panel",
      title: "PT Scans Search",
      componentId: "ptscans-search-root",
    });

    const status = ctx.state.use("status", "Pronto.");
    const loading = ctx.state.use("loading", false);
    const libraryData = ctx.state.use("libraryData", []);

    panel.channel.on("performSearch", async (payload) => {
      const q = payload && payload.q ? String(payload.q).trim() : "";
      const provider = payload && payload.provider ? String(payload.provider) : "all";
      if (!q) { status.set("Escreve algo para pesquisar."); return; }
      loading.set(true);
      status.set("A pesquisar...");
      try {
        const providers = [];

        if (provider === "all" || provider === "mangaflix") {
          providers.push({ name: "Mangaflix", url: "https://api.mangaflix.net/query", body: { operationName: "Search", variables: { search: q }, query: "query Search($search: String!) { search(search: $search) { edges { node { id title coverImage chapters } } } }" } });
        }

        const results = [];
        for (const p of providers) {
          try {
            const res = await fetch(p.url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(p.body),
            });
            const data = await res.json();
            const edges = data && data.data && data.data.search && data.data.search.edges ? data.data.search.edges : [];
            edges.forEach(edge => {
              const n = edge.node || {};
              results.push({
                id: n.id,
                title: n.title || "Sem título",
                image: n.coverImage || "",
                chapters: n.chapters || null,
                provider: p.name
              });
            });
          } catch (e) {}
        }

        panel.channel.emit("searchResults", results);
        status.set(results.length ? "Encontrados " + results.length + " resultados." : "Sem resultados.");
      } catch (e) {
        status.set("Erro na pesquisa: " + (e && e.message ? e.message : String(e)));
        panel.channel.emit("searchResults", []);
      } finally {
        loading.set(false);
      }
    });

    panel.channel.on("fetchAniList", async () => {
      status.set("A carregar biblioteca AniList...");
      loading.set(true);
      try {
        var entries = [];

        try {
          var col = await ctx.manga.getCollection();
          var lists = (col && col.mediaListCollection && Array.isArray(col.mediaListCollection.lists))
            ? col.mediaListCollection.lists
            : (Array.isArray(col) ? col : []);
          lists.forEach(function(list) {
            var listName = (list.name || list.status || "");
            (Array.isArray(list.entries) ? list.entries : []).forEach(function(e) {
              var media = e.media || {};
              var titles = media.title || {};
              var cover = media.coverImage || {};
              entries.push({
                id: media.id || 0,
                title: titles.userPreferred || titles.english || titles.romaji || "Sem título",
                image: cover.large || cover.medium || "",
                chapters: media.chapters || null,
                progress: e.progress || 0,
                listStatus: listName
              });
            });
          });
        } catch(e1) {
          console.log("ctx.manga.getCollection falhou:", e1 && e1.message ? e1.message : String(e1));
        }

        if (entries.length === 0) {
          var base = (typeof window !== "undefined" && window.location && window.location.origin)
            ? window.location.origin
            : "http://127.0.0.1:43211";
          var res = await fetch(base + "/api/v1/manga/collection");
          if (res.ok) {
            var data = await res.json();
            var lists2 = [];
            if (data && data.lists) lists2 = data.lists;
            else if (data && data.mediaListCollection && data.mediaListCollection.lists) lists2 = data.mediaListCollection.lists;
            lists2.forEach(function(list) {
              var listName = list.name || list.status || "";
              (Array.isArray(list.entries) ? list.entries : []).forEach(function(e) {
                var media = e.media || {};
                var titles = media.title || {};
                var cover = media.coverImage || {};
                entries.push({
                  id: media.id || 0,
                  title: titles.userPreferred || titles.english || titles.romaji || "Sem título",
                  image: cover.large || cover.medium || "",
                  chapters: media.chapters || null,
                  progress: e.progress || 0,
                  listStatus: listName
                });
              });
            });
          }
        }

        if (entries.length === 0) {
          var viewerRes = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: "query { Viewer { id } }" })
          });
          var viewerData = await viewerRes.json();
          var viewerId = viewerData && viewerData.data && viewerData.data.Viewer && viewerData.data.Viewer.id;
          if (viewerId) {
            var listRes = await fetch("https://graphql.anilist.co", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: "query($id:Int){MediaListCollection(userId:$id,type:MANGA){lists{name entries{progress media{id chapters title{userPreferred romaji english}coverImage{large}}}}}}",
                variables: { id: viewerId }
              })
            });
            var listData = await listRes.json();
            var lists3 = listData && listData.data && listData.data.MediaListCollection && listData.data.MediaListCollection.lists || [];
            lists3.forEach(function(list) {
              (list.entries || []).forEach(function(e) {
                var media = e.media || {};
                var titles = media.title || {};
                var cover = media.coverImage || {};
                entries.push({
                  id: media.id || 0,
                  title: titles.userPreferred || titles.english || titles.romaji || "Sem título",
                  image: cover.large || "",
                  chapters: media.chapters || null,
                  progress: e.progress || 0,
                  listStatus: list.name || ""
                });
              });
            });
          }
        }

        libraryData.set(entries);
        status.set(entries.length
          ? "Biblioteca carregada — " + entries.length + " mangas"
          : "Biblioteca vazia (verifica se estás autenticado no AniList)");
      } catch(e) {
        libraryData.set([]);
        status.set("Erro: " + (e && e.message ? e.message : String(e)));
      } finally {
        loading.set(false);
      }
    });
  });
}
