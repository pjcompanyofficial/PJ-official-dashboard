// ==========================
// CII CLOUD ULTRA SYSTEM
// ==========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ================= FIREBASE CONFIG
const app = initializeApp({
apiKey:"AIzaSyCYCMvd3MLf4oYIzlLqJ5KjzwvJrMF0t4",
authDomain:"pj-official-dashboard.firebaseapp.com",
appId:"1:929357284971:web:2fd68f9f8f87c3a8d2137a",
storageBucket:"pj-official-dashboard.firebasestorage.app"
});

const db=getFirestore(app);
const storage=getStorage(app);

// ================= EMAILJS INIT
(function(){
emailjs.init("EevqJ2-cX2wrZXXJO");
})();


// ================= UI ROOT
const root=document.body;


// ================= LOADER BAR
const loaderBox=document.createElement("div");
loaderBox.innerHTML=`<div id="loaderBar"></div>`;
Object.assign(loaderBox.style,{
position:"fixed",top:"0",left:"0",width:"100%",height:"4px",
background:"#222",display:"none",zIndex:"9999"
});
loaderBox.firstChild.style.height="100%";
loaderBox.firstChild.style.width="0%";
loaderBox.firstChild.style.background="linear-gradient(90deg,cyan,blue)";
root.appendChild(loaderBox);


// ================= PLUS BUTTON
const plus=document.createElement("button");
plus.innerHTML="+";
Object.assign(plus.style,{
position:"fixed",top:"20px",right:"20px",
width:"60px",height:"60px",borderRadius:"50%",
fontSize:"32px",border:"none",color:"#fff",
background:"linear-gradient(135deg,#007bff,#00d4ff)",
boxShadow:"0 0 20px rgba(0,140,255,.6)",
zIndex:"9999",cursor:"pointer"
});
root.appendChild(plus);


// ================= PANEL
const panel=document.createElement("div");
Object.assign(panel.style,{
position:"fixed",
top:"50%",left:"50%",
transform:"translate(-50%,-50%) scale(0)",
background:"#111",
padding:"30px",
borderRadius:"20px",
boxShadow:"0 0 30px cyan",
color:"#fff",
zIndex:"9999",
transition:".3s",
textAlign:"center",
width:"300px"
});

panel.innerHTML=`
<h2>Add Product</h2>
<input id="titleInput" placeholder="Title" style="padding:10px;width:90%;margin:10px;border-radius:10px;border:none">
<input type="file" id="fileInput">
<br><br>
<button id="postBtn">POST</button>

<hr style="margin:20px 0;border-color:red">

<h3 style="color:red">Danger Zone</h3>
<div id="deleteList"></div>

<br>
<button onclick="panelHide()">Back</button>
`;

root.appendChild(panel);


// ================= POPUP OTP
const popup=document.createElement("div");
Object.assign(popup.style,{
position:"fixed",
top:"50%",left:"50%",
transform:"translate(-50%,-50%) scale(0)",
background:"#111",
padding:"30px",
borderRadius:"20px",
color:"#fff",
textAlign:"center",
boxShadow:"0 0 30px red",
zIndex:"10000",
transition:".3s"
});

popup.innerHTML=`
<h2>OTP Verification</h2>
<input id="otpInput" placeholder="Enter OTP"
style="padding:12px;margin:15px;border-radius:10px;border:none;text-align:center">
<br>
<button id="confirmDelete">Confirm Delete</button>
`;
root.appendChild(popup);


// ================= PANEL SHOW/HIDE
plus.onclick=()=>panel.style.transform="translate(-50%,-50%) scale(1)";
window.panelHide=()=>panel.style.transform="translate(-50%,-50%) scale(0)";


// ================= POST IMAGE
document.getElementById("postBtn").onclick=async()=>{

let file=document.getElementById("fileInput").files[0];
let title=document.getElementById("titleInput").value || "Untitled";
if(!file) return alert("Select image");

startLoader();

let storageRef=ref(storage,"CII/"+Date.now()+file.name);
await uploadBytes(storageRef,file);
let url=await getDownloadURL(storageRef);

await addDoc(collection(db,"cii"),{
title,url,file:storageRef.fullPath
});

panelHide();
loadGallery();
};


// ================= LOAD GALLERY
async function loadGallery(){

let c=document.getElementById("cii") || document.body;
document.querySelectorAll(".cardCII").forEach(e=>e.remove());

let snap=await getDocs(collection(db,"cii"));

snap.forEach(d=>{
let data=d.data();

let div=document.createElement("div");
div.className="cardCII";

Object.assign(div.style,{
background:"#111",
borderRadius:"18px",
overflow:"hidden",
margin:"20px",
boxShadow:"0 0 20px #000",
textAlign:"center",
padding:"10px"
});

div.innerHTML=`
<img src="${data.url}" style="width:100%;height:200px;object-fit:cover">
<div style="padding:10px">${data.title}</div>

<a href="${data.url}" download target="_blank">
<button style="background:#00c853;color:#fff;padding:10px 20px;border:none;border-radius:10px">
Download
</button></a>
`;

c.appendChild(div);

// delete list item
let item=document.createElement("div");
item.style.margin="10px";
item.innerHTML=`
<div>${data.title}</div>
<button style="background:red;color:#fff;padding:8px 20px;border:none;border-radius:10px"
onmousedown="holdDelete(this,'${d.id}','${data.file}')">Hold Delete</button>
<div style="height:5px;background:red;width:0%"></div>
`;
document.getElementById("deleteList").appendChild(item);

});

}
loadGallery();


// ================= HOLD DELETE
window.holdDelete=(btn,id,file)=>{
let bar=btn.nextElementSibling;
let w=0;

let hold=setInterval(()=>{
w+=5;
bar.style.width=w+"%";

if(w>=100){
clearInterval(hold);
securityCheck(id,file);
}
},100);

btn.onmouseup=()=>clearInterval(hold);
btn.onmouseleave=()=>clearInterval(hold);
};


// ================= SECURITY QUESTIONS
async function securityCheck(id,file){

let q1=prompt("Company name?");
if(q1!=="PJ Company") return alert("Wrong");

let q2=prompt("Service?");
if(q2!=="Flute") return alert("Wrong");

let q3=prompt("YouTube Channel Link?");
if(q3!=="https://www.youtube.com/@PJCompany-432") return alert("Wrong");

alert("Sending OTP to Email...");

let otp=Math.floor(100000+Math.random()*900000);
window.realOTP=otp;
window.delID=id;
window.delFile=file;

emailjs.send("Service_4mpzhc6","template_1rgmrr5",{otp:otp});

popup.style.transform="translate(-50%,-50%) scale(1)";
}


// ================= VERIFY OTP
document.getElementById("confirmDelete").onclick=()=>{
let val=document.getElementById("otpInput").value;
if(val!=window.realOTP) return alert("Wrong OTP");

popup.style.transform="translate(-50%,-50%) scale(0)";
startDelete();
};


// ================= DELETE PROCESS
function startDelete(){

let p=0;
loaderBox.style.display="block";

let inter=setInterval(()=>{
p+=3;
loaderBox.firstChild.style.width=p+"%";

if(p>=100){
clearInterval(inter);
deleteFinal();
}
},900);

let stop=document.createElement("button");
stop.innerText="STOP DELETE";
Object.assign(stop.style,{
position:"fixed",bottom:"20px",left:"50%",
transform:"translateX(-50%)",
padding:"12px 25px",
background:"red",color:"#fff",
border:"none",borderRadius:"12px",
zIndex:"9999"
});
root.appendChild(stop);

stop.onclick=()=>{
clearInterval(inter);
stop.remove();
loaderBox.style.display="none";
};
}


// ================= FINAL DELETE
async function deleteFinal(){

await deleteDoc(doc(db,"cii",window.delID));
await deleteObject(ref(storage,window.delFile));

loaderBox.style.display="none";
alert("Deleted Successfully");
location.reload();
}


// ================= LOADER START
function startLoader(){
loaderBox.style.display="block";
let w=0;
let inter=setInterval(()=>{
w+=10;
loaderBox.firstChild.style.width=w+"%";
if(w>=100){
clearInterval(inter);
loaderBox.style.display="none";
}
},100);
}
