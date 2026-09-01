const AQV = (() => {
  const icons = {
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9 20v-6h6v6"/>',
    users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    inbox:'<path d="M4 4h16l-2 12H6L4 4Z"/><path d="M6 16l-2 4h16l-2-4"/><path d="M8 10h8"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    wallet:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M16 10h5v4h-5a2 2 0 0 1 0-4Z"/>',
    zap:'<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/>',
    chart:'<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.2 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.4v-4h.1A1.7 1.7 0 0 0 4.2 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.6 4.2a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2.4h4v.1A1.7 1.7 0 0 0 15 4.2a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 8.6a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.1v4h-.1a1.7 1.7 0 0 0-1.7 1Z"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    x:'<path d="m6 6 12 12M18 6 6 18"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    message:'<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/>',
    send:'<path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/>',
    paperclip:'<path d="m21.4 11.6-8.9 8.9a6 6 0 0 1-8.5-8.5l9.6-9.6a4 4 0 0 1 5.7 5.7l-9.6 9.6a2 2 0 0 1-2.8-2.8l8.9-8.9"/>',
    camera:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="m8 6 2-3h4l2 3"/><circle cx="12" cy="13" r="4"/>',
    mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/>',
    phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.45 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.95Z"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    filter:'<path d="M4 5h16M7 12h10M10 19h4"/>',
    columns:'<rect x="3" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="7" height="16" rx="1"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
    money:'<circle cx="12" cy="12" r="9"/><path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8M12 6v12"/>',
    lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    external:'<path d="M14 3h7v7M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
    eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    tag:'<path d="M20 13 11 22l-9-9V2h11l7 7a3 3 0 0 1 0 4Z"/><circle cx="7" cy="7" r="1"/>',
    note:'<path d="M4 3h16v18H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
    play:'<path d="m8 5 11 7-11 7V5Z"/>',
    pause:'<path d="M8 5v14M16 5v14"/>',
    skip:'<path d="m5 4 10 8-10 8V4ZM19 5v14"/>',
    checkcircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
    warning:'<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
    download:'<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    upload:'<path d="M12 21V9M7 14l5-5 5 5M4 3h16"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    activity:'<path d="M3 12h4l2-7 4 14 2-7h6"/>',
    copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    monitor:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>'
  };
  function icon(name,size=17,cls=''){
    return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.grid}</svg>`;
  }
  async function api(path, opts={}){
    const r = await fetch(path, opts);
    const type = r.headers.get('content-type') || '';
    const data = type.includes('json') ? await r.json() : await r.text();
    if(!r.ok) throw new Error((data && data.error) || (data && data.detail) || `HTTP ${r.status}`);
    return data;
  }
  function adminHeaders(extra={}){
    const token = localStorage.getItem('aqv_admin_token') || 'demo1234';
    return {'X-Admin-Token':token,...extra};
  }
  function money(cents){
    return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format((Number(cents)||0)/100);
  }
  function moneyValue(value){
    return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(Number(value)||0);
  }
  function initials(name='Lead'){
    return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  }
  function relative(iso){
    if(!iso) return '—';
    const d=new Date(iso); const diff=Math.max(0,Date.now()-d.getTime());
    const m=Math.floor(diff/60000); if(m<1)return 'agora'; if(m<60)return `há ${m} min`;
    const h=Math.floor(m/60); if(h<24)return `há ${h}h`; const days=Math.floor(h/24); return `há ${days}d`;
  }
  function clock(iso){
    try{return new Date(iso).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});}catch{return ''}
  }
  function dateShort(iso){
    try{return new Date(iso).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}).replace('.','');}catch{return ''}
  }
  function escapeHtml(s=''){
    return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  }
  function toast(message,type=''){
    let stack=document.querySelector('.toast-stack');
    if(!stack){stack=document.createElement('div');stack.className='toast-stack';document.body.appendChild(stack)}
    const el=document.createElement('div');el.className='toast '+type;
    el.innerHTML=`${icon(type==='success'?'checkcircle':type==='error'?'warning':'activity',18)}<div style="font-size:12px;line-height:1.4">${escapeHtml(message)}</div>`;
    stack.appendChild(el); setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(5px)';setTimeout(()=>el.remove(),180)},3200);
  }
  function modal({title,body,confirmText='Salvar',cancelText='Cancelar',onConfirm,wide=false}){
    const bd=document.createElement('div');bd.className='modal-backdrop';
    bd.innerHTML=`<div class="modal" style="${wide?'width:min(760px,100%)':''}"><div class="modal-head"><div class="card-title">${escapeHtml(title)}</div><button class="btn ghost icon modal-close">${icon('x')}</button></div><div class="modal-body">${body}</div><div class="modal-foot"><button class="btn modal-cancel">${escapeHtml(cancelText)}</button><button class="btn primary modal-confirm">${escapeHtml(confirmText)}</button></div></div>`;
    document.body.appendChild(bd);
    const close=()=>bd.remove(); bd.querySelector('.modal-close').onclick=close; bd.querySelector('.modal-cancel').onclick=close;
    bd.addEventListener('click',e=>{if(e.target===bd)close()});
    bd.querySelector('.modal-confirm').onclick=async()=>{try{const ok=await onConfirm?.(bd);if(ok!==false)close()}catch(e){toast(e.message,'error')}};
    return bd;
  }
  function statusBadge(stage){
    const map={NEW:['Novo',''],QUALIFYING:['Qualificando','blue'],QUALIFIED:['Qualificado','blue'],APPOINTMENT_SCHEDULED:['Visita','purple'],PROPOSAL:['Proposta','amber'],AWAITING_PAYMENT:['Sinal','amber'],WON:['Ganho','green'],NURTURE:['Nutrição',''],LOST:['Perdido','red'],HUMAN_REQUIRED:['Humano','purple']};
    const [label,cls]=map[stage]||[stage||'—','']; return `<span class="badge ${cls}">${escapeHtml(label)}</span>`;
  }
  return {icon,api,adminHeaders,money,moneyValue,initials,relative,clock,dateShort,escapeHtml,toast,modal,statusBadge};
})();
