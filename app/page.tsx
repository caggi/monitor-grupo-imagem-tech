'use client';
import { useEffect, useRef, useState } from 'react';
import { Bell, BellRing, CheckCircle2, Clock3, ExternalLink, Globe2, Maximize2, Pause, Play, RefreshCw, ServerCrash, Trash2 } from 'lucide-react';

const TARGET='https://atendimento.grupoimagetech.com.br/';
type Entry={time:string;online:boolean;duration:number};

export default function Page(){
 const [running,setRunning]=useState(true),[checking,setChecking]=useState(false),[status,setStatus]=useState<'checking'|'online'|'offline'>('checking');
 const [intervalSec,setIntervalSec]=useState(30),[remaining,setRemaining]=useState(0),[history,setHistory]=useState<Entry[]>([]),[notifications,setNotifications]=useState(false);
 const prior=useRef<'checking'|'online'|'offline'>('checking'); const audio=useRef<AudioContext|null>(null);
 const check=async()=>{if(checking)return;setChecking(true);const start=performance.now();let online=false;try{await fetch(TARGET+'?monitor='+Date.now(),{mode:'no-cors',cache:'no-store'});online=true}catch{}const next=online?'online':'offline';const item={time:new Date().toLocaleTimeString('pt-BR'),online,duration:Math.round(performance.now()-start)};setStatus(next);setHistory(h=>[item,...h].slice(0,30));setRemaining(intervalSec);setChecking(false);
  if(online&&prior.current==='offline'){try{if(Notification.permission==='granted')new Notification('O atendimento voltou!',{body:'O endereço do Grupo Imagem Tech está respondendo.'});audio.current??=new AudioContext();const o=audio.current.createOscillator(),g=audio.current.createGain();o.connect(g);g.connect(audio.current.destination);o.frequency.value=880;g.gain.setValueAtTime(.18,audio.current.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.current.currentTime+.8);o.start();o.stop(audio.current.currentTime+.8)}catch{}} prior.current=next;
 };
 useEffect(()=>{const saved=Number(localStorage.getItem('monitorInterval'));if(saved)setIntervalSec(saved);check()},[]);
 useEffect(()=>{localStorage.setItem('monitorInterval',String(intervalSec));setRemaining(intervalSec)},[intervalSec]);
 useEffect(()=>{if(!running)return;const t=setInterval(()=>setRemaining(r=>{if(r<=1){check();return intervalSec}return r-1}),1000);return()=>clearInterval(t)},[running,intervalSec,checking]);
 const enableNotifications=async()=>{if(!('Notification'in window))return;const p=await Notification.requestPermission();setNotifications(p==='granted')};
 const online=status==='online';
 return <main><section className="shell">
  <header><div className="brand"><span className="brandIcon"><Globe2/></span><div><small>MONITOR DE DISPONIBILIDADE</small><h1>Grupo Imagem Tech</h1></div></div><nav className="headerActions"><a className="visit" href="/compacto">Modo compacto <Maximize2 size={16}/></a><a className="visit" href={TARGET} target="_blank">Abrir site <ExternalLink size={16}/></a></nav></header>
  <article className={'status '+status}>
   <div className="pulse">{status==='checking'?<RefreshCw className="spin"/>:online?<CheckCircle2/>:<ServerCrash/>}</div>
   <div className="statusText"><span>STATUS ATUAL</span><h2>{status==='checking'?'Verificando…':online?'Está online':'Ainda está fora do ar'}</h2><p>{online?'O servidor respondeu. Você já pode tentar acessar o atendimento.':'Continuaremos verificando automaticamente enquanto esta página permanecer aberta.'}</p></div>
   <button className="check" onClick={check} disabled={checking}><RefreshCw className={checking?'spin':''} size={18}/>{checking?'Verificando':'Verificar agora'}</button>
  </article>
  <div className="url"><span className={online?'dot green':'dot'}></span><code>{TARGET}</code></div>
  <section className="grid">
   <article className="card controls"><div className="cardTitle"><Clock3/><div><h3>Verificação automática</h3><p>Próxima tentativa em <strong>{running?remaining+'s':'pausa'}</strong></p></div></div>
    <div className="row"><label>Intervalo<select value={intervalSec} onChange={e=>setIntervalSec(Number(e.target.value))}><option value="15">15 segundos</option><option value="30">30 segundos</option><option value="60">1 minuto</option><option value="300">5 minutos</option></select></label><button className="toggle" onClick={()=>setRunning(!running)}>{running?<><Pause size={17}/>Pausar</>:<><Play size={17}/>Retomar</>}</button></div>
    <button className={'notify '+(notifications?'enabled':'')} onClick={enableNotifications}>{notifications?<BellRing/>:<Bell/>}<span><strong>{notifications?'Notificações ativadas':'Avisar quando voltar'}</strong><small>{notifications?'Você será avisado quando o status mudar.':'Ative som e notificação do navegador.'}</small></span></button>
   </article>
   <article className="card history"><div className="historyHead"><div><h3>Histórico recente</h3><p>Últimas {history.length||0} verificações</p></div><button title="Limpar histórico" onClick={()=>setHistory([])}><Trash2 size={17}/></button></div>
    <div className="entries">{history.length===0?<p className="empty">Nenhuma verificação registrada.</p>:history.map((x,i)=><div className="entry" key={i}><span className={x.online?'mini green':'mini'}></span><strong>{x.online?'Online':'Sem resposta'}</strong><span>{x.duration} ms</span><time>{x.time}</time></div>)}</div>
   </article>
  </section>
  <footer><p><strong>Importante:</strong> mantenha esta aba aberta. A página detecta se o endereço voltou a responder, mas não consegue validar o conteúdo interno do sistema.</p></footer>
 </section></main>
}
