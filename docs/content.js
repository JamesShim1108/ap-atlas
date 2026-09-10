import {topic12Concepts,topic12Lesson,topic12Vocabulary,topic12Connections,topic12Questions,topic12Quizzes} from './topic-1-2.js';
import {additionalLessons,additionalVocabulary,additionalConnections} from './unit-1-topics.js';
import {additionalQuestions,additionalQuizzes} from './unit-1-questions.js';
import {topicGuides,sourcesFor} from './unit-1-support.js';
// Content records are independent of the page templates and quiz engine.
// Add courses, units and topics here; only mark content ready after review.
export const courses = [{id:'world',title:'AP World History: Modern',shortTitle:'AP World',description:'Understand the people, ideas, and connections that shaped the world from c. 1200 to the present.',status:'ready',period:'c. 1200–present'}];
const unitNames=['The Global Tapestry','Networks of Exchange','Land-Based Empires','Transoceanic Interconnections','Revolutions','Consequences of Industrialization','Global Conflict','Cold War and Decolonization','Globalization'];
const unitPeriods=['c. 1200–1450','c. 1200–1450','c. 1450–1750','c. 1450–1750','c. 1750–1900','c. 1750–1900','c. 1900–present','c. 1900–present','c. 1900–present'];
export const units=unitNames.map((title,i)=>({id:`world-${i+1}`,courseId:'world',number:i+1,title,period:unitPeriods[i],status:i===0?'ready':'soon',description:i===0?'Explore how societies organized power, shared beliefs, and built their economies across the world.':''}));
const topicNames=['East Asia','Dar al-Islam','South and Southeast Asia','The Americas','Africa','Developments in Europe','Comparisons in the Period'];
export const topics=topicNames.map((title,i)=>({id:`world-1-${i+1}`,unitId:'world-1',code:`1.${i+1}`,title,period:'c. 1200–1450',status:i===0?'ready':'soon',summary:i===0?'Song China: an enduring government, changing economy, and influential culture.':''}));
export const concepts={
  governance:{title:'Governance',section:'governance'},
  beliefs:{title:'Belief systems',section:'beliefs'},
  economy:{title:'Economic change',section:'economy'},
  influence:{title:'Regional influence',section:'influence'}
};
export const lessons={
 'world-1-1':{
  minutes:8,
  bigIdea:'Song China combined long-standing ideas about authority with changes in farming and trade. Its neighbors borrowed Chinese practices while shaping societies of their own.',
  context:'Around 1200, the Southern Song governed much of southern China. The Song dynasty lasted from 960 to 1279; the broader topic continues through Mongol Yuan rule and into the Ming period. Use Song China as a starting point, not as the ruler of this entire timeline.',
  sections:[
   {id:'governance',title:'How do you govern a huge territory?',paragraphs:[
    'An emperor could not personally collect every tax or settle every local dispute. An imperial bureaucracy, a network of appointed officials, carried out those jobs. The Song expanded this system, building on institutions developed under earlier dynasties.',
    'Civil service examinations tested knowledge of Confucian writings and helped select officials. Success could give an educated man a path into government beyond inherited noble rank. But preparation required time, teachers, and books, giving wealthy families a major advantage. Women were excluded from the examination route.',
    'The scholar-gentry gained influence through education, government service, and often landownership. The important connection: exams tied political opportunity to a shared set of ideas, while unequal access to education preserved social hierarchy.'
   ],takeaway:'An exam-based system offered some social mobility. It did not give everyone an equal opportunity or make imperial China a democracy.'},
   {id:'beliefs',title:'Ideas could support political power.',paragraphs:[
    'Confucian teaching emphasized ethical conduct and duties within relationships: rulers and subjects, parents and children, elders and younger people. Filial piety meant respect and responsibility toward parents and ancestors. These family expectations helped make a wider hierarchy seem legitimate.',
    'Neo-Confucian thinkers renewed Confucian traditions while responding to ideas associated with Buddhism and Daoism. They put moral self-cultivation at the center of an account of how society and the universe should work. This was a changing intellectual tradition, not simply a return to an untouched past.',
    'Buddhism, which originated in South Asia, remained influential across East Asia. Its teachings connected suffering with craving and offered ethical and spiritual paths toward liberation. Communities developed different traditions; Chan in China and Zen in Japan emphasized meditation. Confucianism, Buddhism, and Daoism could coexist and influence one another.',
    'Social roles remained unequal. Patriarchal expectations privileged male authority, and foot binding among some Chinese families restricted women’s mobility and reflected status distinctions. Cultural ideals should be understood as historical beliefs, not universal rules for how people should live.'
   ],takeaway:'Continuity and change can happen together: familiar social duties persisted as thinkers developed new interpretations.'},
   {id:'economy',title:'Follow the rice to understand the cities.',paragraphs:[
    'Early-ripening Champa rice reached China from a kingdom in present-day Vietnam. Alongside irrigation, improved tools, and other farming changes, it helped raise food output. In suitable conditions, a shorter growing season allowed more than one harvest a year.',
    'A larger food supply supported population growth and more people working outside farming. Farmers and artisans increasingly produced for markets. Workshops supplied goods such as silk, porcelain, and iron products, while cities brought buyers, sellers, and craftspeople together.',
    'Waterways, including the Grand Canal, linked producing regions and markets. Better shipping and navigation supported trade; paper money helped some transactions. Growing trade did not mean farming disappeared: peasants and artisans still did much of the work that sustained the economy.'
   ],takeaway:'Explain the chain: greater farm output → support for population and specialized work → expanding markets. Rice was one contributor, not the sole cause.'},
   {id:'influence',title:'Borrowing did not mean becoming identical.',paragraphs:[
    'Chinese writing, Confucian learning, and Buddhist traditions spread through contact with Korea, Japan, and Vietnam. Trade, scholars, monks, and diplomacy carried ideas across borders. Adoption depended on local priorities and existing institutions.',
    'Korea and Vietnam used versions of Chinese-style examinations and Confucian administration, but local elites and traditions shaped how these worked. In Japan, Chinese cultural influences coexisted with Shinto traditions and growing warrior authority under shoguns.',
    'For a useful comparison, name something shared and something different. Song China and Japan both drew on Buddhist and Chinese cultural traditions, but appointed scholar-officials were central to Song government while warrior elites held major political power in medieval Japan.'
   ],takeaway:'Cultural influence does not, by itself, prove political control. Look for adaptation as well as similarity.'}
  ],
  sources:[
   {label:'College Board: AP World History: Modern course framework (2026), Topic 1.1',url:'https://apcentral.collegeboard.org/media/pdf/ap-world-history-modern-course-and-exam-description.pdf'},
   {label:'Columbia University, Asia for Educators: Rice cultivation',url:'https://afe.easia.columbia.edu/songdynasty-module/tech-rice.html'},
   {label:'Columbia University, Asia for Educators: Commercialization in Song China',url:'https://afe.easia.columbia.edu/songdynasty-module/econ-rev-commercial.html'}
  ]
 }
};
export const vocabulary=[
 ['bureaucracy','Imperial bureaucracy','A system of appointed officials who carry out a ruler’s policies and manage government work.'],
 ['exams','Civil service examination','An examination used to select government officials; in imperial China, knowledge of Confucian texts was central.'],
 ['gentry','Scholar-gentry','An educated elite associated with Confucian learning, government service, and often landownership.'],
 ['neo','Neo-Confucianism','A renewed Confucian intellectual tradition that emphasized moral development while engaging with Buddhist and Daoist ideas.'],
 ['filial','Filial piety','Respect for and responsibility toward parents and ancestors, an important Confucian value.'],
 ['champa','Champa rice','An early-ripening rice variety introduced from present-day Vietnam that contributed to increased Chinese agricultural output.'],
 ['commercial','Commercialization','A shift toward producing goods for sale and relying more on markets and trade.'],
 ['adaptation','Cultural adaptation','Changing a borrowed idea or practice to fit a society’s own needs and traditions.']
].map(([id,term,definition])=>({id,topicId:'world-1-1',term,definition}));
export const connections=[
 {id:'rice-cities',topicId:'world-1-1',type:'Cause → effect',title:'A crop can change more than the farm.',body:'Higher agricultural output supported a larger population and specialized work. More producers and buyers helped markets grow. Connect an innovation to the social or economic change it supported.'},
 {id:'exams-hierarchy',topicId:'world-1-1',type:'Continuity / change',title:'A new path upward, with old advantages.',body:'Examination success offered a route to office, yet wealthy families could more easily fund education. An institution can create opportunities while preserving inequality.'},
 {id:'china-japan',topicId:'world-1-1',type:'Similarity / difference',title:'Shared influences, different governments.',body:'Song China and medieval Japan shared Buddhist and Chinese cultural influences. However, scholar-officials were central to Song administration, while warrior elites exercised major power in Japan.'},
 {id:'belief-power',topicId:'world-1-1',type:'Why it matters',title:'Beliefs help explain authority.',body:'Confucian duties linked respect within families to expectations within the state. When explaining how a ruler maintained power, consider the ideas that made hierarchy acceptable as well as the officials who enforced policy.'}
];
export const questions=[
 {id:'q1',topicId:'world-1-1',concept:'governance',difficulty:'Core',skillTag:'Explaining a development',prompt:'Why did examinations on Confucian writings help the Song government maintain its authority?',choices:['They trained all citizens to vote for the emperor.','They removed the need for officials in distant provinces.','They helped recruit officials whose education reinforced ideas of hierarchy and duty.','They reserved government office exclusively for hereditary nobles.'],correctAnswer:2,explanation:'The examinations connected recruitment with Confucian ideas about ethical conduct and relationships. Officials carried these ideas into administration; the system did not create elections or eliminate bureaucracy.'},
 {id:'q2',topicId:'world-1-1',concept:'governance',difficulty:'Apply',skillTag:'Using evidence',stimulus:'Two candidates hope to pass an imperial examination. One has family-funded tutors and years to study. The other must spend most days working to support his household.',prompt:'Which conclusion is best supported by this situation?',choices:['Examinations offered a route to office, but resources affected a candidate’s opportunities.','Examination results depended only on inherited noble titles.','Every social group had the same chance of gaining a government post.','Confucian education had no relationship to government service.'],correctAnswer:0,explanation:'Testing knowledge could create opportunities beyond noble birth, while unequal access to preparation favored wealthy families. This is a limit on equal opportunity, not evidence that exams did not matter.'},
 {id:'q3',topicId:'world-1-1',concept:'beliefs',difficulty:'Apply',skillTag:'Continuity and change',prompt:'Which description best captures continuity and change in Neo-Confucian thought?',choices:['It rejected family obligations and replaced them with elected leadership.','It preserved Confucian moral concerns while developing ideas in response to other traditions.','It ended the practice of Buddhism across East Asia.','It abandoned education as a means of developing ethical conduct.'],correctAnswer:1,explanation:'Neo-Confucianism kept Confucian ethics central but developed new interpretations in conversation and tension with Buddhist and Daoist ideas. Renewed tradition did not mean complete intellectual isolation.'},
 {id:'q4',topicId:'world-1-1',concept:'beliefs',difficulty:'Core',skillTag:'Explaining significance',prompt:'How could the Confucian emphasis on filial piety support imperial rule?',choices:['It required children to select rulers through an examination.','It prevented Buddhist ideas from reaching China.','It transferred all government duties to merchants.','It encouraged respect for hierarchical relationships that could extend from family to state.'],correctAnswer:3,explanation:'Duties within a family could help justify duties within a wider political hierarchy. Filial piety concerned respect and responsibility; it was not an electoral system or a ban on foreign religion.'},
 {id:'q5',topicId:'world-1-1',concept:'economy',difficulty:'Apply',skillTag:'Causation',prompt:'Which sequence best explains how agricultural innovation contributed to Song economic growth?',choices:['Higher food output → support for population and specialized work → larger markets','Higher food output → disappearance of farming → dependence only on imports','More harvests → less need for transport → the closure of markets','New rice varieties → an end to artisan production → fewer towns'],correctAnswer:0,explanation:'A larger food supply could support more people and more specialized occupations, helping markets expand. Agriculture remained central, and irrigation, tools, and transport also contributed.'},
 {id:'q6',topicId:'world-1-1',concept:'economy',difficulty:'Apply',skillTag:'Using evidence',stimulus:'A village workshop makes porcelain for buyers in distant cities. Boats carry its output along waterways, and merchants arrange sales beyond the local community.',prompt:'This situation most directly illustrates which development?',choices:['A return to producing only for household consumption','The replacement of artisan work by steam-powered factories','The growing importance of production for markets and regional trade','The elimination of farming from the Chinese economy'],correctAnswer:2,explanation:'Production for distant buyers shows commercialization. Artisans and peasants still supplied goods; market growth in the Song period was not the same as later factory industrialization.'},
 {id:'q7',topicId:'world-1-1',concept:'influence',difficulty:'Apply',skillTag:'Comparison',prompt:'Which comparison of Song China and medieval Japan is most accurate?',choices:['Both were administered entirely by elected religious leaders.','Both experienced Chinese and Buddhist cultural influences, but Japan’s warrior elites differed from Song scholar-officials.','Neither developed political institutions influenced by local traditions.','Japan’s adoption of Chinese culture made it a province governed by Song officials.'],correctAnswer:1,explanation:'Cultural borrowing coexisted with political differences. Song administration relied heavily on scholar-officials, while warrior leadership grew central in Japan. Shared culture does not prove shared rule.'},
 {id:'q8',topicId:'world-1-1',concept:'influence',difficulty:'Apply',skillTag:'Historical reasoning',prompt:'A historian finds Chinese-derived writing and Confucian learning in Korea and Vietnam. What additional evidence would best show local adaptation?',choices:['Records that both regions had contact with China','Examples of books arriving from Chinese ports','Evidence that Chinese scholars valued literacy','Records showing that each region modified borrowed institutions to suit its own elites and traditions'],correctAnswer:3,explanation:'Adaptation means reshaping what is borrowed. Evidence of local modifications shows more than contact or simple adoption and helps explain why societies remained distinct.'},
 {id:'k1',topicId:'world-1-1',concept:'governance',difficulty:'Quick check',skillTag:'Concept check',prompt:'Which example describes a bureaucracy?',choices:['A ruler handling every tax dispute personally','Appointed officials managing taxes and carrying out imperial policies','Merchants choosing the emperor through a market vote','Families independently issuing all government laws'],correctAnswer:1,explanation:'A bureaucracy divides government work among appointed officials. In Song China, these officials helped put imperial policies into practice across a large territory.'},
 {id:'k2',topicId:'world-1-1',concept:'economy',difficulty:'Quick check',skillTag:'Causation',prompt:'Why did early-ripening rice matter beyond agriculture?',choices:['It made transport networks unnecessary.','It immediately gave all farmers government jobs.','It ended the need for other agricultural improvements.','It helped increase the food supply that supported people doing specialized work.'],correctAnswer:3,explanation:'Increased food output helped support a growing population and people working in crafts and trade. Early-ripening rice worked alongside other agricultural changes.'},
 {id:'k3',topicId:'world-1-1',concept:'beliefs',difficulty:'Quick check',skillTag:'Concept check',prompt:'Which statement best describes the relationship between Confucianism and Buddhism in East Asia?',choices:['They could coexist and influence intellectual and cultural life in different ways.','They were the same tradition under two names.','The spread of one instantly removed the other everywhere.','Neither influenced life beyond the Chinese imperial court.'],correctAnswer:0,explanation:'Multiple traditions coexisted, sometimes in tension and sometimes influencing each other. Their influence reached societies beyond China and extended beyond government.'}
];
export const quizzes=[
 {id:'world-1-1-quiz',courseId:'world',unitId:'world-1',topicId:'world-1-1',title:'East Asia topic quiz',quizType:'topic',questionIds:['q1','q2','q3','q4','q5','q6','q7','q8']},
 {id:'world-1-1-quick',courseId:'world',unitId:'world-1',topicId:'world-1-1',title:'East Asia quick practice',quizType:'quick',questionIds:['k1','k2','k3']}
];

// Topic 1.2 uses the same lesson, quiz, and review flow as Topic 1.1.
Object.assign(concepts,topic12Concepts);
lessons['world-1-2']=topic12Lesson;
vocabulary.push(...topic12Vocabulary);
connections.push(...topic12Connections);
questions.push(...topic12Questions);
quizzes.push(...topic12Quizzes);
Object.assign(topics.find(t=>t.id==='world-1-2'),{status:'ready',summary:'Regional Muslim states, connected communities, and the movement of ideas across Afro-Eurasia.'});

// Complete Unit 1 using the same reusable lesson and assessment records.
Object.assign(lessons,additionalLessons);
vocabulary.push(...additionalVocabulary);
connections.push(...additionalConnections);
questions.push(...additionalQuestions);
quizzes.push(...additionalQuizzes);
const summaries={
 'world-1-3':'Hindu, Buddhist, and Muslim communities; inland kingdoms and maritime states.',
 'world-1-4':'Maya cities, Mexica tribute, Inca labor, and diverse North American communities.',
 'world-1-5':'African kingdoms and cities, connected by agriculture, commerce, and varied beliefs.',
 'world-1-6':'Religious institutions, divided political authority, and changing agricultural societies.',
 'world-1-7':'Compare authority, resources, and beliefs using precise evidence and historical reasoning.'
};
for(const t of topics){
 if(lessons[t.id]){t.status='ready';t.summary=summaries[t.id]||t.summary;}
 const lesson=lessons[t.id];if(!lesson)continue;
 lesson.guide=topicGuides[t.id];
 for(const s of lesson.sections){concepts[s.id]??={title:s.title,section:s.id};concepts[s.id].topicId=t.id;}
}
lessons['world-1-1'].sources.unshift({label:'Class reading: AMSCO Unit 1, supplied PDF pages 3-11; Tang/Song/Mongols class slides. Earlier dynasties provide background.'});
lessons['world-1-2'].sources=[{label:'Class reading: AMSCO Unit 1, supplied PDF pages 12-16; The Rise/Spread of Islam class slides for earlier context.'},...sourcesFor('ced')];
for(const lesson of Object.values(lessons))lesson.sources.push({label:'Class framework: Early Religions + InSPECT, slides 5-17. InSPECT categories inform the reading guide and writing exercise.'});

// Supplement existing lessons where the full unit framework needs more detail.
const east=lessons['world-1-1'];
east.sections.find(s=>s.id==='beliefs').paragraphs.splice(3,0,
 'Buddhist branches shared important teachings but developed different institutions and practices. Theravada traditions became prominent in Sri Lanka and much of mainland Southeast Asia, with a strong monastic tradition. Mahayana traditions, influential in China and Korea, emphasized the bodhisattva ideal of helping other beings toward liberation. Tibetan Buddhism drew on Mahayana and Vajrayana practices, including ritual and teacher lineages. These broad labels contain considerable diversity.');
east.sections.find(s=>s.id==='economy').paragraphs.push(
 'Manufacturing and technical knowledge reinforced these changes. Iron and steel production supplied tools and other goods; printing made texts more available to readers; and the compass supported navigation. Porcelain and textiles reached distant buyers. This growth relied heavily on peasant and artisanal labor and should not be confused with the later factory-based Industrial Revolution.');
east.sections.find(s=>s.id==='influence').paragraphs.push(
 'Heian Japan had earlier adapted Chinese writing, court institutions, and Buddhist learning while developing a distinctive literary culture. By around 1200, military governments and warrior elites were increasingly important. In Korea and Vietnam, local elites similarly shaped borrowed institutions. Diplomatic tribute and cultural influence should not be assumed to mean direct Chinese rule.');
east.minutes=10;
vocabulary.push(...[
 ['theravada','Theravada Buddhism','A Buddhist tradition with a strong monastic heritage, prominent in Sri Lanka and much of mainland Southeast Asia.'],
 ['mahayana','Mahayana Buddhism','A family of Buddhist traditions emphasizing the bodhisattva ideal, influential in East Asia.'],
 ['tibetan','Tibetan Buddhism','Buddhist traditions associated with Tibet that include Mahayana and Vajrayana teachings and practices.'],
 ['artisan','Artisanal labor','Skilled craft production, important to the manufacture of textiles, ceramics, and other goods.']
].map(([id,term,definition])=>({id,term,definition,topicId:'world-1-1'})));
const islamBeliefs=lessons['world-1-2'].sections.find(s=>s.id==='islam-beliefs');
islamBeliefs.paragraphs.push('Judaism emphasized one God, covenant, and religious law, with communal learning and worship supporting Jewish identity across dispersed communities. Christianity centered on Jesus, salvation, scripture, and church communities. Sunni and Shi’a traditions reflected different views of legitimate leadership and religious authority within Islam. These differences mattered, but did not prevent all cooperation across religious boundaries.');

quizzes.push({id:'world-1-practice',courseId:'world',unitId:'world-1',title:'Unit 1 practice',quizType:'unit',questionIds:[
 'q1','q5','q7','islam-q1','islam-q4','islam-q8',
 ...Object.keys(additionalLessons).flatMap(id=>[`${id}-q1`,`${id}-q4`,`${id}-q6`])
]});
