const state={
  step:1, language:"en", registrationCompleted:false, locationDetected:false, centreSelected:false,
  cropCompleted:false, slotBooked:false, tokenGenerated:false, procurementCompleted:false,
  farmer:{name:"",mobile:"",aadhaar:"",village:""}, location:"", centre:"Greenfield Procurement Centre",
  distance:0, travelMinutes:0, headsUp:0, crop:"", quantity:"", unit:"", quality:"",
  date:"18 Sep",slot:"08:40 AM",token:"",queueAhead:12,queuePosition:13,waitMinutes:35,buffer:10
};
let queueTimer=null, tutorialIndex=0;

const translations={
 en:{
  navJourney:"Journey",navProcurement:"Procurement",navQueue:"Live Queue",navTrack:"Track",startJourney:"Start Journey",
  eyebrow:"SMART PROCUREMENT NETWORK",heroA:"Your harvest.",heroB:"Your slot.",heroC:"Your fair turn.",
  heroText:"One connected journey from your field to procurement — with location-aware alerts, live queue movement and a digital token that travels with you.",
  begin:"Begin procurement",tutorial:"Watch how it works",proof1:"GPS-aware centre",proof2:"10-slot buffer",proof3:"SMS-ready alerts",fieldNode:"FIELD NODE",gpsReady:"GPS ready",digitalToken:"DIGITAL TOKEN",tokenReady:"Generated after booking",queuePulse:"QUEUE PULSE",waitingFarmers:"farmers waiting",
  guidedTour:"A 2-minute guided tour",tourText:"See the entire procurement journey before you start.",fairByDesign:"Fair by design",fairText:"Every movement is timestamped so the farmer always knows what happens next.",
  journeyTitle:"From field to fair turn.",journeyText:"A single visual journey replaces confusing counters, queues and scattered updates.",
  j1:"Register",j1p:"Farmer profile",j2:"Locate",j2p:"Nearest centre",j3:"Crop",j3p:"Details & quality",j4:"Schedule",j4p:"Choose a slot",j5:"Token",j5p:"Digital pass",j6:"Queue",j6p:"Live movement",j7:"Arrive",j7p:"Centre tracking",j8:"Confirm",j8p:"QR completion",
  controlTitle:"Build your journey.",controlText:"Complete each stage once. KrishiPath carries the information forward.",yourJourney:"YOUR JOURNEY",s1:"Registration",s2:"Location",s3:"Centre",s4:"Crop details",s5:"Book slot",s6:"Token",secureFlow:"Connected journey",
  regTitle:"Tell us who is bringing the harvest.",regText:"Your details stay attached to this procurement journey.",name:"Farmer name",mobile:"Mobile number",aadhaar:"Aadhaar number",village:"Village / locality",privacy:"Only the information needed for your procurement journey is collected.",
  locTitle:"Let the route find your nearest centre.",locText:"Use live GPS to calculate the most suitable procurement centre.",detect:"Detect my location",
  centreTitle:"Your closest procurement point.",centreText:"The route is selected using your location.",smartAlert:"TRAVEL-AWARE ALERT",
  cropTitle:"What are you bringing today?",cropText:"Add crop and quantity so the centre can prepare for your arrival.",crop:"Crop",quantity:"Quantity",unit:"Unit",quality:"Quality",
  slotTitle:"Pick the time that works for you.",slotText:"Ten slots stay active in the buffer. When one opens, the next farmer moves in automatically.",
  tokenTitle:"Your procurement pass is ready.",tokenText:"Keep this token available. Queue movement and travel-aware alerts will update around it.",
  queueTitle:"The queue moves with you.",queueText:"A ten-slot rolling buffer keeps the next movement ready instead of leaving capacity idle.",alertTitle:"Distance changes your heads-up.",smsTitle:"Offline-ready notifications",bufferTitle:"10 ready. 11th moves in.",bufferText:"When any active slot closes, the next farmer is automatically pulled into the open position.",
  trackTitle:"Know exactly where your harvest is.",trackText:"Every milestone stays visible until the final QR confirmation.",offlineTitle:"No internet? Your journey doesn't disappear.",offlineText:"The token, latest queue information and essential journey details remain available on the device. SMS notifications keep the farmer informed when data connectivity is unavailable."
 },
 hi:{
  navJourney:"यात्रा",navProcurement:"खरीद",navQueue:"लाइव कतार",navTrack:"स्थिति",startJourney:"यात्रा शुरू करें",
  eyebrow:"स्मार्ट खरीद नेटवर्क",heroA:"आपकी फसल।",heroB:"आपका स्लॉट।",heroC:"आपकी उचित बारी।",
  heroText:"खेत से खरीद केन्द्र तक एक जुड़ी हुई यात्रा — स्थान आधारित अलर्ट, लाइव कतार और डिजिटल टोकन के साथ।",
  begin:"खरीद शुरू करें",tutorial:"कैसे काम करता है",proof1:"GPS केन्द्र चयन",proof2:"10-स्लॉट बफर",proof3:"SMS अलर्ट",fieldNode:"खेत स्थान",gpsReady:"GPS तैयार",digitalToken:"डिजिटल टोकन",tokenReady:"बुकिंग के बाद बनेगा",queuePulse:"कतार स्थिति",waitingFarmers:"किसान प्रतीक्षा में",
  guidedTour:"2 मिनट की मार्गदर्शिका",tourText:"शुरू करने से पहले पूरी खरीद यात्रा देखें।",fairByDesign:"न्यायपूर्ण व्यवस्था",fairText:"हर गतिविधि दर्ज होती है ताकि किसान को अगला कदम पता रहे।",
  journeyTitle:"खेत से उचित बारी तक।",journeyText:"एक स्पष्ट दृश्य यात्रा कतार और अलग-अलग अपडेट की उलझन को कम करती है।",
  j1:"पंजीकरण",j1p:"किसान प्रोफ़ाइल",j2:"स्थान",j2p:"निकटतम केन्द्र",j3:"फसल",j3p:"विवरण व गुणवत्ता",j4:"समय",j4p:"स्लॉट चुनें",j5:"टोकन",j5p:"डिजिटल पास",j6:"कतार",j6p:"लाइव स्थिति",j7:"पहुंचें",j7p:"केन्द्र स्थिति",j8:"पुष्टि",j8p:"QR पूरा",
  controlTitle:"अपनी यात्रा बनाएं।",controlText:"हर चरण पूरा करें; KrishiPath जानकारी आगे ले जाएगा।",yourJourney:"आपकी यात्रा",s1:"पंजीकरण",s2:"स्थान",s3:"केन्द्र",s4:"फसल विवरण",s5:"स्लॉट बुक करें",s6:"टोकन",secureFlow:"जुड़ी हुई यात्रा",
  regTitle:"फसल लाने वाले किसान की जानकारी दें।",regText:"आपकी जानकारी इसी खरीद यात्रा से जुड़ी रहेगी।",name:"किसान का नाम",mobile:"मोबाइल नंबर",aadhaar:"आधार नंबर",village:"गाँव / क्षेत्र",privacy:"आपकी खरीद यात्रा के लिए आवश्यक जानकारी ही ली जाती है।",
  locTitle:"रास्ता आपका निकटतम केन्द्र खोजे।",locText:"उपयुक्त खरीद केन्द्र चुनने के लिए लाइव GPS का उपयोग करें।",detect:"मेरा स्थान खोजें",
  centreTitle:"आपका सबसे नजदीकी खरीद केन्द्र।",centreText:"केन्द्र का मार्ग आपके स्थान के आधार पर चुना गया है।",smartAlert:"यात्रा आधारित अलर्ट",
  cropTitle:"आज आप कौन सी फसल ला रहे हैं?",cropText:"फसल और मात्रा दें ताकि केन्द्र आपकी तैयारी कर सके।",crop:"फसल",quantity:"मात्रा",unit:"इकाई",quality:"गुणवत्ता",
  slotTitle:"अपने लिए सही समय चुनें।",slotText:"बफर में दस स्लॉट सक्रिय रहते हैं। स्लॉट खुलते ही अगला किसान अपने आप आगे आता है।",
  tokenTitle:"आपका खरीद पास तैयार है।",tokenText:"इस टोकन को संभालकर रखें। कतार और यात्रा आधारित अलर्ट इसी के अनुसार बदलेंगे।",
  queueTitle:"कतार आपके साथ चलती है।",queueText:"दस-स्लॉट रोलिंग बफर अगली गति तैयार रखता है।",alertTitle:"दूरी के अनुसार अलर्ट समय बदलता है।",smsTitle:"ऑफलाइन SMS सूचनाएँ",bufferTitle:"10 तैयार। 11वाँ आगे।",bufferText:"कोई सक्रिय स्लॉट पूरा होते ही अगला किसान अपने आप खाली स्थान में आ जाता है।",
  trackTitle:"अपनी फसल की स्थिति जानें।",trackText:"अंतिम QR पुष्टि तक हर चरण दिखाई देता है।",offlineTitle:"इंटरनेट नहीं है? यात्रा गायब नहीं होगी।",offlineText:"टोकन, नवीनतम कतार जानकारी और जरूरी विवरण डिवाइस पर उपलब्ध रहेंगे। इंटरनेट न होने पर SMS किसान को सूचित करता रहेगा।"
 }
};

function $(id){return document.getElementById(id)}
function startProcurement(){document.querySelector("#procurement").scrollIntoView({behavior:"smooth"});goToStep(1)}
function goToStep(step){
  if(step>1&&!state.registrationCompleted){step=1}
  if(step>2&&!state.locationDetected){step=2}
  if(step>3&&!state.centreSelected){step=3}
  if(step>4&&!state.cropCompleted){step=4}
  if(step>5&&!state.slotBooked){step=5}
  state.step=step;
  document.querySelectorAll(".wizard-step").forEach(x=>x.classList.remove("active"));
  $("step"+step).classList.add("active");
  document.querySelectorAll(".step-link").forEach(x=>{x.classList.toggle("active",+x.dataset.step===step);x.classList.toggle("done",+x.dataset.step<step)})
  $("stepCounter").textContent=`0${step} / 06`; $("wizardProgress").style.width=`${step/6*100}%`;
  document.querySelector("#procurement").scrollIntoView({behavior:"smooth",block:"start"});
}
function nextStep(){
  if(!validateStep(state.step))return;
  if(state.step===1)state.registrationCompleted=true;
  if(state.step===2)state.locationDetected=true;
  if(state.step===3)state.centreSelected=true;
  if(state.step===4){state.cropCompleted=true;updateCropPreview()}
  if(state.step===5){state.slotBooked=true;generateToken();return}
  goToStep(Math.min(6,state.step+1));updateAll();
}
function previousStep(){goToStep(Math.max(1,state.step-1))}
function validateStep(step){
  if(step===1){
    const n=$("farmerName").value.trim(),m=$("farmerMobile").value.trim(),a=$("farmerAadhaar").value.trim(),v=$("farmerVillage").value.trim();
    if(!n||!/^\d{10}$/.test(m)||!/^\d{12}$/.test(a)||!v){showToast("Please complete all registration fields correctly.");return false}
    state.farmer={name:n,mobile:m,aadhaar:a,village:v}; return true;
  }
  if(step===2&&!state.locationDetected){showToast("Please detect your location first.");return false}
  if(step===3&&!state.locationDetected){showToast("Location is required to select the centre.");return false}
  if(step===4){
    state.crop=$("crop").value;state.quantity=$("quantity").value;state.unit=$("unit").value;
    if(!state.crop||!state.quantity||Number(state.quantity)<=0||!state.unit||!state.quality){showToast("Please enter crop, quantity, unit and quality.");return false} return true;
  }
  if(step===5&&!state.slot){showToast("Please select a time slot.");return false}
  return true;
}
function detectLocation(){
  $("gpsButton").disabled=true;$("gpsButton").textContent="Locating…";$("gpsStatus").textContent="GPS scanning";
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      const lat=pos.coords.latitude,lon=pos.coords.longitude;
      state.locationDetected=true;
      const seed=Math.abs(Math.sin(lat*12.9898+lon*78.233));
      state.distance=Number((2.4+seed*26).toFixed(1));state.travelMinutes=Math.max(7,Math.round(state.distance*2.05));
      state.headsUp=state.distance<5?15:state.distance<15?30:state.distance<30?60:90;
      state.location=`${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
      applyLocation();showToast("Location detected. Nearest route updated.");
    },()=>fallbackLocation());
  }else fallbackLocation();
}
function fallbackLocation(){
  state.locationDetected=true;state.distance=6.8;state.travelMinutes=14;state.headsUp=30;state.location="Location permission unavailable";
  applyLocation();showToast("Location could not be read. Please use the nearest-centre route.");
}
function applyLocation(){
  $("gpsStatus").textContent="GPS READY";$("locationResult").textContent=state.location;
  $("locationDescription").textContent=`Nearest centre selected at approximately ${state.distance} km. Travel time is about ${state.travelMinutes} minutes.`;
  $("centreAddress").textContent=`Route selected from your current location • ${state.distance} km away`;
  $("centreDistance").textContent=`${state.distance} km`;$("travelTime").textContent=`${state.travelMinutes} min travel`;
  $("alertPreview").textContent=`You will receive a heads-up ${state.headsUp} minutes before your slot.`;
  $("heroLocation").textContent=state.distance+" km to centre";state.centreSelected=true;updateAll();
}
function chooseQuality(btn,value){document.querySelectorAll(".quality-row button").forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");state.quality=value}
function updateCropPreview(){
  $("cropPreview").textContent=state.crop?`${state.crop} • ${state.quality}`:"Crop details will appear here";
  $("cropQuantityPreview").textContent=state.quantity?`${state.quantity} ${state.unit}`:"Quantity pending";
}
function selectDate(btn,date){document.querySelectorAll(".date-card").forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");state.date=date}
function selectSlot(btn,slot){document.querySelectorAll(".time-slot").forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");state.slot=slot}
function generateToken(){
  if(!state.token)state.token="KP-"+Math.floor(100000+Math.random()*900000);
  state.tokenGenerated=true;state.queueAhead=12;state.queuePosition=13;state.waitMinutes=35;state.buffer=10;
  updateAll();goToStep(6);showToast("Digital token generated. Your live journey is active.");
  clearInterval(queueTimer);queueTimer=setInterval(()=>{if(state.tokenGenerated&&!state.procurementCompleted&&state.queueAhead>0){state.queueAhead--;state.queuePosition=Math.max(1,state.queueAhead+1);state.waitMinutes=Math.max(5,state.queueAhead*3);updateAll()}},18000);
}
function updateAll(){
  updateHero();updateQueue();updateTracking();updateToken();updateBuffer();
}
function updateHero(){
  $("heroToken").textContent=state.token||"— — —";$("heroQueue").textContent=state.tokenGenerated?state.queueAhead:"—";
}
function updateToken(){
  $("tokenNumber").textContent=state.token||"KP-000000";$("tokenFarmer").textContent=state.farmer.name||"—";$("tokenCrop").textContent=state.crop||"—";
  $("tokenQty").textContent=state.quantity?`${state.quantity} ${state.unit}`:"—";$("tokenDate").textContent=state.date+" • "+state.slot;
  $("tokenCentre").textContent=state.centre;$("tokenAlert").textContent=state.headsUp?`${state.headsUp} min heads-up`:"—";
  $("trackToken").textContent=state.token||"—";
}
function updateQueue(){
  $("queuePosition").textContent=state.tokenGenerated?state.queuePosition:"—";$("queueAhead").textContent=state.tokenGenerated?state.queueAhead:"—";
  $("waitTime").textContent=state.tokenGenerated?`${state.waitMinutes} min`:"—";$("bufferCount").textContent=state.tokenGenerated?"10/10":"—";$("bufferBig").textContent=state.tokenGenerated?state.buffer:"10";
  $("queueStatusTitle").textContent=state.tokenGenerated?(state.procurementCompleted?"Procurement completed":"Live position active"):"Waiting for a token";
  $("alertDistance").textContent=state.distance?`${state.distance} km`:"—";$("alertTravel").textContent=state.travelMinutes?`${state.travelMinutes} min`:"—";$("alertMinutes").textContent=state.headsUp?`${state.headsUp} min`:"—";
  $("alertMeterFill").style.width=state.headsUp?`${Math.min(100,state.headsUp/90*100)}%`:"0%";
  $("smsStatus").textContent=state.tokenGenerated?`Alerts active for ${state.farmer.mobile.slice(0,3)}•••••••${state.farmer.mobile.slice(-2)}.`:"Token alerts will be available here.";
}
function updateBuffer(){
  const el=$("bufferSlots");el.innerHTML="";
  for(let i=1;i<=10;i++){const s=document.createElement("span");s.textContent=String(i).padStart(2,"0");if(state.tokenGenerated&&i===Math.min(10,state.queuePosition))s.className="current";el.appendChild(s)}
  if(state.tokenGenerated){const n=document.createElement("span");n.textContent="11";n.className="next";el.appendChild(n)}
}
function refreshQueue(){
  if(!state.tokenGenerated){showToast("Generate your token to enter the live queue.");return}
  if(state.procurementCompleted){showToast("Procurement is already completed.");return}
  if(state.queueAhead>0){state.queueAhead--;state.queuePosition=Math.max(1,state.queueAhead+1);state.waitMinutes=Math.max(5,state.queueAhead*3);showToast("Queue refreshed. A slot has moved forward.");}
  else showToast("You are next. Please proceed to the centre when notified.");
  updateAll();
}
function showQueue(){document.querySelector("#queue").scrollIntoView({behavior:"smooth"});updateAll()}
function updateTracking(){
  const labels=[["Registration completed","Farmer details verified"],["Slot booked","Time and date reserved"],["Waiting in queue","Live buffer position"],["Visit centre","Arrive at allotted time"],["Verification & weighing","Crop checked and weighed"],["Procurement completed","QR confirmation"]];
  $("timeline").innerHTML=labels.map((x,i)=>{
    let cls="";
    if(!state.tokenGenerated){cls=i===0&&state.registrationCompleted?"done":""}
    else if(state.procurementCompleted)cls="done";
    else if(i<2)cls="done"; else if(i===2)cls="current";
    return `<div class="timeline-item ${cls}"><div class="timeline-dot"></div><strong>${x[0]}</strong><span>${x[1]}</span></div>`;
  }).join("");
  $("trackStatus").textContent=!state.tokenGenerated?"NOT STARTED":state.procurementCompleted?"COMPLETED":"IN PROGRESS";
  $("trackHeadline").textContent=!state.tokenGenerated?"Your journey will appear here.":state.procurementCompleted?"Procurement successfully confirmed.":"Your procurement journey is active.";
  $("confirmBtn").disabled=!state.tokenGenerated||state.procurementCompleted;
}
function confirmProcurement(){
  if(!state.tokenGenerated)return;
  state.procurementCompleted=true;state.queueAhead=0;state.queuePosition=1;state.waitMinutes=0;state.buffer=0;updateAll();showToast("QR scanned. Procurement successfully confirmed.");
}
function resetProcurement(){
  Object.assign(state,{step:1,registrationCompleted:false,locationDetected:false,centreSelected:false,cropCompleted:false,slotBooked:false,tokenGenerated:false,procurementCompleted:false,farmer:{name:"",mobile:"",aadhaar:"",village:""},location:"",distance:0,travelMinutes:0,headsUp:0,crop:"",quantity:"",unit:"",quality:"",date:"18 Sep",slot:"08:40 AM",token:"",queueAhead:12,queuePosition:13,waitMinutes:35,buffer:10});
  ["farmerName","farmerMobile","farmerAadhaar","farmerVillage","quantity"].forEach(id=>$(id).value="");$("crop").value="";$("unit").value="";
  document.querySelectorAll(".quality-row button,.date-card,.time-slot").forEach(b=>b.classList.remove("selected"));document.querySelector(".date-card").classList.add("selected");document.querySelector(".time-slot").classList.add("selected");
  clearInterval(queueTimer);updateAll();goToStep(1);showToast("New procurement journey started.");
}
function changeLanguage(){
  state.language=state.language==="en"?"hi":"en";$("langBtn").textContent=state.language==="en"?"हिन्दी":"English";
  document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(translations[state.language][key])el.textContent=translations[state.language][key]});
  showToast(state.language==="hi"?"हिन्दी भाषा सक्रिय":"English language active");
}
$("langBtn").addEventListener("click",changeLanguage);
document.querySelectorAll(".step-link").forEach(b=>b.addEventListener("click",()=>goToStep(+b.dataset.step)));
$("quantity").addEventListener("input",updateCropPreview);$("crop").addEventListener("change",updateCropPreview);$("unit").addEventListener("change",updateCropPreview);

const tutorial=[
 ["Register once.","Create your farmer profile and begin a connected procurement journey."],
 ["Find the right centre.","GPS identifies the nearest procurement route and estimates your travel time."],
 ["Choose your time.","Pick a date and slot while the ten-slot rolling buffer keeps the next movement ready."],
 ["Follow the queue.","Your position, waiting time and distance-aware notification timing update as the queue moves."],
 ["Confirm with QR.","Reach the centre, complete verification and scan the QR to close the procurement journey."]
];
function openTutorial(){tutorialIndex=0;renderTutorial();$("tutorialModal").classList.add("open")}
function closeTutorial(){$("tutorialModal").classList.remove("open")}
function renderTutorial(){$("tutorialNumber").textContent=String(tutorialIndex+1).padStart(2,"0");$("tutorialHead").textContent=tutorial[tutorialIndex][0];$("tutorialCopy").textContent=tutorial[tutorialIndex][1];$("tutorialDots").innerHTML=tutorial.map((_,i)=>`<span class="${i===tutorialIndex?"active":""}"></span>`).join("")}
function tutorialNext(){tutorialIndex=(tutorialIndex+1)%tutorial.length;renderTutorial()}
function tutorialPrev(){tutorialIndex=(tutorialIndex-1+tutorial.length)%tutorial.length;renderTutorial()}
window.addEventListener("online",()=>{$("connectionText").textContent="Online connection";showToast("Connection restored.")});
window.addEventListener("offline",()=>{$("connectionText").textContent="Offline access active";showToast("Offline access active. Your saved journey remains available.")});
updateAll();

if ("serviceWorker" in navigator) { window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(()=>{})); }
