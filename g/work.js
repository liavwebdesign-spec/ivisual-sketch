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
  grid.addEventListener("click",function(e){var b=e.target.closest(".ar-b");if(b)lb.open(list[+b.dataset.k].works.map(lbItem),0,b);});
  G.projectCursor([grid],".ar-b");

  /* פסיפס: שורות של 7+5, 5+7, 6+6, לפי הסדר של הכרטיסים שנראים עכשיו */
  var SP=["s7","s5","s5","s7","",""];
  function spans(){
    var k=0;cards.forEach(function(c){c.classList.remove("s7","s5");if(c.hidden)return;var s=SP[k++%6];if(s)c.classList.add(s);});
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
    spans();
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
