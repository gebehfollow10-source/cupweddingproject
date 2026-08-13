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

 return <main style={{"--accent":form.color}}>
  <header className="top"><div><span className="badge">CUPZWEDDING GENERATOR</span><h1>Generate Undangan Pernikahan</h1><p>Buat undangan digital dari HP, lalu download </p></div><div className="actions"><button className="btn" onClick={()=>setGenerated(true)}>Generate</button><button className="btn dark" onClick={downloadHTML}>Download</button></div></header>
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
      <section className="section"><h3>Terima Kasih</h3><p>Merupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.</p><div className="shareRow"><button className="btn light" onClick={share}>{copied?"Tersalin!":"Bagikan"}</button><button className="btn dark" onClick={downloadHTML}>Download</button></div><h3>Terima Kasih</h3><b>{initials}</b></section>
      <footer>CupzProject — Wedding Generate</footer>
    </article>
   </section>
  </div>
  {open&&<div className="modal"><div className="modalbox"><button className="close" onClick={()=>setOpen(false)}>×</button><div className="heart">♡</div><small>THE WEDDING OF</small><h2>{initials}</h2><p>{displayDate}</p><button className="btn" onClick={()=>setOpen(false)}>Masuk Undangan</button></div></div>}
 </main>
}