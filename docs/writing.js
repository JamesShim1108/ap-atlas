import {unitOneWriting as quiz} from './unit-1-support.js';
import {inspectBadges,inspectGuide} from './unit-1-views.js';
import {createWritingStore,updateWritingResponse,reviewWriting,reviseWriting,setWritingScore,writingScore} from './writing-engine.js';

export function createWritingController(ui){
 const {esc,link,crumb,pageTitle}=ui;
 const store=createWritingStore(()=>sessionStorage);
 const words=value=>value.trim()?value.trim().split(/\s+/u).length:0;
 const saveMessage=()=>store.storageOK?'Draft saved in this tab. Closing the tab ends this session.':'Draft kept in memory only. This browser could not save it across a reload.';
 function scoreMessage(){const score=writingScore(store.draft);return score===null?'Self-check: assess all three parts to see your total.':`Your self-check: ${score} / 3. This is your assessment, not an automatic grade.`;}
 function reviewPanel(){
  if(!store.draft.reviewed)return '';
  return `<section class="writing-review" id="writing-review" tabindex="-1" aria-labelledby="writing-review-title"><p class="eyebrow">REVIEW / APE</p><h2 id="writing-review-title">Compare, then revise.</h2><p>Each part is worth one self-assessed point. Look for a direct answer, accurate evidence, and a clear explanation. Other historically defensible answers can work.</p><p id="writing-score" class="note" role="status">${scoreMessage()}</p>${quiz.parts.map(p=>`<article class="writing-review-part"><h3>Part ${p.id.toUpperCase()}</h3><ul>${p.criteria.map(c=>`<li>${esc(c)}</li>`).join('')}</ul><details class="model-answer"><summary>Show one model APE response</summary><dl>${[['answer','Answer'],['prove','Prove'],['explain','Explain']].map(([key,label])=>`<div><dt>${label}</dt><dd>${esc(p.model[key])}</dd></div>`).join('')}</dl><p>${esc(p.alternatives)}</p></details><fieldset class="self-score"><legend>Your assessment of part ${p.id.toUpperCase()}</legend>${[[1,'Meets the criteria: 1 point'],[0,'Needs revision: 0 points']].map(([value,label])=>`<label><input type="radio" name="writing-score-${p.id}" data-writing-score="${p.id}" value="${value}" ${store.draft.scores[p.id]===value?'checked':''}>${label}</label>`).join('')}</fieldset><div class="writing-review-links">${p.review.map(([topic,section,label])=>link(`/topic/${topic}?section=${section}`,`Review ${esc(label)}`)).join('')}</div></article>`).join('')}<button type="button" class="btn" data-writing-action="revise">Revise responses</button><p class="muted">Revising keeps your writing and clears the self-check scores.</p></section>`;
 }
 function page(){
  pageTitle(quiz.title,'Write three APE responses for one Unit 1 SAQ, then review evidence and explanations with InSPECT.');
  return `<div class="container writing-page">${crumb([['Courses','/courses'],['AP World','/course/world'],['Unit 1','/unit/world-1'],['Writing quiz']])}<header class="writing-head"><p class="eyebrow">UNIT 1 / SHORT-ANSWER QUESTION</p><h1>Put it in your words.</h1><p class="writing-meta">1 question · 3 parts · 3 APE responses</p></header><div class="writing-layout"><div class="writing-paper"><div class="writing-prompt"><h2>Building and maintaining authority</h2><p>${esc(quiz.prompt)}</p></div><p>${esc(quiz.instructions)}</p><div class="ape-steps"><div><b>A / Answer</b><span>Make a direct claim.</span></div><div><b>P / Prove</b><span>Use specific evidence.</span></div><div><b>E / Explain</b><span>Connect evidence to the claim.</span></div></div><form class="writing-form">${quiz.parts.map(p=>`<section class="writing-part"><div class="writing-part-heading"><span class="part-letter" aria-hidden="true">${p.id.toUpperCase()}</span><label for="writing-${p.id}"><span class="visually-hidden">Part ${p.id.toUpperCase()}. </span>${esc(p.prompt)}</label></div>${inspectBadges(p.lenses,esc)}<textarea id="writing-${p.id}" name="${p.id}" data-writing-part="${p.id}" rows="7" maxlength="10000" required ${store.draft.reviewed?'readonly':''} aria-describedby="writing-${p.id}-help" placeholder="Answer the question. Prove it with a specific example. Explain the connection.">${esc(store.draft.responses[p.id])}</textarea><div class="writing-field-meta"><small id="writing-${p.id}-help">One complete APE response.</small><small id="writing-${p.id}-count">${words(store.draft.responses[p.id])} words</small></div></section>`).join('')}<p id="writing-save" class="muted">${saveMessage()}</p>${store.draft.reviewed?'<p class="note">Responses are ready for review below. Choose Revise responses to edit them.</p>':'<button class="btn" type="submit">Review my three responses</button><p class="writing-review-note">Reveals self-check criteria and optional model answers. No automatic grading.</p>'}</form>${reviewPanel()}</div><aside class="writing-sidebar"><div class="side-note"><h2>A short paragraph is enough.</h2><p>Use a concrete example, then explain what it shows. Part C needs evidence for both societies.</p><p>You do not need an introduction or conclusion for the whole question.</p>${link('/guide/world-1','Open the unit study guide','text-link')}</div>${inspectGuide(esc)}<p class="writing-disclosure">${esc(quiz.note)}</p></aside></div></div>`;
 }
 function input(e){
  const field=e.target.closest('textarea[data-writing-part]');if(!field)return false;
  if(updateWritingResponse(store.draft,field.dataset.writingPart,field.value)){
   field.setCustomValidity('');store.save();
   document.getElementById(`writing-${field.dataset.writingPart}-count`).textContent=`${words(field.value)} words`;
   document.getElementById('writing-save').textContent=saveMessage();
  }
  return true;
 }
 function submit(e,render){
  const form=e.target.closest('.writing-form');if(!form)return false;e.preventDefault();
  for(const p of quiz.parts){
   const field=form.elements.namedItem(p.id);
   if(!field.value.trim()){field.setCustomValidity('Write an APE response for this part before reviewing.');field.reportValidity();field.focus();return true;}
   updateWritingResponse(store.draft,p.id,field.value);
  }
  if(reviewWriting(store.draft)){store.save();render();const panel=document.getElementById('writing-review');panel.focus({preventScroll:true});panel.scrollIntoView({block:'start'});}
  return true;
 }
 function change(e){
  const field=e.target.closest('[data-writing-score]');if(!field)return false;
  if(setWritingScore(store.draft,field.dataset.writingScore,Number(field.value))){store.save();document.getElementById('writing-score').textContent=scoreMessage();document.getElementById('writing-save').textContent=saveMessage();}
  return true;
 }
 function click(e,render){
  const control=e.target.closest('[data-writing-action]');if(!control)return false;
  if(control.dataset.writingAction==='revise'){reviseWriting(store.draft);store.save();render();document.getElementById('writing-a').focus();}
  return true;
 }
 return {page,input,submit,change,click};
}
