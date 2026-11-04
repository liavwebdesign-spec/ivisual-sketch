/* סקיצה כ · עמוד העבודות: אותה גלילה רכה כמו בעמוד הבית, הכותרת עולה מתוך מסכה, העמוד מתהפך לשחור בפוטר והפוטר נחשף מלמטה */
(function(){
  "use strict";
  var G=window.G,doc=G.doc;
  if(!G.hasGsap||G.still.matches)return;
  if(window.Lenis&&G.fine.matches){
    var lenis=new Lenis({autoRaf:false,lerp:.12});
    lenis.on("scroll",ScrollTrigger.update);
    gsap.ticker.add(function(t){lenis.raf(t*1000);});
    gsap.ticker.lagSmoothing(0);
    [document.getElementById("fs"),document.querySelector("dialog.lb")].forEach(function(el){if(el)el.setAttribute("data-lenis-prevent","");});
    var lock=function(){if(doc.classList.contains("fs-lock")||doc.style.overflow==="hidden")lenis.stop();else lenis.start();};
    new MutationObserver(lock).observe(doc,{attributes:true,attributeFilter:["class","style"]});
  }
  var ft=document.getElementById("ft");
  G.zone(ft,"dark");
  gsap.fromTo(document.getElementById("ftj-in"),{yPercent:-22},{yPercent:0,ease:"none",scrollTrigger:{trigger:ft,start:"top bottom",end:"top 20%",scrub:true}});
})();
