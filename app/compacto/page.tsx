'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, RefreshCw, ServerCrash } from 'lucide-react';

const TARGET = 'https://atendimento.grupoimagetech.com.br/';

export default function CompactPage(){
  const [checking,setChecking] = useState(false);
  const [status,setStatus] = useState<'checking'|'online'|'offline'>('checking');

  const check = async () => {
    if(checking) return;
    setChecking(true);

    let online = false;
    try {
      await fetch(TARGET + '?monitor=' + Date.now(), {mode:'no-cors', cache:'no-store'});
      online = true;
    } catch {}

    setStatus(online ? 'online' : 'offline');
    setChecking(false);
  };

  useEffect(() => {
    check();
    const interval = window.setInterval(check, 30000);
    return () => window.clearInterval(interval);
  }, []);

  const online = status === 'online';

  return <main className="compactMain">
    <section className="compactShell">
      <article className={'status compactStatus ' + status}>
        <div className="pulse">
          {status === 'checking'
            ? <RefreshCw className="spin"/>
            : online ? <CheckCircle2/> : <ServerCrash/>}
        </div>
        <div className="statusText">
          <span>STATUS ATUAL</span>
          <h2>{status === 'checking' ? 'Verificando…' : online ? 'Está online' : 'Ainda está fora do ar'}</h2>
          <p>{online
            ? 'O servidor respondeu. Você já pode tentar acessar o atendimento.'
            : 'Continuaremos verificando automaticamente enquanto esta página permanecer aberta.'}</p>
        </div>
        <button className="check" onClick={check} disabled={checking}>
          <RefreshCw className={checking ? 'spin' : ''} size={18}/>
          {checking ? 'Verificando' : 'Verificar agora'}
        </button>
      </article>
      <div className="url compactUrl">
        <span className={online ? 'dot green' : 'dot'}></span>
        <code>{TARGET}</code>
      </div>
    </section>
  </main>;
}
