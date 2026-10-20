/* סקיצה ז · עמוד הבית, סבב 19.10
   השולחן נקי: רק העבודות, בלי בורר ובלי הוראות. עבודות נבחרות בפאנלים במסך מלא שנערמים (ברוח Tyco).
   אזור כהה: שלוש מחלקות כשלושה פאנלים שנפתחים לרוחב, וציטוט שנדלק. קיר לקוחות עם העדשה, קיר ההודעות, ודרכי קשר.
   מה שמשותף לעמוד העבודות (הדר, תפריט, פוטר, גלילה רכה) ב-common.js */
(function(){
  "use strict";
  var G=window.G,doc=G.doc,still=G.still,fine=G.fine,hasGsap=G.hasGsap,C=G.C,lb=G.lb,W=G.W,thumb=G.thumb,lbItem=G.lbItem,ARR=G.ARR;
  var hasDrag=hasGsap&&!!window.Draggable;
  var LB=W.map(lbItem);

  /* מסך הטעינה מודיע כשהאתר נחשף, והשולחן מתחיל רק אז */
  function plDone(){if(window.__plDone)return;window.__plDone=true;dispatchEvent(new Event("pl-done"));}
  function afterPl(f){if(window.__plDone||!doc.classList.contains("pl-on")&&!document.getElementById("pl"))f();else addEventListener("pl-done",f,{once:true});}

  /* ================= מסך טעינה: הלוגו מצטייר, והעדשה שלו נפתחת אל השולחן ================= */
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
      // מהאישון נפתח חור שמגלה את האתר. העבודות מתחילות לנחות על השולחן באותו רגע
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

  /* ================= השולחן: אינסופי, נגרר ביד עם תנופה, נסחף לבד, והגלילה מזיזה אותו ================= */
  var tb=document.querySelector(".tb"),stage=document.getElementById("tb"),layer=document.getElementById("tb-layer");
  var tiles=[],cell=0,Wb=1,Hb=1,vw=0,vh=0;
  var ox=0,oy=0;            // ההזזה של היד (Draggable על proxy)
  var dx=0,dy=0;            // הגלילה
  var driftK=0,driftTw=null,idleT=0,visible=true;
  var intro=doc.classList.contains("tb-intro")?"wait":"done";

  function rng(s){return function(){s=s*16807%2147483647;return (s-1)/2147483646;};}
  var deck=(function(){var r=rng(11),a=W.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;})();

  function build(){
    vw=stage.clientWidth;vh=stage.clientHeight;
    var mob=vw<768;
    // ליאב, 19.10: עבודות גדולות יותר ומרווחים קטנים יותר, כדי שיהיו ברורות ומרשימות
    cell=mob?Math.round(Math.max(136,vw*.38)):Math.round(Math.min(340,Math.max(210,vw*.16)));
    var cols=Math.max(5,Math.round(Math.max(vw*1.6,vw+cell*3)/cell)),rows=Math.max(5,Math.round(Math.max(vh*1.5,vh+cell*3)/cell));
    Wb=cols*cell;Hb=rows*cell;
    var cells=[];for(var y=0;y<rows;y++)for(var x=0;x<cols;x++)cells.push({x:x*cell,y:y*cell});
    var r=rng(29),used=cells.map(function(c,i){return i;}).filter(function(){return r()>.04;});
    layer.textContent="";tiles=[];
    used.forEach(function(ci,k){
      var w=deck[k%deck.length],a=w.w/w.h,box=cell*(.86+r()*.08);
      var tw=a>=1?box:box*a,th=a>=1?box/a:box;
      var t={w:w,offx:r()*(cell-tw),offy:r()*(cell-th),tw:tw,th:th,s:1,ix:0,iy:0,rot:0};
      t.bx=cells[ci].x+t.offx;t.by=cells[ci].y+t.offy;
      var el=document.createElement("div");el.className="tb-t";
      el.style.width=tw.toFixed(1)+"px";el.style.height=th.toFixed(1)+"px";
      el.innerHTML='<img src="'+thumb(w)+'" alt="" width="'+Math.round(tw)+'" height="'+Math.round(th)+'" decoding="async" draggable="false">';
      el._t=t;t.el=el;layer.appendChild(el);tiles.push(t);
    });
    if(intro==="wait")prepIntro();
    render();
  }
  /* הסחיפה העצמית רצה בדפדפן (Web Animations על translate של השכבה), כדי שהשולחן במנוחה לא יכתוב 70 אריחים בכל פריים.
     השכבה זזה ב-transform רק כשהיד או הגלילה מזיזות אותה, ואריח נכתב רק כשהוא עובר מקצה לקצה */
  var DRIFT=[22,9],DRIFT_MS=4*3600*1000,driftA=null,lX=null,lY=null;
  function drift(){
    var t=driftA&&driftA.currentTime||0,s=(t%DRIFT_MS)/1000;
    return [-DRIFT[0]*s,-DRIFT[1]*s];
  }
  function render(){
    var X=ox+dx,Y=oy+dy,D=drift(),AX=X+D[0],AY=Y+D[1];
    if(X!==lX||Y!==lY){lX=X;lY=Y;layer.style.transform="translate3d("+X.toFixed(2)+"px,"+Y.toFixed(2)+"px,0)";}
    for(var i=0;i<tiles.length;i++){
      var t=tiles[i];
      var x=Math.round((t.bx-Math.floor((t.bx+AX+cell)/Wb)*Wb+t.ix)*10)/10,y=Math.round((t.by-Math.floor((t.by+AY+cell)/Hb)*Hb+t.iy)*10)/10;
      if(x===t.lx&&y===t.ly&&t.rot===t.lr&&t.s===t.ls)continue;
      t.lx=x;t.ly=y;t.lr=t.rot;t.ls=t.s;
      t.el.style.transform="translate3d("+x+"px,"+y+"px,0)"+(t.rot?" rotate("+t.rot.toFixed(2)+"deg)":"")+(t.s!==1?" scale("+t.s.toFixed(3)+")":"");
    }
  }
  function wrapX(v){return ((v+cell)%Wb+Wb)%Wb-cell;}
  function wrapY(v){return ((v+cell)%Hb+Hb)%Hb-cell;}
  function screenX(bx){return wrapX(bx+ox+dx+drift()[0]);}
  function screenY(by){return wrapY(by+oy+dy+drift()[1]);}

  // פתיחה: העבודות מחולקות על השולחן מנקודה אחת, הקרובות קודם, ואז הטקסט עולה
  function prepIntro(){
    var cx=vw/2,cy=vh*.45;
    tiles.forEach(function(t){
      var x=screenX(t.bx),y=screenY(t.by),ddx=cx-(x+t.tw/2),ddy=cy-(y+t.th/2);
      t.ix=ddx;t.iy=ddy;t.s=.35;t.rot=(Math.random()-.5)*36;t.el.style.opacity="0";t._d=Math.sqrt(ddx*ddx+ddy*ddy);
    });
  }
  function playIntro(){
    if(intro!=="wait")return;intro="done";
    tiles.forEach(function(t){
      var delay=.15+Math.min(.9,t._d/Math.max(vw,vh)*.9);
      gsap.to(t,{ix:0,iy:0,s:1,rot:0,duration:1.25,delay:delay,ease:"expo.out"});
      gsap.to(t.el,{opacity:1,duration:.35,delay:delay,ease:"none"});
    });
    setTimeout(function(){doc.classList.add("tb-go");},700);
    pause(2400);
  }

  /* סחיפה עצמית: נעצרת כשנוגעים, וחוזרת בהדרגה אחרי כמה שניות בלי מגע. בהפחתת תנועה אין סחיפה */
  function rate(){
    if(!driftA)return;
    var k=visible&&!document.hidden?driftK:0;
    if(driftA.playbackRate!==k)driftA.playbackRate=k;
  }
  function pause(ms){
    if(driftTw){driftTw.kill();driftTw=null;}
    driftK=0;rate();clearTimeout(idleT);
    if(!hasGsap||still.matches)return;
    idleT=setTimeout(function(){var o={k:0};driftTw=gsap.to(o,{k:1,duration:1.6,ease:"sine.inOut",onUpdate:function(){driftK=o.k;rate();}});},ms||2600);
  }

  /* תווית הסמן (MV:g76): נקודת ליים במקום הסמן, ושם הלקוח רק מעל עבודה */
  var curEl=document.getElementById("cur"),curT=curEl.querySelector(".cur-t"),px=-1,py=-1,inside=false,hot=null,qx=null,qy=null,dragging=false;
  function setHot(el){
    if(el===hot)return;
    if(hot)hot.classList.remove("hot");
    hot=el;
    if(hot){hot.classList.add("hot");var w=hot._t.w;curT.innerHTML="<b>"+w.client_he+"</b><span>"+w.title_he+"</span>";}
    curEl.classList.toggle("has-t",!!hot);
  }
  function hit(){
    if(!inside||dragging){setHot(null);return;}
    var el=document.elementFromPoint(px,py),t=el&&el.closest&&el.closest(".tb-t");
    setHot(t&&layer.contains(t)?t:null);
  }

  var drag=null,proxy=document.createElement("div");
  function initTable(){
    if(!hasGsap){doc.classList.add("tb-go");return;}
    if(!still.matches&&layer.animate){
      var far=DRIFT_MS/1000;
      driftA=layer.animate([{translate:"0px 0px"},{translate:(-DRIFT[0]*far)+"px "+(-DRIFT[1]*far)+"px"}],{duration:DRIFT_MS,iterations:Infinity});
      driftA.playbackRate=0;
    }
    build();
    tb.classList.add("live");
    new IntersectionObserver(function(es){visible=es[0].isIntersecting;rate();}).observe(tb);
    document.addEventListener("visibilitychange",rate);

    if(hasDrag){
      drag=Draggable.create(proxy,{type:fine.matches?"x,y":"x",trigger:stage,inertia:!still.matches,minimumMovement:5,allowContextMenu:true,
        onPress:function(){pause(1e9);dragging=false;},
        onDragStart:function(){dragging=true;tb.classList.add("grabbing");curEl.classList.add("drag");setHot(null);},
        onDrag:function(){ox=this.x;oy=this.y;},
        onThrowUpdate:function(){ox=this.x;oy=this.y;},
        onRelease:function(){tb.classList.remove("grabbing");curEl.classList.remove("drag");dragging=false;if(!this.isThrowing)pause();},
        onThrowComplete:function(){pause();},
        onClick:function(e){var t=e.target&&e.target.closest&&e.target.closest(".tb-t");if(t){lb.open(LB,W.indexOf(t._t.w),stage);}}
      })[0];
    }
    stage.addEventListener("keydown",function(e){
      var m={ArrowLeft:[1,0],ArrowRight:[-1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!m)return;
      e.preventDefault();pause();
      var tx=ox+m[0]*cell*1.2,ty=oy+m[1]*cell*1.2;
      gsap.to(proxy,{x:tx,y:ty,duration:still.matches?0:.6,ease:"power3.out",onUpdate:function(){ox=gsap.getProperty(proxy,"x");oy=gsap.getProperty(proxy,"y");},onComplete:function(){if(drag)drag.update();}});
    });

    if(fine.matches&&!still.matches){
      tb.classList.add("cur-on");curEl.classList.add("on");
      qx=gsap.quickTo(curEl,"x",{duration:.22,ease:"power3.out"});qy=gsap.quickTo(curEl,"y",{duration:.22,ease:"power3.out"});
      stage.addEventListener("pointermove",function(e){px=e.clientX;py=e.clientY;qx(px);qy(py);if(!inside){inside=true;gsap.set(curEl,{x:px,y:py});gsap.to(curEl,{autoAlpha:1,duration:.25});}});
      stage.addEventListener("pointerleave",function(){inside=false;setHot(null);gsap.to(curEl,{autoAlpha:0,duration:.2});});
      addEventListener("scroll",function(){if(inside){var r=stage.getBoundingClientRect();if(py<r.top||py>r.bottom){inside=false;setHot(null);gsap.to(curEl,{autoAlpha:0,duration:.2});}}},{passive:true});
    }

    // הגלילה מזיזה את השולחן: גוללים למטה, והעבודות עולות מהר יותר מהעמוד ונסחפות הצידה
    var frame=0,lastSY=scrollY;
    gsap.ticker.add(function(){
      var sy=scrollY,sd=sy-lastSY;lastSY=sy;
      if(!visible||document.hidden)return;
      if(sd&&!still.matches&&Math.abs(sd)<600){dy-=sd*.3;dx-=Math.abs(sd)*.12;}
      render();
      if(inside&&(++frame%3===0))hit();
    });

    if(intro==="wait")afterPl(playIntro);else pause(1200);

    var rt=0,lw=vw,lh=vh;
    addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(function(){
      var w=stage.clientWidth,h=stage.clientHeight;if(w===lw&&Math.abs(h-lh)<140)return;lw=w;lh=h;
      tiles.forEach(function(t){gsap.killTweensOf(t);gsap.killTweensOf(t.el);});build();
    },200);});
  }

  /* ================= עבודות נבחרות: פאנל במסך מלא לכל לקוח, נפתח ונערם על הקודם (ברוח Tyco) =================
     ליאב על ד: "לא אהבתי את הקטעים שפתאום הם הופכים לשחור". לכן אין החשכה: התחתית נמסה לרקע והכיתוב כהה */
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
  function depSet(ws){var o={};ws.forEach(function(i){BYID[i].departments.forEach(function(d){o[d]=1;});});return o;}
  (function(){
    var featEl=document.getElementById("feat");
    featEl.innerHTML=FEAT.map(function(s,i){
      var w=BYID[s.ws[0]],src=w.src,iw=w.w,ih=w.h;
      var tg=G.tags(depSet(s.ws)).map(function(t){return "<i>"+t+"</i>";}).join("");
      return '<article class="fp" aria-labelledby="fp-'+i+'">'+
        '<figure class="fp-media"><img src="'+src+'" alt="'+s.n+", "+s.d+'" width="'+iw+'" height="'+ih+'" loading="'+(i?"lazy":"eager")+'" decoding="async"></figure>'+
        '<div class="fp-txt">'+
          '<div class="fp-main"><h3 class="fp-c" id="fp-'+i+'">'+s.n+'</h3></div>'+
          '<div class="fp-side"><span class="fp-tags">'+tg+'</span><span class="fp-d">'+s.d+'</span></div>'+
        '</div>'+
        '<button class="fp-hit" type="button" data-k="'+i+'" aria-label="'+s.n+": "+s.d+', פתיחת העבודות"></button>'+
      '</article>';
    }).join("");
    featEl.addEventListener("click",function(e){var b=e.target.closest(".fp-hit");if(b)lb.open(setLB(FEAT[+b.dataset.k]),0,b);});
    G.projectCursor([featEl],".fp-hit");
    var fps=[].slice.call(featEl.children);
    if(!hasGsap)return;
    gsap.matchMedia().add("(min-width: 768px) and (prefers-reduced-motion: no-preference)",function(){
      featEl.classList.add("is-stack");
      fps.forEach(function(fp,i){
        var media=fp.querySelector(".fp-media"),img=media.querySelector("img"),txt=fp.querySelector(".fp-txt");
        var st={trigger:fp,start:"top bottom",end:"top top",scrub:.5};
        // נפתח מהמרכז תוך כדי שהוא עולה, והעבודה מתרחקת מעט (zoom out, כמו ב-Tyco)
        gsap.fromTo(media,{clipPath:"inset(14% 12% 14% 12% round 6px)"},{clipPath:"inset(0% 0% 0% 0% round 0px)",ease:"none",scrollTrigger:st});
        gsap.fromTo(img,{scale:1.22},{scale:1,ease:"none",scrollTrigger:{trigger:fp,start:"top bottom",end:"bottom top",scrub:.5}});
        gsap.fromTo(txt.children,{opacity:0,y:48},{opacity:1,y:0,ease:"none",stagger:.15,scrollTrigger:{trigger:fp,start:"top 45%",end:"top 5%",scrub:.5}});
        // הקודם נדחק מעט אחורה (MV:b37), בלי להחשיך
        if(i>0)gsap.to(fps[i-1],{scale:.94,ease:"none",scrollTrigger:st});
      });
      return function(){featEl.classList.remove("is-stack");};
    });
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

  /* ================= שלוש מחלקות: שלושה פאנלים של עבודות, והפאנל שמרחפים עליו נפתח לרוחב =================
     ליאב, 19.10: "גליצ'י כשעולים עם העכבר... יותר להראות ופחות לספר". בלי עדשה רודפת ובלי פסקאות:
     התמונה לא משנה גודל כשהפאנל נפתח (רק נחשפת), ולכן אין קפיצה. בפאנל הפתוח שלוש עבודות מתחלפות */
  (function(){
    if(!C)return;
    var dpa=document.getElementById("dpa"),KEYS=["branding","web","digital"];
    var PICK={branding:["maatouk-brand","mishkan-eliyahu","lemon-park","finalytix","active-brand"],web:["shir-shel-yom","katz-resort-site","vayudot-site","extreme-site","izraex-site"],digital:["mbc-instagram","gencell-b","nati-social","focus-event","aviv-infographic"]};
    dpa.innerHTML=KEYS.map(function(k,i){var d=C.depts[k];
      var ims=PICK[k].filter(function(n){return BYID[n];}).map(function(n,j){var w=BYID[n];
        return '<img src="'+(j?thumb(w):w.src)+'" data-full="'+w.src+'" alt="" width="'+w.w+'" height="'+w.h+'" loading="lazy" decoding="async"'+(j?'':' class="on"')+'>';}).join("");
      return '<li class="dpa-i'+(i?'':' on')+'" data-d="'+k+'"><a class="dpa-a" href="work.html?d='+k+'">'+
        '<span class="dpa-m" aria-hidden="true">'+ims+'</span>'+
        '<span class="dpa-t">'+
          '<span class="dpa-n">'+d.name+'</span>'+
          '<span class="dpa-s"><span>'+d.services.slice(0,3).join(" · ")+'</span></span></span>'+
        '<span class="dpa-go" aria-hidden="true">'+ARR+'</span>'+
      '</a></li>';}).join("");
    var items=[].slice.call(dpa.children),cur=items[0],cyc=0;
    // התמונות הקטנות מתחלפות לגדולות כשהפאנל נפתח בפעם הראשונה
    function sharpen(li){li.querySelectorAll("img[data-full]").forEach(function(im){if(im.src.indexOf(im.dataset.full)<0)im.src=im.dataset.full;im.removeAttribute("data-full");});}
    function cycle(){
      clearInterval(cyc);
      if(still.matches)return;
      cyc=setInterval(function(){
        var ims=cur.querySelectorAll(".dpa-m img"),i=[].indexOf.call(ims,cur.querySelector(".dpa-m img.on"));
        ims[i].classList.remove("on");ims[(i+1)%ims.length].classList.add("on");
      },2400);
    }
    function open(li){
      if(li===cur)return;
      cur.classList.remove("on");li.classList.add("on");cur=li;sharpen(li);cycle();
    }
    var wide=matchMedia("(min-width:768px)");
    items.forEach(function(li){
      li.addEventListener("pointerenter",function(e){if(e.pointerType==="mouse"&&wide.matches)open(li);});
      li.querySelector("a").addEventListener("focus",function(){open(li);});
    });
    // הפאנל הפתוח מתחלף רק כשרואים אותו
    new IntersectionObserver(function(es){if(es[0].isIntersecting){sharpen(cur);cycle();}else clearInterval(cyc);}).observe(dpa);
  })();

  /* ================= ציטוט: המילים נדלקות, ומאחור שלוש שורות עבודות שנעות לצדדים ================= */
  (function(){
    var bg=document.getElementById("qt-bg"),p=document.getElementById("qt-p"),sec=document.getElementById("quote");
    var pool=W.filter(function(w){return w.quality!=="poor";});
    var rows=[0,1,2].map(function(k){
      var row=document.createElement("div");row.className="qt-row";row.style.alignSelf="center";
      var html="";for(var i=0;i<14;i++){var w=pool[(k*14+i*3+k)%pool.length];html+='<img src="'+thumb(w)+'" alt="" width="'+w.w+'" height="'+w.h+'" loading="lazy" decoding="async">';}
      bg.appendChild(row);
      // השורה האמצעית מוסתרת בטלפון: התמונות שלה נכנסות רק כשהיא מוצגת
      function fill(){if(!row.childElementCount&&getComputedStyle(row).display!=="none")row.innerHTML=html;}
      fill();if(!row.childElementCount)addEventListener("resize",fill,{passive:true});
      return row;
    });
    function split(el){
      [].slice.call(el.childNodes).forEach(function(n){
        if(n.nodeType===3){
          var f=document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(t){
            if(!t)return;
            if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));return;}
            var s=document.createElement("span");s.className="w";s.textContent=t;f.appendChild(s);
          });
          el.replaceChild(f,n);
        }else if(n.nodeType===1)split(n);
      });
    }
    split(p);
    if(!hasGsap)return;
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      rows.forEach(function(row,k){
        var dir=k%2?1:-1;
        gsap.fromTo(row,{x:function(){return -innerWidth*.12*dir;}},{x:function(){return innerWidth*.12*dir;},ease:"none",
          scrollTrigger:{trigger:sec,start:"top bottom",end:"bottom top",scrub:.6,invalidateOnRefresh:true}});
      });
      var ws=[].slice.call(p.querySelectorAll(".w"));
      gsap.set(ws,{"--lit":0});
      gsap.to(ws,{"--lit":1,ease:"none",stagger:.4,duration:1,scrollTrigger:{trigger:p,start:"top 80%",end:"bottom 48%",scrub:.5}});
      return function(){gsap.set(ws,{clearProps:"--lit"});gsap.set(rows,{clearProps:"transform"});};
    });
  })();

  /* ================= ענן עבודות: שתים-עשרה עבודות מרחפות בעומק. הגלילה מרימה כל אחת בקצב שלה, והעכבר מזיז לצדדים (MV:g37) ================= */
  (function(){
    var sec=document.getElementById("cloud"),box=document.getElementById("cd-imgs");if(!sec)return;
    // [עבודה, x, y, רוחב, עומק, ובטלפון x, y, רוחב]. x ו-y באחוזים מהסקשן, ועומק גבוה עולה מהר יותר ויושב מעל.
    // שמונה בפתיחה, וארבע מתחת לקצה שעולות מתוך החושך בזמן הגלילה, כדי שהמסך לא יתרוקן בסוף.
    // הפינה הימנית התחתונה נשארת לכותרת בפתיחה. בלי ערכי טלפון העבודה לא מוצגת בטלפון
    var CLOUD=[
      ["gencell-c",6,12,22,.8, 6,8,54],
      ["aldo-ad-c",33,9,12,1.4, 66,6,28],
      ["crunchy-truck",52,18,19,1, 46,26,46],
      ["smartnpv-can",77,11,15,1.6],
      ["maatouk-brand",4,56,11,1.9, 6,30,30],
      ["puzzle-soups",20,40,24,.7, 40,46,54],
      ["mbc-instagram",50,54,14,1.3, 6,54,32],
      ["katz-resort-site",70,40,18,1.1],
      ["ag-financial-2021",8,96,16,1.2, 6,95,46],
      ["segal-flyers",32,110,13,1.6, 54,110,40],
      ["puzzle-ad",82,118,13,1.8],
      ["aldo-ad-d",47,130,10,2, 56,147,30]
    ];
    box.innerHTML=CLOUD.map(function(c){
      var w=BYID[c[0]],m=c.length>5;
      return '<button type="button" class="cd-i'+(m?"":" cd-dt")+(c[2]>=90?" cd-w":"")+'" data-id="'+w.id+'" data-d="'+c[4]+'" aria-label="'+w.client_he+" · "+w.title_he+', תצוגה מלאה"'+
        ' style="--x:'+c[1]+';--y:'+c[2]+';--w:'+c[3]+(m?';--mx:'+c[5]+';--my:'+c[6]+';--mw:'+c[7]:"")+';--ar:'+w.w+'/'+w.h+';z-index:'+Math.round(c[4]*10)+'">'+
        '<img src="'+thumb(w)+'" srcset="'+thumb(w)+' 560w, '+w.src+' '+w.w+'w" sizes="(max-width:767px) '+(m?c[7]:1)+'vw, '+c[3]+'vw" alt="" width="'+w.w+'" height="'+w.h+'" loading="lazy" decoding="async"></button>';
    }).join("");
    var btns=[].slice.call(box.children);
    // החיצים במציג עוברים בין העבודות שבענן (בטלפון רק בין השבע שמוצגות)
    box.addEventListener("click",function(e){
      var b=e.target.closest(".cd-i");if(!b)return;
      var vis=btns.filter(function(x){return x.getClientRects().length;});
      lb.open(vis.map(function(x){return lbItem(BYID[x.dataset.id]);}),vis.indexOf(b),b);
    });
    G.projectCursor([box],".cd-i");
    if(!hasGsap)return;
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      // opacity ולא autoAlpha: עבודה שעוד לא נכנסה נשארת זמינה במקלדת
      gsap.set(btns,{opacity:0,scale:.9});
      gsap.to(btns,{opacity:1,scale:1,duration:.9,ease:"power3.out",stagger:{each:.06,from:"random"},
        scrollTrigger:{trigger:sec,start:"top 70%",toggleActions:"play none none none"}});
      var tl=gsap.timeline({scrollTrigger:{trigger:sec,start:"top top",end:"+=130%",pin:true,scrub:.6,invalidateOnRefresh:true}});
      btns.forEach(function(b){tl.to(b,{y:function(){return -sec.offsetHeight*.5*(+b.dataset.d);},ease:"none"},0);});
      if(!fine.matches)return;
      var qs=btns.map(function(b){return {x:gsap.quickTo(b,"x",{duration:.9,ease:"power3"}),d:+b.dataset.d};});
      function move(e){var r=sec.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5;qs.forEach(function(q){q.x(-nx*60*q.d);});}
      sec.addEventListener("mousemove",move);
      return function(){sec.removeEventListener("mousemove",move);};
    });
  })();

  G.darkZone(document.querySelector(".dz"));

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
    function img(c,alt,lazy){return '<img src="img/clients/'+c.f+'.webp" alt="'+(alt?c.name:'')+'" width="'+c.w+'" height="'+c.h+'" style="--s:'+c.s+';--ar:'+(c.w/c.h).toFixed(3)+'"'+(lazy?' loading="lazy"':'')+' decoding="async">';}
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
        fig.style.setProperty("--lx",x+"px");fig.style.setProperty("--ly",o.y+"px");
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
      return function(){root.classList.remove("mv-on");fig.style.removeProperty("--lx");fig.style.removeProperty("--ly");gsap.set(lens,{clearProps:"transform"});zoom.style.transform="";};
    });
  })();

  /* ================= מה מספרים עלינו: הסקשן ננעל, וצילומי המסך עוברים לרוחב, ישרים ================= */
  function byId(id){return C.quotes.filter(function(q){return q.id===id;})[0]||C.shots.filter(function(x){return x.id===id;})[0];}
  function whoOrg(q){var o=(q.org||"").split(" · ")[0].split(", ").pop();return o?q.who+", "+o:q.who;}
  (function(){
    if(!C)return;
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
      return '<li class="sd-c" style="--ar:'+ar.toFixed(3)+';--tar:'+Math.max(.5,Math.min(2.6,s.w/s.h)).toFixed(3)+'"><button class="sd-b" type="button" data-k="'+i+'">'+
        '<span class="sd-shot"><img src="'+s.thumb+'" alt="צילום מסך של הודעה: '+q.who+'" width="'+s.w+'" height="'+s.h+'" loading="lazy" decoding="async"></span>'+
        '<span class="sd-cap">'+(q.short?'<span class="sd-q">״'+q.short+'״</span>':'')+'<span class="sd-w">'+whoOrg(q)+'</span></span></button></li>';
    }).join("");
    var cardsS=[].slice.call(tr.children),bar=document.getElementById("sd-bar"),idx=document.getElementById("sd-i");
    function prog(p){p=Math.max(0,Math.min(1,p));bar.style.transform="scaleX("+p.toFixed(4)+")";idx.textContent=pad(1+Math.round(p*(N-1)));}
    sec.addEventListener("click",function(e){var b=e.target.closest(".sd-b");if(b)lb.open(list,+b.dataset.k,b);});
    vp.addEventListener("scroll",function(){var m=vp.scrollWidth-vp.clientWidth;if(m>0)prog(Math.abs(vp.scrollLeft)/m);},{passive:true});
    prog(0);
    if(!hasGsap)return;
    var nEl=document.getElementById("sd-n");
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      nEl.style.minWidth=nEl.offsetWidth+"px";var o={v:0};nEl.textContent="0";
      gsap.to(o,{v:C.wallTotal,duration:1.6,ease:"power3.out",onUpdate:function(){nEl.textContent=Math.round(o.v);},scrollTrigger:{trigger:sec,start:"top 75%"}});
      return function(){nEl.textContent=C.wallTotal;nEl.style.minWidth="";};
    });
    gsap.matchMedia().add("(min-width: 768px) and (prefers-reduced-motion: no-preference)",function(){
      sec.classList.add("is-pin");
      var pin=sec.querySelector(".sd-pin");
      function dist(){return Math.max(0,tr.scrollWidth-vp.clientWidth);}
      // כל צילום קטן מעט כשהוא רחוק מהמרכז, וחוזר לגודל מלא כשהוא מגיע אליו. בלי הטיה
      var sets=cardsS.map(function(c){return gsap.quickSetter(c,"scale");});
      function size(){
        var mid=innerWidth/2;
        cardsS.forEach(function(c,i){var r=c.getBoundingClientRect(),d=(r.left+r.width/2-mid)/mid;sets[i](1-Math.min(1,Math.abs(d))*.05);});
      }
      gsap.to(tr,{x:function(){return dist();},ease:"none",onUpdate:size,
        scrollTrigger:{trigger:pin,start:"top top",end:function(){return "+="+Math.round(dist()*.6);},pin:true,scrub:.6,anticipatePin:1,invalidateOnRefresh:true,
          onUpdate:function(s){prog(s.progress);},onRefresh:size}});
      size();
      return function(){sec.classList.remove("is-pin");gsap.set(cardsS,{clearProps:"transform,scale"});prog(0);};
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

  G.darkZone(document.getElementById("ft"));
  G.limeWords(null);

  /* ================= הפעלה: הפונטים משנים גבהים, ולכן מודדים אחריהם ================= */
  function start(){
    initTable();
    if(hasGsap)ScrollTrigger.refresh();
  }
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(start);else addEventListener("load",start);
  rv(document);doc.classList.add("rv-ok");
})();
