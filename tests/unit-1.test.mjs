import test from 'node:test';
import assert from 'node:assert/strict';
import {
  topics, lessons, vocabulary, connections, concepts, questions, quizzes
} from '../docs/content.js';
import {
  createAttempt, checkAnswer, nextQuestion, summarize, validateAttempt,
  weakQuestionIds
} from '../docs/engine.js';
import {
  newWritingDraft, validateWritingDraft, updateWritingResponse,
  reviewWriting, reviseWriting, setWritingScore, writingScore,
  createWritingStore
} from '../docs/writing-engine.js';
import { studyGuidePage } from '../docs/unit-1-views.js';

test('Unit 1 is complete and every concept has a review destination', () => {
  const unitTopics = topics.filter(topic => topic.unitId === 'world-1');
  assert.equal(unitTopics.length, 7);
  assert.ok(unitTopics.every(topic => topic.status === 'ready'));
  for (const topic of unitTopics) {
    assert.ok(lessons[topic.id]);
    assert.ok(lessons[topic.id].sections.length >= 4);
    assert.ok(lessons[topic.id].sources.every(source => source && source.label));
    assert.ok(vocabulary.some(term => term.topicId === topic.id));
    assert.ok(connections.some(connection => connection.topicId === topic.id));
    for (const section of lessons[topic.id].sections) {
      assert.equal(concepts[section.id].topicId, topic.id);
      assert.equal(concepts[section.id].section, section.id);
    }
  }
});

test('Question pools are unique, complete, and point to real concepts', () => {
  assert.equal(new Set(questions.map(question => question.id)).size, questions.length);
  for (const question of questions) {
    assert.ok(concepts[question.concept], question.id);
    assert.equal(question.choices.length, 4);
    assert.ok(Number.isInteger(question.correctAnswer));
    assert.ok(question.correctAnswer >= 0 && question.correctAnswer < 4);
  }
  const unitQuiz = quizzes.find(quiz => quiz.id === 'world-1-practice');
  assert.equal(unitQuiz.questionIds.length, 21);
  assert.equal(new Set(unitQuiz.questionIds).size, 21);
  assert.ok(unitQuiz.questionIds.every(id => questions.some(question => question.id === id)));
});

test('Unit practice can complete and identify a weak concept', () => {
  const quiz = quizzes.find(item => item.id === 'world-1-practice');
  const attempt = createAttempt(quiz.id, quiz.questionIds, 'topic');
  assert.ok(validateAttempt(attempt));
  const firstQuestion = attempt.ids[0];
  const first = questions.find(question => question.id === firstQuestion);
  const wrong = (first.correctAnswer + 1) % first.choices.length;
  assert.ok(checkAnswer(attempt, wrong));
  assert.ok(nextQuestion(attempt));
  const weak = weakQuestionIds(attempt);
  assert.ok(weak.includes(firstQuestion));
  for (let i = attempt.index; i < attempt.ids.length; i += 1) {
    const question = questions.find(item => item.id === attempt.ids[attempt.index]);
    assert.ok(checkAnswer(attempt, question.correctAnswer));
    assert.ok(nextQuestion(attempt));
  }
  assert.equal(attempt.complete, true);
  assert.ok(validateAttempt(attempt));
  const result = summarize(attempt);
  assert.equal(result.total, 21);
  assert.equal(result.correct, 20);
});

test('Writing draft state saves, reviews, scores, and revises safely', () => {
  const draft = newWritingDraft();
  assert.ok(validateWritingDraft(draft));
  assert.ok(updateWritingResponse(draft, 'a', 'Answer. Prove. Explain.'));
  assert.ok(updateWritingResponse(draft, 'b', 'Answer. Prove. Explain.'));
  assert.ok(updateWritingResponse(draft, 'c', 'Answer. Prove. Explain.'));
  assert.ok(reviewWriting(draft));
  assert.ok(validateWritingDraft(draft));
  assert.equal(updateWritingResponse(draft, 'a', 'Edit after review'), false);
  assert.ok(setWritingScore(draft, 'a', 1));
  assert.ok(setWritingScore(draft, 'b', 0));
  assert.ok(setWritingScore(draft, 'c', 1));
  assert.equal(writingScore(draft), 2);
  reviseWriting(draft);
  assert.equal(draft.reviewed, false);
  assert.equal(writingScore(draft), null);
  assert.ok(validateWritingDraft(draft));
});

test('Writing drafts persist in the current tab storage', () => {
  const values = new Map();
  const storage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };
  const first = createWritingStore(() => storage);
  updateWritingResponse(first.draft, 'a', 'A response');
  assert.equal(first.save(), true);
  const second = createWritingStore(() => storage);
  assert.equal(second.draft.responses.a, 'A response');
  assert.equal(second.draft.responses.b, '');
});

test('Study guide renders the class guide reference without broken links', () => {
  const esc = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const link = (url, label, className = '') => `<a class="${className}" href="#${url}">${label}</a>`;
  const html = studyGuidePage({
    esc,
    link,
    crumb: items => `<nav>${items.map(item => item[0]).join('/')}</nav>`,
    pageTitle: () => {}
  });
  assert.match(html, /Class AMSCO reading guide: Topics 1\.2 and 1\.3/);
  assert.doesNotMatch(html, /href="undefined"/);
  assert.match(html, /Write an SAQ|writing quiz/i);
  for (const code of ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7']) {
    assert.match(html, new RegExp(`TOPIC ${code.replace('.', '\\.')}`));
  }
});
