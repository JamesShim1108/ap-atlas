import {questions,quizzes} from './content.js';
export const questionById=Object.fromEntries(questions.map(q=>[q.id,q]));
export const quizById=Object.fromEntries(quizzes.map(q=>[q.id,q]));
export function shuffle(ids){const copy=[...ids];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
export function createAttempt(quizId,ids=null,mode='topic'){
 const quiz=quizById[quizId];if(!quiz)return null;
 const valid=(ids??quiz.questionIds).filter(id=>quiz.questionIds.includes(id));
 if(!valid.length)return null;
 return {version:1,quizId,mode,ids:shuffle([...new Set(valid)]),index:0,answers:{},complete:false};
}
export function checkAnswer(attempt,choice){
 if(!attempt||attempt.complete)return false;
 const id=attempt.ids[attempt.index],q=questionById[id];
 if(!q||Object.hasOwn(attempt.answers,id)||!Number.isInteger(choice)||choice<0||choice>=q.choices.length)return false;
 attempt.answers[id]=choice;return true;
}
export function nextQuestion(attempt){
 if(!attempt||attempt.complete||!Object.hasOwn(attempt.answers,attempt.ids[attempt.index]))return false;
 if(attempt.index===attempt.ids.length-1)attempt.complete=true;else attempt.index++;
 return true;
}
export function summarize(attempt){
 const tags={};let correct=0;
 for(const id of attempt.ids){
  const q=questionById[id];if(!Object.hasOwn(attempt.answers,id))continue;
  const hit=attempt.answers[id]===q.correctAnswer;
  correct+=Number(hit);tags[q.concept]??={correct:0,total:0};
  tags[q.concept].total++;tags[q.concept].correct+=Number(hit);
 }
 const strong=Object.keys(tags).filter(k=>tags[k].correct/tags[k].total>=.75);
 const weak=Object.keys(tags).filter(k=>!strong.includes(k));
 return {correct,total:attempt.ids.length,percent:Math.round(correct/attempt.ids.length*100),tags,strong,weak};
}
export function weakQuestionIds(attempt){const weak=summarize(attempt).weak;return quizById[attempt.quizId].questionIds.filter(id=>weak.includes(questionById[id].concept));}
export function validateAttempt(a){
 if(!a||a.version!==1||!quizById[a.quizId]||!['topic','quick','weak'].includes(a.mode)||!Array.isArray(a.ids)||!a.ids.length||new Set(a.ids).size!==a.ids.length)return false;
 const quiz=quizById[a.quizId];
 if(!a.ids.every(id=>quiz.questionIds.includes(id))||!Number.isInteger(a.index)||a.index<0||a.index>=a.ids.length||typeof a.complete!=='boolean'||!a.answers||typeof a.answers!=='object'||Array.isArray(a.answers))return false;
 if(a.mode!=='weak' && (a.ids.length!==quiz.questionIds.length || (a.mode==='quick')!==(quiz.quizType==='quick')))return false;
 if(a.mode==='weak'&&!['topic','unit'].includes(quiz.quizType))return false;
 if(!Object.entries(a.answers).every(([id,v])=>a.ids.includes(id)&&Number.isInteger(v)&&v>=0&&v<questionById[id].choices.length))return false;
 if(!a.ids.slice(0,a.index).every(id=>Object.hasOwn(a.answers,id)))return false;
 if(a.ids.slice(a.index+1).some(id=>Object.hasOwn(a.answers,id)))return false;
 if(a.complete&&(a.index!==a.ids.length-1||Object.keys(a.answers).length!==a.ids.length))return false;
 return true;
}
