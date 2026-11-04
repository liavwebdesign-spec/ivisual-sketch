/* סקיצה כ: הלוגו וכפתור התפריט לפי מה שבאמת מתחתיהם (פגישת 26.10: "לוגו שמשנה צבע לפי הרקע").
   העמוד לבן, והעבודות הגדולות עוברות מתחת להדר. על תמונה כהה לוגו כהה נעלם, ולכן דוגמים את האזור שמתחת לכל אחד מהם
   מתמונה מוקטנת של אותה עבודה. מחוץ לעבודות שום דבר לא נדרס, והצבע חוזר להיות זה של הסקשן */
(function(){
  "use strict";
  var SEL=".x5-m img,.fp-media img,.dpa-m img,.ar-m img",LIGHT="#F3F1EC",DARK="#1F1D20";
  var doc=document.documentElement,logo=document.querySelector(".flogo"),menu=document.querySelector(".hx-menu");
  if(!logo||!menu||!document.elementsFromPoint)return;
  var N=48,cv=document.createElement("canvas"),ctx=cv.getContext("2d",{willReadFrequently:true}),cache=new WeakMap(),word=document.querySelector(".ftj-word"),nx=document.getElementById("nx");
  cv.width=cv.height=N;
  // טבלת בהירות קטנה לכל תמונה: פעם אחת, אחרי שנטענה
  function map(img){
    if(cache.has(img))return cache.get(img);
    if(!img.complete||!img.naturalWidth)return null;
    var d=null;
    try{
      ctx.clearRect(0,0,N,N);ctx.drawImage(img,0,0,N,N);
      var px=ctx.getImageData(0,0,N,N).data;d=new Float32Array(N*N);
      for(var i=0;i<d.length;i++)d[i]=(.2126*px[i*4]+.7152*px[i*4+1]+.0722*px[i*4+2])/255;
    }catch(e){d=null;}
    cache.set(img,d);return d;
  }
  // הבהירות הממוצעת של מלבן על המסך, דרך החיתוך של object-fit: cover
  function lum(img,r){
    var d=map(img);if(!d)return null;
    var b=img.getBoundingClientRect();if(!b.width||!b.height)return null;
    var nr=img.naturalWidth/img.naturalHeight,br=b.width/b.height,w=1,h=1,ox=0,oy=0;
    if(nr>br){w=br/nr;ox=(1-w)/2;}else{h=nr/br;oy=(1-h)/2;}
    function ux(x){return Math.max(0,Math.min(N-1,Math.floor((ox+(x-b.left)/b.width*w)*N)));}
    function uy(y){return Math.max(0,Math.min(N-1,Math.floor((oy+(y-b.top)/b.height*h)*N)));}
    var x0=ux(r.left),x1=ux(r.right),y0=uy(r.top),y1=uy(r.bottom),sum=0,n=0;
    for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1;x++){sum+=d[y*N+x];n++;}
    return n?sum/n:null;
  }
  function imgAt(x,y){
    var st=document.elementsFromPoint(x,y);
    for(var i=0;i<st.length;i++){
      if(st[i].matches&&st[i].matches(SEL))return st[i];
      // משהו אטום מעל (סקשן אחר, התפריט) מנצח את התמונה
      if(st[i]!==logo&&st[i]!==menu&&!logo.contains(st[i])&&!menu.contains(st[i])&&/^rgb\(/.test(getComputedStyle(st[i]).backgroundColor)&&!st[i].closest(".fp-media,.x5-m,.dpa-m,.ar-m"))return null;
    }
    return null;
  }
  function setTone(el,tone){
    if(el.__t===tone)return;el.__t=tone;
    el.style.color=tone;
  }
  function one(el){
    var r=el.getBoundingClientRect();
    if(!r.width){setTone(el,"");return;}
    var im=imgAt(r.left+r.width/2,r.top+r.height/2),l=im?lum(im,r):null;
    if(l==null){el.__l=null;setTone(el,"");return;}
    if(im.closest(".dpa-m"))l*=.62;
    // סף עם מרווח, כדי שהלוגו לא יהבהב על תמונה בגוון בינוני
    var was=el.__t;
    if(was===LIGHT&&l<.6)return;
    if(was===DARK&&l>.46)return;
    setTone(el,l<.53?LIGHT:DARK);
  }
  var last=0,raf=0,tail=0;
  // הסקשנים שהצבע שלהם בא מהעמוד שמתהפך: כשהעמוד כבר חזר ללבן והם עוד מתחת להדר, הלוגו הולך אחרי העמוד ולא נעלם על הלבן
  var tonal=matchMedia("(prefers-reduced-motion: reduce)").matches?[]:[].slice.call(document.querySelectorAll("#more,#depts,#dzj,#clients,#contact")),themeMeta=document.querySelector('meta[name="theme-color"]'),wasTonal=false;
  function onTonal(){
    var y=(parseFloat(getComputedStyle(doc).getPropertyValue("--hx-h"))||84)/2;
    return tonal.some(function(el){var r=el.getBoundingClientRect();return r.top<=y&&r.bottom>y;});
  }
  // צבע הדפדפן בטלפון: באותם סקשנים הולך אחרי העמוד, ומחוץ להם חוזר לצבע של הסקשן
  function paintBar(on){
    if(!themeMeta)return;
    var cl=doc.classList,t=on?(cl.contains("is-green")?"green":cl.contains("is-dark")?"dark":"light"):doc.getAttribute("data-hd");
    themeMeta.setAttribute("content",t==="green"?"#8CC63F":t==="dark"?(getComputedStyle(doc).getPropertyValue("--dark").trim()||"#1B2013"):"#FFFFFF");
  }
  function run(){
    raf=0;last=performance.now();
    var isTonal=onTonal();
    doc.classList.toggle("hd-tone",isTonal);
    if(isTonal||wasTonal)paintBar(isTonal);
    wasTonal=isTonal;
    // הלוגו הצף מפנה מקום כשהשם הגדול נכנס: בסוף העמוד יש לוגו אחד, והוא לא יושב על הקישורים
    // כשהמסך הלבן של "תמשיכו לגלול" מגיע להדר, המילה כבר מכוסה: הלוגו חוזר, בצבע כהה
    var wr=word&&word.getBoundingClientRect(),atNx=!!nx&&nx.getBoundingClientRect().top<=(parseFloat(getComputedStyle(doc).getPropertyValue("--hx-h"))||84)/2;
    doc.classList.toggle("at-nx",atNx);
    doc.classList.toggle("fl-end",!!wr&&!atNx&&wr.top<innerHeight*.98&&wr.bottom>0);
    if(doc.classList.contains("fs-lock")){setTone(logo,"");setTone(menu,"");return;}
    one(logo);one(menu);
  }
  function tick(){
    clearTimeout(tail);
    if(performance.now()-last>110){if(!raf)raf=requestAnimationFrame(run);}
    tail=setTimeout(function(){if(!raf)raf=requestAnimationFrame(run);},140);
  }
  addEventListener("scroll",tick,{passive:true});
  addEventListener("resize",tick);
  addEventListener("load",tick);
  window.__toneTick=tick;
  tick();
})();
