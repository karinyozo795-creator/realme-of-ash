/* Campaign layer: independent grand-strategy systems, preserving the original tactical prototype. */
(()=>{
const factions=[
{id:'ash',name:'مملكة الرماد',en:'Kingdom of Ash',color:'#438fc7',gold:145,food:120,iron:35,wood:55,stone:30,pop:8200,style:'متوازنة',bonus:'دخل إضافي من القلاع'},
{id:'iron',name:'إمبراطورية الحديد',en:'Iron Empire',color:'#bd5558',gold:170,food:95,iron:90,wood:30,stone:70,pop:11000,style:'عسكرية',bonus:'قوات مشاة أقوى'},
{id:'wolves',name:'مملكة الذئاب الشمالية',en:'Northern Wolves',color:'#8298b4',gold:100,food:130,iron:40,wood:80,stone:25,pop:7600,style:'فرسان',bonus:'حركة أسرع في الغابات'},
{id:'silver',name:'المملكة الفضية',en:'Silver Kingdom',color:'#b7b9c8',gold:190,food:90,iron:55,wood:45,stone:60,pop:9000,style:'تجارية',bonus:'عائد الأسواق أعلى'},
{id:'sun',name:'مملكة الشمس',en:'Kingdom of the Sun',color:'#c99a43',gold:130,food:180,iron:30,wood:55,stone:45,pop:9800,style:'زراعية',bonus:'إنتاج غذائي أعلى'},
{id:'shadow',name:'سلطنة الظلال',en:'Shadow Dominion',color:'#8565a8',gold:155,food:100,iron:65,wood:65,stone:40,pop:7000,style:'مناورة',bonus:'كفاءة أعلى في الاستطلاع'}
];
const terrain=['سهول','غابة','جبال','نهر','صحراء','بحيرة','ساحل'];
const cities=[
{id:'c1',name:'قلعة الرماد',x:125,y:160,owner:'ash',level:2,buildings:{farm:1,barracks:1},capital:true},
{id:'c2',name:'حصن الحديد',x:455,y:160,owner:'iron',level:2,buildings:{mine:2,barracks:1},capital:true},
{id:'c3',name:'ذروة الذئاب',x:270,y:65,owner:'wolves',level:1,buildings:{farm:1},capital:true},
{id:'c4',name:'المرآة الفضية',x:600,y:260,owner:'silver',level:2,buildings:{market:2},capital:true},
{id:'c5',name:'واحة الشمس',x:330,y:330,owner:'sun',level:2,buildings:{farm:2},capital:true},
{id:'c6',name:'باب الظلال',x:690,y:105,owner:'shadow',level:1,buildings:{workshop:1},capital:true},
{id:'c7',name:'ميناء الضباب',x:130,y:300,owner:'ash',level:1,buildings:{market:1},capital:false},
{id:'c8',name:'منجم الغسق',x:525,y:350,owner:'iron',level:1,buildings:{mine:1},capital:false}
];
const regions=[
{id:'r1',owner:'wolves',points:'20,15 300,15 270,115 190,155 20,120'},
{id:'r2',owner:'ash',points:'20,120 190,155 270,245 200,390 20,390'},
{id:'r3',owner:'iron',points:'300,15 520,15 550,150 440,235 270,245 190,155 270,115'},
{id:'r4',owner:'shadow',points:'520,15 760,15 760,205 620,245 550,150'},
{id:'r5',owner:'silver',points:'440,235 550,150 620,245 760,205 760,390 525,390'},
{id:'r6',owner:'sun',points:'200,390 270,245 440,235 525,390 20,390'}
];
let state={turn:1,selected:'ash',resources:{gold:145,food:120,iron:35,wood:55,stone:30,pop:8200},relations:{iron:-45,wolves:15,silver:25,sun:35,shadow:-10},buildQueue:[],log:['بدأت حملة الممالك الست. اختر مدينة لعرض تفاصيلها.'],selectedCity:'c1',won:false};
const root=document.getElementById('grand-campaign');if(!root)return;
const $=id=>document.getElementById(id);
function faction(id){return factions.find(f=>f.id===id)}
function city(id){return cities.find(c=>c.id===id)}
function owned(){return cities.filter(c=>c.owner==='ash')}
function log(s){state.log.unshift('الدور '+state.turn+': '+s);state.log=state.log.slice(0,18)}
function renderMap(){
let svg='<svg class="world-map" viewBox="0 0 780 410" role="img" aria-label="خريطة الممالك الست">';
svg+='<defs><pattern id="waterlines" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 12 Q6 7 12 12 T24 12" fill="none" stroke="#8bc2c7" opacity=".13"/></pattern></defs><rect width="780" height="410" fill="#244451"/><rect width="780" height="410" fill="url(#waterlines)"/>';
regions.forEach(r=>{let f=faction(r.owner);svg+='<polygon class="region '+(state.selected===r.owner?'selected':'')+'" data-faction="'+r.owner+'" points="'+r.points+'" fill="'+f.color+'" fill-opacity=".78"/>'});
svg+='<g class="terrain"><text x="65" y="70">♧ ♧</text><text x="355" y="80">▲ ▲ ▲</text><text x="640" y="315">♧ ♧</text><text x="365" y="285">≈ ≈</text><text x="70" y="350">☼</text><text x="690" y="70">♧</text></g>';
cities.forEach(c=>{let f=faction(c.owner);svg+='<g data-city="'+c.id+'"><circle class="city" cx="'+c.x+'" cy="'+c.y+'" r="'+(c.capital?13:9)+'" fill="'+f.color+'" '+(state.selectedCity===c.id?'stroke-width="4"':'')+'/><text x="'+(c.x+15)+'" y="'+(c.y+4)+'" class="city-label">'+c.name+'</text>'+(c.capital?'<text x="'+(c.x-5)+'" y="'+(c.y+5)+'" font-size="12">♜</text>':'')+'</g>'});
svg+='<g fill="#c7d8d1" opacity=".65" font-size="11"><text x="34" y="402">البحر الغربي</text><text x="620" y="402">بحر الممالك</text></g></svg>';
$('campaign-map').innerHTML=svg;
$('campaign-map').querySelectorAll('[data-city]').forEach(el=>el.addEventListener('click',()=>{state.selectedCity=el.dataset.city;state.selected=city(el.dataset.city).owner;render()}));
$('campaign-map').querySelectorAll('[data-faction]').forEach(el=>el.addEventListener('click',()=>{state.selected=el.dataset.faction;render()}));
}
function render(){
renderMap();let r=state.resources;
$('campaign-res').innerHTML=[['ذهب','gold','🪙'],['طعام','food','🌾'],['حديد','iron','⚒'],['خشب','wood','🪵'],['حجر','stone','◈'],['السكان','pop','♟']].map(([n,k,i])=>'<div class="campaign-resource">'+i+' '+n+'<b>'+r[k].toLocaleString('ar')+'</b></div>').join('');
$('faction-list').innerHTML=factions.map(f=>'<div class="faction-item"><i class="faction-swatch" style="background:'+f.color+'"></i><span>'+f.name+'</span><small style="margin-right:auto;color:#aeb5c4">'+f.style+'</small></div>').join('');
let c=city(state.selectedCity),owner=faction(c.owner);
$('city-info').innerHTML='<h3>🏰 '+c.name+'</h3><p>الحاكم: <b style="color:'+owner.color+'">'+owner.name+'</b></p><p>مستوى المدينة: '+c.level+' · '+(c.capital?'عاصمة':'مدينة')+'</p><p>المباني: '+(Object.entries(c.buildings).map(([k,v])=>({farm:'مزرعة',mine:'منجم',barracks:'ثكنة',market:'سوق',workshop:'ورشة',wall:'أسوار'}[k]+' '+v).join('، ')||'لا توجد') )+'</p>'+(c.owner==='ash'?'<div class="campaign-actions"><button data-build="farm">بناء مزرعة (خشب 20)</button><button data-build="mine">بناء منجم (خشب 20)</button><button data-build="market">بناء سوق (خشب 25)</button><button data-build="barracks">بناء ثكنة (خشب 25)</button><button class="primary" id="upgrade-city">ترقية المدينة (ذهب 80)</button></div>':'<p class="campaign-note">مدينة تابعة لفصيل آخر. راقب علاقاتك الدبلوماسية أو خطط للتوسع.</p>');
$('city-info').querySelectorAll('[data-build]').forEach(b=>b.onclick=()=>build(b.dataset.build));
let rel=state.relations; $('diplomacy').innerHTML=factions.filter(f=>f.id!=='ash').map(f=>'<div class="faction-item"><i class="faction-swatch" style="background:'+f.color+'"></i>'+f.name+'<b style="margin-right:auto">'+(rel[f.id]>30?'ودية':rel[f.id]<-25?'عدائية':'محايدة')+'</b><span>'+rel[f.id]+'</span></div>').join('');
$('campaign-log').innerHTML=state.log.map(x=>'• '+x).join('<br>');
}
function build(type){let cost=type==='market'?25:type==='barracks'?25:20;if(state.resources.wood<cost){log('لا يوجد خشب كافٍ للبناء.');render();return}let c=city(state.selectedCity);state.resources.wood-=cost;c.buildings[type]=(c.buildings[type]||0)+1;log('تم تطوير '+({farm:'مزرعة',mine:'منجم',market:'سوق',barracks:'ثكنة'}[type])+' في '+c.name+'.');render()}
function nextTurn(){state.turn++;let n=owned().length;state.resources.gold+=n*24;state.resources.food+=n*18;state.resources.wood+=n*5;state.resources.iron+=n*3;state.resources.pop+=n*90;
owned().forEach(c=>{let b=c.buildings;state.resources.food+=(b.farm||0)*12;state.resources.gold+=(b.market||0)*10;state.resources.iron+=(b.mine||0)*8});
factions.filter(f=>f.id!=='ash').forEach(f=>{if(Math.random()<.3){state.relations[f.id]=Math.min(100,state.relations[f.id]+(Math.random()<.5?2:-2))}});
if(state.turn%3===0){let target=cities.find(c=>c.owner!=='ash'&&!c.capital);if(target&&Math.random()<.5){let prev=target.owner;target.owner='ash';log('استكشف جيشك '+target.name+' وأعلن ولاءها لمملكة الرماد.');}}
log('بدأ دور جديد. موارد المدن أُضيفت إلى الخزينة.');save();render()}
function save(){localStorage.setItem('realmsAshGrandCampaign',JSON.stringify({state,cities}))}
function load(){try{let d=JSON.parse(localStorage.getItem('realmsAshGrandCampaign'));if(d?.state&&d.cities?.length===cities.length){state=d.state;d.cities.forEach((x,i)=>Object.assign(cities[i],x))}}catch(e){}}
$('next-campaign-turn').onclick=nextTurn;
$('save-campaign').onclick=()=>{save();log('حُفظ تقدم الحملة على هذا الجهاز.');render()};
$('reset-campaign').onclick=()=>{if(!confirm('هل تريد بدء حملة جديدة؟ سيُحذف حفظ هذه الحملة.'))return;localStorage.removeItem('realmsAshGrandCampaign');location.reload()};
$('city-info').addEventListener('click',e=>{if(e.target.id==='upgrade-city'){let c=city(state.selectedCity);if(state.resources.gold>=80){state.resources.gold-=80;c.level++;log('ارتفع مستوى '+c.name+'.');render()}else{log('تحتاج إلى 80 ذهباً للترقية.');render()}}});
load();render();
})();