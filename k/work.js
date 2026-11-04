/* סקיצה כ · עמוד העבודות (ברוח פירמה), אותו עמוד כמו בח, עם שני תיקונים: תמונה ראשית משלו לכל לקוח, והפוטר לא קופץ בזמן סינון. עם עבודות הדמה: כרטיס לכל לקוח, התגיות על התמונה למעלה משמאל,
   ומתחת שם הלקוח ומשפט קצר של שתיים-שלוש מילים. סינון לפי מחלקה שנכתב לכתובת (?d=), ומעבר רך בין הסינונים (MV:b34) */
(function(){
  "use strict";
  var G=window.G,doc=G.doc,still=G.still,hasGsap=G.hasGsap,lb=G.lb,W=G.W,lbItem=G.lbItem,thumb=G.thumb;

  // שתיים-שלוש מילים לכל לקוח: מה עשינו לו
  var SHORT={
    "החשב הכללי, משרד האוצר":"דוחות שנתיים ומיתוג","משרד האנרגיה":"סדרת דוחות","עיריית צפת":"מיתוג כנס","עיריית צפת, מחלקת הנוער":"שבוע הנוער","המכללה האזורית צפת":"קמפיין הרשמה",
    "הבית לעסקים בגליל המזרחי":"מיתוג","מגדל תפן":"שילוט לטקס","50 שנה לאסון מעלות":"מיתוג יום הזיכרון","GenCell":"מצגת מוצר וקמפיין","אביב לניצולי השואה":"חוברות וקמפיין",
    "אלדו, רשת גלידריות":"מודעות ותפריטים","פאזל (PUZZLE)":"מיתוג ותפריטים","smartNPV":"מיתוג ואריזה","MAATOUK":"מיתוג יקב","פארק לימונים":"מיתוג הפארק",
    "NATI":"פוסטים לרשתות","MBC":"פוסטים לאינסטגרם","הבית ברחוב הרמב\"ם":"מיתוג","איגוד מומחי התיירות":"מיתוג","סגל שיווק":"פליירים וביתן",
    "MAKOM, המקום של המעצבות":"מיתוג","עו\"ד סמי טל":"מיתוג וניירת","ADAM+":"מיתוג","נעה אורן":"מיתוג","חסדי לב":"מצגות",
    "בית ספר האר\"י":"חוברת וקמפיין רישום","נשות המילואים":"מיתוג","שניר נפתלי":"מצגת","BENNY'S":"אתר החנות","שיר של יום":"אתר",
    "Izraex":"אתר","Let's Get Extreme":"אתר","Active משכנתאות":"מיתוג וקמפיין","Katz Resort":"אתר נופש","Crunchy":"מיתוג פודטראק",
    "VACAY":"פלייר","moneytor":"מצגת","יד הנדיב":"מצגת","שני טל":"מיתוג","PRAIUM":"מגזין וקטלוג",
    "פוקוס, מרכז ידע למשכנתאות":"כנס יועצים","משכן אליהו":"מיתוג","FINALYTIX":"מיתוג","ויודות":"מיתוג ואתר"
  };


  /* לקוח אחד לכל כרטיס: הציבוריים קודם, ואז מי שיש לו יותר עבודות.
     עבודה שנשמרה בפינטרסט ברוחב של פחות מ-560 לא נכנסת: היא הייתה נראית מפוקסלת בכרטיס. מחכים לקבצי המקור */
  var by={},list=[];
  W.filter(function(w){return w.w>=560;}).forEach(function(w){
    var c=by[w.client_he];
    if(!c){c=by[w.client_he]={name:w.client_he,works:[],deps:{},pub:false,f:{}};list.push(c);}
    c.works.push(w);if(w.public_body)c.pub=true;
    w.departments.forEach(function(d){c.deps[d]=1;});
    FILTERS.forEach(function(g){var m=c.f[g.key]=c.f[g.key]||{};[].concat(w[g.field]||[]).forEach(function(v){m[v]=1;});});
  });
  list.sort(function(a,b){return (b.pub?1:0)-(a.pub?1:0)||b.works.length-a.works.length;});
  function short(c){return SHORT[c.name]||c.works[0].title_he;}

  /* 45 תמונות דמה ל-44 לקוחות: לכל לקוח תמונה ראשית משלו, כדי שאותה תמונה לא תופיע פעמיים בעמוד.
     קודם אתרים, אחר כך שיווק ואז מיתוג, כל אחד קודם מהמאגר שלו. לקוח שהתמונה הראשונה שלו פנויה שומר עליה */
  var FREE={};
  ["b",18,"p",8,"c",10,"w",10].forEach(function(v,i,a){if(i%2)return;for(var n=1;n<=a[i+1];n++){if(v+n!=="w2")FREE[v+(n<10?"0":"")+n]=1;}});
  function grab(c,order){
    var a=c.works[0].dm;
    if(FREE[a]&&(a[0]===order[0]||(order[0]==="b"&&a[0]==="p"))){delete FREE[a];return a;}
    for(var i=0;i<order.length;i++){for(var n in FREE){if(n[0]===order[i]){delete FREE[n];return n;}}}
    return a;
  }
  function rank(c){return c.deps.web?0:c.deps.digital?1:2;}
  function setDm(w,n){var m=DUMMY(n);w.src=m.src;w.thumb=m.thumb;w.w=m.w;w.h=m.h;w.dm=m.dm;w.port=m.port;}
  /* העבודה שבכרטיס מקבלת את התמונה הראשית של הלקוח, וזו שהחזיקה בה מקבלת את שלה, כדי שלא תהיה כפילות בחלון */
  function own(c,w){if(w.dm===c.img)return w;var o=c.works.filter(function(x){return x.dm===c.img;})[0],old=w.dm;setDm(w,c.img);if(o)setDm(o,old);return w;}

  var grid=document.getElementById("ar-grid");
  grid.innerHTML=list.map(function(c,i){
    var w=c.works[0],tg=G.tags(c.deps).map(function(t){return "<i>"+t+"</i>";}).join("");
    var d=Object.keys(c.deps).join(" ");
    return '<li class="ar-c" data-d="'+d+'"><button class="ar-b" type="button" data-k="'+i+'" aria-haspopup="dialog" aria-label="'+c.name+": "+short(c)+', פתיחת העבודות">'+
      '<span class="ar-m"><span class="ar-tags" aria-hidden="true">'+tg+'</span>'+
        '<img src="'+w.src+'" srcset="'+thumb(w)+' 900w, '+w.src+' '+w.w+'w" sizes="(max-width:599px) 92vw, (max-width:1023px) 46vw, 58vw" alt="" width="'+w.w+'" height="'+w.h+'" loading="'+(i<4?"eager":"lazy")+'" decoding="async"></span>'+
      '<span class="ar-cap"><span class="ar-n">'+c.name+'</span><span class="ar-d">'+short(c)+'</span></span>'+
    '</button></li>';
  }).join("");
  var cards=[].slice.call(grid.children);
  grid.addEventListener("click",function(e){var b=e.target.closest(".ar-b");if(b)lb.open(list[+b.dataset.k].works.map(lbItem),+b.dataset.i||0,b);});
  G.projectCursor([grid],".ar-b");

  /* הפסיפס של פירמה: שתי עמודות שוות. כרטיס גבוה ליד שני כרטיסים שנערמים, כרטיס לכל הרוחב, זוג, ושוב גבוה מהצד השני.
     כל כרטיס מקבל את התמונה שמתאימה לצורה שלו: לגבוה עבודה עומדת, לרחב עבודה שוכבת */
  var PAT=["T1","n","n","W","n","n","T2","n","n","W","n","n"];
  /* נבחרו בעין: עבודות שעומדות יפה בכרטיס גבוה, ועבודות שוכבות לכרטיס לכל הרוחב (בלי תבניות הפייסבוק ובלי דפים עמוסי טקסט) */
  var TALL=["maatouk-brand","aldo-ad-b","smartnpv-brand","tourism-experts","praium-mag","finalytix","active-brand","adam-plus"];
  var WIDE=["ag-payments-status","gencell-evox","college-campaign","aviv-deck","katz-resort-site","bennys-site","haari-booklet","rambam-house"];
  /* הכרטיסים הגדולים שומרים על התמונה שנבחרה להם, וכל השאר מקבלים מה שנשאר */
  WIDE.concat(TALL).forEach(function(id){W.forEach(function(w){var c=by[w.client_he];if(w.id===id&&c&&!c.img&&FREE[w.dm]){c.img=w.dm;delete FREE[w.dm];}});});
  list.slice().sort(function(a,b){return rank(a)-rank(b);}).forEach(function(c){if(!c.img)c.img=grab(c,["wcbp","cwbp","bpcw"][rank(c)]);});
  /* בסינון מחלקה, כל כרטיס מראה עבודה של אותה מחלקה */
  function inDep(w){return !sel.d||w.departments.indexOf(sel.d)>-1;}
  /* כרטיס רגיל (3:2): העבודה הראשונה שממלאת אותו בלי להימתח, ואם אין, זו שנמתחת הכי מעט */
  function fill(w){return Math.min(w.w,w.h*1.5);}
  function first(c){var d=c.works.filter(inDep);if(!d.length)d=c.works;for(var i=0;i<d.length;i++){if(fill(d[i])>=900)return d[i];}return d.slice().sort(function(x,y){return fill(y)-fill(x);})[0];}
  function pick(c,L){for(var i=0;i<c.works.length;i++){if(!inDep(c.works[i]))continue;if(L.indexOf(c.works[i].id)>-1)return c.works[i];}return null;}
  function tallest(c){return pick(c,TALL);}
  /* כרטיס לכל הרוחב מקבל רק עבודה שוכבת ברוחב 1400 לפחות, אחרת היא נמתחת ונראית מפוקסלת */
  function broad(c){var b=null;c.works.forEach(function(w){if(inDep(w)&&w.w>=1400&&w.w/w.h>=1.3&&(!b||w.w>b.w))b=w;});return b;}
  function widest(c){return pick(c,WIDE)||broad(c)||first(c);}
  function setImg(card,w,role){
    var img=card.querySelector("img");
    if(img.dataset.src!==w.src){img.dataset.src=w.src;img.src=w.src;img.srcset=thumb(w)+" 900w, "+w.src+" "+w.w+"w";img.width=w.w;img.height=w.h;img.alt="";}
    img.sizes=role==="W"?"(max-width:599px) 92vw, 92vw":"(max-width:599px) 92vw, 46vw";
    card.querySelector(".ar-b").dataset.i=String(list[+card.querySelector(".ar-b").dataset.k].works.indexOf(w));
  }
  var ends=[];
  function layout(){
    var q=cards.filter(function(c){return !c.hidden;}),out=[],k=0;ends=[];
    function cl(card){return list[+card.querySelector(".ar-b").dataset.k];}
    function put(card,role){out.push(card);card.dataset.r=role;var c=cl(card);setImg(card,own(c,role[0]==="T"?tallest(c):role==="W"?widest(c):first(c)),role);}    /* מי שיש לו עבודה עומדת נשמר לכרטיס גבוה, וכל השאר לפי הסדר */
    function take(){for(var i=0;i<q.length;i++){if(!tallest(cl(q[i])))return q.splice(i,1)[0];}return q.shift();}
    /* הסוף: ארבעה כרטיסים אחרונים או פחות נסגרים בשורות מלאות, כדי שכרטיס לא יישאר לבד בחצי שורה */
    function finish(){
      var n=q.length,i,j=-1;
      if(n===4){put(take(),"n");put(take(),"n");ends.push(out.length);put(take(),"n");put(take(),"n");}
      else if(n===3){
        for(i=0;i<3;i++){if(tallest(cl(q[i]))){j=i;break;}}
        if(j>-1){var r=PAT[k%12];put(q.splice(j,1)[0],r[0]==="T"?r:"T1");put(take(),"n");put(take(),"n");}
        else{for(i=0;i<3;i++){if(broad(cl(q[i]))){j=i;break;}}
          var w=j>-1?q.splice(j,1)[0]:null;put(take(),"n");put(take(),"n");ends.push(out.length);
          if(w)put(w,"W");else{var o=take();put(o,"n");}}
      }
      else if(n===2){put(take(),"n");put(take(),"n");}
      else if(n===1){var z=take();put(z,broad(cl(z))?"W":"n");}
      if(n)ends.push(out.length);
      q.length=0;
    }
    while(q.length){
      if(q.length<=4){finish();break;}
      var role=PAT[k%12];
      if(role[0]==="T"){
        var j=-1;if(q.length>=3)for(var i=0;i<q.length;i++){if(tallest(cl(q[i]))){j=i;break;}}
        if(j>-1){put(q.splice(j,1)[0],role);put(take(),"n");put(take(),"n");k+=3;}
        else if(q.length>=2){put(take(),"n");put(take(),"n");k+=3;}
        else{var o=take();put(o,broad(cl(o))?"W":"n");k+=4;}
      }else if(role==="W"){
        var m=-1;for(var x=0;x<Math.min(6,q.length);x++){if(pick(cl(q[x]),WIDE)&&!tallest(cl(q[x]))){m=x;break;}}
        if(m<0)for(x=0;x<q.length;x++){if(broad(cl(q[x]))&&!tallest(cl(q[x]))){m=x;break;}}
        if(m>-1)put(q.splice(m,1)[0],"W");else if(q.length>=2){put(take(),"n");put(take(),"n");}else put(take(),"n");
        k++;
      }else{
        if(q.length>=2){put(take(),"n");put(take(),"n");}else{var z=take();put(z,broad(cl(z))?"W":"n");}
        k+=2;
      }
      ends.push(out.length); /* כל סיבוב סוגר שורה שלמה, ושם מותר לעצור את הטעינה */
    }
    out.forEach(function(c){grid.appendChild(c);});
    cards.forEach(function(c){if(c.hidden){c.removeAttribute("data-r");grid.appendChild(c);}});
    vis=out;
  }

  /* טעינה בגלילה: קודם כ-24 כרטיסים, ועוד 24 כשמתקרבים לסוף. העצירה תמיד בסוף שורה, כדי שכרטיס גבוה לא יישאר בלי זוג.
     הכפתור "עוד פרויקטים" הוא גם הדרך למקלדת, ולמי שהגלילה לא הפעילה */
  var FIRST=24,STEP=24,shown=FIRST,vis=[],more=document.getElementById("ar-more"),moreBtn=more.querySelector("button");
  function cut(n){for(var i=0;i<ends.length;i++){if(ends[i]>=n)return ends[i];}return vis.length;}
  function cap(){
    var lim=cut(shown);
    vis.forEach(function(c,i){c.classList.toggle("is-later",i>=lim);});
    more.hidden=lim>=vis.length;
    return lim;
  }
  function reveal(focus){
    var from=cut(shown);if(from>=vis.length)return;
    shown=from+STEP;var to=cap(),fresh=vis.slice(from,to);
    if(hasGsap&&!still.matches)gsap.fromTo(fresh,{opacity:0,y:48},{opacity:1,y:0,duration:.8,ease:"power3.out",stagger:.07,clearProps:"opacity,transform"});
    if(focus&&fresh[0])fresh[0].querySelector(".ar-b").focus({preventScroll:false});
    stat.textContent="מוצגים "+to+" מתוך "+vis.length+" לקוחות";
    if(window.ScrollTrigger)ScrollTrigger.refresh();
    requestAnimationFrame(near);
  }
  var busy=false; /* בזמן מעבר בין סינונים הגריד מתכווץ לרגע, ואסור שזה ייראה כמו הגעה לסוף */
  function near(){if(!busy&&!more.hidden&&more.getBoundingClientRect().top<innerHeight+600)reveal(false);}
  moreBtn.addEventListener("click",function(){reveal(true);});
  if("IntersectionObserver" in window)new IntersectionObserver(function(es){if(es[0].isIntersecting&&!busy)reveal(false);},{rootMargin:"0px 0px 600px 0px"}).observe(more);

  /* הסינון: סרגל שצף בתחתית המסך (ברוח פירמה). הקבוצה הראשונה (סוג הפרויקט) פרושה בסרגל, עם גלולה כהה שמחליקה אליה.
     כל קבוצה נוספת (תחום הלקוח) נפתחת מעל הסרגל. הכול נבנה מ-FILTERS, ולכן קבוצה או ערך חדשים מפאנל הניהול לא דורשים שינוי בקוד.
     המספר ליד כל ערך מתחשב בבחירה בקבוצות האחרות, וערך בלי לקוחות לא ניתן לבחירה */
  var bar=document.getElementById("af"),tabs=document.getElementById("ar-tabs"),pill=tabs.querySelector(".af-on"),stat=document.getElementById("ar-status");
  var ALL=FILTERS[0],MORE=FILTERS.slice(1),sel={},cur=false;
  FILTERS.forEach(function(g){sel[g.key]="";});
  function has(c,g,v){return !v||!!(c.f[g.key]&&c.f[g.key][v]);}
  function match(c,skip){return FILTERS.every(function(g){return g===skip||has(c,g,sel[g.key]);});}
  function count(g,v){return list.filter(function(c){return match(c,g)&&has(c,g,v);}).length;}
  function btn(g,v,t){return '<button type="button" data-g="'+g.key+'" data-v="'+v+'" aria-pressed="false">'+t+'<sup></sup></button>';}
  tabs.insertAdjacentHTML("beforeend",btn(ALL,"",ALL.all)+ALL.values.map(function(x){return btn(ALL,x.id,x.name);}).join(""));
  tabs.setAttribute("aria-label",ALL.label);
  var CHEV='<svg class="af-chev" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5 10 7.5l5 5"/></svg>';
  bar.insertAdjacentHTML("beforeend",MORE.map(function(g){
    return '<div class="af-m" data-g="'+g.key+'"><button class="af-t" type="button" aria-expanded="false" aria-controls="af-p-'+g.key+'" aria-label="'+g.label+'">'+
      '<svg class="af-t-i" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="16" cy="7" r="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="10" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'+
      '<span class="af-t-l">'+g.short+'</span>'+CHEV+'</button>'+
      '<div class="af-p" id="af-p-'+g.key+'" role="group" aria-label="'+g.label+'">'+btn(g,"",g.all)+g.values.map(function(x){return btn(g,x.id,x.name);}).join("")+'</div></div>';
  }).join(""));
  var allBtns=[].slice.call(bar.querySelectorAll("button[data-g]")),menus=[].slice.call(bar.querySelectorAll(".af-m"));
  function group(k){return FILTERS.filter(function(g){return g.key===k;})[0];}
  function nameOf(g,v){for(var i=0;i<g.values.length;i++){if(g.values[i].id===v)return g.values[i].name;}return "";}
  function paint(){
    allBtns.forEach(function(b){
      var g=group(b.dataset.g),n=count(g,b.dataset.v),on=sel[g.key]===b.dataset.v;
      b.setAttribute("aria-pressed",String(on));b.querySelector("sup").textContent=n;
      b.disabled=!n&&!on;
    });
    menus.forEach(function(m){
      var g=group(m.dataset.g),v=sel[g.key],t=m.querySelector(".af-t");
      t.classList.toggle("is-set",!!v);m.querySelector(".af-t-l").textContent=v?nameOf(g,v):g.short;
      t.setAttribute("aria-label",g.label+(v?": "+nameOf(g,v):""));
    });
  }
  function slide(){var b=tabs.querySelector('[aria-pressed="true"]');if(!b)return;pill.style.width=b.offsetWidth+"px";pill.style.transform="translateX("+b.offsetLeft+"px)";}
  addEventListener("resize",slide);if(document.fonts)document.fonts.ready.then(slide);
  function openMenu(m,on,back){
    var t=m.querySelector(".af-t");m.classList.toggle("open",on);t.setAttribute("aria-expanded",String(on));
    if(!on&&back)t.focus({preventScroll:true});
  }
  function closeMenus(back){menus.forEach(function(m){if(m.classList.contains("open"))openMenu(m,false,back);});}
  bar.addEventListener("click",function(e){var t=e.target.closest(".af-t");if(!t)return;var m=t.parentNode,on=!m.classList.contains("open");closeMenus();openMenu(m,on);});
  document.addEventListener("pointerdown",function(e){if(!e.target.closest||!e.target.closest(".af-m"))closeMenus();});
  addEventListener("keydown",function(e){if(e.key==="Escape")closeMenus(true);});
  var flip=null;
  function apply(next,anim){
    FILTERS.forEach(function(g){
      if(!(g.key in next))return;
      var v=next[g.key]||"";
      sel[g.key]=g.values.some(function(x){return x.id===v;})?v:"";
    });
    var key=FILTERS.map(function(g){return sel[g.key];}).join("|");
    if(key===cur)return;
    if(flip)flip.progress(1); /* לחיצה מהירה: המעבר הקודם נסגר לפני שמתחיל הבא */
    cur=key;
    paint();slide();
    var go=anim&&hasGsap&&window.Flip&&!still.matches;
    var state=go?Flip.getState(cards):null,h0=grid.offsetHeight;
    cards.forEach(function(c){c.hidden=!match(list[+c.querySelector(".ar-b").dataset.k]);});
    layout();shown=FIRST;var lim=cap();
    /* בזמן המעבר הכרטיסים יוצאים מהזרימה: הגובה נשמר, אחרת הפוטר קופץ למעלה והסרגל בורח מתחת לעכבר */
    if(go){busy=true;grid.style.minHeight=Math.max(h0,grid.offsetHeight)+"px";flip=Flip.from(state,{duration:.7,ease:"power3.inOut",scale:true,absolute:true,simple:true,
      onEnter:function(els){return gsap.fromTo(els,{opacity:0,scale:.94},{opacity:1,scale:1,duration:.55,delay:.15,ease:"power3.out"});},
      onLeave:function(els){return gsap.to(els,{opacity:0,scale:.94,duration:.35,ease:"power2.in"});},
      onComplete:function(){flip=null;busy=false;grid.style.minHeight="";ScrollTrigger.refresh();near();}});}
    var names=FILTERS.map(function(g){return nameOf(g,sel[g.key]);}).filter(Boolean).join(", ");
    stat.textContent=(names?names+": ":"")+vis.length+" לקוחות"+(lim<vis.length?", מוצגים "+lim:"");
    var p=new URLSearchParams(location.search);
    FILTERS.forEach(function(g){if(sel[g.key])p.set(g.key,sel[g.key]);else p.delete(g.key);});
    history.replaceState(null,"",location.pathname+(p.toString()?"?"+p:"")+location.hash);
  }
  /* מי שמסנן מאמצע הרשימה חוזר לראש הגריד, כדי לראות את התוצאה מההתחלה */
  bar.addEventListener("click",function(e){
    var b=e.target.closest("button[data-g]");if(!b||b.disabled)return;
    var g=b.dataset.g,m=b.closest(".af-m");
    if(m)openMenu(m,false,true);
    if(sel[g]===b.dataset.v)return;
    var top=grid.getBoundingClientRect().top,next={};next[g]=b.dataset.v;
    apply(next,true);
    if(top<0)G.scrollToY(Math.max(0,top+scrollY-parseFloat(getComputedStyle(doc).getPropertyValue("--hx-h"))-24));
  });
  /* הסרגל עולה מלמטה אחרי שהעמוד נפתח, ויורד כשהפוטר נכנס, כדי לא לשבת על הקישורים שבו */
  var ft=document.getElementById("ft"),atFt=false;
  function show(){bar.classList.toggle("is-off",atFt);if(atFt)closeMenus();}
  if("IntersectionObserver" in window)new IntersectionObserver(function(es){atFt=es[0].isIntersecting;show();},{rootMargin:"0px 0px -40px 0px"}).observe(ft);
  setTimeout(function(){slide();show();},still.matches?0:500);
  (function(){var q=new URLSearchParams(location.search),o={};FILTERS.forEach(function(g){o[g.key]=q.get(g.key)||"";});apply(o,false);})();

  // ט: הפוטר צובע את כל העמוד. בח הוא כהה בעצמו
  if(G.sk==="i")G.zone(document.getElementById("ft"),"dark");
  rv(document);doc.classList.add("rv-ok");
})();
