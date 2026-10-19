/* סקיצה ז · עמוד העבודות (ברוח פירמה): כרטיס לכל לקוח, התגיות על התמונה למעלה משמאל,
   ומתחת שם הלקוח ומשפט קצר של שתיים-שלוש מילים. סינון לפי מחלקה שנכתב לכתובת (?d=), ומעבר רך בין הסינונים (MV:b34) */
(function(){
  "use strict";
  var G=window.G,doc=G.doc,still=G.still,hasGsap=G.hasGsap,lb=G.lb,W=G.W,lbItem=G.lbItem,thumb=G.thumb;

  // שתיים-שלוש מילים לכל לקוח: מה עשינו לו
  var SHORT={
    "YOUniversity":"שלט חוצות","פלג הגליל":"דוח שנתי ואתר","משרד האוצר":"דוח שנתי 2019","רנה":"אריזה ומודעות","איולי":"לוגו וקמפיין",
    "MBC":"פוסטים לאינסטגרם","גמלאי רפאל":"אתר הארגון","החברה לפיתוח קצרין":"אתר החברה","המכללה האזורית צפת":"אתר המכללה","להבות":"אתר תדמית",
    "בר שינוי":"מיתוג רכב וניירת","בודה בלנקה":"ניירת ומיתוג","בלאנצ', קייטרינג יוקרתי":"מיתוג וניירת","אלדו, רשת גלידריות":"שילוט וקטלוג","ראצ'ה":"תפריט ומיתוג",
    "באגטי":"מודעת מרקים","מכינת קשת יהודה":"מיתוג ואתר","לבנות ולהבנות":"חוברת ורשתות","עו\"ד ויטלי קובל":"תיקייה ומיתוג","תפארת":"מיתוג וניירת",
    "דעת הגוף":"פלייר","אביב לניצולי השואה":"פליירים ואינפוגרפיקה","שותפות צחר פאלם ביץ'":"ניוזלטר חודשי","HeaVen":"אתר תדמית","מעוף, אשכול צפוני":"אתר האשכול",
    "רעות ביתן":"אתר אישי","עמותת טל חיים":"אתר העמותה","האלטמנים":"אתר תדמית","הפורום הישראלי למנהיגות":"אתר הפורום","פסטיבל אשדוד דאנס":"אתר הפסטיבל",
    "מדרשת עפרה":"אתר המדרשה","Spa Elixir":"אתר ספא","גיליס, בית מדרש לבשר":"אתר המסעדה","KEREN Architecture":"אתר אדריכלות","להתחתן בצפת הקסומה":"אתר חתונות",
    "הגבעה":"אתר מסעדה","לגעת בהודו":"אתר טיולים","Katz Resort":"אתר נופש","Tourism Expertise Network":"חוברת ומיתוג","מסע בשביל ישראל":"פלייר",
    "הבית ברחוב הרמב\"ם":"מיתוג","VACAY":"פלייר","עיריית צפת, מחלקת הנוער":"שבוע הנוער","פאזל (PUZZLE)":"מודעת מגזין"
  };

  /* לקוח אחד לכל כרטיס: הציבוריים קודם, ואז מי שיש לו יותר עבודות */
  var by={},list=[];
  W.forEach(function(w){
    var c=by[w.client_he];
    if(!c){c=by[w.client_he]={name:w.client_he,works:[],deps:{},pub:false};list.push(c);}
    c.works.push(w);if(w.public_body)c.pub=true;
    w.departments.forEach(function(d){c.deps[d]=1;});
  });
  list.sort(function(a,b){return (b.pub?1:0)-(a.pub?1:0)||b.works.length-a.works.length;});
  function short(c){return SHORT[c.name]||c.works[0].title_he;}

  document.getElementById("ar-cnt").textContent="("+list.length+")";
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
  var TALL=["aioli-mobile-ad","pin-aldo-signs","pin-tourism-brochure","pin-aviv-flyer","pin-vacay-flyer","bagetti-soup-ad"];
  var WIDE=["peleg-hagalil-site","keshet-yehuda-board","wedding-safed-site","lagaat-behodu-site","pin-aviv-cards-imac","pin-katz-resort-site"];
  /* בסינון מחלקה, כל כרטיס מראה עבודה של אותה מחלקה */
  function inDep(w){return !cur||w.departments.indexOf(cur)>-1;}
  function first(c){for(var i=0;i<c.works.length;i++){if(inDep(c.works[i]))return c.works[i];}return c.works[0];}
  function pick(c,L){for(var i=0;i<c.works.length;i++){if(!inDep(c.works[i]))continue;var f=c.works[i].src.split("/").pop().replace(/\.jpg$/,"");if(L.indexOf(f)>-1)return c.works[i];}return null;}
  function tallest(c){return pick(c,TALL);}
  function widest(c){return pick(c,WIDE)||first(c);}
  function setImg(card,w,role){
    var img=card.querySelector("img");
    if(img.dataset.src!==w.src){img.dataset.src=w.src;img.src=w.src;img.srcset=thumb(w)+" 560w, "+w.src+" "+w.w+"w";img.width=w.w;img.height=w.h;img.alt=w.alt_he;}
    img.sizes=role==="W"?"(max-width:599px) 92vw, 92vw":"(max-width:599px) 92vw, 46vw";
    card.querySelector(".ar-b").dataset.i=String(list[+card.querySelector(".ar-b").dataset.k].works.indexOf(w));
  }
  function layout(){
    var q=cards.filter(function(c){return !c.hidden;}),out=[],k=0;
    function cl(card){return list[+card.querySelector(".ar-b").dataset.k];}
    function put(card,role){out.push(card);card.dataset.r=role;var c=cl(card);setImg(card,role[0]==="T"?tallest(c):role==="W"?widest(c):first(c),role);}
    /* מי שיש לו עבודה עומדת נשמר לכרטיס גבוה, וכל השאר לפי הסדר */
    function take(){for(var i=0;i<q.length;i++){if(!tallest(cl(q[i])))return q.splice(i,1)[0];}return q.shift();}
    while(q.length){
      var role=PAT[k%12];
      if(role[0]==="T"){
        var j=-1;if(q.length>=3)for(var i=0;i<q.length;i++){if(tallest(cl(q[i]))){j=i;break;}}
        if(j>-1){put(q.splice(j,1)[0],role);put(take(),"n");put(take(),"n");k+=3;}
        else if(q.length===2){put(take(),"n");put(take(),"n");k+=3;}
        else{put(take(),"W");k+=4;}
      }else if(role==="W"){
        var m=-1;for(var x=0;x<Math.min(6,q.length);x++){if(pick(cl(q[x]),WIDE)&&!tallest(cl(q[x]))){m=x;break;}}
        put(m>-1?q.splice(m,1)[0]:take(),"W");k++;
      }else{
        if(q.length>=2){put(take(),"n");put(take(),"n");}else put(take(),"W");
        k+=2;
      }
    }
    out.forEach(function(c){grid.appendChild(c);});
    cards.forEach(function(c){if(c.hidden){c.removeAttribute("data-r");grid.appendChild(c);}});
  }

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
    layout();
    if(go)Flip.from(state,{duration:.7,ease:"power3.inOut",scale:true,absolute:true,simple:true,
      onEnter:function(els){return gsap.fromTo(els,{opacity:0,scale:.94},{opacity:1,scale:1,duration:.55,delay:.15,ease:"power3.out"});},
      onLeave:function(els){return gsap.to(els,{opacity:0,scale:.94,duration:.35,ease:"power2.in"});},
      onComplete:function(){ScrollTrigger.refresh();}});
    stat.textContent=(k?NAMES[k]+": ":"")+count(k)+" לקוחות";
    var p=new URLSearchParams(location.search);if(k)p.set("d",k);else p.delete("d");
    history.replaceState(null,"",location.pathname+(p.toString()?"?"+p:"")+location.hash);
  }
  tabs.addEventListener("click",function(e){var b=e.target.closest("button");if(b)apply(b.dataset.d,true);});
  apply(new URLSearchParams(location.search).get("d")||"",false);

  G.darkZone(document.getElementById("ft"));
  G.limeWords(null);
  rv(document);doc.classList.add("rv-ok");
})();
