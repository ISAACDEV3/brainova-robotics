(function() {
  if (document.getElementById('_brainova_titlebar')) return;
  if (!window.electronAPI) return;

  const bar = document.createElement('div');
  bar.id = '_brainova_titlebar';
  bar.setAttribute('style', [
    'position:fixed','top:0','left:0','right:0','height:32px','z-index:999999',
    'background:linear-gradient(90deg,#0a1628 0%,#0d1f3c 100%)',
    'border-bottom:1px solid rgba(14,165,233,0.15)',
    'display:flex','align-items:center','justify-content:space-between',
    'padding:0 8px 0 14px',
    '-webkit-app-region:drag',
    'user-select:none',
    'direction:ltr'
  ].join(';'));

  bar.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;font-family:'Segoe UI',sans-serif;">
      <img src="assets/images/robot.png"
           style="width:16px;height:16px;object-fit:contain;opacity:0.85;pointer-events:none;"/>
      <span style="font-size:0.7rem;font-weight:700;color:#64748B;letter-spacing:0.5px;">
        <span style="color:#0EA5E9;">Brai</span><span style="color:#FFD700;">nova</span>
        <span style="color:#475569;font-weight:400;margin-left:5px;">Robotics</span>
      </span>
    </div>
    <div style="-webkit-app-region:no-drag;display:flex;gap:3px;direction:ltr;">
      <button id="_tb_min"   title="Minimize"
        style="width:30px;height:20px;border:none;border-radius:4px;background:rgba(255,255,255,0.05);color:#94A3B8;cursor:pointer;font-size:0.8rem;line-height:1;">&#8722;</button>
      <button id="_tb_max"   title="Maximize"
        style="width:30px;height:20px;border:none;border-radius:4px;background:rgba(255,255,255,0.05);color:#94A3B8;cursor:pointer;font-size:0.72rem;line-height:1;">&#9744;</button>
      <button id="_tb_close" title="Close"
        style="width:30px;height:20px;border:none;border-radius:4px;background:rgba(255,255,255,0.05);color:#94A3B8;cursor:pointer;font-size:0.9rem;line-height:1;">&#215;</button>
    </div>
  `;

  document.body.prepend(bar);

  // hover
  [['_tb_min','rgba(14,165,233,0.25)'],['_tb_max','rgba(14,165,233,0.25)'],['_tb_close','rgba(239,68,68,0.75)']].forEach(([id, hov]) => {
    const b = document.getElementById(id);
    b.onmouseenter = () => { b.style.background = hov; b.style.color = '#fff'; };
    b.onmouseleave = () => { b.style.background = 'rgba(255,255,255,0.05)'; b.style.color = '#94A3B8'; };
  });

  document.getElementById('_tb_min').onclick   = () => window.electronAPI.minimize();
  document.getElementById('_tb_max').onclick   = () => window.electronAPI.maximize();
  document.getElementById('_tb_close').onclick = () => window.electronAPI.close();

  // Push page content down
  document.body.style.paddingTop = '32px';
})();