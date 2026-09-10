import {unitOneWriting as quiz} from './unit-1-support.js';

const parts=quiz.parts.map(p=>p.id);
const emptyScores=()=>Object.fromEntries(parts.map(id=>[id,null]));
export function newWritingDraft(){
 return {version:quiz.version,quizId:quiz.id,responses:Object.fromEntries(parts.map(id=>[id,''])),reviewed:false,scores:emptyScores()};
}
export function validateWritingDraft(d){
 if(!d||d.version!==quiz.version||d.quizId!==quiz.id||typeof d.reviewed!=='boolean')return false;
 if(!d.responses||typeof d.responses!=='object'||Array.isArray(d.responses)||!d.scores||typeof d.scores!=='object'||Array.isArray(d.scores))return false;
 if(Object.keys(d.responses).length!==parts.length||Object.keys(d.scores).length!==parts.length)return false;
 if(!parts.every(id=>typeof d.responses[id]==='string'&&d.responses[id].length<=10000&&[null,0,1].includes(d.scores[id])))return false;
 if(d.reviewed&&!parts.every(id=>d.responses[id].trim()))return false;
 return d.reviewed||parts.every(id=>d.scores[id]===null);
}
export function updateWritingResponse(d,id,text){
 if(!parts.includes(id)||typeof text!=='string'||text.length>10000||d.reviewed)return false;
 d.responses[id]=text;d.scores=emptyScores();return true;
}
export function reviewWriting(d){
 if(!parts.every(id=>d.responses[id].trim()))return false;
 d.reviewed=true;return true;
}
export function reviseWriting(d){d.reviewed=false;d.scores=emptyScores();}
export function setWritingScore(d,id,value){
 if(!d.reviewed||!parts.includes(id)||![0,1].includes(value))return false;
 d.scores[id]=value;return true;
}
export function writingScore(d){return d.reviewed&&parts.every(id=>d.scores[id]!==null)?parts.reduce((sum,id)=>sum+d.scores[id],0):null;}

// Tab-local persistence is intentionally separate from the multiple-choice attempts.
export function createWritingStore(getStorage){
 const key='page-one-writing-v1';let draft=newWritingDraft(),storageOK=true;
 try{const saved=JSON.parse(getStorage().getItem(key)||'null');if(validateWritingDraft(saved))draft=saved;}catch{storageOK=false;}
 function save(){try{getStorage().setItem(key,JSON.stringify(draft));storageOK=true;}catch{storageOK=false;}return storageOK;}
 return {get draft(){return draft;},get storageOK(){return storageOK;},save};
}
