 "use client";
import {useEffect,useMemo,useState} from "react";

const months=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const days=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

export default function Home(){
 const [form,setForm]=useState({
  groom:"Rizky Pratama",bride:"Alya Maharani",date:"2026-12-20",time:"10:00",
  venue:"Gedung Graha Cinta",address:"Jl. Melati No. 123, Yogyakarta",
  maps:"https://maps.google.com",parentsG:"Bapak & Ibu Keluarga Pratama",
  parentsB:"Bapak & Ibu Keluarga Maharani",
  quote:"Dengan penuh kebahagiaan, kami mengundang Anda untuk menjadi bagian dari hari istimewa kami.",
  theme:"classic",color:"#8b5e5e"
 });
 const [photo,setPhoto]=useState("");
 const [generated,setGenerated]=useState(true);
 const [open,setOpen]=useState(false);
 const [rsvp,setRsvp]=useState("");
 const [copied,setCopied]=useState(false);

 const set=(k,v)=>setForm(x=>({...x,[k]:v}));
 const target=useMemo(()=>new Date(`${form.date}T${form.time}:00`),[form.date,form.time]);
 const [left,setLeft]=useState({d:0,h:0,m:0,s:0});

 useEffect(()=>{
  const tick=()=>{let x=Math.max(0,target-new Date());setLeft({d:Math.floor(x/86400000),h:Math.floor(x%86400000/3600000),m:Math.floor(x%3600000/60000),s:Math.floor(x%60000/1000)});}
  tick();const i=setInterval(tick,1000);return()=>clearInterval(i)
 },[target]);

 const dt=new Date(`${form.date}T00:00:00`);
 const day=days[dt.getDay()];
 const displayDate=`${day}, ${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
 const initials=`${form.groom.split(" ")[0]} & ${form.bride.split(" ")[0]}`;

 function upload(e){
  const f=e.target.files?.[0]; if(!f)return;
  const r=new FileReader(); r.onload=()=>setPhoto(r.result); r.readAsDataURL(f);
 }
 function reset(){setForm({groom:"Rizky Pratama",bride:"Alya Maharani",date:"2026-12-20",time:"10:00",venue:"Gedung Graha Cinta",address:"Jl. Melati No. 123, Yogyakarta",maps:"https://maps.google.com",parentsG:"Bapak & Ibu Keluarga Pratama",parentsB:"Bapak & Ibu Keluarga Maharani",quote:"Dengan penuh kebahagiaan, kami mengundang Anda untuk menjadi bagian dari hari istimewa kami.",theme:"classic",color:"#8b5e5e"});setPhoto("");setGenerated(false)}
 function wa(){if(!rsvp)return;window.open(`https://wa.me/?text=${encodeURIComponent(`Halo, saya ${rsvp} akan hadir di pernikahan ${initials}.`)}`,"_blank")}
 function downloadHTML(){
  const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const img=photo?`<img class="photo" src="${photo}" alt="Foto pengantin">`:`<div class="photo placeholder">Foto Pengantin</div>`;
  const html=`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Undangan ${esc(initials)}</title><style>
  body{margin:0;background:#eee9e5;font-family:Arial,sans-serif;color:#332c29}.card{max-width:720px;margin:auto;background:#faf5f1;text-align:center;overflow:hidden}.cover{min-height:100vh;padding:50px 20px;display:flex;flex-direction:column;justify-content:center;align-items:center;background:linear-gradient(145deg,#fbf2ec,#eadbd3)}h1,h2,h3{font-family:Georgia,serif}.cover h1{font-size:54px;color:${form.color}}.photo{width:290px;height:340px;object-fit:cover;border-radius:150px 150px 18px 18px;margin:25px 0;border:7px solid #fff}.placeholder{display:grid;place-items:center;background:#d8c9c1;color:#756762}.sec{padding:60px 25px;line-height:1.8}.quote{font:italic 18px Georgia,serif;color:${form.color}}.count{padding:40px 15px;background:#f3e8e3}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:540px;margin:20px auto}.grid div{background:#fff;padding:15px;border-radius:12px}.grid b{display:block;font:32px Georgia,serif;color:${form.color}}.event{margin:0 25px 50px;padding:45px 20px;background:#fff;border:1px solid #dac3bb}.event strong{display:block;font:80px Georgia,serif;color:${form.color}}a,button{background:${form.color};color:#fff;padding:11px 16px;border:0;border-radius:12px;text-decoration:none;font-weight:bold}.small{letter-spacing:3px;font-size:10px}</style></head><body><article class="card"><section class="cover"><span class="small">THE WEDDING OF</span><h1>${esc(initials)}</h1>${img}<p>${esc(displayDate)}</p></section><section class="sec"><p class="quote">“${esc(form.quote)}”</p><p>Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami.</p><h2>${esc(form.groom)} & ${esc(form.bride)}</h2><p>${esc(form.parentsG)}<br>&<br>${esc(form.parentsB)}</p></section><section class="count"><span class="small">COUNTDOWN TO OUR WEDDING</span><div class="grid"><div><b id="d">0</b>Hari</div><div><b id="h">0</b>Jam</div><div><b id="m">0</b>Menit</div><div><b id="s">0</b>Detik</div></div></section><section class="event"><span class="small">SAVE THE DATE</span><h2>${esc(day.toUpperCase())}</h2><strong>${dt.getDate()}</strong><h3>${months[dt.getMonth()].toUpperCase()} ${dt.getFullYear()}</h3><p>${esc(form.time)} WIB</p><hr><h2>${esc(form.venue)}</h2><p>${esc(form.address)}</p><a href="${esc(form.maps)}" target="_blank">Lihat Lokasi</a></section><section class="sec"><h2>RSVP</h2><p>Konfirmasi kehadiran melalui WhatsApp.</p><h3>${esc(initials)}</h3></section></article><script>const t=new Date("${form.date}T${form.time}:00");setInterval(()=>{let x=Math.max(0,t-new Date());d.textContent=Math.floor(x/86400000);h.textContent=Math.floor(x%86400000/3600000);m.textContent=Math.floor(x%3600000/60000);s.textContent=Math.floor(x%60000/1000)},1000)</script></body></html>`;
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([html],{type:"text/html"}));a.download=`undangan-${form.groom.split(" ")[0]}-${form.bride.split(" ")[0]}.html`;a.click();
 }
 async function share(){
  const text=`Undangan Pernikahan ${initials} — ${displayDate} di ${form.venue}`;
  if(navigator.share) await navigator.share({title:"Undangan Pernikahan",text});
  else {await navigator.clipboard?.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),1800)}
 }

 return <main style={{"--accent":form.color}}>
  <header className="top"><div><span className="badge">CUPZ WEDDING PROJECT </span><h1>Generate Undangan Pernikahan</h1><p>Buat undangan digital dari HP, lalu download </p></div><div className="actions"><button className="btn" onClick={()=>setGenerated(true)}>Generate</button><button className="btn dark" onClick={downloadHTML}>Download </button></div></header>
  <div className="layout">
   <aside className="editor">
    <h2>Isi Data Undangan</h2>
    <label>Nama Mempelai Pria<input value={form.groom} onChange={e=>set("groom",e.target.value)}/></label>
    <label>Nama Mempelai Wanita<input value={form.bride} onChange={e=>set("bride",e.target.value)}/></label>
    <div className="two"><label>Tanggal<input type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></label><label>Jam<input type="time" value={form.time} onChange={e=>set("time",e.target.value)}/></label></div>
    <label>Lokasi<input value={form.venue} onChange={e=>set("venue",e.target.value)}/></label>
    <label>Alamat<textarea value={form.address} onChange={e=>set("address",e.target.value)}/></label>
    <label>Google Maps<input value={form.maps} onChange={e=>set("maps",e.target.value)}/></label>
    <label>Foto Pengantin<input type="file" accept="image/*" onChange={upload}/></label>
    <div className="two"><label>Orang Tua Pria<input value={form.parentsG} onChange={e=>set("parentsG",e.target.value)}/></label><label>Orang Tua Wanita<input value={form.parentsB} onChange={e=>set("parentsB",e.target.value)}/></label></div>
    <label>Quote / Kata-kata<textarea value={form.quote} onChange={e=>set("quote",e.target.value)}/></label>
    <div className="two"><label>Warna<input type="color" value={form.color} onChange={e=>set("color",e.target.value)}/></label><label>Tema<select value={form.theme} onChange={e=>set("theme",e.target.value)}><option value="classic">Classic</option><option value="modern">Modern</option><option value="floral">Floral</option></select></label></div>
    <div className="row"><button className="btn" onClick={()=>setGenerated(true)}>✨ Generate Undangan</button><button className="reset" onClick={reset}>Reset</button></div>
    <p className="note">Versi ini tidak memakai database. Foto dan data diproses di browser. Cocok untuk generator demo.</p>
   </aside>
   <section className="preview">
    <div className="previewbar"><b>{generated?"Hasil Undangan":"Preview"}</b><span>{displayDate}</span></div>
    <article className={`invite ${form.theme}`}>
      <div className="cover"><small>THE WEDDING OF</small><h2>{initials}</h2>{photo?<img className="photo" src={photo}/>:<div className="photo placeholder">Foto Pengantin</div>}<p>{displayDate}</p><button className="ghost" onClick={()=>setOpen(true)}>Buka Undangan</button></div>
      <section className="section"><p className="quote">“{form.quote}”</p><p>Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami.</p><h3>{form.groom} & {form.bride}</h3><p>{form.parentsG}<br/>&<br/>{form.parentsB}</p></section>
      <section className="count"><small>COUNTDOWN TO OUR WEDDING</small><div className="countgrid">{[[left.d,"Hari"],[left.h,"Jam"],[left.m,"Menit"],[left.s,"Detik"]].map(x=><div key={x[1]}><b>{String(x[0]).padStart(2,"0")}</b><span>{x[1]}</span></div>)}</div></section>
      <section className="event"><small>SAVE THE DATE</small><h3>{day.toUpperCase()}</h3><strong>{dt.getDate()}</strong><h4>{months[dt.getMonth()].toUpperCase()} {dt.getFullYear()}</h4><p>{form.time} WIB</p><hr/><h3>{form.venue}</h3><p>{form.address}</p><a className="btn" href={form.maps} target="_blank">Lihat Lokasi</a></section>
      <section className="section"><h3>RSVP</h3><p>Konfirmasi kehadiran</p><input className="rsvp" placeholder="Nama Anda" value={rsvp} onChange={e=>setRsvp(e.target.value)}/><button className="btn" onClick={wa}>Konfirmasi via WhatsApp</button><div className="shareRow"><button className="btn light" onClick={share}>{copied?"Tersalin!":"Bagikan"}</button><button className="btn dark" onClick={downloadHTML}>Download HTML</button></div><h3>Terima Kasih</h3><b>{initials}</b></section>
      <footer>Undangan demo/fiktif — CupzWedding</footer>
    </article>
   </section>
  </div>
  {open&&<div className="modal"><div className="modalbox"><button className="close" onClick={()=>setOpen(false)}>×</button><div className="heart">♡</div><small>THE WEDDING OF</small><h2>{initials}</h2><p>{displayDate}</p><button className="btn" onClick={()=>setOpen(false)}>Masuk Undangan</button></div></div>}
 </main>
}