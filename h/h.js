/* סקיצות ח ו-ט · עמוד הבית, שיעורי הבית מפגישת הסטטוס עם לילך, 26.10.2026
   חמש פריסות הירו להשוואה (?hero=1 עד 5), עבודות נבחרות על שחור עם פס שם הלקוח, מסך עצירה עם התג המסתובב,
   מחלקות עם תמונה קבועה, ציטוט נקי, ענן של שבע עבודות גדולות, קיר הלקוחות, צור קשר על הירוק, ו"תמשיכו לגלול" בסוף הפוטר.
   ט (html[data-sk=i]) טוענת את הקובץ הזה מ-../h, וההבדלים שלה מסומנים ב-I. מה שמשותף לעמוד העבודות ב-common.js */
(function(){
  "use strict";
  var G=window.G,doc=G.doc,still=G.still,fine=G.fine,hasGsap=G.hasGsap,C=G.C,lb=G.lb,W=G.W,thumb=G.thumb,lbItem=G.lbItem,ARR=G.ARR;
  var HB=window.HB||"",I=G.sk==="i",DUMMY=window.DUMMY;
  var top=document.getElementById("top"),HERO=+doc.getAttribute("data-hero")||1,x5Dark=false;
  function pad(n){return n<10?"0"+n:""+n;}

  /* מסך הטעינה מודיע כשהאתר נחשף, וההירו עולה רק אז */
  function plDone(){if(window.__plDone)return;window.__plDone=true;dispatchEvent(new Event("pl-done"));}
  function afterPl(f){if(window.__plDone||!doc.classList.contains("pl-on")&&!document.getElementById("pl"))f();else addEventListener("pl-done",f,{once:true});}

  /* ================= מסך טעינה: הלוגו מצטייר, והעדשה שלו נפתחת אל האתר ================= */
  (function(){
    var pl=document.getElementById("pl");if(!pl){plDone();return;}
    function done(){doc.classList.remove("pl-on");pl.remove();plDone();if(hasGsap)ScrollTrigger.refresh();}
    if(!hasGsap||!doc.classList.contains("pl-on")){done();return;}
    var ring=pl.querySelector(".pl-ring"),sat=pl.querySelector(".pl-sat"),pupil=pl.querySelector(".pl-pupil"),word=pl.querySelector(".pl-word"),logo=pl.querySelector(".pl-logo"),mark=pl.querySelector(".pl-mark");
    var cR=2*Math.PI*240,cS=2*Math.PI*97;
    var shift=function(){return logo.offsetWidth*(1-.2979)/2;};
    gsap.set(ring,{strokeDasharray:cR,strokeDashoffset:cR,rotation:-120,transformOrigin:"50% 50%"});
    gsap.set(sat,{strokeDasharray:cS,strokeDashoffset:cS,rotation:150,transformOrigin:"50% 50%"});
    gsap.set(pupil,{scale:0,transformOrigin:"50% 50%"});
    gsap.set(logo,{x:shift});
    var ready=new Promise(function(res){
      var n=0;function one(){if(++n===2)res();}
      if(document.readyState==="complete")one();else addEventListener("load",one,{once:true});
      setTimeout(one,1500);
    });
    var cap=new Promise(function(res){setTimeout(res,4200);});
    var tl=gsap.timeline();
    tl.to(ring,{strokeDashoffset:0,rotation:-90,duration:.8,ease:"power3.inOut"})
      .to(sat,{strokeDashoffset:0,rotation:0,duration:.5,ease:"power2.out"},"-=.28")
      .to(pupil,{scale:1,duration:.5,ease:"back.out(2.4)"},"-=.3")
      .to(pupil,{x:120,y:20,duration:.26,ease:"power2.inOut"},"+=.02")
      .to(pupil,{x:50,y:110,duration:.22,ease:"power2.inOut"})
      .to(pupil,{x:0,y:0,duration:.3,ease:"back.out(1.6)"})
      .to(word,{opacity:1,duration:.18,ease:"none"},"-=.05").set(mark,{autoAlpha:0})
      .to(logo,{x:0,duration:.75,ease:"power3.inOut"},"+=.02")
      .to(word,{clipPath:"inset(0 0% 0 0)",duration:.7,ease:"power3.out"},"<.12");
    Promise.all([new Promise(function(r){tl.eventCallback("onComplete",r);}),Promise.race([ready,cap])]).then(function(){
      // מהאישון נפתח חור שמגלה את האתר. וההירו עולה באותו רגע
      var b=pupil.getBoundingClientRect(),mx=b.left+b.width/2,my=b.top+b.height/2;
      pl.style.setProperty("--mx",mx+"px");pl.style.setProperty("--my",my+"px");
      var far=Math.hypot(Math.max(mx,innerWidth-mx),Math.max(my,innerHeight-my))+40,o={r:0};
      // בלי pl-on נעלמים גם השוליים השמורים לפס הגלילה, והרוחב משתנה: מודדים מחדש עכשיו
      pl.classList.add("out");doc.classList.remove("pl-on");ScrollTrigger.refresh();
      setTimeout(plDone,120);
      gsap.timeline({onComplete:function(){pl.remove();ScrollTrigger.refresh();}})
        .to(o,{r:far,duration:1.05,ease:"power3.inOut",onUpdate:function(){pl.style.setProperty("--r",o.r+"px");}},.1)
        .to(logo,{scale:1.12,autoAlpha:0,duration:.6,ease:"power2.in"},.15);
    });
  })();

  /* ================= ההירו: הכניסה אחרי מסך הטעינה, וההתנהגות של כל פריסה ================= */
  afterPl(function(){doc.classList.add("hr-go");});
  (function(){
    var mm=hasGsap?gsap.matchMedia():null;

    // 1 · העבודה מתרחקת לאט אל מקומה, ובגלילה נשארת מעט מאחור
    if(HERO===1&&mm){
      var pic=top.querySelector(".h1x-m"),im=pic.querySelector("img");
      mm.add("(prefers-reduced-motion: no-preference)",function(){
        gsap.set(im,{scale:1.15});
        afterPl(function(){gsap.to(im,{scale:1,duration:2.2,ease:"power3.out"});});
        gsap.to(pic,{yPercent:12,ease:"none",scrollTrigger:{trigger:top,start:"top top",end:"bottom top",scrub:true}});
      });
    }

    // 2 · האריחים נפתחים אחד אחרי השני, והעבודות שבתוכם מתרחקות למקום
    if(HERO===2&&mm){
      var ts=[].slice.call(top.querySelectorAll(".m2-t")),tim=ts.map(function(t){return t.querySelector("img");});
      mm.add("(prefers-reduced-motion: no-preference)",function(){
        gsap.set(ts,{clipPath:"inset(100% 0% 0% 0%)"});gsap.set(tim,{scale:1.25});
        afterPl(function(){
          gsap.to(ts,{clipPath:"inset(0% 0% 0% 0%)",duration:1.2,ease:"power4.inOut",stagger:.09});
          gsap.to(tim,{scale:1,duration:1.8,ease:"power3.out",stagger:.09});
        });
      });
    }

    // 3 · שני טורי עבודות שנעים בכיוונים הפוכים. התמונות נכנסות פעמיים כדי שהלולאה תהיה רציפה, ויש כפתור עצירה
    if(HERO===3){
      var s3=top.querySelector(".s3"),pb=s3.querySelector(".s3-pause");
      s3.querySelectorAll(".s3-tr").forEach(function(tr){
        var one=tr.dataset.imgs.split(" ").map(function(n){var m=DUMMY(n);
          return '<figure><img src="'+m.thumb+'" alt="" width="900" height="'+Math.round(m.h*900/m.w)+'" decoding="async"></figure>';}).join("");
        tr.innerHTML=one+one;
      });
      pb.addEventListener("click",function(){var on=!s3.classList.contains("paused");s3.classList.toggle("paused",on);pb.setAttribute("aria-pressed",String(on));});
    }

    // 4 · המילה שבכותרת מחליפה את העבודה בתוך העדשה, והאישון מסתכל עליה. מתחלף לבד שלושה סבבים, וריחוף על מילה עוצר עליה
    if(HERO===4){
      var l4=top.querySelector(".l4"),hw=[].slice.call(l4.querySelectorAll(".hw")),lim=[].slice.call(l4.querySelectorAll(".l4-view img")),k4=0,n4=0,tm4=0,hold4=false;
      var set4=function(i){
        k4=i;l4.setAttribute("data-k",i);
        hw.forEach(function(w){w.classList.toggle("on",+w.dataset.k===i);});
        lim.forEach(function(m){m.classList.toggle("on",+m.dataset.k===i);});
      };
      set4(0);
      hw.forEach(function(w){
        w.addEventListener("pointerenter",function(){hold4=true;set4(+w.dataset.k);});
        w.addEventListener("pointerleave",function(){hold4=false;});
      });
      if(!still.matches)afterPl(function(){
        tm4=setInterval(function(){
          if(hold4||document.hidden)return;
          if(++n4>=9){clearInterval(tm4);set4(0);return;}
          set4((k4+1)%3);
        },2600);
      });
    }

    // 5 · החלון 16:9 נפתח בגלילה למסך המלא, מחשיך, ומוסר את המסך לעבודות שעל השחור. בטלפון ובהפחתת תנועה הוא נשאר במקומו
    if(HERO===5&&mm){
      var x5=top.querySelector(".x5"),pin=x5.querySelector(".x5-pin"),slot=x5.querySelector(".x5-slot"),m5=x5.querySelector(".x5-m"),o5=x5.querySelector(".x5-o");
      var hd5=function(v){if(v===x5Dark)return;x5Dark=v;top.setAttribute("data-hd",v?"dark":"light");G.hdCheck();};
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)",function(){
        // העבודה עוברת לשכבה בגודל המסך, ונחתכת לגודל החלון. כך הפתיחה רציפה, בלי קפיצה בחיתוך
        x5.classList.add("live");pin.appendChild(m5);
        var ins=function(){
          var s=slot.getBoundingClientRect(),p=pin.getBoundingClientRect();
          return "inset("+(s.top-p.top).toFixed(1)+"px "+(p.right-s.right).toFixed(1)+"px "+(p.bottom-s.bottom).toFixed(1)+"px "+(s.left-p.left).toFixed(1)+"px round 4px)";
        };
        if(doc.classList.contains("hr-intro")){gsap.set(m5,{opacity:0});afterPl(function(){gsap.to(m5,{opacity:1,duration:.9,delay:.1,ease:"power2.out"});});}
        gsap.timeline({scrollTrigger:{trigger:pin,start:"top top",end:"+=140%",pin:true,scrub:.6,anticipatePin:1,invalidateOnRefresh:true,
          onUpdate:function(s){hd5(s.progress>.5);}}})
          .fromTo(m5,{clipPath:ins},{clipPath:"inset(0px 0px 0px 0px round 0px)",ease:"power2.inOut",duration:1})
          .fromTo(m5.querySelector("img"),{scale:1.1},{scale:1,ease:"none",duration:1},0)
          // הכותרת נעלמת בזמן שהעבודה גדלה מעליה, כדי שלא יישארו חצאי מילים בצד
          .to(x5.querySelector(".hr-txt"),{opacity:0,ease:"none",duration:.35},.1)
          .to(o5,{opacity:1,ease:"none",duration:.45},.8);
        return function(){x5.classList.remove("live");slot.appendChild(m5);hd5(false);};
      });
    }
  })();

  /* ================= בורר ההירו להשוואה: גלולה קטנה בתחתית, רק כשההירו במסך ================= */
  (function(){
    var nav=document.getElementById("hrp");if(!nav)return;
    var q=new URLSearchParams(location.search),h='<span class="hrp-l" aria-hidden="true">הירו</span>';
    for(var i=1;i<=5;i++){q.set("hero",i);h+='<a href="?'+q+'" aria-label="הירו '+i+'"'+(i===HERO?' aria-current="true"':'')+'>'+i+'</a>';}
    nav.innerHTML=h;
    function chk(){nav.classList.toggle("off",x5Dark||top.getBoundingClientRect().bottom<innerHeight*.55);}
    addEventListener("scroll",chk,{passive:true});addEventListener("resize",chk);chk();
  })();

  /* ================= עבודות נבחרות על שחור: עבודה אחת לכל מסך, שנפתחת ונערמת על הקודמת (ברוח Tyco) =================
     פגישת 26.10: בלי כותרות על העבודה. מספר ותיאור מוצנעים, ושם הלקוח בפס קבוע בתחתית המסך */
  var BYID={};WORKS.forEach(function(w){BYID[w.id]=w;});
  // פיקסל ריק למקור של תמונה שמוסתרת ברוחב מסוים, כדי שלא תרד שם
  var NOPX="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
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
    var featEl=document.getElementById("feat"),N=FEAT.length;
    featEl.innerHTML=FEAT.map(function(s,i){
      var w=BYID[s.ws[0]];
      return '<article class="fp" aria-labelledby="fp-'+i+'">'+
        '<h3 class="sr" id="fp-'+i+'">'+s.n+'</h3>'+
        '<figure class="fp-media"><picture>'+(w.port?'<source media="(max-width:767px)" srcset="'+w.port+'">':'')+
          '<img src="'+w.src+'" alt="" width="'+w.w+'" height="'+w.h+'" loading="'+(i?"lazy":"eager")+'" decoding="async"></picture></figure>'+
        '<p class="fp-txt" aria-hidden="true"><span class="fp-n">'+pad(i+1)+' / '+pad(N)+'</span><span class="fp-d">'+s.d+'</span></p>'+
        '<button class="fp-hit" type="button" data-k="'+i+'" aria-label="'+s.n+": "+s.d+', פתיחת העבודות"></button>'+
      '</article>';
    }).join("");
    featEl.addEventListener("click",function(e){var b=e.target.closest(".fp-hit");if(b)lb.open(setLB(FEAT[+b.dataset.k]),0,b);});
    G.projectCursor([featEl],".fp-hit");
    var fps=[].slice.call(featEl.children);
    if(hasGsap)gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      // הערימה גם בטלפון, עם התמונה לאורך
      featEl.classList.add("is-stack");
      fps.forEach(function(fp,i){
        var media=fp.querySelector(".fp-media"),img=media.querySelector("img"),txt=fp.querySelector(".fp-txt");
        var st={trigger:fp,start:"top bottom",end:"top top",scrub:.5,invalidateOnRefresh:true};
        // נפתח מהמרכז תוך כדי שהוא עולה, והעבודה מתרחקת מעט (zoom out, כמו ב-Tyco)
        gsap.fromTo(media,{clipPath:function(){return innerWidth<768?"inset(8% 6% 8% 6% round 4px)":"inset(14% 12% 14% 12% round 4px)";}},
          {clipPath:"inset(0% 0% 0% 0% round 0px)",ease:"none",scrollTrigger:st});
        gsap.fromTo(img,{scale:1.22},{scale:1,ease:"none",scrollTrigger:{trigger:fp,start:"top bottom",end:"bottom top",scrub:.5}});
        gsap.fromTo(txt,{opacity:0,y:24},{opacity:1,y:0,ease:"none",scrollTrigger:{trigger:fp,start:"top 40%",end:"top 5%",scrub:.5}});
        // הקודם נדחק מעט אחורה (MV:b37), בלי להחשיך
        if(i>0)gsap.to(fps[i-1],{scale:.94,ease:"none",scrollTrigger:st});
      });
      return function(){featEl.classList.remove("is-stack");};
    });

    /* פס שם הלקוח: מתחלף לעבודה שבמסך. בח הוא נעלם בזמן הגלילה וחוזר אחרי רגע של שקט; בט הוא נשאר ומתחלף בגלגול */
    var strip=document.getElementById("wk-strip"),sn=document.getElementById("wk-n"),work=document.getElementById("work"),curK=-1,idle=0;
    function which(){var h=innerHeight*.5,k=0;for(var i=0;i<fps.length;i++)if(fps[i].getBoundingClientRect().top<=h)k=i;return k;}
    function name(k){
      if(k===curK)return;
      var first=curK<0;curK=k;
      if(I&&hasGsap&&!still.matches&&!first){
        gsap.timeline({overwrite:true}).to(sn,{yPercent:-110,duration:.28,ease:"power2.in"})
          .add(function(){sn.textContent=FEAT[k].n;}).fromTo(sn,{yPercent:110},{yPercent:0,duration:.55,ease:"power3.out"});
      }else sn.textContent=FEAT[k].n;
    }
    function inWork(){var r=work.getBoundingClientRect();return r.top<innerHeight*.35&&r.bottom>innerHeight*.75;}
    function show(){var v=inWork();if(v)name(which());strip.classList.toggle("on",v);}
    addEventListener("scroll",function(){
      if(I){show();return;}
      strip.classList.remove("on");clearTimeout(idle);idle=setTimeout(show,600);
    },{passive:true});
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

  /* ================= שלוש מחלקות: תמונה אחת קבועה לכל מחלקה, עם פילטר שחור עדין (פגישת 26.10) =================
     ח: שלושה פאנלים, והפאנל שמרחפים עליו נפתח לרוחב. ט: שמות גדולים ברשימה, ותמונה דביקה בצד שמתחלפת לשם הפעיל */
  (function(){
    if(!C)return;
    var KEYS=["branding","web","digital"],IM={branding:DUMMY("b07"),web:DUMMY("w05"),digital:DUMMY("c10")};
    function pic(m,sizes,cls){return '<img'+(cls?' class="'+cls+'"':'')+' src="'+m.src+'" srcset="'+m.thumb+' 900w, '+m.src+' 2400w" sizes="'+sizes+'" alt="" width="'+m.w+'" height="'+m.h+'" loading="lazy" decoding="async">';}

    var dpa=document.getElementById("dpa");
    if(dpa){
      dpa.innerHTML=KEYS.map(function(k,i){var d=C.depts[k];
        return '<li class="dpa-i'+(i?'':' on')+'" data-d="'+k+'"><a class="dpa-a" href="work.html?d='+k+'">'+
          '<span class="dpa-m" aria-hidden="true">'+pic(IM[k],"(max-width:767px) 100vw, 58vw")+'</span>'+
          '<span class="dpa-t">'+
            '<span class="dpa-n">'+d.name+'</span>'+
            '<span class="dpa-s"><span>'+d.services.slice(0,3).join(" · ")+'</span></span></span>'+
          '<span class="dpa-go" aria-hidden="true">'+ARR+'</span>'+
        '</a></li>';}).join("");
      var items=[].slice.call(dpa.children),cur=items[0],wide=matchMedia("(min-width:768px)");
      var open=function(li){if(li===cur)return;cur.classList.remove("on");li.classList.add("on");cur=li;};
      items.forEach(function(li){
        li.addEventListener("pointerenter",function(e){if(e.pointerType==="mouse"&&wide.matches)open(li);});
        li.querySelector("a").addEventListener("focus",function(){open(li);});
      });
    }

    var dpb=document.getElementById("dpb");
    if(dpb){
      // התמונה הדביקה מוסתרת בטלפון, ולכן שם היא מקבלת פיקסל ריק ולא יורדת
      dpb.innerHTML='<div class="dpb-media" aria-hidden="true"><div class="dpb-frame">'+KEYS.map(function(k,i){return '<picture><source media="(max-width:767px)" srcset="'+NOPX+'">'+pic(IM[k],"44vw",i?"":"on")+'</picture>';}).join("")+'</div></div>'+
        '<ol class="dpb-l">'+KEYS.map(function(k,i){var d=C.depts[k],m=IM[k];
          return '<li class="dpb-i'+(i?'':' on')+'"><a class="dpb-a" href="work.html?d='+k+'">'+
            '<span class="dpb-im" aria-hidden="true"><img src="'+m.thumb+'" alt="" width="900" height="'+Math.round(m.h*900/m.w)+'" loading="lazy" decoding="async"></span>'+
            '<span class="dpb-n">'+d.name+'</span>'+
            '<span class="dpb-s">'+d.services.slice(0,4).join(" · ")+'</span>'+
            '<span class="dpb-go" aria-hidden="true">'+ARR+'</span>'+
          '</a></li>';}).join("")+'</ol>';
      var lis=[].slice.call(dpb.querySelectorAll(".dpb-i")),ims=[].slice.call(dpb.querySelectorAll(".dpb-frame img")),on=0;
      var pick=function(i){
        if(i===on)return;on=i;
        lis.forEach(function(l,j){l.classList.toggle("on",j===i);});
        ims.forEach(function(m,j){m.classList.toggle("on",j===i);});
      };
      lis.forEach(function(li,i){
        li.addEventListener("pointerenter",function(e){if(e.pointerType==="mouse")pick(i);});
        li.querySelector("a").addEventListener("focus",function(){pick(i);});
        // בגלילה: השם שבאמצע המסך הוא הפעיל
        if(hasGsap)ScrollTrigger.create({trigger:li,start:"top 55%",end:"bottom 45%",onToggle:function(s){if(s.isActive)pick(i);}});
      });
    }
  })();

  /* ================= ציטוט נקי, בלי עבודות מאחור (פגישת 26.10). ח: המילים נדלקות בגלילה. ט: השורות עולות מתוך מסכה ================= */
  (function(){
    var p=document.getElementById("qt-p");if(!p)return;
    function split(el){
      [].slice.call(el.childNodes).forEach(function(n){
        if(n.nodeType===3){
          var f=document.createDocumentFragment(),prev=n.previousSibling,first=true;
          n.textContent.split(/(\s+)/).forEach(function(t){
            if(!t)return;
            if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));first=false;return;}
            var s=document.createElement("span");s.className="w";s.textContent=t;
            if(I){var m=document.createElement("span");m.className="wm";m.appendChild(s);s=m;}
            // פסיק שצמוד למילה המודגשת לא יורד לבד לשורה הבאה
            if(first&&prev&&prev.nodeType===1){var nw=document.createElement("span");nw.style.whiteSpace="nowrap";el.insertBefore(nw,prev);nw.appendChild(prev);nw.appendChild(s);first=false;return;}
            first=false;f.appendChild(s);
          });
          el.replaceChild(f,n);
        }else if(n.nodeType===1)split(n);
      });
    }
    split(p);
    if(!hasGsap)return;
    var ws=[].slice.call(p.querySelectorAll(".w"));
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      if(!I){
        gsap.set(ws,{"--lit":0});
        gsap.to(ws,{"--lit":1,ease:"none",stagger:.4,duration:1,scrollTrigger:{trigger:p,start:"top 80%",end:"bottom 48%",scrub:.5}});
        return function(){gsap.set(ws,{clearProps:"--lit"});};
      }
      // כל מילה יודעת באיזו שורה היא, והשורות עולות אחת אחרי השנייה
      gsap.set(ws,{yPercent:108});
      var st=ScrollTrigger.create({trigger:p,start:"top 78%",once:true,onEnter:function(){
        var tops=[],L=ws.map(function(w){var t=Math.round(w.parentNode.offsetTop),k=tops.indexOf(t);if(k<0){tops.push(t);k=tops.length-1;}return k;});
        gsap.to(ws,{yPercent:0,duration:1.1,ease:"power4.out",delay:function(i){return L[i]*.13;}});
      }});
      return function(){st.kill();gsap.set(ws,{clearProps:"transform"});};
    });
  })();

  /* ================= ככה עוטפים זהב: שבע עבודות גדולות בעומק, משני צדי הכותרת. הגלילה מרימה כל אחת בקצב שלה (MV:g37) ================= */
  (function(){
    var sec=document.getElementById("cloud"),box=document.getElementById("cd-imgs");if(!sec)return;
    // [עבודה, x, y, רוחב, עומק, ובטלפון x, y, רוחב]. x ו-y באחוזים מהסקשן, ועומק גבוה עולה מהר יותר ויושב מעל.
    // פגישת 26.10: פחות עבודות וגדולות יותר. האמצע נשאר פנוי לכותרת, ושלוש מתחילות מתחת לקצה ועולות בזמן הגלילה.
    // בלי ערכי טלפון העבודה לא מוצגת בטלפון
    var CLOUD=[
      ["puzzle-soups",2,6,26,.8, 4,6,54],
      ["crunchy-truck",72,12,25,1.2, 58,14,38],
      ["praium-mag",6,52,19,1.3, 6,72,40],
      ["katz-resort-site",71,58,26,.9, 50,80,46],
      ["mbc-instagram",3,100,22,1.1],
      ["izraex-site",74,112,21,1.5],
      ["smartnpv-can",10,150,17,1.7]
    ];
    box.innerHTML=CLOUD.map(function(c){
      var w=BYID[c[0]],m=c.length>5;
      return '<button type="button" class="cd-i'+(m?"":" cd-dt")+(c[2]>=90?" cd-w":"")+'" data-id="'+w.id+'" data-d="'+c[4]+'" aria-label="'+w.client_he+" · "+w.title_he+', תצוגה מלאה"'+
        ' style="--x:'+c[1]+';--y:'+c[2]+';--w:'+c[3]+(m?';--mx:'+c[5]+';--my:'+c[6]+';--mw:'+c[7]:"")+';--ar:'+w.w+'/'+w.h+';z-index:'+Math.round(c[4]*10)+'">'+
        (m?'':'<picture><source media="(max-width:767px),(orientation:portrait) and (max-width:1199px)" srcset="'+NOPX+'">')+
        '<img src="'+thumb(w)+'" srcset="'+thumb(w)+' 900w, '+w.src+' '+w.w+'w" sizes="(max-width:767px) '+(m?c[7]:1)+'vw, '+c[3]+'vw" alt="" width="'+w.w+'" height="'+w.h+'" loading="lazy" decoding="async">'+(m?'':'</picture>')+'</button>';
    }).join("");
    // פייד רק בצבע הרקע המדויק, בין העבודות לכותרת
    box.insertAdjacentHTML("afterend",'<div class="cd-fade" aria-hidden="true"></div>');
    var btns=[].slice.call(box.children);
    // החיצים במציג עוברים בין העבודות שבענן (בטלפון רק בין אלה שמוצגות)
    box.addEventListener("click",function(e){
      var b=e.target.closest(".cd-i");if(!b)return;
      var vis=btns.filter(function(x){return x.getClientRects().length;});
      lb.open(vis.map(function(x){return lbItem(BYID[x.dataset.id]);}),vis.indexOf(b),b);
    });
    G.projectCursor([box],".cd-i");
    if(!hasGsap)return;
    gsap.matchMedia().add({ok:"(prefers-reduced-motion: no-preference)",wide:"(min-width:768px) and (orientation:landscape), (min-width:1200px)"},function(cx){
      if(!cx.conditions.ok)return;
      // opacity ולא autoAlpha: עבודה שעוד לא נכנסה נשארת זמינה במקלדת
      gsap.set(btns,{opacity:0,scale:.92});
      gsap.to(btns,{opacity:1,scale:1,duration:1,ease:"power3.out",stagger:{each:.08,from:"random"},
        scrollTrigger:{trigger:sec,start:"top 70%",toggleActions:"play none none none"}});
      if(cx.conditions.wide){
        var tl=gsap.timeline({scrollTrigger:{trigger:sec,start:"top top",end:"+=130%",pin:true,scrub:.6,invalidateOnRefresh:true}});
        btns.forEach(function(b){tl.to(b,{y:function(){return -sec.offsetHeight*.5*(+b.dataset.d);},ease:"none"},0);});
      }else{
        // בטלפון בלי נעילה: העבודות למעלה ולמטה זזות מעט בקצב שונה, ולא עוברות על הכותרת. עבודה שמוסתרת בטלפון לא זזה
        btns.filter(function(b){return !b.classList.contains("cd-dt");}).forEach(function(b){
          gsap.fromTo(b,{y:function(){return sec.offsetHeight*.05*(+b.dataset.d);}},{y:function(){return -sec.offsetHeight*.08*(+b.dataset.d);},ease:"none",
            scrollTrigger:{trigger:sec,start:"top bottom",end:"bottom top",scrub:.6,invalidateOnRefresh:true}});
        });
      }
      if(!fine.matches)return;
      var qs=btns.map(function(b){return {x:gsap.quickTo(b,"x",{duration:.9,ease:"power3"}),d:+b.dataset.d};});
      function move(e){var r=sec.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5;qs.forEach(function(q){q.x(-nx*50*q.d);});}
      sec.addEventListener("mousemove",move);
      return function(){sec.removeEventListener("mousemove",move);};
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
      var tl=gsap.timeline({onUpdate:paint,scrollTrigger:cx.conditions.wide?{trigger:pin,start:"center center",end:"+=200%",pin:true,scrub:.7,anticipatePin:1,
        onRefresh:function(s){measure();tl.progress(s.progress);}}:{trigger:fig,start:"top 70%",end:"bottom 45%",scrub:.7,
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
    // טופס קצר: שם, טלפון ומה רוצים. הפנייה נשלחת עם נושא קבוע, כדי שבמשרד יזהו אותה מיד
    ["email","org"].forEach(function(k){var i=root.querySelector("[data-v="+k+"]");if(i)i.closest(".cf-f").remove();});
    var need=root.querySelector(".cf-need");if(need)need.remove();
    var form=root.querySelector("form"),nm=root.querySelector("[data-v=name]"),subj=document.createElement("input");
    subj.type="hidden";subj.name="subject";form.appendChild(subj);
    function setSubj(){var n=nm.value.trim();subj.value="פנייה חדשה מהאתר של ויזואל"+(n?" מאת "+n:"");}
    nm.addEventListener("input",setSubj);setSubj();
    var msg=root.querySelector("textarea");if(msg){var lab=root.querySelector('label[for="'+msg.id+'"]');if(lab)lab.firstChild.textContent="מה אתם מתכננים? ";}
  })();

  /* ט: "בואו נדבר על ___ שלכם", והמילה מתחלפת (כיוון Firma). שלושה סבבים ונעצרת על הראשונה, וריחוף עוצר אותה */
  (function(){
    var r=document.getElementById("ct-rot");if(!r)return;
    var ws=[].slice.call(r.children),k=0,n=0,hold=false,h=r.closest("h2");
    // רוחב המילה הפעילה, כדי ש"שלכם" יישאר צמוד אליה ויזוז איתה
    function fit(){r.style.width=ws[k].getBoundingClientRect().width+"px";}
    fit();if(document.fonts)document.fonts.ready.then(fit);addEventListener("resize",fit);
    if(still.matches)return;
    h.addEventListener("pointerenter",function(){hold=true;});h.addEventListener("pointerleave",function(){hold=false;});
    var tm=setInterval(function(){
      if(hold||document.hidden)return;
      var a=ws[k];k=(k+1)%ws.length;var b=ws[k];
      a.classList.remove("on");a.classList.add("out");b.classList.remove("out");b.classList.add("on");fit();
      setTimeout(function(){a.classList.remove("out");},800);
      if(++n>=9)clearInterval(tm);
    },2400);
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
      if(go||!atEnd())return;
      set(p+d);last=performance.now();
      if(p>=1){go=true;nx.classList.add("done");setTimeout(function(){location.href=a.href;},420);return;}
      if(!raf)raf=requestAnimationFrame(drain);
    }
    addEventListener("wheel",function(e){if(e.deltaY>0)push(Math.min(.07,e.deltaY/1800));},{passive:true});
    addEventListener("touchstart",function(e){ty=e.touches[0].clientY;},{passive:true});
    addEventListener("touchmove",function(e){if(ty==null)return;var y=e.touches[0].clientY,d=ty-y;ty=y;if(d>0)push(d/900);},{passive:true});
    addEventListener("keydown",function(e){
      if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;
      if(e.key==="ArrowDown"||e.key==="PageDown"||e.key==="End"||e.key===" ")push(.1);
    });
    // חזרה בכפתור "אחורה" מחזירה טבעת ריקה
    addEventListener("pageshow",function(){go=false;nx.classList.remove("done");set(0);});
  })();

  /* ט: כל העמוד מתחלף לצבע של האזור שמגיעים אליו */
  if(I){
    ["work","more","contact","ft"].forEach(function(id){var el=document.getElementById(id);G.zone(el,id==="contact"?"green":"dark");});
    G.zone(document.querySelector(".dz"),"dark");
  }

  /* ================= הפעלה: הפונטים משנים גבהים, ולכן מודדים אחריהם ================= */
  function start(){if(hasGsap)ScrollTrigger.refresh();G.hdScan();}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(start);else addEventListener("load",start);
  rv(document);doc.classList.add("rv-ok");
})();
