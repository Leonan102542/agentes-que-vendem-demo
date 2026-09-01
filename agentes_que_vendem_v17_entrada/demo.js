const $ = (s)=>document.querySelector(s);
const chat=$('#chat'), feed=$('#eventFeed'), toastStack=$('#toastStack');
const stages=['Lead','Qualificação','Visita','Proposta','Entrada','Ganho'];
let run=0,running=false,paused=false;
const state={clock:'21:46'};

const PACE={
  minRead:2800,
  maxRead:5200,
  charRead:18,
  typingBase:700,
  typingChar:7,
  typingMax:1900,
  toast:8200,
  moment:2100,
  card:3800,
  jump:3000
};

function readTime(text){
  return Math.max(PACE.minRead,Math.min(PACE.maxRead,1500+String(text).length*PACE.charRead));
}
function typingTime(text){
  return Math.max(850,Math.min(PACE.typingMax,PACE.typingBase+String(text).length*PACE.typingChar));
}
async function sleep(ms,id){
  let elapsed=0,last=performance.now();
  while(elapsed<ms){
    if(id!==run)return false;
    await new Promise(r=>setTimeout(r,90));
    const now=performance.now();
    if(!paused)elapsed+=now-last;
    last=now;
  }
  return id===run;
}
function setClock(v){state.clock=v;$('#clock').textContent=v;}
function renderSteps(active=0){$('#stageSteps').innerHTML=stages.map((s,i)=>`<div class="step ${i<active?'done':i===active?'current':''}">${s}</div>`).join('');}
function stage(index,title){const pct=Math.round(index/(stages.length-1)*100);$('#stageTitle').textContent=title;$('#stagePill').textContent=pct+'%';$('#progressBar').style.width=pct+'%';renderSteps(index);}
function setMainButton(){
  const btn=$('#startBtn');
  if(running)btn.textContent=paused?'Continuar':'Pausar';
  else btn.textContent='Iniciar';
}
function clearDemo(){
  paused=false;
  chat.innerHTML=`<div class="chat-intro"><div class="lock-mark">✓</div><span>Dados e valores desta conversa são fictícios.</span></div>`;
  feed.innerHTML='<div class="empty-event">Inicie a demonstração para acompanhar as ações.</div>';
  toastStack.innerHTML='';
  setClock('21:46');stage(0,'Aguardando início');
  $('#potential').textContent='—';$('#potentialSub').textContent='aguardando qualificação';
  $('#nextAction').textContent='—';$('#actionSub').textContent='nenhuma ação pendente';
  $('#received').textContent='R$ 0';$('#receivedSub').textContent='sem pagamento confirmado';
  $('#human').textContent='0 min';$('#waStatus').textContent='Marina · atendimento comercial';
  setMainButton();
}
function bubble(side,text,time=state.clock){
  const row=document.createElement('div');row.className='msg-row '+(side==='out'?'out':'');
  row.innerHTML=`<div class="bubble">${text}<div class="meta">${time}${side==='out'?' · ✓✓':''}</div></div>`;
  chat.appendChild(row);chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'});
}
function typing(){
  const row=document.createElement('div');row.className='msg-row typing-row';
  row.innerHTML='<div class="typing"><i></i><i></i><i></i></div>';
  chat.appendChild(row);chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'});$('#waStatus').textContent='digitando…';
}
function stopTyping(){chat.querySelector('.typing-row')?.remove();$('#waStatus').textContent='Marina · atendimento comercial';}
function card(kind,title,copy,success){
  const row=document.createElement('div');row.className='msg-row';
  row.innerHTML=`<div class="bubble-card"><div class="kicker">${kind}</div><strong>${title}</strong><p>${copy}</p>${success?`<div class="success-line">${success}</div>`:''}</div>`;
  chat.appendChild(row);chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'});
}
function event(title,copy,time=state.clock,type=''){
  if(feed.querySelector('.empty-event'))feed.innerHTML='';
  const el=document.createElement('div');el.className='event '+type;
  el.innerHTML=`<i class="event-dot"></i><div><b>${title}</b><p>${copy}</p></div><time>${time}</time>`;
  feed.prepend(el);
}
function toast(title,copy,type=''){
  const id=run;
  const el=document.createElement('div');el.className='toast '+type;
  el.innerHTML=`<i></i><div><b>${title}</b><span>${copy}</span></div>`;
  toastStack.appendChild(el);
  (async()=>{
    const ok=await sleep(PACE.toast,id);if(!ok||!el.isConnected)return;
    el.style.opacity='0';el.style.transform='translateY(-6px)';
    await new Promise(r=>setTimeout(r,250));el.remove();
  })();
}
async function say(side,text,time,id){
  setClock(time);
  if(side==='in'){
    typing();if(!await sleep(typingTime(text),id))return false;stopTyping();
  }
  bubble(side,text,time);
  return await sleep(readTime(text),id);
}
async function hold(ms,id){return await sleep(ms,id);}

async function startDemo(){
  if(running){paused=!paused;setMainButton();$('#waStatus').textContent=paused?'demonstração pausada':'Marina · atendimento comercial';return;}
  running=true;paused=false;const id=++run;clearDemo();running=true;setMainButton();

  stage(0,'Novo pedido fora do horário');
  toast('Novo lead às 21:46','A loja está fechada, mas o atendimento começou.');
  event('Novo contato recebido','Pedido de orçamento entrou fora do horário.','21:46');
  if(!await hold(PACE.moment,id))return;
  if(!await say('out','Boa noite! Estou pesquisando uma piscina para minha casa. Vocês conseguem me orientar por aqui?','21:46',id))return;
  if(!await say('in','Boa noite! Consigo sim. Para eu organizar seu pedido, qual seu nome e em qual cidade será o projeto?','21:47',id))return;
  if(!await say('out','Carlos, de Salto. Tenho um espaço de mais ou menos 8 x 5 m e penso em uma piscina de fibra.','21:49',id))return;

  stage(1,'Lead sendo qualificado');
  $('#potential').textContent='R$ 25–30 mil';$('#potentialSub').textContent='faixa informada pelo cliente';
  $('#nextAction').textContent='Coletar escopo';$('#actionSub').textContent='prazo, extras e visita';
  toast('Lead qualificado','Salto · piscina nova · 8×5 m','good');
  event('Dados organizados','Cidade, projeto e medidas já estruturados.','21:49','good');
  if(!await hold(PACE.moment,id))return;
  if(!await say('in','Perfeito. Além da piscina, você pensa em aquecimento ou iluminação? E tem alguma previsão para executar?','21:50',id))return;
  if(!await say('out','Quero aquecimento e iluminação. Se der, gostaria de deixar pronto antes do verão. Tenho algo entre 25 e 30 mil em mente.','21:52',id))return;

  event('Intenção alta detectada','Prazo definido e faixa de investimento compatível.','21:52','good');
  toast('Oportunidade quente','Prazo + orçamento + escopo preenchidos.','good');
  if(!await hold(PACE.moment,id))return;
  if(!await say('in','Ótimo. Com essas informações já consigo deixar o atendimento bem adiantado. O próximo passo ideal é uma visita técnica para validar o espaço.','21:53',id))return;
  if(!await say('in','Temos quarta-feira às 10h ou às 16h. Qual funciona melhor?','21:54',id))return;
  if(!await say('out','Quarta às 16h fica ótimo.','21:55',id))return;

  stage(2,'Visita encaminhada');
  card('VISITA TÉCNICA','Quarta-feira · 16:00','Salto, SP · dados do projeto anexados ao lead','Horário reservado no cenário');
  $('#nextAction').textContent='Visita técnica';$('#actionSub').textContent='quarta-feira · 16:00';
  event('Visita encaminhada','Equipe recebe o lead com contexto completo.','21:55','good');
  toast('Visita encaminhada','Quarta-feira às 16h · Salto','good');
  if(!await hold(PACE.card,id))return;

  setClock('17:42');
  const divider=document.createElement('div');divider.className='time-divider';divider.textContent='Quarta-feira · após a visita técnica';chat.appendChild(divider);chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'});
  if(!await hold(PACE.jump,id))return;
  stage(3,'Proposta apresentada após visita');
  card('PROPOSTA COMERCIAL','Projeto completo · R$ 27.800','Piscina de fibra, instalação, aquecimento e iluminação. Valor fictício para esta demonstração.','Proposta registrada no CRM');
  $('#potential').textContent='R$ 27.800';$('#potentialSub').textContent='proposta do cenário';
  $('#nextAction').textContent='Aguardar decisão';$('#actionSub').textContent='follow-up fica programado';
  event('Proposta registrada','R$ 27.800 após validação técnica.','17:42');
  toast('Proposta enviada','Oportunidade atualizada para R$ 27.800');
  if(!await hold(PACE.card,id))return;
  if(!await say('out','Gostei. Pode manter assim. Como faço para reservar o projeto?','17:44',id))return;
  if(!await say('in','Para reservar, a entrada deste cenário é de R$ 2.780. Posso gerar o PIX para você.','17:45',id))return;
  if(!await say('out','Pode gerar.','17:45',id))return;

  stage(4,'Entrada aguardando confirmação');
  card('PIX DA ENTRADA','R$ 2.780','Cobrança vinculada à proposta. A mensagem “paguei” não confirma o recebimento.','Aguardando confirmação do pagamento');
  $('#nextAction').textContent='Confirmar PIX';$('#actionSub').textContent='aguardando confirmação do pagamento';
  event('Cobrança criada','PIX de R$ 2.780 vinculado à proposta.','17:46','warn');
  toast('PIX criado','Entrada de R$ 2.780 aguardando confirmação.','warn');
  if(!await hold(PACE.card,id))return;
  if(!await say('out','Paguei 👍','17:48',id))return;
  if(!await say('in','Recebi sua mensagem. Vou aguardar a confirmação do pagamento antes de marcar como concluído.','17:48',id))return;
  event('Mensagem do cliente recebida','O sistema ainda não marcou o pagamento como recebido.','17:48','warn');
  if(!await hold(PACE.moment+900,id))return;

  stage(5,'Oportunidade ganha no cenário');
  card('PAGAMENTO CONFIRMADO','Entrada recebida · R$ 2.780','Confirmação recebida pelo meio de pagamento conectado à loja.','Negócio atualizado para GANHO');
  $('#received').textContent='R$ 2.780';$('#receivedSub').textContent='pagamento confirmado no cenário';
  $('#nextAction').textContent='Equipe assume';$('#actionSub').textContent='projeto pronto para continuidade';$('#human').textContent='0 min';
  event('Pagamento confirmado','R$ 2.780 confirmados para a loja.','17:49','good');
  toast('Entrada confirmada · R$ 2.780','Negócio atualizado para ganho.','good');
  if(!await hold(1700,id))return;
  toast('Oportunidade preservada','R$ 27.800 acompanhados neste cenário.','good');
  if(!await hold(PACE.card,id))return;

  setClock('08:02');
  event('Resumo da manhã pronto','Equipe recebe lead, visita, proposta e pagamento organizados.','08:02','good');
  toast('Resumo da manhã','7 leads · 3 qualificados · 1 visita · R$ 2.780 de entrada','good');
  $('#stageTitle').textContent='Fluxo concluído';
  await hold(4500,id);
  running=false;paused=false;setMainButton();$('#startBtn').textContent='Assistir novamente';
}

function restart(){run++;running=false;paused=false;clearDemo();$('#startBtn').textContent='Iniciar';document.querySelector('#demo').scrollIntoView({behavior:'smooth',block:'start'});}
$('#startBtn').addEventListener('click',startDemo);
$('#restartBtn').addEventListener('click',restart);
$('#heroStart').addEventListener('click',()=>{document.querySelector('#demo').scrollIntoView({behavior:'smooth'});setTimeout(startDemo,650)});
$('#finalReplay').addEventListener('click',restart);
renderSteps(0);
