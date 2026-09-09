import {courses,units,topics,lessons,vocabulary,connections,concepts,quizzes} from './content.js';
import {questionById,quizById,createAttempt,checkAnswer,nextQuestion,summarize,weakQuestionIds,validateAttempt} from './engine.js';

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<span aria-hidden="true">→</span>';
const firstCourse=courses.find(c=>c.status==='ready');
const firstTopic=topics.find(t=>t.status==='ready');
// Keep the existing storage key so a branding change does not erase active quizzes.
const key='ap-atlas-attempts-v1';
let attempts={},storageOK=true;
try{const parsed=JSON.parse(sessionStorage.getItem(key)||'{}');for(const [id,a] of Object.entries(parsed??{})){if(validateAttempt(a)&&id===a.quizId)attempts[id]=a;}sessionStorage.setItem(key,JSON.stringify(attempts));}catch{storageOK=false;}
function save(){try{sessionStorage.setItem(key,JSON.stringify(attempts));}catch{storageOK=false;}}
function path(){const raw=location.hash.slice(1)||'/';const [pathname,query='']=raw.split('?');return {parts:pathname.split('/').filter(Boolean),params:new URLSearchParams(query)};}
function navigate(url){const hash='#'+url;if(location.hash===hash)render(true);else location.hash=hash;}
function link(url,label,cls=''){return `<a href="#${url}" class="${cls}">${label}</a>`;}
function button(label,action,quizId,cls='btn',extra=''){return `<button class="${cls}" data-action="${action}" data-quiz="${esc(quizId)}" ${extra}>${label}</button>`;}
function crumb(items){return `<nav class="breadcrumbs" aria-label="Breadcrumb">${items.map((it,i)=>(i?'<span aria-hidden="true">/</span>':'')+(it[1]?link(it[1],esc(it[0])):`<span aria-current="page">${esc(it[0])}</span>`)).join('')}</nav>`;}
function badge(status,label){return `<span class="pill ${status==='soon'?'soon':''}">${esc(label||(status==='soon'?'Coming soon':'Available now'))}</span>`;}
function pageTitle(title,description){document.title=`${title} — AP study`;document.querySelector('meta[name="description"]').content=description;}
function contextForTopic(topic){const unit=units.find(u=>u.id===topic.unitId);return {unit,course:courses.find(c=>c.id===unit.courseId)};}
function topicCrumbs(t,tail=null){const {unit,course}=contextForTopic(t);return [['Courses','/courses'],[course.shortTitle,`/course/${course.id}`],[`Unit ${unit.number}`,`/unit/${unit.id}`],[`Topic ${t.code}`,tail?`/topic/${t.id}`:null],...(tail?[[tail,null]]:[])];}
function quizFor(t,type='topic'){return quizzes.find(q=>q.topicId===t.id&&q.quizType===type);}
function quizStart(q,label='Take topic quiz'){const a=attempts[q.id];return a&&!a.complete?link(`/quiz/${q.id}`,`Resume quiz ${arrow}`,'btn'):button(`${label} ${arrow}`,'start',q.id);}

function readyTopicsFor(c){
 const unitIds=new Set(units.filter(u=>u.courseId===c.id).map(u=>u.id));
 return topics.filter(t=>unitIds.has(t.unitId)&&t.status==='ready');
}
function courseCard(c){
 const ready=readyTopicsFor(c),available=c.status==='ready'&&ready.length>0;
 return `<article class="course-feature course-catalog-card" aria-labelledby="course-${esc(c.id)}-title">
  <div class="catalog-description">${badge(available?'ready':'soon',available?`${ready.length} ${ready.length===1?'topic':'topics'} available`:null)}
   <h2 id="course-${esc(c.id)}-title">${esc(c.title)}</h2><p class="period">${esc(c.period)}</p><p class="feature-info">${esc(c.description)}</p>
  </div>
  <div class="catalog-entry"><p class="eyebrow">${available?'Ready to study':'In development'}</p>
   <ul class="catalog-topics">${ready.slice(0,3).map(t=>`<li><span>${esc(t.code)}</span>${esc(t.title)}</li>`).join('')}</ul>
   ${available?link(`/course/${c.id}`,`Open course ${arrow}`,'btn'):badge('soon')}
   <p class="feature-foot">${available?'More topics are on the way.':'Lessons and practice are being prepared.'}</p>
  </div>
 </article>`;
}
function coursePreview(){
 const courseDescription='Explore how states rose, belief systems spread, trade networks connected regions, and revolutions reshaped societies from c. 1200 to the present.';
 const cards=Array.from({length:7},(_,i)=>`<div class="preview-card preview-course${i===2?' is-active':''}"><span class="preview-label">Available course</span><h3>${esc(firstCourse.title)}</h3><p class="preview-period">${esc(firstCourse.period)}</p><p class="preview-description">${esc(courseDescription)}</p><div class="preview-foot">Topics 1.1 and 1.2 available now</div></div>`).join('');
 return `<aside class="course-preview" aria-label="Available courses">
  <div class="preview-toolbar"><span>Courses</span><button type="button" class="preview-pause" data-action="toggle-preview" aria-pressed="false" aria-controls="course-preview-track" aria-label="Pause animation" title="Pause animation"><svg class="preview-icon preview-icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6v12M16 6v12"/></svg><svg class="preview-icon preview-icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 9 6-9 6Z"/></svg></button></div>
  <p class="visually-hidden">Course preview: ${esc(firstCourse.title)}. More AP courses will be added later.</p>
  <div class="preview-viewport" aria-hidden="true"><div class="preview-track" id="course-preview-track">${cards}</div></div>
  <p class="preview-caption">AP World History is available now. More AP courses are coming.</p>
 </aside>`;
}
function home(){
 pageTitle('Study smarter for AP','Free AP lessons, key terms, and practice questions in one place. Choose a course, study a topic, and find what to review next.');
 const resume=Object.values(attempts).find(a=>!a.complete&&quizById[a.quizId].quizType==='topic');
 return `<div class="container">
  <section class="home-top" aria-labelledby="home-title"><div class="home-copy"><p class="eyebrow">A clearer way to study</p><h1 id="home-title">Study smarter<br>for <em>AP.</em></h1><p class="home-intro">Lessons, key terms, and practice in one place. Understand the concepts, test what you know, and find what to review next.</p><div class="actions"><a href="#/?section=courses" class="btn">Browse courses ${arrow}</a>${resume?link(`/quiz/${resume.quizId}`,'Continue your quiz','text-link'):''}</div><p class="free-note">Free access · No account needed</p></div>${coursePreview()}</section>
  <section class="home-courses" id="courses" aria-labelledby="courses-title"><div class="section-heading"><h2 id="courses-title">Courses</h2>${link('/courses',`View all courses ${arrow}`,'text-link')}</div><div class="course-catalog">${courses.map(courseCard).join('')}</div><p class="catalog-note">Starting with AP World History. More AP courses to come.</p></section>
  <section class="how-section"><div class="section-heading"><h2>A little learning. A clearer next step.</h2></div><div class="step-grid"><div class="step"><div class="step-index">01</div><div><h3>Understand the idea</h3><p>Short explanations, useful terms, and connections that make the facts stick.</p></div></div><div class="step"><div class="step-index">02</div><div><h3>Put it into practice</h3><p>One question at a time, with an explanation after every answer.</p></div></div><div class="step"><div class="step-index">03</div><div><h3>Know what to revisit</h3><p>See which concepts went well and which deserve another look.</p></div></div></div></section>
 </div>`;
}
function courseList(){pageTitle('Courses','Choose an AP course for lessons, vocabulary, and practice. AP World History is the first course available.');return `<div class="container">${crumb([['Home','/'],['Courses']])}<div class="page-intro"><p class="eyebrow">Choose your starting point</p><h1>Your course. Your pace.</h1><p>Start with a topic, understand the connections, and test what you know.</p></div><div class="courses-list course-catalog">${courses.map(courseCard).join('')}</div></div>`;}
function coursePage(c){
 pageTitle(c.title,c.description);const list=units.filter(u=>u.courseId===c.id);const readyTopic=topics.find(t=>t.status==='ready'&&list.some(u=>u.id===t.unitId));
 return `<div class="container">${crumb([['Courses','/courses'],[c.shortTitle]])}<div class="page-intro"><p class="eyebrow">${esc(c.period)} · ${list.length} units</p><h1>${esc(c.title)}</h1><p>${esc(c.description)}</p></div><div class="course-layout"><div><div class="section-heading"><h2>Explore the units</h2><small class="muted">Unit 1 is your starting point</small></div><div class="unit-list">${list.map(u=>{const ready=u.status==='ready';return `<${ready?'a':'div'} ${ready?`href="#/unit/${esc(u.id)}"`:''} class="unit-row ${ready?'is-ready':''}"><span class="unit-number">${String(u.number).padStart(2,'0')}</span><div><h3>${esc(u.title)}</h3><p>${esc(u.period)}</p></div><div class="status">${badge(u.status,ready?`${topics.filter(t=>t.unitId===u.id&&t.status==='ready').length} topics ready`:null)}${ready?'<span class="big-arrow" aria-hidden="true">→</span>':''}</div></${ready?'a':'div'}>`;}).join('')}</div></div><aside class="side-note"><p class="eyebrow">Start small</p><h3>One topic is enough for today.</h3><p>Learn how Song China’s government, beliefs, and economy fit together.</p>${readyTopic?link(`/topic/${readyTopic.id}`,`Start Topic ${readyTopic.code} ${arrow}`,'btn'):''}<p style="font-size:.8rem;margin:1rem 0 0">Topics 1.1 and 1.2 are ready. The remaining topics are in progress.</p></aside></div></div>`;
}
function unitPage(u){
 const c=courses.find(c=>c.id===u.courseId);if(u.status!=='ready')return comingSoon(u.title,`/course/${c.id}`);
 pageTitle(`Unit ${u.number}: ${u.title}`,u.description);const list=topics.filter(t=>t.unitId===u.id);
 return `<div class="container">${crumb([['Courses','/courses'],[c.shortTitle,`/course/${c.id}`],[`Unit ${u.number}`]])}<div class="page-intro"><div class="unit-titleline"><p class="eyebrow">Unit ${u.number} · ${esc(u.period)}</p>${badge('ready',`${list.filter(t=>t.status==='ready').length} of ${list.length} topics available`)}</div><h1>${esc(u.title)}</h1><p>${esc(u.description)}</p></div><div class="course-layout"><div><div class="section-heading"><h2>Choose a topic</h2><small class="muted">Learn → Review → Practice</small></div><div class="topic-list">${list.map(t=>`<${t.status==='ready'?'a':'div'} ${t.status==='ready'?`href="#/topic/${t.id}"`:''} class="topic-row ${t.status==='ready'?'ready':''}"><span class="topic-code">${t.code}</span><div><h3>${esc(t.title)}, ${esc(t.period)}</h3>${t.summary?`<p>${esc(t.summary)}</p>`:''}</div>${t.status==='ready'?'<span class="big-arrow" aria-hidden="true">→</span>':badge('soon')}</${t.status==='ready'?'a':'div'}>`).join('')}</div><div class="unit-tools"><div class="unit-tool"><h3>Unit Study Guide</h3>${badge('soon')}<p>A unit-wide review of the big ideas.</p></div><div class="unit-tool"><h3>Unit Practice</h3>${badge('soon')}<p>Practice across all seven topics.</p></div></div></div><aside class="side-note"><p class="eyebrow">Keep this question in mind</p><h3>How did societies organize power?</h3><p>Look at who governed, what justified their authority, and how their economies supported them.</p><p style="margin:0">As more topics arrive, compare these patterns across regions.</p></aside></div></div>`;
}
function lessonPage(t,section){
 if(t.status!=='ready'||!lessons[t.id])return comingSoon(`${t.code} ${t.title}`,`/unit/${t.unitId}`);
 const l=lessons[t.id],q=quizFor(t),quick=quizFor(t,'quick');
 pageTitle(`${t.code} ${t.title}, ${t.period}`,t.summary);
 const terms=vocabulary.filter(v=>v.topicId===t.id),conns=connections.filter(c=>c.topicId===t.id);
 return `<div class="container">${crumb(topicCrumbs(t))}<div class="lesson-grid"><aside class="lesson-nav" aria-label="Lesson sections"><p class="eyebrow">On this page</p>${[['learn','Learn'],['terms','Key terms'],['connections','Connections'],['practice','Quick practice']].map(([id,name])=>link(`/topic/${t.id}?section=${id}`,name)).join('')}${quizStart(q)}<p class="nav-note">${q.questionIds.length} questions · Explanations included<br>No timer. Take your time.</p></aside><article><header class="lesson-head"><p class="eyebrow">Topic ${t.code} · The Global Tapestry</p><h1>${esc(t.title)}</h1><p class="date-line">${esc(t.period)}</p><p class="lede">${esc(t.summary)}</p><div class="lesson-meta"><span>About ${l.minutes} min to read</span><span>${terms.length} key terms</span><span>Original lesson</span></div></header><div class="big-idea"><p class="eyebrow">The big idea</p><p>${esc(l.bigIdea)}</p></div><section class="lesson-section" id="learn"><h2><span class="section-number">01 / LEARN</span>Understand the story.</h2><p class="note"><strong>Place it in time.</strong> ${esc(l.context)}</p>${l.sections.map(s=>`<div class="concept" id="${s.id}"><h3>${esc(s.title)}</h3>${s.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}<p class="note"><strong>Remember:</strong> ${esc(s.takeaway)}</p></div>`).join('')}</section><section class="lesson-section" id="terms"><h2><span class="section-number">02 / KEY TERMS</span>Words worth knowing.</h2><dl class="terms">${terms.map(v=>`<div class="term-row"><dt>${esc(v.term)}</dt><dd>${esc(v.definition)}</dd></div>`).join('')}</dl></section><section class="lesson-section" id="connections"><h2><span class="section-number">03 / CONNECTIONS</span>Go beyond the facts.</h2><div class="connection-list">${conns.map(c=>`<div class="connection"><p class="eyebrow">${esc(c.type)}</p><h3>${esc(c.title)}</h3><p>${esc(c.body)}</p></div>`).join('')}</div></section><section class="lesson-section" id="practice"><h2><span class="section-number">04 / QUICK PRACTICE</span>Check what stuck.</h2><p class="muted">${quick.questionIds.length} short questions before the topic quiz.</p><div class="quick-shell" id="quick-shell">${quickView(quick)}</div></section><section class="quiz-invite"><p class="eyebrow" style="color:#c4d5c9">Ready to put it together?</p><h2>Take the topic quiz.</h2><p>${q.questionIds.length} questions. A clear explanation after each answer. A focused next step when you finish.</p>${quizStart(q)}</section><details class="sources"><summary>About this lesson & references</summary><p>Original study notes and questions, informed by course readings and the AP World framework. This lesson is part of an expanding course.</p><ul>${l.sources.map(s=>`<li>${s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`:esc(s.label)}</li>`).join('')}</ul><p>The questions are original and are not official College Board questions. Study scenarios are written for practice; they are not historical quotations.</p></details></article></div></div>`;
}
function quickView(q){
 if(!attempts[q.id]){attempts[q.id]=createAttempt(q.id,null,'quick');save();}
 const a=attempts[q.id];
 if(a.complete){const r=summarize(a);return `<div class="quick-complete"><h3>Quick check complete: ${r.correct} / ${r.total}</h3><p>${r.correct===r.total?'Nice work. Try the topic quiz to connect these ideas.':'Revisit any concepts that felt uncertain, then try the topic quiz.'}</p><p class="muted">These answers are separate from your topic quiz score.</p>${button('Try these checks again','restart-quick',q.id,'btn secondary')}</div>`;}
 return questionView(a,true);
}
function questionView(a,quick=false){
 const id=a.ids[a.index],q=questionById[id],checked=Object.hasOwn(a.answers,id),hit=checked&&a.answers[id]===q.correctAnswer,total=a.ids.length;
 return `<div class="quiz-progress"><span>${quick?'Quick check':'Question'} ${a.index+1} of ${total}</span><span>${checked?a.index+1:a.index} answered</span></div><div class="progress-track" role="progressbar" aria-label="Questions answered" aria-valuenow="${checked?a.index+1:a.index}" aria-valuemin="0" aria-valuemax="${total}"><div class="progress-fill" style="width:${(checked?a.index+1:a.index)/total*100}%"></div></div><form class="question-card" data-quiz="${esc(a.quizId)}" data-question="${esc(id)}"><p class="question-meta">${esc(concepts[q.concept].title)} · ${esc(q.skillTag)}</p>${q.stimulus?`<div class="stimulus"><p class="eyebrow">Practice scenario · Written for this quiz</p><p>${esc(q.stimulus)}</p></div>`:''}<${quick?'h3':'h1'} id="question-heading">${esc(q.prompt)}</${quick?'h3':'h1'}><fieldset class="choices" aria-labelledby="question-heading"><legend class="visually-hidden">Choose one answer</legend>${q.choices.map((choice,i)=>`<label class="choice ${checked&&i===q.correctAnswer?'correct':checked&&i===a.answers[id]?'incorrect':''}"><input type="radio" name="answer" value="${i}" ${checked&&a.answers[id]===i?'checked':''} ${checked?'disabled':''}><span class="choice-letter" aria-hidden="true">${'ABCD'[i]}</span><span><span class="visually-hidden">${'ABCD'[i]}. </span>${esc(choice)}</span>${checked&&i===q.correctAnswer?'<span class="answer-mark">✓ Correct</span>':checked&&i===a.answers[id]?'<span class="answer-mark">✗ Your answer</span>':''}</label>`).join('')}</fieldset>${checked?`<div class="answer-feedback ${hit?'':'wrong'}" id="answer-feedback" tabindex="-1" role="status"><h4>${hit?'✓ Correct':'✗ Incorrect'}</h4>${!hit?`<p><strong>Correct answer:</strong> ${'ABCD'[q.correctAnswer]}. ${esc(q.choices[q.correctAnswer])}</p>`:''}<p><strong>Why:</strong> ${esc(q.explanation)}</p></div>`:''}<div class="question-actions"><p>${checked?'Take a moment to read the explanation.':'Choose an answer, then check it.'}</p>${checked?button(`${a.index===total-1?(quick?'Finish quick check':'See results'):'Next question'} ${arrow}`,'next',a.quizId,'btn',`type="button" data-question="${esc(id)}"`):'<button class="btn" type="submit" disabled>Check answer</button>'}</div></form>`;
}
function quizPage(q){
 const a=attempts[q.id],t=topics.find(t=>t.id===q.topicId);
 pageTitle(q.title,`Practice ${t.title} with original questions and explanations.`);
 if(!a)return `<div class="quiz-page">${crumb(topicCrumbs(t,'Quiz'))}<div class="empty-state"><p class="eyebrow">Topic ${t.code}</p><h1>Ready when you are.</h1><p>${q.questionIds.length} questions, one at a time. Read the explanation after each answer and see what to review at the end.</p>${button(`Start quiz ${arrow}`,'start',q.id)}</div></div>`;
 if(a.complete)return resultsPage(q);
 return `<div class="quiz-page">${crumb(topicCrumbs(t,a.mode==='weak'?'Targeted practice':'Quiz'))}<div class="quiz-context"><p>${a.mode==='weak'?'Practice weak areas':esc(q.title)}<br>${a.mode==='weak'?'Revisiting questions from the topic quiz.':'No timer. Focus on the reasoning.'}</p>${link(`/topic/${t.id}`,'Back to lesson')}</div><div id="quiz-shell">${questionView(a)}</div><p class="question-footnote">${storageOK?'Your answers stay in this browser tab during this session.':'Keep this page open; this browser isn’t saving quiz progress.'}</p></div>`;
}
function resultGroup(title,keys,r,t,needs=false){return `<section class="result-panel ${needs?'needs':''}"><h2><span aria-hidden="true">${needs?'△':'✓'}</span>${title}</h2>${keys.length?keys.map(k=>`<div class="result-item"><div class="result-item-line"><span>${esc(concepts[k].title)}</span><span>${r.tags[k].correct} / ${r.tags[k].total}</span></div><p>Correct in this quiz</p>${link(`/topic/${t.id}?section=${concepts[k].section}`,`${needs?'Review this concept':'Revisit the lesson'} ${arrow}`)}</div>`).join(''):`<p class="result-empty">${needs?'All tested areas met the practice threshold. Keep connecting the ideas.':'No tested area reached the threshold yet. Use the lesson links to work through the concepts.'}</p>`}</section>`;}
function resultsPage(q){
 const a=attempts[q.id],t=topics.find(t=>t.id===q.topicId);
 pageTitle('Your quiz results',`See your results and concepts to review for ${t.title}.`);
 if(!a||!a.complete)return `<div class="results-wrap">${crumb(topicCrumbs(t,'Results'))}<div class="empty-state"><h1>${a?'Finish your quiz first.':'Start with a quiz.'}</h1><p>${a?'Your answers are saved in this tab. Continue where you left off.':'There are no completed results in this tab yet.'}</p>${a?link(`/quiz/${q.id}`,`Continue quiz ${arrow}`,'btn'):button(`Start quiz ${arrow}`,'start',q.id)}</div></div>`;
 const r=summarize(a);
 return `<div class="results-wrap">${crumb(topicCrumbs(t,'Results'))}<header class="result-head"><p class="eyebrow">${a.mode==='weak'?'Targeted practice':'Topic '+t.code} · Results</p><div class="result-score" aria-label="${r.correct} out of ${r.total} correct">${r.correct}<span> / ${r.total}</span></div><p>${r.percent}% correct</p><h1>${r.correct===r.total?'You connected the dots.':r.percent>=50?'Your next step is clearer.':'You have a place to start.'}</h1><p>${r.correct===r.total?'Every answer was correct. Try explaining the connections in your own words.':'Use these results to choose what to review, then give those ideas another try.'}</p></header>${a.mode==='weak'?'<p class="result-explainer">These results cover only your targeted practice. Untested areas are not assessed here.</p>':''}<div class="results-grid">${resultGroup('Strong areas',r.strong,r,t)}${resultGroup('Needs practice',r.weak,r,t,true)}</div><p class="result-explainer"><strong>Based on this quiz:</strong> “Strong” means at least 75% correct in a tested area. A few questions are a useful signal, not proof of mastery or a prediction of your AP score.</p><div class="actions">${r.weak.length?button(`Practice weak areas ${arrow}`,'weak',q.id):link(`/topic/${t.id}?section=connections`,`Review connections ${arrow}`,'btn')}${button('Try another quiz','start',q.id,'btn secondary')}</div><p class="reuse-note">This early version reuses the same questions. Retrying changes the order.</p><section class="review-list"><h2>Review your answers</h2>${a.ids.map((id,i)=>{const x=questionById[id],hit=a.answers[id]===x.correctAnswer;return `<details class="review-question"><summary>${hit?'✓':'✗'} ${i+1}. ${esc(x.prompt)}</summary><p><strong>Your answer:</strong> ${esc(x.choices[a.answers[id]])}</p>${!hit?`<p><strong>Correct answer:</strong> ${esc(x.choices[x.correctAnswer])}</p>`:''}<p>${esc(x.explanation)}</p></details>`;}).join('')}</section></div>`;
}
function comingSoon(title,back){pageTitle(title+' — Coming soon','This course content is being prepared. Topics 1.1 and 1.2 are available now.');return `<div class="empty-state"><p class="eyebrow">Coming soon</p><h1>${esc(title)}</h1><p>This material isn’t available yet. You can study East Asia or Dar al-Islam and take their topic quizzes now.</p>${link(`/topic/${firstTopic.id}`,`Study Topic ${firstTopic.code} ${arrow}`,'btn')}<p style="margin-top:1.5rem">${link(back,'Back to the overview')}</p></div>`;}
function missing(){pageTitle('Page not found','Choose an AP course to continue studying.');return `<div class="empty-state"><h1>Let’s get you back on track.</h1><p>We couldn’t find that page. Pick a course to continue.</p>${link('/courses',`Browse courses ${arrow}`,'btn')}</div>`;}
let previewTimer=null,previewResetTimer=null,previewObserver=null;
function stopCoursePreview(){
 clearInterval(previewTimer);clearTimeout(previewResetTimer);previewObserver?.disconnect();
 previewTimer=previewResetTimer=previewObserver=null;
}
function initCoursePreview(){
 const preview=$('.course-preview'),viewport=preview?.querySelector('.preview-viewport'),track=preview?.querySelector('.preview-track');
 if(!preview||!viewport||!track)return;
 const cards=[...track.querySelectorAll('.preview-card')];let index=2;
 const activate=()=>cards.forEach((card,i)=>card.classList.toggle('is-active',i===index));
 const center=(instant=false)=>{
  track.classList.toggle('is-resetting',instant);
  const card=cards[index],x=viewport.clientWidth/2-(card.offsetLeft+card.offsetWidth/2);
  track.style.transform=`translate3d(${x}px,0,0)`;
  if(instant)requestAnimationFrame(()=>requestAnimationFrame(()=>track.classList.remove('is-resetting')));
 };
 activate();center(true);
 previewObserver=new ResizeObserver(()=>center(true));previewObserver.observe(viewport);
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 previewTimer=setInterval(()=>{
  if(preview.hasAttribute('data-paused'))return;
  index+=1;activate();center();
  if(index===4)previewResetTimer=setTimeout(()=>{index=2;activate();center(true);},650);
 },1800);
}
function render(focus=false){
 stopCoursePreview();
 const {parts,params}=path();let html;
 if(parts.length===0)html=home();
 else if(parts.length===1&&parts[0]==='courses')html=courseList();
 else if(parts.length===2&&parts[0]==='course'){const c=courses.find(c=>c.id===parts[1]);html=c?coursePage(c):missing();}
 else if(parts.length===2&&parts[0]==='unit'){const u=units.find(u=>u.id===parts[1]);html=u?unitPage(u):missing();}
 else if(parts.length===2&&parts[0]==='topic'){const t=topics.find(t=>t.id===parts[1]);html=t?lessonPage(t,params.get('section')):missing();}
 else if(parts.length===2&&['quiz','results'].includes(parts[0])){const q=quizById[parts[1]];html=q&&q.quizType==='topic'?(parts[0]==='quiz'?quizPage(q):resultsPage(q)):missing();}
 else html=missing();
 $('#main').innerHTML=html;
 initCoursePreview();
 for(const [id,active] of [['nav-home',!parts.length],['nav-courses',parts.length>0]]){const el=document.getElementById(id);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');}
 const target=(!parts.length||parts[0]==='topic')&&params.get('section');
 const allowedTargets=!parts.length?['courses']:['learn','terms','connections','practice',...Object.keys(concepts)];
 if(target&&allowedTargets.includes(target)){
  const el=document.getElementById(target);if(el){el.setAttribute('tabindex','-1');el.focus({preventScroll:true});el.scrollIntoView({block:'start'});}
 }else if(focus){window.scrollTo({top:0,behavior:'instant'});$('#main').focus({preventScroll:true});}
}
function refreshQuestion(quizId,focusId){
 const a=attempts[quizId],q=quizById[quizId];
 if(q.quizType==='quick'){$('#quick-shell').innerHTML=quickView(q);}
 else {$('#quiz-shell').innerHTML=questionView(a);}
 const scope=q.quizType==='quick'?$('#quick-shell'):$('#quiz-shell');
 const el=scope.querySelector(focusId);if(el){el.setAttribute('tabindex','-1');el.focus({preventScroll:true});el.scrollIntoView({block:'nearest',behavior:'smooth'});}
}
document.addEventListener('change',e=>{
 const form=e.target.closest('.question-card');if(!form||e.target.name!=='answer')return;
 const b=form.querySelector('button[type="submit"]');if(b)b.disabled=false;
});
document.addEventListener('submit',e=>{
 const form=e.target.closest('.question-card');if(!form)return;e.preventDefault();
 const a=attempts[form.dataset.quiz];const chosen=form.querySelector('input[name="answer"]:checked');
 if(!a||!chosen||a.ids[a.index]!==form.dataset.question)return;
 if(checkAnswer(a,Number(chosen.value))){save();refreshQuestion(a.quizId,'#answer-feedback');}
});
document.addEventListener('click',e=>{
 const skip=e.target.closest('.skip-link');if(skip){e.preventDefault();$('#main').focus();return;}
 const b=e.target.closest('[data-action]');if(!b)return;
 if(b.dataset.action==='toggle-preview'){
  const paused=b.closest('.course-preview').toggleAttribute('data-paused');
  const label=paused?'Play animation':'Pause animation';
  b.setAttribute('aria-pressed',String(paused));b.setAttribute('aria-label',label);b.setAttribute('title',label);return;
 }
 const q=quizById[b.dataset.quiz];if(!q)return;
 const action=b.dataset.action;
 if(action==='start'){
  attempts[q.id]=createAttempt(q.id);save();navigate(`/quiz/${q.id}`);
 }else if(action==='restart-quick'){
  attempts[q.id]=createAttempt(q.id,null,'quick');save();refreshQuestion(q.id,'#question-heading');
 }else if(action==='weak'){
  const prior=attempts[q.id];if(!prior?.complete)return;
  const a=createAttempt(q.id,weakQuestionIds(prior),'weak');if(!a)return;
  attempts[q.id]=a;save();navigate(`/quiz/${q.id}`);
 }else if(action==='next'){
  const a=attempts[q.id];if(!a||a.ids[a.index]!==b.dataset.question||!nextQuestion(a))return;
  save();
  if(q.quizType==='quick')refreshQuestion(q.id,a.complete?'.quick-complete':'#question-heading');
  else if(a.complete)navigate(`/results/${q.id}`);
  else refreshQuestion(q.id,'#question-heading');
 }
});
window.addEventListener('hashchange',()=>render(true));
render();
