/* סקיצה ז · "השולחן הבהיר", אחרי הפגישה עם לילך (18.10)
   השולחן מ-ו בבהיר: כל העבודות על משטח אינסופי שגוררים ביד (MV:g06), והגלילה מזיזה אותו. בורר שמושך מחלקה למרכז.
   העבודות הנבחרות לפי לקוח, עם המחלקות שהיו בו, בריבועים או בפסיפס. הצהרה שנצבעת (MV:g48), תג מסתובב (MV:g83).
   אזור כהה בשחור רך: המחלקות עם עדשה רודפת (MV:g43) וציטוט שנדלק. קיר לוגואים עם זכוכית מגדלת (MV:g101),
   קיר ההודעות שנע לרוחב, שלוש דרכים ליצירת קשר, ופוטר שבסוף הגלילה חוזר לעבודות. */
(function(){
  "use strict";
  var doc=document.documentElement;
  var still=matchMedia("(prefers-reduced-motion: reduce)");
  var fine=matchMedia("(hover:hover) and (pointer:fine)");
  var hasGsap=!!(window.gsap&&window.ScrollTrigger);
  var hasDrag=hasGsap&&!!window.Draggable;
  if(hasGsap){gsap.registerPlugin(ScrollTrigger);if(window.Flip)gsap.registerPlugin(Flip);if(hasDrag)gsap.registerPlugin(Draggable,window.InertiaPlugin);}
  var C=window.CONTENT;
  var ARR='<svg class="arr" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 10H5m4-4-4 4 4 4"/></svg>';
  var lb=lightbox();
  document.querySelector("dialog.lb").setAttribute("aria-label","עבודה מתיק העבודות");

  // מנהל המכירות: הטלפון והוואטסאפ של כל דרכי הקשר בעמוד (לילך, 18.10: "בלי מייל, הטופס הולך אלינו")
  var SALES="054-777-2388",SALES_TEL="tel:+972547772388";
  var WA="https://wa.me/972547772388?text="+encodeURIComponent("היי, הגעתי מהאתר של Visual ורוצה לדבר על פרויקט");

  /* העבודות הטובות קודם, ובתוכן הציבוריות */
  var W=WORKS.slice().sort(function(a,b){
    var q={good:0,ok:1,poor:2};
    return (q[a.quality]!=null?q[a.quality]:1)-(q[b.quality]!=null?q[b.quality]:1)||(b.public_body===true)-(a.public_body===true);
  });
  function file(w){return w.src.split("/").pop();}
  function thumb(w){return "../f/img/t/"+file(w);}
  function deps(w){return w.departments.length===3?"כל המחלקות":w.departments.map(function(d){return DEPTS_SHORT[d];}).join(" · ");}
  function lbItem(w){return {full:w.src,fw:w.w,fh:w.h,alt:w.alt_he,cap:w.client_he+" · "+w.title_he};}
  var LB=W.map(lbItem);

  /* מסך הטעינה מודיע כשהאתר נחשף, והשולחן מתחיל רק אז */
  function plDone(){if(window.__plDone)return;window.__plDone=true;dispatchEvent(new Event("pl-done"));}
  function afterPl(f){if(window.__plDone||!doc.classList.contains("pl-on")&&!document.getElementById("pl"))f();else addEventListener("pl-done",f,{once:true});}

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
        fs.style.setProperty("--cx",(r.left+r.width/2)+"px");fs.style.setProperty("--cy",(r.top+r.height/2)+"px");
      }
      fs.classList.toggle("open",open);fs.inert=!open;
      btn.setAttribute("aria-expanded",String(open));hd.classList.toggle("menu-open",open);
      doc.style.scrollbarGutter=open?"stable":"";doc.style.overflow=open?"hidden":"";doc.classList.toggle("fs-lock",open);
      if(open)setTimeout(function(){closeBtn.focus({preventScroll:true});},still.matches?0:320);
      else if(back!==false)btn.focus({preventScroll:true});
    }
    // הסימן בתפריט: העבודה של הפריט מופיעה בתוך העדשה, והאישון מסתכל עליו
    var pupil=fs.querySelector(".fs-pupil"),eImgs=fs.querySelectorAll(".fs-view img"),eCur=0;
    function look(a){
      var src=a.getAttribute("data-img"),now=eImgs[eCur];
      if(src&&now.getAttribute("src")!==src){var nx=eImgs[1-eCur];nx.src=src;nx.classList.remove("nx");now.classList.add("nx");eCur=1-eCur;}
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
      // בלי pl-on נעלם גם שוליים שמורים לפס הגלילה, והרוחב משתנה: מודדים מחדש עכשיו ולא רק בסוף הפתיחה
      pl.classList.add("out");doc.classList.remove("pl-on");ScrollTrigger.refresh();
      setTimeout(plDone,120);
      gsap.timeline({onComplete:function(){pl.remove();ScrollTrigger.refresh();}})
        .to(o,{r:far,duration:1.05,ease:"power3.inOut",onUpdate:function(){pl.style.setProperty("--r",o.r+"px");}},.1)
        .to(logo,{scale:1.12,autoAlpha:0,duration:.6,ease:"power2.in"},.15);
    });
  })();

  /* ================= השולחן: אינסופי, נגרר ביד עם תנופה, נסחף לבד, והגלילה מזיזה אותו ================= */
  var tb=document.querySelector(".tb"),stage=document.getElementById("tb"),layer=document.getElementById("tb-layer");
  var pullBar=document.getElementById("pull"),pullStatus=document.getElementById("pull-status"),stopBtn=document.getElementById("tb-stop");
  var tiles=[],cells=[],cell=0,Wb=1,Hb=1,vw=0,vh=0,wrapX,wrapY;
  var ox=0,oy=0;            // ההזזה של היד (Draggable על proxy)
  var dx=0,dy=0;            // הסחיפה העצמית והגלילה
  var driftK=0,driftTw=null,idleT=0,visible=true,cur="all",frozen=false;
  var intro=doc.classList.contains("tb-intro")?"wait":"done";

  function rng(s){return function(){s=s*16807%2147483647;return (s-1)/2147483646;};}
  function mod(a,n){return ((a%n)+n)%n;}
  var deck=(function(){var r=rng(11),a=W.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;})();

  function build(){
    vw=stage.clientWidth;vh=stage.clientHeight;
    var mob=vw<768;
    cell=mob?Math.round(Math.max(124,vw*.34)):Math.round(Math.min(300,Math.max(188,vw*.148)));
    var cols=Math.max(5,Math.round(Math.max(vw*1.6,vw+cell*3)/cell)),rows=Math.max(5,Math.round(Math.max(vh*1.5,vh+cell*3)/cell));
    Wb=cols*cell;Hb=rows*cell;
    wrapX=gsap.utils.wrap(-cell,Wb-cell);wrapY=gsap.utils.wrap(-cell,Hb-cell);
    cells=[];for(var y=0;y<rows;y++)for(var x=0;x<cols;x++)cells.push({x:x*cell,y:y*cell});
    var r=rng(29),used=cells.map(function(c,i){return i;}).filter(function(){return r()>.08;});
    layer.textContent="";tiles=[];
    used.forEach(function(ci,k){
      var w=deck[k%deck.length],a=w.w/w.h,box=cell*(.68+r()*.24);
      var tw=a>=1?box:box*a,th=a>=1?box/a:box;
      var t={w:w,home:ci,ci:ci,offx:r()*(cell-tw),offy:r()*(cell-th),tw:tw,th:th,s:1,ix:0,iy:0,rot:0};
      t.bx=cells[ci].x+t.offx;t.by=cells[ci].y+t.offy;
      var el=document.createElement("div");el.className="tb-t";
      el.style.width=tw.toFixed(1)+"px";el.style.height=th.toFixed(1)+"px";
      el.innerHTML='<img src="'+thumb(w)+'" alt="" width="'+Math.round(tw)+'" height="'+Math.round(th)+'" decoding="async" draggable="false">';
      el._t=t;t.el=el;layer.appendChild(el);tiles.push(t);
    });
    if(cur!=="all")place(cur,false);
    if(intro==="wait")prepIntro();
    render();
  }
  /* הסחיפה העצמית רצה בדפדפן (Web Animations על translate של השכבה), כדי שהשולחן במנוחה לא יכתוב 70 אריחים בכל פריים.
     השכבה עצמה זזה ב-transform רק כשהיד או הגלילה מזיזות אותה, ואריח נכתב רק כשהוא עובר מקצה לקצה או כשמזיזים אותו */
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
  // המיקום על המסך של נקודה בשכבה, כולל הסחיפה
  function screenX(bx){return wrapX(bx+ox+dx+drift()[0]);}
  function screenY(by){return wrapY(by+oy+dy+drift()[1]);}

  /* משיכה למרכז: העבודות של המחלקה תופסות את התאים הקרובים למרכז המבט, והשאר מתפזרות החוצה ומתעמעמות */
  function place(d,animate){
    var D=drift(),X=ox+dx+D[0],Y=oy+dy+D[1],cx=mod(vw/2-X,Wb),cy=mod(vh*.42-Y,Hb);
    function dist(c){var ddx=Math.abs(c.x+cell/2-cx),ddy=Math.abs(c.y+cell/2-cy);ddx=Math.min(ddx,Wb-ddx);ddy=Math.min(ddy,Hb-ddy);return ddx*ddx+ddy*ddy*1.6;}
    var order=d==="all"?null:cells.map(function(c,i){return i;}).sort(function(a,b){return dist(cells[a])-dist(cells[b]);});
    var inn=tiles.filter(function(t){return d==="all"||t.w.departments.indexOf(d)>-1;});
    var out=tiles.filter(function(t){return inn.indexOf(t)<0;});
    function byNear(a,b){return dist(cells[a.ci])-dist(cells[b.ci]);}
    if(order){inn.sort(byNear);out.sort(byNear);}
    var k=0;
    inn.concat(out).forEach(function(t){
      var ci=order?order[k++]:t.home,isIn=inn.indexOf(t)>-1;
      var tx=cells[ci].x+t.offx,ty=cells[ci].y+t.offy;
      var ddx=mod(tx-t.bx,Wb);if(ddx>Wb/2)ddx-=Wb;
      var ddy=mod(ty-t.by,Hb);if(ddy>Hb/2)ddy-=Hb;
      t.ci=ci;
      var to={bx:t.bx+ddx,by:t.by+ddy,s:isIn?1:.78};
      if(animate&&!still.matches){
        var delay=Math.min(.45,Math.sqrt(dist(cells[ci]))/(vw*2.2));
        gsap.to(t,{bx:to.bx,by:to.by,s:to.s,duration:1.15,delay:delay,ease:"power3.inOut",overwrite:"auto"});
        gsap.to(t.el,{opacity:isIn?1:.16,duration:.6,delay:isIn?delay:0,ease:"power2.out",overwrite:"auto"});
      }else{
        t.bx=to.bx;t.by=to.by;t.s=to.s;t.el.style.opacity=isIn?"":".16";
      }
      t.el.classList.toggle("is-out",!isIn);
    });
    if(!animate)render();
  }

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
      var o=t.el.classList.contains("is-out"),delay=.15+Math.min(.9,t._d/Math.max(vw,vh)*.9);
      gsap.to(t,{ix:0,iy:0,s:o?.78:1,rot:0,duration:1.25,delay:delay,ease:"expo.out"});
      gsap.to(t.el,{opacity:o?.16:1,duration:.35,delay:delay,ease:"none"});
    });
    setTimeout(function(){doc.classList.add("tb-go");},700);
    pause(2400);
  }

  var count={all:W.length};W.forEach(function(w){w.departments.forEach(function(d){count[d]=(count[d]||0)+1;});});
  var startD=new URLSearchParams(location.search).get("d");if(!DEPTS[startD])startD="all";
  pullBar.innerHTML=[["all","הכול"],["branding",DEPTS.branding],["web",DEPTS.web],["digital",DEPTS.digital]].map(function(p){
    return '<button type="button" data-v="'+p[0]+'" aria-pressed="'+(p[0]===startD)+'">'+p[1]+' <small>'+count[p[0]]+'</small></button>';
  }).join("");
  function pull(d,fromUser){
    if(d===cur&&fromUser)return;
    cur=d;
    pullBar.querySelectorAll("button").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.v===d));});
    if(tiles.length)place(d,fromUser&&hasGsap);
    if(fromUser){
      pullStatus.textContent=d==="all"?"כל "+W.length+" העבודות על השולחן":"עבודות "+DEPTS[d]+" במרכז השולחן: "+count[d]+" עבודות";
      pause(5200);
      var p=new URLSearchParams(location.search);if(d==="all")p.delete("d");else p.set("d",d);
      history.replaceState(null,"",location.pathname+(p.toString()?"?"+p:"")+location.hash);
    }
  }
  pullBar.addEventListener("click",function(e){var b=e.target.closest("button");if(b)pull(b.dataset.v,true);});
  // כל קישור למחלקה בעמוד (שורות המחלקות, הפוטר) מושך אותה לשולחן במקום לטעון את העמוד מחדש
  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest("[data-pull]");if(!a||e.metaKey||e.ctrlKey)return;
    e.preventDefault();if(Peek)Peek.hide();
    pull(a.getAttribute("data-pull"),true);scrollToY(0);
    setTimeout(function(){stage.focus({preventScroll:true});},still.matches?0:600);
  });

  /* סחיפה עצמית: נעצרת כשנוגעים, חוזרת אחרי כמה שניות בלי מגע, ונעצרת לגמרי בכפתור */
  // מהירות הסחיפה: 0 כשנוגעים, כשהשולחן מחוץ למסך או כשהלשונית מוסתרת, ועולה בהדרגה ל-1 כשעוזבים
  function rate(){
    if(!driftA)return;
    var k=visible&&!document.hidden?driftK:0;
    if(driftA.playbackRate!==k)driftA.playbackRate=k;
  }
  function pause(ms){
    if(driftTw){driftTw.kill();driftTw=null;}
    driftK=0;rate();clearTimeout(idleT);
    if(!hasGsap||still.matches||frozen)return;
    idleT=setTimeout(function(){var o={k:0};driftTw=gsap.to(o,{k:1,duration:1.6,ease:"sine.inOut",onUpdate:function(){driftK=o.k;rate();}});},ms||2600);
  }
  stopBtn.addEventListener("click",function(){
    frozen=!frozen;
    stopBtn.setAttribute("aria-pressed",String(frozen));stopBtn.textContent=frozen?"הפעלת התנועה":"עצירת התנועה";
    pause(600);
  });

  /* תווית הסמן (MV:g76): נקודת ליים במקום הסמן, ומעל עבודה שם הלקוח */
  var curEl=document.getElementById("cur"),curT=curEl.querySelector(".cur-t"),px=-1,py=-1,inside=false,hot=null,qx=null,qy=null,dragging=false;
  function setHot(el){
    if(el===hot)return;
    if(hot)hot.classList.remove("hot");
    hot=el;
    if(hot){hot.classList.add("hot");var w=hot._t.w;curT.innerHTML="<b>"+w.client_he+"</b><span>"+w.title_he+" · "+deps(w)+"</span>";}
    else curT.innerHTML="<b>גררו</b>";
  }
  function hit(){
    if(!inside||dragging){setHot(null);return;}
    var el=document.elementFromPoint(px,py),t=el&&el.closest&&el.closest(".tb-t");
    setHot(t&&layer.contains(t)?t:null);
  }

  var drag=null,proxy=document.createElement("div");
  function initTable(){
    if(!hasGsap){doc.classList.add("tb-go");stopBtn.hidden=true;return;}
    if(still.matches)stopBtn.hidden=true;
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
      stage.addEventListener("pointermove",function(e){px=e.clientX;py=e.clientY;qx(px);qy(py);if(!inside){inside=true;gsap.set(curEl,{x:px,y:py});gsap.to(curEl,{autoAlpha:1,duration:.25});curEl.classList.add("has-t");}});
      stage.addEventListener("pointerleave",function(){inside=false;setHot(null);gsap.to(curEl,{autoAlpha:0,duration:.2});curEl.classList.remove("has-t");});
      addEventListener("scroll",function(){if(inside){var r=stage.getBoundingClientRect();if(py<r.top||py>r.bottom){inside=false;setHot(null);gsap.to(curEl,{autoAlpha:0,duration:.2});}}},{passive:true});
      setHot(null);
    }

    // הגלילה מזיזה את השולחן: גוללים למטה, והעבודות עולות מהר יותר מהעמוד ונסחפות הצידה
    var frame=0,lastSY=scrollY;
    gsap.ticker.add(function(){
      var sy=scrollY,sd=sy-lastSY;lastSY=sy;
      if(!visible||document.hidden)return;
      if(sd&&!frozen&&!still.matches&&Math.abs(sd)<600){dy-=sd*.3;dx-=Math.abs(sd)*.12;}
      render();
      if(inside&&(++frame%3===0))hit();
    });

    if(intro==="wait")afterPl(playIntro);else pause(1200);
    if(startD!=="all")pull(startD,false);

    var rt=0,lw=vw,lh=vh;
    addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(function(){
      var w=stage.clientWidth,h=stage.clientHeight;if(w===lw&&Math.abs(h-lh)<140)return;lw=w;lh=h;
      tiles.forEach(function(t){gsap.killTweensOf(t);gsap.killTweensOf(t.el);});build();
    },200);});
  }

  /* ================= עבודות נבחרות: לפי לקוח, ומתחת לכל עבודה המחלקות שהיו בה ================= */
  var TAG={branding:"מיתוג",web:"אתרים",digital:"שיווק"};
  var SETS={
    a:[
      {n:"פלג הגליל",ws:[1,22,36],img:"../e/img/f-peleg.jpg",iw:1500,ih:1177,d:"דוח שנתי ואתר"},
      {n:"משרד האוצר",ws:[2],img:"../e/img/f-ministry.jpg",iw:1600,ih:1051,d:"דוח שנתי 2019"},
      {n:"מכינת קשת יהודה",ws:[20,21,46],d:"מיתוג, ניירת ואתר"},
      {n:"אביב לניצולי השואה",ws:[29,51,55,57],img:"../e/img/f-aviv.jpg",iw:1600,ih:872,d:"כרטיסים דיגיטליים, פליירים ודף סיכום שנה"},
      {n:"החברה לפיתוח קצרין",ws:[7],d:"אתר"},
      {n:"אלדו, רשת גלידריות",ws:[47,15,16],d:"שילוט, קטלוג ואינפוגרפיקה"}
    ],
    b:[
      {n:"המכללה האזורית צפת",ws:[8],img:"../e/img/f-college.jpg",iw:2400,ih:1543,d:"אתר"},
      {n:"רנה",ws:[18,3],d:"אריזה, מיתוג ומודעות"},
      {n:"Tourism Expertise Network",ws:[48],d:"חוברת ומיתוג"},
      {n:"MBC",ws:[5],d:"פוסטים לאינסטגרם"},
      {n:"איולי",ws:[11,4,27],d:"לוגו, לוח כתיבה וקמפיין בפייסבוק"},
      {n:"Katz Resort",ws:[58],d:"אתר"}
    ]
  };
  var gridA=document.getElementById("fw-a"),gridB=document.getElementById("fw-b"),cards=[];
  function setLB(s){
    var list=s.ws.map(function(i){return lbItem(WORKS[i]);});
    if(s.img)list.unshift({full:s.img,fw:s.iw,fh:s.ih,alt:s.n+", "+s.d,cap:s.n+" · "+s.d});
    return list;
  }
  function fill(grid,list){
    grid.innerHTML=list.map(function(s,k){
      var w=WORKS[s.ws[0]],dset={};s.ws.forEach(function(i){WORKS[i].departments.forEach(function(d){dset[d]=1;});});
      var tags=["branding","web","digital"].filter(function(d){return dset[d];}).map(function(d){return "<i>"+TAG[d]+"</i>";}).join("");
      var im=s.img?'<img src="'+s.img+'" alt="'+s.n+", "+s.d+'" width="'+s.iw+'" height="'+s.ih+'" loading="lazy" decoding="async">'
        :'<img src="'+thumb(w)+'" srcset="'+thumb(w)+' 560w, '+w.src+' '+w.w+'w" sizes="(max-width:767px) 50vw, 40vw" alt="'+w.alt_he+'" width="'+w.w+'" height="'+w.h+'" loading="lazy" decoding="async">';
      return '<li class="fw"><button class="fw-b" type="button" data-k="'+k+'" aria-label="'+s.n+": "+s.d+', פתיחת העבודות"><span class="fw-p">'+
        '<span class="fw-m">'+im+'</span>'+
        '<span class="fw-c"><b>'+s.n+'</b><span class="fw-tags">'+tags+'</span></span>'+
        '<span class="fw-d">'+s.d+'</span></span></button></li>';
    }).join("");
    grid.addEventListener("click",function(e){var b=e.target.closest(".fw-b");if(b)lb.open(setLB(list[+b.dataset.k]),0,b);});
    cards=cards.concat([].slice.call(grid.children));
  }
  fill(gridA,SETS.a);fill(gridB,SETS.b);

  // ריבועים: כל עמודה עולה בקצב משלה. פסיפס: שתי עבודות בשורה, בגבהים שווים
  var para=[];
  function paraOff(){para.forEach(function(t){if(t.scrollTrigger)t.scrollTrigger.kill();t.kill();});para=[];gsap.set(document.querySelectorAll(".fw-p"),{clearProps:"transform"});}
  function paraOn(){
    if(!hasGsap||still.matches)return;
    var mob=innerWidth<768,mo=gridA.classList.contains("mo");
    var OFF=mob?[30,80]:mo?[50,120]:[60,140,100];
    [gridA,gridB].forEach(function(g){
      var lefts=[];[].forEach.call(g.children,function(li){var l=Math.round(li.offsetLeft);if(lefts.indexOf(l)<0)lefts.push(l);});
      lefts.sort(function(a,b){return b-a;});
      [].forEach.call(g.children,function(li){
        var c=lefts.indexOf(Math.round(li.offsetLeft)),y=OFF[c%OFF.length];
        para.push(gsap.fromTo(li.querySelector(".fw-p"),{y:y},{y:0,ease:"none",scrollTrigger:{trigger:li,start:"top bottom",end:"top 40%",scrub:.6}}));
      });
    });
  }
  (function(){
    var bar=document.getElementById("lay");
    bar.addEventListener("click",function(e){
      var b=e.target.closest("button");if(!b||b.getAttribute("aria-pressed")==="true")return;
      var mo=b.dataset.v==="mo";
      bar.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});
      paraOff();
      var els=[].slice.call(document.querySelectorAll(".fw,.fw-m"));
      var move=hasGsap&&window.Flip&&!still.matches,st=move?Flip.getState(els):null;
      gridA.classList.toggle("mo",mo);gridB.classList.toggle("mo",mo);
      if(!move){if(hasGsap)ScrollTrigger.refresh();return;}
      Flip.from(st,{duration:.8,ease:"power3.inOut",nested:true,stagger:.02,onComplete:function(){gsap.set(els,{clearProps:"all"});ScrollTrigger.refresh();paraOn();ScrollTrigger.refresh();}});
    });
  })();
  // "לפרויקט": עיגול ליים שרודף את העכבר מעל העבודות
  (function(){
    if(!hasGsap||!fine.matches||still.matches)return;
    doc.classList.add("pc-on");
    var pc=document.getElementById("pc"),on=false,qx=gsap.quickTo(pc,"x",{duration:.35,ease:"power3.out"}),qy=gsap.quickTo(pc,"y",{duration:.35,ease:"power3.out"});
    gsap.set(pc,{scale:.3});
    function show(v){pc.classList.toggle("on",v);gsap.to(pc,{scale:v?1:.3,duration:.35,ease:"power3.out",overwrite:"auto"});}
    function move(e){
      var b=e.target.closest&&e.target.closest(".fw-b");
      if(b&&!on){on=true;gsap.set(pc,{x:e.clientX,y:e.clientY});show(true);}
      else if(!b&&on){on=false;show(false);}
      if(on){qx(e.clientX);qy(e.clientY);}
    }
    [gridA,gridB].forEach(function(g){g.addEventListener("pointermove",move);g.addEventListener("pointerleave",function(){on=false;show(false);});});
    addEventListener("scroll",function(){if(on&&!document.querySelector(".fw-b:hover")){on=false;show(false);}},{passive:true});
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

  /* ================= תג מסתובב (MV:g83): חוזר לשולחן ================= */
  (function(){
    var badge=document.getElementById("badge"),ring=badge.querySelector(".badge-ring");
    var TXT="כל "+W.length+" העבודות על השולחן · ";
    function lay(){
      var fs=parseFloat(getComputedStyle(ring).fontSize)||14,ls=fs*.04;
      var cv=document.createElement("canvas").getContext("2d");cv.font="700 "+fs+"px 'Polin', sans-serif";
      var ch=Array.from(TXT),wd=ch.map(function(c){return cv.measureText(c).width+ls;});
      var tot=wd.reduce(function(a,b){return a+b;},0),acc=0;
      ring.innerHTML=ch.map(function(c,i){
        var a=-(acc+wd[i]/2)/tot*360;acc+=wd[i];
        return '<span style="transform:translateX(-50%) rotate('+a.toFixed(2)+'deg)">'+(c===" "?"&nbsp;":c)+'</span>';
      }).join("");
    }
    lay();if(document.fonts)document.fonts.ready.then(lay);
    if(!hasGsap)return;
    // הסיבוב הקבוע רץ בדפדפן (Web Animations) ולא ב-tween, כדי שהעמוד במנוחה לא יכתוב לתג 60 פעם בשנייה. הגלילה והריחוף משנים רק את המהירות
    if(!ring.animate)return;
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

  /* ================= העדשה הקטנה שרודפת את העכבר (MV:g43) ================= */
  var peek=document.getElementById("peek"),pkView=peek.querySelector(".pk-view"),pkCap=peek.querySelector("figcaption");
  var Peek=(function(){
    var imgs={},curSrc=null,on=false,raf=0,tx=0,ty=0,x=0,y=0,jumpNext=true,cyc=0,owner=null;
    function img(src){
      if(imgs[src])return imgs[src];
      var im=document.createElement("img");im.alt="";im.decoding="async";im.src=src;pkView.appendChild(im);imgs[src]=im;return im;
    }
    function shot(w){
      var src=thumb(w);if(src===curSrc)return;
      var nx=img(src);
      for(var k in imgs)imgs[k].classList.toggle("on",imgs[k]===nx);
      pkCap.textContent=w.client_he+" · "+w.title_he;curSrc=src;
    }
    function loop(){
      var k=still.matches?1:.16;
      x+=(tx-x)*k;y+=(ty-y)*k;
      peek.style.transform="translate3d("+x.toFixed(1)+"px,"+y.toFixed(1)+"px,0)";
      raf=(on||Math.abs(tx-x)>.4||Math.abs(ty-y)>.4)?requestAnimationFrame(loop):0;
    }
    function target(mx,my,nameEl){
      var Wd=peek.offsetWidth,H=peek.offsetHeight,g=48;
      var nl=nameEl?nameEl.getBoundingClientRect().left:mx;
      var px=Math.min(mx,nl)-Wd-g;if(px<16)px=mx+g;
      tx=Math.max(16,Math.min(innerWidth-Wd-16,px));
      ty=Math.max(16,Math.min(innerHeight-H-56,my-H/2));
      if(jumpNext){x=tx;y=ty;jumpNext=false;}
      if(!raf)raf=requestAnimationFrame(loop);
    }
    function show(list,who){
      if(owner===who&&on)return;
      owner=who;clearInterval(cyc);
      var i=0;shot(list[0]);if(list[1])img(thumb(list[1]));
      if(list.length>1&&!still.matches)cyc=setInterval(function(){i=(i+1)%list.length;shot(list[i]);img(thumb(list[(i+1)%list.length]));},1100);
      if(!on){on=true;peek.classList.add("on");}
    }
    function hide(){on=false;owner=null;clearInterval(cyc);peek.classList.remove("on");jumpNext=true;}
    return {show:show,target:target,hide:hide,isOn:function(){return on;}};
  })();
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

  /* ================= שלוש מחלקות: אינדקס ענק, ולחיצה מושכת את המחלקה לשולחן ================= */
  (function(){
    if(!C)return;
    var dpx=document.getElementById("dpx"),KEYS=["branding","web","digital"];
    var lists={};KEYS.forEach(function(k){lists[k]=W.filter(function(w){return w.quality!=="poor"&&w.departments.indexOf(k)>-1;}).slice(0,8);});
    dpx.innerHTML=KEYS.map(function(k,i){var d=C.depts[k];
      return '<li><a class="dpr" href="?d='+k+'#top" data-d="'+k+'" data-pull="'+k+'">'+
        '<span class="nm-w"><span class="no" aria-hidden="true">0'+(i+1)+'</span><span class="nm">'+d.name+'</span></span>'+
        '<span class="mt"><span class="ln">'+d.line+'</span><span class="sv">'+d.services.join(" · ")+'</span>'+
          '<span class="go">לעבודות ה'+d.short+' על השולחן'+ARR+'</span></span>'+
        '<span class="th" aria-hidden="true">'+lists[k].slice(0,3).map(function(w){return '<img data-src="'+thumb(w)+'" alt="" loading="lazy" decoding="async">';}).join("")+'</span>'+
      '</a></li>';}).join("");
    // התמונות הקטנות מוצגות רק במגע (שם אין עדשה רודפת), ולכן יורדות רק שם
    var touch=matchMedia("(hover:none),(pointer:coarse)");
    function thFill(){if(touch.matches)dpx.querySelectorAll(".th img[data-src]").forEach(function(im){im.src=im.dataset.src;im.removeAttribute("data-src");});}
    thFill();if(touch.addEventListener)touch.addEventListener("change",thFill);
    function setCur(row){
      dpx.querySelectorAll(".dpr.cur").forEach(function(r){if(r!==row)r.classList.remove("cur");});
      if(row)row.classList.add("cur");dpx.classList.toggle("is-on",!!row);
    }
    peekList(dpx,".dpr",".nm",function(row){return lists[row.dataset.d];},setCur);
  })();

  /* ================= ציטוט: המילים נדלקות, ומאחור שלוש שורות עבודות שנעות לצדדים ================= */
  (function(){
    var bg=document.getElementById("qt-bg"),p=document.getElementById("qt-p"),sec=document.getElementById("quote");
    var pool=W.filter(function(w){return w.quality!=="poor";});
    var rows=[0,1,2].map(function(k){
      var row=document.createElement("div");row.className="qt-row";row.style.alignSelf="center";
      var html="";for(var i=0;i<14;i++){var w=pool[(k*14+i*3+k)%pool.length];html+='<img src="'+thumb(w)+'" alt="" width="'+w.w+'" height="'+w.h+'" loading="lazy" decoding="async">';}
      bg.appendChild(row);
      // השורה האמצעית מוסתרת בטלפון: התמונות שלה נכנסות רק כשהיא מוצגת, ולא יורדות לחינם
      function fill(){if(!row.childElementCount&&getComputedStyle(row).display!=="none")row.innerHTML=html;}
      fill();if(!row.childElementCount)addEventListener("resize",fill,{passive:true});
      return row;
    });
    // המילים: כל מילה מקבלת עוצמה משלה, ונדלקת בתורה
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

  /* ================= אזורים כהים: כשמגיעים למחלקות ולפוטר, כל העמוד עובר לשחור רך ================= */
  var darkN=0,themeMeta=document.querySelector('meta[name="theme-color"]');
  function setDark(on){
    doc.classList.toggle("is-dark",on);
    if(themeMeta)themeMeta.setAttribute("content",on?getComputedStyle(doc).getPropertyValue("--dark").trim()||"#19181C":"#FEFDFA");
  }
  function darkZone(el){
    if(!hasGsap)return;
    ScrollTrigger.create({trigger:el,start:"top 55%",end:"bottom 45%",onToggle:function(s){darkN=Math.max(0,darkN+(s.isActive?1:-1));setDark(darkN>0);}});
  }
  darkZone(document.querySelector(".dz"));

  /* ================= לקוחות: קיר לוגואים חיוור, והעדשה מהלוגו נוסעת עליו ומגדילה (MV:g101) ================= */
  var byClient={},order=[];
  W.forEach(function(w){
    var c=byClient[w.client_he];
    if(!c){c=byClient[w.client_he]={name:w.client_he,works:[],deps:{},pub:false};order.push(c);}
    c.works.push(w);if(w.public_body)c.pub=true;
    (w.departments||[]).forEach(function(d){c.deps[d]=1;});
  });
  order.sort(function(a,b){return (b.pub?1:0)-(a.pub?1:0)||b.works.length-a.works.length;});
  function depsTxt(c){var d=["branding","web","digital"].filter(function(k){return c.deps[k];});return d.length===3?"כל המחלקות":d.map(function(k){return DEPTS[k];}).join(" + ");}
  (function(){
    // שש תחנות של העדשה, בזיגזג על הקיר: שורה, עמודה (מימין), רוחב. 44 שמות + 4 כפולים = שש שורות מלאות של 8.
    // בטלפון (3 עמודות) חמש הראשונות לכל הרוחב, כדי שגם שם השורה האחרונה תהיה מלאה
    var STOPS=[["משרד האוצר",1,1,2],["פלג הגליל",2,6,2],["המכללה האזורית צפת",3,2,2],["החברה לפיתוח קצרין",4,6,2],["עיריית צפת, מחלקת הנוער",5,1,1],["אלדו, רשת גלידריות",6,5,1]];
    var big=STOPS.map(function(s){return byClient[s[0]];}).filter(Boolean);
    var rest=order.filter(function(c){return big.indexOf(c)<0;});
    // בטלפון אין מיקום קבוע, ולכן הגדולים פזורים בין השאר
    var seq=[];rest.forEach(function(c,i){if(i%6===0&&big[i/6])seq.push(big[i/6]);seq.push(c);});
    big.forEach(function(c){if(seq.indexOf(c)<0)seq.push(c);});
    var ct=document.getElementById("ctab");
    ct.innerHTML=seq.map(function(c,i){
      var s=STOPS.filter(function(x){return x[0]===c.name;})[0],si=STOPS.indexOf(s);
      var st=s?' style="grid-row:'+s[1]+';grid-column:'+s[2]+' / span '+s[3]+'"':'';
      var cl=s?(s[3]>1?'big':'')+(si<5?' mb':''):'';
      return '<li'+(cl?' class="'+cl.trim()+'"':'')+st+'><button class="lg'+(/^[A-Za-z]/.test(c.name)?' lat':'')+'" type="button" data-k="'+order.indexOf(c)+'" aria-haspopup="dialog">'+
        '<span class="lg-m m'+(i%7)+'" aria-hidden="true"></span><span class="lg-n">'+c.name+'</span></button></li>';
    }).join("");
    ct.addEventListener("click",function(e){
      var b=e.target.closest(".lg");if(!b)return;
      var c=order[+b.dataset.k];lb.open(c.works.map(lbItem),0,b);
    });

    var root=document.getElementById("xw"),pin=root.querySelector(".xw-pin"),fig=document.getElementById("xw-fig");
    var ink=document.getElementById("xw-ink"),lens=document.getElementById("xw-lens"),view=document.getElementById("xw-view"),tag=document.getElementById("xw-tag");
    var copy='<ul class="lgw">'+ct.innerHTML.replace(/<button class="([^"]*)"[^>]*>/g,'<span class="$1">').replace(/<\/button>/g,'</span>')+'</ul>';
    ink.innerHTML=copy;view.innerHTML=copy;
    var zoom=view.firstChild,lis=[].slice.call(ct.children),Z=1.8,D=0,curI=-1;
    function setCur(i){
      if(i===curI)return;curI=i;
      var c=order[+lis[i].firstChild.dataset.k];
      tag.innerHTML='<b>'+c.name+'</b><span>'+depsTxt(c)+(c.pub?' · גוף ציבורי':'')+'</span>';
    }
    if(!hasGsap)return;
    gsap.matchMedia().add({ok:"(prefers-reduced-motion: no-preference)",wide:"(min-width:768px)"},function(cx){
      if(!cx.conditions.ok)return;
      root.classList.add("mv-on");
      var o={x:0,y:0},pts=[],cs=[];
      // מרכז כל שם ביחס לקיר עצמו (לא לדף), ולכן נכון גם כשהסקשן נעוץ
      var F0={x:0,y:0};
      function center(li){var a=li.firstChild.getBoundingClientRect();return {x:a.left-F0.x+a.width/2,y:a.top-F0.y+a.height/2};}
      // העדשה לא יוצאת מהמסך: בטלפון שם בעמודה הקיצונית מקבל את העדשה קצת פנימה
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
        pts=big.map(function(c){return cs[seq.indexOf(c)];});
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
    // המספר נספר כשהסקשן נכנס
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

  /* ================= צור קשר: שלוש דרכים, בלי מייל ================= */
  (function(){
    var call=document.getElementById("w-call"),callM=document.getElementById("w-call-m"),open=false;
    call.href=SALES_TEL;callM.setAttribute("aria-live","polite");
    // במחשב הלחיצה הראשונה מראה את המספר, והשנייה מחייגת. בטלפון מחייגים מיד
    call.addEventListener("click",function(e){
      if(!fine.matches||open)return;
      e.preventDefault();open=true;
      var t=call.querySelector(".way-t");t.textContent=SALES;t.dir="ltr";
      callM.innerHTML='מנהל המכירות. לחיצה נוספת מחייגת';
    });
    document.getElementById("w-wa").href=WA;
    var root=document.getElementById("cf-g");
    contactForm(root,{btn:"btn btn-ink"});
    // טופס קצר: שם, טלפון ומה רוצים. הפנייה נשלחת עם נושא קבוע, כדי שבמשרד יזהו אותה מיד
    ["email","org"].forEach(function(k){var i=root.querySelector("[data-v="+k+"]");if(i)i.closest(".cf-f").remove();});
    var need=root.querySelector(".cf-need");if(need)need.remove();
    var form=root.querySelector("form"),nm=root.querySelector("[data-v=name]"),subj=document.createElement("input");
    subj.type="hidden";subj.name="subject";form.appendChild(subj);
    function setSubj(){var n=nm.value.trim();subj.value="פנייה חדשה מהאתר של Visual"+(n?" מאת "+n:"");}
    nm.addEventListener("input",setSubj);setSubj();
    var msg=root.querySelector("textarea");if(msg){var lab=root.querySelector('label[for="'+msg.id+'"]');if(lab)lab.firstChild.textContent="על מה תרצו לדבר? ";}
  })();

  /* ================= פוטר: עמודות, רשתות, וחזרה לעבודות בסוף הגלילה ================= */
  (function(){
    var d=C?C.depts:{branding:{name:DEPTS.branding},web:{name:DEPTS.web},digital:{name:DEPTS.digital}};
    function col(h,items){return '<div><h3>'+h+'</h3><ul>'+items.map(function(x){return '<li>'+x+'</li>';}).join("")+'</ul></div>';}
    document.getElementById("ft-cols").innerHTML=
      col("האתר",['<a href="#work">עבודות</a>','<a href="#depts">מחלקות</a>','<a href="#clients">לקוחות</a>','<a href="#wall">מה מספרים עלינו</a>','<a href="#contact">צור קשר</a>'])+
      col("מחלקות",["branding","web","digital"].map(function(k){return '<a href="?d='+k+'#top" data-pull="'+k+'">'+d[k].name+'</a>';}))+
      col("דברו איתנו",[(C?'<a href="'+C.contact.telHref+'"><span dir="ltr">'+C.contact.tel+'</span></a>':''),'<a href="'+WA+'" target="_blank" rel="noopener">וואטסאפ</a>']);
    if(C)document.getElementById("ft-soc").innerHTML=
      '<li><a href="'+C.contact.facebook+'" target="_blank" rel="noopener" aria-label="פייסבוק">'+SOC.fb+'</a></li>'+
      '<li><a href="'+C.contact.pinterest+'" target="_blank" rel="noopener" aria-label="פינטרסט">'+SOC.pin+'</a></li>'+
      '<li><a href="'+WA+'" target="_blank" rel="noopener" aria-label="וואטסאפ">'+IC.wa+'</a></li>';
  })();
  darkZone(document.getElementById("ft"));
  // הלולאה: הטבעת מתמלאת בגלילה, ובסוף מסך מתחלף ומחזיר לעבודות הנבחרות
  (function(){
    if(!hasGsap)return;
    var fg=document.getElementById("loop-fg"),wipe=document.getElementById("wipe"),busy=false,L=339.3;
    function back(){
      busy=true;stopGlide();
      gsap.timeline({onComplete:function(){busy=false;}})
        .set(wipe,{visibility:"visible",y:0,yPercent:101})
        .to(wipe,{yPercent:0,duration:.55,ease:"power3.in"})
        .add(function(){var t=document.getElementById("work");scrollTo(0,t.getBoundingClientRect().top+scrollY);ScrollTrigger.update();})
        .to(wipe,{yPercent:-101,duration:.75,ease:"power3.out"},"+=.08")
        .set(wipe,{visibility:"hidden",yPercent:101});
    }
    ScrollTrigger.create({trigger:"#loop",start:"center bottom",end:"bottom bottom",onUpdate:function(s){
      fg.style.strokeDashoffset=(L*(1-s.progress)).toFixed(1);
      if(s.progress>.995&&s.direction>0&&!busy&&!still.matches)back();
    },onLeaveBack:function(){fg.style.strokeDashoffset=L;}});
  })();

  /* ================= בורר הרקע הכהה: להשוואה בפגישה, מופיע רק כשהרקע כהה ================= */
  (function(){
    var box=document.getElementById("bgp"),BG=[["","שחור רך","#19181C"],["night","כחול לילה","#131A30"],["olive","זית","#1B2013"],["plum","שזיף","#221B26"]];
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
      if(doc.classList.contains("is-dark"))setDark(true);
    });
  })();

  /* ================= מילים בליים בכותרות: האותיות קופצות פנימה, ומרקר ליים נמרח מתחתן ================= */
  (function(){
    var ws=[].slice.call(document.querySelectorAll(".lw"));
    if(!hasGsap||still.matches||!ws.length)return;
    ws.forEach(function(w){
      var txt=w.textContent,vis=document.createElement("span"),sr=document.createElement("span");
      sr.className="sr";sr.textContent=txt;vis.setAttribute("aria-hidden","true");
      txt.split(/([\s ]+)/).forEach(function(part){
        if(!part)return;
        if(/^[\s ]+$/.test(part)){vis.appendChild(document.createTextNode(part));return;}
        var wd=document.createElement("span");wd.className="lw-w";
        Array.from(part).forEach(function(ch){var c=document.createElement("span");c.className="lw-c";c.textContent=ch;wd.appendChild(c);});
        vis.appendChild(wd);
      });
      w.textContent="";w.appendChild(sr);w.appendChild(vis);
    });
    // נדלק כשהמילה נראית (IntersectionObserver ולא ScrollTrigger): הכותרת סביבה עוד עולה בכניסה, וטריגר שנמדד עליה היה זז
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)",function(){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);e.target._lw.play();}});},{rootMargin:"0px 0px -16% 0px"});
      ws.forEach(function(w){
        var cs=w.querySelectorAll(".lw-c");
        gsap.set(w,{"--fill":0});
        var tl=gsap.timeline({paused:true})
          .from(cs,{yPercent:70,rotate:-10,opacity:0,duration:.6,ease:"back.out(2.4)",stagger:.04})
          .to(w,{"--fill":1,duration:.75,ease:"expo.inOut"},"-=.4");
        if(w.closest(".tb"))afterPl(function(){gsap.delayedCall(1.2,function(){tl.play();});});
        else{w._lw=tl;io.observe(w);}
      });
      return function(){io.disconnect();gsap.set(ws,{clearProps:"--fill"});};
    });
  })();

  /* ================= הפעלה: הפונטים משנים גבהים, ולכן מודדים אחריהם ================= */
  function start(){
    initTable();
    paraOn();
    if(hasGsap)ScrollTrigger.refresh();
  }
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(start);else addEventListener("load",start);
  rv(document);doc.classList.add("rv-ok");
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
