 "use client";
import {useEffect,useMemo,useState} from "react";
import {jsPDF} from "jspdf";

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
 const normalizeUrl=(value)=>{
  const raw=String(value||"").trim();
  if(!raw)return "";
  try{const u=new URL(/^https?:\/\//i.test(raw)?raw:`https://${raw}`);return /^https?:$/.test(u.protocol)?u.href:"";}catch{return ""}
 };
 const mapsUrl=normalizeUrl(form.maps);

 function readImageAsJpeg(file){
  return new Promise((resolve,reject)=>{
   const reader=new FileReader();
   reader.onerror=reject;
   reader.onload=()=>{
    const img=new Image();
    img.onload=()=>{
     const max=1600;
     const scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
     const canvas=document.createElement("canvas");
     canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));
     canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
     const ctx=canvas.getContext("2d");
     ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);
     ctx.drawImage(img,0,0,canvas.width,canvas.height);
     resolve(canvas.toDataURL("image/jpeg",0.88));
    };
    img.onerror=reject;
    img.src=reader.result;
   };
   reader.readAsDataURL(file);
  });
 }
 function upload(index,e){
  const f=e.target.files?.[0]; if(!f)return;
  readImageAsJpeg(f).then(data=>setPhotos(prev=>{const next=[...prev];next[index]=data;return next})).catch(()=>alert("Foto gagal dibaca. Silakan pilih foto JPG/PNG lain."));
 }
 function uploadMultiple(e){
  const files=Array.from(e.target.files||[]).slice(0,4);
  files.forEach((f,index)=>readImageAsJpeg(f).then(data=>setPhotos(prev=>{const next=[...prev];next[index]=data;return next})).catch(()=>{}));
 }
 function reset(){setForm({groom:"Rizky Pratama",bride:"Alya Maharani",date:"2026-12-20",time:"10:00",venue:"Gedung Graha Cinta",address:"Jl. Melati No. 123, Yogyakarta",maps:"https://maps.google.com",parentsG:"Bapak & Ibu Keluarga Pratama",parentsB:"Bapak & Ibu Keluarga Maharani",quote:"Dengan penuh kebahagiaan, kami mengundang Anda untuk menjadi bagian dari hari istimewa kami.",theme:"classic",color:"#8b5e5e"});setPhotos(["","","",""]);setGenerated(false)}
 async function share(){
  const text=`Undangan Pernikahan ${initials} — ${displayDate} di ${form.venue}`;
  if(navigator.share) await navigator.share({title:"Undangan Pernikahan",text});
  else {await navigator.clipboard?.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),1800)}
 }

 function exportPDF(){
  try{
   const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4",compress:true});
   const W=210,H=297,margin=16,accent=form.color||"#8b5e5e";
   const rgb=(hex)=>{const h=hex.replace("#","");return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
   const [r,g,b]=rgb(accent);
   const addText=(txt,x,y,size=12,style="normal",color=[60,45,45],align="left")=>{doc.setFont("helvetica",style);doc.setFontSize(size);doc.setTextColor(...color);doc.text(String(txt||""),x,y,{align});};
   const addImageFit=(src,x,y,w,h)=>{
    if(!src)return false;
    try{doc.addImage(src,"JPEG",x,y,w,h,undefined,"FAST");return true}catch(e){return false}
   };
   const addLinkButton=(label,url,x,y,w=58,h=10)=>{
    if(!url)return false;
    doc.setFillColor(r,g,b);doc.roundedRect(x,y,w,h,5,5,"F");
    addText(label,x+w/2,y+6.7,8,"bold",[255,255,255],"center");
    doc.link(x,y,w,h,{url});
    return true;
   };
   // Halaman 1: cover
   doc.setFillColor(250,244,240);doc.rect(0,0,W,H,"F");
   addText("THE WEDDING OF",W/2,35,9,"bold",[110,90,84],"center");
   addText(initials,W/2,52,30,"bold",[r,g,b],"center");
   if(photos[0]){
    doc.setFillColor(255,255,255);doc.roundedRect(57,65,96,112,10,10,"F");
    addImageFit(photos[0],61,69,88,104);
   }else{
    doc.setFillColor(232,224,220);doc.roundedRect(57,65,96,112,10,10,"F");addText("Foto Pengantin",W/2,123,12,"normal",[120,105,100],"center");
   }
   addText(displayDate,W/2,195,14,"normal",[65,50,48],"center");
   addText(form.venue,W/2,205,12,"bold",[r,g,b],"center");
   addText(form.address,W/2,214,9,"normal",[100,88,84],"center");
   addText("Dengan penuh kebahagiaan, kami mengundang Anda untuk menjadi bagian dari hari istimewa kami.",W/2,238,10,"italic",[105,88,82],"center");
   addText(initials,W/2,270,16,"italic",[r,g,b],"center");

   // Halaman 2: detail acara
   doc.addPage();
   doc.setFillColor(255,253,251);doc.rect(0,0,W,H,"F");
   addText("UNDANGAN PERNIKAHAN",W/2,28,9,"bold",[110,90,84],"center");
   addText(form.groom+" & "+form.bride,W/2,43,20,"bold",[r,g,b],"center");
   addText("Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami.",W/2,61,10,"normal",[90,78,73],"center");
   addText(form.parentsG,W/2,75,10,"normal",[75,63,60],"center");
   addText("&",W/2,82,10,"normal",[r,g,b],"center");
   addText(form.parentsB,W/2,89,10,"normal",[75,63,60],"center");
   doc.setFillColor(246,237,232);doc.roundedRect(20,105,170,78,8,8,"F");
   addText("SAVE THE DATE",W/2,120,9,"bold",[110,90,84],"center");
   addText(day.toUpperCase(),W/2,136,12,"bold",[r,g,b],"center");
   addText(String(dt.getDate()),W/2,157,30,"bold",[r,g,b],"center");
   addText(months[dt.getMonth()].toUpperCase()+" "+dt.getFullYear(),W/2,169,11,"bold",[75,60,56],"center");
   addText(form.time+" WIB",W/2,191,11,"bold",[75,60,56],"center");
   addText(form.venue,W/2,217,15,"bold",[r,g,b],"center");
   const addrLines=doc.splitTextToSize(form.address||"",150);addText(addrLines,W/2,230,10,"normal",[95,82,78],"center");
   addText("COUNTDOWN",W/2,260,8,"bold",[110,90,84],"center");
   addText(String(left.d).padStart(2,"0")+" Hari   "+String(left.h).padStart(2,"0")+" Jam   "+String(left.m).padStart(2,"0")+" Menit",W/2,273,10,"bold",[r,g,b],"center");
   const pdfLinks=[
    [mapsUrl,"Lihat Lokasi"],
    ].filter(x=>x[0]);
   const linkW=50, linkGap=5, total=pdfLinks.length*linkW+(pdfLinks.length-1)*linkGap;
   let linkX=(W-total)/2;
   pdfLinks.forEach(([url,label])=>{addLinkButton(label,url,linkX,282,linkW,10);linkX+=linkW+linkGap;});

   // Halaman 3: semua foto 2-4, sehingga 4 foto selalu ikut PDF
   doc.addPage();
   doc.setFillColor(255,253,251);doc.rect(0,0,W,H,"F");
   addText("GALERI FOTO",W/2,27,20,"bold",[r,g,b],"center");
   addText("Kenangan indah dalam satu hari istimewa",W/2,36,9,"italic",[105,90,85],"center");
   const gallery=photos.map((src,i)=>({src,i})).filter(x=>x.src);
   const slots=[[18,50,82,78],[110,50,82,78],[18,140,82,78],[110,140,82,78]];
   gallery.slice(0,4).forEach((item,n)=>{const [x,y,w,h]=slots[n];doc.setFillColor(245,239,235);doc.roundedRect(x,y,w,h,5,5,"F");addImageFit(item.src,x+2,y+2,w-4,h-4);addText("Foto "+(item.i+1),x+w/2,y+h+8,8,"normal",[110,95,90],"center")});
   addText("Terima Kasih",W/2,250,18,"bold",[r,g,b],"center");
   const thanks=doc.splitTextToSize("Merupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.",150);addText(thanks,W/2,264,10,"normal",[95,82,78],"center");
   addText(initials,W/2,285,15,"italic",[r,g,b],"center");

   const filename=`undangan-${form.groom.replace(/\s+/g,"-").toLowerCase()}-${form.bride.replace(/\s+/g,"-").toLowerCase()}.pdf`;
   doc.save(filename);
  }catch(err){
   console.error(err);
   alert("PDF gagal dibuat. Pastikan semua foto sudah selesai dipilih, lalu coba lagi.");
  }
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
<section class="event"><small>SAVE THE DATE</small><h2>${safe(day.toUpperCase())}</h2><strong>${dt.getDate()}</strong><h3>${safe(months[dt.getMonth()].toUpperCase())} ${dt.getFullYear()}</h3><p>${safe(form.time)} WIB</p><hr><h2>${safe(form.venue)}</h2><p>${safe(form.address)}</p><div class="share">${mapsUrl?`<a class="btn" href="${safe(mapsUrl)}" target="_blank" rel="noopener">Lihat Lokasi</a>`:""}</div></section>
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
    <label>Google Maps<input value={form.maps} onChange={e=>set("maps",e.target.value)} placeholder="https://maps.google.com/..."/></label>
    <p className="note">Link Google Maps yang diisi akan menjadi <b>clickable</b> di PDF dan undangan HTML.</p>
    <label>Foto 1 — Foto Pengantin<input type="file" accept="image/*" onChange={e=>upload(0,e)}/></label>
    <label>Foto 2 — Foto Galeri Pengantin<input type="file" accept="image/*" onChange={e=>upload(1,e)}/></label>
    <label>Foto 3 — Foto Galeri Pengantin<input type="file" accept="image/*" onChange={e=>upload(2,e)}/></label>
    <label>Foto 4 — Foto Galeri Pengantin<input type="file" accept="image/*" onChange={e=>upload(3,e)}/></label>
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
      <section className="event"><small>SAVE THE DATE</small><h3>{day.toUpperCase()}</h3><strong>{dt.getDate()}</strong><h4>{months[dt.getMonth()].toUpperCase()} {dt.getFullYear()}</h4><p>{form.time} WIB</p><hr/><h3>{form.venue}</h3><p>{form.address}</p><div className="shareRow">{mapsUrl&&<a className="btn" href={mapsUrl} target="_blank" rel="noreferrer">Lihat Lokasi</a>}</div></section>
      {photos.slice(1).some(Boolean)&&<section className="gallery"><h3>Galeri Foto</h3><div className="galleryGrid">{photos.slice(1).map((src,i)=>src&&<img key={i} src={src} alt={`Foto ${i+2}`}/>)}</div></section>}
      <section className="section"><h3>Terima Kasih</h3><p>Merupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.</p><div className="shareRow"><button className="btn light" onClick={share}>{copied?"Tersalin!":"Bagikan"}</button><button className="btn dark" onClick={exportPDF}>Export PDF</button><button className="btn outline" onClick={downloadHTML}>Download HTML</button></div><div className="signature">{initials}</div></section>
      <footer>CupzProject —Generate Wedding</footer>
    </article>
   </section>
  </div>
  {open&&<div className="modal"><div className="modalbox"><button className="close" onClick={()=>setOpen(false)}>×</button><div className="heart">♡</div><small>THE WEDDING OF</small><h2>{initials}</h2><p>{displayDate}</p><button className="btn" onClick={()=>setOpen(false)}>Masuk Undangan</button></div></div>}
 </main>
}