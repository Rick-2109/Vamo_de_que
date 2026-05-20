/* ── CLOCK ── */
(function tick(){
  var d=new Date(),h=('0'+d.getHours()).slice(-2),m=('0'+d.getMinutes()).slice(-2);
  document.getElementById('clk').textContent=h+':'+m;
  setTimeout(tick,15000);
})();

/* ── NAVIGATION ── */
var _stack=['pg-perfil'];
var _bnMap={'pg-home':'bn-home','pg-resultado':'bn-res','pg-mapa':'bn-map','pg-perfil':'bn-prf'};
var _mapReady=false;
var _mapMode='bus';

function goPage(id){
  var cur=_stack[_stack.length-1];
  if(cur===id)return;
  document.getElementById(cur).classList.remove('active');
  document.getElementById(cur).classList.add('gone');
  var nEl=document.getElementById(id);
  nEl.classList.remove('gone');
  nEl.classList.add('active');
  _stack.push(id);
  setBnav(id);
  if(id==='pg-resultado')applyResultModalFilter();
  if(id==='pg-mapa'){
    if(!_mapReady){_mapReady=true;setTimeout(initMap,200);}
    else if(window._map){setTimeout(function(){window._map.invalidateSize();renderMapMode(_mapMode);},200);}
  }
}

function openRouteMap(mode){
  if(mode)_mapMode=mode;
  else{
    var selected=document.querySelector('#cgrid .ccard.sel');
    if(selected)_mapMode=selected.getAttribute('data-modal')||'bus';
  }
  goPage('pg-mapa');
  if(window._map)setTimeout(function(){renderMapMode(_mapMode);},220);
}

function goBack(){
  if(_stack.length<=1)return;
  var cur=_stack.pop();
  var prev=_stack[_stack.length-1];
  document.getElementById(cur).classList.remove('active');
  document.getElementById(cur).classList.add('gone');
  var pEl=document.getElementById(prev);
  pEl.classList.remove('gone');
  pEl.classList.add('active');
  setBnav(prev);
  setTimeout(function(){document.getElementById(cur).classList.remove('gone');},350);
}

function setBnav(id){
  document.querySelectorAll('.bn').forEach(function(b){b.classList.remove('on');});
  var k=_bnMap[id];
  if(k){var el=document.getElementById(k);if(el)el.classList.add('on');}
}

/* ── SWAP ── */
function swapInputs(){
  var o=document.getElementById('orig'),d=document.getElementById('dest');
  var t=o.value;o.value=d.value;d.value=t;
}

/* ── ROTAS SALVAS ── */
function fillRoute(orig,dest){
  document.getElementById('orig').value=orig;
  document.getElementById('dest').value=dest;
  goPage('pg-resultado');
}
function saveCurrentRoute(){
  var o=document.getElementById('orig').value.trim();
  var d=document.getElementById('dest').value.trim();
  if(o&&d){alert('✅ Rota salva:\n'+o+' → '+d);}
  else{alert('⚠️ Preencha origem e destino antes de salvar.');}
}

/* ── MODAL SELECTION (4 quadrados) ── */
var _modalDUNI={
  bus:{
    title:'🚌 Ônibus 100 1 CS1 — RECOMENDADO',
    body:'Menor custo · 100% elétrico · Chegada em 27 min · Tarifa R$ 4,50 no Cartão Aracaju · Lotação média (confortável).',
    num:'100 1 CS1',route:'UNIT ↔ TERMINAL D.I.A',tag:'100% ELÉTRICO',
    chegada:'18 min',prox:'Próx: 32 min',lot:'Média',lot2:'~40% cheio',tarifa:'R$ 4,50',tar2:'Cartão Aracaju',
    buy:'Comprar passagem'
  },
  car:{
    title:'🚗 App de corrida',
    body:'Opção mais rápida · Chegada em 15 min · Custo ~R$ 15,00 · Disponível agora · 1.2kg de CO₂ por viagem.',
    num:'CAR',route:'APP DE CORRIDA',tag:'MAIS RÁPIDO',
    chegada:'13 min',prox:'Espera estimada',lot:'Disponível',lot2:'2 carros na área',tarifa:'~R$ 18,00',tar2:'Por corrida',
    buy:'Chamar corrida'
  },
  bike:{
    title:'🚴 Bike — Zero emissão',
    body:'Gratuito · Zero emissão · Cicloviário disponível na rota · Chegada em 22 min · Ótimo para saúde.',
    num:'BIKE',route:'CICLOVIÁRIO',tag:'ZERO EMISSÃO',
    chegada:'22 min',prox:'Sem espera',lot:'Livre',lot2:'Cicloviário OK',tarifa:'Gratuito',tar2:'Sem custo',
    buy:'Ver cicloviário'
  },
  walk:{
    title:'🚶 A pé — Zero custo',
    body:'Gratuito · Zero emissão · Rota segura disponível · Chegada em 38 min · Ideal para distâncias curtas.',
    num:'PÉ',route:'A PÉ',tag:'ZERO CUSTO',
    chegada:'38 min',prox:'Sem espera',lot:'Livre',lot2:'Rota segura',tarifa:'Gratuito',tar2:'Sem custo',
    buy:'Ver rota a pé'
  },
  proprio:{
    title:'🚗 Carro próprio',
    body:'Uso do próprio veículo · Rota mais direta · Chegada em 9 min · Custo estimado ~R$ 12,00 com combustível · 1.0kg de CO₂.',
    num:'CAR',route:'CARRO PRÓPRIO',tag:'DIRETO',
    chegada:'9 min',prox:'Sem espera',lot:'Livre',lot2:'Estacionamento OK',tarifa:'~R$ 8,00',tar2:'Combustível',
    buy:'Ver rota de carro'
  },
  jet:{
    title:'🛴 Jet',
    body:'Aplitativo JET · Zero emissão · Cicloviário disponível · Chegada em 18 min · 0kg de CO₂.',
    num:'JET',route:'JET',tag:'ZERO ENISSÂO',
    chegada:'18 min',prox:'Sem espera',lot:'Livre',lot2:'Estacionamento OK',tarifa:'Aplicativo',tar2:'Aplicativo'
  }
};

var _profileModals=['bus','car','proprio'];
function getSelectedProfileModals(){
  var chips=document.querySelectorAll('#profile-modals .pchip.on');
  if(!chips.length)return [];
  return Array.prototype.map.call(chips,function(chip){
    return chip.getAttribute('data-modal');
  }).filter(Boolean);
}
function applyResultModalFilter(){
  _profileModals=getSelectedProfileModals();
  var allowed={};
  _profileModals.forEach(function(key){allowed[key]=true;});
  var cards=document.querySelectorAll('#cgrid .ccard[data-modal]');
  cards.forEach(function(card){
    var key=card.getAttribute('data-modal');
    card.classList.toggle('is-hidden',!allowed[key]);
  });

  var noModal=document.getElementById('no-modal-banner');
  var detail=document.getElementById('detail-banner');
  if(_profileModals.length===0){
    if(noModal)noModal.classList.add('vis');
    if(detail)detail.classList.remove('vis');
    return;
  }
  if(noModal)noModal.classList.remove('vis');
  if(detail)detail.classList.add('vis');

  var selected=document.querySelector('#cgrid .ccard.sel:not(.is-hidden)');
  var firstVisible=document.querySelector('#cgrid .ccard:not(.is-hidden)');
  if(selected){
    selectModal(selected.getAttribute('data-modal'));
  } else if(firstVisible){
    selectModal(firstVisible.getAttribute('data-modal'));
  }
}
function setText(id,text){
  var el=document.getElementById(id);
  if(el)el.textContent=text||'';
}

function selectModal(key){
  var picked=document.getElementById('ccard-'+key);
  if(picked&&picked.classList.contains('is-hidden'))return;
  // toggle check marks
  ['bus','car','proprio','bike','walk','jet'].forEach(function(k){
    var el=document.getElementById('ccard-'+k);
    if(!el)return;
    var chk=el.querySelector('.ccheck');
    if(k===key){
      el.classList.add('sel');
      chk.innerHTML='<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    } else {
      el.classList.remove('sel');
      chk.innerHTML='';
    }
  });
  // update detail
  var d=_modalDUNI[key];
  if(!d)return;
  setText('detail-title',d.title);
  setText('detail-body',d.body);
  document.getElementById('detail-banner').classList.add('vis');
  setText('bdh-num',d.num);
  setText('bdh-route',d.route);
  setText('bdh-tag',d.tag);
  setText('s-chegada',d.chegada);
  setText('s-prox',d.prox);
  setText('s-lot',d.lot);
  setText('s-lot2',d.lot2);
  setText('s-tarifa',d.tarifa);
  setText('s-tar2',d.tar2);
  setText('buy-label',d.buy);
}

/* ── DARK MODE ── */
var _dark=false;
function updateThemeAssets(){
  var homeLogo=document.getElementById('home-logo');
  var profileLogo=document.getElementById('profile-logo');
  if(homeLogo)homeLogo.src=_dark?'logo-vdark-sf.png':'logo-vlight-sf.png';
  if(profileLogo)profileLogo.src=_dark?'icone-vdark-sf.png':'icone-vlight-sf.png';
}
function toggleDark(){
  _dark=!_dark;
  document.getElementById('phone').classList.toggle('dk',_dark);
  updateThemeAssets();
  var ic=document.getElementById('dark-ic');
  var icPrf=document.getElementById('dark-ic-prf');
  var sunSvg='<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
  var moonSvg='<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  if(_dark){
    if(ic)ic.innerHTML=sunSvg;
    if(icPrf)icPrf.innerHTML=sunSvg;
  }else{
    if(ic)ic.innerHTML=moonSvg;
    if(icPrf)icPrf.innerHTML=moonSvg;
  }
  var pd=document.getElementById('pref-dark');
  if(pd){if(_dark)pd.classList.remove('off');else pd.classList.add('off');}
}

/* ── PRIORITY (multi-select) ── */
var _prioTxt={
  economia:'💰 Menores custos.',
  tempo:'⚡ Opções mais rápidas.',
  conforto:'🛋️ Maior conforto.',
  acessivel:'♿ Opções acessíveis.',
};
var _prioOrder=['economia'];
function togglePrio(el){
  el.classList.toggle('on');
  var key=el.dataset.k;
  _prioOrder=_prioOrder.filter(function(k){return k!==key;});
  if(el.classList.contains('on'))_prioOrder.push(key);

  var active=document.querySelectorAll('#pchips .pchip.on');
  var ex=document.getElementById('pexpl');
  if(active.length===0){
    ex.classList.remove('vis');
    ex.textContent='';
    return;
  }
  var lastKey=_prioOrder[_prioOrder.length-1];
  ex.textContent=_prioTxt[lastKey]||'';
  ex.classList.add('vis');
}
/* legacy alias */
function selPrio(el){togglePrio(el);}

/* ── BUDGET ── */
var _spent=85.50;
function updateBudget(val){
  val=parseInt(val);
  document.getElementById('bud-val').textContent='R$ '+val.toFixed(2).replace('.',',');
  var pct=Math.min(100,Math.round((_spent/val)*100));
  document.getElementById('bud-fill').style.width=pct+'%';
  var left=val-_spent;
  var st=document.getElementById('bud-status');
  if(pct<70){
    st.className='budget-status ok';
    st.textContent='✅ Dentro do orçamento — ainda sobram R$ '+left.toFixed(2).replace('.',',');
  } else if(pct<100){
    st.className='budget-status warn';
    st.textContent='⚠️ Atenção — apenas R$ '+left.toFixed(2).replace('.',',')+' restantes';
  } else {
    st.className='budget-status over';
    st.textContent='❌ Orçamento excedido em R$ '+Math.abs(left).toFixed(2).replace('.',',');
  }
}

/* ── SAVE PROFILE ── */
function saveProfile(){
  var n=document.getElementById('p-nome').value.trim()||'Usuário';
  var bud=document.getElementById('bud-slider').value;
  _profileModals=getSelectedProfileModals();
  applyResultModalFilter();
  // Update hero greeting on home screen with user name
  var heroG=document.querySelector('#pg-home .hero-g');
  if(heroG) heroG.textContent='Olá, '+n+'! Para onde vai hoje?';
  goPage('pg-home');
}

/* ── MAP ── */
var _mapData={
  ARA:[-10.9472,-37.0731],
  UNI:[-10.969585,-37.059124],
  TER:[-10.948453,-37.073924],
  USR:[-10.967245,-37.059651],
  busStops:[
    [-10.969585,-37.059124],
    [-10.976445,-37.066719],
    [-10.975222,-37.074938],
    [-10.971678,-37.081820],
    [-10.966578,-37.079787],
    [-10.948453,-37.073924]
  ],
  carStops:[
    [-10.969585,-37.059124],
    [-10.971945,-37.062992],
    [-10.969069,-37.066275],
    [-10.966457,-37.064976],
    [-10.965225,-37.068667],
    [-10.956124,-37.069386],
    [-10.951468,-37.067004],
    [-10.948498,-37.072755]
  ],
  alerts:[
    {p:[-10.946967,-37.063041],icon:'⚠️',bg:'#FF6C18',title:'Alagamento',body:'Av. Beira Mar',extra:'+15 min de atraso'},
    {p:[-10.956530,-37.053551],icon:'🏗️',bg:'#ffea8d',title:'Obras',body:'Av. Tancredo Neves',extra:'+7 min de atraso'}
  ],
  fuel:[
    {p:[-10.970646,-37.056297],name:'Petrox',kind:'gas',info:'Gasolina, etanol e diesel'},
    {p:[-10.963602,-37.069174],name:'Posto Petrobras',kind:'gas',info:'24h · conveniência'},
    {p:[-10.946539,-37.063077],name:'Carregador BYD',kind:'charge',info:'Carregador rápido · 50 kW'},
    {p:[-10.969095,-37.059981],name:'Eletroposto Unit',kind:'charge',info:'Carregador AC · 22 kW'}
  ]
};
var _mapRouteLayer=null;
var _mapMoveTimer=null;
var _mapHelpers=null;

function initMap(){
  var mapEl=document.getElementById('map');
  mapEl.style.width='100%';
  mapEl.style.height='100%';

  var map=L.map('map',{
    center:_mapData.ARA,
    zoom:13,
    zoomControl:false,
    attributionControl:true
  });
  window._map=map;

  var street=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom:19
  }).addTo(map);

  var sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{
    attribution:'&copy; Esri',
    maxZoom:19
  });

  var isStreet=true;
  _mapHelpers={
    mk:function(html,w,h){
      return L.divIcon({className:'',html:html,iconSize:[w,h],iconAnchor:[Math.round(w/2),Math.round(h/2)]});
    },
    pill:function(txt,bg,color){
      return '<div style="background:'+bg+';color:'+color+';font-size:13px;font-weight:800;padding:6px 11px;border-radius:10px;border:2.5px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.35);white-space:nowrap;line-height:1.2;">'+txt+'</div>';
    },
    dot:function(txt,bg,color){
      return '<div style="width:34px;height:34px;background:'+bg+';color:'+color+';border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;">'+txt+'</div>';
    }
  };

  document.getElementById('btn-loc').onclick=function(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        function(p){map.setView([p.coords.latitude,p.coords.longitude],15);},
        function(){map.setView(_mapData.ARA,14);}
      );
    } else {map.setView(_mapData.ARA,14);}
  };
  document.getElementById('btn-zi').onclick=function(){map.zoomIn();};
  document.getElementById('btn-zo').onclick=function(){map.zoomOut();};
  document.getElementById('btn-layer').onclick=function(){
    if(isStreet){
      map.removeLayer(street);sat.addTo(map);
      this.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> Normal';
    } else {
      map.removeLayer(sat);street.addTo(map);
      this.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> Satélite';
    }
    isStreet=!isStreet;
  };

  renderMapMode(_mapMode);
  setTimeout(function(){map.invalidateSize(true);},400);
}

function clearMapRouteLayer(){
  if(_mapMoveTimer){
    clearInterval(_mapMoveTimer);
    _mapMoveTimer=null;
  }
  if(_mapRouteLayer&&window._map){
    window._map.removeLayer(_mapRouteLayer);
  }
  _mapRouteLayer=L.layerGroup();
  _mapRouteLayer.addTo(window._map);
}

function setMapSheet(mode){
  var sheet=document.querySelector('#pg-mapa .msheet');
  if(!sheet)return;
  if(mode==='proprio'){
    sheet.innerHTML='<div class="mhandle"></div>'+
      '<div class="stitle">Rota de carro próprio</div>'+
      '<div class="brow"><div class="btag" style="background:#1D7D3E">11 min</div><div class="bdesc">UNIT → Terminal D.I.A<small>Rota direta com postos no caminho</small></div><div class="beta">~R$ 12<small>Combustível</small></div></div>'+
      '<div class="brow"><div class="btag" style="background:#FF6C18">POSTO</div><div class="bdesc">Posto de Gasolina<small>Gasolina, etanol e diesel</small></div><div class="beta">2 min<small>Da rota</small></div></div>'+
      '<div class="brow"><div class="btag" style="background:#16A34A">EV</div><div class="bdesc">Eletroposto Unit<small>Carregador rápido · 50 kW</small></div><div class="beta">5 min<small>Da rota</small></div></div>';
    return;
  }
  sheet.innerHTML='<div class="mhandle"></div>'+
    '<div class="stitle">Linhas em tempo real</div>'+
    '<div class="brow"><div class="btag">100 1 CS1</div><div class="bdesc">Atalaia ↔ Terminal D.I.A<small>Via José Carlos Silva</small></div><div class="beta">27 min<small>Próx: 32 min</small></div></div>'+
    '<div class="brow"><div class="btag" style="background:var(--blue)">401</div><div class="bdesc">Unit ↔ Terminal D.I.A<small>Via Tancredo Neves</small></div><div class="beta">32 min<small>Próx: 44 min</small></div></div>'+
    '<div class="brow"><div class="btag" style="background:var(--yellow);color:var(--blue)">720</div><div class="bdesc">Unit ↔ Centro<small>Via Josino José de Almeida</small></div><div class="beta">30 min<small>Próx: 28 min</small></div></div>';
}

function renderMapMode(mode){
  if(!window._map||!_mapHelpers)return;
  _mapMode=mode==='proprio'?'proprio':'bus';
  clearMapRouteLayer();
  setMapSheet(_mapMode);

  var map=window._map;
  var h=_mapHelpers;
  var stops=_mapMode==='proprio'?_mapData.carStops:_mapData.busStops;
  var color=_mapMode==='proprio'?'#1D7D3E':'#FF6C18';
  var routeStyle={color:color,weight:4,opacity:.9,lineCap:'round'};
  if(_mapMode==='bus')routeStyle.dashArray='10,7';

  L.polyline(stops,routeStyle).addTo(_mapRouteLayer);
  stops.forEach(function(s,i){
    if(i===0||i===stops.length-1)return;
    L.circleMarker(s,{radius:5,color:color,fillColor:'#fff',fillOpacity:1,weight:2.5}).addTo(_mapRouteLayer);
  });

  L.marker(stops[0],{icon:h.mk(h.pill(_mapMode==='proprio'?'UNIT':'UNIT',color,'#fff'),60,32)})
    .addTo(_mapRouteLayer).bindPopup('<b>UNIT</b><br>Partida da rota');
  L.marker(stops[stops.length-1],{icon:h.mk(h.pill('Teatro Tobias B.','#0B2D6A','#fff'),140,32)})
    .addTo(_mapRouteLayer).bindPopup('<b>Terminal D.I.A</b><br>Destino final');

  L.marker(_mapData.USR,{icon:h.mk(
    '<div style="width:22px;height:22px;background:#0B2D6A;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;">'+
    '<div style="width:8px;height:8px;background:#fff;border-radius:50%;"></div></div>',22,22)})
    .addTo(_mapRouteLayer).bindPopup('<b>Você está aqui</b><br>Localização atual');

  if(_mapMode==='proprio'){
    _mapData.fuel.forEach(function(item){
      var isCharge=item.kind==='charge';
      var label=isCharge?'EV':'G';
      var bg=isCharge?'#16A34A':'#FF6C18';
      L.marker(item.p,{icon:h.mk(h.dot(label,bg,'#fff'),20,20)})
        .addTo(_mapRouteLayer).bindPopup('<b>'+item.name+'</b><br>'+item.info);
    });
    var car=L.marker(stops[0],{icon:h.mk(h.pill('Carro próprio','#1D7D3E','#fff'),130,32)}).addTo(_mapRouteLayer);
    car.bindPopup('<b>Carro próprio</b><br>Rota direta · Postos e carregadores no caminho');
    var ci=0,cd=1;
    _mapMoveTimer=setInterval(function(){
      ci+=cd;
      if(ci>=stops.length-1)cd=-1;
      if(ci<=0)cd=1;
      ci=Math.max(0,Math.min(stops.length-1,ci));
      car.setLatLng(stops[ci]);
    },2000);
  } else {
    _mapData.alerts.forEach(function(a){
      L.marker(a.p,{icon:h.mk(h.dot(a.icon,a.bg,a.icon==='Obra'?'#0B2D6A':'#fff'),34,34)})
        .addTo(_mapRouteLayer).bindPopup('<b>'+a.title+'</b><br>'+a.body+'<br><span style="color:#FF6C18;font-weight:600">'+a.extra+'</span>');
    });
    var bus=L.marker(stops[0],{icon:h.mk(h.pill('100 1 CS1','#FF6C18','#fff'),90,32)}).addTo(_mapRouteLayer);
    bus.bindPopup('<b>Ônibus 100 1 CS1</b><br>Em operação · 100% elétrico<br>Chegada estimada: 27 min');
    var bi=0,bd=1;
    _mapMoveTimer=setInterval(function(){
      bi+=bd;
      if(bi>=stops.length-1)bd=-1;
      if(bi<=0)bd=1;
      bi=Math.max(0,Math.min(stops.length-1,bi));
      bus.setLatLng(stops[bi]);
    },2000);
  }

  map.fitBounds(L.polyline(stops).getBounds(),{padding:[70,70]});
  setTimeout(function(){map.invalidateSize(true);},120);
}
