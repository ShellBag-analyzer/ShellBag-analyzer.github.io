(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const menu = $('.menu-toggle');
  const nav = $('#main-nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });

  const types = {
    local: {label:'Локальные папки',short:'Локальная',icon:'▱',description:'Папка на локальном томе в учебном примере.'},
    removable: {label:'Внешний носитель',short:'Внешний',icon:'↗',description:'Папка на внешнем носителе по условиям учебного примера. Одна буква диска не определяет тип устройства.'},
    network: {label:'Сетевые пути',short:'Сетевая',icon:'⌘',description:'Сетевое расположение с UNC-путём в учебном примере.'},
    virtual: {label:'Объекты оболочки',short:'Оболочка',icon:'⊞',description:'Виртуальный объект пространства имён Windows, а не обычный путь на диске.'}
  };
  const registryRoots = {
    'UsrClass.dat': 'Local Settings\\Software\\Microsoft\\Windows\\Shell\\BagMRU',
    'NTUSER.DAT': 'Software\\Microsoft\\Windows\\Shell\\BagMRU'
  };
  // Synthetic records. LastWrite is key modification time in UTC, not a visit event.
  const records = [
    ['Этот компьютер','virtual','Этот компьютер','NTUSER.DAT','0',12,0,'2026-09-29 09:12:08'],
    ['Users','local','C:\\Users','UsrClass.dat','0\\0',21,0,'2026-09-29 09:16:32'],
    ['Analyst','local','C:\\Users\\Analyst','UsrClass.dat','0\\0\\0',28,0,'2026-09-29 09:18:41'],
    ['Documents','local','C:\\Users\\Analyst\\Documents','UsrClass.dat','0\\0\\0\\0',42,1,'2026-09-29 09:25:12'],
    ['Research','local','C:\\Users\\Analyst\\Documents\\Research','UsrClass.dat','0\\0\\0\\0\\0',43,0,'2026-09-29 09:28:06'],
    ['Downloads','local','C:\\Users\\Analyst\\Downloads','UsrClass.dat','0\\0\\0\\1',44,0,'2026-09-29 09:31:54'],
    ['Projects','removable','E:\\Projects','UsrClass.dat','1\\0',61,0,'2026-09-29 10:02:18'],
    ['Field Notes','removable','E:\\Projects\\Field Notes','UsrClass.dat','1\\0\\0',62,1,'2026-09-29 10:07:22'],
    ['Photos','removable','E:\\Projects\\Photos','UsrClass.dat','1\\0\\1',63,0,'2026-09-29 10:13:40'],
    ['Shared','network','\\\\lab-server\\Shared','UsrClass.dat','2\\0',81,0,'2026-09-29 11:04:03'],
    ['Reports','network','\\\\lab-server\\Shared\\Reports','UsrClass.dat','2\\0\\0',82,0,'2026-09-29 11:09:16'],
    ['Библиотеки','virtual','Библиотеки','NTUSER.DAT','1',13,1,'2026-09-29 11:20:28']
  ].map(([name,type,path,hive,keySuffix,nodeSlot,mru,lastWrite],index) => ({
    id:index+1,name,type,path,hive,nodeSlot,mru,lastWrite,
    key:registryRoots[hive]+'\\'+keySuffix,
    created:type==='virtual'||type==='network' ? null : '2026-09-10 08:00:00',
    modified:type==='virtual'||type==='network' ? null : '2026-09-27 16:42:00',
    accessed:type==='virtual'||type==='network' ? null : '2026-09-28 12:10:00'
  }));
  const folderIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 19V7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9zM3 10h18"/></svg>';
  const searchIcon = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg>';
  $('#explorer-app').innerHTML = `
    <div class="explorer-titlebar"><div><span class="window-dot"></span><strong>shellbag_analyzer</strong><span class="titlebar-slash">/</span><span class="titlebar-sub">пример реестра</span></div><span class="demo-badge">УЧЕБНЫЕ ДАННЫЕ</span></div>
    <div class="explorer-layout">
      <aside class="explorer-sidebar" aria-label="Фильтр по типу расположения">
        <span class="sidebar-label">ТИП РАСПОЛОЖЕНИЯ</span>
        <button type="button" class="filter-button active" data-filter="all" aria-pressed="true"><span class="filter-symbol">⊞</span><span>Все записи</span><b>${records.length}</b></button>
        ${Object.entries(types).map(([type,info]) => `<button type="button" class="filter-button" data-filter="${type}" aria-pressed="false"><span class="filter-symbol ${type}">${info.icon}</span><span>${info.label}</span><b>${records.filter(record=>record.type===type).length}</b></button>`).join('')}
        <div class="sidebar-bottom"><span class="sidebar-label">ИСТОЧНИКИ ПРИМЕРА</span><div class="volume"><span>▤</span> UsrClass.dat</div><div class="volume"><span>▤</span> NTUSER.DAT</div><p>Профиль: Analyst<br>Метки ключей: UTC</p></div>
      </aside>
      <div class="explorer-main">
        <div class="explorer-toolbar"><label class="searchbox">${searchIcon}<span class="sr-only">Поиск по папке, пути, ключу или файлу реестра</span><input id="event-search" type="search" placeholder="Папка, путь или ключ реестра…" autocomplete="off" maxlength="200" spellcheck="false"><kbd>/</kbd></label><button type="button" id="export-csv" class="export-button" aria-label="Экспортировать учебные записи в CSV"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M10 2v10m-4-4 4 4 4-4M4 13v4h12v-4"/></svg><span>Экспорт CSV</span></button></div>
        <div class="table-scroll" tabindex="0" role="region" aria-label="Таблица учебных ShellBags — прокрутите по горизонтали на узком экране"><table><caption class="sr-only">Учебные записи ShellBags. Время означает изменение ключа реестра в UTC. Нажмите на папку, чтобы посмотреть источник и детали.</caption><thead><tr><th scope="col">ПАПКА / ПУТЬ</th><th scope="col">ТИП</th><th scope="col">ИЗМ. КЛЮЧА · UTC</th><th scope="col">ИСТОЧНИК</th></tr></thead><tbody id="event-rows"></tbody></table><div id="empty-state" hidden><strong>Записей не найдено</strong><p>Попробуйте другой путь или сбросьте фильтры.</p><button type="button" id="reset-filters">Сбросить фильтры</button></div></div>
        <div class="explorer-bottom"><span id="result-count" role="status" aria-live="polite"></span><div class="pagination"><button type="button" id="previous-page" aria-label="Предыдущая страница">‹</button><span id="page-count"></span><button type="button" id="next-page" aria-label="Следующая страница">›</button></div></div>
      </div>
    </div>
    <div class="explorer-footnote"><span>⊞ <span>Нажмите на папку: путь, источник, BagMRU и NodeSlot.</span></span><span>LOCAL DEMO · NO SCAN</span></div>`;
  const input = $('#event-search');
  const rows = $('#event-rows');
  const state = {type:'all',query:'',page:0};
  const pageSize = 7;
  function filtered() {
    return records.filter(record => (state.type==='all'||record.type===state.type) && (!state.query||[record.name,record.path,record.key,record.hive,String(record.nodeSlot)].some(value=>value.toLocaleLowerCase('ru').includes(state.query)))).sort((a,b)=>b.lastWrite.localeCompare(a.lastWrite));
  }
  function render() {
    const list=filtered();
    const pages=Math.max(1,Math.ceil(list.length/pageSize));
    state.page=Math.min(state.page,pages-1);
    rows.innerHTML=list.slice(state.page*pageSize,(state.page+1)*pageSize).map(record=>`<tr><td><button type="button" class="file-name" data-id="${record.id}" aria-label="Подробности папки ${escape(record.name)}">${folderIcon}<span>${escape(record.name)}<small>${escape(record.path)}</small></span></button></td><td><span class="event-badge ${record.type}"><i>${types[record.type].icon}</i>${types[record.type].short}</span></td><td><time datetime="${record.lastWrite.replace(' ','T')}Z" title="Изменение ключа реестра, UTC">${record.lastWrite.substring(11)}<small class="key-date">${record.lastWrite.substring(0,10)}</small></time></td><td class="hive-value">${escape(record.hive)}</td></tr>`).join('');
    $('#empty-state').hidden=list.length>0;
    $('#result-count').textContent=list.length?`${state.page*pageSize+1}–${Math.min((state.page+1)*pageSize,list.length)} из ${list.length} записей`:'0 записей';
    $('#page-count').textContent=`${state.page+1} / ${pages}`;
    $('#previous-page').disabled=state.page===0;
    $('#next-page').disabled=state.page===pages-1;
    $('#export-csv').disabled=list.length===0;
    document.querySelectorAll('[data-filter]').forEach(button=>{const active=button.dataset.filter===state.type;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  }
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{state.type=button.dataset.filter;state.page=0;render();}));
  input.addEventListener('input',()=>{state.query=input.value.trim().toLocaleLowerCase('ru');state.page=0;render();});
  $('#reset-filters').addEventListener('click',()=>{state.query='';state.type='all';state.page=0;input.value='';render();input.focus();});
  $('#previous-page').addEventListener('click',()=>{state.page--;render();});
  $('#next-page').addEventListener('click',()=>{state.page++;render();});
  const dialog = $('#event-dialog');
  function details(id) {
    const record=records.find(record=>record.id===id);
    if(!record)return;
    const related=records.filter(other=>other.hive===record.hive && (record.path.startsWith(other.path+'\\')||other.path.startsWith(record.path+'\\')||other.id===record.id)).sort((a,b)=>a.path.length-b.path.length);
    const field=(label,value)=>`<div><dt>${label}</dt><dd>${escape(value??'Нет данных в примере')}</dd></div>`;
    $('#dialog-content').innerHTML=`<p class="eyebrow">SHELLBAG / УЧЕБНАЯ ЗАПИСЬ</p><h2 id="dialog-title">${escape(record.name)}</h2><span class="event-badge ${record.type}"><i>${types[record.type].icon}</i>${types[record.type].short}</span><p class="dialog-description">${types[record.type].description}</p><dl class="event-details">${field('Путь объекта',record.path)}${field('Файл реестра',record.hive)}${field('Текущий ключ BagMRU',record.key)}${field('LastWrite текущего ключа · UTC',record.lastWrite)}${field('NodeSlot → Bags',record.nodeSlot)}${field('MRU-позиция в родительской ветви',record.mru)}</dl><h3 class="sequence-heading">Сохранённые метки папки · UTC</h3><dl class="event-details">${field('Создание объекта',record.created)}${field('Изменение объекта',record.modified)}${field('Доступ к объекту',record.accessed)}</dl><p class="dialog-note">Эти значения относятся к объекту папки. LastWrite относится к ключу реестра. Их нельзя автоматически считать точным временем посещения.</p><h3 class="sequence-heading">Связанные папки в примере</h3><ol class="detail-sequence">${related.map(other=>`<li class="${other.id===record.id?'selected':''}"><span class="sequence-folder-icon">${folderIcon}</span><div><strong>${escape(other.name)}</strong><span>${escape(other.path)}</span></div><i>↳</i></li>`).join('')}</ol><p class="dialog-note">Вымышленные данные. MRU-позиции сравниваются только внутри одного родительского ключа. Запись не устанавливает факт открытия файла или удаления папки.</p>`;
    dialog.showModal();
  }
  rows.addEventListener('click',event=>{const button=event.target.closest('[data-id]');if(button)details(Number(button.dataset.id));});
  $('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close();});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')setMenu(false);
    if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.activeElement.isContentEditable&&!dialog.open){event.preventDefault();input.focus();}
  });
  let toastTimer;
  $('#export-csv').addEventListener('click',()=>{
    const list=filtered();
    const quote=value=>'"'+String(value??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
    const csv=[['Папка','Тип','Путь','Файл реестра','Ключ BagMRU','LastWrite ключа UTC','NodeSlot','MRU-позиция в родителе','Создание папки UTC','Изменение папки UTC','Доступ папки UTC','Источник данных'],...list.map(record=>[record.name,types[record.type].short,record.path,record.hive,record.key,record.lastWrite,record.nodeSlot,record.mru,record.created,record.modified,record.accessed,'Учебный пример'])];
    const blob=new Blob(['\uFEFF'+csv.map(row=>row.map(quote).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='shellbag-demo.csv';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
    $('#toast').textContent=`Экспортировано ${list.length} учебных записей.`;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500);
  });
  render();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let preference;
  try{preference=localStorage.getItem('shellbag-motion');}catch{}
  let motion=!reduced.matches&&preference!=='off';
  const motionToggle=$('#motion-toggle');
  function updateMotion(){
    document.documentElement.dataset.motion=motion?'on':'off';
    motionToggle.setAttribute('aria-pressed',String(!motion));
    motionToggle.setAttribute('aria-label',motion?'Приостановить анимации':'Включить анимации');
    motionToggle.querySelector('span').textContent=motion?'Пауза':'Запуск';
    motionToggle.querySelector('svg').innerHTML=motion?'<path d="M6 4h3v12H6zm5 0h3v12h-3z"/>':'<path d="m6 3 11 7-11 7z"/>';
    if(!motion)resetTilt();
  }
  motionToggle.addEventListener('click',()=>{motion=!motion;try{localStorage.setItem('shellbag-motion',motion?'on':'off');}catch{}updateMotion();});
  reduced.addEventListener('change',()=>{motion=!reduced.matches;updateMotion();});
  const stage=$('#folder-stage');
  const visual=$('.folder-visual');
  function resetTilt(){visual.style.setProperty('--tilt-x','0deg');visual.style.setProperty('--tilt-y','0deg');}
  stage.addEventListener('pointermove',event=>{if(!motion||event.pointerType==='touch')return;const rect=stage.getBoundingClientRect();visual.style.setProperty('--tilt-x',`${-(event.clientY-rect.top-rect.height/2)/rect.height*7}deg`);visual.style.setProperty('--tilt-y',`${(event.clientX-rect.left-rect.width/2)/rect.width*9}deg`);},{passive:true});
  stage.addEventListener('pointerleave',resetTilt);
  updateMotion();
  if('IntersectionObserver' in window){
    const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveals.unobserve(entry.target);}}),{threshold:.08});
    document.querySelectorAll('.section-heading,.feature-card,.steps article,.faq-section,.cta').forEach(element=>{element.classList.add('reveal');reveals.observe(element);});
    const visibility=new IntersectionObserver(entries=>stage.classList.toggle('stage-outside',!entries[0].isIntersecting));visibility.observe(stage);
  }
})();
