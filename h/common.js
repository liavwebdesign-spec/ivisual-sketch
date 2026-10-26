/* סקיצות ח ו-ט · מה שמשותף לעמוד הבית ולעמוד העבודות: גלילה רכה, הדר ותפריט, צבע ההדר לפי הרקע, אזורים כהים, פוטר, עיגול "לפרויקט".
   הבסיס מסקיצה ז. ט טוענת את הקובץ הזה מ-../h, ו-html[data-sk] אומר באיזו סקיצה אנחנו */
(function(){
  "use strict";
  var doc=document.documentElement;
  var still=matchMedia("(prefers-reduced-motion: reduce)");
  var fine=matchMedia("(hover:hover) and (pointer:fine)");
  var hasGsap=!!(window.gsap&&window.ScrollTrigger);
  if(hasGsap){gsap.registerPlugin(ScrollTrigger);if(window.Flip)gsap.registerPlugin(Flip);if(window.Draggable)gsap.registerPlugin(Draggable,window.InertiaPlugin);}
  var C=window.CONTENT;
  var home=!!document.getElementById("top");
  var P=home?"":"./";
  var lb=lightbox();
  document.querySelector("dialog.lb").setAttribute("aria-label","עבודה מתיק העבודות");

  // מנהל המכירות: הטלפון והוואטסאפ של כל דרכי הקשר (לילך, 18.10)
  var SALES="054-777-2388",SALES_TEL="tel:+972547772388";
  var WA="https://wa.me/972547772388?text="+encodeURIComponent("שלום, הגעתי מהאתר של ויזואל ואשמח לדבר על פרויקט.");
  var ARR='<svg class="arr" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 10H5m4-4-4 4 4 4"/></svg>';
  var TAG={branding:"מיתוג",web:"אתרים",digital:"שיווק"};

  /* העבודות הטובות קודם, ובתוכן הציבוריות */
  var W=WORKS.slice().sort(function(a,b){
    var q={good:0,ok:1,poor:2};
    return (q[a.quality]!=null?q[a.quality]:1)-(q[b.quality]!=null?q[b.quality]:1)||(b.public_body===true)-(a.public_body===true);
  });
  function file(w){return w.src.split("/").pop();}
  function thumb(w){return w.thumb||"../f/img/t/"+file(w);}
  function deps(w){return w.departments.length===3?"כל המחלקות":w.departments.map(function(d){return DEPTS_SHORT[d];}).join(" · ");}
  function lbItem(w){return {full:w.src,fw:w.w,fh:w.h,alt:w.alt_he,cap:w.client_he+" · "+w.title_he};}
  function tags(ds){return ["branding","web","digital"].filter(function(d){return ds[d];}).map(function(d){return TAG[d];});}

  /* ================= גלילה רכה לעוגנים: האצה והאטה עדינות, וגלגלת או מגע עוצרים אותה ================= */
  var glide=null;
  function stopGlide(){if(glide){glide.kill();glide=null;}}
  ["wheel","touchstart","keydown"].forEach(function(t){addEventListener(t,stopGlide,{passive:true});});
  function scrollToY(y){
    y=Math.max(0,Math.min(y,doc.scrollHeight-innerHeight));stopGlide();
    if(still.matches||!hasGsap){scrollTo(0,y);return;}
    var o={y:scrollY},d=Math.abs(y-scrollY);
    glide=gsap.to(o,{y:y,duration:Math.min(2,.8+d/5000),ease:"power3.inOut",onUpdate:function(){scrollTo(0,o.y);},onComplete:function(){glide=null;}});
  }
  document.addEventListener("click",function(e){
    if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;
    var id=a.getAttribute("href").slice(1),t=id&&document.getElementById(id);if(!t)return;
    e.preventDefault();
    if(id==="top")scrollToY(0);else scrollToY(t.getBoundingClientRect().top+scrollY);
    if(history.pushState)history.pushState(null,"","#"+id);
    if(!/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(t.tagName)&&!t.hasAttribute("tabindex"))t.setAttribute("tabindex","-1");
    t.focus({preventScroll:true});
  });

  /* ================= הדר ותפריט מסך מלא שנפתח בעיגול מהכפתור (MV:hd4) ================= */
  var SOC={
    fb:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.8.8 2.3l.1.3-.3 1.2c0 .2-.2.2-.4.1-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A10 10 0 1 0 12 2Z"/></svg>'
  };
  (function(){
    var hd=document.getElementById("hd"),btn=document.getElementById("fs-open"),fs=document.getElementById("fs");
    var closeBtn=fs.querySelector(".fs-close");
    headroom(hd);
    document.getElementById("fs-side").innerHTML=
      '<a href="'+SALES_TEL+'">'+IC.tel+'<span>התקשרו</span></a>'+
      '<a href="'+WA+'" target="_blank" rel="noopener">'+IC.wa+'<span>וואטסאפ</span></a>'+
      (C?'<a href="'+C.contact.facebook+'" target="_blank" rel="noopener">'+SOC.fb+'<span>פייסבוק</span></a>'+
         '<a href="'+C.contact.pinterest+'" target="_blank" rel="noopener">'+SOC.pin+'<span>פינטרסט</span></a>':'');
    function set(open,back){
      if(open){
        var r=btn.getBoundingClientRect();
        // כפתור הסגירה מקבל את הצורה של כפתור התפריט ברגע הפתיחה (מילה או ריבוע), בלי מעבר
        fs.classList.add("sw");fs.classList.toggle("sq",hd.classList.contains("is-scrolled"));void closeBtn.offsetWidth;fs.classList.remove("sw");
        fs.style.setProperty("--cx",(r.left+r.width/2)+"px");fs.style.setProperty("--cy",(r.top+r.height/2)+"px");
      }
      fs.classList.toggle("open",open);fs.inert=!open;
      btn.setAttribute("aria-expanded",String(open));hd.classList.toggle("menu-open",open);
      doc.style.scrollbarGutter=open?"stable":"";doc.style.overflow=open?"hidden":"";doc.classList.toggle("fs-lock",open);
      if(open)setTimeout(function(){closeBtn.focus({preventScroll:true});},still.matches?0:320);
      else if(back!==false)btn.focus({preventScroll:true});
    }
    // הטבעת מהלוגו מאחורי הפריטים: אישון הליים מסתכל על הפריט שמרחפים עליו
    var pupil=fs.querySelector(".fs-pupil");
    function look(a){
      var i=+getComputedStyle(a).getPropertyValue("--i")||0,t=Math.PI-(i-2)*.34,R=46.5;
      pupil.style.translate=(R*Math.cos(t)*20).toFixed(1)+"% "+(R*Math.sin(t)*20).toFixed(1)+"%";
    }
    fs.querySelectorAll(".fs-links a").forEach(function(a){a.addEventListener("mouseenter",function(){look(a);});a.addEventListener("focus",function(){look(a);});});
    btn.addEventListener("click",function(){set(true);});
    closeBtn.addEventListener("click",function(){set(false);});
    fs.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){set(false,false);});});
    addEventListener("keydown",function(e){
      if(!fs.classList.contains("open"))return;
      if(e.key==="Escape"){set(false);return;}
      if(e.key!=="Tab")return;
      var f=[].slice.call(fs.querySelectorAll("a,button"));
      var i=f.indexOf(document.activeElement);
      var n=e.shiftKey?(i<=0?f.length-1:i-1):(i===f.length-1?0:i+1);
      e.preventDefault();f[n].focus();
    });
  })();

  /* ================= צבע ההדר והלוגו לפי מה שמתחתיו (פגישת 26.10: "לוגו שמשנה צבע לפי הרקע, כמו במצגת") =================
     כל סקשן מסומן data-hd (light, dark או green), וההדר לוקח את הצבע של הסקשן שבגובה שלו. בח הסקשנים צבועים בעצמם
     ונחתכים חד; בט כל העמוד מתחלף (is-dark, is-green), וההדר הולך אחרי --ink. בשתיהן data-hd מעדכן את צבע הדפדפן בטלפון */
  var sk=doc.getAttribute("data-sk")||"h",themeMeta=document.querySelector('meta[name="theme-color"]'),hdEls=[],hdNow="";
  function paintMeta(){
    if(!themeMeta)return;
    var t=sk==="i"?(doc.classList.contains("is-green")?"green":doc.classList.contains("is-dark")?"dark":"light"):hdNow;
    themeMeta.setAttribute("content",t==="green"?"#8CC63F":t==="dark"?(getComputedStyle(doc).getPropertyValue("--dark").trim()||"#19181C"):"#FFFFFF");
  }
  function hdCheck(){
    var y=(parseFloat(getComputedStyle(doc).getPropertyValue("--hx-h"))||84)/2,t="light";
    for(var i=0;i<hdEls.length;i++){var r=hdEls[i].getBoundingClientRect();if(r.height&&r.top<=y&&r.bottom>y)t=hdEls[i].getAttribute("data-hd");}
    if(t!==hdNow){hdNow=t;doc.setAttribute("data-hd",t);paintMeta();}
    flCheck();
  }
  // הלוגו הצף מפנה את המקום ללוגו של הפוטר כשהוא עובר מתחתיו (בטלפון הפוטר גבוה מהמסך, ובסוף העמוד הם נפגשים)
  var flogo=document.querySelector(".flogo"),ftLogo=document.querySelector(".ftg-logo");
  function flCheck(){
    if(!flogo||!ftLogo)return;
    var a=ftLogo.getBoundingClientRect(),b=flogo.getBoundingClientRect();
    doc.classList.toggle("fl-off",a.top<b.bottom+12&&a.bottom>b.top-12);
  }
  function hdScan(){hdEls=[].slice.call(document.querySelectorAll("[data-hd]"));hdCheck();}
  var hdRaf=0;
  addEventListener("scroll",function(){if(!hdRaf)hdRaf=requestAnimationFrame(function(){hdRaf=0;hdCheck();});},{passive:true});
  addEventListener("resize",hdCheck);
  if(hasGsap)ScrollTrigger.addEventListener("refresh",hdCheck);
  hdScan();

  /* ================= אזורים כהים וירוקים (ט): כשמגיעים אליהם, כל העמוד מתחלף לצבע שלהם ================= */
  var toneN={dark:0,green:0};
  function setTone(){
    doc.classList.toggle("is-green",toneN.green>0);
    doc.classList.toggle("is-dark",toneN.dark>0&&!toneN.green);
    paintMeta();
  }
  function setDark(on){toneN.dark=on?Math.max(1,toneN.dark):0;setTone();}
  function zone(el,t){
    if(!hasGsap||!el)return;
    ScrollTrigger.create({trigger:el,start:"top 55%",end:"bottom 45%",onToggle:function(s){toneN[t]=Math.max(0,toneN[t]+(s.isActive?1:-1));setTone();}});
  }
  function darkZone(el){zone(el,"dark");}

  /* ================= פוטר: עמודות ורשתות ================= */
  (function(){
    var d=C?C.depts:{branding:{name:DEPTS.branding},web:{name:DEPTS.web},digital:{name:DEPTS.digital}};
    function col(h,items){return '<div><h3>'+h+'</h3><ul>'+items.map(function(x){return '<li>'+x+'</li>';}).join("")+'</ul></div>';}
    document.getElementById("ft-cols").innerHTML=
      col("האתר",['<a href="work.html">פרויקטים</a>','<a href="'+P+'#depts">מחלקות</a>','<a href="'+P+'#clients">לקוחות</a>','<a href="'+P+'#contact">צור קשר</a>'])+
      col("מחלקות",["branding","web","digital"].map(function(k){return '<a href="work.html?d='+k+'">'+d[k].name+'</a>';}))+
      col("דברו איתנו",['<a href="'+SALES_TEL+'"><span dir="ltr">'+SALES+'</span></a>','<a href="'+WA+'" target="_blank" rel="noopener">וואטסאפ</a>']);
    if(C)document.getElementById("ft-soc").innerHTML=
      '<li><a href="'+C.contact.facebook+'" target="_blank" rel="noopener" aria-label="פייסבוק">'+SOC.fb+'</a></li>'+
      '<li><a href="'+C.contact.pinterest+'" target="_blank" rel="noopener" aria-label="פינטרסט">'+SOC.pin+'</a></li>'+
      '<li><a href="'+WA+'" target="_blank" rel="noopener" aria-label="וואטסאפ">'+IC.wa+'</a></li>';
  })();

  /* ================= בורר הרקע הכהה: להשוואה בפגישה, מופיע רק כשהרקע כהה ================= */
  (function(){
    var box=document.getElementById("bgp");if(!box)return;
    var BG=[["","שחור רך","#19181C"],["night","כחול לילה","#131A30"],["olive","זית","#1B2013"],["plum","שזיף","#221B26"]];
    var now=doc.getAttribute("data-bg")||"";
    box.insertAdjacentHTML("beforeend",BG.map(function(b){
      return '<button type="button" data-v="'+b[0]+'" aria-pressed="'+(b[0]===now)+'" style="--sw:'+b[2]+'" aria-label="רקע '+b[1]+'"><i aria-hidden="true"></i><span>'+b[1]+'</span></button>';
    }).join(""));
    box.addEventListener("click",function(e){
      var b=e.target.closest("button");if(!b)return;
      var v=b.dataset.v;
      if(v)doc.setAttribute("data-bg",v);else doc.removeAttribute("data-bg");
      box.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});
      var p=new URLSearchParams(location.search);if(v)p.set("bg",v);else p.delete("bg");
      history.replaceState(null,"",location.pathname+(p.toString()?"?"+p:"")+location.hash);
      paintMeta();
    });
  })();

  /* ================= "לפרויקט": עיגול לבן שרודף את העכבר מעל עבודות (פגישת 26.10: "לבן, לא ירוק") ================= */
  function projectCursor(roots,sel){
    if(!hasGsap||!fine.matches||still.matches)return;
    doc.classList.add("pc-on");
    var pc=document.getElementById("pc"),on=false,qx=gsap.quickTo(pc,"x",{duration:.35,ease:"power3.out"}),qy=gsap.quickTo(pc,"y",{duration:.35,ease:"power3.out"});
    gsap.set(pc,{scale:.3});
    function show(v){pc.classList.toggle("on",v);gsap.to(pc,{scale:v?1:.3,duration:.35,ease:"power3.out",overwrite:"auto"});}
    function move(e){
      var b=e.target.closest&&e.target.closest(sel);
      if(b&&!on){on=true;gsap.set(pc,{x:e.clientX,y:e.clientY});show(true);}
      else if(!b&&on){on=false;show(false);}
      if(on){qx(e.clientX);qy(e.clientY);}
    }
    roots.forEach(function(g){g.addEventListener("pointermove",move);g.addEventListener("pointerleave",function(){on=false;show(false);});});
    addEventListener("scroll",function(){if(on&&!document.querySelector(sel+":hover")){on=false;show(false);}},{passive:true});
  }

  window.G={doc:doc,still:still,fine:fine,hasGsap:hasGsap,C:C,lb:lb,W:W,TAG:TAG,ARR:ARR,SALES:SALES,SALES_TEL:SALES_TEL,WA:WA,
    thumb:thumb,deps:deps,lbItem:lbItem,tags:tags,scrollToY:scrollToY,stopGlide:stopGlide,darkZone:darkZone,zone:zone,setDark:setDark,
    hdCheck:hdCheck,hdScan:hdScan,sk:sk,projectCursor:projectCursor};
})();

/* snap-icons (design-dna/tools/icons): כל חץ יושב על פיקסל שלם, כדי שלא יימרח על שתי שורות במסך של 100% */
(function () {
  var SEL = "svg.ic, svg.arr", t = 0;
  function snap(scope) {
    var dpr = window.devicePixelRatio || 1;
    (scope || document).querySelectorAll(SEL).forEach(function (el) {
      el.style.translate = "";
      var r = el.getBoundingClientRect(); if (!r.width) return;
      var fixed = false; for (var q = el; q && q !== document.body; q = q.parentElement) if (getComputedStyle(q).position === "fixed") { fixed = true; break; }
      var x = r.left + (fixed ? 0 : scrollX), y = r.top + (fixed ? 0 : scrollY);
      var dx = Math.round(x * dpr) / dpr - x, dy = Math.round(y * dpr) / dpr - y;
      if (Math.abs(dx) > .01 || Math.abs(dy) > .01) el.style.translate = dx.toFixed(3) + "px " + dy.toFixed(3) + "px";
    });
  }
  function soon() { clearTimeout(t); t = setTimeout(function () { snap(); }, 120); }
  window.snapIcons = snap;
  addEventListener("load", soon); addEventListener("resize", soon);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(soon);
  if (window.ResizeObserver) new ResizeObserver(soon).observe(document.body);
  document.addEventListener("load", function (e) { if (e.target.tagName === "IMG") soon(); }, true);
  document.addEventListener("animationend", function (e) { if (e.target.querySelector) snap(e.target); });
  document.addEventListener("transitionend", function (e) { if (/translate|transform/.test(e.propertyName) && e.target.querySelector) snap(e.target); });
})();
