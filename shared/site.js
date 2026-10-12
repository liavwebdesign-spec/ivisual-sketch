/* ויזואל · התנהגויות משותפות לשלוש הסקיצות: reveal, headroom (מתוך MV:hd3) ומגירת טלפון (מתוך MV:hd3) */

/* ---------- reveal: נכנס פעם אחת כשהבלוק במסך. rv(el) שוב אחרי שסקריפט מוסיף בלוקים ---------- */
rv(document);
function rv(scope){
  var els=[].slice.call(scope.querySelectorAll("[data-rv]:not(.in)"));
  // מספור בתוך קבוצה: אחים באותו הורה נכנסים בסטאגר של 70ms
  var groups=new Map();
  els.forEach(function(el){var p=el.parentElement,n=groups.get(p)||0;if(!el.style.getPropertyValue("--i"))el.style.setProperty("--i",n);groups.set(p,n+1);});
  if(!document.documentElement.classList.contains("rv-js")||!("IntersectionObserver" in window)){els.forEach(function(el){el.classList.add("in");});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.12,rootMargin:"0px 0px -4% 0px"});
  els.forEach(function(el){io.observe(el);});
}

/* ---------- headroom: יוצא בגלילה למטה, חוזר בתנועה הראשונה למעלה (MV:hd3) ---------- */
function headroom(el,opt){
  opt=opt||{};
  var tol=opt.tol||6,last=0,raf=0;
  function upd(){
    raf=0;
    var y=window.scrollY,d=y-last,top=opt.top!=null?opt.top:el.offsetHeight+24;
    el.classList.toggle("is-scrolled",y>8);
    var hold=el.classList.contains("menu-open")||!!el.querySelector(":focus-visible");
    if(y<=top||hold){el.classList.remove("is-hidden");last=y;return;}
    if(Math.abs(d)<tol)return;
    el.classList.toggle("is-hidden",d>0);
    last=y;
  }
  addEventListener("scroll",function(){if(!raf)raf=requestAnimationFrame(upd);},{passive:true});
  el.addEventListener("focusin",upd);
  last=window.scrollY;upd();
  return upd;
}

/* ---------- מגירת טלפון (MV:hd3, md) ---------- */
function drawer(root,burger){
  var panel=root.querySelector(".md-panel"),scrim=root.querySelector(".md-scrim"),closeBtn=root.querySelector(".md-close");
  var doc=document.documentElement,last=null;
  root.querySelectorAll(".md-item").forEach(function(el,i){el.style.setProperty("--i",i);});
  panel.inert=true;
  function set(open){
    root.classList.toggle("open",open);
    panel.inert=!open;
    if(burger)burger.setAttribute("aria-expanded",String(open));
    doc.style.scrollbarGutter=open?"stable":"";
    doc.style.overflow=open?"hidden":"";
    if(open){last=document.activeElement;setTimeout(function(){closeBtn.focus();},180);}
    else{var to=(last&&last!==document.body)?last:burger;if(to)to.focus({preventScroll:true});}
  }
  if(burger)burger.addEventListener("click",function(){set(!root.classList.contains("open"));});
  closeBtn.addEventListener("click",function(){set(false);});
  scrim.addEventListener("click",function(){set(false);});
  root.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){set(false);});});
  addEventListener("keydown",function(e){
    if(!root.classList.contains("open"))return;
    if(e.key==="Escape"){set(false);return;}
    if(e.key!=="Tab")return;
    var f=[].slice.call(panel.querySelectorAll("a,button")).filter(function(x){return x.offsetParent!==null;});
    var i=f.indexOf(document.activeElement);
    var n=e.shiftKey?(i<=0?f.length-1:i-1):(i===f.length-1?0:i+1);
    e.preventDefault();f[n].focus();
  });
  return set;
}

/* ---------- עזר: מחלקות ---------- */
var DEPTS={branding:"מיתוג ועיצוב",web:"אתרים",digital:"שיווק דיגיטלי"};
var DEPTS_SHORT={branding:"מיתוג",web:"אתר",digital:"שיווק"};

/* ---------- סינון עבודות (רגע החתימה של הקונספט, על בסיס MV:b34) ----------
   לוחצים מחלקה: העבודות שלה באות קדימה, והשאר נסוגות לסוף ומתעמעמות. לא מסתירים: רואים גם נפח וגם מחלקה.
   לכל סינון כתובת משלו (?d=branding&f=תיירות), כך שאפשר לשלוח לרשות קישור ל"כל עבודות התיירות". */
function workFilter(o){
  var items=o.items,grid=o.grid,still=matchMedia("(prefers-reduced-motion: reduce)");
  var anim=!!(window.gsap&&window.Flip);
  var count={all:items.length},fields={};
  items.forEach(function(it){
    it.dataset.d.split(" ").forEach(function(d){count[d]=(count[d]||0)+1;});
    var f=it.dataset.f;if(f)fields[f]=(fields[f]||0)+1;
  });
  var q=new URLSearchParams(location.search),cd=q.get("d")||"all",cf=q.get("f")||"all";
  function chip(cls,val,label,n,on){return '<button type="button" class="'+cls+(on?" on":"")+'" aria-pressed="'+on+'" data-v="'+val+'">'+label+(n!=null?" <small>"+n+"</small>":"")+'</button>';}
  o.deptBar.innerHTML=chip(o.chipClass,"all","הכל",count.all,cd==="all")+
    ["branding","web","digital"].map(function(d){return chip(o.chipClass,d,DEPTS[d],count[d]||0,cd===d);}).join("")+
    (o.countEl?"":'<span class="fcount" aria-hidden="true"></span>');
  var fl=Object.keys(fields).filter(function(f){return fields[f]>1;}).sort(function(a,b){return fields[b]-fields[a];});
  if(o.fieldBar){
    if(fl.length<2)o.fieldBar.remove();
    else o.fieldBar.insertAdjacentHTML("beforeend",chip(o.fieldChipClass,"all","כל התחומים",null,cf==="all")+fl.map(function(f){return chip(o.fieldChipClass,f,f,null,cf===f);}).join(""));
  }
  var countEl=o.countEl||o.deptBar.querySelector(".fcount");
  function match(it){return (cd==="all"||it.dataset.d.split(" ").indexOf(cd)>-1)&&(cf==="all"||it.dataset.f===cf);}
  function apply(animate){
    var move=anim&&animate&&!still.matches;
    var state=move?Flip.getState(items.concat(o.flipExtra||[])):null;
    var inn=items.filter(match),out=items.filter(function(it){return !match(it);});
    // o.tail: אריח קבוע שנשאר אחרון בלוח (למשל אריח פעולה), והעבודות מסתדרות לפניו
    inn.concat(out).forEach(function(it){grid.insertBefore(it,o.tail||null);});
    items.forEach(function(it){it.classList.toggle("is-out",!match(it));});
    var txt=inn.length+" מתוך "+items.length+" עבודות";
    if(countEl)countEl.innerHTML="<b>"+inn.length+"</b> מתוך "+items.length+" עבודות";
    if(o.status&&animate)o.status.textContent=txt;
    if(o.onApply)o.onApply(inn,out);
    if(move)Flip.from(state,{duration:.7,ease:"power3.inOut",stagger:.012});
  }
  function press(bar,v){
    if(!bar)return;
    bar.querySelectorAll("button").forEach(function(x){var on=x.dataset.v===v;x.classList.toggle("on",on);x.setAttribute("aria-pressed",String(on));});
  }
  function url(){
    var p=new URLSearchParams(location.search);
    if(cd==="all")p.delete("d");else p.set("d",cd);
    if(cf==="all")p.delete("f");else p.set("f",cf);
    history.replaceState(null,"",location.pathname+(p.toString()?"?"+p:"")+location.hash);
  }
  function bind(bar,set){
    if(!bar)return;
    bar.addEventListener("click",function(e){
      var b=e.target.closest("button");if(!b)return;
      press(bar,b.dataset.v);set(b.dataset.v);url();apply(true);
    });
  }
  bind(o.deptBar,function(v){cd=v;});
  bind(o.fieldBar,function(v){cf=v;});
  apply(false);
  // מבחוץ (למשל דלת בהירו): בוחרים מחלקה, והתחום חוזר ל"הכל"
  function set(d,animate){
    cd=d||"all";cf="all";press(o.deptBar,cd);press(o.fieldBar,cf);url();apply(animate!==false);
  }
  return {apply:apply,set:set};
}

/* ---------- שנה בפוטר ---------- */
document.querySelectorAll("[data-year]").forEach(function(e){e.textContent=new Date().getFullYear();});

/* ---------- inView: פעם אחת, כשהאלמנט מגיע למסך (מתוך MV:ft1/ft8) ---------- */
function inView(el,f){
  var done=false,io=null;
  function go(){if(done)return;done=true;off();f();}
  function chk(){var r=el.getBoundingClientRect();if(r.top<innerHeight*.9&&r.bottom>0)go();}
  function off(){removeEventListener("scroll",chk);removeEventListener("resize",chk);if(io)io.disconnect();}
  if("IntersectionObserver" in window){io=new IntersectionObserver(function(es){if(es.some(function(x){return x.isIntersecting;}))go();},{rootMargin:"0px 0px -10% 0px"});io.observe(el);}
  addEventListener("scroll",chk,{passive:true});addEventListener("resize",chk);requestAnimationFrame(chk);setTimeout(chk,300);
}

/* ---------- הגדלה של צילום מסך מהקיר ----------
   dialog אמיתי: הפוקוס נלכד בפנים, Esc סוגר, והפוקוס חוזר לכרטיס שנלחץ. חצים במקלדת עוברים בין הצילומים.
   צילום גבוה (וואטסאפ ארוך) נגלל בתוך החלון ולא מתכווץ עד שאי אפשר לקרוא. */
function lightbox(){
  var dlg=document.createElement("dialog");
  dlg.className="lb";dlg.setAttribute("aria-label","צילום מסך מהקיר");
  var ARR='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 10H5m4-4-4 4 4 4"/></svg>';
  dlg.innerHTML='<div class="lb-in"><figure class="lb-fig"><img alt="" decoding="async"></figure>'+
    '<div class="lb-bar"><p class="lb-cap"></p><div class="lb-ctl">'+
    '<button class="lb-btn lb-prev" type="button" aria-label="הצילום הקודם">'+ARR+'</button>'+
    '<span class="lb-n" aria-live="polite"></span>'+
    '<button class="lb-btn lb-next" type="button" aria-label="הצילום הבא">'+ARR+'</button>'+
    '<button class="lb-btn lb-close" type="button" aria-label="סגירה"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg></button>'+
    '</div></div></div>';
  document.body.appendChild(dlg);
  var fig=dlg.querySelector(".lb-fig"),img=fig.querySelector("img"),cap=dlg.querySelector(".lb-cap"),n=dlg.querySelector(".lb-n");
  var prev=dlg.querySelector(".lb-prev"),next=dlg.querySelector(".lb-next"),list=[],i=0,back=null;
  function show(k){
    i=(k+list.length)%list.length;var it=list[i];
    var tall=it.fh/it.fw>1.25;
    fig.classList.toggle("tall",tall);
    fig.style.setProperty("--lbw",(tall?Math.min(560,it.fw):Math.min(1100,it.fw))+"px");
    img.width=it.fw;img.height=it.fh;img.src=it.full;img.alt=it.alt||"";
    cap.textContent=it.cap||"";fig.scrollTop=0;
    n.textContent=list.length>1?(i+1)+" מתוך "+list.length:"";
  }
  function open(items,k,from){
    list=items;back=from||document.activeElement;
    prev.hidden=next.hidden=items.length<2;
    show(k||0);
    document.documentElement.style.overflow="hidden";
    dlg.showModal();
    dlg.querySelector(".lb-close").focus({preventScroll:true});
  }
  prev.addEventListener("click",function(){show(i-1);});
  next.addEventListener("click",function(){show(i+1);});
  dlg.querySelector(".lb-close").addEventListener("click",function(){dlg.close();});
  dlg.addEventListener("click",function(e){if(e.target===dlg||e.target.classList.contains("lb-in"))dlg.close();});
  // ב-RTL "הבא" הוא שמאלה, כמו כיוון הקריאה
  dlg.addEventListener("keydown",function(e){
    if(list.length<2)return;
    if(e.key==="ArrowLeft"){e.preventDefault();show(i+1);}
    if(e.key==="ArrowRight"){e.preventDefault();show(i-1);}
  });
  dlg.addEventListener("close",function(){document.documentElement.style.overflow="";if(back&&back.focus)back.focus({preventScroll:true});});
  return {open:open};
}
/* פריט לקיר: ציטוט או צילום, יחד עם המידות של הצילום */
function wallItem(q){
  var s=CONTENT.shot(q.id);
  return {id:q.id,thumb:s.thumb,full:s.full,w:s.w,h:s.h,fw:s.fw,fh:s.fh,
    alt:"צילום מסך של הודעה: "+q.who,cap:q.who+(q.org?" · "+q.org:"")};
}

/* ---------- טופס יצירת קשר: ולידציה בשורה (MV:cv9) ----------
   שם וטלפון חובה, מייל רק אם מילאו. השגיאה מגיעה כשיוצאים מהשדה, והוי מגיע מוקדם.
   בסקיצה הטופס לא נשלח לשום מקום: במקום שליחה מוצג מצב "קיבלנו", ובאתר החי זה עמוד תודה נפרד. */
var CF_ERR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/></svg>';
var CF_TICK='<svg class="cf-tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
function contactForm(root,o){
  o=o||{};
  var p=root.id||"cf";
  function field(k,label,attrs,opt){
    return '<div class="cf-f"><label for="'+p+'-'+k+'">'+label+(opt?' <small>(לא חובה)</small>':'')+'</label>'+
      '<div class="cf-in"><input id="'+p+'-'+k+'" data-v="'+k+'" '+attrs+(opt?'':' aria-required="true"')+' aria-describedby="'+p+'-'+k+'-e">'+CF_TICK+'</div>'+
      '<div class="cf-err"><p id="'+p+'-'+k+'-e">'+CF_ERR+'<span></span></p></div></div>';
  }
  var needs=["מיתוג ועיצוב","אתר","שיווק דיגיטלי","עוד לא בטוחים"];
  root.innerHTML='<form novalidate>'+
    '<div class="cf-sum" tabindex="-1" role="alert"><div><div class="cf-sum-in"><b></b><ul></ul></div></div></div>'+
    '<div class="cf-grid">'+
      field("name","שם",'autocomplete="name"')+
      field("phone","טלפון",'type="tel" inputmode="tel" dir="ltr" autocomplete="tel"')+
      field("email","אימייל",'type="email" inputmode="email" dir="ltr" autocomplete="email"',true).replace(/<\/div>$/,
        '<div class="cf-sug"><div><button type="button"><span>התכוונתם ל-<b data-fixed></b>?</span></button></div></div></div>')+
      field("org","ארגון או עסק",'autocomplete="organization"',true)+
    '</div>'+
    '<fieldset class="cf-need"><legend>במה מדובר? <small>(לא חובה)</small></legend><div class="cf-chips">'+
      needs.map(function(t){return '<label class="cf-chip"><input type="checkbox" name="need" value="'+t+'"><span>'+t+'</span></label>';}).join("")+
    '</div></fieldset>'+
    '<div class="cf-f cf-wide"><label for="'+p+'-msg">כמה מילים על הפרויקט <small>(לא חובה)</small></label><textarea id="'+p+'-msg" rows="3"></textarea></div>'+
    '<div class="cf-end"><button class="'+(o.btn||"btn btn-lime")+' cf-send" type="submit">שליחה<svg class="arr" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 10H5m4-4-4 4 4 4"/></svg></button>'+
    '<p class="cf-privacy">הפרטים משמשים רק כדי לחזור אליכם. <a href="#privacy">מדיניות פרטיות</a></p></div>'+
  '</form>'+
  '<div class="cf-done" tabindex="-1" role="status"></div>';

  var form=root.querySelector("form"),sum=root.querySelector(".cf-sum"),touched={};
  function digits(v){return v.replace(/[^0-9]/g,"");}
  function normPhone(v){var d=digits(v);if(d.indexOf("972")===0)d="0"+d.slice(3);return d;}
  function fmtPhone(d){if(/^0[57][0-9]{8}$/.test(d))return d.slice(0,3)+"-"+d.slice(3,6)+"-"+d.slice(6);if(/^0[2-489][0-9]{7}$/.test(d))return d.slice(0,2)+"-"+d.slice(2,5)+"-"+d.slice(5);return null;}
  var RULES={
    name:function(v){v=v.trim();if(!v)return "איך לפנות אליכם? חסר שם";if(v.length<2)return "שם של אות אחת? כתבו לפחות שתיים";return "";},
    phone:function(v){var d=normPhone(v),miss;if(!d)return "חסר מספר טלפון";
      if(/^0[57]/.test(d)){if(d.length<10){miss=10-d.length;return (miss===1?"חסרה ספרה אחת":"חסרות "+miss+" ספרות")+" (מספר נייד הוא 10 ספרות)";}
        if(d.length>10)return (d.length-10===1?"יש ספרה אחת מיותרת":"יש "+(d.length-10)+" ספרות מיותרות")+" (מספר נייד הוא 10 ספרות)";}
      return fmtPhone(d)?"":"המספר לא נראה כמו טלפון ישראלי";},
    email:function(v){v=v.trim();if(!v)return "";if(v.indexOf("@")<0)return "בכתובת חסר @";if(!/^[^@ ]+@[^@ ]+[.][^@ ]{2,}$/.test(v))return "הכתובת לא שלמה, למשל name@gmail.com";return "";},
    org:function(){return "";}
  };
  var inputs=[].slice.call(form.querySelectorAll("[data-v]")),sug=root.querySelector(".cf-sug");
  // שגיאת הקלדה בדומיין (gmial.com): מציעים תיקון בלחיצה, והוי מחכה עד שמקבלים אותו
  var DOMAINS=["gmail.com","walla.co.il","walla.com","hotmail.com","outlook.com","yahoo.com","icloud.com","012.net.il","bezeqint.net","netvision.net.il"];
  function lev(a,b){var m=a.length,n=b.length,d=[],i,j;for(i=0;i<=m;i++)d[i]=[i];for(j=0;j<=n;j++)d[0][j]=j;
    for(i=1;i<=m;i++)for(j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n];}
  function suggest(inp){
    var v=inp.value.trim(),at=v.lastIndexOf("@");if(at<1){sug.classList.remove("is-open");return;}
    var dom=v.slice(at+1).toLowerCase(),best=null,bd=9;if(DOMAINS.indexOf(dom)>-1){sug.classList.remove("is-open");return;}
    DOMAINS.forEach(function(d){var x=lev(dom,d);if(x<bd){bd=x;best=d;}});
    if(best&&bd<=2){var fixed=v.slice(0,at+1)+best;sug.querySelector("[data-fixed]").textContent=fixed;sug.fixed=fixed;sug.classList.add("is-open");inp.closest(".cf-f").classList.remove("is-ok");}
    else sug.classList.remove("is-open");
  }
  sug.querySelector("button").addEventListener("click",function(){var inp=form.querySelector("[data-v=email]");inp.value=sug.fixed;sug.classList.remove("is-open");check(inp,true);inp.focus();});
  function check(inp,show){
    var k=inp.getAttribute("data-v"),f=inp.closest(".cf-f"),m=RULES[k](inp.value);
    if(show||touched[k]){
      f.classList.toggle("is-bad",!!m);f.classList.toggle("is-ok",!m&&inp.value.trim()!=="");
      inp.setAttribute("aria-invalid",m?"true":"false");if(m)f.querySelector(".cf-err span").textContent=m;
    }
    return m;
  }
  inputs.forEach(function(inp){
    var k=inp.getAttribute("data-v");
    inp.addEventListener("blur",function(){
      if(inp.value.trim()===""&&!touched[k])return;
      if(k==="phone"){var f=fmtPhone(normPhone(inp.value));if(f)inp.value=f;}
      touched[k]=true;check(inp,true);if(k==="email")suggest(inp);
    });
    inp.addEventListener("input",function(){if(touched[k])check(inp,true);if(k==="email")sug.classList.remove("is-open");});
  });
  function summary(focus){
    var bad=inputs.filter(function(inp){return RULES[inp.getAttribute("data-v")](inp.value);}),ul=sum.querySelector("ul");ul.textContent="";
    bad.forEach(function(inp){var li=document.createElement("li"),a=document.createElement("a");a.href="#"+inp.id;
      a.textContent=inp.closest(".cf-f").querySelector("label").firstChild.textContent.trim()+": "+RULES[inp.getAttribute("data-v")](inp.value);
      a.addEventListener("click",function(ev){ev.preventDefault();inp.focus();});li.appendChild(a);ul.appendChild(li);});
    sum.querySelector("b").textContent=bad.length===1?"שדה אחד צריך תיקון":bad.length+" שדות צריכים תיקון";
    sum.classList.toggle("is-open",bad.length>0);
    if(focus&&bad.length){sum.focus({preventScroll:true});sum.scrollIntoView({block:"nearest",behavior:"smooth"});}
    return bad.length;
  }
  form.addEventListener("input",function(){if(sum.classList.contains("is-open"))summary(false);});
  form.addEventListener("submit",function(e){
    e.preventDefault();
    inputs.forEach(function(inp){var k=inp.getAttribute("data-v");touched[k]=true;if(k==="phone"){var f=fmtPhone(normPhone(inp.value));if(f)inp.value=f;}check(inp,true);});
    if(summary(true))return;
    var name=form.querySelector("[data-v=name]").value.trim().split(" ")[0].replace(/[<>&"]/g,"");
    root.classList.add("is-sent");
    var done=root.querySelector(".cf-done");
    done.innerHTML='<b>תודה, '+name+'. קיבלנו.</b><span>נחזור אליכם בהקדם. בינתיים אפשר להציץ בעבודות.</span><small>סקיצה: הטופס לא נשלח לשום מקום.</small>';
    done.focus({preventScroll:true});
  });
}

/* ---------- פס לקוחות רץ (C10): שני סטים זהים, עוצר בריחוף, בפוקוס ובכפתור, ונעצר לגמרי בהפחתת תנועה ---------- */
/* root: עוטף .mq-wrap עם שורה אחת או יותר (.mq > .mq-track) וכפתור .mq-pause אחד לכולן. rows: מערך של רשימות שמות */
function marquee(root,rows,o){
  o=o||{};
  [].slice.call(root.querySelectorAll(".mq-track")).forEach(function(track,k){
    var names=rows[k]||[];
    var set=names.map(function(n){return '<span class="mq-it'+(n.pub?" pub":"")+'">'+(o.sep||"")+n.name+'</span>';}).join("");
    track.innerHTML='<div class="mq-set">'+set+'</div><div class="mq-set" aria-hidden="true">'+set+'</div>';
    // מהירות קבועה בפיקסלים, לא בזמן: שורה ארוכה לא רצה מהר יותר משורה קצרה
    function dur(){track.style.setProperty("--mq-dur",Math.max(20,Math.round(track.firstChild.offsetWidth/(o.speed||45)))+"s");}
    dur();if(document.fonts)document.fonts.ready.then(dur);
  });
  var b=root.querySelector(".mq-pause");
  // WCAG 2.2.2: תוכן שזז יותר מחמש שניות מקבל כפתור עצירה גלוי
  if(b){
    b.innerHTML='<svg class="ic-pause" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><rect x="2" y="1.5" width="3.4" height="11" rx="1"/><rect x="8.6" y="1.5" width="3.4" height="11" rx="1"/></svg>'+
      '<svg class="ic-play" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M11.5 7 3.5 12V2z"/></svg><span>עצירת הפס</span>';
    b.addEventListener("click",function(){
      var p=root.classList.toggle("is-paused");
      b.querySelector("span").textContent=p?"הפעלת הפס":"עצירת הפס";
    });
  }
}
/* לקוחות בשם: הציבוריים קודם, ואחריהם מי שיש לו הכי הרבה עבודות */
function clientNames(){
  var c={},order=[];
  (window.WORKS||[]).forEach(function(w){
    var k=w.client_he;if(!c[k]){c[k]={name:k,pub:false,n:0};order.push(c[k]);}
    c[k].n++;if(w.public_body)c[k].pub=true;
  });
  return order.sort(function(a,b){return (b.pub?1:0)-(a.pub?1:0)||b.n-a.n;});
}

/* ---------- פרטי קשר ועמודות פוטר: מקור אחד לשלוש הסקיצות ---------- */
var IC={
  wa:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3Z"/></svg>',
  tel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>'
};
/* שורות "איך מדברים איתנו" (li): וואטסאפ, טלפון, מייל, כתובת */
function contactWays(){
  var c=CONTENT.contact;
  return '<li><a href="'+c.wa+'" target="_blank" rel="noopener">'+IC.wa+'<span>וואטסאפ</span></a></li>'+
    '<li><a href="'+c.telHref+'">'+IC.tel+'<span class="ft-tel" dir="ltr">'+c.tel+'</span></a></li>'+
    '<li><a href="mailto:'+c.email+'">'+IC.mail+'<span dir="ltr">'+c.email+'</span></a></li>'+
    '<li><a href="'+c.waze+'" target="_blank" rel="noopener">'+IC.pin+'<span>'+c.address+'</span></a></li>';
}
/* עמודות הפוטר: האתר, מחלקות, צרו קשר, עקבו */
function footCols(o){
  o=o||{};var c=CONTENT.contact,d=CONTENT.depts;
  function col(h,items){return '<div><h3>'+h+'</h3><ul>'+items.map(function(x){return '<li>'+x+'</li>';}).join("")+'</ul></div>';}
  return col("האתר",['<a href="#work">עבודות</a>','<a href="'+(o.depts||"#depts")+'">מחלקות</a>','<a href="#wall">מה מספרים עלינו</a>','<a href="#about">עלינו</a>','<a href="#jobs">קריירה</a>'])+
    col("מחלקות",["branding","web","digital"].map(function(k){return '<a href="?d='+k+'#work">'+d[k].name+'</a>';}))+
    col("צרו קשר",['<a href="'+c.telHref+'"><span class="ft-tel" dir="ltr">'+c.tel+'</span></a>','<a href="mailto:'+c.email+'" dir="ltr">'+c.email+'</a>',
      '<a href="'+c.waze+'" target="_blank" rel="noopener">'+c.address+'</a>','<a href="'+c.wa+'" target="_blank" rel="noopener">וואטסאפ</a>'])+
    col("עקבו",['<a href="'+c.facebook+'" target="_blank" rel="noopener">פייסבוק</a>','<a href="'+c.pinterest+'" target="_blank" rel="noopener">פינטרסט</a>']);
}

/* ---------- מסדרון אופקי (C12): חצים בדסקטופ, scroll-snap, ובקצה החץ נכבה ---------- */
function corridor(sc,prev,next){
  function step(){var it=sc.firstElementChild;return it?it.getBoundingClientRect().width+(parseFloat(getComputedStyle(sc).columnGap)||16):sc.clientWidth*.8;}
  // ב-RTL scrollLeft מתחיל ב-0 ויורד לשליליים: "הבא" הוא שמאלה
  function upd(){
    var x=Math.abs(sc.scrollLeft),max=sc.scrollWidth-sc.clientWidth-2;
    prev.disabled=x<2;next.disabled=x>=max;
  }
  var still=matchMedia("(prefers-reduced-motion: reduce)").matches;
  next.addEventListener("click",function(){sc.scrollBy({left:-step(),behavior:still?"auto":"smooth"});});
  prev.addEventListener("click",function(){sc.scrollBy({left:step(),behavior:still?"auto":"smooth"});});
  sc.addEventListener("scroll",function(){requestAnimationFrame(upd);},{passive:true});
  addEventListener("resize",upd);upd();
}
