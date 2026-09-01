const $ = (s)=>document.querySelector(s);
const chat=$('#chat'), feed=$('#eventFeed'), toastStack=$('#toastStack');
const stages=['Lead','Qualificação','Visita','Proposta','Sinal','Ganho'];
let run=0,running=false;
const state={clock:'21:46'};

function sleep(ms,id){return new Promise(resolve=>{const t=setTimeout(()=>resolve(id===run),ms);});}
function setClock(v){state.clock=v;$('#clock').textContent=v;}
function renderSteps(active=0){$('#stageSteps').innerHTML=stages.map((s,i)=>`<div class="step ${i<active?'done':i===active?'current':''}">${s}</div>`).join('');}
function stage(index,title){const pct=Math.round(index/(stages.length-1)*100);$('#stageTitle').textContent=title;$('#stagePill').textContent=pct+'%';$('#progressBar').style.width=pct+'%';renderSteps(index);}
function clearDemo(){chat.innerHTML=`<div class="chat-intro"><div class="lock-mark">✓</div><span>Dados e valores desta conversa são fictícios.</span></div>`;feed.innerHTML='<div class="empty-event">Inicie a demonstração para acompanhar as ações.</div>';toastStack.innerHTML='';setClock('21:46');stage(0,'Aguardando início');$('#potential').textContent='—';$('#potentialSub').textContent='aguardando qualificação';$('#nextAction').textContent='—';$('#actionSub').textContent='nenhuma ação pendente';$('#received').textContent='R$ 0';$('#receivedSub').textContent='sem pagamento confirmado';$('#human').textContent='0 min';$('#waStatus').textContent='Marina · atendimento comercial';}
function bubble(side,text,time=state.clock){const row=document.createElement('div');row.className='msg-row '+(side==='out'?'out':'');row.innerHTML=`<div class="bubble">${text}<div class="meta">${time}${side==='out'?' · ✓✓':''}</div></div>`;chat.appendChild(row);chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'});}
function typing(){const row=document.createElement('div');row.className='msg-row typing-row';row.innerHTML='<div class="typing"><i></i><i></i><i></i></div>';chat.appendChild(row);chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'});$('#waStatus').textContent='digitando…';}
function stopTyping(){chat.querySelector('.typing-row')?.remove();$('#waStatus').textContent='Marina · atendimento comercial';}
function card(kind,title,copy,success){const row=document.createElement('div');row.className='msg-row';row.innerHTML=`<div class="bubble-card"><div class="kicker">${kind}</div><strong>${title}</strong><p>${copy}</p>${success?`<div class="success-line">${success}</div>`:''}</div>`;chat.appendChild(row);chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'});}
function event(title,copy,time=state.clock,type=''){if(feed.querySelector('.empty-event'))feed.innerHTML='';const el=document.createElement('div');el.className='event '+type;el.innerHTML=`<i class="event-dot"></i><div><b>${title}</b><p>${copy}</p></div><time>${time}</time>`;feed.prepend(el);}
function toast(title,copy,type=''){const el=document.createElement('div');el.className='toast '+type;el.innerHTML=`<i></i><div><b>${title}</b><span>${copy}</span></div>`;toastStack.appendChild(el);setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(-6px)';setTimeout(()=>el.remove(),250)},4300);}
async function say(side,text,time,delay,id){setClock(time);if(side==='in'){typing();await sleep(650,id);stopTyping();}bubble(side,text,time);await sleep(delay,id);}

async function startDemo(){
  if(running)return; running=true; const id=++run; clearDemo();
  $('#startBtn').textContent='Executando…';
  stage(0,'Novo pedido fora do horário');
  toast('Novo lead às 21:46','A loja está fechada, mas o atendimento começou.');
  event('Novo contato recebido','Pedido de orçamento entrou fora do horário.','21:46');
  await say('out','Boa noite! Estou pesquisando uma piscina para minha casa. Vocês conseguem me orientar por aqui?','21:46',900,id); if(id!==run)return;
  await say('in','Boa noite! Consigo sim. Para eu organizar seu pedido, qual seu nome e em qual cidade será o projeto?','21:47',1100,id); if(id!==run)return;
  await say('out','Carlos, de Salto. Tenho um espaço de mais ou menos 8 x 5 m e penso em uma piscina de fibra.','21:49',900,id); if(id!==run)return;
  stage(1,'Lead sendo qualificado');
  $('#potential').textContent='R$ 25–30 mil';$('#potentialSub').textContent='faixa informada pelo cliente';
  $('#nextAction').textContent='Coletar escopo';$('#actionSub').textContent='prazo, extras e visita';
  toast('Lead qualificado','Salto · piscina nova · 8×5 m','good');
  event('Dados organizados','Cidade, projeto e medidas já estruturados.','21:49','good');
  await say('in','Perfeito. Além da piscina, você pensa em aquecimento ou iluminação? E tem alguma previsão para executar?','21:50',1000,id); if(id!==run)return;
  await say('out','Quero aquecimento e iluminação. Se der, gostaria de deixar pronto antes do verão. Tenho algo entre 25 e 30 mil em mente.','21:52',900,id); if(id!==run)return;
  event('Intenção alta detectada','Prazo definido e faixa de investimento compatível.','21:52','good');
  toast('Oportunidade quente','Prazo + orçamento + escopo preenchidos.','good');
  await say('in','Ótimo. Com essas informações já consigo deixar o atendimento bem adiantado. O próximo passo ideal é uma visita técnica para validar o espaço.','21:53',900,id); if(id!==run)return;
  await say('in','Temos quarta-feira às 10h ou às 16h. Qual funciona melhor?','21:54',900,id); if(id!==run)return;
  await say('out','Quarta às 16h fica ótimo.','21:55',600,id); if(id!==run)return;
  stage(2,'Visita encaminhada');
  card('VISITA TÉCNICA','Quarta-feira · 16:00','Salto, SP · dados do projeto anexados ao lead','Horário reservado no cenário');
  $('#nextAction').textContent='Visita técnica';$('#actionSub').textContent='quarta-feira · 16:00';
  event('Visita encaminhada','Equipe recebe o lead com contexto completo.','21:55','good');
  toast('Visita encaminhada','Quarta-feira às 16h · Salto','good');
  await sleep(1500,id); if(id!==run)return;

  setClock('17:42');
  const divider=document.createElement('div');divider.style.cssText='text-align:center;color:#7a8491;font-size:11px;margin:18px 0';divider.textContent='Quarta-feira · após a visita técnica';chat.appendChild(divider);
  stage(3,'Proposta apresentada após visita');
  card('PROPOSTA COMERCIAL','Projeto completo · R$ 27.800','Piscina de fibra, instalação, aquecimento e iluminação. Valor fictício para esta demonstração.','Proposta registrada no CRM');
  $('#potential').textContent='R$ 27.800';$('#potentialSub').textContent='proposta do cenário';
  $('#nextAction').textContent='Aguardar decisão';$('#actionSub').textContent='follow-up fica programado';
  event('Proposta registrada','R$ 27.800 após validação técnica.','17:42');
  toast('Proposta enviada','Oportunidade atualizada para R$ 27.800');
  await sleep(1100,id); if(id!==run)return;
  await say('out','Gostei. Pode manter assim. Como faço para reservar o projeto?','17:44',700,id); if(id!==run)return;
  await say('in','Para reservar, o sinal deste cenário é de R$ 2.780. Posso gerar o PIX para você.','17:45',700,id); if(id!==run)return;
  await say('out','Pode gerar.','17:45',600,id); if(id!==run)return;
  stage(4,'Sinal aguardando confirmação');
  card('PIX DO SINAL','R$ 2.780','Cobrança vinculada à proposta. A mensagem “paguei” não confirma o recebimento.','Aguardando confirmação do gateway');
  $('#nextAction').textContent='Confirmar PIX';$('#actionSub').textContent='validação automática do pagamento';
  event('Cobrança criada','PIX de R$ 2.780 vinculado à proposta.','17:46','warn');
  await sleep(1000,id); if(id!==run)return;
  await say('out','Paguei 👍','17:48',650,id); if(id!==run)return;
  await say('in','Recebi sua mensagem. Vou aguardar a confirmação do pagamento antes de marcar como concluído.','17:48',900,id); if(id!==run)return;
  event('Mensagem do cliente recebida','Sistema ainda não marcou como pago.','17:48','warn');
  await sleep(1300,id); if(id!==run)return;
  stage(5,'Oportunidade ganha no cenário');
  card('PAGAMENTO CONFIRMADO','Sinal recebido · R$ 2.780','Confirmação recebida pelo gateway da loja.','Negócio atualizado para GANHO');
  $('#received').textContent='R$ 2.780';$('#receivedSub').textContent='confirmado pelo gateway no cenário';
  $('#nextAction').textContent='Equipe assume';$('#actionSub').textContent='projeto pronto para continuidade';
  $('#human').textContent='0 min';
  event('Pagamento confirmado','Gateway confirmou R$ 2.780 para a loja.','17:49','good');
  toast('Sinal confirmado · R$ 2.780','Negócio atualizado para ganho.','good');
  toast('Oportunidade preservada','R$ 27.800 acompanhados neste cenário.','good');
  await sleep(1400,id); if(id!==run)return;
  setClock('08:02');
  event('Resumo da manhã pronto','Equipe recebe lead, visita, proposta e pagamento organizados.','08:02','good');
  toast('Resumo da manhã','7 leads · 3 qualificados · 1 visita · R$ 2.780 de sinal','good');
  $('#stageTitle').textContent='Fluxo concluído';
  running=false;$('#startBtn').textContent='Iniciar novamente';
}

function restart(){run++;running=false;clearDemo();$('#startBtn').textContent='Iniciar';document.querySelector('#demo').scrollIntoView({behavior:'smooth',block:'start'});}
$('#startBtn').addEventListener('click',startDemo);$('#restartBtn').addEventListener('click',restart);$('#heroStart').addEventListener('click',()=>{document.querySelector('#demo').scrollIntoView({behavior:'smooth'});setTimeout(startDemo,550)});$('#finalReplay').addEventListener('click',restart);renderSteps(0);
