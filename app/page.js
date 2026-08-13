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
 const [photos,setPhotos]=useState(["","","",""]);
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

 function upload(index,e){
  const f=e.target.files?.[0]; if(!f)return;
  const r=new FileReader();
  r.onload=()=>setPhotos(prev=>{const next=[...prev];next[index]=r.result;return next});
  r.readAsDataURL(f);
 }
 function uploadMultiple(e){
  const files=Array.from(e.target.files||[]).slice(0,4);
  files.forEach((f,index)=>{const r=new FileReader();r.onload=()=>setPhotos(prev=>{const next=[...prev];next[index]=r.result;return next});r.readAsDataURL(f)});
 }
 function reset(){setForm({groom:"Rizky Pratama",bride:"Alya Maharani",date:"2026-12-20",time:"10:00",venue:"Gedung Graha Cinta",address:"Jl. Melati No. 123, Yogyakarta",maps:"https://maps.google.com",parentsG:"Bapak & Ibu Keluarga Pratama",parentsB:"Bapak & Ibu Keluarga Maharani",quote:"Dengan penuh kebahagiaan, kami mengundang Anda untuk menjadi bagian dari hari istimewa kami.",theme:"classic",color:"#8b5e5e"});setPhotos(["","","",""]);setGenerated(false)}
 async function share(){
  const text=`Undangan Pernikahan ${initials} — ${displayDate} di ${form.venue}`;
  if(navigator.share) await navigator.share({title:"Undangan Pernikahan",text});
  else {await navigator.clipboard?.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),1800)}
 }

 function exportPDF(){
  // Open a dedicated print document so mobile Chrome/Android prints all images reliably.
  const popup=window.open("", "_blank");
  if(!popup){
    alert("Izinkan pop-up browser untuk Export PDF.");
    return;
  }
  const safe=(value)=>String(value ?? "").replace(/[&<>\"']/g,(ch)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
  const allPhotos=photos.filter(Boolean);
  const coverPhoto=allPhotos[0]||"";
  const galleryPhotos=allPhotos.slice(1);
  const galleryHTML=galleryPhotos.map((src,i)=>`<figure><img src="${src}" alt="Foto ${i+2}"><figcaption>Foto ${i+2}</figcaption></figure>`).join("");
  const coverHTML=coverPhoto?`<img class="coverPhoto" src="${coverPhoto}" alt="Foto pengantin">`:`<div class="coverPhoto placeholder">Foto Pengantin</div>`;
  const html=`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Undangan ${safe(initials)}</title>
<style>
@page{size:A4 portrait;margin:10mm}
*{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff;color:#382d2d;font-family:Georgia,serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{width:100%;max-width:190mm;margin:0 auto}.cover{text-align:center;min-height:270mm;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18mm 12mm;break-after:page;page-break-after:always;background:linear-gradient(135deg,#fff,#f7eeee)}small{letter-spacing:3px}.cover h1{font-size:42pt;margin:8mm 0 4mm;color:${safe(form.color)}}.cover p{margin:3mm 0;font-size:13pt}.coverPhoto{width:72mm;height:88mm;object-fit:cover;border-radius:40mm 40mm 8mm 8mm;border:3px solid #fff;box-shadow:0 5mm 12mm rgba(0,0,0,.15);margin:5mm 0 7mm}.placeholder{display:flex;align-items:center;justify-content:center;background:#eee;color:#888;font-family:Arial,sans-serif}.section{text-align:center;padding:18mm 12mm;break-inside:avoid}.section p{line-height:1.8;color:#665}.quote{font-style:italic;font-size:14pt}.count{text-align:center;padding:15mm 10mm;background:#faf6f4;break-inside:avoid}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:5mm;margin-top:8mm}.grid div{padding:7mm 2mm;background:#fff;border-radius:4mm}.grid b{display:block;font-size:22pt;color:${safe(form.color)}}.grid span{font-size:9pt;color:#777}.event{text-align:center;padding:18mm 10mm;break-inside:avoid}.event strong{display:block;font-size:58pt;color:${safe(form.color)};margin:5mm}.event hr{border:0;border-top:1px solid #ddd;margin:10mm 0}.btn{display:inline-block;background:${safe(form.color)};color:#fff;padding:4mm 8mm;border-radius:99px;text-decoration:none}.gallery{padding:15mm 6mm;break-before:page;page-break-before:always}.gallery h2{text-align:center;margin:0 0 8mm}.galleryGrid{display:grid;grid-template-columns:1fr 1fr;gap:7mm}.galleryGrid figure{margin:0;break-inside:avoid;page-break-inside:avoid}.galleryGrid img{display:block;width:100%;height:72mm;object-fit:cover;border-radius:5mm}.galleryGrid figcaption{text-align:center;font:9pt Arial,sans-serif;color:#777;margin-top:2mm}.thanks{text-align:center;padding:18mm 12mm;break-inside:avoid}.footer{text-align:center;font:8pt Arial,sans-serif;color:#888;padding:8mm}
</style></head><body><main class="page">
<section class="cover"><small>THE WEDDING OF</small><h1>${safe(initials)}</h1>${coverHTML}<p>${safe(displayDate)}</p><p>${safe(form.venue)}</p></section>
<section class="section"><p class="quote">“${safe(form.quote)}”</p><p>Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami.</p><h2>${safe(form.groom)} &amp; ${safe(form.bride)}</h2><p>${safe(form.parentsG)}<br>&amp;<br>${safe(form.parentsB)}</p></section>
<section class="count"><small>COUNTDOWN TO OUR WEDDING</small><div class="grid"><div><b>${String(left.d).padStart(2,'0')}</b><span>Hari</span></div><div><b>${String(left.h).padStart(2,'0')}</b><span>Jam</span></div><div><b>${String(left.m).padStart(2,'0')}</b><span>Menit</span></div><div><b>${String(left.s).padStart(2,'0')}</b><span>Detik</span></div></div></section>
<section class="event"><small>SAVE THE DATE</small><h2>${safe(day.toUpperCase())}</h2><strong>${dt.getDate()}</strong><h3>${safe(months[dt.getMonth()].toUpperCase())} ${dt.getFullYear()}</h3><p>${safe(form.time)} WIB</p><hr><h2>${safe(form.venue)}</h2><p>${safe(form.address)}</p></section>
${galleryHTML?`<section class="gallery"><h2>Galeri Foto</h2><div class="galleryGrid">${galleryHTML}</div></section>`:""}
<section class="thanks"><h2>Terima Kasih</h2><p>Merupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.</p><p><b>${safe(initials)}</b></p></section><div class="footer">CupzProject —Generate Wedding</div>
</main><script>
(async()=>{const imgs=[...document.images];await Promise.all(imgs.map(img=>img.complete?Promise.resolve():new Promise(r=>{img.onload=r;img.onerror=r})));if(document.fonts&&document.fonts.ready)await document.fonts.ready;setTimeout(()=>{window.focus();window.print();setTimeout(()=>window.close(),1200)},500)})();
</script></body></html>`;
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
 }

 function downloadHTML(){
  const safe=(value)=>String(value ?? "").replace(/[&<>\"']/g,(ch)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
  const photoHTML=photos[0] ? `<img class="photo" src="${photos[0]}" alt="Foto pengantin">` : `<div class="photo placeholder">Foto Pengantin</div>`;
  const galleryPhotos=photos.slice(1).filter(Boolean);
  const galleryHTML=galleryPhotos.length ? `<section class="gallery"><h2>Galeri Foto</h2><div class="gallery-grid">${galleryPhotos.map((src,i)=>`<img src="${src}" alt="Foto ${i+2}">`).join("")}</div></section>` : "";
  const html=`<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Undangan Pernikahan — ${safe(initials)}</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Georgia,serif;background:#f4f1ef;color:#3d3030}.wrap{max-width:760px;margin:auto;background:#fff;min-height:100vh;box-shadow:0 0 30px #0001}.cover{min-height:100vh;padding:70px 25px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#fff,#f5eaea)}small{letter-spacing:3px}.cover h1{font-size:48px;margin:18px 0;color:${safe(form.color)}}.photo{width:min(320px,85vw);height:390px;object-fit:cover;border-radius:180px 180px 20px 20px;margin:25px 0;border:6px solid #fff;box-shadow:0 10px 30px #0002}.placeholder{display:flex;align-items:center;justify-content:center;background:#eee;color:#888;font-family:Arial,sans-serif}.section,.event,.count{padding:65px 25px;text-align:center}.section p{line-height:1.8;color:#665}.quote{font-style:italic;font-size:19px}.count{background:#faf6f4}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:25px}.grid div{padding:18px 5px;background:#fff;border-radius:12px;box-shadow:0 5px 18px #00000010}.grid b{display:block;font-size:28px;color:${safe(form.color)}}.grid span{font-size:12px;color:#777}.event strong{display:block;font-size:76px;color:${safe(form.color)};margin:12px}.btn{display:inline-block;border:0;border-radius:999px;padding:13px 22px;background:${safe(form.color)};color:#fff;text-decoration:none;margin-top:15px;cursor:pointer}.gallery{padding:55px 25px;text-align:center;background:#fff}.gallery-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;max-width:650px;margin:25px auto}.gallery-grid img{width:100%;height:280px;object-fit:cover;border-radius:18px;box-shadow:0 8px 25px #0002}.footer{padding:25px;text-align:center;color:#888;font:12px Arial,sans-serif}.share{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}@media(max-width:520px){.cover h1{font-size:38px}.grid b{font-size:22px}}
</style>
</head>
<body><main class="wrap">
<section class="cover"><small>THE WEDDING OF</small><h1>${safe(initials)}</h1>${photoHTML}<p>${safe(displayDate)}</p><p>${safe(form.venue)}</p></section>
<section class="section"><p class="quote">“${safe(form.quote)}”</p><p>Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami.</p><h2>${safe(form.groom)} &amp; ${safe(form.bride)}</h2><p>${safe(form.parentsG)}<br>&amp;<br>${safe(form.parentsB)}</p></section>
<section class="count"><small>COUNTDOWN TO OUR WEDDING</small><div class="grid"><div><b id="d">00</b><span>Hari</span></div><div><b id="h">00</b><span>Jam</span></div><div><b id="m">00</b><span>Menit</span></div><div><b id="s">00</b><span>Detik</span></div></div></section>
<section class="event"><small>SAVE THE DATE</small><h2>${safe(day.toUpperCase())}</h2><strong>${dt.getDate()}</strong><h3>${safe(months[dt.getMonth()].toUpperCase())} ${dt.getFullYear()}</h3><p>${safe(form.time)} WIB</p><hr><h2>${safe(form.venue)}</h2><p>${safe(form.address)}</p><a class="btn" href="${safe(form.maps)}" target="_blank" rel="noopener">Lihat Lokasi</a></section>
${galleryHTML}<section class="section"><h2>Terima Kasih</h2><p>Merupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.</p><p><b>${safe(initials)}</b></p></section>
<div class="footer">CupzProject —Generate Wedding</div></main>
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
    <label>Foto 1 — Foto Utama<input type="file" accept="image/*" onChange={e=>upload(0,e)}/></label>
    <label>Foto 2<input type="file" accept="image/*" onChange={e=>upload(1,e)}/></label>
    <label>Foto 3<input type="file" accept="image/*" onChange={e=>upload(2,e)}/></label>
    <label>Foto 4<input type="file" accept="image/*" onChange={e=>upload(3,e)}/></label>
    <p className="note">Gunakan 1–4 foto. Foto 1 menjadi cover, foto 2–4 otomatis masuk ke galeri dan ikut saat Download HTML / Export PDF.</p>
    <div className="two"><label>Orang Tua Pria<input value={form.parentsG} onChange={e=>set("parentsG",e.target.value)}/></label><label>Orang Tua Wanita<input value={form.parentsB} onChange={e=>set("parentsB",e.target.value)}/></label></div>
    <label>Quote / Kata-kata<textarea value={form.quote} onChange={e=>set("quote",e.target.value)}/></label>
    <div className="two"><label>Warna<input type="color" value={form.color} onChange={e=>set("color",e.target.value)}/></label><label>Tema<select value={form.theme} onChange={e=>set("theme",e.target.value)}><option value="classic">Classic</option><option value="modern">Modern</option><option value="floral">Floral</option></select></label></div>
    <div className="row"><button className="btn" onClick={()=>setGenerated(true)}>✨ Generate Undangan</button><button className="reset" onClick={reset}>Reset</button></div>
   </aside>
   <section className="preview">
    <div className="previewbar"><b>{generated?"Hasil Undangan":"Preview"}</b><span>{displayDate}</span></div>
    <article className={`invite ${form.theme}`}>
      <div className="cover"><small>THE WEDDING OF</small><h2>{initials}</h2>{photos[0]?<img className="photo" src={photos[0]} alt="Foto pengantin"/>:<div className="photo placeholder">Foto Pengantin</div>}<p>{displayDate}</p><button className="ghost" onClick={()=>setOpen(true)}>Buka Undangan</button></div>
      <section className="section"><p className="quote">“{form.quote}”</p><p>Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami.</p><h3>{form.groom} & {form.bride}</h3><p>{form.parentsG}<br/>&<br/>{form.parentsB}</p></section>
      <section className="count"><small>COUNTDOWN TO OUR WEDDING</small><div className="countgrid">{[[left.d,"Hari"],[left.h,"Jam"],[left.m,"Menit"],[left.s,"Detik"]].map(x=><div key={x[1]}><b>{String(x[0]).padStart(2,"0")}</b><span>{x[1]}</span></div>)}</div></section>
      <section className="event"><small>SAVE THE DATE</small><h3>{day.toUpperCase()}</h3><strong>{dt.getDate()}</strong><h4>{months[dt.getMonth()].toUpperCase()} {dt.getFullYear()}</h4><p>{form.time} WIB</p><hr/><h3>{form.venue}</h3><p>{form.address}</p><a className="btn" href={form.maps} target="_blank">Lihat Lokasi</a></section>
      {photos.slice(1).some(Boolean)&&<section className="gallery"><h3>Galeri Foto</h3><div className="galleryGrid">{photos.slice(1).map((src,i)=>src&&<img key={i} src={src} alt={`Foto ${i+2}`}/>)}</div></section>}
      <section className="section"><h3>Terima Kasih</h3><p>Merupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.</p><div className="shareRow"><button className="btn light" onClick={share}>{copied?"Tersalin!":"Bagikan"}</button><button className="btn dark" onClick={exportPDF}>Export PDF</button><button className="btn outline" onClick={downloadHTML}>Download HTML</button></div><div className="signature">{initials}</div></section>
      <footer>CupzProject —Generate Wedding</footer>
    </article>
   </section>
  </div>
  {open&&<div className="modal"><div className="modalbox"><button className="close" onClick={()=>setOpen(false)}>×</button><div className="heart">♡</div><small>THE WEDDING OF</small><h2>{initials}</h2><p>{displayDate}</p><button className="btn" onClick={()=>setOpen(false)}>Masuk Undangan</button></div></div>}
 </main>
}