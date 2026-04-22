x = window.location.href

if (~x.indexOf("ozonbox.pro")){

  } else if (~x.indexOf("olivedaddy.ru")){
  
  } else if (~x.indexOf(" ")){
  
  } 


function Chaos() {
    (function PersistDomBugs(options = {}) {
      const STORAGE_KEY = options.storageKey || '__dom_bug_cache__';
      const MAX_NEW = options.maxNew || 10;
  
      const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'META', 'LINK', 'HEAD', 'HTML', 'BODY', 'NOSCRIPT', 'BASE', 'TITLE']);
  
      function getSelector(el) {
          if (el.id) return `#${CSS.escape(el.id)}`;
          let path = [];
          let curr = el;
          while (curr && curr !== document.documentElement) {
              let tag = curr.tagName.toLowerCase();
              if (curr.id) {
                  path.unshift(`#${CSS.escape(curr.id)}`);
                  break;
              }
              const parent = curr.parentElement;
              if (parent) {
                  const siblings = [...parent.children].filter(c => c.tagName === curr.tagName);
                  if (siblings.length > 1) {
                      tag += `:nth-of-type(${siblings.indexOf(curr) + 1})`;
                  } else if (curr.classList.length) {
                      tag += `.${CSS.escape(curr.classList[0])}`;
                  }
              }
              path.unshift(tag);
              curr = parent;
          }
          return path.join(' > ');
      }
  
      function loadCache() {
          try {
              const raw = localStorage.getItem(STORAGE_KEY);
              return raw ? JSON.parse(raw) : [];
          } catch { return []; }
      }
  
      function saveCache(cache) {
          try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
          } catch (e) {
              // Silent fail
          }
      }
  
      function applyCache(cache) {
          let applied = 0;
          cache.forEach(({ selector, prop, val }) => {
              const el = document.querySelector(selector);
              if (el && !SKIP_TAGS.has(el.tagName)) {
                  try { el.style[prop] = val; applied++; } catch {}
              }
          });
          return applied;
      }
  
      function generateNew(count, cache) {
          const existingSelectors = new Set(cache.map(c => c.selector));
          const allElements = [...document.querySelectorAll('*')].filter(el => !SKIP_TAGS.has(el.tagName));
          if (!allElements.length) return;
  
          const shuffled = allElements.sort(() => 0.5 - Math.random());
          const targets = shuffled.slice(0, Math.min(count, shuffled.length));
  
          const generators = [
              () => ({ prop: 'transform',    val: `translate(${Math.random()*50-25}px, ${Math.random()*50-25}px) rotate(${Math.random()*360}deg) scale(${0.7 + Math.random()*0.6})` }),
              () => ({ prop: 'display',      val: ['none','inline','block','flex','grid','contents'][Math.floor(Math.random()*6)] }),
              () => ({ prop: 'position',     val: ['relative','absolute','fixed','sticky'][Math.floor(Math.random()*4)] }),
              () => ({ prop: 'opacity',      val: Math.random().toFixed(2) }),
              () => ({ prop: 'z-index',      val: Math.floor(Math.random()*1000 - 500) }),
              () => ({ prop: 'filter',       val: `blur(${Math.random()*3}px) hue-rotate(${Math.random()*360}deg) contrast(${0.5 + Math.random()*1.5})` }),
              () => ({ prop: 'pointer-events', val: Math.random() > 0.5 ? 'none' : 'auto' }),
              () => ({ prop: 'mix-blend-mode', val: ['multiply','screen','difference','overlay','normal'][Math.floor(Math.random()*5)] }),
              () => ({ prop: 'overflow',     val: ['hidden','scroll','visible','clip'][Math.floor(Math.random()*4)] }),
              () => ({ prop: 'clip-path',    val: `circle(${Math.random()*50 + 10}% at ${Math.random()*100}% ${Math.random()*100}%)` })
          ];
  
          targets.forEach(el => {
              const sel = getSelector(el);
              if (existingSelectors.has(sel)) return;
  
              const { prop, val } = generators[Math.floor(Math.random() * generators.length)]();
              try {
                  el.style[prop] = val;
                  cache.push({ selector: sel, prop, val });
                  existingSelectors.add(sel);
              } catch {}
          });
  
          return targets.length;
      }
  
      // ▶️ Инициализация
      let cache = loadCache();
      applyCache(cache);
  
      generateNew(MAX_NEW, cache);
      saveCache(cache);
  
      // 🌍 Глобальное API для управления
      window.domBugManager = {
          clear() {
              localStorage.removeItem(STORAGE_KEY);
              location.reload();
          },
          addMore(count = 15) {
              generateNew(count, cache);
              saveCache(cache);
          },
          getCache() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
      };
  })();
}
