const {icon,api,adminHeaders,escapeHtml,toast} = AQV;

const $ = s => document.querySelector(s);
const chat = $('#presentationChat');
const feed = $('#liveFeed');
const stages = ['Lead','Qualificação','Visita','Proposta','Sinal','Confirmação','Ganho'];
let running=false, paused=false, cancelled=false, skipRequested=false, runId=0;
let leadId=null, paymentId=null, currentStage=0, syntheticClock=21*60+46, countdownTimer=null;

const focusByStage = {
  0:'Entrada do lead e resposta inicial fora do horário comercial.',
  1:'Coletar nome, cidade, tipo de projeto e medidas sem prometer orçamento apressado.',
  2:'Consolidar escopo, foto, extras e faixa de investimento para agendar a visita.',
  3:'Apresentar proposta após validação técnica e tratar objeções sem inventar condições.',
  4:'Gerar cobrança PIX do sinal com contexto claro para o cliente.',
  5:'Confirmar que o gateway, e não só a mensagem do cliente, valida o pagamento.',
  6:'Marcar negócio ganho, registrar recebimento da loja e resumir a operação para a equipe.'
};

const scenarios = {
  pool: {
    key: 'pool',
    label: 'Piscina nova premium',
    title: 'Da descoberta no Instagram ao sinal confirmado',
    source: 'Instagram',
    leadName: 'Carlos Almeida',
    city: 'Salto, SP',
    projectType: 'Piscina nova',
    projectSummary: 'Fibra · 8 × 5 m',
    deadline: 'Antes do verão',
    potentialValue: 'R$ 27,8 mil',
    open1: 'Boa noite! Vi umas piscinas de vocês no Instagram. Ainda atendem por aqui?',
    ask1: 'Boa. Eu tô pesquisando ainda. Queria fazer uma piscina em casa, mas antes queria entender faixa de preço e como vocês trabalham.',
    nameReply: 'Claro. Meu nome é Carlos Almeida e sou de Salto, SP.',
    projectReply: 'Piscina nova. Eu medi por cima e o espaço tem uns 8 por 5 metros.',
    typeReply: 'Ainda tô comparando, mas tenho a impressão de que fibra dá menos dor de cabeça.',
    typeChoiceReply: 'Pode sim. Acho que fibra faz mais sentido pra mim. A ideia é deixar pronta antes do verão.',
    photoCaption: 'Mandei uma foto da área. Ainda está sem acabamento, mas já dá pra ter uma noção melhor do espaço.',
    extraReply: 'Queria aquecimento e uma iluminação bonita. Spa eu ainda não sei se vale a pena.',
    budgetReply: 'Tenho em mente algo entre 25 e 30 mil. Se ficar muito redondo, até consigo ajustar um pouco.',
    slots: 'Tenho quarta-feira às 10h ou às 16h. Algum desses horários te atende melhor?',
    visitReply: 'Quarta às 16h fica perfeito. Trabalho de manhã.',
    dividerLabel: 'Quarta-feira · após a visita técnica',
    proposalAmount: 'R$ 27.800',
    proposalValue: 27800,
    signalAmount: 'R$ 2.780',
    signalCents: 278000,
    proposalQuestion: 'Eu gostei. Só fiquei pensando se o deck precisa entrar agora ou se eu posso deixar pra depois.',
    proposalAnswer1: 'Pode deixar para depois, sem problema.',
    proposalAnswer2: 'Como isso mexe em escopo e preço, eu não altero nada sem aprovação da equipe. Mas, mantendo a proposta atual, eu consigo seguir com a reserva do projeto.',
    warrantyQuestion: 'Pode manter como está. E a garantia, vocês explicam tudo na proposta mesmo?',
    contractReply: 'Tá certo. Pode gerar o PIX então.',
    finalPaidReply: 'Paguei aqui agora 👍',
    summary: 'Carlos chegou pelo Instagram, informou medida, foto, faixa de investimento, agendou visita, recebeu proposta e pagou o sinal do projeto.',
    humanSaved: '24 min',
    morning: { leads:'7', qualified:'3', visits:'1', revenue:'R$ 2.780', summary:'<strong>Resultado:</strong> um lead que chegou à noite evoluiu até visita, proposta, pagamento de sinal e confirmação automática antes do primeiro contato humano do dia seguinte.' }
  },
  reforma: {
    key: 'reforma',
    label: 'Reforma e modernização',
    title: 'Reforma de piscina com modernização e fechamento',
    source: 'Google',
    leadName: 'Fernanda Rocha',
    city: 'Itu, SP',
    projectType: 'Reforma',
    projectSummary: 'Reforma · 7 × 3 m',
    deadline: 'Até dezembro',
    potentialValue: 'R$ 36,9 mil',
    open1: 'Boa noite! Tenho uma piscina antiga aqui em casa e queria reformar antes do verão. Vocês fazem esse tipo de projeto?',
    ask1: 'Faço parte de um condomínio e queria entender se vocês cuidam da reforma completa ou só da parte da piscina.',
    nameReply: 'Faço sim. Meu nome é Fernanda Rocha e sou de Itu, SP.',
    projectReply: 'É uma reforma. A piscina atual tem cerca de 7 por 3 metros e eu quero deixar tudo mais moderno.',
    typeReply: 'Hoje ela é de vinil e eu também quero orientação sobre o que vale a pena manter.',
    typeChoiceReply: 'Pode seguir com essa linha. Quero uma proposta elegante, com borda mais bonita e menos manutenção.',
    photoCaption: 'Enviei a foto da área externa e da piscina atual para ajudar na avaliação.',
    extraReply: 'Quero iluminação nova, aquecimento e talvez trocar o entorno por algo mais clean.',
    budgetReply: 'Estou pensando em algo perto de 35 a 40 mil, dependendo do acabamento.',
    slots: 'Tenho quinta-feira às 09h30 ou às 15h. Algum desses horários funciona melhor para você?',
    visitReply: 'Quinta às 15h funciona melhor para mim.',
    dividerLabel: 'Quinta-feira · após a visita técnica',
    proposalAmount: 'R$ 36.900',
    proposalValue: 36900,
    signalAmount: 'R$ 3.690',
    signalCents: 369000,
    proposalQuestion: 'Gostei bastante. Consigo deixar o deck para uma segunda etapa sem atrapalhar a reforma principal?',
    proposalAnswer1: 'Consegue sim. A parte estrutural e o conjunto principal podem seguir primeiro.',
    proposalAnswer2: 'Se o deck sair agora, a proposta permanece mais enxuta e a equipe consegue manter o cronograma da reforma.',
    warrantyQuestion: 'Perfeito. A garantia dos equipamentos e da reforma vem explicada direitinho?',
    contractReply: 'Pode gerar o PIX do sinal então.',
    finalPaidReply: 'Acabei de pagar e mandei o comprovante ✅',
    summary: 'Fernanda entrou pelo Google, detalhou a reforma, agendou visita, recebeu proposta de modernização e confirmou o sinal.',
    humanSaved: '27 min',
    morning: { leads:'6', qualified:'2', visits:'1', revenue:'R$ 3.690', summary:'<strong>Resultado:</strong> uma oportunidade de reforma de maior ticket foi qualificada fora do horário, reduzindo o trabalho manual e chegando pronta para a equipe no dia seguinte.' }
  },
  retomada: {
    key: 'retomada',
    label: 'Lead retomado com fechamento',
    title: 'Retomada de lead antigo até o pagamento do sinal',
    source: 'WhatsApp',
    leadName: 'Rafael Mendes',
    city: 'Indaiatuba, SP',
    projectType: 'Piscina nova',
    projectSummary: 'Fibra · 6 × 3 m',
    deadline: 'Mês que vem',
    potentialValue: 'R$ 24,6 mil',
    open1: 'Oi! Eu tinha falado com vocês semana passada sobre uma piscina e queria retomar o atendimento por aqui.',
    ask1: 'Eu ainda tenho interesse, mas queria fechar isso logo se a proposta fizer sentido.',
    nameReply: 'Sou o Rafael Mendes, de Indaiatuba, SP.',
    projectReply: 'É uma piscina nova para a área gourmet. O espaço útil tem mais ou menos 6 por 3 metros.',
    typeReply: 'Quero algo em fibra premium, mais clean e sem muita complicação de manutenção.',
    typeChoiceReply: 'Pode seguir assim. Minha ideia é tentar executar isso no mês que vem.',
    photoCaption: 'Reenviei a foto da área gourmet para vocês terem o contexto completo.',
    extraReply: 'Quero iluminação e preparação para aquecimento, mesmo que eu instale o equipamento depois.',
    budgetReply: 'Quero ficar perto de 24 ou 25 mil. Se fizer sentido, eu já deixo um sinal pago.',
    slots: 'Tenho terça às 11h30 ou às 17h. Qual horário é melhor para a equipe te atender?',
    visitReply: 'Terça às 17h fica ótimo.',
    dividerLabel: 'Terça-feira · após a visita técnica',
    proposalAmount: 'R$ 24.600',
    proposalValue: 24600,
    signalAmount: 'R$ 2.460',
    signalCents: 246000,
    proposalQuestion: 'Curti. O restante do pagamento vocês alinham depois com a equipe comercial?',
    proposalAnswer1: 'Isso. O restante segue conforme as condições comerciais passadas formalmente pela equipe.',
    proposalAnswer2: 'Por aqui eu adianto a reserva do projeto e organizo a confirmação do sinal, sem prometer condição fora da proposta.',
    warrantyQuestion: 'Perfeito. Pode seguir exatamente assim então.',
    contractReply: 'Pode gerar o PIX agora, eu já resolvo isso.',
    finalPaidReply: 'Pago. Já encaminhei o comprovante aqui no WhatsApp.',
    summary: 'Rafael retomou uma conversa antiga, confirmou escopo, fez visita de validação e fechou com pagamento do sinal.',
    humanSaved: '21 min',
    morning: { leads:'5', qualified:'2', visits:'1', revenue:'R$ 2.460', summary:'<strong>Resultado:</strong> um lead que poderia esfriar foi retomado, organizado e convertido em oportunidade ganha com o sinal confirmado automaticamente.' }
  }
};

function injectIcons(){
  $('#restartIcon').innerHTML=icon('refresh',15);
  $('#pauseIcon').innerHTML=icon('pause',15);
  $('#nextIcon').innerHTML=icon('skip',15);
  $('#playIcon').innerHTML=icon('play',15);
  $('#cinemaIcon').innerHTML=icon('monitor',15);
  $('#fullscreenIcon').innerHTML=icon('external',15);
  $('#insightsIcon').innerHTML=icon('grid',15);
  $('#phoneIcon').innerHTML=icon('phone',18);
  $('#moreIcon').innerHTML=icon('more',18);
  $('#paperclipIcon').innerHTML=icon('paperclip',18);
  $('#cameraIcon').innerHTML=icon('camera',18);
  $('#micIcon').innerHTML=icon('mic',18);
  $('#lockIcon').innerHTML=icon('lock',15);
}

function getScenario(){ return scenarios[$('#scenarioSelect').value] || scenarios.pool; }
function renderJourney(){
  $('#journeySteps').innerHTML=stages.map((s,i)=>`<div class="journey-step ${i<currentStage?'done':i===currentStage?'current':''}"><i></i><span>${s}</span></div>`).join('');
  const pct = Math.round((currentStage/(stages.length-1))*100);
  $('#storyProgress').style.width = `${pct}%`;
  $('#progressLabel').textContent = `${pct}%`;
}
function hhmm(){ const h=Math.floor(syntheticClock/60)%24,m=syntheticClock%60; return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`; }
function advanceMinutes(n){ syntheticClock+=n; $('#storyElapsed').textContent=syntheticClock>(21*60+46)?`${syntheticClock-(21*60+46)} min`:'0 min'; $('#contextBarTime').textContent=hhmm(); }
function speed(){ const v=$('#speedSelect').value; return v==='manual' ? 'manual' : Number(v||1); }

async function wait(ms){
  const id=runId;
  if(speed()==='manual'){
    skipRequested=false;
    while(running && !cancelled && id===runId && !skipRequested){ await new Promise(r=>setTimeout(r,80)); }
    skipRequested=false;
    return;
  }
  let left=ms*speed();
  while(left>0 && running && !cancelled && id===runId){
    if(paused){ await new Promise(r=>setTimeout(r,100)); continue; }
    const slice=Math.min(100,left);
    await new Promise(r=>setTimeout(r,slice));
    left-=slice;
    if(skipRequested){ skipRequested=false; break; }
  }
}
function readMs(text,min=2600){ const words=String(text).trim().split(/\s+/).filter(Boolean).length; return Math.max(min, Math.min(9800, 1200 + words*310)); }
function typeMs(text){ const chars=String(text).length; return Math.max(1300, Math.min(7600, 900 + chars*22)); }
function scrollChat(){ requestAnimationFrame(()=>chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'})); }
function clearTyping(){ chat.querySelector('.demo-typing-row')?.remove(); }
function typing(on=true){
  clearTyping();
  if(!on){ $('#waStatus').textContent='Marina · consultora comercial'; return; }
  $('#waStatus').textContent='digitando…';
  const row=document.createElement('div');
  row.className='msg-row demo-typing-row';
  row.innerHTML='<div class="typing"><i></i><i></i><i></i></div>';
  chat.appendChild(row); scrollChat();
}
function bubble(role,text,opts={}){
  $('#conversationEmpty')?.remove(); clearTyping();
  const row=document.createElement('div');
  row.className=`msg-row ${role==='user'?'out':''}`;
  const ticks=role==='user'?'<span class="ticks">✓✓</span>':'';
  row.innerHTML=`<div class="msg ${opts.kind||''}">${escapeHtml(text).replace(/\n/g,'<br>')}<div class="msg-meta"><span>${opts.time||hhmm()}</span>${ticks}</div></div>`;
  chat.appendChild(row); scrollChat();
}
function photoBubble(caption){
  $('#conversationEmpty')?.remove();
  const row=document.createElement('div');
  row.className='msg-row out';
  row.innerHTML=`<div class="msg image demo-photo-msg"><img src="/web/assets/yard-demo.svg" alt="Foto do quintal enviada pelo cliente"><div class="msg-caption">${escapeHtml(caption)}</div><div class="msg-meta"><span>${hhmm()}</span><span class="ticks">✓✓</span></div></div>`;
  chat.appendChild(row); scrollChat();
}
function voucherBubble(name){
  const row=document.createElement('div');
  row.className='msg-row out';
  row.innerHTML=`<div class="msg rich-message proof-message"><div class="rich-kicker">Comprovante enviado</div><div class="rich-title">PIX realizado pelo cliente</div><div class="rich-copy">${escapeHtml(name)} enviou o comprovante logo após concluir o pagamento pelo app do banco.</div><div class="msg-meta"><span>${hhmm()}</span><span class="ticks">✓✓</span></div></div>`;
  chat.appendChild(row); scrollChat();
}
function divider(label){ const d=document.createElement('div'); d.className='story-divider'; d.innerHTML=`<span>${escapeHtml(label)}</span>`; chat.appendChild(d); scrollChat(); }
function appointmentCard(slotTitle, city){
  const row=document.createElement('div'); row.className='msg-row';
  row.innerHTML=`<div class="msg rich-message"><div class="rich-kicker">Visita técnica</div><div class="rich-title">${escapeHtml(slotTitle)}</div><div class="rich-copy">${escapeHtml(city)} · endereço confirmado no agendamento</div><div class="rich-status">${icon('checkcircle',14)} Horário reservado</div><div class="msg-meta"><span>${hhmm()}</span></div></div>`;
  chat.appendChild(row); scrollChat();
}
function proposalCard(amountLabel, proposalLines){
  const row=document.createElement('div'); row.className='msg-row';
  row.innerHTML=`<div class="msg rich-message proposal-message"><div class="rich-kicker">Proposta comercial</div><div class="rich-title">Projeto completo · ${escapeHtml(amountLabel)}</div><div class="proposal-lines">${proposalLines.map(x=>`<span>${escapeHtml(x[0])}</span><b>${escapeHtml(x[1])}</b>`).join('')}</div><div class="rich-copy">Condição demonstrativa. Escopo final depende da proposta formal e da validação técnica da empresa.</div><div class="msg-meta"><span>${hhmm()}</span></div></div>`;
  chat.appendChild(row); scrollChat();
}
function paymentCard(result, s){
  const br=(result?.pix?.brCode||`00020126580014BR.GOV.BCB.PIX0136demo-${s.key}-sinal5204000053039865802BR5918Lumina Piscinas6009Salto62070503***6304ABCD`).slice(0,72)+'…';
  const row=document.createElement('div'); row.className='msg-row';
  row.innerHTML=`<div class="msg payment-message"><div class="payment-card demo-payment-card"><div class="payment-top"><div class="payment-brand"><div class="payment-lock">${icon('lock',14)}</div><div><b>PIX · sinal do projeto</b><div class="payment-desc">Recebedor: Lumina Piscinas & Outdoor</div></div></div><span class="payment-demo-label">SANDBOX</span></div><div class="payment-value">${escapeHtml(s.signalAmount)},00</div><div class="payment-desc">10% do projeto demonstrativo de ${escapeHtml(s.proposalAmount)}</div><div class="pix-grid"><img class="qr-demo-img" src="/web/assets/pix-qr.svg" alt="QR code demonstrativo do PIX"><div><div class="pix-code" id="pixCodeText">${escapeHtml(br)}</div><button class="copy-demo-btn" id="copyPixBtn" type="button">${icon('copy',13)} Copiar código PIX</button></div></div><div class="payment-state" id="paymentState"><span class="spinner"></span><span>Aguardando pagamento · expira em <b id="countdown">14:58</b></span></div></div><div class="msg-meta"><span>${hhmm()}</span></div></div>`;
  chat.appendChild(row);
  scrollChat();
  startCountdown(14*60+58);
}
function startCountdown(totalSeconds){
  clearInterval(countdownTimer);
  let left = totalSeconds;
  const tick = () => {
    const el = $('#countdown');
    if(!el) return;
    const m = String(Math.floor(left/60)).padStart(2,'0');
    const s = String(left%60).padStart(2,'0');
    el.textContent = `${m}:${s}`;
    if(left>0) left -= 1;
  };
  tick();
  countdownTimer = setInterval(tick,1000);
}
function stopCountdown(){ clearInterval(countdownTimer); countdownTimer=null; }
function officialPaymentConfirmed(){ stopCountdown(); const st=$('#paymentState'); if(st)st.innerHTML=`${icon('checkcircle',14)} <strong>Pagamento confirmado pelo gateway</strong>`; }
function addEvent(type,text,amount=''){
  if(feed.querySelector('.empty-mini')) feed.innerHTML='';
  const map={lead:'users',message:'message',score:'activity',calendar:'calendar',proposal:'note',payment:'wallet',gateway:'lock',won:'checkcircle',human:'user',photo:'camera'};
  const row=document.createElement('div'); row.className='live-event studio-event';
  row.innerHTML=`<div class="live-icon">${icon(map[type]||'activity',14)}</div><div class="live-copy">${escapeHtml(text)}${amount?`<strong class="event-amount">${escapeHtml(amount)}</strong>`:''}</div><div class="live-time">${hhmm()}</div>`;
  feed.prepend(row);
}
function setStage(index,label){ currentStage=index; renderJourney(); $('#stageBadge').textContent=label||stages[index]; const f=$('#storyFocus'); if(f) f.textContent = focusByStage[index] || 'Acompanhando a etapa atual da automação.'; }
function setSnapshot(data={}){
  if(data.name){ $('#leadName').textContent=data.name; $('#leadSub').textContent=`${data.source || getScenario().source} · atendimento agora`; }
  if(data.score!==undefined) $('#leadScore').textContent=data.score;
  if(data.city) $('#snapCity').textContent=data.city;
  if(data.project) $('#snapProject').textContent=data.project;
  if(data.deadline) $('#snapDeadline').textContent=data.deadline;
  if(data.value) $('#snapValue').textContent=data.value;
  if(data.reasons) $('#scoreReasons').innerHTML=data.reasons.map(x=>`<span>${icon('check',11)} ${escapeHtml(x)}</span>`).join('');
}
function moneyReceived(amount, name){
  $('#receivedTotal').textContent=amount;
  $('#paymentStatusTop').textContent='Confirmado';
  $('#moneyFeed').innerHTML=`<div class="money-row"><div class="money-row-icon">${icon('checkcircle',16)}</div><div><strong>+ ${escapeHtml(amount)},00</strong><span>Sinal · ${escapeHtml(name)}</span><small>Gateway confirmou para a conta da loja · ${hhmm()}</small></div></div>`;
}
function setHumanSaved(value){ $('#humanTime').textContent = value; }
function applyScenarioMeta(){
  const s=getScenario();
  $('#storyTitle').textContent=s.title;
  $('#scenarioLabel').textContent=s.label;
  $('#contextBarText').textContent='Loja fechada · automação comercial segue atendendo, qualificando e organizando tudo para a equipe';
  $('#chatCompanyName').textContent='Lumina Piscinas & Outdoor';
  $('#morningLeads').textContent=s.morning.leads;
  $('#morningQualified').textContent=s.morning.qualified;
  $('#morningVisits').textContent=s.morning.visits;
  $('#morningRevenue').textContent=s.morning.revenue;
  $('#morningSummary').innerHTML=s.morning.summary;
}
async function assistant(text,read){ typing(true); await wait(typeMs(text)); typing(false); bubble('assistant',text); await wait(read||readMs(text)); }
async function user(text,think=4200,read=2200){ await wait(think); advanceMinutes(Math.max(1,Math.round(think/80000))); bubble('user',text); addEvent('message','Cliente respondeu'); await wait(read); }

async function backendInit(){ leadId = 'public_demo'; }
async function backendQualify(message){ return null; }
async function backendStage(stage){ return null; }
async function backendAppointment(slotText, city){ return null; }
async function backendPayment(amountCents, description){ paymentId = 'public_demo_payment'; return {id: paymentId}; }
async function backendPaid(){ return null; }

async function runScenarioStory(s){
  addEvent('lead',`Novo lead recebido via ${s.source}`);
  await wait(1800);

  await user(s.open1,2100,2400);
  setStage(0,'Novo lead');
  await assistant('Boa noite! Atendemos sim por aqui. 😊\n\nMesmo com a loja fechada, eu consigo adiantar seu atendimento e deixar o projeto organizado para a equipe de vendas amanhã cedo.');
  await assistant('Se você quiser, eu posso entender o básico do seu projeto, confirmar região de atendimento e já encaminhar tudo certinho para a equipe comercial.');

  await user(s.ask1,6200,3200);
  await assistant('Perfeito. Eu prefiro não te passar um valor chutado antes de entender tamanho, tipo de projeto e extras. Assim a equipe não promete uma coisa e depois precisa corrigir.');
  await assistant('Me ajuda com duas informações rápidas? Seu nome e a cidade do projeto.');
  await user(s.nameReply,5200,2500);
  setSnapshot({name:s.leadName, city:s.city, project:'Residencial', source:s.source});
  setStage(1,'Qualificando');
  addEvent('score','Região de atendimento confirmada');

  await assistant(`Prazer, ${s.leadName.split(' ')[0]}. ${s.city.split(',')[0]} está dentro da nossa área de atendimento.`);
  await assistant('Você já sabe se seria piscina nova ou reforma? E mais ou menos quanto espaço você tem disponível no quintal?');
  await user(s.projectReply,5600,2300);
  setSnapshot({name:s.leadName, city:s.city, project:s.projectSummary, score:56, reasons:['região atendida','projeto residencial','medidas informadas'], source:s.source});
  await assistant('Boa, isso já ajuda bastante a equipe a visualizar as opções.');
  await assistant('Você já tem uma preferência de material ou ainda está comparando as possibilidades?');
  await user(s.typeReply,6000,2200);
  await assistant('Perfeito. Eu consigo registrar sua preferência inicial, mas sem travar algo técnico só por mensagem. A definição final sempre depende da visita e da proposta formal.');
  await assistant('Se fizer sentido para você, eu sigo o atendimento nessa linha e deixo isso bem claro para a equipe.');
  await user(s.typeChoiceReply,5000,2100);
  await assistant('Ótimo. Se tiver uma foto da área, pode mandar por aqui. Eu anexo ao atendimento para o especialista chegar mais preparado na visita.');

  await wait(5200); advanceMinutes(1); photoBubble(s.photoCaption); addEvent('photo','Foto da área recebida e anexada ao lead'); await wait(5200);
  await assistant('Recebi a foto, obrigada.');
  await assistant('Eu não vou afirmar medida, estrutura ou viabilidade olhando só a imagem, porque isso precisa de visita técnica. Mas ela já ajuda bastante a equipe no contexto do projeto.');
  await assistant('Além do projeto principal, você quer algum opcional? Aquecimento, iluminação, spa, deck ou algo nesse sentido?');
  await user(s.extraReply,6800,2600);
  setSnapshot({name:s.leadName, city:s.city, project:s.projectSummary, deadline:s.deadline, score:83, reasons:['região atendida','projeto definido','prazo próximo','foto recebida','extras informados'], source:s.source});
  addEvent('score','Lead passou para alta intenção');
  await assistant('Perfeito. Já deixei registrado o escopo principal e os extras citados por você.');
  await assistant('Se não for incômodo, você já separou alguma faixa de investimento? Isso evita a equipe montar algo muito acima da sua realidade.');
  await user(s.budgetReply,7000,2500);
  setSnapshot({name:s.leadName, city:s.city, project:s.projectSummary, deadline:s.deadline, value:s.potentialValue, score:95, reasons:['região atendida','faixa compatível','projeto bem definido','foto recebida','prazo forte'], source:s.source});
  await backendQualify(`${s.nameReply} ${s.projectReply} ${s.typeReply} ${s.extraReply} ${s.budgetReply}`);
  setStage(2,'Pronto para visita');
  addEvent('score','Lead qualificado · score 95');

  await assistant('Ótimo. Com essas informações, o próximo passo certo é a visita técnica. A equipe mede tudo no local, valida acesso, estrutura e então fecha a proposta sem chute.');
  await assistant(s.slots);
  await user(s.visitReply,5600,2100);
  advanceMinutes(1);
  await backendAppointment(s.visitReply, s.city);
  appointmentCard(s.visitReply.replace('fica','').replace('funciona','').trim(), s.city);
  addEvent('calendar','Visita técnica agendada');
  await wait(6200);
  await user('Fechado. Preciso pagar alguma coisa agora?',5200,1800);
  await assistant('Não. Nesta etapa a visita fica apenas reservada. Qualquer cobrança de sinal só acontece depois que a proposta estiver pronta e você aprovar.');
  await assistant('Se a equipe identificar alguma necessidade de ajuste no projeto, isso entra na proposta, não agora.');
  await wait(5600);

  divider(s.dividerLabel);
  syntheticClock=20*60+14; $('#storyElapsed').textContent='~2 dias'; $('#contextBarTime').textContent=hhmm();
  await wait(3800);
  setStage(3,'Proposta enviada');
  await backendStage('PROPOSAL');
  proposalCard(s.proposalAmount, [['Projeto principal','incluído'],['Opcionais informados','incluído'],['Prazo estimado',s.deadline.toLowerCase()],['Condição inicial','proposta enviada']]);
  addEvent('proposal',`Proposta enviada · ${s.proposalAmount}`);
  await wait(6200);
  await assistant(`${s.leadName.split(' ')[0]}, a equipe finalizou sua proposta com base na visita.`);
  await assistant(`Neste cenário demonstrativo, o projeto ficou em ${s.proposalAmount}, já considerando o escopo alinhado com você.`);
  await assistant('Se você quiser, eu posso resumir as condições por aqui antes de avançarmos.');
  await user(s.proposalQuestion,6200,2200);
  await assistant(s.proposalAnswer1);
  await assistant(s.proposalAnswer2);
  await user(s.warrantyQuestion,6200,2100);
  await assistant('Sim. A proposta formal traz o detalhamento comercial e a equipe confirma o que vale para estrutura e equipamentos.');
  await assistant(`Se você quiser reservar esse projeto, o fluxo segue com um sinal de 10%. Neste caso, ${s.signalAmount}.`);
  await user(s.contractReply,5200,1700);
  setStage(4,'Aguardando sinal');
  const pay=await backendPayment(s.signalCents,`Sinal de 10% do projeto demonstrativo ${s.label}`);
  paymentCard(pay||{}, s);
  addEvent('payment','Cobrança PIX criada para a conta da loja', s.signalAmount);
  $('#paymentStatusTop').textContent='Aguardando';
  await wait(7600);
  await user(s.finalPaidReply,8200,1800);
  await wait(1200);
  voucherBubble(s.leadName);
  addEvent('payment','Cliente informou pagamento e enviou comprovante');
  await wait(4600);
  await assistant('Recebi sua mensagem e o comprovante.');
  await assistant('Agora eu aguardo a confirmação automática do gateway para marcar o sinal como recebido. A mensagem “paguei” sozinha não libera a venda.');
  setStage(5,'Verificando pagamento');
  addEvent('gateway','Gateway validando a transação');
  $('#paymentStatusTop').textContent='Verificando…';
  await wait(6200);
  await backendPaid();
  officialPaymentConfirmed();
  moneyReceived(s.signalAmount, s.leadName);
  setHumanSaved(s.humanSaved);
  advanceMinutes(1);
  addEvent('gateway','Pagamento confirmado pelo gateway', s.signalAmount);
  addEvent('payment','Valor registrado como recebido pela loja', `+ ${s.signalAmount}`);
  setStage(6,'Negócio ganho');
  await backendStage('WON');
  await wait(2200);
  await assistant('Pagamento confirmado ✅');
  await assistant(`O sinal de ${s.signalAmount} foi identificado e o projeto ficou reservado para a sua empresa seguir com as próximas etapas.`);
  await assistant('A equipe comercial já recebeu a atualização e continua a partir daqui com tudo organizado.');
  divider('Manhã seguinte · 08:02');
  await wait(3800);
  $('#morningCard').classList.add('show');
  addEvent('won','Resumo noturno enviado para o responsável da loja');
}

async function runStory(){
  if(running) return;
  running=true; paused=false; cancelled=false; runId++;
  const id=runId;
  const s=getScenario();
  applyScenarioMeta();
  $('#startBtn').disabled=true;
  $('#startBtn').classList.add('running');
  await backendInit();
  try {
    await runScenarioStory(s);
    await wait(7800);
  } finally {
    if(id!==runId) return;
    running=false;
    $('#startBtn').disabled=false;
    $('#startBtn').classList.remove('running');
    $('#startBtn').innerHTML=`${icon('play',15)} Reproduzir novamente`;
    toast('Demonstração concluída','success');
  }
}

function resetUI(){
  cancelled=true; runId++; running=false; paused=false; skipRequested=false; leadId=null; paymentId=null; currentStage=0; syntheticClock=21*60+46; stopCountdown();
  applyScenarioMeta();
  chat.innerHTML='<div class="day-chip">Hoje</div><div class="conversation-empty" id="conversationEmpty"><div class="empty-lock">'+icon('lock',15)+'</div><div>Conversa protegida. Nesta demonstração, dados, horários e valores são fictícios.</div></div>';
  feed.innerHTML='<div class="empty-mini">Inicie a demonstração para acompanhar tudo em tempo real.</div>';
  $('#waStatus').textContent='Marina · consultora comercial';
  $('#stageBadge').textContent='Novo lead';
  $('#leadName').textContent='Cliente não identificado';
  $('#leadSub').textContent=`${getScenario().source} · agora`;
  $('#leadScore').textContent='—';
  $('#snapCity').textContent='—';
  $('#snapProject').textContent='—';
  $('#snapDeadline').textContent='—';
  $('#snapValue').textContent='—';
  $('#scoreReasons').innerHTML='<span>Aguardando qualificação…</span>';
  $('#receivedTotal').textContent='R$ 0';
  $('#paymentStatusTop').textContent='Nenhum';
  $('#moneyFeed').innerHTML='<div class="empty-mini">O recebimento da loja aparece aqui quando o gateway confirma o pagamento.</div>';
  $('#morningCard').classList.remove('show');
  $('#storyElapsed').textContent='0 min';
  $('#storyStart').textContent='21:46';
  $('#humanTime').textContent='0 min';
  $('#contextBarTime').textContent='21:46';
  const f=$('#storyFocus'); if(f) f.textContent='Aguardando início da demonstração';
  renderJourney();
  $('#startBtn').disabled=false;
  $('#startBtn').innerHTML=`${icon('play',15)} Iniciar`;
  $('#pauseBtn').innerHTML=`${icon('pause',15)} Pausar`;
}

function toggleCinema(){ document.body.classList.toggle('cinema-mode'); const on=document.body.classList.contains('cinema-mode'); $('#cinemaBtn').innerHTML=on?`${icon('x',15)} Sair do cinema`:`${icon('monitor',15)} Cinema`; }
function toggleFullscreen(){
  if(!document.fullscreenElement){ document.documentElement.requestFullscreen?.().catch(()=>{}); }
  else{ document.exitFullscreen?.().catch(()=>{}); }
}
function toggleInsights(){ document.body.classList.toggle('insights-hidden'); }

document.addEventListener('click', e => {
  if(e.target.closest('#copyPixBtn')){
    const text=$('#pixCodeText')?.textContent?.trim() || '';
    if(text) navigator.clipboard?.writeText(text).then(()=>toast('Código PIX copiado','success')).catch(()=>toast('Não foi possível copiar agora','error'));
  }
});

$('#startBtn').onclick=runStory;
$('#restartBtn').onclick=()=>{ resetUI(); setTimeout(runStory,250); };
$('#pauseBtn').onclick=()=>{ paused=!paused; $('#pauseBtn').innerHTML=paused?`${icon('play',15)} Continuar`:`${icon('pause',15)} Pausar`; };
$('#nextBtn').onclick=()=>{ skipRequested=true; };
$('#speedSelect').onchange=()=>{ if(speed()==='manual') toast('Modo manual: use “Próximo” para avançar cada pausa.'); };
$('#scenarioSelect').onchange=()=>{ if(running) return toast('Reinicie a demo para trocar de cenário.'); resetUI(); };
$('#cinemaBtn').onclick=toggleCinema;
$('#fullscreenBtn').onclick=toggleFullscreen;
$('#toggleInsightsBtn').onclick=toggleInsights;

document.addEventListener('fullscreenchange',()=>{
  $('#fullscreenBtn').innerHTML = document.fullscreenElement ? `${icon('x',15)} Sair da tela cheia` : `${icon('external',15)} Tela cheia`;
});


document.addEventListener('keydown',e=>{
  const tag=(document.activeElement?.tagName||'').toLowerCase();
  if(tag==='input' || tag==='textarea' || tag==='select') return;
  if(e.code==='Space'){ e.preventDefault(); if(running){ paused=!paused; $('#pauseBtn').innerHTML=paused?`${icon('play',15)} Continuar`:`${icon('pause',15)} Pausar`; } else { runStory(); } }
  if(e.key==='ArrowRight'){ e.preventDefault(); skipRequested=true; }
  if(e.key==='r' || e.key==='R'){ e.preventDefault(); resetUI(); setTimeout(runStory,250); }
  if(e.key==='f' || e.key==='F'){ e.preventDefault(); toggleFullscreen(); }
  if(e.key==='i' || e.key==='I'){ e.preventDefault(); toggleInsights(); }
  if(e.key==='c' || e.key==='C'){ e.preventDefault(); toggleCinema(); }
});

injectIcons();
resetUI();
toast('Demo pronta. Atalhos: Espaço, →, R, F, I e C.');
