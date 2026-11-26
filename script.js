const $=id=>document.getElementById(id);
let chosenFiles=[];
let audioCtx=null, sound=false;
const safeThemes=["matrix","cyber","ice","gold"];
function theme(mode){document.body.classList.remove("mode-cyber","mode-ice","mode-gold");if(mode!=="matrix")document.body.classList.add("mode-"+mode)}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function bytes(n){if(n<1024)return n+" B";if(n<1048576)return (n/1024).toFixed(1)+" KB";return (n/1048576).toFixed(1)+" MB"}
function drawFiles(){
 const list=$("fileList");list.innerHTML="";
 if(!chosenFiles.length){list.innerHTML='<div class="empty">NO FILES ATTACHED YET // WAITING FOR INPUT</div>';return}
 chosenFiles.forEach((f,i)=>{
  const row=document.createElement("div");row.className="file-item";
  const symbol=f.type.startsWith("image/")?"▧":f.type.startsWith("video/")?"▶":f.type.startsWith("audio/")?"♫":f.type==="application/pdf"?"PDF":"▤";
  const thumb=f.type.startsWith("image/")?`<img class="file-thumb" src="${URL.createObjectURL(f)}" alt="">`:`<div class="file-symbol">${symbol}</div>`;
  row.innerHTML=`${thumb}<div><div class="file-name">${esc(f.name)}</div><div class="file-meta">${esc(f.type||"file")} · ${bytes(f.size)}</div></div><button class="remove-file" aria-label="Remove file">×</button>`;
  row.querySelector("button").addEventListener("click",()=>{chosenFiles.splice(i,1);drawFiles()});list.appendChild(row);
 });
}
$("mediaFiles").addEventListener("change",e=>{chosenFiles=[...chosenFiles,...e.target.files].slice(0,20);drawFiles();e.target.value=""});
function getData(){return{name:$("recipient").value.trim(),from:$("from").value.trim(),message:$("message").value.trim()||"Wishing you a legendary birthday!",theme:$("theme").value,date:$("date").value,media:$("mediaUrls").value.split(/\n/).map(x=>x.trim()).filter(Boolean).slice(0,12)}}
function encode(data,base){const u=new URL(base);u.searchParams.set("d",btoa(unescape(encodeURIComponent(JSON.stringify(data)))));return u.toString()}
function parseData(){try{const raw=new URLSearchParams(location.search).get("d");if(!raw)return null;const d=JSON.parse(decodeURIComponent(escape(atob(raw))));if(!d||typeof d!=="object")return null;return{name:String(d.name||"").slice(0,48),from:String(d.from||"").slice(0,48),message:String(d.message||"Happy Birthday!").slice(0,600),theme:safeThemes.includes(d.theme)?d.theme:"matrix",date:String(d.date||"").slice(0,20),media:Array.isArray(d.media)?d.media.filter(x=>typeof x==="string"&&/^https:\/\//i.test(x)).slice(0,12):[]}}catch{return null}}
function show(data){theme(data.theme);$("builder").classList.add("hidden");$("experience").classList.remove("hidden");$("wishTitle").textContent=data.name?"HAPPY BIRTHDAY, "+data.name.toUpperCase()+"!":"HAPPY BIRTHDAY!";$("wishMessage").textContent=data.message;$("wishDate").textContent=data.date?"✦ "+data.date:"";$("secretText").textContent=data.message;$("signature").textContent=data.from?"— "+data.from:"— WITH GOOD VIBES";const gal=$("publicGallery");gal.innerHTML="";data.media.forEach(url=>{const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";const ext=url.split("?")[0].toLowerCase();if(/\.(png|jpe?g|gif|webp|avif)$/.test(ext)){const img=document.createElement("img");img.src=url;img.alt="Shared birthday memory";a.append(img)}else if(/\.(mp4|webm|ogg|mov)$/.test(ext)){const v=document.createElement("video");v.src=url;v.controls=true;v.preload="metadata";a.append(v)}else{a.textContent="OPEN SHARED MEMORY ↗"}gal.append(a)});typeTerminal()}
function typeTerminal(){const lines=["> establishing secure birthday connection...","> decrypting good vibes...","> loading memory fragments...","> access granted. HAPPY BIRTHDAY!"];const t=$("terminal");t.innerHTML="";lines.forEach((line,i)=>setTimeout(()=>{const p=document.createElement("p");p.textContent=line;t.append(p)},i*430))}
$("previewBtn").addEventListener("click",()=>show(getData()));
$("revealBtn").addEventListener("click",()=>$("secret").classList.toggle("hidden"));
$("backBtn").addEventListener("click",()=>{$("experience").classList.add("hidden");$("builder").classList.remove("hidden")});
$("buildLink").addEventListener("click",()=>{let base;try{base=new URL($("siteUrl").value.trim());if(base.protocol!=="https:")throw 0}catch{$("status").textContent="ENTER A VALID PUBLIC HTTPS WEBSITE URL FIRST.";return}const link=encode(getData(),base);$("generatedLink").textContent=link;$("shareResult").classList.remove("hidden");$("qrcode").innerHTML="";if(typeof QRCode==="undefined"){$("status").textContent="QR LIBRARY NOT LOADED. CHECK INTERNET AND RELOAD.";return}new QRCode($("qrcode"),{text:link,width:190,height:190,correctLevel:QRCode.CorrectLevel.M});$("status").textContent="SHARE LINK + QR GENERATED. TEST ON ANOTHER PHONE."});
$("copyLink").addEventListener("click",async()=>{const l=$("generatedLink").textContent;if(!l)return $("status").textContent="BUILD THE SHARE LINK FIRST.";try{await navigator.clipboard.writeText(l);$("status").textContent="LINK COPIED TO CLIPBOARD."}catch{$("status").textContent="COPY BLOCKED BY BROWSER. SELECT THE LINK MANUALLY."}});
$("whatsapp").addEventListener("click",()=>{const l=$("generatedLink").textContent;if(!l)return $("status").textContent="BUILD THE SHARE LINK FIRST.";window.open("https://wa.me/?text="+encodeURIComponent("I made a birthday surprise for you ✨ Open it here: "+l),"_blank","noopener,noreferrer")});
$("downloadQr").addEventListener("click",()=>{const c=$("qrcode").querySelector("canvas"),im=$("qrcode").querySelector("img"),url=c?c.toDataURL("image/png"):im?.src;if(!url)return;const a=document.createElement("a");a.href=url;a.download="neon-birthday-qr.png";a.click()});
$("theme").addEventListener("change",e=>theme(e.target.value));
$("soundBtn").addEventListener("click",async()=>{sound=!sound;$("soundBtn").textContent=sound?"♫ SOUND ON":"♫ SOUND OFF";if(!sound)return;try{audioCtx ||=new(window.AudioContext||window.webkitAudioContext)();await audioCtx.resume();[440,554,659,880].forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=f;g.gain.setValueAtTime(.0001,audioCtx.currentTime+i*.13);g.gain.exponentialRampToValueAtTime(.08,audioCtx.currentTime+i*.13+.03);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+i*.13+.3);o.connect(g);g.connect(audioCtx.destination);o.start(audioCtx.currentTime+i*.13);o.stop(audioCtx.currentTime+i*.13+.32)})}catch{}});
$("confettiBtn").addEventListener("click",()=>{for(let i=0;i<55;i++){const s=document.createElement("i");s.textContent=["✦","✧","♥","▣"][i%4];s.style.cssText=`position:fixed;z-index:9;left:${Math.random()*100}vw;top:-25px;color:var(--neon);font-style:normal;font-size:${12+Math.random()*20}px;pointer-events:none;animation:rain ${2+Math.random()*2.5}s linear forwards`;document.body.append(s);setTimeout(()=>s.remove(),4800)}});
const anim=document.createElement("style");anim.textContent="@keyframes rain{to{transform:translateY(110vh) rotate(700deg);opacity:0}}";document.head.append(anim);
const incoming=parseData();if(incoming)show(incoming);
// Matrix-style falling characters are a decorative animation only.
const canvas=$("matrix"),ctx=canvas.getContext("2d");let cols=[],font=14;
function resize(){canvas.width=innerWidth;canvas.height=innerHeight;cols=Array(Math.ceil(canvas.width/font)).fill(1)}
addEventListener("resize",resize);resize();
setInterval(()=>{ctx.fillStyle="rgba(2,8,7,.09)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.body).getPropertyValue("--neon");ctx.font=font+"px monospace";cols.forEach((y,i)=>{ctx.fillText("01アイウエオカキクケコサシスセソ"[Math.floor(Math.random()*22)],i*font,y*font);if(y*font>canvas.height&&Math.random()>.975)cols[i]=0;cols[i]++})},55);
