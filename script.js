const $=id=>document.getElementById(id);let audioCtx=null,files=[];
const themes=["matrix","pink","blue","gold"];
function setTheme(t){document.body.classList.remove("pink","blue","gold");if(t!=="matrix")document.body.classList.add(t)}
function data(){return{name:$("name").value.trim(),from:$("from").value.trim(),message:$("message").value.trim()||"Have a wonderful birthday!",date:$("date").value,theme:$("theme").value,media:$("media").value.split(/\n/).map(x=>x.trim()).filter(x=>/^https:\/\//i.test(x)).slice(0,15)}}
function pack(d){return btoa(unescape(encodeURIComponent(JSON.stringify(d))))}
function unpack(){try{const p=new URLSearchParams(location.search).get("d");if(!p)return null;const d=JSON.parse(decodeURIComponent(escape(atob(p))));return{name:String(d.name||"").slice(0,45),from:String(d.from||"").slice(0,45),message:String(d.message||"Happy Birthday!").slice(0,600),date:String(d.date||""),theme:themes.includes(d.theme)?d.theme:"matrix",media:Array.isArray(d.media)?d.media.filter(x=>typeof x==="string"&&x.startsWith("https://")).slice(0,15):[]}}catch{return null}}

$("files").addEventListener("change",e=>{files=[...files,...e.target.files].slice(0,20);$("localFiles").innerHTML=files.map(f=>`<div class="fileline">${f.type.startsWith("image/")?"🖼":f.type.startsWith("video/")?"🎬":f.type.startsWith("audio/")?"♫":"📄"} ${f.name} · ${(f.size/1048576).toFixed(2)} MB</div>`).join("")});

function render(d){setTheme(d.theme);$("studio").classList.add("hidden");$("party").classList.remove("hidden");$("title").textContent=d.name?"HAPPY BIRTHDAY, "+d.name.toUpperCase()+"!":"HAPPY BIRTHDAY!";$("wish").textContent=d.message;$("birthdayDate").textContent=d.date?"✦ "+d.date:"";$("letterText").textContent=d.message;$("sign").textContent=d.from?"— "+d.from:"— WITH LOVE";const g=$("gallery");g.innerHTML="";d.media.forEach(url=>{const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";if(/\.(png|jpe?g|gif|webp)(\?.*)?$/i.test(url)){const im=document.createElement("img");im.src=url;im.alt="Birthday memory";a.append(im)}else if(/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)){const v=document.createElement("video");v.src=url;v.controls=true;v.preload="metadata";a.append(v)}else a.textContent="OPEN MEMORY ↗";g.append(a)});$("terminal").innerHTML="<p>&gt; initializing party.exe</p><p>&gt; loading balloons, cake and memories...</p><p>&gt; access granted. LET'S CELEBRATE!</p>"}

$("preview").addEventListener("click",()=>render(data()));
$("theme").addEventListener("change",e=>setTheme(e.target.value));

$("build").addEventListener("click",()=>{let base;try{base=new URL($("base").value.trim());if(base.protocol!=="https:")throw new Error("HTTPS required")}catch{$("status").textContent="ENTER A VALID PUBLIC HTTPS URL FIRST.";return}const u=new URL(base);u.searchParams.set("d",pack(data()));$("link").textContent=u.href;$("sharebox").classList.remove("hidden");$("qr").innerHTML="";if(typeof QRCode=== "undefined"){$("status").textContent="QR SCRIPT NOT LOADED. CHECK INTERNET AND RELOAD.";return}new QRCode($("qr"),{text:u.href,width:190,height:190,correctLevel:QRCode.CorrectLevel.M});$("status").textContent="LINK GENERATED. SCAN-TEST IT BEFORE SHARING."});

$("copy").addEventListener("click",async()=>{if(!$("link").textContent)return $("status").textContent="GENERATE LINK FIRST.";try{await navigator.clipboard.writeText($("link").textContent);$("status").textContent="LINK COPIED."}catch{$("status").textContent="SELECT AND COPY THE LINK MANUALLY."}});
$("wa").addEventListener("click",()=>{if(!$("link").textContent)return $("status").textContent="GENERATE LINK FIRST.";window.open("https://wa.me/?text="+encodeURIComponent("I made a birthday surprise for you 🎉 "+$("link").textContent),"_blank","noopener,noreferrer")});
$("download").addEventListener("click",()=>{const c=$("qr").querySelector("canvas"),im=$("qr").querySelector("img"),src=c?c.toDataURL("image/png"):im?.src;if(!src)return;const a=document.createElement("a");a.href=src;a.download="birthday-qr.png";a.click()});

$("letterBtn").addEventListener("click",()=>$("letter").classList.toggle("hidden"));
$("again").addEventListener("click",()=>{$("party").classList.add("hidden");$("studio").classList.remove("hidden")});

function chime(){if(!audioCtx)return;const now=audioCtx.currentTime;[523.25,659.25,783.99,1046.5,783.99,1046.5].forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(.0001,now+i*.22);g.gain.exponentialRampToValueAtTime(.09,now+i*.22+.025);g.gain.exponentialRampToValueAtTime(.0001,now+i*.22+.36);o.connect(g);g.connect(audioCtx.destination);o.start(now+i*.22);o.stop(now+i*.22+.38)})}
async function playSound(){try{audioCtx ||=new(window.AudioContext||window.webkitAudioContext)();await audioCtx.resume();chime();$("music").textContent="♫ PLAY CHIME AGAIN"}catch{$("music").textContent="SOUND UNAVAILABLE"}}
$("music").addEventListener("click",playSound);
$("sound").addEventListener("click",async()=>{try{audioCtx ||=new(window.AudioContext||window.webkitAudioContext)();await audioCtx.resume();chime();$("sound").textContent="♫ CHIME PLAYED"}catch{$("sound").textContent="SOUND UNAVAILABLE"}});

function shower(){const icons=["🎈","🎊","🎉","✨","💖","⭐","🎁"];for(let i=0;i<55;i++){const s=document.createElement("span");s.className="particle";s.textContent=icons[i%icons.length];s.style.left=Math.random()*100+"vw";s.style.animationDuration=(2.2+Math.random()*3)+"s";s.style.fontSize=(18+Math.random()*24)+"px";$("particles").append(s);setTimeout(()=>s.remove(),5500)}}
$("boom").addEventListener("click",shower);

const incoming=unpack();if(incoming)render(incoming);

// Decorative Matrix rain only.
const cv=$("matrix"),cx=cv.getContext("2d");let font=14,drops=[];
function size(){cv.width=innerWidth;cv.height=innerHeight;drops=Array(Math.ceil(cv.width/font)).fill(1)}
window.addEventListener("resize",size);size();
setInterval(()=>{cx.fillStyle="rgba(2,8,7,.09)";cx.fillRect(0,0,cv.width,cv.height);cx.fillStyle=getComputedStyle(document.body).getPropertyValue("--neon");cx.font=font+"px monospace";drops.forEach((y,i)=>{cx.fillText("01アイウエオカキクケコ"[Math.random()*16|0],i*font,y*font);if(y*font>cv.height&&Math.random()>.975)drops[i]=0;drops[i]++})},55);
