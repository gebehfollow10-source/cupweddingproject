 "use client";
import {useEffect,useMemo,useState} from "react";

const months=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const days=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

export default function Home(){
 const [groom,setGroom]=useState("Rizky Pratama"),[bride,setBride]=useState("Alya Maharani");
 const [date,setDate]=useState("2026-12-20"),[time,setTime]=useState("10:00"),[venue,setVenue]=useState("Gedung Graha Cinta");
 const [address,setAddress]=useState("Jl. Melati No. 123, Yogyakarta"),[maps,setMaps]=useState("https://maps.google.com");
 const [parentsG,setParentsG]=useState("Bapak & Ibu Keluarga Pratama"),[parentsB,setParentsB]=useState("Bapak & Ibu Keluarga Maharani");
 const [quote,setQuote]=useState("Dengan penuh kebahagiaan, kami mengundang Anda untuk menjadi bagian dari hari istimewa kami.");
 const [theme,setTheme]=useState("classic"),[color,setColor]=useState("#8b5e5e"),[photo,setPhoto]=useState("");
 const [open,setOpen]=useState(false),[rsvp,setRsvp]=useState("");

 const target=useMemo(()=>new Date(`${date}T${time}:00`),[date,time]);
 const [left,setLeft]=useState({d:0,h:0,m:0,s:0});
 useEffect(()=>{const tick=()=>{let x=Math.max(0,target-new Date());setLeft({d:Math.floor(x/86400000),h:Math.floor(x%86400000/3600000),m:Math.floor(x%3600000/60000),s:Math.floor(x%60000/1000)});};tick();const i=setInterval(tick,1000);return()=>clearInterval(i)},[target]);

 const dt=new Date(`${date}T00:00:00`);
 const day=days[dt.getDay()], displayDate=`${day}, ${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
 const initials=`${groom.split(" ")[0]} & ${bride.split(" ")[0]}`;

 function upload(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setPhoto(r.result);r.readAsDataURL(f)}
 function wa(){if(!rsvp)return;window.open(`https://wa.me/?text=${encodeURIComponent(`Halo, saya ${rsvp} akan hadir di pernikahan ${initials}.`)}`,"_blank")}
 return <main style={{"--accent":color}}>
  <header className="top"><div><span className="badge">DEMO / FIKTIF</span><h1>CupzWedding</h1><p>Generator undangan pernikahan digital — siap GitHub + Vercel.</p></div><button className="btn" onClick={()=>setOpen(true)}>Buka Undangan</button></header>
  <div className="layout">
   <aside className="editor">
    <h2>Pengaturan</h2>
    {[["Nama Mempelai Pria",groom,setGroom],["Nama Mempelai Wanita",bride,setBride],["Lokasi",venue,setVenue],["Alamat",address,setAddress],["Link Google Maps",maps,setMaps],["Orang Tua Pria",parentsG,setParentsG],["Orang Tua Wanita",parentsB,setParentsB]].map(([l,v,s])=><label key={l}>{l}<input value={v} onChange={e=>s(e.target.value)}/></label>)}
    <div className="two"><label>Tanggal<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><label>Jam<input type="time" value={time} onChange={e=>setTime(e.target.value)}/></label></div>
    <label>Foto Pengantin<input type="file" accept="image/*" onChange={upload}/></label>
    <label>Quote / Pesan<textarea value={quote} onChange={e=>setQuote(e.target.value)}/></label>
    <div className="two"><label>Warna<input type="color" value={color} onChange={e=>setColor(e.target.value)}/></label><label>Tema<select value={theme} onChange={e=>setTheme(e.target.value)}><option value="classic">Classic</option><option value="modern">Modern</option><option value="floral">Floral</option></select></label></div>
    <div className="hint">Countdown mengikuti tanggal & jam di atas. Foto diproses lokal di browser.</div>
   </aside>
   <section className="preview">
    <div className="previewbar"><b>Live Preview</b><span>{displayDate}</span></div>
    <article className={`invite ${theme}`}>
      <div className="cover"><small>THE WEDDING OF</small><h2>{initials}</h2>{photo?<img className="photo" src={photo}/>:<div className="placeholder">Foto Pengantin</div>}<p>{displayDate}</p><button className="ghost" onClick={()=>setOpen(true)}>Buka Undangan</button></div>
      <section className="section"><p className="quote">“{quote}”</p><p>Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami.</p><h3>{groom} & {bride}</h3><p>{parentsG}<br/>&<br/>{parentsB}</p></section>
      <section className="count"><small>COUNTDOWN TO OUR WEDDING</small><div className="countgrid">{[[left.d,"Hari"],[left.h,"Jam"],[left.m,"Menit"],[left.s,"Detik"]].map(x=><div key={x[1]}><b>{String(x[0]).padStart(2,"0")}</b><span>{x[1]}</span></div>)}</div></section>
      <section className="event"><small>SAVE THE DATE</small><h3>{day.toUpperCase()}</h3><strong>{dt.getDate()}</strong><h4>{months[dt.getMonth()].toUpperCase()} {dt.getFullYear()}</h4><p>{time} WIB</p><hr/><h3>{venue}</h3><p>{address}</p><a className="btn" href={maps} target="_blank">Lihat Lokasi</a></section>
      <section className="section"><h3>RSVP</h3><p>Konfirmasi kehadiran</p><input className="rsvp" placeholder="Nama Anda" value={rsvp} onChange={e=>setRsvp(e.target.value)}/><button className="btn" onClick={wa}>Konfirmasi via WhatsApp</button><h3>Terima Kasih</h3><b>{initials}</b></section>
      <footer>Undangan — CupzWedding</footer>
    </article>
   </section>
  </div>
  {open&&<div className="modal"><div className="modalbox"><button className="close" onClick={()=>setOpen(false)}>×</button><div className="heart">♡</div><small>THE WEDDING OF</small><h2>{initials}</h2><p>{displayDate}</p><button className="btn" onClick={()=>setOpen(false)}>Lihat Undangan</button></div></div>}
 </main>
}