/* סקיצה ו · "השולחן"
   השולחן: כל העבודות על משטח אינסופי שגוררים ביד עם תנופה (MV:g06, Draggable + Inertia), ונסחף לאט לבד.
   בורר המחלקות מושך את העבודות של המחלקה למרכז (ברוח MV:g23), והשאר נסוגות ומתעמעמות.
   העבודות: גריד מפוזר שמתכנס בגלילה (MV:g54) עם סינון לפי מחלקה ותחום (MV:b34). תווית סמן MV:g76. */
(function(){
  "use strict";
  var doc=document.documentElement;
  var still=matchMedia("(prefers-reduced-motion: reduce)");
  var fine=matchMedia("(hover:hover) and (pointer:fine)");
  var hasGsap=!!(window.gsap&&window.ScrollTrigger);
  var hasDrag=hasGsap&&!!window.Draggable;
  if(hasGsap){gsap.registerPlugin(ScrollTrigger);if(window.Flip)gsap.registerPlugin(Flip);if(hasDrag)gsap.registerPlugin(Draggable,window.InertiaPlugin);}
  var C=CONTENT.contact;
  var lb=lightbox();
  document.querySelector("dialog.lb").setAttribute("aria-label","עבודה מתיק העבודות");

  /* העבודות הטובות קודם, ובתוכן הציבוריות (כמו ב-ה) */
  var W=WORKS.slice().sort(function(a,b){
    var q={good:0,ok:1,poor:2};
    return (q[a.quality]!=null?q[a.quality]:1)-(q[b.quality]!=null?q[b.quality]:1)||(b.public_body===true)-(a.public_body===true);
  });
  function file(w){return w.src.split("/").pop();}
  function thumb(w){return "img/t/"+file(w);}
  function deps(w){return w.departments.length===3?"כל המחלקות":w.departments.map(function(d){return DEPTS_SHORT[d];}).join(" · ");}
  function lbItem(w){return {full:w.src,fw:w.w,fh:w.h,alt:w.alt_he,cap:w.client_he+" · "+w.title_he};}
  var LB=W.map(lbItem);

  /* ================= הדר ================= */
  headroom(document.getElementById("hd"));

  /* ================= גלילה רכה לעוגנים (כמו ב-ה) ================= */
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
    scrollToY(id==="top"?0:t.getBoundingClientRect().top+scrollY);
    if(history.pushState)history.pushState(null,"","#"+id);
    if(!/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(t.tagName)&&!t.hasAttribute("tabindex"))t.setAttribute("tabindex","-1");
    t.focus({preventScroll:true});
  });

  /* ================= השולחן ================= */
  var tb=document.querySelector(".tb"),stage=document.getElementById("tb"),layer=document.getElementById("tb-layer");
  var pullBar=document.getElementById("pull"),pullStatus=document.getElementById("pull-status");
  var tiles=[],cells=[],cell=0,Wb=1,Hb=1,vw=0,vh=0,wrapX,wrapY;
  var ox=0,oy=0;            // ההזזה של היד (Draggable על proxy)
  var dx=0,dy=0;            // הסחיפה העצמית
  var driftK=0,driftTw=null,idleT=0,visible=true,cur="all";

  // אקראי קבוע: אותו פיזור בכל טעינה
  function rng(s){return function(){s=s*16807%2147483647;return (s-1)/2147483646;};}
  function mod(a,n){return ((a%n)+n)%n;}

  // סדר העבודות על השולחן: מעורבב, כדי ששלוש המחלקות יהיו פזורות בכל מקום
  var deck=(function(){var r=rng(11),a=W.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;})();

  function build(){
    vw=stage.clientWidth;vh=stage.clientHeight;
    var mob=vw<768;
    cell=mob?Math.round(Math.max(124,vw*.34)):Math.round(Math.min(300,Math.max(188,vw*.148)));
    var cols=Math.max(5,Math.round(Math.max(vw*1.6,vw+cell*3)/cell)),rows=Math.max(5,Math.round(Math.max(vh*1.5,vh+cell*3)/cell));
    Wb=cols*cell;Hb=rows*cell;
    wrapX=gsap.utils.wrap(-cell,Wb-cell);wrapY=gsap.utils.wrap(-cell,Hb-cell);
    cells=[];for(var y=0;y<rows;y++)for(var x=0;x<cols;x++)cells.push({x:x*cell,y:y*cell});
    // מעט תאים ריקים: שולחן מלא אבל פזור, לא גריד
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
    render();
  }
  function render(){
    var X=ox+dx,Y=oy+dy;
    for(var i=0;i<tiles.length;i++){
      var t=tiles[i],x=wrapX(t.bx+X)+t.ix,y=wrapY(t.by+Y)+t.iy;
      t.el.style.transform="translate3d("+x.toFixed(1)+"px,"+y.toFixed(1)+"px,0)"+(t.rot?" rotate("+t.rot.toFixed(2)+"deg)":"")+(t.s!==1?" scale("+t.s.toFixed(3)+")":"");
    }
  }

  /* משיכה למרכז: העבודות של המחלקה תופסות את התאים הקרובים למרכז המבט, והשאר מתפזרות החוצה ומתעמעמות */
  function place(d,animate){
    var X=ox+dx,Y=oy+dy,cx=mod(vw/2-X,Wb),cy=mod(vh*.42-Y,Hb);
    function dist(c){var ddx=Math.abs(c.x+cell/2-cx),ddy=Math.abs(c.y+cell/2-cy);ddx=Math.min(ddx,Wb-ddx);ddy=Math.min(ddy,Hb-ddy);return ddx*ddx+ddy*ddy*1.6;}
    var order;
    if(d==="all"){order=null;}
    else{order=cells.map(function(c,i){return i;}).sort(function(a,b){return dist(cells[a])-dist(cells[b]);});}
    var inn=tiles.filter(function(t){return d==="all"||t.w.departments.indexOf(d)>-1;});
    var out=tiles.filter(function(t){return inn.indexOf(t)<0;});
    // הקרובים למרכז קודם, כדי שהעבודות שכבר במבט לא יקפצו רחוק
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
      if(animate&&hasGsap&&!still.matches){
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

  // בורר המחלקות: ספירה של עבודות ייחודיות, לא של אריחים
  var count={all:W.length};W.forEach(function(w){w.departments.forEach(function(d){count[d]=(count[d]||0)+1;});});
  var startD=new URLSearchParams(location.search).get("d");if(!DEPTS[startD])startD="all";
  pullBar.innerHTML=[["all","הכול"],["branding",DEPTS.branding],["web",DEPTS.web],["digital",DEPTS.digital]].map(function(p){
    return '<button type="button" data-v="'+p[0]+'" aria-pressed="'+(p[0]===startD)+'">'+p[1]+' <small>'+count[p[0]]+'</small></button>';
  }).join("");
    function pull(d,fromUser){
    if(d===cur&&fromUser)return;
    cur=d;
    pullBar.querySelectorAll("button").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.v===d));});
    if(tiles.length)place(d,fromUser);
    if(fromUser){
      pullStatus.textContent=d==="all"?"כל "+W.length+" העבודות על השולחן":"עבודות "+DEPTS[d]+" במרכז השולחן: "+count[d]+" עבודות";
      pause(5200);
      if(grid)filt.set(d);   // גם הגריד שמתחת מסונן לאותה מחלקה
    }
  }
  pullBar.addEventListener("click",function(e){var b=e.target.closest("button");if(b)pull(b.dataset.v,true);});

  /* סחיפה עצמית: נעצרת כשנוגעים, וחוזרת אחרי כמה שניות בלי מגע */
  function pause(ms){
    if(driftTw){driftTw.kill();driftTw=null;}
    driftK=0;clearTimeout(idleT);
    if(!hasGsap||still.matches)return;
    idleT=setTimeout(function(){var o={k:0};driftTw=gsap.to(o,{k:1,duration:1.6,ease:"sine.inOut",onUpdate:function(){driftK=o.k;}});},ms||2600);
  }

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
    if(!hasGsap){return;}
    build();
    tb.classList.add("live");
    var vis=new IntersectionObserver(function(es){visible=es[0].isIntersecting;});vis.observe(tb);

    if(hasDrag){
      drag=Draggable.create(proxy,{type:fine.matches?"x,y":"x",trigger:stage,inertia:!still.matches,minimumMovement:5,allowContextMenu:true,
        onPress:function(){pause(1e9);dragging=false;},
        onDragStart:function(){dragging=true;tb.classList.add("grabbing");curEl.classList.add("drag");setHot(null);},
        onDrag:function(){ox=this.x;oy=this.y;},
        onThrowUpdate:function(){ox=this.x;oy=this.y;},
        onRelease:function(){tb.classList.remove("grabbing");curEl.classList.remove("drag");dragging=false;if(!this.isThrowing)pause();},
        onThrowComplete:function(){pause();},
        onClick:function(e){var t=e.target&&e.target.closest&&e.target.closest(".tb-t");if(t){var i=W.indexOf(t._t.w);lb.open(LB,i,stage);}}
      })[0];
    }
    // חיצים במקלדת כשהשולחן בפוקוס
    stage.addEventListener("keydown",function(e){
      var m={ArrowLeft:[1,0],ArrowRight:[-1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!m)return;
      e.preventDefault();pause();
      var tx=ox+m[0]*cell*1.2,ty=oy+m[1]*cell*1.2;
      gsap.to(proxy,{x:tx,y:ty,duration:still.matches?0:.6,ease:"power3.out",onUpdate:function(){ox=gsap.getProperty(proxy,"x");oy=gsap.getProperty(proxy,"y");},onComplete:function(){if(drag)drag.update();}});
    });

    // הסמן המותאם: רק עם עכבר מדויק ובלי הפחתת תנועה, כמו במאגר
    if(fine.matches&&!still.matches){
      tb.classList.add("cur-on");curEl.classList.add("on");
      qx=gsap.quickTo(curEl,"x",{duration:.22,ease:"power3.out"});qy=gsap.quickTo(curEl,"y",{duration:.22,ease:"power3.out"});
      stage.addEventListener("pointermove",function(e){px=e.clientX;py=e.clientY;qx(px);qy(py);if(!inside){inside=true;gsap.set(curEl,{x:px,y:py});gsap.to(curEl,{opacity:1,duration:.25});curEl.classList.add("has-t");}});
      stage.addEventListener("pointerleave",function(){inside=false;setHot(null);gsap.to(curEl,{opacity:0,duration:.2});curEl.classList.remove("has-t");});
      addEventListener("scroll",function(){if(inside){var r=stage.getBoundingClientRect();if(py<r.top||py>r.bottom){inside=false;setHot(null);gsap.to(curEl,{opacity:0,duration:.2});}}},{passive:true});
      setHot(null);
    }

    var last=0,frame=0;
    gsap.ticker.add(function(time){
      var dt=last?Math.min(.05,time-last):0;last=time;
      if(!visible||document.hidden)return;
      if(driftK>0){dx-=22*driftK*dt;dy-=9*driftK*dt;}
      render();
      if(inside&&(++frame%3===0))hit();
    });

    // פתיחה: העבודות מחולקות על השולחן מנקודה אחת, הקרובות קודם, ואז הטקסט עולה
    if(doc.classList.contains("tb-intro")){
      var cx=vw/2,cy=vh*.45;
      tiles.forEach(function(t){
        var x=wrapX(t.bx),y=wrapY(t.by),ddx=cx-(x+t.tw/2),ddy=cy-(y+t.th/2),d=Math.sqrt(ddx*ddx+ddy*ddy);
        t.ix=ddx;t.iy=ddy;t.s=.35;t.rot=(Math.random()-.5)*36;t.el.style.opacity="0";
        var delay=.15+Math.min(.9,d/Math.max(vw,vh)*.9);
        gsap.to(t,{ix:0,iy:0,s:1,rot:0,duration:1.25,delay:delay,ease:"expo.out"});
        gsap.to(t.el,{opacity:1,duration:.35,delay:delay,ease:"none"});
      });
      setTimeout(function(){doc.classList.add("tb-go");},700);
      pause(2400);
    }else{pause(1200);}
    if(startD!=="all")pull(startD,false);

    // שינוי גודל: בונים מחדש רק כשהרוחב משתנה או כשהגובה קופץ באמת (לא פס הכתובת בטלפון)
    var rt=0,lw=vw,lh=vh;
    addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(function(){
      var w=stage.clientWidth,h=stage.clientHeight;if(w===lw&&Math.abs(h-lh)<140)return;lw=w;lh=h;
      tiles.forEach(function(t){gsap.killTweensOf(t);});build();
    },200);});
  }

  /* ================= העבודות: סינון (MV:b34) וגריד שמתכנס (MV:g54) ================= */
  var grid=document.getElementById("cv"),moreBtn=document.getElementById("cv-more"),empty=document.getElementById("cv-empty");
  var countEl=document.getElementById("f-count"),fStatus=document.getElementById("f-status");
  var LIMIT=12;
  var items=W.map(function(w,i){
    var li=document.createElement("li");li.className="cv-i";
    li.dataset.d=w.departments.join(" ");li.dataset.f=w.field_he||"";li._i=i;
    li.innerHTML='<button type="button" class="cv-b"><span class="cv-m"><img src="'+thumb(w)+'" srcset="'+thumb(w)+' 560w, '+w.src+' '+w.w+'w" sizes="(max-width:767px) 50vw, (max-width:1100px) 33vw, 25vw" alt="'+w.alt_he+'" width="'+w.w+'" height="'+w.h+'" loading="lazy" decoding="async"></span>'+
      '<span class="cv-c"><b>'+w.client_he+'</b><span>'+w.title_he+'</span><span class="cv-tags">'+w.departments.map(function(d){return "<i>"+DEPTS[d]+"</i>";}).join("")+'</span></span></button>';
    grid.appendChild(li);return li;
  });
  var filt=(function(){
    var q=new URLSearchParams(location.search),cd=DEPTS[q.get("d")]?q.get("d"):"all",cf=q.get("f")||"all",more=false;
    var dBar=document.getElementById("f-dept"),fBar=document.getElementById("f-field");
    var fields={};W.forEach(function(w){if(w.field_he)fields[w.field_he]=(fields[w.field_he]||0)+1;});
    var fl=Object.keys(fields).filter(function(f){return fields[f]>1;}).sort(function(a,b){return fields[b]-fields[a];});
    if(fl.indexOf(cf)<0)cf="all";
    function chip(v,label,n,on){return '<button type="button" class="fb" data-v="'+v+'" aria-pressed="'+on+'">'+label+(n!=null?" <small>"+n+"</small>":"")+'</button>';}
    dBar.innerHTML=chip("all","הכול",W.length,cd==="all")+["branding","web","digital"].map(function(d){return chip(d,DEPTS[d],count[d],cd===d);}).join("");
    fBar.innerHTML=chip("all","כל התחומים",null,cf==="all")+fl.map(function(f){return chip(f,f,null,cf===f);}).join("");
    function match(it){return (cd==="all"||it.dataset.d.split(" ").indexOf(cd)>-1)&&(cf==="all"||it.dataset.f===cf);}
    function limited(){return !more&&cd==="all"&&cf==="all";}
    function shows(it){return match(it)&&(!limited()||it._i<LIMIT);}
    function press(bar,v){bar.querySelectorAll("button").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.v===v));});}
    function url(){
      var p=new URLSearchParams(location.search);
      if(cd==="all")p.delete("d");else p.set("d",cd);
      if(cf==="all")p.delete("f");else p.set("f",cf);
      history.replaceState(null,"",location.pathname+(p.toString()?"?"+p:"")+location.hash);
    }
    function apply(animate){
      var move=animate&&hasGsap&&window.Flip&&!still.matches;
      if(animate)settle();
      var state=move?Flip.getState(items,{props:"opacity"}):null;
      var h0=grid.getBoundingClientRect().height,n=0,tot=items.filter(match).length;
      items.forEach(function(it){var v=shows(it);it.classList.toggle("hide",!v);if(v)n++;});
      countEl.innerHTML="<b>"+n+"</b> מתוך "+(limited()?W.length:tot===W.length?W.length:tot)+" עבודות";
      if(animate)fStatus.textContent=n+" עבודות מוצגות";
      empty.hidden=n>0;
      moreBtn.hidden=!limited();moreBtn.textContent="לכל "+W.length+" העבודות";
      if(!move)return;
      var h1=grid.getBoundingClientRect().height;
      gsap.fromTo(grid,{height:h0},{height:h1,duration:.6,ease:"power2.inOut",onComplete:function(){gsap.set(grid,{clearProps:"height"});ScrollTrigger.refresh();}});
      Flip.from(state,{duration:.6,ease:"power2.inOut",scale:true,absolute:true,stagger:.008,
        onEnter:function(els){return gsap.fromTo(els,{opacity:0,scale:.9},{opacity:1,scale:1,duration:.45,stagger:.02});},
        onLeave:function(els){return gsap.to(els,{opacity:0,scale:.9,duration:.25});}});
    }
    function bind(bar,set){bar.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;set(b.dataset.v);press(bar,b.dataset.v);url();apply(true);});}
    bind(dBar,function(v){cd=v;});
    bind(fBar,function(v){cf=v;});
    moreBtn.addEventListener("click",function(){
      more=true;apply(true);
      var b=items[LIMIT]&&items[LIMIT].querySelector("button");if(b)b.focus({preventScroll:true});
    });
    apply(false);
    return {set:function(d){cd=d||"all";cf="all";press(dBar,cd);press(fBar,cf);url();apply(false);if(window.ScrollTrigger)ScrollTrigger.refresh();}};
  })();
  grid.addEventListener("click",function(e){
    var b=e.target.closest(".cv-b");if(!b)return;
    var vis=items.filter(function(it){return !it.classList.contains("hide");}),li=b.parentElement;
    lb.open(vis.map(function(it){return LB[it._i];}),vis.indexOf(li),b);
  });

  /* g54: כל שורה מגיעה מפוזרת מהצדדים ומתיישבת בגריד בקצב הגלילה. אחרי הסינון הראשון הגריד חופשי */
  var conv=[];
  function converge(){
    if(!hasGsap||still.matches)return;
    var vis=items.filter(function(it){return !it.classList.contains("hide");});
    var g=grid.getBoundingClientRect(),cx=g.left+g.width/2,rows={};
    vis.forEach(function(it){var k=Math.round(it.offsetTop);(rows[k]=rows[k]||[]).push(it);});
    Object.keys(rows).forEach(function(k){
      var row=rows[k];
      var tl=gsap.timeline({scrollTrigger:{trigger:row[0],start:"top 100%",end:"top 50%",scrub:.8}});
      row.forEach(function(el){
        var r=el.getBoundingClientRect(),d=(r.left+r.width/2-cx)/g.width;
        tl.fromTo(el,{xPercent:d*190,yPercent:34,scale:.42,rotate:d*22,rotateY:d*-26,opacity:0},
          {xPercent:0,yPercent:0,scale:1,rotate:0,rotateY:0,opacity:1,duration:1,ease:"power2.out"},0);
      });
      conv.push(tl);
    });
  }
  function settle(){
    if(!conv.length)return;
    conv.forEach(function(tl){if(tl.scrollTrigger)tl.scrollTrigger.kill();tl.progress(1).kill();});
    conv=[];gsap.set(items,{clearProps:"transform,opacity"});
  }

  /* ================= סגירה ================= */
  var wa=document.getElementById("ct-wa");wa.href=C.wa;wa.target="_blank";wa.rel="noopener";
  var tel=document.getElementById("ct-tel");tel.href=C.telHref;tel.textContent=C.tel;tel.dir="ltr";
  var ml=document.getElementById("ct-mail");ml.href="mailto:"+C.email;ml.textContent=C.email;ml.dir="ltr";
  var ad=document.getElementById("ct-addr");ad.href=C.waze;ad.textContent=C.address;

  /* ================= הפעלה ================= */
  function start(){
    initTable();
    converge();
    if(hasGsap)ScrollTrigger.refresh();
  }
  // הפונטים משנים גבהים, ולכן מודדים אחריהם
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(start);else addEventListener("load",start);
})();
