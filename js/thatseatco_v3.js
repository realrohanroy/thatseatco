/* NAV BURGER & DRAWER */
const burgerBtn = document.getElementById("burgerBtn");
const navDrawer = document.getElementById("navDrawer");
const drawerLinks = document.querySelectorAll(".nav-drawer a");

burgerBtn.addEventListener("click", () => {
  const isOpen = burgerBtn.classList.toggle("open");
  navDrawer.classList.toggle("open", isOpen);
});

drawerLinks.forEach(link => {
  link.addEventListener("click", () => {
    burgerBtn.classList.remove("open");
    navDrawer.classList.remove("open");
  });
});

/* NAV */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 60));

/* REVEAL */
const ro = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); }), { threshold: .07 });
document.querySelectorAll(".reveal").forEach(el => ro.observe(el));

/* TABS */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`[data-p="${tab.dataset.t}"]`).classList.add("active");
  });
});

/* SHOWCASE TOUCH SWIPE */
const panelsContainer = document.querySelector(".panels");
if (panelsContainer) {
  let touchStartX = 0;
  let touchEndX = 0;
  
  panelsContainer.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  panelsContainer.addEventListener("touchend", e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50; // pixels
    const diff = touchStartX - touchEndX;
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;
    
    const tabsArray = Array.from(document.querySelectorAll(".tab"));
    const currentIndex = tabsArray.indexOf(activeTab);
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left -> next tab
        const nextIndex = (currentIndex + 1) % tabsArray.length;
        tabsArray[nextIndex].click();
      } else {
        // Swiped right -> prev tab
        const prevIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
        tabsArray[prevIndex].click();
      }
    }
  }
}

/* PANEL IMG TILT */
document.querySelectorAll(".panel-img-wrap").forEach(w=>{
  const img=w.querySelector("img");
  if(!img)return;
  w.addEventListener("mousemove",e=>{
    const r=w.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    img.style.transform=`scale(1.05) rotate(${x*5}deg) translateY(${y*-10}px)`;
  });
  w.addEventListener("mouseleave",()=>img.style.transform="");
});

/* PROTEIN FINDER */
const finderData={
  muscle:{
    title:"Max Protein. Maximum Gains.",
    cards:[
      {name:"Protein Pretzels",stat:"18G protein per serving",color:"#3A5A30"},
      {name:"Protein Mousse",stat:"15G protein per cup",color:"#8A1040"},
      {name:"Protein Water",stat:"15G protein per bottle",color:"#000080"},
    ]
  },
  lean:{
    title:"High Protein. Low Guilt.",
    cards:[
      {name:"Protein Water",stat:"15G protein · 0G sugar",color:"#000080"},
      {name:"Butter Cups",stat:"7G protein · 2G sugar",color:"#C86818"},
      {name:"Protein Pretzels",stat:"18G protein · Baked not fried",color:"#3A5A30"},
    ]
  },
  energy:{
    title:"Fuel That Keeps You Going.",
    cards:[
      {name:"Protein Cookies",stat:"10–12G protein per serving",color:"#D94F72"},
      {name:"Protein Water",stat:"15G protein + electrolytes",color:"#000080"},
      {name:"Protein Pretzels",stat:"18G protein · Crunchy energy",color:"#D4A020"},
    ]
  },
  indulge:{
    title:"Indulge. Without the Aftermath.",
    cards:[
      {name:"Butter Cups",stat:"Chocolate shell · Creamy filling",color:"#C86818"},
      {name:"Protein Mousse",stat:"15G protein · Dessert texture",color:"#8A1040"},
      {name:"Protein Cookies",stat:"Chewy · Chocolatey · Guilt-free",color:"#3A7DC9"},
    ]
  },
  hydrate:{
    title:"Hydrate Smart. Protein Included.",
    cards:[
      {name:"Protein Water — Zesty Sip",stat:"Lemon Lime · 15G protein",color:"#6AAB2E"},
      {name:"Protein Water — Berry Burst",stat:"All Berries · 15G protein",color:"#7A3AAE"},
      {name:"Protein Water — Tropic Fuel",stat:"Mango Orange · 15G protein",color:"#D07820"},
    ]
  }
};

document.querySelectorAll(".finder-opt").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".finder-opt").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
    const goal=btn.dataset.goal;
    const data=finderData[goal];
    document.getElementById("finderTitle").textContent=data.title;
    const cards=document.getElementById("finderCards");
    cards.innerHTML=data.cards.map(c=>`
      <div class="finder-card">
        <div class="finder-card-dot" style="background:${c.color}"></div>
        <div class="finder-card-name">${c.name}</div>
        <div class="finder-card-stat">${c.stat}</div>
      </div>`).join("");
    const result=document.getElementById("finderResult");
    result.classList.add("show");
    result.style.animation="none";
    setTimeout(()=>result.style.animation="",10);
  });
});

/* NEWSLETTER */
document.querySelector(".nl-submit").addEventListener("click",()=>{
  const input=document.querySelector(".nl-input");
  if(input.value&&input.value.includes("@")){
    input.value="";
    input.placeholder="You are in. Welcome to the family.";
    setTimeout(()=>input.placeholder="your@email.com",4000);
  } else {
    input.style.border="2px solid #D94F72";
    setTimeout(()=>input.style.border="",1500);
  }
});
