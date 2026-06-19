const pages=[
 ['overview','Executive Overview'],['state','State Performance'],['types','Disaster Type Analysis'],['yearly','Yearly Trend'],['south','South India Focus'],['impact','Human Impact'],['damage','Damage & Homes'],['risk','Risk Score Matrix'],['records','Raw Data Explorer']
];
let DATA, filters={state:'All',type:'All',year:'All'}, current='overview';
const fmt=n=>Number(n||0).toLocaleString('en-IN');
const crore=n=>'₹ '+fmt(n)+' Cr';
const compact=n=>{n=Number(n||0); if(n>=1e7)return (n/1e7).toFixed(1)+' Cr'; if(n>=1e5)return (n/1e5).toFixed(1)+' L'; if(n>=1e3)return (n/1e3).toFixed(1)+' K'; return fmt(n)};
const colors=['#22d3ee','#a78bfa','#34d399','#fbbf24','#fb7185','#60a5fa','#f472b6','#2dd4bf','#c084fc','#f97316'];
function getFiltered(){return DATA.records.filter(r=>(filters.state==='All'||r.state===filters.state)&&(filters.type==='All'||r.type===filters.type)&&(filters.year==='All'||String(r.year)===filters.year));}
function sum(arr,k){return arr.reduce((a,b)=>a+(Number(b[k])||0),0)}
function group(arr,key,nums=['events','deaths','affected','damage','homes']){const m={};arr.forEach(r=>{const k=r[key];m[k]??={name:k};nums.forEach(n=>m[k][n]=(m[k][n]||0)+(Number(r[n])||0));});return Object.values(m)}
function byYear(arr){const m={};arr.forEach(r=>{const y=r.year;m[y]??={year:y,events:0,deaths:0,affected:0,damage:0,homes:0};['events','deaths','affected','damage','homes'].forEach(n=>m[y][n]+=Number(r[n])||0)});return Object.values(m).sort((a,b)=>a.year-b.year)}
function init(){fetch('./data/dashboard-data.json').then(r=>r.json()).then(d=>{DATA=d; setupNav(); setupFilters(); render();});}
function setupNav(){const nav=document.getElementById('nav');nav.innerHTML=pages.map((p,i)=>`<button class="nav-btn ${i==0?'active':''}" data-page="${p[0]}"><span>${String(i+1).padStart(2,'0')}</span>${p[1]}</button>`).join(''); nav.onclick=e=>{const b=e.target.closest('button'); if(!b)return; current=b.dataset.page; document.querySelectorAll('.nav-btn').forEach(x=>x.classList.toggle('active',x===b)); render();}}
function setupFilters(){const states=[...new Set(DATA.records.map(r=>r.state))].sort();const types=[...new Set(DATA.records.map(r=>r.type))].sort();const years=[...new Set(DATA.records.map(r=>r.year))].sort((a,b)=>a-b);fill('stateFilter',states);fill('typeFilter',types);fill('yearFilter',years);['state','type','year'].forEach(k=>document.getElementById(k+'Filter').onchange=e=>{filters[k]=e.target.value;render();});}
function fill(id,items){document.getElementById(id).innerHTML='<option value="All">All</option>'+items.map(x=>`<option value="${x}">${x}</option>`).join('')}
function kpis(arr){return `<div class="grid grid-4"><div class="card kpi"><div class="label">Events</div><div class="value">${fmt(sum(arr,'events'))}</div><div class="sub">Total disaster events</div></div><div class="card kpi"><div class="label">Deaths</div><div class="value">${fmt(sum(arr,'deaths'))}</div><div class="sub">Reported mortality</div></div><div class="card kpi"><div class="label">Affected</div><div class="value">${compact(sum(arr,'affected'))}</div><div class="sub">People affected</div></div><div class="card kpi"><div class="label">Damage</div><div class="value">${crore(sum(arr,'damage'))}</div><div class="sub">Damage in crore INR</div></div></div>`}
function render(){document.getElementById('pageTitle').textContent=pages.find(p=>p[0]===current)[1]; const arr=getFiltered(); const c=document.getElementById('content'); c.innerHTML=''; if(current==='overview') overview(c,arr); if(current==='state') statePage(c,arr); if(current==='types') typePage(c,arr); if(current==='yearly') yearlyPage(c,arr); if(current==='south') southPage(c,arr); if(current==='impact') impactPage(c,arr); if(current==='damage') damagePage(c,arr); if(current==='risk') riskPage(c,arr); if(current==='records') recordsPage(c,arr);}
function overview(c,arr){c.innerHTML=`${kpis(arr)}<div class="hero" style="margin-top:18px"><div class="card hero-panel"><div><p class="eyebrow">Executive command center</p><h2>India Disaster Intelligence Dashboard</h2><p>This frontend transforms the Excel disaster dataset into a Power BI-style analytics experience with filters, KPI cards, trend charts, state ranking, South India focus, and raw data exploration.</p></div><div class="pill-list"><span class="pill">${DATA.totals.india.states} States</span><span class="pill">${DATA.totals.india.records} Records</span><span class="pill">2014–2023 Trend</span><span class="pill">Python JSON Pipeline</span></div></div><div class="card"><div class="card-title"><h2>Key Insights</h2><span class="tag">Auto</span></div>${DATA.insights.map(i=>`<div class="insight"><span class="dot"></span><div><b>${i.title}</b><br><span style="color:var(--muted)">${i.text}</span></div></div>`).join('')}</div></div><div class="grid grid-2" style="margin-top:18px"><div class="card"><div class="card-title"><h2>Top States by Damage</h2></div><canvas class="chart" id="chart1"></canvas></div><div class="card"><div class="card-title"><h2>Yearly Damage Trend</h2></div><canvas class="chart" id="chart2"></canvas></div></div>`; barChart('chart1',DATA.topStates.damage.slice(0,8).map(x=>x.state),DATA.topStates.damage.slice(0,8).map(x=>x.damage),'Damage Cr'); lineChart('chart2',DATA.years.map(x=>x.year),DATA.years.map(x=>x.damage),'Damage Cr');}
function statePage(c,arr){let g=group(arr,'state').sort((a,b)=>b.damage-a.damage); c.innerHTML=`${kpis(arr)}<div class="grid grid-2" style="margin-top:18px"><div class="card"><div class="card-title"><h2>State Damage Ranking</h2></div><canvas class="chart tall" id="s1"></canvas></div><div class="card"><div class="card-title"><h2>State Event Ranking</h2></div><canvas class="chart tall" id="s2"></canvas></div></div><div class="card" style="margin-top:18px"><div class="card-title"><h2>State Summary Table</h2><span class="tag">${g.length} states</span></div>${table(g,['name','events','deaths','affected','homes','damage'])}</div>`; barChart('s1',g.slice(0,12).map(x=>x.name),g.slice(0,12).map(x=>x.damage),'Damage Cr'); barChart('s2',g.sort((a,b)=>b.events-a.events).slice(0,12).map(x=>x.name),g.sort((a,b)=>b.events-a.events).slice(0,12).map(x=>x.events),'Events');}
function typePage(c,arr){let g=group(arr,'type').sort((a,b)=>b.events-a.events); c.innerHTML=`${kpis(arr)}<div class="grid grid-3" style="margin-top:18px"><div class="card"><div class="card-title"><h2>Events by Type</h2></div><canvas class="chart" id="t1"></canvas></div><div class="card"><div class="card-title"><h2>Damage by Type</h2></div><canvas class="chart" id="t2"></canvas></div><div class="card"><div class="card-title"><h2>Deaths by Type</h2></div><canvas class="chart" id="t3"></canvas></div></div><div class="card" style="margin-top:18px"><div class="card-title"><h2>Type Insights</h2></div>${g.map(x=>progress(x.name,x.damage,Math.max(...g.map(y=>y.damage)),crore(x.damage))).join('')}</div>`; doughnut('t1',g.map(x=>x.name),g.map(x=>x.events)); barChart('t2',g.map(x=>x.name),g.map(x=>x.damage),'Damage Cr'); barChart('t3',g.map(x=>x.name),g.map(x=>x.deaths),'Deaths');}
function yearlyPage(c,arr){let y=byYear(arr); c.innerHTML=`${kpis(arr)}<div class="grid grid-2" style="margin-top:18px"><div class="card"><div class="card-title"><h2>Total Events by Year</h2></div><canvas class="chart" id="y1"></canvas></div><div class="card"><div class="card-title"><h2>People Affected Trend</h2></div><canvas class="chart" id="y2"></canvas></div><div class="card"><div class="card-title"><h2>Deaths Trend</h2></div><canvas class="chart" id="y3"></canvas></div><div class="card"><div class="card-title"><h2>Damage Trend</h2></div><canvas class="chart" id="y4"></canvas></div></div>`; lineChart('y1',y.map(x=>x.year),y.map(x=>x.events),'Events'); lineChart('y2',y.map(x=>x.year),y.map(x=>x.affected),'Affected'); lineChart('y3',y.map(x=>x.year),y.map(x=>x.deaths),'Deaths'); lineChart('y4',y.map(x=>x.year),y.map(x=>x.damage),'Damage Cr');}
function southPage(c,arr){let sr=arr.filter(r=>r.south==='Yes'), st=group(sr,'state'), ty=group(sr,'type'); c.innerHTML=`${kpis(sr)}<div class="grid grid-2" style="margin-top:18px"><div class="card"><div class="card-title"><h2>South India States by Damage</h2></div><canvas class="chart" id="so1"></canvas></div><div class="card"><div class="card-title"><h2>South Disaster Type Split</h2></div><canvas class="chart" id="so2"></canvas></div></div><div class="card" style="margin-top:18px"><div class="card-title"><h2>South India Performance Cards</h2></div><div class="matrix">${st.map(s=>`<div class="state-card"><strong>${s.name}</strong><small>${fmt(s.events)} events • ${crore(s.damage)}</small><div class="risk">${compact(s.affected)}</div><small>people affected</small></div>`).join('')}</div></div>`; barChart('so1',st.map(x=>x.name),st.map(x=>x.damage),'Damage Cr'); doughnut('so2',ty.map(x=>x.name),ty.map(x=>x.events));}
function impactPage(c,arr){let st=group(arr,'state').sort((a,b)=>b.affected-a.affected); let ty=group(arr,'type').sort((a,b)=>b.deaths-a.deaths); c.innerHTML=`${kpis(arr)}<div class="grid grid-2" style="margin-top:18px"><div class="card"><div class="card-title"><h2>People Affected by State</h2></div><canvas class="chart tall" id="i1"></canvas></div><div class="card"><div class="card-title"><h2>Deaths by Disaster Type</h2></div><canvas class="chart tall" id="i2"></canvas></div></div><div class="card" style="margin-top:18px"><div class="card-title"><h2>Highest Affected States</h2></div>${st.slice(0,10).map(x=>progress(x.name,x.affected,st[0].affected,compact(x.affected))).join('')}</div>`; barChart('i1',st.slice(0,12).map(x=>x.name),st.slice(0,12).map(x=>x.affected),'Affected'); barChart('i2',ty.map(x=>x.name),ty.map(x=>x.deaths),'Deaths');}
function damagePage(c,arr){let st=group(arr,'state').sort((a,b)=>b.damage-a.damage); c.innerHTML=`${kpis(arr)}<div class="grid grid-2" style="margin-top:18px"><div class="card"><div class="card-title"><h2>Homes Destroyed by State</h2></div><canvas class="chart" id="d1"></canvas></div><div class="card"><div class="card-title"><h2>Damage vs Homes</h2></div><canvas class="chart" id="d2"></canvas></div></div><div class="card" style="margin-top:18px"><div class="card-title"><h2>Damage Ranking</h2></div>${st.slice(0,12).map(x=>progress(x.name,x.damage,st[0].damage,crore(x.damage))).join('')}</div>`; barChart('d1',st.slice(0,12).map(x=>x.name),st.slice(0,12).map(x=>x.homes),'Homes'); scatter('d2',st.slice(0,18));}
function riskPage(c,arr){let g=group(arr,'state'); const max={events:Math.max(...g.map(x=>x.events)),deaths:Math.max(...g.map(x=>x.deaths)),affected:Math.max(...g.map(x=>x.affected)),damage:Math.max(...g.map(x=>x.damage))}; g.forEach(s=>s.riskScore=Math.round(100*(.25*s.events/max.events+.25*s.deaths/max.deaths+.25*s.affected/max.affected+.25*s.damage/max.damage))); g.sort((a,b)=>b.riskScore-a.riskScore); c.innerHTML=`${kpis(arr)}<div class="card" style="margin-top:18px"><div class="card-title"><h2>Composite Risk Score Matrix</h2><span class="tag">0–100</span></div><div class="matrix">${g.map(s=>`<div class="state-card"><strong>${s.name}</strong><small>${fmt(s.events)} events • ${crore(s.damage)}</small><div class="risk">${s.riskScore}</div>${progress('',s.riskScore,100,s.riskScore+'%',true)}</div>`).join('')}</div><p class="footer-note">Risk score is a normalized blend of events, deaths, affected people, and damage.</p></div>`;}
function recordsPage(c,arr){c.innerHTML=`${kpis(arr)}<div class="card" style="margin-top:18px"><div class="card-title"><h2>Filtered Raw Records</h2><span class="tag">${arr.length} rows</span></div>${table(arr.slice(0,250),['id','state','region','type','year','events','deaths','injured','affected','homes','damage','south'])}</div>`;}
function table(rows,cols){return `<div class="table-wrap"><table class="data-table"><thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${typeof r[c]==='number'?fmt(r[c]):(r[c]??'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
function progress(name,val,max,label,mini=false){return `<div class="progress-row">${mini?'':`<div class="meta"><span>${name}</span><b>${label}</b></div>`}<div class="bar-bg"><div class="bar-fill" style="width:${Math.max(2,(val/max)*100)}%"></div></div></div>`}
function setupCanvas(id){const c=document.getElementById(id),dpr=window.devicePixelRatio||1; const box=c.getBoundingClientRect(); c.width=box.width*dpr; c.height=box.height*dpr; const ctx=c.getContext('2d'); ctx.scale(dpr,dpr); ctx.clearRect(0,0,box.width,box.height); return {c,ctx,w:box.width,h:box.height};}
function barChart(id,labels,values,label){const {ctx,w,h}=setupCanvas(id); const pad=45, max=Math.max(...values,1); const bw=(w-pad*2)/values.length*.68; ctx.font='12px Inter'; ctx.fillStyle='#8fa8c8'; for(let i=0;i<labels.length;i++){let x=pad+i*((w-pad*2)/values.length)+bw*.25; let bh=(h-pad*2)*(values[i]/max); let y=h-pad-bh; let grad=ctx.createLinearGradient(0,y,0,h-pad);grad.addColorStop(0,colors[i%colors.length]);grad.addColorStop(1,'rgba(34,211,238,.25)'); ctx.fillStyle=grad; roundRect(ctx,x,y,bw,bh,8,true); ctx.fillStyle='#8fa8c8'; ctx.save(); ctx.translate(x+bw/2,h-25); ctx.rotate(-.55); ctx.fillText(String(labels[i]).slice(0,14),0,0); ctx.restore(); } axis(ctx,w,h,pad); ctx.fillStyle='#cfefff'; ctx.fillText(label,10,18);}
function lineChart(id,labels,values,label){const {ctx,w,h}=setupCanvas(id); const pad=45, max=Math.max(...values,1), min=Math.min(...values,0); axis(ctx,w,h,pad); ctx.strokeStyle='#22d3ee'; ctx.lineWidth=3; ctx.beginPath(); labels.forEach((l,i)=>{let x=pad+i*(w-pad*2)/(labels.length-1||1); let y=h-pad-((values[i]-min)/(max-min||1))*(h-pad*2); i?ctx.lineTo(x,y):ctx.moveTo(x,y);}); ctx.stroke(); labels.forEach((l,i)=>{let x=pad+i*(w-pad*2)/(labels.length-1||1); let y=h-pad-((values[i]-min)/(max-min||1))*(h-pad*2); ctx.fillStyle='#a78bfa'; ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#8fa8c8'; ctx.fillText(l,x-12,h-20);}); ctx.fillStyle='#cfefff'; ctx.fillText(label,10,18);}
function doughnut(id,labels,values){const {ctx,w,h}=setupCanvas(id); const cx=w/2,cy=h/2-5,r=Math.min(w,h)/3; let sumv=sum(values.map(v=>({v})),'v'),start=-Math.PI/2; values.forEach((v,i)=>{let a=v/sumv*Math.PI*2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.fillStyle=colors[i%colors.length]; ctx.arc(cx,cy,r,start,start+a); ctx.fill(); start+=a;}); ctx.fillStyle='#122a49'; ctx.beginPath(); ctx.arc(cx,cy,r*.56,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#eef6ff'; ctx.textAlign='center'; ctx.font='800 24px Inter'; ctx.fillText(fmt(sumv),cx,cy+8); ctx.textAlign='left'; ctx.font='12px Inter'; labels.forEach((l,i)=>{let x=18+(i%2)*150,y=h-70+Math.floor(i/2)*20; ctx.fillStyle=colors[i%colors.length]; ctx.fillRect(x,y-9,10,10); ctx.fillStyle='#8fa8c8'; ctx.fillText(l,x+16,y);});}
function scatter(id,rows){const {ctx,w,h}=setupCanvas(id); const pad=50, maxX=Math.max(...rows.map(r=>r.homes),1),maxY=Math.max(...rows.map(r=>r.damage),1); axis(ctx,w,h,pad); rows.forEach((r,i)=>{let x=pad+(r.homes/maxX)*(w-pad*2), y=h-pad-(r.damage/maxY)*(h-pad*2); ctx.fillStyle=colors[i%colors.length]; ctx.globalAlpha=.85; ctx.beginPath(); ctx.arc(x,y,7,0,Math.PI*2); ctx.fill();}); ctx.globalAlpha=1; ctx.fillStyle='#cfefff'; ctx.fillText('X: Homes Destroyed / Y: Damage',10,18);}
function axis(ctx,w,h,p){ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p,p);ctx.lineTo(p,h-p);ctx.lineTo(w-p,h-p);ctx.stroke(); for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(p,p+i*(h-2*p)/5);ctx.lineTo(w-p,p+i*(h-2*p)/5);ctx.stroke();}}
function roundRect(ctx,x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect(x,y,w,h,r); if(fill)ctx.fill();}

// ===================== Serii AI Bot =====================
// Serii now uses Puter.js AI: no API key is stored in this frontend project.
const SERII_PROVIDER = 'puter.js';
let SERII_HISTORY = [];

function initSeriiBot(){
  if(document.getElementById('seriiLauncher')) return;
  const launcher=document.createElement('button');
  launcher.id='seriiLauncher';
  launcher.className='serii-launcher';
  launcher.innerHTML='<span class="serii-avatar">✦</span><span>Ask Serii</span>';
  const panel=document.createElement('section');
  panel.id='seriiPanel';
  panel.className='serii-panel';
  panel.innerHTML=`
    <div class="serii-head">
      <div class="serii-title"><div class="serii-logo">S</div><div><strong>Serii AI Bot</strong><small>Ask about this disaster dashboard data</small></div></div>
      <button class="serii-close" id="seriiClose" title="Close">×</button>
    </div>
    <div class="serii-messages" id="seriiMessages"></div>
    <div class="serii-suggestions" id="seriiSuggestions">
      <button class="serii-chip">Which state has highest damage?</button>
      <button class="serii-chip">Explain South India trends</button>
      <button class="serii-chip">Top disaster type by deaths?</button>
    </div>
    <form class="serii-form" id="seriiForm">
      <input id="seriiInput" type="text" placeholder="Ask Serii about events, deaths, damage, trends..." autocomplete="off" />
      <button type="submit">Send</button>
    </form>
    <div class="serii-status" id="seriiStatus">Powered by Puter.js AI + local dashboard dataset</div>`;
  document.body.appendChild(launcher);
  document.body.appendChild(panel);
  launcher.addEventListener('click',()=>{panel.classList.toggle('open'); if(panel.classList.contains('open')) document.getElementById('seriiInput').focus();});
  panel.querySelector('#seriiClose').addEventListener('click',()=>panel.classList.remove('open'));
  panel.querySelector('#seriiForm').addEventListener('submit',async e=>{e.preventDefault(); const input=document.getElementById('seriiInput'); const q=input.value.trim(); if(!q)return; input.value=''; await askSerii(q);});
  panel.querySelector('#seriiSuggestions').addEventListener('click',async e=>{const btn=e.target.closest('button'); if(btn) await askSerii(btn.textContent.trim());});
  addSeriiMessage('bot','Hi, I am Serii. Ask me anything about this India Disaster Management dashboard. I can answer from the loaded dataset, filters, trends, states, disaster types, damage, deaths, and South India focus.');
}

function seriiDataSummary(){
  const filtered = DATA ? getFiltered() : [];
  const stateGroups = group(filtered,'state').sort((a,b)=>b.damage-a.damage).slice(0,8);
  const typeGroups = group(filtered,'type').sort((a,b)=>b.deaths-a.deaths);
  const yearGroups = byYear(filtered);
  const totals = {
    records: filtered.length,
    events: sum(filtered,'events'),
    deaths: sum(filtered,'deaths'),
    injured: sum(filtered,'injured'),
    affected: sum(filtered,'affected'),
    homes: sum(filtered,'homes'),
    damage: sum(filtered,'damage')
  };
  return JSON.stringify({
    activePage: pages.find(p=>p[0]===current)?.[1] || current,
    activeFilters: filters,
    totals,
    topStatesByDamage: stateGroups,
    disasterTypesByDeaths: typeGroups,
    yearlyTrend: yearGroups,
    southIndiaTotals: DATA?.totals?.southIndia,
    indiaTotals: DATA?.totals?.india,
    datasetFields: ['state','region','type','year','events','deaths','injured','affected','homes','damage','south']
  }, null, 2);
}

function addSeriiMessage(role,text){
  const box=document.getElementById('seriiMessages'); if(!box) return;
  const msg=document.createElement('div'); msg.className='serii-msg '+(role==='user'?'user':'bot'); msg.textContent=text;
  box.appendChild(msg); box.scrollTop=box.scrollHeight;
}
function setSeriiStatus(text,isError=false){const el=document.getElementById('seriiStatus'); if(el){el.textContent=text; el.classList.toggle('error',!!isError);}}

async function askSerii(question){
  addSeriiMessage('user',question);
  const thinking=document.createElement('div'); thinking.className='serii-msg bot'; thinking.textContent='Serii is analyzing the dashboard data...';
  document.getElementById('seriiMessages').appendChild(thinking);
  document.getElementById('seriiMessages').scrollTop=document.getElementById('seriiMessages').scrollHeight;
  setSeriiStatus('Thinking with Puter.js AI...');
  try{
    const answer = await callSeriiPuter(question);
    thinking.textContent = answer;
    SERII_HISTORY.push({role:'user',text:question},{role:'model',text:answer});
    SERII_HISTORY = SERII_HISTORY.slice(-8);
    setSeriiStatus('Powered by Puter.js AI + local dashboard dataset');
  }catch(err){
    const fallback = seriiLocalFallback(question);
    thinking.textContent = fallback + '\n\nPuter.js AI failed or was blocked. Most common fixes: check internet connection, allow the Puter login popup if shown, refresh the page, or try again. Detail: ' + (err?.message || 'Unknown error');
    setSeriiStatus('Puter.js AI failed; showing local fallback answer',true);
  }
}

async function callSeriiPuter(question){
  if(!window.puter || !puter.ai || !puter.ai.chat){
    throw new Error('Puter.js is not loaded. Check internet connection or the script tag in index.html.');
  }
  const systemText=`You are Serii, a helpful AI assistant embedded inside an India Disaster Management analytics dashboard. Answer only using the dashboard dataset summary provided. If the user asks outside the dataset, politely redirect to disaster analytics. Be concise, professional, and use INR crore, Indian number style, and clear bullet points when useful.`;
  const historyText=SERII_HISTORY.map(h=>`${h.role}: ${h.text}`).join('\n').slice(-3000);
  const prompt=`${systemText}\n\nDashboard data context JSON:\n${seriiDataSummary()}\n\nRecent chat:\n${historyText}\n\nUser question: ${question}\n\nAnswer as Serii using the dashboard data.`;
  const response = await puter.ai.chat(prompt);
  if(typeof response === 'string') return response.trim();
  const text = response?.message?.content || response?.text || response?.content || response?.output_text || '';
  if(Array.isArray(text)){
    return text.map(part => part?.text || part?.content || '').join('\n').trim();
  }
  if(typeof text === 'string' && text.trim()) return text.trim();
  if(response && typeof response === 'object'){
    const fallback = JSON.stringify(response);
    if(fallback && fallback !== '{}') return fallback;
  }
  throw new Error('No text response returned from Puter.js AI');
}

function seriiLocalFallback(question){
  const q=question.toLowerCase();
  const arr=getFiltered();
  const states=group(arr,'state');
  const types=group(arr,'type');
  const totals={events:sum(arr,'events'),deaths:sum(arr,'deaths'),affected:sum(arr,'affected'),damage:sum(arr,'damage'),homes:sum(arr,'homes')};
  if(q.includes('damage')){
    const top=states.sort((a,b)=>b.damage-a.damage)[0];
    return `Based on the loaded dashboard data, ${top?.name || 'the top state'} has the highest damage with ${crore(top?.damage || 0)}. Total filtered damage is ${crore(totals.damage)}.`;
  }
  if(q.includes('death')||q.includes('deaths')){
    const topType=types.sort((a,b)=>b.deaths-a.deaths)[0];
    return `Based on the loaded data, ${topType?.name || 'the top disaster type'} has the highest deaths with ${fmt(topType?.deaths || 0)} deaths. Total filtered deaths are ${fmt(totals.deaths)}.`;
  }
  if(q.includes('south')){
    const s=DATA.totals.southIndia;
    return `South India focus summary: ${fmt(s.events)} events, ${fmt(s.deaths)} deaths, ${compact(s.affected)} people affected, ${fmt(s.homes)} homes destroyed, and ${crore(s.damage)} damage across ${s.states} states.`;
  }
  if(q.includes('year')||q.includes('trend')){
    const y=byYear(arr).sort((a,b)=>b.damage-a.damage)[0];
    return `Trend summary: the highest damage year in the current filter is ${y?.year} with ${crore(y?.damage || 0)}. Total filtered events are ${fmt(totals.events)}.`;
  }
  return `Dashboard summary for the current filters: ${fmt(totals.events)} events, ${fmt(totals.deaths)} deaths, ${compact(totals.affected)} people affected, ${fmt(totals.homes)} homes destroyed, and ${crore(totals.damage)} damage. Ask me about top state, disaster type, South India, yearly trend, deaths, or damage.`;
}

// Initialize Serii after data/dashboard UI is ready.
const originalInit = init;
init = function(){fetch('./data/dashboard-data.json').then(r=>r.json()).then(d=>{DATA=d; setupNav(); setupFilters(); render(); initSeriiBot();});};


init();
