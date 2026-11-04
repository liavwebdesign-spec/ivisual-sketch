/* סקיצה כ · השילוב מפגישת 3.11.2026: י הבסיס, עם הירו 1, המסך השני, העבודות והמחלקות של ח.
    */
(function(){
  "use strict";
  var G=window.G,doc=G.doc,still=G.still,fine=G.fine,hasGsap=G.hasGsap,C=G.C,lb=G.lb,W=G.W,lbItem=G.lbItem,ARR=G.ARR;
  var motion=hasGsap&&!still.matches;
  function $(id){return document.getElementById(id);}
  function pad(n){return n<10?"0"+n:""+n;}

  /* ================= גלילה רכה: Lenis, רק בעכבר. במגע הגלילה של המכשיר ================= */
  var lenis=null;
  if(motion&&window.Lenis&&fine.matches){
    lenis=new Lenis({autoRaf:false,lerp:.12});
    lenis.on("scroll",ScrollTrigger.update);
    gsap.ticker.add(function(t){lenis.raf(t*1000);});
    gsap.ticker.lagSmoothing(0);
    // התפריט והמציג נגללים לבד, והעמוד עומד מאחוריהם
    [$("fs"),document.querySelector("dialog.lb")].forEach(function(el){if(el)el.setAttribute("data-lenis-prevent","");});
    var lock=function(){
      if(doc.classList.contains("fs-lock")||doc.classList.contains("op-on")||doc.style.overflow==="hidden")lenis.stop();else lenis.start();
    };
    new MutationObserver(lock).observe(doc,{attributes:true,attributeFilter:["class","style"]});
    lock();
  }

  /* ================= מילים: כל מילה בתוך span, עם מסכה כשצריך ================= */
  function split(el,mask){
    [].slice.call(el.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var f=document.createDocumentFragment(),prev=n.previousSibling,first=true;
        n.textContent.split(/(\s+)/).forEach(function(t){
          if(!t)return;
          if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));first=false;return;}
          var s=document.createElement("span");s.className="w";s.textContent=t;
          if(mask){var m=document.createElement("span");m.className="wm";m.appendChild(s);s=m;}
          // פסיק שצמוד למילה המודגשת לא יורד לבד לשורה הבאה
          if(first&&prev&&prev.nodeType===1){var nw=document.createElement("span");nw.style.whiteSpace="nowrap";el.insertBefore(nw,prev);nw.appendChild(prev);nw.appendChild(s);first=false;return;}
          first=false;f.appendChild(s);
        });
        el.replaceChild(f,n);
      }else if(n.nodeType===1)split(n,mask);
    });
  }
  // מילים שנדלקות עם הגלילה
  function lit(el,start,end){
    split(el);
    if(!motion)return;
    var ws=[].slice.call(el.querySelectorAll(".w"));
    gsap.set(ws,{"--lit":0});
    gsap.to(ws,{"--lit":1,ease:"none",stagger:.5,duration:1,scrollTrigger:{trigger:el,start:start,end:end,scrub:true}});
  }

  /* ================= הפתיחה והלוגו שהופך ללוגו של ההדר ================= */
  (function(){
    var box=$("lgx"),m=$("lgx-m"),w=$("lgx-w"),win=$("hk-win"),par=$("hk-par"),foot=$("hk-foot"),hero=$("top"),first=win.querySelector(".sl1-s");
    if(!motion)return;

    // המיקום הסופי נקבע ב-CSS, ומשם מחשבים את ההזזות. offset לא מושפע מ-transform
    function rect(el){return {l:el.offsetLeft,t:el.offsetTop,w:el.offsetWidth,h:el.offsetHeight};}

    /* גלילה: הסימן והמילה נוסעים מהפינות למקום שלהם בלוגו של ההדר, ואז הלוגו האמיתי נכנס במקומם */
    function logoScroll(){
      var fi=document.querySelector(".flogo-i");
      function tgt(el,start,frac){
        return function(){
          var f=fi.getBoundingClientRect(),E=rect(el),fw=f.width*frac;
          return {x:f.left+f.width*start-E.l,y:f.top-E.t,scale:fw/E.w};
        };
      }
      var tM=tgt(m,0,812/2726),tW=tgt(w,812/2726,1914/2726),tl=gsap.timeline({scrollTrigger:{trigger:hero,start:"top top",end:function(){return "+="+innerHeight*.72;},scrub:true,invalidateOnRefresh:true,
        onUpdate:function(s){doc.classList.toggle("lgx-done",s.progress>=.995);},
        onRefresh:function(s){doc.classList.toggle("lgx-done",s.progress>=.995);}}});
      tl.to(m,{x:function(){return tM().x;},y:function(){return tM().y;},scale:function(){return tM().scale;},ease:"power1.inOut"},0)
        .to(w,{x:function(){return tW().x;},y:function(){return tW().y;},scale:function(){return tW().scale;},ease:"power1.inOut"},0);
    }

    /* גלילה: התמונה זזה לאט יותר, והטקסט דוהה */
    function heroScroll(){
      gsap.timeline({scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:true}})
        .fromTo(par,{yPercent:0},{yPercent:16,ease:"none"},0)
        .fromTo(foot,{opacity:1},{opacity:0,ease:"none",duration:.14},0);
    }

    function after(){
      doc.classList.remove("op-on");
      heroScroll();logoScroll();
      ScrollTrigger.refresh();
      if(window.snapIcons)window.snapIcons();
      window.__opDone=true;
    }

    if(!doc.classList.contains("op-on")){
      // קישור לעוגן: בלי פתיחה
      after();return;
    }
    window.__opRun=true;

    var vw=innerWidth,vh=innerHeight,ph=vw<768;
    // הלוגו בחצי מהגודל של י
    var Lw=ph?vw*.36:Math.min(vw*.23,380),s=Lw/2726,x0=(vw-Lw)/2,y0=(vh-Lw*610/2726)/2;
    var R1=Math.min(vw,vh)*(ph?.3:.22),R2=Math.hypot(vw,vh)/2+2;
    var Em=rect(m),Ew=rect(w),gap=Lw*.1,rise=R1*1.1;
    function at(E,l,t,wd){return {x:l-E.l,y:t-E.t,scale:wd/E.w};}
    var A=at(Em,x0,y0,812*s),B=at(Ew,x0+812*s,y0,1914*s);
    // שני עותקים של הלוגו: כהה מתחת לעיגול ובהיר בתוכו. כך הגבול ביניהם חד בדיוק על שפת העיגול
    var dk=box.cloneNode(true);dk.removeAttribute("id");dk.className="lgx lgx-dk";
    [].forEach.call(dk.querySelectorAll("[id]"),function(e){e.removeAttribute("id");});
    box.parentNode.insertBefore(dk,box);
    var M=[m,dk.children[0]],Wd=[w,dk.children[1]];
    var mp=[].slice.call(document.querySelectorAll(".lgx-m svg>g")),wp=[].slice.call(document.querySelectorAll(".lgx-w svg>g"));
    gsap.set(M,A);gsap.set(Wd,B);
    gsap.set(first,{scale:1.3});
    gsap.set(mp.concat(wp),{opacity:0});
    gsap.set(wp,{y:40});
    // עיגול אמיתי מהמרכז, עד שהוא מכסה את כל המסך ("כמו בסרטים של לוני טונס")
    var o={r:0};
    function paint(){var s="circle("+o.r.toFixed(1)+"px at "+(vw/2)+"px "+(vh/2)+"px)";win.style.clipPath=s;box.style.clipPath=s;}
    paint();
    var tl=gsap.timeline({delay:.2,onUpdate:paint,onComplete:function(){win.style.clipPath="";box.style.clipPath="";dk.parentNode.removeChild(dk);gsap.set(first,{clearProps:"transform"});gsap.set(win.querySelector(".hr-filter"),{clearProps:"opacity"});after();}});
    // הלוגו נכתב במרכז: הטבעת, ואז האותיות אחת אחת. שני העותקים יחד
    tl.to(mp,{opacity:1,duration:.5,ease:"power2.out"},0)
      .to(wp,{opacity:1,y:0,duration:.55,ease:"power3.out",stagger:{each:.07,grid:[2,wp.length/2],from:0,axis:"x"}},.12)
    // הסימן והמילה נפרדים לצדדים
      .to(M,{x:A.x-gap,duration:.8,ease:"power3.inOut"},1.1)
      .to(Wd,{x:B.x+gap,duration:.8,ease:"power3.inOut"},1.1)
    // אחד עולה, השני יורד, וביניהם נפתח חלון
      .to(M,{y:A.y-rise,duration:.7,ease:"power3.inOut"},1.75)
      .to(Wd,{y:B.y+rise,duration:.7,ease:"power3.inOut"},1.75)
      .to(o,{r:R1,duration:.75,ease:"power3.out"},1.85)
    // העיגול גדל למסך מלא, והם נזרקים לצדדים
      .to(o,{r:R2,duration:1.05,ease:"power3.inOut"},2.55)
      .to(first,{scale:1,duration:1.7,ease:"power2.out"},1.95)
      .to(win.querySelector(".hr-filter"),{opacity:1,duration:.9,ease:"none"},2.5)
      .to(M,{x:0,y:0,scale:1,duration:1.05,ease:"power3.inOut"},2.55)
      .to(Wd,{x:0,y:0,scale:1,duration:1.05,ease:"power3.inOut"},2.55)
    // אחרון נכנס הטקסט, והמצגת מתחילה לרוץ
      .call(function(){doc.classList.add("hr-go");},null,3.25);
    // כל ניסיון גלילה מאיץ את הפתיחה: אף אחד לא מחכה לה
    addEventListener("scroll",function hold(){if(doc.classList.contains("op-on"))scrollTo(0,0);else removeEventListener("scroll",hold);},{passive:true});
    function hurry(){tl.timeScale(4);off();}
    function off(){["wheel","touchmove","keydown"].forEach(function(t){removeEventListener(t,hurry);});}
    ["wheel","touchmove","keydown"].forEach(function(t){addEventListener(t,hurry,{passive:true});});
  })();

  /* ================= הירו 1: הפס של העבודה הנוכחית הוא השעון, וכשהוא מתמלא באה הבאה. לחיצה על מחלקה קופצת אליה, וכפתור עוצר.
     בהפחתת תנועה אין החלפה לבד: המחלקות עדיין מחליפות, ואין מה לעצור ================= */
  (function(){
    var s1=$("hk-win"),sl1=[].slice.call(s1.querySelectorAll(".sl1-s")),tb1=[].slice.call(s1.querySelectorAll(".sl1-tab")),pp1=s1.querySelector(".sl1-pp"),c1=0,auto1=!still.matches;
    if(!auto1){s1.classList.add("still");pp1.hidden=true;}
    function go1(n){
      c1=(n+sl1.length)%sl1.length;
      sl1.forEach(function(s,k){s.classList.toggle("on",k===c1);});
      tb1.forEach(function(t,k){
        t.setAttribute("aria-current",String(k===c1));t.classList.toggle("done",k<c1);
        var i=t.querySelector("i");i.style.animation="none";void i.offsetWidth;i.style.animation="";
      });
    }
    tb1.forEach(function(t,k){
      t.addEventListener("click",function(){go1(k);});
      t.querySelector("i").addEventListener("animationend",function(){if(auto1&&k===c1)go1(c1+1);});
    });
    pp1.addEventListener("click",function(){
      var on=!s1.classList.contains("paused");s1.classList.toggle("paused",on);
      pp1.setAttribute("aria-pressed",String(on));pp1.setAttribute("aria-label",on?"המשך המצגת":"עצירת המצגת");
    });
  })();

  /* ================= העבודות: הירו 5 של ח הוא העבודה הראשונה, ושאר העבודות נערמות עליו ================= */
  var BYID={};WORKS.forEach(function(w){BYID[w.id]=w;});
  var FEAT=[
    {n:"החשב הכללי, משרד האוצר",ws:["ag-payments-status","ag-annual-2021","ag-financial-2021"],d:"דוחות שנתיים ומיתוג"},
    {n:"GenCell",ws:["gencell-evox","gencell-c","gencell-a","gencell-b","gencell-board"],d:"מצגת מוצר וקמפיין"},
    {n:"המכללה האזורית צפת",ws:["college-campaign"],d:"קמפיין הרשמה"},
    {n:"אביב לניצולי השואה",ws:["aviv-deck","aviv-brochure","aviv-brochure-b","aviv-infographic","aviv-flyer"],d:"חוברות וקמפיין"},
    {n:"אלדו, רשת גלידריות",ws:["aldo-ad-a","aldo-ad-b","aldo-ad-d","aldo-ad-c","aldo-menu"],d:"מודעות ותפריטים"},
    {n:"BENNY'S",ws:["bennys-site"],d:"אתר החנות"}
  ];
  function setLB(s){return s.ws.map(function(i){return lbItem(BYID[i]);});}
  (function(){
    var featEl=$("feat"),x5=$("x5"),pin=$("x5-pin"),slot=$("x5-slot"),m5=$("x5-m"),hit=$("x5-hit"),o5=$("x5-o"),txt5=$("x5-txt"),sp=$("x5-sp"),N=FEAT.length,opened=false;
    hit.setAttribute("aria-label",FEAT[0].n+": "+FEAT[0].d+", פתיחת העבודות");
    $("x5-d").textContent=FEAT[0].d;
    var html="";
    FEAT.forEach(function(s,i){
      if(!i)return;
      var w=BYID[s.ws[0]];
      html+='<article class="fp" data-hd="dark" aria-labelledby="fp-'+i+'"><h3 class="sr" id="fp-'+i+'">'+s.n+'</h3><figure class="fp-media"><picture>'+(w.port?'<source media="(max-width:767px)" srcset="'+w.port+'">':'')+'<img src="'+w.src+'" alt="" width="'+w.w+'" height="'+w.h+'" loading="lazy" decoding="async"></picture></figure><p class="fp-txt" aria-hidden="true"><span class="fp-n">'+pad(i+1)+' / '+pad(N)+'</span><span class="fp-d">'+s.d+'</span></p><button class="fp-hit" type="button" data-k="'+i+'" aria-label="'+s.n+": "+s.d+', פתיחת העבודות"></button></article>';
    });
    featEl.insertAdjacentHTML("beforeend",html);
    var fps=[].slice.call(featEl.querySelectorAll(".fp"));
    featEl.addEventListener("click",function(e){var b=e.target.closest(".fp-hit");if(b)lb.open(setLB(FEAT[+b.dataset.k]),0,b);});
    G.projectCursor([featEl],".fp-hit");
    if(hasGsap)gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      featEl.classList.add("is-stack");x5.classList.add("live");
      pin.appendChild(m5);pin.appendChild(hit);
      // החלון נחתך לגודל שלו ליד הכותרת, והחיתוך נפתח בגלילה. גם הכפתור נחתך, ולכן הוא לא יושב על הכותרת כשהחלון סגור
      function ins(){
        var s=slot.getBoundingClientRect(),p=pin.getBoundingClientRect();
        return "inset("+(s.top-p.top).toFixed(1)+"px "+(p.right-s.right).toFixed(1)+"px "+(p.bottom-s.bottom).toFixed(1)+"px "+(s.left-p.left).toFixed(1)+"px round 4px)";
      }
      // העבודה מוקטנת לגודל החלון, ולכן רואים אותה שלמה כבר בחלון, והיא גדלה יחד איתו
      function fit(k){return function(){
        var s=slot.getBoundingClientRect(),p=pin.getBoundingClientRect();
        if(k==="s")return Math.max(s.width/p.width,s.height/p.height);
        return k==="x"?s.left+s.width/2-p.left-p.width/2:s.top+s.height/2-p.top-p.height/2;
      };}
      var dark=false;
      function hd5(v){if(v===dark)return;dark=v;x5.setAttribute("data-hd",v?"dark":"light");G.hdCheck();}
      // עד שהחלון נפתח לגמרי הלוגו יכול עדיין לשבת על הלבן. מעל החלון הוא נדגם מהתמונה (tone.js), ולכן דוגמים גם בזמן שהחלון נפתח
      function st5(s){hd5(s.progress>.98);opened=s.progress>.9;if(window.__toneTick)window.__toneTick();}
      gsap.timeline({scrollTrigger:{trigger:sp,start:"top bottom",end:"bottom bottom",scrub:.6,invalidateOnRefresh:true,onUpdate:st5,onRefresh:st5}})
        .fromTo([m5,hit],{clipPath:ins},{clipPath:"inset(0px 0px 0px 0px round 0px)",ease:"power2.inOut",duration:1},0)
        .fromTo(m5.querySelector("img"),{x:fit("x"),y:fit("y"),scale:fit("s")},{x:0,y:0,scale:1,ease:"power2.inOut",duration:1},0)
        .to(x5.querySelector(".hr-txt"),{autoAlpha:0,ease:"none",duration:.35},.1)
        .fromTo(o5,{opacity:0},{opacity:1,ease:"none",duration:.2},.8)
        .fromTo(txt5,{opacity:0,y:24},{opacity:1,y:0,ease:"none",duration:.2},.8);
      fps.forEach(function(fp,i){
        if(!i)return;
        var media=fp.querySelector(".fp-media"),img=media.querySelector("img"),txt=fp.querySelector(".fp-txt");
        var st={trigger:fp,start:"top bottom",end:"top top",scrub:.5,invalidateOnRefresh:true};
        gsap.fromTo(media,{clipPath:function(){return innerWidth<768?"inset(8% 6% 8% 6% round 4px)":"inset(14% 12% 14% 12% round 4px)";}},{clipPath:"inset(0% 0% 0% 0% round 0px)",ease:"none",scrollTrigger:st});
        gsap.fromTo(img,{scale:1.22},{scale:1,ease:"none",scrollTrigger:{trigger:fp,start:"top bottom",end:"bottom top",scrub:.5}});
        gsap.fromTo(txt,{opacity:0,y:24},{opacity:1,y:0,ease:"none",scrollTrigger:{trigger:fp,start:"top 40%",end:"top 5%",scrub:.5}});
        gsap.to(fps[i-1],{scale:.94,ease:"none",scrollTrigger:st});
      });
      return function(){
        featEl.classList.remove("is-stack");x5.classList.remove("live");
        slot.appendChild(m5);slot.appendChild(hit);hd5(false);opened=false;
      };
    });
    /* פס שם הלקוח: נעלם בזמן הגלילה וחוזר כשעוצרים. על הירו 5 הוא מחכה עד שהחלון נפתח */
    var strip=$("wk-strip"),sn=$("wk-n"),work=$("work"),curK=-1,idle=0;
    function which(){var h=innerHeight*.5,k=0;for(var i=0;i<fps.length;i++)if(fps[i].getBoundingClientRect().top<=h)k=i;return k;}
    function name(k){if(k===curK)return;curK=k;sn.textContent=FEAT[k].n;}
    function inWork(){var r=work.getBoundingClientRect();return r.top<innerHeight*.35&&r.bottom>innerHeight*.75&&(opened||which()>0);}
    function show(){var v=inWork();if(v)name(which());strip.classList.toggle("on",v);}
    addEventListener("scroll",function(){strip.classList.remove("on");clearTimeout(idle);idle=setTimeout(show,600);},{passive:true});
    addEventListener("resize",show);show();
  })();

  /* ================= תג מסתובב (MV:g83): לכל העבודות ================= */
  (function(){
    var badge=document.getElementById("badge"),ring=badge.querySelector(".badge-ring");
    var TXT="כל העבודות · מיתוג · אתרים · שיווק · ";
    function lay(){
      var fs=parseFloat(getComputedStyle(ring).fontSize)||14,ls=fs*.04;
      var cv=document.createElement("canvas").getContext("2d");cv.font="500 "+fs+"px 'Google Sans', sans-serif";
      var ch=Array.from(TXT),wd=ch.map(function(c){return cv.measureText(c).width+ls;});
      var tot=wd.reduce(function(a,b){return a+b;},0),acc=0;
      ring.innerHTML=ch.map(function(c,i){
        var a=-(acc+wd[i]/2)/tot*360;acc+=wd[i];
        return '<span style="transform:translateX(-50%) rotate('+a.toFixed(2)+'deg)">'+(c===" "?"&nbsp;":c)+'</span>';
      }).join("");
    }
    lay();if(document.fonts)document.fonts.ready.then(lay);
    // הסיבוב הקבוע רץ בדפדפן (Web Animations), כדי שהעמוד במנוחה לא יכתוב לתג 60 פעם בשנייה. הגלילה והריחוף משנים רק את המהירות
    if(!hasGsap||!ring.animate)return;
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      var spin=ring.animate([{rotate:"0deg"},{rotate:"-360deg"}],{duration:18000,iterations:Infinity}),hover=false,k={v:1};
      function to(v,d,then){gsap.to(k,{v:v,duration:d,overwrite:true,onUpdate:function(){spin.playbackRate=k.v;},onComplete:then});}
      var st=ScrollTrigger.create({onUpdate:function(s){
        var v=Math.min(4,1+Math.abs(s.getVelocity())/700);
        if(!hover)to(v,.25,function(){if(!hover)to(1,1.2);});
      }});
      function on(){hover=true;to(3,.4);}
      function off(){hover=false;to(1,.8);}
      badge.addEventListener("mouseenter",on);badge.addEventListener("mouseleave",off);
      return function(){spin.cancel();st.kill();gsap.killTweensOf(k);badge.removeEventListener("mouseenter",on);badge.removeEventListener("mouseleave",off);};
    });
  })();

  /* ================= שלוש מחלקות של ח: אקורדיון של שלוש תמונות קבועות, עם פילטר שחור עדין ================= */
  (function(){
    if(!C)return;
    var dpa=$("dpa"),KEYS=["branding","web","digital"],IM={branding:DUMMY("b07"),web:DUMMY("w05"),digital:DUMMY("c10")};
    function pic(m,sizes){return '<img src="'+m.src+'" srcset="'+m.thumb+' 900w, '+m.src+' 2400w" sizes="'+sizes+'" alt="" width="'+m.w+'" height="'+m.h+'" loading="lazy" decoding="async">';}
    dpa.innerHTML=KEYS.map(function(k,i){var d=C.depts[k];
      return '<li class="dpa-i'+(i?'':' on')+'" data-d="'+k+'"><a class="dpa-a" href="work.html?d='+k+'"><span class="dpa-m" aria-hidden="true">'+pic(IM[k],"(max-width:767px) 100vw, 58vw")+'</span><span class="dpa-t"><span class="dpa-n">'+d.name+'</span><span class="dpa-s"><span>'+d.services.slice(0,3).join(" · ")+'</span></span></span><span class="dpa-go" aria-hidden="true">'+ARR+'</span></a></li>';}).join("");
    var items=[].slice.call(dpa.children),cur=items[0],wide=matchMedia("(min-width:768px)");
    function open(li){if(li===cur)return;cur.classList.remove("on");li.classList.add("on");cur=li;}
    items.forEach(function(li){
      li.addEventListener("pointerenter",function(e){if(e.pointerType==="mouse"&&wide.matches)open(li);});
      li.querySelector("a").addEventListener("focus",function(){open(li);});
    });
  })();

  /* ================= הציטוט ================= */
  lit($("qt-p"),"top 74%","bottom 56%");

  /* ================= ככה עוטפים זהב: הסקשן ננעל, והעבודות עפות בעומק מהמרכז החוצה =================
     מנקודה אחת מאחורי הכותרת אל מעבר לקצה, כמו מצלמה שנוסעת קדימה: המיקום והגודל גדלים יחד.
     הגלילה מריצה רק את אמצע הסיפור, ולכן המסך אף פעם לא ריק, לא בכניסה ולא ביציאה */
  (function(){
    var box=$("ag-obj"),pin=$("ag-pin"),h=$("cd-h"),btn=$("ag-btn"),ghost=$("ag-ghost"),sec=$("cloud");
    split(h,true);
    // [קובץ, יחס גובה לרוחב, כיוון במעלות (0 ימינה, 90 למטה), רוחב, גם בטלפון]
    var OB=[
      ["box-handle",1100/1099,-150,29,1],["pouch-o",665/518,-24,20,1],["phone-red",1013/625,152,19,1],["cube",1100/790,32,24,1],
      ["box-kraft",519/1100,-94,36,1],["phone-art",876/793,-4,27,0],["pouch-n",662/514,-174,20,0],["phone-green",495/1100,88,38,1],
      ["cup",385/284,-58,17,1],["pouch-brown",1100/939,122,25,1],["phone-app",1100/728,-124,21,0],
      ["box-handle",1100/1099,58,27,0],["phone-red",1013/625,-40,18,0],["cup",385/284,176,18,0],["pouch-o",665/518,106,21,0],["box-kraft",519/1100,-112,34,0]
    ];
    box.innerHTML=OB.map(function(o,i){
      return '<img class="ag-o'+(o[4]?'':' ag-dt')+'" '+(o[4]?'src':'data-src')+'="img/cut/'+o[0]+'.webp" alt="" style="--r:'+o[1].toFixed(4)+';--b:'+o[3]+';z-index:'+(OB.length-i)+'" decoding="async">';
    }).join("");
    var imgs=[].slice.call(box.children);
    function loadWide(){imgs.forEach(function(el){if(el.dataset.src){el.src=el.dataset.src;delete el.dataset.src;}});}
    if(innerWidth>=768)loadWide();
    if(!motion){
      // בלי תנועה: קומפוזיציה עומדת סביב הכותרת
      imgs.forEach(function(el,i){var a=OB[i][2]*Math.PI/180;el.style.transform="translate("+(Math.cos(a)*36).toFixed(1)+"vw,"+(Math.sin(a)*36).toFixed(1)+"vh) scale(.62)";});
      return;
    }
    var ws=[].slice.call(h.querySelectorAll(".w")),rings=[].slice.call(ghost.querySelectorAll("circle"));
    gsap.set(ws,{yPercent:115});gsap.set(btn,{opacity:0,y:16});
    // הכותרת כבר למעלה כשהסקשן ננעל
    gsap.timeline({scrollTrigger:{trigger:sec,start:"top 58%",toggleActions:"play none none none"}})
      .to(ws,{yPercent:0,duration:1,ease:"power3.out",stagger:.07},0)
      .to(btn,{opacity:1,y:0,duration:.7,ease:"power2.out"},.35);
    gsap.matchMedia().add({wide:"(min-width:768px)",nar:"(max-width:767px)"},function(cx){
      var wide=cx.conditions.wide,list=imgs.filter(function(_,i){return wide||OB[i][4];});
      if(wide)loadWide();
      var hide=imgs.filter(function(el){return list.indexOf(el)<0;});if(hide.length)gsap.set(hide,{display:"none"});
      var D=3.6,S=wide?.25:.42,S0=.24,S1=1.9,T0=D*.6,T1=(list.length-1)*S+D*.42,span=T1-T0,RX=wide?.62:.74,RY=wide?.62:.56;
      var tl=gsap.timeline({paused:true});
      gsap.set(rings,{strokeDasharray:1,strokeDashoffset:1});
      tl.to(rings,{strokeDashoffset:0,duration:span*.8,ease:"none",stagger:span*.1},T0)
        .fromTo(ghost,{scale:.8,rotation:-10},{scale:1.3,rotation:6,duration:span,ease:"none"},T0);
      list.forEach(function(el,k){
        var a=OB[imgs.indexOf(el)][2]*Math.PI/180,cos=Math.cos(a),sin=Math.sin(a),at=k*S;
        function X(s){return function(){return cos*RX*s*innerWidth;};}
        function Y(s){return function(){return sin*RY*s*innerHeight;};}
        tl.fromTo(el,{x:X(S0),y:Y(S0),scale:S0,rotation:(k%2?-1:1)*12},{x:X(S1),y:Y(S1),scale:S1,rotation:(k%2?1:-1)*7,duration:D,ease:"power2.in"},at)
          .fromTo(el,{opacity:0},{opacity:1,duration:D*.3,ease:"none"},at);
      });
      tl.to([box,ghost],{opacity:0,duration:span*.13,ease:"none"},T1-span*.13);
      tl.time(T0);
      var run=gsap.fromTo(tl,{time:T0},{time:T1,ease:"none",scrollTrigger:{trigger:pin,start:"top top",end:wide?"+=220%":"+=170%",pin:true,scrub:true,anticipatePin:1,invalidateOnRefresh:true}});
      return function(){tl.kill();};
    });
  })();

  /* ================= לקוחות: קיר הלוגואים של ויזואל, חיוור ובשחור-לבן, והעדשה מהלוגו נוסעת עליו ומגדילה בצבע (MV:g101) ================= */
  // 42 הלוגואים מקיר הלקוחות של ויזואל (המסמך של לילך, 20.10.2026): [קובץ, שם, רוחב, גובה, גודל יחסי, הלקוח בעבודות]
  // הגודל היחסי משווה את השטח שהעין רואה: לוגו רחב יוצא נמוך יותר, לוגו מלא וכבד קצת קטן יותר
  var LOGOS=[
    ["einav","עינב טכנולוגיות",186,61,0.525,""],
    ["brainstorm","סיעור מוחות",151,122,0.986,""],
    ["gencell","GenCell",192,26,0.322,"GenCell"],
    ["matnasim-safed","החברה למרכזים קהילתיים צפת",137,112,0.879,""],
    ["safed","עיריית צפת",165,96,0.751,"עיריית צפת|עיריית צפת, מחלקת הנוער"],
    ["treasury","החשב הכללי, משרד האוצר",129,115,0.851,"החשב הכללי, משרד האוצר"],
    ["bazelet","BAZELET",203,36,0.381,""],
    ["foret-blanche","La Forêt Blanche",208,105,0.796,""],
    ["kfar-saba","החברה הכלכלית לפיתוח כפר סבא",206,76,0.615,""],
    ["milouof","מילועוף",154,115,0.743,""],
    ["peleg-hagalil","פלג הגליל, החברה האזורית למים וביוב",174,89,0.746,""],
    ["aldo","אלדו, רשת גלידריות",173,65,0.687,"אלדו, רשת גלידריות"],
    ["hatzor","חצור הגלילית",191,57,0.532,""],
    ["finalytix","FINALYTIX",203,46,0.478,"FINALYTIX"],
    ["sivan","סיון ביצוע",190,91,0.674,""],
    ["arachim","ערכים",74,107,1.12,""],
    ["nursing-safed","בית הספר לסיעוד צפת",219,104,0.702,""],
    ["smartnpv","smartNPV",179,29,0.356,"smartNPV"],
    ["maavarim","מעברים, אצבע הגליל",115,115,1.12,""],
    ["safed-college","המכללה האזורית צפת",181,85,0.645,"המכללה האזורית צפת"],
    ["palgei-sharon","פלגי שרון, תאגיד מים וביוב",141,107,0.903,""],
    ["psychodrama","האיגוד הישראלי לפסיכודרמה",217,38,0.39,""],
    ["fiat","FIAT",117,117,0.86,""],
    ["iec","חברת החשמל",145,106,0.796,""],
    ["hasdei-lev","חסדי לב",175,52,0.565,"חסדי לב"],
    ["lahavot","להבות",140,75,0.748,""],
    ["istern","iSTERN",194,60,0.568,""],
    ["ramot-shapira","רמות שפירא, המרכז החינוכי",141,110,0.94,""],
    ["ashdodance","ASHDODANCE",172,100,0.854,""],
    ["giladi","מלון גלעדי",95,120,1.12,""],
    ["hapoalim","בנק הפועלים",172,34,0.443,""],
    ["katzrin","החברה לפיתוח קצרין",186,52,0.518,""],
    ["algosec","algosec",165,57,0.594,""],
    ["ysb","YSB, קבוצת י.ש. אחים יעקובי",130,86,0.699,""],
    ["yosef-levy","Yosef Levy Marketing",154,113,0.959,""],
    ["res","מכללת R.E.S",123,127,1.085,""],
    ["maof","מעוף",168,72,0.704,""],
    ["tamar","תמר בכפר",106,107,0.864,""],
    ["rafael-retirees","עמותת גמלאי רפאל",196,101,0.773,""],
    ["bina","מדרשת בינת, שבות רחל",120,83,0.85,""],
    ["bama","במה",156,92,0.749,""],
    ["maale-yosef","מרכז קהילתי מעלה יוסף",178,119,0.77,""]
  ];
  var byClient={};
  W.forEach(function(w){
    var c=byClient[w.client_he]||(byClient[w.client_he]={works:[],deps:{}});
    c.works.push(w);(w.departments||[]).forEach(function(d){c.deps[d]=1;});
  });
  var CL=LOGOS.map(function(l){
    var o={f:l[0],name:l[1],w:l[2],h:l[3],s:l[4],works:[],deps:{}};
    (l[5]?l[5].split("|"):[]).forEach(function(k){var c=byClient[k];if(!c)return;o.works=o.works.concat(c.works);for(var d in c.deps)o.deps[d]=1;});
    return o;
  });
  function depsTxt(c){var d=["branding","web","digital"].filter(function(k){return c.deps[k];});return d.length===3?"כל המחלקות":d.map(function(k){return DEPTS[k];}).join(" + ");}
  (function(){
    // שש תחנות של העדשה, בזיגזג על 7 עמודות ו-6 שורות: מותגים שכל אחד מכיר, ושלושה מהם נפתחים לעבודות.
    // בטלפון (3 עמודות) אותו סדר נותן 14 שורות מלאות, והעדשה יורדת לפי הגובה
    var STOPS=["treasury","iec","gencell","hapoalim","aldo","algosec"],SPOS=[1,12,15,26,30,40];
    var rest=CL.filter(function(c){return STOPS.indexOf(c.f)<0;}),seq=[],r=0;
    for(var i=0;i<CL.length;i++){var si=SPOS.indexOf(i);seq.push(si<0?rest[r++]:CL.filter(function(c){return c.f===STOPS[si];})[0]);}
    function img(c,alt,lazy){return '<img src="'+HB+'img/clients/'+c.f+'.webp" alt="'+(alt?c.name:'')+'" width="'+c.w+'" height="'+c.h+'" style="--s:'+c.s+';--ar:'+(c.w/c.h).toFixed(3)+'"'+(lazy?' loading="lazy"':'')+' decoding="async">';}
    function cells(copy){return seq.map(function(c){
      var k=CL.indexOf(c);
      if(copy)return '<li data-k="'+k+'"><span class="lg">'+img(c,0,0)+'</span></li>';
      return '<li data-k="'+k+'">'+(c.works.length?'<button class="lg" type="button" aria-haspopup="dialog" aria-label="'+c.name+', העבודות">'+img(c,0,1)+'</button>':'<span class="lg">'+img(c,1,1)+'</span>')+'</li>';
    }).join("");}
    var ct=document.getElementById("ctab");
    ct.innerHTML=cells(0);
    ct.addEventListener("click",function(e){
      var b=e.target.closest("button.lg");if(!b)return;
      lb.open(CL[+b.parentNode.dataset.k].works.map(lbItem),0,b);
    });

    var root=document.getElementById("xw"),pin=root.querySelector(".xw-pin"),fig=document.getElementById("xw-fig");
    var ink=document.getElementById("xw-ink"),lens=document.getElementById("xw-lens"),view=document.getElementById("xw-view"),tag=document.getElementById("xw-tag");
    ink.innerHTML=view.innerHTML='<ul class="lgw"></ul>';
    var zoom=view.firstChild,lis=[].slice.call(ct.children),Z=1.8,D=0,curI=-1;
    // שני העותקים (סביב העדשה ובתוכה) נטענים רק כשהקיר מתקרב, ואז מהזיכרון של הדפדפן
    var filled=false;
    function fill(){if(filled)return;filled=true;var h=cells(1);ink.firstChild.innerHTML=h;zoom.innerHTML=h;}
    if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){fill();io.disconnect();}},{rootMargin:"900px 0px"});io.observe(root);}else fill();
    function setCur(i){
      if(i===curI)return;curI=i;
      var c=CL[+lis[i].dataset.k];
      tag.innerHTML='<b>'+c.name+'</b>'+(c.works.length?'<span>'+depsTxt(c)+'</span>':'');
    }
    if(!hasGsap)return;
    gsap.matchMedia().add({ok:"(prefers-reduced-motion: no-preference)",wide:"(min-width:768px)"},function(cx){
      if(!cx.conditions.ok)return;
      root.classList.add("mv-on");
      var o={x:0,y:0},pts=[],cs=[];
      var F0={x:0,y:0};
      function center(li){var a=li.firstChild.getBoundingClientRect();return {x:a.left-F0.x+a.width/2,y:a.top-F0.y+a.height/2};}
      // העדשה לא יוצאת מהמסך: בטלפון לוגו בעמודה הקיצונית מקבל את העדשה קצת פנימה
      var lo=-1e9,hi=1e9;
      function paint(){
        var x=Math.max(lo,Math.min(hi,o.x));
        ink.style.setProperty("--lx",x+"px");ink.style.setProperty("--ly",o.y+"px");
        gsap.set(lens,{x:x,y:o.y,xPercent:-50,yPercent:-50,overwrite:false});
        zoom.style.transform="translate("+(D/2-x*Z).toFixed(1)+"px,"+(D/2-o.y*Z).toFixed(1)+"px) scale("+Z+")";
        var b=0,bd=1e12;for(var i=0;i<cs.length;i++){var ddx=cs[i].x-o.x,ddy=cs[i].y-o.y,d=ddx*ddx+ddy*ddy;if(d<bd){bd=d;b=i;}}
        setCur(b);
      }
      function measure(){
        D=lens.offsetWidth;zoom.style.width=ct.offsetWidth+"px";
        var R=ct.getBoundingClientRect();F0={x:R.left,y:R.top};
        var vw=document.documentElement.clientWidth;lo=D*.56-R.left;hi=vw-R.left-D*.8;
        cs=lis.map(center);
        pts=SPOS.map(function(i){return cs[i];});
        if(!cx.conditions.wide)pts.sort(function(a,b){return a.y-b.y;});
        tl.clear();o.x=pts[0].x;o.y=pts[0].y;
        // x ו-y בעקומות שונות, ולכן המסלול מתעקל. בכל תחנה העדשה "מתמקדת": מתכווצת, מתנפחת וחוזרת
        pts.slice(1).forEach(function(p,k){
          var at=k*1.4;
          tl.to(o,{x:p.x,duration:1,ease:"power3.inOut"},at).to(o,{y:p.y,duration:1,ease:k%2?"back.inOut(1.4)":"sine.inOut"},at)
            .to(lens,{scale:.86,duration:.5,ease:"sine.in"},at).to(lens,{scale:1.1,duration:.3,ease:"sine.out"},at+.5).to(lens,{scale:1,duration:.6,ease:"sine.inOut"},at+.8);
        });
        paint();
      }
      var tl=gsap.timeline({onUpdate:paint,scrollTrigger:cx.conditions.wide?{trigger:pin,start:"center center",end:"+=120%",pin:true,scrub:true,anticipatePin:1,
        onRefresh:function(s){measure();tl.progress(s.progress);}}:{trigger:fig,start:"top 70%",end:"bottom 45%",scrub:true,
        onRefresh:function(s){measure();tl.progress(s.progress);}}});
      measure();
      return function(){root.classList.remove("mv-on");ink.style.removeProperty("--lx");ink.style.removeProperty("--ly");gsap.set(lens,{clearProps:"transform"});zoom.style.transform="";};
    });
  })();

  /* ================= צור קשר: טלפון, וואטסאפ וטופס קצר ================= */
  (function(){
    var call=document.getElementById("w-call"),callM=document.getElementById("w-call-m"),open=false;
    call.href=G.SALES_TEL;callM.setAttribute("aria-live","polite");
    // במחשב הלחיצה הראשונה מראה את המספר, והשנייה מחייגת. בטלפון מחייגים מיד
    call.addEventListener("click",function(e){
      if(!fine.matches||open)return;
      e.preventDefault();open=true;
      var t=call.querySelector(".way-t");t.textContent=G.SALES;t.dir="ltr";
      callM.textContent="אלעד, מנהל המכירות. לחיצה נוספת מחייגת.";
    });
    document.getElementById("w-wa").href=G.WA;
    var root=document.getElementById("cf-g");
    contactForm(root,{btn:"btn btn-ink"});
    // טופס קצר: שם, טלפון, שם העסק או הארגון, ומה רוצים. הפנייה נשלחת עם נושא קבוע, כדי שבמשרד יזהו אותה מיד
    var em=root.querySelector("[data-v=email]");if(em)em.closest(".cf-f").remove();
    var need=root.querySelector(".cf-need");if(need)need.remove();
    var form=root.querySelector("form"),nm=root.querySelector("[data-v=name]"),subj=document.createElement("input");
    subj.type="hidden";subj.name="subject";form.appendChild(subj);
    function setSubj(){var n=nm.value.trim();subj.value="פנייה חדשה מהאתר של ויזואל"+(n?" מאת "+n:"");}
    nm.addEventListener("input",setSubj);setSubj();
    var msg=root.querySelector("textarea");if(msg){var lab=root.querySelector('label[for="'+msg.id+'"]');if(lab)lab.firstChild.textContent="מה אתם מתכננים? ";}
    var org=root.querySelector("[data-v=org]");if(org){var lo=root.querySelector('label[for="'+org.id+'"]');if(lo)lo.firstChild.textContent="שם העסק או הארגון ";}
  })();

  /* ================= הפוטר נחשף מלמטה ================= */
  if(motion)gsap.fromTo($("ftj-in"),{yPercent:-22},{yPercent:0,ease:"none",scrollTrigger:{trigger:$("ft"),start:"top bottom",end:"top 20%",scrub:true}});
  // הפוטר נעצר כשהתחתית שלו מגיעה לתחתית המסך, והמסך הלבן עולה עליו. גם כשהוא גבוה מהמסך
  (function(){
    var el=$("ftj-in");if(!el||still.matches)return;
    function fit(){el.style.setProperty("--ftj-top",Math.min(0,innerHeight-el.offsetHeight)+"px");}
    fit();addEventListener("resize",fit);ScrollTrigger.addEventListener("refresh",fit);
  })();

  /* ================= "תמשיכו לגלול": בתחתית העמוד הגלגלת, המגע והמקלדת ממלאים את הטבעת, והיא מתרוקנת כשעוצרים =================
     כשהיא מלאה האישון נדלק ועוברים לעמוד העבודות. בהפחתת תנועה זה קישור רגיל */
  (function(){
    var nx=document.getElementById("nx"),a=document.getElementById("nx-a");if(!nx)return;
    if(still.matches){nx.style.setProperty("--p","1");return;}
    var p=0,go=false,last=0,raf=0,ty=null;
    function atEnd(){return innerHeight+scrollY>=doc.scrollHeight-4;}
    function set(v){p=Math.max(0,Math.min(1,v));nx.style.setProperty("--p",p.toFixed(3));}
    function drain(t){raf=0;if(go)return;if(t-last>240)set(p-.014);if(p>0)raf=requestAnimationFrame(drain);}
    function push(d){
      // כשהתפריט או המציג פתוחים הגלגלת שלהם, והעמוד לא מתקדם
      if(go||!atEnd()||doc.classList.contains("fs-lock")||doc.style.overflow==="hidden")return;
      set(p+d);last=performance.now();
      if(p>=1){go=true;nx.classList.add("done");setTimeout(function(){location.href=a.href;},420);return;}
      if(!raf)raf=requestAnimationFrame(drain);
    }
    addEventListener("wheel",function(e){if(e.deltaY>0)push(Math.min(.07,e.deltaY/1800));},{passive:true});
    addEventListener("touchstart",function(e){ty=e.touches[0].clientY;},{passive:true});
    addEventListener("touchmove",function(e){if(ty==null)return;var y=e.touches[0].clientY,d=ty-y;ty=y;if(d>0)push(d/900);},{passive:true});
    addEventListener("keydown",function(e){
      if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;
      if(e.key===" "&&/^(A|BUTTON)$/.test(e.target.tagName))return;
      if(e.key==="ArrowDown"||e.key==="PageDown"||e.key==="End"||e.key===" ")push(.1);
    });
    // חזרה בכפתור "אחורה" מחזירה טבעת ריקה
    addEventListener("pageshow",function(){go=false;nx.classList.remove("done");set(0);});
  })();

  /* ================= כל העמוד מתחלף לצבע של האזור שמגיעים אליו ================= */
  if(motion){
    G.zone($("wz-mark"),"dark");
    G.zone($("dzj"),"dark");
    G.zone($("contact"),"green");
    G.zone($("ft"),"dark");
  }

  /* ================= הפעלה: הפונטים משנים גבהים, ולכן מודדים אחריהם ================= */
  function start(){
    if(hasGsap)ScrollTrigger.refresh();
    if(window.__resumeY!=null)scrollTo(0,window.__resumeY);
    G.hdScan();
  }
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(start);else addEventListener("load",start);
  addEventListener("load",function(){start();window.__resumeY=null;});
  addEventListener("pagehide",function(){try{sessionStorage.setItem("k-y",Math.round(scrollY));}catch(e){}});
  rv(document);doc.classList.add("rv-ok");
})();
