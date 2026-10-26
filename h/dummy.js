/* סקיצות ח ו-ט · עבודות דמה במקום העבודות של ויזואל (פגישת 26.10.2026: "עבודות דמה איכותיות... מוקאפים").
   כל עבודה מקבלת מוקאפ מהמאגר של המחלקה שלה, ושמות הלקוחות נשארים, כדי שהמבנה של התיק יישאר אמיתי.
   התמונות מ-Unsplash (רישיון חופשי), המקורות ב-img/dummy/CREDITS.md. נטען אחרי works-g.js ולפני כל השאר */
(function(){
  "use strict";
  var me=document.currentScript,B=me?me.src.replace(/[^\/]*$/,""):"";
  // הכתובת של התיקייה של ח: סקיצה ט טוענת מכאן את הקוד ואת התמונות
  window.HB=B;
  // גובה כל מוקאפ ברוחב 2400
  var H={b01:1350,b02:1600,b03:1600,b04:1350,b05:1350,b06:1601,b07:1601,b08:1800,b09:1600,b10:2133,b11:1600,b12:1600,b13:1800,b14:1350,b15:1600,b16:1350,b17:1350,b18:1350,
    c01:1350,c02:1800,c03:1600,c04:1800,c05:1600,c06:1800,c07:1600,c08:1600,c09:1800,c10:1350,
    p01:1601,p02:1877,p03:1663,p04:1600,p05:1600,p06:1590,p07:1600,p08:1800,
    w01:1920,w03:1600,w04:1600,w05:1447,w06:1674,w07:1546,w08:1350,w09:1350,w10:1350};
  // חיתוך לאורך (1080 על 2100) לתמונות שממלאות את מסך הטלפון
  var PORT={b04:1,b06:1,b08:1,c01:1,c03:1,p03:1,w01:1,w07:1};
  function img(n){return {src:B+"img/dummy/"+n+".jpg",thumb:B+"img/dummy/t/"+n+".jpg",w:2400,h:H[n],dm:n,port:PORT[n]?B+"img/dummy/p/"+n+".jpg":""};}
  window.DUMMY=img;
  function seq(p,a,b){var r=[];for(var i=a;i<=b;i++)r.push(p+(i<10?"0":"")+i);return r;}
  var POOL={
    branding:seq("b",1,18).concat(seq("p",1,8)),
    web:["w01"].concat(seq("w",3,10)),
    digital:seq("c",1,10).concat(seq("w",7,10))
  };
  // העבודות הנבחרות בעמוד הבית והענן: מוקאפ מדויק לכל אחת
  var OVR={
    "ag-payments-status":"p03","gencell-evox":"w01","college-campaign":"c03","aviv-deck":"b04","aldo-ad-a":"b08","bennys-site":"w07",
    "puzzle-soups":"b09","crunchy-truck":"b02","praium-mag":"p02","katz-resort-site":"w10","mbc-instagram":"c08","smartnpv-can":"b15","izraex-site":"w08"
  };
  var used={},has={},k;
  for(k in OVR)used[OVR[k]]=1;
  WORKS.forEach(function(w){if(OVR[w.id])has[w.client_he]=1;});
  function dep(w){return POOL[w.departments[0]]?w.departments[0]:"branding";}
  // קודם עבודה אחת לכל לקוח, כל אחת עם מוקאפ שעוד לא בשימוש, ואחר כך השאר במחזור
  var pick={},cur={branding:0,web:0,digital:0},mine={};
  function take(d,free,avoid){
    var p=POOL[d];
    for(var t=0;t<p.length;t++){var n=p[(cur[d]+t)%p.length];if((!free||!used[n])&&!(avoid&&avoid[n])){cur[d]=(cur[d]+t+1)%p.length;return n;}}
    var n2=p[cur[d]%p.length];cur[d]++;return n2;
  }
  WORKS.forEach(function(w){
    if(OVR[w.id]){pick[w.id]=OVR[w.id];return;}
    if(has[w.client_he])return;
    has[w.client_he]=1;var n=take(dep(w),true);used[n]=1;pick[w.id]=n;
  });
  WORKS.forEach(function(w){var c=mine[w.client_he]||(mine[w.client_he]={});if(pick[w.id])c[pick[w.id]]=1;});
  WORKS.forEach(function(w){
    if(!pick[w.id]){var c=mine[w.client_he];pick[w.id]=take(dep(w),false,c);c[pick[w.id]]=1;}
    var m=img(pick[w.id]);
    w.src=m.src;w.thumb=m.thumb;w.w=m.w;w.h=m.h;w.dm=m.dm;w.port=m.port;
  });
})();
