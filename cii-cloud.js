import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* FIREBASE CONFIG */
const app = initializeApp({
apiKey:"AIzaSyCYCMvd3MLf4oYIzlLqJ5KjzwvJrMF0t4",
authDomain:"pj-official-dashboard.firebaseapp.com",
appId:"1:929357284971:web:2fd68f9f8f87c3a8d2137a",
storageBucket:"pj-official-dashboard.firebasestorage.app"
});

const db=getFirestore(app);
const storage=getStorage(app);

/* EMAIL INIT */
emailjs.init("EevqJ2-cX2wrZXXJO");

const root=document.body;

/* LOADER */
const loader=document.createElement("div");
loader.innerHTML=`<div id="bar"></div>`;
Object.assign(loader.style,{
position:"fixed",top:0,left:0,width:"100%",height:"4px",
background:"#222",display:"none",zIndex:9999
});
loader.firstChild.style.height="100%";
loader.firstChild.style.background="cyan";
root.appendChild(loader);

/* PLUS BTN (hidden by default) */
const plus=document.createElement("button");
plus.innerHTML="+";
Object.assign(plus.style,{
position:"fixed",top:"20px",right:"20px",
width:"60px",height:"60px",
borderRadius:"50%",border:"none",
fontSize:"32px",color:"#fff",
background:"linear-gradient(135deg,#007bff,#00d4ff)",
boxShadow:"0 0 20px rgba(0,140,255,.6)",
zIndex:9999,display:"none"
});
root.appendChild(plus);

/* SHOW ONLY IN CII PAGE */
const observer=new MutationObserver(()=>{
let cii=document.getElementById("cii");
if(!cii) return;
plus.style.display = cii.classList.contains("active") ? "block":"none";
});
observer.observe(document.body,{attributes:true,subtree:true});

/* PANEL */
const panel=document.createElement("div");
Object.assign(panel.style,{
position:"fixed",top:"50%",left:"50%",
transform:"translate(-50%,-50%) scale(0)",
background:"#111",padding:"30px",
borderRadius:"20px",color:"#fff",
boxShadow:"0 0 30px cyan",
zIndex:9999,transition:".3s",
textAlign:"center",width:"300px"
});

panel.innerHTML=`
<h3>Add Image</h3>
<input id="titleInput" placeholder="Title" style="padding:10px;width:90%;margin:10px;border-radius:10px;border:none">
<input type="file" id="fileInput">
<br><br>
<button id="postBtn">Save</button>

<hr style="margin:20px 0;border-color:red">
<h4 style="color:red">Danger Zone</h4>
<div id="deleteList"></div>
<br>
<button onclick="panelHide()">Close</button>
`;

root.appendChild(panel);
window.panelHide=()=>panel.style.transform="translate(-50%,-50%) scale(0)";
plus.onclick=()=>panel.style.transform="translate(-50%,-50%) scale(1)";

/* LOADER FUNC */
function start(){
loader.style.display="block";
loader.firstChild.style.width="0%";
let w=0;
let i=setInterval(()=>{
w+=10;
loader.firstChild.style.width=w+"%";
if(w>=100){clearInterval(i);loader.style.display="none";}
},100);
}

/* LOAD GALLERY */
async function loadGallery(){
let box=document.getElementById("cii");
if(!box) return;

document.querySelectorAll(".cardCII").forEach(e=>e.remove());
document.getElementById("deleteList").innerHTML="";

let snap=await getDocs(collection(db,"cii"));
snap.forEach(d=>{
let data=d.data();

let div=document.createElement("div");
div.className="cardCII";
div.innerHTML=`
<div style="background:#111;padding:15px;border-radius:15px;margin:20px 0">
<img src="${data.url}" style="width:100%;border-radius:10px">
<div style="margin:10px 0">${data.title}</div>
<a href="${data.url}" download target="_blank">
<button style="background:#00c853;color:#fff;padding:10px 20px;border:none;border-radius:10px">Download</button>
</a>
</div>`;
box.appendChild(div);

/* DELETE LIST */
let item=document.createElement("div");
item.innerHTML=`
${data.title}<br>
<button style="background:red;color:#fff;border:none;padding:6px 15px;border-radius:8px"
onclick="del('${d.id}','${data.file}')">Delete</button><hr>`;
document.getElementById("deleteList").appendChild(item);
});
}
loadGallery();

/* UPLOAD */
document.getElementById("postBtn").onclick=async()=>{
let file=document.getElementById("fileInput").files[0];
let title=document.getElementById("titleInput").value||"Untitled";
if(!file) return alert("Select image");

start();

let storageRef=ref(storage,"CII/"+Date.now()+file.name);
await uploadBytes(storageRef,file);
let url=await getDownloadURL(storageRef);

await addDoc(collection(db,"cii"),{title,url,file:storageRef.fullPath});
panelHide();
loadGallery();
};

/* DELETE */
window.del=async(id,file)=>{
if(!confirm("Delete this image?")) return;

let otp=Math.floor(100000+Math.random()*900000);
window.realOTP=otp;

await emailjs.send("Service_4mpzhc6","template_1rgmrr5",{otp});

let ask=prompt("Enter OTP sent to email");
if(ask!=otp) return alert("Wrong OTP");

start();
await deleteDoc(doc(db,"cii",id));
await deleteObject(ref(storage,file));
loadGallery();
};
