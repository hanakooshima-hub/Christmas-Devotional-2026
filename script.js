let devotions = [], current = 0, lang = 'en';
const completed = new Set(JSON.parse(localStorage.getItem('christmasCompleted') || '[]'));
const notes = JSON.parse(localStorage.getItem('christmasNotes') || '{}');
const $ = id => document.getElementById(id);
const text = (obj) => obj[lang] || obj.en;
function dateLabel(iso){return new Date(iso+'T12:00:00').toLocaleDateString(lang==='ja'?'ja-JP':'en-GB',{year:'numeric',month:'long',day:'numeric'});}
function render(){
 const d=devotions[current]; if(!d)return;
 $('dayNumber').textContent=(lang==='ja'?'第':'DAY ')+(lang==='ja'?d.day+'日':d.day);
 $('dateText').textContent=dateLabel(d.date); $('theme').textContent=text(d.theme);
 $('title').textContent=text(d.title); $('scripture').textContent=d.scripture;
 $('reflection').textContent=text(d.reflection); $('prayer').textContent=text(d.prayer);
 $('phrase').textContent=d.english.phrase; $('meaning').textContent=d.english.meaning; $('phraseNote').textContent=d.english.note;
 $('question').textContent=text(d.question); $('journal').value=notes[d.day]||'';
 $('completeBtn').textContent=completed.has(d.day)?(lang==='ja'?'完了 ✓':'Completed ✓'):(lang==='ja'?'完了にする ✓':'Mark as completed ✓');
 $('prevBtn').disabled=current===0; $('nextBtn').disabled=current===devotions.length-1;
 $('daySelect').value=current;
 document.querySelectorAll('.day-chip').forEach((b,i)=>b.classList.toggle('active',i===current));
 updateProgress(); updateLabels();
}
function updateLabels(){
 const ja=lang==='ja';
 $('tagline').textContent=ja?'クリスマスに向けて心を整える44日間':'44 days to prepare your heart for Christmas';
 $('progressLabel').textContent=ja?'あなたの歩み':'YOUR JOURNEY';
 $('chooseDay').textContent=ja?'日を選ぶ':'Choose a day';
 $('scriptureLabel').textContent=ja?'今日の聖書箇所':'TODAY’S SCRIPTURE';
 $('scriptureHint').textContent=ja?'お好きな聖書訳でこの箇所を読んでみましょう。':'Read the passage in your preferred Bible translation.';
 $('reflectionLabel').textContent=ja?'黙想':'REFLECTION'; $('prayerLabel').textContent=ja?'今日の祈り':'TODAY’S PRAYER';
 $('journalLabel').textContent=ja?'私の気づき・祈りのノート':'MY REFLECTION & PRAYER JOURNAL';
 $('journal').placeholder=ja?'気づいたことや祈りを書いてみましょう…':'Write your thoughts or prayer here...';
 $('privacyNote').textContent=ja?'メモはこの端末のこのブラウザだけに保存されます。GitHubには公開されません。':'Your journal is saved only in this browser on this device. It is not uploaded to GitHub.';
 $('completeBtn').textContent=completed.has(devotions[current].day)?(ja?'完了 ✓':'Completed ✓'):(ja?'完了にする ✓':'Mark as completed ✓');
 $('prevBtn').textContent=ja?'← 前の日':'← Previous'; $('nextBtn').textContent=ja?'次の日 →':'Next →';
}
function updateProgress(){
 const n=completed.size; $('progressText').textContent=lang==='ja'?`${n} / 44 日完了`:`${n} / 44 days`;
 $('progressBar').style.width=(n/44*100)+'%';
 document.querySelectorAll('.day-chip').forEach((b,i)=>b.classList.toggle('done',completed.has(i+1)));
}
function buildDayNav(){
 $('daySelect').innerHTML=''; $('dayList').innerHTML='';
 devotions.forEach((d,i)=>{
  const o=document.createElement('option');o.value=i;o.textContent=`${lang==='ja'?'第':''}${d.day}${lang==='ja'?'日':''} · ${text(d.title)}`;$('daySelect').append(o);
  const b=document.createElement('button');b.className='day-chip';b.textContent=d.day;b.title=text(d.title);b.onclick=()=>{saveNote();current=i;render();};$('dayList').append(b);
 });
}
function saveNote(){if(!devotions[current])return;notes[devotions[current].day]=$('journal').value;localStorage.setItem('christmasNotes',JSON.stringify(notes));}
$('journal').addEventListener('input',saveNote);
$('daySelect').addEventListener('change',e=>{saveNote();current=Number(e.target.value);render();});
$('prevBtn').onclick=()=>{saveNote();if(current>0){current--;render();}};
$('nextBtn').onclick=()=>{saveNote();if(current<43){current++;render();}};
$('completeBtn').onclick=()=>{const n=devotions[current].day;completed.has(n)?completed.delete(n):completed.add(n);localStorage.setItem('christmasCompleted',JSON.stringify([...completed]));render();};
$('languageBtn').onclick=()=>{saveNote();lang=lang==='en'?'ja':'en';$('languageBtn').textContent=lang==='en'?'日本語':'English';buildDayNav();render();};
function countdown(){
 const target=new Date('2026-12-25T00:00:00');const now=new Date();const days=Math.max(0,Math.ceil((target-now)/86400000));
 $('countdown').textContent=lang==='ja'?`クリスマスまであと ${days} 日`:`${days} days until Christmas`;
}
fetch('devotions.json').then(r=>{if(!r.ok)throw new Error('Could not load devotions.json');return r.json();}).then(data=>{devotions=data;buildDayNav();render();countdown();}).catch(err=>{$('title').textContent='Unable to load devotionals';console.error(err);});
