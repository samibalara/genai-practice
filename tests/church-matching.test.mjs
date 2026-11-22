import assert from 'node:assert/strict';
import test from 'node:test';
import {
  blankPreferences,
  churches,
  getChurchMatchState,
  hasMatchingAnswers,
  meetsMustHaves,
  scoreChurch,
} from '../artifacts/church-match/src/data.ts';

const preferences = () => structuredClone(blankPreferences);

test('Baptist as a must-have returns only Baptist churches', () => {
  const prefs = preferences();
  prefs.denomination = 'Baptist';
  prefs.denominationImportance = 'must';

  const { matches } = getChurchMatchState(churches, prefs);
  assert.ok(matches.length > 0);
  assert.ok(matches.every((church) => church.denomination === 'Baptist'));
});

test('different must-have answers produce different result lists', () => {
  const baptistPrefs = preferences();
  baptistPrefs.denomination = 'Baptist';
  baptistPrefs.denominationImportance = 'must';

  const presbyterianPrefs = preferences();
  presbyterianPrefs.denomination = 'Presbyterian';
  presbyterianPrefs.denominationImportance = 'must';

  const baptistResults = getChurchMatchState(churches, baptistPrefs).matches.map((church) => church.id);
  const presbyterianResults = getChurchMatchState(churches, presbyterianPrefs).matches.map((church) => church.id);
  assert.notDeepEqual(baptistResults, presbyterianResults);
});

test('impossible must-haves return the empty-state message', () => {
  const prefs = preferences();
  prefs.denomination = 'Baptist';
  prefs.denominationImportance = 'must';
  prefs.mission['Social justice'] = 'must';

  const state = getChurchMatchState(churches, prefs);
  assert.equal(state.matches.length, 0);
  assert.equal(state.emptyMessage, 'No churches match all your must-haves (Baptist denomination, Social justice mission). Try relaxing one.');
});

test('contradictory denomination must-haves name both choices and return no matches', () => {
  const prefs = preferences();
  prefs.denomination = 'Catholic';
  prefs.denominationImportance = 'must';
  prefs.denominationMustHaves = ['Baptist'];

  const state = getChurchMatchState(churches, prefs);
  assert.equal(state.matches.length, 0);
  assert.match(state.emptyMessage, /Catholic denomination/);
  assert.match(state.emptyMessage, /Baptist denomination/);
});

test('submitting no preferences is detected so the interface can hide match scores', () => {
  assert.equal(hasMatchingAnswers(preferences()), false);
  const prefs = preferences();
  prefs.serviceTime = 'Morning';
  assert.equal(hasMatchingAnswers(prefs), true);
});

test('a Spanish must-have excludes churches whose language field is missing', () => {
  const prefs = preferences();
  prefs.language = 'Spanish';
  prefs.languageImportance = 'must';
  const churchWithoutLanguages = { ...churches[0], id: 'missing-languages', languages: [] };

  assert.equal(meetsMustHaves(churchWithoutLanguages, prefs), false);
  const state = getChurchMatchState([churchWithoutLanguages], prefs);
  assert.equal(state.matches.length, 0);
  assert.match(state.emptyMessage, /Spanish-language service/);
});

test('changing a preference changes the church match score', () => {
  const church = churches.find((item) => item.denomination === 'Baptist');
  assert.ok(church);

  const baseline = preferences();
  baseline.travel = '';
  const withPreference = preferences();
  withPreference.travel = '';
  withPreference.denomination = 'Baptist';
  withPreference.denominationImportance = 'prefer';

  assert.notEqual(scoreChurch(church, baseline).score, scoreChurch(church, withPreference).score);
});

test('language and service-time answers change match scores without hiding other churches', () => {
  const church = churches.find((item) => item.languages.includes('Spanish'));
  assert.ok(church);
  const baseline = preferences();
  const specific = preferences();
  specific.language = 'Spanish';
  specific.languageImportance = 'prefer';
  specific.serviceTime = 'Afternoon';

  assert.notEqual(scoreChurch(church, baseline).score, scoreChurch(church, specific).score);
  assert.ok(getChurchMatchState(churches, specific).matches.length > 0);
});

test('Not for me removes the dismissed church from results', () => {
  const initial = getChurchMatchState(churches, preferences()).matches;
  assert.ok(initial.length > 1);
  const dismissedId = initial[0].id;

  const updated = getChurchMatchState(churches, preferences(), [dismissedId]).matches;
  assert.ok(!updated.some((church) => church.id === dismissedId));
  assert.equal(updated.length, initial.length - 1);
});
