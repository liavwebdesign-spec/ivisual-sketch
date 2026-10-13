/* סקיצה ד · "העדשה הבהירה"
   ההירו של העדשה (MV:g11) על קיר בהיר ואפור, מיושר לשמונה קווי עמודות (MV:b10). מתחתיו: פסקה שנצבעת עם הגלילה (MV:g48),
   אינדקס מחלקות ענק עם עדשה קטנה שרודפת את העכבר (MV:g43), מילים ענקיות עם עבודות בתוך האותיות (MV:g123, MV:g58),
   ארבעה פאנלים שנפתחים ונערמים (MV:g56, MV:b37), גריד מסונן (MV:b34) וטבלת לקוחות. התפריט והניקיון מהאינדקס (MV:hd4). */
(function(){
  var WORKS=(window.WORKS||[]).slice();
  var C=window.CONTENT;
  var fine=matchMedia("(hover:hover) and (pointer:fine)");
  var still=matchMedia("(prefers-reduced-motion: reduce)");
  var hasGsap=!!(window.gsap&&window.ScrollTrigger);
  if(hasGsap)gsap.registerPlugin(ScrollTrigger);
  if(window.Flip)gsap.registerPlugin(Flip);
  var doc=document.documentElement;
  var ARR='<svg class="arr" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 10H5m4-4-4 4 4 4"/></svg>';
  /* גלילה רכה לעוגנים: האצה והאטה עדינות, והזמן גדל עם המרחק. גלגלת או מגע של המשתמש עוצרים אותה */
  var glide=null;
  function stopGlide(){if(glide){glide.kill();glide=null;}}
  ["wheel","touchstart","keydown"].forEach(function(t){addEventListener(t,stopGlide,{passive:true});});
  function scrollToY(y){
    y=Math.max(0,Math.min(y,doc.scrollHeight-innerHeight));stopGlide();
    if(still.matches||!hasGsap){scrollTo(0,y);return;}
    var o={y:scrollY},d=Math.abs(y-scrollY);
    glide=gsap.to(o,{y:y,duration:Math.min(2,.8+d/5000),ease:"power3.inOut",onUpdate:function(){scrollTo(0,o.y);},onComplete:function(){glide=null;}});
  }
  function go(el,block){
    var r=el.getBoundingClientRect(),y=r.top+scrollY;
    if(block==="center")y-=(innerHeight-r.height)/2;
    scrollToY(y);
  }
  document.addEventListener("click",function(e){
    if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;
    var id=a.getAttribute("href").slice(1),t=id&&document.getElementById(id);if(!t)return;
    e.preventDefault();
    if(id==="top")scrollToY(0);else go(t);
    if(history.pushState)history.pushState(null,"","#"+id);
    if(!/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(t.tagName)&&!t.hasAttribute("tabindex"))t.setAttribute("tabindex","-1");
    t.focus({preventScroll:true});
  });
  function depsTag(w){return w.departments.length===3?'<i class="all">כל המחלקות</i>':w.departments.map(function(d){return "<i>"+DEPTS_SHORT[d]+"</i>";}).join("");}

  /* העבודות הטובות קודם, ובתוכן הציבוריות */
  var good=WORKS.slice().sort(function(a,b){
    var q={good:0,ok:1,poor:2};
    return (q[a.quality]!=null?q[a.quality]:1)-(q[b.quality]!=null?q[b.quality]:1)||(b.public_body===true)-(a.public_body===true);
  });

  /* ================= קווי העמודות: שמונה עמודות בדסקטופ, שוליים ואמצע בטלפון ================= */
  var cols=document.getElementById("cols"),heroTxt=document.querySelector(".hero-txt");
  function lines(){
    var W=doc.clientWidth,cw=W/8,xs=[];
    doc.style.setProperty("--colw",cw+"px");
    if(W>=1024){for(var i=1;i<8;i++)xs.push(i*cw);}
    else{var g=parseFloat(getComputedStyle(heroTxt).paddingLeft)||24;xs=[g,W/2,W-g];}
    if(cols)cols.innerHTML=xs.map(function(x,i){return '<i style="left:'+x.toFixed(1)+'px;--i:'+i+'"></i>';}).join("");
  }
  lines();

  /* ================= הדר: צף מינימלי, תפריט מסך מלא שנפתח במעגל מהכפתור (MV:hd4, מהאינדקס) ================= */
  (function(){
    var hd=document.getElementById("hd"),btn=document.getElementById("fs-open"),fs=document.getElementById("fs");
    var closeBtn=fs.querySelector(".fs-close");
    headroom(hd);
    function set(open,back){
      if(open){
        var r=btn.getBoundingClientRect();
        fs.style.setProperty("--cx",(r.left+r.width/2)+"px");fs.style.setProperty("--cy",(r.top+r.height/2)+"px");
      }
      fs.classList.toggle("open",open);fs.inert=!open;
      btn.setAttribute("aria-expanded",String(open));hd.classList.toggle("menu-open",open);
      doc.style.scrollbarGutter=open?"stable":"";doc.style.overflow=open?"hidden":"";
      if(open)setTimeout(function(){closeBtn.focus({preventScroll:true});},still.matches?0:320);
      else if(back!==false)btn.focus({preventScroll:true});
    }
    // הסימן בתפריט: העבודה של הפריט מופיעה בתוך העדשה, והאישון מסתכל עליו
    var eye=fs.querySelector(".fs-eye"),pupil=fs.querySelector(".fs-pupil"),eImgs=fs.querySelectorAll(".fs-view img"),eCur=0;
    function look(a){
      var src=a.getAttribute("data-img"),now=eImgs[eCur];
      if(src&&now.getAttribute("src")!==src){var nx=eImgs[1-eCur];nx.src=src;nx.classList.remove("nx");now.classList.add("nx");eCur=1-eCur;}
      // האישון נע על שפת הטבעת, לצד הפריט, ולא נוחת בתוך המילים
      var i=+getComputedStyle(a).getPropertyValue("--i")||0,t=Math.PI-(i-2)*.34,R=46.5;
      pupil.style.left=(50+R*Math.cos(t)-2.5).toFixed(2)+"%";pupil.style.top=(50+R*Math.sin(t)-2.5).toFixed(2)+"%";
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

  /* ================= מסך טעינה: הלוגו מצטייר, והעדשה שלו נפתחת אל האתר ================= */
  (function(){
    var pl=document.getElementById("pl");if(!pl)return;
    function done(){doc.classList.remove("pl-on");pl.remove();if(hasGsap)ScrollTrigger.refresh();}
    if(!hasGsap||!doc.classList.contains("pl-on")){done();return;}
    var ring=pl.querySelector(".pl-ring"),sat=pl.querySelector(".pl-sat"),pupil=pl.querySelector(".pl-pupil"),word=pl.querySelector(".pl-word"),logo=pl.querySelector(".pl-logo"),mark=pl.querySelector(".pl-mark");
    var cR=2*Math.PI*240,cS=2*Math.PI*97;
    // בהתחלה הסימן לבד במרכז; כשהמילה נכתבת, הלוגו כולו זז למרכז
    var shift=function(){return logo.offsetWidth*(1-.2979)/2;};
    gsap.set(ring,{strokeDasharray:cR,strokeDashoffset:cR,rotation:-120,transformOrigin:"50% 50%"});
    gsap.set(sat,{strokeDasharray:cS,strokeDashoffset:cS,rotation:150,transformOrigin:"50% 50%"});
    gsap.set(pupil,{scale:0,transformOrigin:"50% 50%"});
    gsap.set(logo,{x:shift});
    var ready=new Promise(function(res){
      var n=0;function one(){if(++n===2)res();}
      if(document.readyState==="complete")one();else addEventListener("load",one,{once:true});
      setTimeout(one,1500);   // מינימום, כדי שהאנימציה תספיק להתנגן
    });
    var cap=new Promise(function(res){setTimeout(res,4200);});
    var tl=gsap.timeline();
    tl.to(ring,{strokeDashoffset:0,rotation:-90,duration:.8,ease:"power3.inOut"})
      .to(sat,{strokeDashoffset:0,rotation:0,duration:.5,ease:"power2.out"},"-=.28")
      .to(pupil,{scale:1,duration:.5,ease:"back.out(2.4)"},"-=.3")
      // האישון מסתכל ימינה, למטה, וחוזר למקום שלו בלוגו
      .to(pupil,{x:120,y:20,duration:.26,ease:"power2.inOut"},"+=.02")
      .to(pupil,{x:50,y:110,duration:.22,ease:"power2.inOut"})
      .to(pupil,{x:0,y:0,duration:.3,ease:"back.out(1.6)"})
      // הסימן המצויר מתחלף בסימן המקורי מהלוגו, ואז "visual" נכתב והכול זז למרכז
      .to(word,{opacity:1,duration:.18,ease:"none"},"-=.05").set(mark,{autoAlpha:0})
      .to(logo,{x:0,duration:.75,ease:"power3.inOut"},"+=.02")
      .to(word,{clipPath:"inset(0 0% 0 0)",duration:.7,ease:"power3.out"},"<.12");
    Promise.all([new Promise(function(r){tl.eventCallback("onComplete",r);}),Promise.race([ready,cap])]).then(function(){
      // הסימן המצויר מתחלף בלוגו המקורי, ומהאישון נפתח חור שמגלה את האתר
      var b=pupil.getBoundingClientRect(),mx=b.left+b.width/2,my=b.top+b.height/2;
      pl.style.setProperty("--mx",mx+"px");pl.style.setProperty("--my",my+"px");
      var far=Math.hypot(Math.max(mx,innerWidth-mx),Math.max(my,innerHeight-my))+40,o={r:0};
      pl.classList.add("out");doc.classList.remove("pl-on");
      gsap.timeline({onComplete:function(){pl.remove();ScrollTrigger.refresh();}})
        .to(o,{r:far,duration:1.05,ease:"power3.inOut",onUpdate:function(){pl.style.setProperty("--r",o.r+"px");}},.1)
        .to(logo,{scale:1.12,autoAlpha:0,duration:.6,ease:"power2.in"},.15);
    });
  })();

  /* ================= הירו: הקיר והעדשה (MV:g11) ================= */
  var hero=document.querySelector(".hero"),stage=hero.querySelector(".stage"),wrap=stage.querySelector(".wall-wrap");
  var base=wrap.querySelector(".wall-base"),lens=wrap.querySelector(".lens"),view=lens.querySelector(".lens-view"),tag=lens.querySelector(".lens-tag");
  var heroMain=heroTxt.querySelector(".hero-main");
  var Z=1.4,clone=null,tiles=[],cTiles=[],rects=[],D=0,nCols=0,maxY=1e4;
  // אריח כפול מדי כמה אריחים: הקיר נראה כמו תיק ולא כמו טבלה
  var SPAN=["","c2","","","h2x","","","","w2","","","","c2","","","h2x","","w2","",""];
  var pool=good.filter(function(w){return w.quality!=="poor";});
  if(!pool.length)pool=WORKS;
  var shown=[];
  function colsFor(w){return w>=1024?8:w>=700?4:3;}
  function build(){
    if(!pool.length)return;
    nCols=colsFor(doc.clientWidth);
    var W=stage.offsetWidth,colW=W/nCols,row=Math.round(colW*.76);
    wrap.style.setProperty("--cols",nCols);wrap.style.setProperty("--row",row+"px");
    var rows=Math.ceil(stage.offsetHeight*1.1/row)+1,cells=nCols*rows,used=0,i=0,html="";
    shown=[];
    while(used<cells){
      var s=SPAN[i%SPAN.length];if(nCols<4&&s==="w2")s="";
      var k=i%pool.length;shown.push(k);
      html+='<div class="t'+(s?" "+s:"")+'" style="--d:'+((i%nCols)*60+Math.floor(i/nCols)*40)+'"><img src="'+pool[k].src+'" alt="" decoding="async"></div>';
      used+=s==="c2"?4:s?2:1;i++;
    }
    base.innerHTML=html;
    clone=base.cloneNode(true);clone.classList.remove("wall-base");
    view.innerHTML="";view.appendChild(clone);
    tiles=[].slice.call(base.children);cTiles=[].slice.call(clone.children);
    measure();
  }
  var rest={x:0,y:0},moved=false;
  function measure(){
    D=lens.offsetWidth;
    clone.style.width=base.offsetWidth+"px";
    rects=tiles.map(function(t){return {x:t.offsetLeft,y:t.offsetTop,w:t.offsetWidth,h:t.offsetHeight};});
    // העדשה והתגית שלה נשארות מעל הטקסט: הטקסט יושב על הרקע, לא מתחת לעדשה
    var side=heroTxt.querySelector(".hero-side");
    var top=heroTxt.offsetTop+Math.min(heroMain.offsetTop,side?side.offsetTop:1e9)-wrap.offsetTop;
    maxY=top-D/2-84;   // מקום גם לתגית שמתחת לעדשה
    // התחתית של הקיר נמסה לרקע מעל הטקסט: מסכה על הקיר עצמו, כך שהעדשה נשארת בצבע מלא
    var f=innerWidth<768?150:300;
    var m="linear-gradient(to bottom,#000 "+Math.round(top-f)+"px,rgba(0,0,0,.5) "+Math.round(top-f*.47)+"px,transparent "+Math.round(top+10)+"px)";
    base.style.webkitMaskImage=base.style.maskImage=m;
    rest=restPoint();
    if(!moved)jump(rest.x,rest.y);
  }
  function tileAt(x,y){for(var i=0;i<rects.length;i++){var r=rects[i];if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)return i;}return -1;}
  function restPoint(){
    var mob=innerWidth<768,x=stage.offsetWidth*(mob?.5:.3),y=Math.min(stage.offsetHeight*(mob?.24:.34),maxY)-wrap.offsetTop;
    var i=tileAt(x,y);if(i<0)return {x:x,y:y};
    var r=rects[i];return {x:r.x+r.w/2,y:Math.min(r.y+r.h/2,maxY)};
  }
  var tx=0,ty=0,cx=0,cy=0,raf=0,cur=-1;
  function apply(){
    lens.style.transform="translate3d("+(cx-D/2).toFixed(1)+"px,"+(cy-D/2).toFixed(1)+"px,0)";
    if(clone)clone.style.transform="translate3d("+(D/2-cx*Z).toFixed(1)+"px,"+(D/2-cy*Z).toFixed(1)+"px,0) scale("+Z+")";
    var i=tileAt(cx,cy);
    if(i!==cur){cur=i;
      var w=i>=0?pool[shown[i]]:null;
      if(w){tag.innerHTML='<i></i>'+w.client_he+' · '+w.depts_he;tag.classList.add("on");}else tag.classList.remove("on");
    }
  }
  function loop(){
    cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;
    if(Math.abs(tx-cx)+Math.abs(ty-cy)<.4){cx=tx;cy=ty;apply();raf=0;return;}
    apply();raf=requestAnimationFrame(loop);
  }
  function moveTo(x,y){tx=x;ty=Math.min(y,maxY);if(still.matches){jump(tx,ty);return;}if(!raf)raf=requestAnimationFrame(loop);}
  function jump(x,y){tx=cx=x;ty=cy=Math.min(y,maxY);apply();}
  function local(e){
    var r=wrap.getBoundingClientRect(),s=r.width/wrap.offsetWidth;
    return {x:(e.clientX-r.left)/s,y:(e.clientY-r.top)/s};
  }
  // מאזינים על כל ההירו: גם כשהעכבר על הטקסט, העדשה נשארת מעליו
  // העדשה רודפת את העכבר בכל הקיר. מעל הטקסט היא נעלמת במקום להיתקע בקצה, וחוזרת בדיוק איפה שהעכבר נכנס שוב לקיר
  var away=false,mx=-1,my=-1;
  function setAway(v){if(v===away)return;away=v;lens.classList.toggle("away",v);}
  function follow(){
    if(mx<0)return;
    var p=local({clientX:mx,clientY:my});
    if(p.y>maxY+D*.35){setAway(true);return;}
    var back=away;setAway(false);
    if(back)jump(p.x,p.y);else moveTo(p.x,p.y);
  }
  hero.addEventListener("mousemove",function(e){if(!fine.matches)return;if(e.target.closest(".badge")){setAway(true);return;}moved=true;mx=e.clientX;my=e.clientY;follow();});
  hero.addEventListener("mouseleave",function(){if(!fine.matches)return;mx=-1;setAway(false);moveTo(rest.x,rest.y);});
  // גלילה בלי להזיז את העכבר: העדשה נשארת מתחת לסמן
  addEventListener("scroll",function(){if(fine.matches&&mx>=0)follow();},{passive:true});
  // מגע: העדשה עוברת לאט על הקיר עם הגלילה
  addEventListener("scroll",function(){
    if(fine.matches||!rects.length||still.matches)return;
    var p=Math.min(1,Math.max(0,scrollY/(stage.offsetHeight*.6)));
    var bx=stage.offsetWidth*.24,by=rest.y+D*.35;
    moveTo(rest.x+(bx-rest.x)*p,rest.y+(by-rest.y)*p);
  },{passive:true});

  /* הקיר "מתנגן": כל כמה שניות עבודה אחת מתחלפת, בלי תנועה רציפה */
  var onStage=true;
  if("IntersectionObserver" in window)new IntersectionObserver(function(es){onStage=es[0].isIntersecting;}).observe(stage);
  function visible(i){var r=rects[i];return r&&r.y+wrap.offsetTop<stage.offsetHeight&&r.y+r.h+wrap.offsetTop>0;}
  function swap(){
    if(still.matches||document.hidden||!onStage||pool.length<=tiles.length/2)return;
    var i,tries=0;
    do{i=Math.floor(Math.random()*tiles.length);tries++;}while((i===cur||!visible(i))&&tries<20);
    var used={};shown.forEach(function(k){used[k]=1;});
    var cand=[];for(var k=0;k<pool.length;k++)if(!used[k])cand.push(k);
    if(!cand.length)return;
    var n=cand[Math.floor(Math.random()*cand.length)];
    shown[i]=n;
    [tiles[i],cTiles[i]].forEach(function(t){
      var old=t.querySelector("img"),im=new Image();
      im.className="out";im.alt="";im.decoding="async";im.src=pool[n].src;
      im.onload=function(){t.appendChild(im);requestAnimationFrame(function(){requestAnimationFrame(function(){im.classList.remove("out");});});
        setTimeout(function(){if(old&&old.parentNode)old.remove();},1300);};
    });
  }
  build();
  if(document.fonts)document.fonts.ready.then(measure);
  if(!still.matches)setInterval(swap,2400);

  /* סצנת גלילה: הקיר נכנס פנימה לעבר העדשה, והרמז נעלם */
  if(hasGsap){
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      wrap.style.setProperty("--ox",(rest.x/wrap.offsetWidth*100)+"%");
      wrap.style.setProperty("--oy",(rest.y/wrap.offsetHeight*100)+"%");
      gsap.to(wrap,{scale:1.2,ease:"none",scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:.5}});
      gsap.to(".hint",{opacity:0,ease:"none",scrollTrigger:{trigger:hero,start:"top top",end:"15% top",scrub:true}});
    });
  }

  /* ================= תג מסתובב (MV:g83) ================= */
  (function(){
    var badge=document.querySelector(".badge"),ring=badge.querySelector(".badge-ring");
    var TXT="לכל העבודות · מיתוג · אתרים · שיווק · ";
    function lay(){
      var fs=parseFloat(getComputedStyle(ring).fontSize)||14,ls=fs*.04;
      var cv=document.createElement("canvas").getContext("2d");cv.font="500 "+fs+"px 'Google Sans', sans-serif";
      var ch=Array.from(TXT),wd=ch.map(function(c){return cv.measureText(c).width+ls;});
      var tot=wd.reduce(function(a,b){return a+b;},0),acc=0;
      // כל אות מסובבת לפי הרוחב שלה, כך שהטקסט סוגר מעגל בדיוק. בעברית האותיות מתקדמות נגד כיוון השעון
      ring.innerHTML=ch.map(function(c,i){
        var a=-(acc+wd[i]/2)/tot*360;acc+=wd[i];
        return '<span style="transform:translateX(-50%) rotate('+a.toFixed(2)+'deg)">'+(c===" "?"&nbsp;":c)+'</span>';
      }).join("");
    }
    lay();if(document.fonts)document.fonts.ready.then(lay);
    if(!hasGsap)return;
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      var spin=gsap.to(ring,{rotate:-360,duration:18,repeat:-1,ease:"none"}),hover=false;
      // גלילה מהירה וריחוף מאיצים את הסיבוב, ואחר כך הוא חוזר לקצב הרגיל
      ScrollTrigger.create({onUpdate:function(st){
        var v=Math.min(4,1+Math.abs(st.getVelocity())/700);
        if(!hover)gsap.to(spin,{timeScale:v,duration:.25,overwrite:true,onComplete:function(){if(!hover)gsap.to(spin,{timeScale:1,duration:1.2});}});
      }});
      badge.addEventListener("mouseenter",function(){hover=true;gsap.to(spin,{timeScale:3,duration:.4,overwrite:true});});
      badge.addEventListener("mouseleave",function(){hover=false;gsap.to(spin,{timeScale:1,duration:.8,overwrite:true});});
      return function(){spin.kill();};
    });
  })();

  /* ================= הצהרה: מילה אחר מילה נצבעת עם הגלילה (MV:g48) ================= */
  (function(){
    var p=document.getElementById("stmt");
    var nodes=[].slice.call(p.childNodes),out=document.createDocumentFragment();
    nodes.forEach(function(n){
      if(n.nodeType===3){
        n.textContent.split(/(\s+)/).forEach(function(t){
          if(!t)return;
          if(/^\s+$/.test(t)){out.appendChild(document.createTextNode(t));return;}
          var s=document.createElement("span");s.className="w";s.textContent=t;out.appendChild(s);
        });
      }else{n.classList.add("w");out.appendChild(n);}
    });
    p.textContent="";p.appendChild(out);
    if(!hasGsap)return;
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      var ws=[].slice.call(p.querySelectorAll(".w"));
      // נקודת ההתחלה: אפור שעובר 3:1 על הרקע, כך שגם לפני הגלילה הפסקה קריאה
      gsap.set(ws,{color:"#86828A"});
      var mks=ws.filter(function(w){return w.classList.contains("mk");});
      gsap.set(mks,{"--fill":0});
      var tl=gsap.timeline({scrollTrigger:{trigger:p,start:"top 78%",end:"bottom 52%",scrub:.4}});
      ws.forEach(function(w,i){
        tl.to(w,{color:"#1F1D20",duration:.4,ease:"none"},i*.35);
        if(w.classList.contains("mk"))tl.to(w,{"--fill":1,duration:.9,ease:"power1.inOut"},i*.35+.1);
      });
      return function(){gsap.set(ws,{clearProps:"color"});gsap.set(mks,{clearProps:"--fill"});};
    });
  })();

  /* ================= העדשה הקטנה שרודפת את העכבר (MV:g43): מחלקות ולקוחות ================= */
  var peek=document.getElementById("peek"),pkView=peek.querySelector(".pk-view"),pkCap=peek.querySelector("figcaption");
  var Peek=(function(){
    var imgs={},curSrc=null,on=false,raf=0,tx=0,ty=0,x=0,y=0,jumpNext=true,cyc=0,owner=null;
    function img(src){
      if(imgs[src])return imgs[src];
      var im=document.createElement("img");im.alt="";im.decoding="async";im.src=src;pkView.appendChild(im);imgs[src]=im;return im;
    }
    function shot(w){
      if(w.src===curSrc)return;
      var nx=img(w.src);
      for(var k in imgs)imgs[k].classList.toggle("on",imgs[k]===nx);
      pkCap.textContent=w.client_he+" · "+w.title_he;curSrc=w.src;
    }
    function loop(){
      var k=still.matches?1:.16;
      x+=(tx-x)*k;y+=(ty-y)*k;
      peek.style.transform="translate3d("+x.toFixed(1)+"px,"+y.toFixed(1)+"px,0)";
      raf=(on||Math.abs(tx-x)>.4||Math.abs(ty-y)>.4)?requestAnimationFrame(loop):0;
    }
    // משמאל לשם, כדי לא להסתיר אותו; אם אין מקום משמאל, עובר לצד הימני של הסמן
    function target(mx,my,nameEl){
      var W=peek.offsetWidth,H=peek.offsetHeight,g=48;
      var nl=nameEl?nameEl.getBoundingClientRect().left:mx;
      var px=Math.min(mx,nl)-W-g;if(px<16)px=mx+g;
      tx=Math.max(16,Math.min(innerWidth-W-16,px));
      ty=Math.max(16,Math.min(innerHeight-H-56,my-H/2));
      if(jumpNext){x=tx;y=ty;jumpNext=false;}
      if(!raf)raf=requestAnimationFrame(loop);
    }
    // רשימה של כמה עבודות: מדפדפים ביניהן כל שנייה, כמו עדשה שעוברת על התיק של המחלקה
    function show(list,who){
      if(owner===who&&on)return;
      owner=who;clearInterval(cyc);
      var i=0;shot(list[0]);if(list[1])img(list[1].src);
      if(list.length>1&&!still.matches)cyc=setInterval(function(){i=(i+1)%list.length;shot(list[i]);img(list[(i+1)%list.length].src);},1100);
      if(!on){on=true;peek.classList.add("on");}
    }
    function hide(){on=false;owner=null;clearInterval(cyc);peek.classList.remove("on");jumpNext=true;}
    return {show:show,target:target,hide:hide,isOn:function(){return on;}};
  })();
  // מאזין אחד לכל רשימה: ריחוף, פוקוס במקלדת, יציאה וגלילה
  function peekList(listEl,sel,nameSel,getList,setCur){
    listEl.addEventListener("mousemove",function(e){
      if(!fine.matches)return;
      var it=e.target.closest(sel);if(!it){Peek.hide();setCur(null);return;}
      setCur(it);Peek.show(getList(it),it);Peek.target(e.clientX,e.clientY,it.querySelector(nameSel));
    });
    listEl.addEventListener("mouseleave",function(){if(fine.matches){Peek.hide();setCur(null);}});
    listEl.addEventListener("focusin",function(e){
      var it=e.target.closest(sel);if(!it||!fine.matches)return;
      var nm=it.querySelector(nameSel),r=nm.getBoundingClientRect();
      setCur(it);Peek.show(getList(it),it);Peek.target(r.left,r.top+r.height/2,nm);
    });
    listEl.addEventListener("focusout",function(e){if(!listEl.contains(e.relatedTarget)){Peek.hide();setCur(null);}});
    addEventListener("scroll",function(){if(Peek.isOn()&&!listEl.matches(":hover")&&!listEl.contains(document.activeElement)){Peek.hide();setCur(null);}},{passive:true});
  }

  /* ================= עבודות: ארבעה פאנלים ענקיים ================= */
  var FEAT=[
    {w:2,img:"img/f-ministry.jpg",title:"דוח שנתי 2019"},
    {w:22,img:"img/f-peleg.jpg",title:"דוח שנתי ואתר",deps:["branding","web"]},
    {w:55,img:"img/f-aviv.jpg",title:"כרטיסים דיגיטליים, פליירים ודף סיכום שנה",deps:["digital","branding"]},
    {w:8,img:"img/f-college.jpg",title:"אתר"}
  ].filter(function(f){return WORKS[f.w];});
  var featEl=document.getElementById("feat");
  featEl.innerHTML=FEAT.map(function(f,i){
    var w=WORKS[f.w],deps=f.deps||w.departments;
    return '<article class="fp" data-c="'+w.client_he+'" aria-labelledby="fp-'+i+'">'+
      '<figure class="fp-media"><img src="'+f.img+'" alt="'+(w.alt_he||f.title+", "+w.client_he)+'" loading="'+(i?"lazy":"eager")+'" decoding="async"></figure>'+
      '<div class="fp-txt"><div class="fp-main">'+
        '<p class="fp-k"><span class="n">0'+(i+1)+' / 0'+FEAT.length+'</span><i aria-hidden="true"></i><span>'+deps.map(function(d){return DEPTS[d];}).join(" + ")+'</span>'+
          (w.field_he?'<i aria-hidden="true"></i><span>'+w.field_he+'</span>':'')+'</p>'+
        '<a class="fp-c" id="fp-'+i+'" href="#work">'+w.client_he+'</a></div>'+
      '<div class="fp-side"><p class="fp-t">'+f.title+(w.year&&f.title.indexOf(w.year)<0?' · '+w.year:'')+'</p><span class="fp-go" aria-hidden="true">לפרויקט'+ARR+'</span></div></div>'+
    '</article>';
  }).join("");
  var fps=[].slice.call(featEl.children);
  // ניגודיות: הכיתוב כהה על תחתית שנמסה לצבע הרקע, כמו בהירו. הסקריפט לא נוגע בו, הוא רק נכנס
  if(hasGsap){
    gsap.matchMedia().add("(min-width: 768px) and (prefers-reduced-motion: no-preference)",function(){
      featEl.classList.add("is-stack");
      fps.forEach(function(fp,i){
        var media=fp.querySelector(".fp-media"),txt=fp.querySelector(".fp-txt");
        // נפתח מהמרכז (g56) תוך כדי שהוא עולה
        gsap.fromTo(media,{clipPath:"inset(22% 26% 22% 26% round 26px)"},{clipPath:"inset(0% 0% 0% 0% round 0px)",ease:"none",
          scrollTrigger:{trigger:fp,start:"top bottom",end:"top top",scrub:.5}});
        gsap.fromTo(media.querySelector("img"),{scale:1.18},{scale:1,ease:"none",scrollTrigger:{trigger:fp,start:"top bottom",end:"top top",scrub:.5}});
        gsap.fromTo(txt,{opacity:0,y:40},{opacity:1,y:0,ease:"none",scrollTrigger:{trigger:fp,start:"top 35%",end:"top 5%",scrub:.5}});
        // הקודם נדחק מעט אחורה (b37), בלי להחשיך: שום מעבר לשחור
        if(i>0)gsap.to(fps[i-1],{scale:.955,ease:"none",scrollTrigger:{trigger:fp,start:"top bottom",end:"top top",scrub:.5}});
      });
      return function(){featEl.classList.remove("is-stack");};
    });
  }

  /* ================= ועוד עבודות: גריד מסונן (MV:b34) ================= */
  var featClients={};FEAT.forEach(function(f){featClients[WORKS[f.w].client_he]=1;});
  var gd=document.getElementById("gd");
  var picked=[],seen={};
  good.forEach(function(w){if(w.quality!=="poor"&&!featClients[w.client_he]&&!seen[w.client_he]){seen[w.client_he]=1;picked.push(w);}});
  picked=picked.slice(0,12);
  gd.innerHTML=picked.map(function(w){
    return '<a class="gc" href="#work" data-d="'+w.departments.join(" ")+'" data-f="'+(w.field_he||"")+'" data-c="'+w.client_he+'">'+
      '<span class="gc-img"><img src="'+w.src+'" alt="'+(w.alt_he||w.title_he+", "+w.client_he)+'" loading="lazy" decoding="async"></span>'+
      '<span class="gc-txt"><b>'+w.client_he+'</b>'+(w.year?'<span class="y">'+w.year+'</span>':'<span></span>')+
      '<span class="t">'+w.title_he+'</span><span class="deps">'+depsTag(w)+'</span></span></a>';
  }).join("");
  var items=[].slice.call(gd.children),revealAll=function(){};
  var filter=workFilter({grid:gd,items:items,deptBar:document.getElementById("f-dept"),fieldBar:document.getElementById("f-field"),
    countEl:document.getElementById("f-count"),status:document.getElementById("f-status"),chipClass:"fb",fieldChipClass:"fb sm",
    onApply:function(){revealAll();}});
  // כניסה ב-gsap ולא ב-CSS, כדי לא להתנגש ב-Flip של הסינון
  if(window.gsap&&doc.classList.contains("rv-js")&&"IntersectionObserver" in window){
    var left=items.slice();
    gsap.set(items,{opacity:0,y:18});
    var gio=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;
      var el=e.target;gio.unobserve(el);left=left.filter(function(x){return x!==el;});
      gsap.to(el,{opacity:1,y:0,duration:.55,delay:(items.indexOf(el)%3)*.08,ease:"power2.out",clearProps:"opacity,transform"});
    });},{threshold:.12});
    items.forEach(function(it){gio.observe(it);});
    revealAll=function(){if(!left.length)return;gsap.set(left,{clearProps:"opacity,transform"});left.forEach(function(x){gio.unobserve(x);});left=[];};
  }
  function hit(el){el.classList.add("hit");setTimeout(function(){el.classList.remove("hit");},1600);}

  /* ================= שלוש מחלקות: אינדקס ענק ================= */
  (function(){
    if(!C)return;
    var dpx=document.getElementById("dpx"),KEYS=["branding","web","digital"];
    var lists={};KEYS.forEach(function(k){lists[k]=good.filter(function(w){return w.quality!=="poor"&&w.departments.indexOf(k)>-1;}).slice(0,8);});
    dpx.innerHTML=KEYS.map(function(k,i){var d=C.depts[k];
      return '<li><a class="dpr" href="?d='+k+'#more" data-d="'+k+'">'+
        '<span class="nm-w"><span class="no" aria-hidden="true">0'+(i+1)+'</span><span class="nm">'+d.name+'</span></span>'+
        '<span class="mt"><span class="ln">'+d.line+'</span><span class="sv">'+d.services.join(" · ")+'</span>'+
          '<span class="go">לעבודות ה'+d.short+ARR+'</span></span>'+
        '<span class="th" aria-hidden="true">'+lists[k].slice(0,3).map(function(w){return '<img src="'+w.src+'" alt="" loading="lazy" decoding="async">';}).join("")+'</span>'+
      '</a></li>';}).join("");
    function setCur(row){
      dpx.querySelectorAll(".dpr.cur").forEach(function(r){if(r!==row)r.classList.remove("cur");});
      if(row)row.classList.add("cur");dpx.classList.toggle("is-on",!!row);
    }
    peekList(dpx,".dpr",".nm",function(row){return lists[row.dataset.d];},setCur);
    // לחיצה: מסננים את הגריד למחלקה וגוללים אליו, בלי לטעון מחדש
    dpx.addEventListener("click",function(e){
      var a=e.target.closest(".dpr");if(!a)return;
      e.preventDefault();Peek.hide();setCur(null);
      filter.set(a.dataset.d,false);revealAll();go(document.getElementById("more"));
    });
  })();

  /* ================= מילים ענקיות שזזות עם הגלילה (MV:g123), עבודות בתוך האותיות (MV:g58) ================= */
  (function(){
    var IMG=function(n){var w=WORKS.filter(function(x){return x.src.indexOf(n)>-1;})[0];return w?w.src:"";};
    var ROWS=[
      [["מיתוג"],["אתרים","wedding-safed-site"],["שיווק"],["קמפיינים","pin-mbc-instagram"],["מצפת","ofra-midrasha-site"],["לכל הגליל"]],
      [["רשויות","peleg-report-spread"],["תיירות"],["קהילה","pin-aviv-cards-imac"],["מכללות"],["פסטיבלים","pin-vacay-flyer"],["עסקים"],["מסעדות","racha-menu"]]
    ];
    var rows=[].slice.call(document.querySelectorAll(".gw-row"));
    rows.forEach(function(row,k){
      var set=ROWS[k].map(function(p){
        var src=p[1]?IMG(p[1]):"";
        return (src?'<b class="fill" style="--img:url('+src+')">':'<b>')+p[0]+'</b><span class="sep"></span>';
      }).join("");
      var tr=document.createElement("div");tr.className="gw-track";tr.innerHTML=set;row.appendChild(tr);
      row._set=set;row._tr=tr;
    });
    function fill(){
      var W=doc.clientWidth,Dm=W*(W<768?.4:.3);
      rows.forEach(function(row){
        var tr=row._tr;tr.innerHTML=row._set;
        var one=tr.scrollWidth||1,n=Math.max(1,Math.ceil((W+2*Dm+40)/one));
        tr.innerHTML=new Array(n+1).join(row._set);
        tr.style.marginInlineStart=(-Dm)+"px";
        row._D=Dm;
      });
    }
    fill();
    if(document.fonts)document.fonts.ready.then(function(){fill();if(hasGsap)ScrollTrigger.refresh();});
    if(!hasGsap)return;
    var sec=document.querySelector(".giant");
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      rows.forEach(function(row){
        var dir=+row.dataset.dir||1;
        gsap.fromTo(row._tr,{x:function(){return -row._D*dir;}},{x:function(){return row._D*dir;},ease:"none",
          scrollTrigger:{trigger:sec,start:"top bottom",end:"bottom top",scrub:.6,invalidateOnRefresh:true}});
      });
    });
    var rz=0,lw=doc.clientWidth;
    addEventListener("resize",function(){clearTimeout(rz);rz=setTimeout(function(){if(doc.clientWidth!==lw){lw=doc.clientWidth;fill();ScrollTrigger.refresh();}},200);});
  })();

  /* ================= כל הלקוחות: העדשה נוסעת על קיר השמות (MV:g101), וסביבה זרקור שמחדד אותם (MV:g138) =================
     שכבת השמות הבהירה היא הקישורים עצמם. מעליה עותק כהה שנחתך לעיגול סביב העדשה, ובתוך העדשה עבודה של הלקוח הקרוב.
     העדשה עוצרת על הגופים הציבוריים, ומסיימת במסעדה. בלי תנועה: רשימה רגילה, בלי עדשה */
  function xrayWall(order,depsTxt){
    var root=document.getElementById("xw"),pin=root.querySelector(".xw-pin"),fig=document.getElementById("xw-fig");
    var ct=document.getElementById("ctab"),ink=document.getElementById("xw-ink"),lens=document.getElementById("xw-lens");
    var view=document.getElementById("xw-view"),tag=document.getElementById("xw-tag");
    ink.innerHTML='<ul class="cr">'+ct.innerHTML.replace(/<a /g,'<span ').replace(/<\/a>/g,'</span>').replace(/ href="#work"/g,'')+'</ul>';
    var inkLis=[].slice.call(ink.querySelectorAll("li")),lis=[].slice.call(ct.children);
    // תמונה אחת לכל לקוח, נטענת רק כשהעדשה מגיעה אליו
    var pics=order.map(function(c){var w=c.works.filter(function(q){return q.quality!=="poor";})[0]||c.works[0];return w.src;});
    var imgs=[];
    function pic(i){
      if(!imgs[i]){var im=document.createElement("img");im.alt="";im.decoding="async";im.src=pics[i];view.appendChild(im);imgs[i]=im;}
      return imgs[i];
    }
    // תחנות בזיגזג על כל הקיר, כמו במאגר: מהפינה העליונה, דרך האמצע, עד התחתית. כל תחנה נצמדת לשם הקרוב אליה
    var STOPS=[[86,10],[34,32],[74,52],[16,72],[58,92],[46,46]];
    var cur=-1,shown=null;
    function setCur(i){
      if(i===cur)return;
      if(cur>-1)inkLis[cur].classList.remove("on");
      cur=i;inkLis[i].classList.add("on");
      var im=pic(i);if(shown&&shown!==im)shown.classList.remove("on");im.classList.add("on");shown=im;
      var c=order[i];tag.innerHTML='<b>'+c.name+'</b><span>'+depsTxt(c)+(c.pub?' · גוף ציבורי':'')+'</span>';
    }
    if(!hasGsap)return;
    // בטלפון הרשימה גבוהה מהמסך, ולכן בלי נעילה: העדשה נוסעת תוך כדי גלילה רגילה
    gsap.matchMedia().add({ok:"(prefers-reduced-motion: no-preference)",wide:"(min-width:768px)"},function(cx){
      if(!cx.conditions.ok)return;
      root.classList.add("mv-on");
      var o={x:0,y:0},pts=[],cs=[];
      // offsetParent של הקישור הוא המסגרת עצמה, ולכן המיקום יחסי אליה
      function center(li){var a=li.firstChild;return {x:a.offsetLeft+a.offsetWidth/2,y:a.offsetTop+a.offsetHeight/2};}
      function paint(){
        fig.style.setProperty("--lx",o.x+"px");fig.style.setProperty("--ly",o.y+"px");
        gsap.set(lens,{x:o.x,y:o.y,xPercent:-50,yPercent:-50,overwrite:false});
        // הלקוח הקרוב ביותר למרכז העדשה
        var b=0,bd=1e9;for(var i=0;i<cs.length;i++){var dx=cs[i].x-o.x,dy=cs[i].y-o.y,d=dx*dx+dy*dy;if(d<bd){bd=d;b=i;}}
        setCur(b);
      }
      function measure(){
        cs=lis.map(center);
        var W=fig.clientWidth,H=fig.clientHeight,used=[];
        pts=STOPS.map(function(p){var x=p[0]/100*W,y=p[1]/100*H,b=0,bd=1e12;
          cs.forEach(function(c,i){if(used.indexOf(i)>-1)return;var d=(c.x-x)*(c.x-x)+(c.y-y)*(c.y-y);if(d<bd){bd=d;b=i;}});used.push(b);return cs[b];});
        tl.clear();o.x=pts[0].x;o.y=pts[0].y;
        // x ו-y בעקומות שונות, ולכן המסלול מתעקל ולא נוסע בקו ישר. בכל תחנה העדשה "מתמקדת": מתנפחת קצת וחוזרת
        pts.slice(1).forEach(function(p,k){
          var at=k*1.4;
          tl.to(o,{x:p.x,duration:1,ease:"power3.inOut"},at).to(o,{y:p.y,duration:1,ease:k%2?"back.inOut(1.4)":"sine.inOut"},at)
            .to(lens,{scale:.86,duration:.5,ease:"sine.in"},at).to(lens,{scale:1.1,duration:.3,ease:"sine.out"},at+.5).to(lens,{scale:1,duration:.6,ease:"sine.inOut"},at+.8);
        });
        paint();
      }
      var tl=gsap.timeline({onUpdate:paint,scrollTrigger:cx.conditions.wide?{trigger:pin,start:"center center",end:"+=220%",pin:true,scrub:.7,anticipatePin:1,
        onRefresh:function(s){measure();tl.progress(s.progress);}}:{trigger:fig,start:"top 70%",end:"bottom 45%",scrub:.7,
        onRefresh:function(s){measure();tl.progress(s.progress);}}});
      measure();
      return function(){root.classList.remove("mv-on");fig.style.removeProperty("--lx");fig.style.removeProperty("--ly");gsap.set(lens,{clearProps:"transform"});};
    });
  }

  /* ================= לקוחות: מכונת מזל שמתגלגלת עם הגלילה, ורשימת קרדיטים ================= */
  (function(){
    var byClient={},order=[];
    good.forEach(function(w){
      var c=byClient[w.client_he];
      if(!c){c=byClient[w.client_he]={name:w.client_he,works:[],deps:{},pub:false,field:w.field_he};order.push(c);}
      c.works.push(w);if(w.public_body)c.pub=true;
      (w.departments||[]).forEach(function(d){c.deps[d]=1;});
    });
    order.sort(function(a,b){return (b.pub?1:0)-(a.pub?1:0)||b.works.length-a.works.length;});
    var nEl=document.getElementById("cl-n");nEl.textContent=order.length;
    function depsTxt(c){var d=["branding","web","digital"].filter(function(k){return c.deps[k];});return d.length===3?"כל המחלקות":d.map(function(k){return DEPTS[k];}).join(" + ");}

    // הקרדיטים: כל הלקוחות בשורה זורמת, הציבוריים ראשונים ובצבע מלא. ריחוף מראה עבודה בעדשה
    var ct=document.getElementById("ctab");
    ct.innerHTML=order.map(function(c,i){return '<li><a class="cc'+(c.pub?' pub':'')+'" href="#work" data-k="'+i+'"><b>'+c.name+'</b></a></li>';}).join("");
    // לחיצה על לקוח: לעבודה שלו בגריד, אחרת לפאנל שלו, אחרת לראש העבודות
    ct.addEventListener("click",function(e){
      var a=e.target.closest(".cc");if(!a)return;
      e.preventDefault();Peek.hide();
      var name=order[+a.dataset.k].name;
      var card=items.filter(function(g){return g.dataset.c===name;})[0];
      var fp=fps.filter(function(f){return f.dataset.c===name;})[0];
      if(card){if(card.classList.contains("is-out"))filter.set("all",false);revealAll();go(card,"center");card.focus({preventScroll:true});hit(card);return;}
      if(fp){go(fp);fp.querySelector(".fp-c").focus({preventScroll:true});return;}
      var h=document.getElementById("work-h");go(document.getElementById("work"));h.setAttribute("tabindex","-1");h.focus({preventScroll:true});
    });

    // מכונת המזל: עשרה לקוחות. הגלילה בוחרת שם, הגלגל "נוקש" אליו, והעדשה מחליפה עבודה
    var SL=order.filter(function(c){return c.works.some(function(w){return w.quality!=="poor";});}).slice(0,10);
    var slot=document.getElementById("slot"),view=document.getElementById("sl-view"),meta=document.getElementById("sl-meta");
    slot.innerHTML=SL.map(function(c){return '<li><span>'+c.name+'</span></li>';}).join("");
    document.getElementById("cl-h").insertAdjacentHTML("beforeend",'<span class="sr"> '+SL.slice(0,3).map(function(c){return c.name;}).join(", ")+' ועוד. הרשימה המלאה מתחת.</span>');
    var lis=[].slice.call(slot.children);
    var imgs=SL.map(function(c){
      var w=c.works.filter(function(q){return q.quality!=="poor";})[0]||c.works[0];
      var im=document.createElement("img");im.alt="";im.decoding="async";im.src=w.src;view.appendChild(im);return im;
    });
    var at=-1;
    function place(i,anim){
      var y=(1-i)*lis[0].offsetHeight;
      if(!hasGsap){slot.style.transform="translateY("+y+"px)";return;}
      if(anim&&!still.matches)gsap.to(slot,{y:y,duration:.6,ease:"back.out(1.7)",overwrite:true});
      else gsap.set(slot,{y:y});
    }
    function setIdx(i,anim){
      i=Math.max(0,Math.min(SL.length-1,i));if(i===at)return;at=i;
      lis.forEach(function(li,k){li.classList.toggle("on",k===i);});
      imgs.forEach(function(im,k){im.classList.toggle("on",k===i);});
      var c=SL[i];meta.innerHTML='<i></i>'+depsTxt(c)+(c.field?' · '+c.field:'')+(c.pub?' · גוף ציבורי':'');
      place(i,anim);
    }
    // שם ארוך מתכווץ כדי להיכנס לחלון בשורה אחת
    function fit(){
      var W=slot.parentNode.clientWidth;
      lis.forEach(function(li){var s=li.firstChild;s.style.fontSize="";var k=W/(s.offsetWidth+4);if(k<1)s.style.fontSize=(k*100).toFixed(1)+"%";});
      if(at>-1)place(at,false);
    }
    setIdx(0,false);fit();
    if(window.ResizeObserver)new ResizeObserver(function(){fit();}).observe(slot.parentNode);
    if(document.fonts)document.fonts.ready.then(fit);
    addEventListener("load",fit);
    if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener("loadingdone",fit);
    var fz=0;addEventListener("resize",function(){clearTimeout(fz);fz=setTimeout(fit,150);});
    // בלי תנועה: הגלגל מתקדם לבד כל שתי שניות וחצי, ועוצר בריחוף
    var auto=0,hov=false;
    var secEl=document.getElementById("clients");
    secEl.addEventListener("mouseenter",function(){hov=true;});secEl.addEventListener("mouseleave",function(){hov=false;});
    if(!hasGsap||still.matches){auto=setInterval(function(){if(!hov&&!document.hidden)setIdx((at+1)%SL.length,false);},2500);xrayWall(order,depsTxt);return;}
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      var pin=document.querySelector(".sl-pin");
      ScrollTrigger.create({trigger:pin,start:"center center",end:"+="+(SL.length*14)+"%",pin:true,anticipatePin:1,
        onUpdate:function(s){setIdx(Math.round(s.progress*(SL.length-1)),true);}});
      // המספר נספר כשהסקשן נכנס
      nEl.style.minWidth=nEl.offsetWidth+"px";var o={v:0};nEl.textContent="0";
      gsap.to(o,{v:order.length,duration:1.6,ease:"power3.out",onUpdate:function(){nEl.textContent=Math.round(o.v);},
        scrollTrigger:{trigger:pin,start:"top 80%",once:true}});
      return function(){nEl.textContent=order.length;nEl.style.minWidth="";};
    });
    // אחרי הנעילה של מכונת המזל, כדי שהנעילה של הקיר תחושב מתחתיה
    xrayWall(order,depsTxt);
  })();

  /* ================= מכאן: התוכן המשותף (קיר, צוות, טופס) ================= */
  if(!C){rv(document);return;}
  var lb=lightbox();

  /* מה מספרים עלינו: הסקשן ננעל, וצילומי המסך עוברים לרוחב עם הגלילה. כל צילום מתיישר כשהוא מגיע למרכז */
  function byId(id){return C.quotes.filter(function(q){return q.id===id;})[0]||C.shots.filter(function(x){return x.id===id;})[0];}
  function whoOrg(q){var o=(q.org||"").split(" · ")[0].split(", ").pop();return o?q.who+", "+o:q.who;}
  (function(){
    var qs=["rev-06","rev-01","rev-07","rev-03","rev-02","rev-13","rev-16","rev-09","rev-17","rev-08"].map(byId).filter(Boolean);
    var list=qs.map(wallItem),N=qs.length;
    function pad(n){return n<10?"0"+n:""+n;}
    document.getElementById("sd-n").textContent=C.wallTotal;
    document.getElementById("sd-since").textContent=C.wallSince;
    document.getElementById("sd-t").textContent=pad(N);
    document.querySelector(".sd-more .btn").firstChild.textContent="לכל "+C.wallTotal+" ההודעות";
    var tr=document.getElementById("sd-track"),vp=document.getElementById("sd-vp"),sec=document.getElementById("wall");
    tr.innerHTML=qs.map(function(q,i){
      var s=C.shot(q.id),ar=Math.max(.66,Math.min(1.5,s.w/s.h));
      return '<li class="sd-c" style="--ar:'+ar.toFixed(3)+'"><button class="sd-b" type="button" data-k="'+i+'">'+
        '<span class="sd-shot"><img src="'+s.thumb+'" alt="צילום מסך של הודעה: '+q.who+'" width="'+s.w+'" height="'+s.h+'" loading="lazy" decoding="async"></span>'+
        '<span class="sd-cap">'+(q.short?'<span class="sd-q">״'+q.short+'״</span>':'')+'<span class="sd-w">'+whoOrg(q)+'</span></span></button></li>';
    }).join("");
    var cards=[].slice.call(tr.children),bar=document.getElementById("sd-bar"),idx=document.getElementById("sd-i");
    function prog(p){p=Math.max(0,Math.min(1,p));bar.style.transform="scaleX("+p.toFixed(4)+")";idx.textContent=pad(1+Math.round(p*(N-1)));}
    sec.addEventListener("click",function(e){var b=e.target.closest(".sd-b");if(b)lb.open(list,+b.dataset.k,b);});
    // טלפון והפחתת תנועה: קרוסלה שנגללת לצד, והפס מראה איפה אנחנו
    vp.addEventListener("scroll",function(){var m=vp.scrollWidth-vp.clientWidth;if(m>0)prog(Math.abs(vp.scrollLeft)/m);},{passive:true});
    prog(0);
    if(!hasGsap)return;
    gsap.matchMedia().add("(min-width: 768px) and (prefers-reduced-motion: no-preference)",function(){
      sec.classList.add("is-pin");
      var pin=sec.querySelector(".sd-pin");
      function dist(){return Math.max(0,tr.scrollWidth-vp.clientWidth);}
      // כל צילום נוטה ויורד מעט כשהוא רחוק מהמרכז, ומתיישר כשהוא מגיע אליו
      var sets=cards.map(function(c){return {r:gsap.quickSetter(c,"rotate","deg"),y:gsap.quickSetter(c,"y","px"),s:gsap.quickSetter(c,"scale")};});
      function tilt(){
        var mid=innerWidth/2;
        cards.forEach(function(c,i){
          var r=c.getBoundingClientRect(),d=Math.max(-1.4,Math.min(1.4,(r.left+r.width/2-mid)/mid));
          sets[i].r(d*-5);sets[i].y(Math.abs(d)*26);sets[i].s(1-Math.min(1,Math.abs(d))*.07);
        });
      }
      gsap.to(tr,{x:function(){return dist();},ease:"none",onUpdate:tilt,
        scrollTrigger:{trigger:pin,start:"top top",end:function(){return "+="+Math.round(dist()*.6);},pin:true,scrub:.6,anticipatePin:1,invalidateOnRefresh:true,
          onUpdate:function(s){prog(s.progress);},onRefresh:tilt}});
      tilt();
      return function(){sec.classList.remove("is-pin");gsap.set(cards,{clearProps:"transform,rotate,scale"});prog(0);};
    });
  })();

  /* הצוות: שמונה מסגרות על שמונה העמודות. עד שיגיעו תמונות, האות הראשונה בענק */
  (function(){
    var HE=["","אחד","שניים","שלושה","ארבעה","חמישה","שישה","שבעה","שמונה","תשעה","עשרה"];
    document.getElementById("tm-n").textContent=HE[C.team.length]||C.team.length;
    var cells=C.team.map(function(p,i){
      return '<li class="tm-c" data-rv style="--i:'+i+'"><span class="tm-ini" aria-hidden="true">'+p.name.charAt(0)+'</span>'+
        '<span class="tm-nm"><b>'+p.name+'</b><small>'+p.role+'</small></span></li>';
    });
    cells.push('<li class="tm-c tm-open" data-rv style="--i:'+C.team.length+'"><a href="#jobs"><span class="tm-ini" aria-hidden="true">+</span>'+
      '<span class="tm-nm"><b>המקום הבא</b><small>למשרות'+ARR+'</small></span></a></li>');
    document.getElementById("tm-strip").innerHTML=cells.join("");
    var tq=C.teamQuote;
    document.getElementById("ab-q").textContent="״"+tq.text+"״";
    var cap=document.getElementById("ab-c");
    cap.innerHTML='<span><b>'+tq.who+'</b>, '+tq.org+', על הצוות</span><button class="lnk ab-open" type="button">לצילום המקורי'+ARR+'</button>';
    var ob=cap.querySelector("button");ob.addEventListener("click",function(){lb.open([wallItem(tq)],0,ob);});
  })();

  /* קריירה: המתאר של השורה השנייה מתמלא עם הגלילה, והמשרות כאינדקס שנפתח במקום */
  (function(){
    var n=C.jobs.length;
    document.getElementById("jb-n").textContent=n===1?"משרה אחת פתוחה":n+" משרות פתוחות";
    var waBase=C.contact.wa.split("?")[0],el=document.getElementById("jb-list");
    function dep(j){return /סושיאל|שיווק|קמפיין/.test(j.title)?"digital":"branding";}
    el.innerHTML=C.jobs.map(function(j,i){
      var mail="mailto:"+C.contact.email+"?subject="+encodeURIComponent("מועמדות: "+j.title);
      var wa=waBase+"?text="+encodeURIComponent("היי ויזואל, ראיתי באתר את המשרה "+j.title+" ורוצה לשמוע עוד");
      return '<li class="jr" data-rv data-d="'+dep(j)+'"><h3 class="jr-h"><button class="jr-b" type="button" id="jr-b-'+i+'" aria-expanded="false" aria-controls="jr-p-'+i+'">'+
        '<span class="jr-no" aria-hidden="true">0'+(i+1)+'</span><span class="jr-t">'+j.title+'</span><span class="jr-wh">'+j.where+'</span><span class="jr-ic" aria-hidden="true"></span></button></h3>'+
        '<div class="jr-p" id="jr-p-'+i+'" role="region" aria-labelledby="jr-b-'+i+'"><div class="jr-in"><div class="jr-box">'+
          '<p class="jr-w">'+j.what+'</p>'+
          '<div class="jr-cta"><a class="btn btn-lime" href="'+mail+'">להגשת מועמדות'+ARR+'</a><a class="lnk" href="'+wa+'" target="_blank" rel="noopener">'+IC.wa+'שאלה בוואטסאפ</a></div>'+
        '</div></div></div></li>';
    }).join("");
    var rows=[].slice.call(el.children);
    function setOpen(li,open){
      li.classList.toggle("open",open);li.querySelector(".jr-b").setAttribute("aria-expanded",String(open));li.querySelector(".jr-p").inert=!open;
    }
    rows.forEach(function(li,i){setOpen(li,i===0);li.querySelector(".jr-b").addEventListener("click",function(){setOpen(li,!li.classList.contains("open"));});});
    // ריחוף: העדשה מדפדפת בעבודות מהתחום של המשרה
    var lists={};["branding","digital"].forEach(function(k){lists[k]=good.filter(function(w){return w.quality!=="poor"&&w.departments.indexOf(k)>-1;}).slice(0,6);});
    peekList(el,".jr-b",".jr-t",function(b){return lists[b.closest(".jr").dataset.d];},function(b){
      rows.forEach(function(r){r.classList.toggle("cur",!!b&&r.contains(b));});el.classList.toggle("is-on",!!b);
    });
    var l2=document.querySelector(".jb-l2");
    if(hasGsap&&!still.matches){
      gsap.fromTo(l2,{"--p":"0%"},{"--p":"100%",ease:"none",scrollTrigger:{trigger:l2,start:"top 88%",end:"bottom 52%",scrub:.4}});
    }else l2.style.setProperty("--p","100%");
  })();

  /* מילים בליים בכותרות: האותיות קופצות פנימה בזו אחר זו, ומרקר ליים נמרח מאחוריהן */
  (function(){
    var ws=[].slice.call(document.querySelectorAll(".lw"));
    if(!hasGsap||still.matches||!ws.length)return;
    ws.forEach(function(w){
      var txt=w.textContent,vis=document.createElement("span"),sr=document.createElement("span");
      sr.className="sr";sr.textContent=txt;vis.setAttribute("aria-hidden","true");
      txt.split(/([\s ]+)/).forEach(function(part){
        if(!part)return;
        if(/^[\s ]+$/.test(part)){vis.appendChild(document.createTextNode(part));return;}
        var wd=document.createElement("span");wd.className="lw-w";
        Array.from(part).forEach(function(ch){var c=document.createElement("span");c.className="lw-c";c.textContent=ch;wd.appendChild(c);});
        vis.appendChild(wd);
      });
      w.textContent="";w.appendChild(sr);w.appendChild(vis);
    });
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      ws.forEach(function(w){
        var cs=w.querySelectorAll(".lw-c");
        gsap.set(w,{"--fill":0});
        var tl=gsap.timeline({paused:true})
          .from(cs,{yPercent:70,rotate:-10,opacity:0,duration:.6,ease:"back.out(2.4)",stagger:.04})
          .to(w,{"--fill":1,duration:.75,ease:"expo.inOut"},"-=.4");
        if(w.closest(".hero"))gsap.delayedCall(1.2,function(){tl.play();});
        else ScrollTrigger.create({trigger:w,start:"top 84%",once:true,onEnter:function(){tl.play();}});
      });
      return function(){gsap.set(ws,{clearProps:"--fill"});};
    });
  })();

  /* סוגר: דרכי קשר כאינדקס, וטופס */
  (function(){
    var c=C.contact;
    function row(k,v){return '<div class="cl-r" data-rv><dt>'+k+'</dt><dd>'+v+'</dd></div>';}
    document.getElementById("cl-dl").innerHTML=
      row("טלפון",'<a class="cl-big" href="'+c.telHref+'"><span dir="ltr">'+c.tel+'</span></a>')+
      row("וואטסאפ",'<a class="btn btn-lime" href="'+c.wa+'" target="_blank" rel="noopener">'+IC.wa+'לשיחה בוואטסאפ</a>')+
      row("אימייל",'<a href="mailto:'+c.email+'"><span dir="ltr">'+c.email+'</span></a>')+
      row("כתובת",'<a href="'+c.waze+'" target="_blank" rel="noopener">'+c.address+'<small>ניווט בוויז</small></a>');
    contactForm(document.getElementById("cf-d"),{btn:"btn btn-lime"});
  })();

  /* פוטר: עמודות על הקווים, ולוגו ענק שהאישון שלו מסתכל על העכבר */
  (function(){
    var c=C.contact,d=C.depts;
    function col(cls,h,items){return '<div class="ftd-col '+cls+'"><h3>'+h+'</h3><ul>'+items.map(function(x){return '<li>'+x+'</li>';}).join("")+'</ul></div>';}
    document.getElementById("ft-cols").innerHTML=
      col("c-site","האתר",['<a href="#work">עבודות</a>','<a href="#depts">מחלקות</a>','<a href="#wall">מה מספרים עלינו</a>','<a href="#about">הצוות</a>','<a href="#jobs">קריירה</a>'])+
      col("c-dept","מחלקות",["branding","web","digital"].map(function(k){return '<a href="?d='+k+'#work">'+d[k].name+'</a>';}))+
      col("c-ct","צרו קשר",['<a href="'+c.telHref+'"><span class="ft-tel" dir="ltr">'+c.tel+'</span></a>','<a href="mailto:'+c.email+'" dir="ltr">'+c.email+'</a>',
        '<a href="'+c.waze+'" target="_blank" rel="noopener">'+c.address+'</a>','<a href="'+c.wa+'" target="_blank" rel="noopener">וואטסאפ</a>'])+
      col("c-soc","עקבו",['<a href="'+c.facebook+'" target="_blank" rel="noopener">פייסבוק</a>','<a href="'+c.pinterest+'" target="_blank" rel="noopener">פינטרסט</a>'])+
      '<div class="ftd-col c-up"><a class="ftd-up" href="#top">לראש העמוד<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 15V5m-4 4 4-4 4 4"/></svg></a></div>';
    var mark=document.getElementById("ft-mark"),img=mark.querySelector("img");
    fetch(img.getAttribute("src")).then(function(r){return r.ok?r.text():null;}).then(function(t){
      if(!t)return;
      var box=document.createElement("div");box.innerHTML=t;
      var svg=box.querySelector("svg");if(!svg)return;
      svg.removeAttribute("role");svg.removeAttribute("aria-label");svg.setAttribute("aria-hidden","true");svg.setAttribute("focusable","false");
      img.replaceWith(svg);
      /* האישון: הנתיב הליים הראשון בתוך העדשה (משמאל ל-x 600 ב-viewBox) */
      var pupil=[].slice.call(svg.querySelectorAll('path[fill="#9AB709"]')).filter(function(p){var b=p.getBBox(),t=p.transform.baseVal.consolidate();return b.x+b.width+(t?t.matrix.e:0)<600;})[0];
      if(!pupil||still.matches||!fine.matches)return;
      /* החור בטבעת: תת-הנתיב של הטבעת שמכיל את האישון. האישון זז רק בתוכו, ולא נוגע בשוליים */
      var ring=svg.querySelector('path[fill="#444444"]'),hole=null;
      ring.getAttribute("d").split(/(?=M)/).slice(1).forEach(function(d){
        var t=document.createElementNS("http://www.w3.org/2000/svg","path");t.setAttribute("d",d);t.setAttribute("transform",ring.getAttribute("transform")||"");
        t.setAttribute("fill","none");svg.appendChild(t);
        var b=t.getBBox(),pb=pupil.getBBox(),pt=pupil.transform.baseVal.consolidate(),rt=ring.transform.baseVal.consolidate();
        var pcx=pb.x+pb.width/2+(pt?pt.matrix.e:0),pcy=pb.y+pb.height/2+(pt?pt.matrix.f:0),hx=b.x+(rt?rt.matrix.e:0),hy=b.y+(rt?rt.matrix.f:0);
        if(pcx>hx&&pcx<hx+b.width&&pcy>hy&&pcy<hy+b.height&&(!hole||b.width<hole.w))hole={cx:hx+b.width/2,cy:hy+b.height/2,r:Math.min(b.width,b.height)/2,w:b.width};
        t.remove();
      });
      if(!hole)return;
      var pb=pupil.getBBox(),pt=pupil.transform.baseVal.consolidate(),
        cx=pb.x+pb.width/2+(pt?pt.matrix.e:0),cy=pb.y+pb.height/2+(pt?pt.matrix.f:0),
        free=(hole.r-Math.max(pb.width,pb.height)/2)*.9,ox=cx-hole.cx,oy=cy-hole.cy,
        tx=0,ty=0,x=0,y=0,raf=0,on=false;
      if(free<=0)return;
      function tick(){x+=(tx-x)*.12;y+=(ty-y)*.12;pupil.setAttribute("transform",pupil.getAttribute("data-t")+" translate("+x.toFixed(2)+" "+y.toFixed(2)+")");
        raf=(Math.abs(tx-x)>.05||Math.abs(ty-y)>.05)?requestAnimationFrame(tick):0;}
      pupil.setAttribute("data-t",pupil.getAttribute("transform")||"");
      var io=new IntersectionObserver(function(es){on=es[0].isIntersecting;},{rootMargin:"20% 0px"});io.observe(svg);
      addEventListener("mousemove",function(e){
        if(!on)return;
        var r=svg.getBoundingClientRect(),k=r.width/2726,dx=e.clientX-(r.left+cx*k),dy=e.clientY-(r.top+cy*k),dist=Math.hypot(dx,dy)||1,ux=dx/dist,uy=dy/dist;
        /* כמה אפשר לזוז בכיוון הזה עד שפת החור, ולפי המרחק מהעכבר */
        var cd=ox*ux+oy*uy,tmax=-cd+Math.sqrt(Math.max(0,cd*cd-(ox*ox+oy*oy-free*free))),t=tmax*Math.min(1,dist/(r.width*.5));
        tx=ux*t;ty=uy*t;if(!raf)raf=requestAnimationFrame(tick);
      },{passive:true});
    }).catch(function(){});
  })();

  /* ================= שינוי גודל ================= */
  var rw=0,lastCols=nCols,lastW=doc.clientWidth;
  addEventListener("resize",function(){clearTimeout(rw);rw=setTimeout(function(){
    if(doc.clientWidth===lastW)return;lastW=doc.clientWidth;
    lines();
    if(colsFor(doc.clientWidth)!==lastCols){lastCols=colsFor(doc.clientWidth);build();}else measure();
    if(hasGsap)ScrollTrigger.refresh();
  },150);});
  rv(document);
})();
