import { mount, useComputed, useEffect, useSignal } from 'what-framework';
import { makeIcs } from '../calendar.mjs';

const STORAGE='beacon-agenda';
const data=safeJson(decodeEntities(document.querySelector('#beacon-data')?.textContent||''))||{sessions:[],speakers:[]};
const fallback=new Map();

function AgendaIsland(){
  const storageStatus=useSignal('persistent');
  const topic=useSignal('all');
  const zone=useSignal(safeGet('beacon-zone',storageStatus)||'America/New_York');
  const saved=useSignal(normalizeIds(safeJson(safeGet(STORAGE,storageStatus))));
  const selected=data.sessions.find(session=>session.slug===new URLSearchParams(location.search).get('session'));
  const savedOnly=useSignal(false);
  const ics=useSignal('');
  const topics=['all',...new Set(data.sessions.map((session)=>session.topic))];
  const filtered=useComputed(()=>data.sessions.filter(session=>(topic()==='all'||session.topic===topic())&&(!savedOnly()||saved().includes(session.slug))));
  const calendar=useComputed(()=>makeIcs(data.sessions.filter((session)=>saved().includes(session.slug))));
  const days=useComputed(()=>groupByDay(filtered(),zone()));
  useEffect(()=>{safeSet(STORAGE,JSON.stringify(saved()),storageStatus);safeSet('beacon-zone',zone(),storageStatus);});
  function toggle(slug){saved(saved().includes(slug)?saved().filter((id)=>id!==slug):[...saved(),slug]);ics('');}
  function exportIcs(){
    const text=calendar();ics(text);
    const url=URL.createObjectURL(new Blob([text],{type:'text/calendar;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='beacon-agenda.ics';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <>
    {selected?<div class="selected-session"><p>Selected: <a href={`/sessions/${selected.slug}`}>{selected.title}</a></p><button type="button" onClick={()=>{if(!saved().includes(selected.slug))saved([...saved(),selected.slug]);}}>{()=>saved().includes(selected.slug)?'Session saved':'Save selected session'}</button></div>:null}
    <div class="filter-row"><div class="filters">{topics.map((item)=><button type="button" aria-pressed={()=>topic()===item?'true':'false'} onClick={()=>topic(item)}>{item}</button>)}</div>
    <label>Timezone<select value={zone} onInput={(event)=>zone(event.target.value)}>{['America/New_York','Europe/London','America/Los_Angeles','Asia/Tokyo'].map((tz)=><option value={tz}>{tz}</option>)}</select></label></div>
    <p aria-live="polite">{()=>`${filtered().length} sessions shown · ${saved().length} saved`}</p>
    <button type="button" aria-pressed={()=>savedOnly()?'true':'false'} onClick={()=>savedOnly(!savedOnly())}>{()=>savedOnly()?'Show all sessions':'Show saved agenda'}</button>
    {()=>filtered().length===0?<p>No sessions in this view. Show all sessions or choose another topic.</p>:null}
    <p class="storage-note" hidden={()=>storageStatus()==='persistent'}>Storage is unavailable here. This tab keeps an in-memory agenda until it closes.</p>
    <div class="schedule">{()=>days().map(([dayLabel,daySessions])=><section class="day-group"><h2>{dayLabel}</h2>{daySessions.map((session)=><article class={()=>saved().includes(session.slug)?'session saved-session':'session'}><time datetime={session.starts}>{formatTime(session.starts,zone())}</time><div><p class="meta">{session.topic} · {session.room}</p><a class="session-title-link" href={`/sessions/${session.slug}`}><h3>{session.title}</h3><span>Details</span></a><p>{session.summary}</p></div><button type="button" onClick={()=>toggle(session.slug)}>{()=>saved().includes(session.slug)?'Saved':'Save'}</button></article>)}</section>)}</div>
    <button type="button" onClick={exportIcs}>Export ICS</button>
    <p aria-live="polite">{()=>ics()?'Calendar prepared for download. The local preview is below.':'Save sessions before exporting a personal calendar.'}</p>
    <label for="ics-export">Calendar preview (ICS)</label>
    <textarea id="ics-export" rows="10" readonly value={ics} placeholder="Save sessions, then export a valid VCALENDAR file." />
  </>;
}

function formatTime(value,timeZone){try{return new Intl.DateTimeFormat('en',{timeZone,month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(value));}catch{return 'Time unavailable';}}
function formatDay(value,timeZone){try{return new Intl.DateTimeFormat('en',{timeZone,month:'short',day:'numeric'}).format(new Date(value));}catch{return 'Day unavailable';}}
function groupByDay(items,timeZone){const groups=new Map();for(const session of items){const key=formatDay(session.starts,timeZone);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(session);}return [...groups.entries()];}
function normalizeIds(value){return Array.isArray(value)?value.filter((id)=>data.sessions.some((session)=>session.slug===id)):[]}
function safeJson(value){try{return value?JSON.parse(value):null}catch{return null}}
function safeGet(key,status){try{return localStorage.getItem(key)}catch{status('memory');return fallback.get(key)||null}}
function safeSet(key,value,status){try{localStorage.setItem(key,value)}catch{status('memory');fallback.set(key,value)}}
function decodeEntities(value){const textarea=document.createElement('textarea');textarea.innerHTML=value;return textarea.value}
const host=document.querySelector('#agenda-island');if(host)mount(<AgendaIsland/>,host);
