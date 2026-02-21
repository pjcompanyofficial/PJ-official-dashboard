// ===============================
// CII CLOUD SYSTEM
// ===============================

// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG
// ===============================
const app = initializeApp({
apiKey:"AIzaSyCYCMvd3MLf4oYIzlLqJ5KjzwvJrMF0t4",
authDomain:"pj-official-dashboard.firebaseapp.com",
appId:"1:929357284971:web:2fd68f9f8f87c3a8d2137a",
storageBucket:"pj-official-dashboard.firebasestorage.app"
});

const db = getFirestore(app);
const storage = getStorage(app);


// ===============================
// CREATE FLOATING BUTTON
// ===============================
const btn = document.createElement("button");
btn.innerHTML="＋";
btn.id="ciiCloudBtn";

Object.assign(btn.style,{
position:"fixed",
top:"80px",
right:"20px",
width:"60px",
height:"60px",
borderRadius:"50%",
border:"none",
fontSize:"30px",
background:"linear-gradient(135deg,#ff7a00,#ffb347)",
color:"#fff",
boxShadow:"0 0 20px rgba(255,122,0,.7)",
cursor:"pointer",
zIndex:"9999"
});

document.body.appendChild(btn);


// ===============================
// CREATE INPUT ELEMENTS
// ===============================
const fileInput=document.createElement("input");
fileInput.type="file";
fileInput.hidden=true;
document.body.appendChild(fileInput);

const titleInput=document.createElement("input");
titleInput.placeholder="Enter Image Title";
Object.assign(titleInput.style,{
position:"fixed",
top:"150px",
right:"20px",
padding:"10px",
borderRadius:"10px",
border:"1px solid #333",
background:"#000",
color:"#fff",
zIndex:"9999"
});
document.body.appendChild(titleInput);


// ===============================
// BUTTON CLICK
// ===============================
btn.onclick=()=> fileInput.click();


// ===============================
// UPLOAD IMAGE
// ===============================
fileInput.onchange = async e => {

let file=e.target.files[0];
if(!file) return;

let title = titleInput.value || "Untitled";

try{

let storageRef=ref(storage,"CII/"+Date.now()+file.name);

await uploadBytes(storageRef,file);

let url=await getDownloadURL(storageRef);

await addDoc(collection(db,"cii"),{
title:title,
url:url,
file:storageRef.fullPath
});

alert("Uploaded Successfully");

loadCII();

}catch(err){
alert("Upload Error");
console.error(err);
}

};



// ===============================
// LOAD IMAGES
// ===============================
async function loadCII(){

const container=document.getElementById("cii") || document.body;

let old=document.querySelectorAll(".ciiCard");
old.forEach(e=>e.remove());

let snap=await getDocs(collection(db,"cii"));

snap.forEach(d=>{

let data=d.data();

let card=document.createElement("div");
card.className="ciiCard";

Object.assign(card.style,{
background:"#020617",
padding:"12px",
margin:"15px",
borderRadius:"14px",
textAlign:"center",
boxShadow:"0 0 12px #000"
});

card.innerHTML=`
<div style="margin-bottom:10px">${data.title}</div>

<img src="${data.url}" style="width:200px;border-radius:10px"><br>

<a href="${data.url}" download target="_blank">
<button style="margin-top:10px;padding:10px 20px;background:#22c55e;color:white;border:none;border-radius:8px">
Download
</button></a>

<br>

<button style="margin-top:10px;background:red;color:white;padding:10px 20px;border:none;border-radius:8px"
onclick="startDelete('${d.id}','${data.file}')">
Delete
</button>
`;

container.appendChild(card);

});

}

loadCII();


// ===============================
// DELETE SYSTEM
// ===============================
window.startDelete = async(id,file)=>{

let q1=prompt("Company name?");
if(q1!=="PJ Company") return alert("Wrong");

let q2=prompt("Service?");
if(q2!=="Flute") return alert("Wrong");

alert("Wait 60 seconds...");
await new Promise(r=>setTimeout(r,60000));

let otp=Math.floor(100000+Math.random()*900000);
alert("OTP: "+otp);

// EmailJS send
emailjs.send("Service_4mpzhc6","template_1rgmrr5",{otp:otp});

let user=prompt("Enter OTP");
if(user!=otp) return alert("Wrong OTP");

deleteFinal(id,file);

};

async function deleteFinal(id,file){

await deleteDoc(doc(db,"cii",id));
await deleteObject(ref(storage,file));

alert("Deleted Successfully");
location.reload();

}



// ===============================
// EMAILJS INIT
// ===============================
(function(){
emailjs.init("EevqJ2-cX2wrZXXJO");
})();
