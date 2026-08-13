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
 async function share(){
  const text=`Undangan Pernikahan ${initials} — ${displayDate} di ${form.venue}`;
  if(navigator.share) await navigator.share({title:"Undangan Pernikahan",text});
  else {await navigator.clipboard?.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),1800)}
 }

 function exportPDF(){
  document.body.classList.add("printing-pdf");
  window.setTimeout(()=>{ window.print(); window.setTimeout(()=>document.body.classList.remove("printing-pdf"), 500); }, 80);
 }

 function downloadHTML(){
  const safe=(value)=>String(value ?? "").replace(/[&<>\"']/g,(ch)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
  const photoHTML=photo ? `<img class="photo" src="${photo}" alt="Foto pengantin">` : `<div class="photo placeholder">Foto Pengantin</div>`;
  const html=`<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Undangan Pernikahan — ${safe(initials)}</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Georgia,serif;background:#f4f1ef;color:#3d3030}.wrap{max-width:760px;margin:auto;background:#fff;min-height:100vh;box-shadow:0 0 30px #0001}.cover{min-height:100vh;padding:70px 25px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#fff,#f5eaea)}small{letter-spacing:3px}.cover h1{font-size:48px;margin:18px 0;color:${safe(form.color)}}.photo{width:min(320px,85vw);height:390px;object-fit:cover;border-radius:180px 180px 20px 20px;margin:25px 0;border:6px solid #fff;box-shadow:0 10px 30px #0002}.placeholder{display:flex;align-items:center;justify-content:center;background:#eee;color:#888;font-family:Arial,sans-serif}.section,.event,.count{padding:65px 25px;text-align:center}.section p{line-height:1.8;color:#665}.quote{font-style:italic;font-size:19px}.count{background:#faf6f4}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:25px}.grid div{padding:18px 5px;background:#fff;border-radius:12px;box-shadow:0 5px 18px #00000010}.grid b{display:block;font-size:28px;color:${safe(form.color)}}.grid span{font-size:12px;color:#777}.event strong{display:block;font-size:76px;color:${safe(form.color)};margin:12px}.btn{display:inline-block;border:0;border-radius:999px;padding:13px 22px;background:${safe(form.color)};color:#fff;text-decoration:none;margin-top:15px;cursor:pointer}.footer{padding:25px;text-align:center;color:#888;font:12px Arial,sans-serif}.share{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}@media(max-width:520px){.cover h1{font-size:38px}.grid b{font-size:22px}}
</style>
</head>
<body><main class="wrap">
<section class="cover"><small>THE WEDDING OF</small><h1>${safe(initials)}</h1>${photoHTML}<p>${safe(displayDate)}</p><p>${safe(form.venue)}</p></section>
<section class="section"><p class="quote">“${safe(form.quote)}”</p><p>Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami.</p><h2>${safe(form.groom)} &amp; ${safe(form.bride)}</h2><p>${safe(form.parentsG)}<br>&amp;<br>${safe(form.parentsB)}</p></section>
<section class="count"><small>COUNTDOWN TO OUR WEDDING</small><div class="grid"><div><b id="d">00</b><span>Hari</span></div><div><b id="h">00</b><span>Jam</span></div><div><b id="m">00</b><span>Menit</span></div><div><b id="s">00</b><span>Detik</span></div></div></section>
<section class="event"><small>SAVE THE DATE</small><h2>${safe(day.toUpperCase())}</h2><strong>${dt.getDate()}</strong><h3>${safe(months[dt.getMonth()].toUpperCase())} ${dt.getFullYear()}</h3><p>${safe(form.time)} WIB</p><hr><h2>${safe(form.venue)}</h2><p>${safe(form.address)}</p><a class="btn" href="${safe(form.maps)}" target="_blank" rel="noopener">Lihat Lokasi</a></section>
<section class="section"><h2>Terima Kasih</h2><p>Merupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.</p><p><b>${safe(initials)}</b></p></section>
<div class="footer">CupzProject — Generate Wedding</div></main>
<script>const target=new Date(${JSON.stringify(form.date+'T'+form.time+':00')});function tick(){let x=Math.max(0,target-new Date());document.getElementById('d').textContent=String(Math.floor(x/86400000)).padStart(2,'0');document.getElementById('h').textContent=String(Math.floor(x%86400000/3600000)).padStart(2,'0');document.getElementById('m').textContent=String(Math.floor(x%3600000/60000)).padStart(2,'0');document.getElementById('s').textContent=String(Math.floor(x%60000/1000)).padStart(2,'0')}tick();setInterval(tick,1000);</script>
</body></html>`;
  const blob=new Blob([html],{type:"text/html;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=`undangan-${form.groom.replace(/\s+/g,"-").toLowerCase()}-${form.bride.replace(/\s+/g,"-").toLowerCase()}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 }

 return <main style={{"--accent":form.color}}>
  <header className="top"><div><span className="badge">CUPZWEDDING GENERATOR</span><h1>Generate Undangan Pernikahan</h1><p>Buat undangan digital modern dari HP, lalu export PDF atau download HTML.</p></div><div className="actions"><button className="btn" onClick={()=>setGenerated(true)}>Generate</button><button className="btn dark" onClick={exportPDF}>Export PDF</button><button className="btn outline" onClick={downloadHTML}>Download HTML</button></div></header>
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
   </aside>
   <section className="preview">
    <div className="previewbar"><b>{generated?"Hasil Undangan":"Preview"}</b><span>{displayDate}</span></div>
    <article className={`invite ${form.theme}`}>
      <div className="cover"><small>THE WEDDING OF</small><h2>{initials}</h2>{photo?<img className="photo" src={photo}/>:<div className="photo placeholder">Foto Pengantin</div>}<p>{displayDate}</p><button className="ghost" onClick={()=>setOpen(true)}>Buka Undangan</button></div>
      <section className="section"><p className="quote">“{form.quote}”</p><p>Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami.</p><h3>{form.groom} & {form.bride}</h3><p>{form.parentsG}<br/>&<br/>{form.parentsB}</p></section>
      <section className="count"><small>COUNTDOWN TO OUR WEDDING</small><div className="countgrid">{[[left.d,"Hari"],[left.h,"Jam"],[left.m,"Menit"],[left.s,"Detik"]].map(x=><div key={x[1]}><b>{String(x[0]).padStart(2,"0")}</b><span>{x[1]}</span></div>)}</div></section>
      <section className="event"><small>SAVE THE DATE</small><h3>{day.toUpperCase()}</h3><strong>{dt.getDate()}</strong><h4>{months[dt.getMonth()].toUpperCase()} {dt.getFullYear()}</h4><p>{form.time} WIB</p><hr/><h3>{form.venue}</h3><p>{form.address}</p><a className="btn" href={form.maps} target="_blank">Lihat Lokasi</a></section>
      <section className="section"><h3>Terima Kasih</h3><p>Merupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.</p><div className="shareRow"><button className="btn light" onClick={share}>{copied?"Tersalin!":"Bagikan"}</button><button className="btn dark" onClick={exportPDF}>Export PDF</button><button className="btn outline" onClick={downloadHTML}>Download HTML</button></div><div className="signature">{initials}</div></section>
      <footer>CupzProject —Generate Wedding</footer>
    </article>
   </section>
  </div>
  {open&&<div className="modal"><div className="modalbox"><button className="close" onClick={()=>setOpen(false)}>×</button><div className="heart">♡</div><small>THE WEDDING OF</small><h2>{initials}</h2><p>{displayDate}</p><button className="btn" onClick={()=>setOpen(false)}>Masuk Undangan</button></div></div>}
 </main>
}