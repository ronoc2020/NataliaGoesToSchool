import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = html.match(/<script>([\s\S]+?)<\/script>/i)?.[1];
assert.ok(source, 'Game script must exist');

function gameHarness() {
  const handlers = {};
  const elements = {};
  const element = (id) => elements[id] ??= {
    textContent: '',
    addEventListener(type, callback) { handlers[id + ':' + type] = callback; },
    getContext() { return { fillRect() {}, fillText() {} }; },
  };
  const document = {
    getElementById: element,
    querySelectorAll() {
      return ['up', 'down', 'left', 'right'].map(name => ({
        getAttribute() { return name; },
        addEventListener() {},
        setPointerCapture() {},
      }));
    },
    activeElement: null,
  };
  const window = {
    addEventListener(type, callback) { handlers['window:' + type] = callback; },
  };
  const db = new Map();
  const localStorage = {
    getItem(key) { return db.get(key) ?? null; },
    setItem(key, value) { db.set(key, value); },
  };
  let callback = null;
  let frameTime = 0;
  function requestAnimationFrame(next) { callback = next; return 1; }
  new Function('document', 'window', 'localStorage', 'requestAnimationFrame', source)(
    document, window, localStorage, requestAnimationFrame
  );
  function frames(n) {
    for (let i = 0; i < n; i += 1) {
      const next = callback;
      assert.equal(typeof next, 'function');
      callback = null;
      frameTime += 50;
      next(frameTime);
    }
  }
  function move(code, n) {
    handlers['window:keydown']({ code, repeat: false, preventDefault() {} });
    frames(n);
    handlers['window:keyup']({ code });
  }
  frames(1);
  return { elements, handlers, db, frames, move };
}

test('embedded application is valid JavaScript', () => {
  assert.doesNotThrow(() => new Script(source, { filename: 'index.html script' }));
});

test('no external runtime scripts or styles are required', () => {
  assert.doesNotMatch(html, /<(?:script|link)[^>]+(?:src|href)=["']https?:\/\//i);
});

test('player can collect all three notebooks and finish the level', () => {
  const h = gameHarness();
  h.move('KeyW', 35);
  h.move('KeyD', 7);
  assert.equal(h.elements.collected.textContent, '1 / 3');
  h.move('KeyS', 32);
  h.move('KeyD', 23);
  assert.equal(h.elements.collected.textContent, '2 / 3');
  h.move('KeyD', 19);
  h.move('KeyW', 32);
  h.move('KeyD', 29);
  assert.equal(h.elements.collected.textContent, '3 / 3');
  assert.match(h.elements.status.textContent, /dotarła do szkoły/);
  assert.ok(Number(h.db.get('natalia_school_best_v1')) > 0);
});

test('pause and restart controls preserve correct status', () => {
  const h = gameHarness();
  h.handlers['pause:click']();
  assert.match(h.elements.status.textContent, /Pauza/);
  const elapsed = h.elements.clock.textContent;
  h.frames(10);
  assert.equal(h.elements.clock.textContent, elapsed);
  h.handlers['restart:click']();
  assert.equal(h.elements.collected.textContent, '0 / 3');
  assert.equal(h.elements.clock.textContent, '0.0 s');
});
