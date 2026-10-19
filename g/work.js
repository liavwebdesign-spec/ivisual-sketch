/* סקיצה ז · עמוד העבודות (ברוח פירמה): כרטיס לכל לקוח, התגיות על התמונה למעלה משמאל,
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
    if(!c){c=by[w.client_he]={name:w.client_he,works:[],deps:{},pub:false};list.push(c);}
    c.works.push(w);if(w.public_body)c.pub=true;
    w.departments.forEach(function(d){c.deps[d]=1;});
  });
  list.sort(function(a,b){return (b.pub?1:0)-(a.pub?1:0)||b.works.length-a.works.length;});
  function short(c){return SHORT[c.name]||c.works[0].title_he;}

  var grid=document.getElementById("ar-grid");
  grid.innerHTML=list.map(function(c,i){
    var w=c.works[0],tg=G.tags(c.deps).map(function(t){return "<i>"+t+"</i>";}).join("");
    var d=Object.keys(c.deps).join(" ");
    return '<li class="ar-c" data-d="'+d+'"><button class="ar-b" type="button" data-k="'+i+'" aria-haspopup="dialog" aria-label="'+c.name+": "+short(c)+', פתיחת העבודות">'+
      '<span class="ar-m"><span class="ar-tags" aria-hidden="true">'+tg+'</span>'+
        '<img src="'+w.src+'" srcset="'+thumb(w)+' 560w, '+w.src+' '+w.w+'w" sizes="(max-width:599px) 92vw, (max-width:1023px) 46vw, 58vw" alt="'+w.alt_he+'" width="'+w.w+'" height="'+w.h+'" loading="'+(i<4?"eager":"lazy")+'" decoding="async"></span>'+
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
  /* בסינון מחלקה, כל כרטיס מראה עבודה של אותה מחלקה */
  function inDep(w){return !cur||w.departments.indexOf(cur)>-1;}
  /* כרטיס רגיל (3:2): העבודה הראשונה שממלאת אותו בלי להימתח, ואם אין, זו שנמתחת הכי מעט */
  function fill(w){return Math.min(w.w,w.h*1.5);}
  function first(c){var d=c.works.filter(inDep);if(!d.length)d=c.works;for(var i=0;i<d.length;i++){if(fill(d[i])>=900)return d[i];}return d.slice().sort(function(x,y){return fill(y)-fill(x);})[0];}
  function pick(c,L){for(var i=0;i<c.works.length;i++){if(!inDep(c.works[i]))continue;var f=c.works[i].src.split("/").pop().replace(/\.jpg$/,"");if(L.indexOf(f)>-1)return c.works[i];}return null;}
  function tallest(c){return pick(c,TALL);}
  /* כרטיס לכל הרוחב מקבל רק עבודה שוכבת ברוחב 1400 לפחות, אחרת היא נמתחת ונראית מפוקסלת */
  function broad(c){var b=null;c.works.forEach(function(w){if(inDep(w)&&w.w>=1400&&w.w/w.h>=1.3&&(!b||w.w>b.w))b=w;});return b;}
  function widest(c){return pick(c,WIDE)||broad(c)||first(c);}
  function setImg(card,w,role){
    var img=card.querySelector("img");
    if(img.dataset.src!==w.src){img.dataset.src=w.src;img.src=w.src;img.srcset=thumb(w)+" 560w, "+w.src+" "+w.w+"w";img.width=w.w;img.height=w.h;img.alt=w.alt_he;}
    img.sizes=role==="W"?"(max-width:599px) 92vw, 92vw":"(max-width:599px) 92vw, 46vw";
    card.querySelector(".ar-b").dataset.i=String(list[+card.querySelector(".ar-b").dataset.k].works.indexOf(w));
  }
  var ends=[];
  function layout(){
    var q=cards.filter(function(c){return !c.hidden;}),out=[],k=0;ends=[];
    function cl(card){return list[+card.querySelector(".ar-b").dataset.k];}
    function put(card,role){out.push(card);card.dataset.r=role;var c=cl(card);setImg(card,role[0]==="T"?tallest(c):role==="W"?widest(c):first(c),role);}    /* מי שיש לו עבודה עומדת נשמר לכרטיס גבוה, וכל השאר לפי הסדר */
    function take(){for(var i=0;i<q.length;i++){if(!tallest(cl(q[i])))return q.splice(i,1)[0];}return q.shift();}
    while(q.length){
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

  /* טעינה בגלילה: קודם 12 כרטיסים, ועוד 12 כשמתקרבים לסוף. העצירה תמיד בסוף שורה, כדי שכרטיס גבוה לא יישאר בלי זוג.
     הכפתור "עוד פרויקטים" הוא גם הדרך למקלדת, ולמי שהגלילה לא הפעילה */
  var STEP=12,shown=STEP,vis=[],more=document.getElementById("ar-more"),moreBtn=more.querySelector("button");
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
  function near(){if(!more.hidden&&more.getBoundingClientRect().top<innerHeight+600)reveal(false);}
  moreBtn.addEventListener("click",function(){reveal(true);});
  if("IntersectionObserver" in window)new IntersectionObserver(function(es){if(es[0].isIntersecting)reveal(false);},{rootMargin:"0px 0px 600px 0px"}).observe(more);

  /* הסינון: הכול, מיתוג, אתרים, שיווק, עם מספר הלקוחות בכל אחד */
  var tabs=document.getElementById("ar-tabs"),stat=document.getElementById("ar-status");
  var KEYS=["","branding","web","digital"],NAMES={"":"הכול",branding:"מיתוג",web:"אתרים",digital:"שיווק"};
  function count(k){return k?list.filter(function(c){return c.deps[k];}).length:list.length;}
  tabs.innerHTML=KEYS.map(function(k){return '<button type="button" data-d="'+k+'" aria-pressed="false">'+NAMES[k]+'<sup>'+count(k)+'</sup></button>';}).join("");
  var cur=null;
  function apply(k,anim){
    if(KEYS.indexOf(k)<0)k="";
    if(k===cur)return;cur=k;
    tabs.querySelectorAll("button").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.d===k));});
    var go=anim&&hasGsap&&window.Flip&&!still.matches;
    var state=go?Flip.getState(cards):null;
    cards.forEach(function(c){c.hidden=!!k&&c.dataset.d.split(" ").indexOf(k)<0;});
    layout();shown=STEP;var lim=cap();
    if(go)Flip.from(state,{duration:.7,ease:"power3.inOut",scale:true,absolute:true,simple:true,
      onEnter:function(els){return gsap.fromTo(els,{opacity:0,scale:.94},{opacity:1,scale:1,duration:.55,delay:.15,ease:"power3.out"});},
      onLeave:function(els){return gsap.to(els,{opacity:0,scale:.94,duration:.35,ease:"power2.in"});},
      onComplete:function(){ScrollTrigger.refresh();}});
    stat.textContent=(k?NAMES[k]+": ":"")+count(k)+" לקוחות"+(lim<vis.length?", מוצגים "+lim:"");
    var p=new URLSearchParams(location.search);if(k)p.set("d",k);else p.delete("d");
    history.replaceState(null,"",location.pathname+(p.toString()?"?"+p:"")+location.hash);
  }
  tabs.addEventListener("click",function(e){var b=e.target.closest("button");if(b)apply(b.dataset.d,true);});
  apply(new URLSearchParams(location.search).get("d")||"",false);

  G.darkZone(document.getElementById("ft"));
  G.limeWords(null);
  rv(document);doc.classList.add("rv-ok");
})();
