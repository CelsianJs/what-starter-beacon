import { mount, useComputed, useEffect, useSignal } from 'what-framework';

const STORAGE='beacon-agenda';
const data=safeJson(decodeEntities(document.querySelector('#beacon-data')?.textContent||''))||{sessions:[],speakers:[]};
const fallback=new Map();

function AgendaIsland(){
  const storageStatus=useSignal('persistent');
  const topic=useSignal('all');
  const zone=useSignal(safeGet('beacon-zone',storageStatus)||'America/New_York');
  const saved=useSignal(normalizeIds(safeJson(safeGet(STORAGE,storageStatus))));
  const ics=useSignal('');
  const topics=['all',...new Set(data.sessions.map((session)=>session.topic))];
  const filtered=useComputed(()=>topic()==='all'?data.sessions:data.sessions.filter((session)=>session.topic===topic()));
  const calendar=useComputed(()=>makeIcs(data.sessions.filter((session)=>saved().includes(session.slug)),zone()));
  const days=useComputed(()=>groupByDay(filtered(),zone()));
  useEffect(()=>{safeSet(STORAGE,JSON.stringify(saved()),storageStatus);safeSet('beacon-zone',zone(),storageStatus);});
  function toggle(slug){saved(saved().includes(slug)?saved().filter((id)=>id!==slug):[...saved(),slug]);}
  function exportIcs(){ics(calendar());}
  return <>
    <div class="filter-row"><div class="filters">{topics.map((item)=><button type="button" aria-pressed={()=>topic()===item?'true':'false'} onClick={()=>topic(item)}>{item}</button>)}</div>
    <label>Timezone<select value={zone} onInput={(event)=>zone(event.target.value)}>{['America/New_York','Europe/London','America/Los_Angeles','Asia/Tokyo'].map((tz)=><option value={tz}>{tz}</option>)}</select></label></div>
    <p aria-live="polite">{()=>`${filtered().length} sessions shown · ${saved().length} saved`}</p>
    <p class="storage-note" hidden={()=>storageStatus()==='persistent'}>Storage is unavailable here. This tab keeps an in-memory agenda until it closes.</p>
    <div class="schedule">{()=>days().map(([dayLabel,daySessions])=><section class="day-group"><h2>{dayLabel}</h2>{daySessions.map((session)=><article class={()=>saved().includes(session.slug)?'session saved-session':'session'}><time datetime={session.starts}>{formatTime(session.starts,zone())}</time><div><p class="meta">{session.topic} · {session.room}</p><a class="session-title-link" href={`/sessions/${session.slug}`}><h3>{session.title}</h3><span>Details</span></a><p>{session.summary}</p></div><button type="button" onClick={()=>toggle(session.slug)}>{()=>saved().includes(session.slug)?'Saved':'Save'}</button></article>)}</section>)}</div>
    <button type="button" onClick={exportIcs}>Export ICS</button>
    <textarea id="ics-export" rows="10" readonly value={ics} placeholder="Save sessions, then export a valid VCALENDAR file." />
  </>;
}

function formatTime(value,timeZone){try{return new Intl.DateTimeFormat('en',{timeZone,month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(value));}catch{return 'Time unavailable';}}
function formatDay(value,timeZone){try{return new Intl.DateTimeFormat('en',{timeZone,month:'short',day:'numeric'}).format(new Date(value));}catch{return 'Day unavailable';}}
function groupByDay(items,timeZone){const groups=new Map();for(const session of items){const key=formatDay(session.starts,timeZone);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(session);}return [...groups.entries()];}
function makeIcs(items){
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Beacon Starter//EN'];
  for(const item of items){const start=stamp(new Date(item.starts));const end=stamp(new Date(new Date(item.starts).getTime()+item.minutes*60000));lines.push('BEGIN:VEVENT',`UID:${item.slug}@beacon.local`,`DTSTAMP:${start}`,`DTSTART:${start}`,`DTEND:${end}`,`SUMMARY:${escapeIcs(item.title)}`,`LOCATION:${escapeIcs(item.room)}`,`DESCRIPTION:${escapeIcs(item.summary)}`,'END:VEVENT');}
  lines.push('END:VCALENDAR');return lines.join('\r\n');
}
function stamp(date){return date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');}
function escapeIcs(value){return String(value).replace(/\\/g,'\\\\').replace(/,/g,'\\,').replace(/;/g,'\\;').replace(/\n/g,'\\n');}
function normalizeIds(value){return Array.isArray(value)?value.filter((id)=>data.sessions.some((session)=>session.slug===id)):[]}
function safeJson(value){try{return value?JSON.parse(value):null}catch{return null}}
function safeGet(key,status){try{return localStorage.getItem(key)}catch{status('memory');return fallback.get(key)||null}}
function safeSet(key,value,status){try{localStorage.setItem(key,value)}catch{status('memory');fallback.set(key,value)}}
function decodeEntities(value){const textarea=document.createElement('textarea');textarea.innerHTML=value;return textarea.value}
const host=document.querySelector('#agenda-island');if(host)mount(<AgendaIsland/>,host);
