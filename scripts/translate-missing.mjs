import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const DATA_PATH =
  process.env.PORTFOLIO_DATA_PATH ||
  path.join(ROOT, "public", "portfolio-data.json");
const TRANSLATIONS_PATH =
  process.env.TRANSLATIONS_PATH ||
  path.join(ROOT, "src", "i18n", "translations.js");
const CACHE_PATH =
  process.env.CACHE_PATH || path.join(ROOT, "scripts", ".translation-cache.json");

const SOURCE_LANG = "es";
const TARGET_LANG = "en";
const DELAY_MS = 350;
const MAX_RETRIES = 3;

const readJson = async (p) => JSON.parse(await readFile(p, "utf8"));
const exists = async (p) => {
  try {
    await readFile(p);
    return true;
  } catch {
    return false;
  }
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const data = await readJson(DATA_PATH);
const translations = (await import(pathToFileURL(TRANSLATIONS_PATH).href))
  .translations;
const en = translations.en;

const cache = (await exists(CACHE_PATH)) ? await readJson(CACHE_PATH) : {};

const stats = { kept: 0, translated: 0, failed: [] };

async function translateWithGoogle(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${SOURCE_LANG}&tl=${TARGET_LANG}&dt=t&q=${encodeURIComponent(
    text
  )}`;
  let lastErr;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      const translated = (body?.[0] || []).map((seg) => seg[0]).join("");
      if (!translated) throw new Error("Empty translation");
      return translated;
    } catch (err) {
      lastErr = err;
      await sleep(800 * (attempt + 1));
    }
  }
  throw lastErr;
}

async function apiTranslate(text) {
  return translateWithGoogle(text);
}

// A slot is one translatable string inside a translations.en category.
// Strategy:
//  - English missing                -> translate and store.
//  - cache[es] === current English  -> in sync, keep.
//  - cache[es] exists but differs   -> the Spanish source changed after this
//    English was generated, so refresh the English from the cache.
//  - no cache entry but current English matches the cached translation of a
//    DIFFERENT Spanish text -> the Spanish was edited, so re-translate.
//  - otherwise the English is treated as hand written and preserved.
async function syncSlot(label, es, get, set) {
  if (es == null || String(es).trim() === "") return;
  const current = get();

  const translateAndSet = async () => {
    let t = cache[es];
    if (t === undefined) {
      try {
        t = await apiTranslate(String(es));
        cache[es] = t;
      } catch (err) {
        stats.failed.push(`${label} (${err.message})`);
        return;
      }
      await sleep(DELAY_MS);
    }
    set(t);
    stats.translated++;
  };

  if (current == null || current === "") {
    await translateAndSet();
    return;
  }

  if (cache[es] === current) {
    stats.kept++;
    return;
  }
  if (cache[es] !== undefined) {
    set(cache[es]);
    stats.translated++;
    return;
  }
  const staleSource = Object.keys(cache).find(
    (k) => k !== es && cache[k] === current
  );
  if (staleSource !== undefined) {
    await translateAndSet();
    return;
  }
  cache[es] = current;
  stats.kept++;
}

const objAt = (base, key) => {
  if (base[key] && typeof base[key] === "object") return base[key];
  base[key] = {};
  return base[key];
};

const tasks = [];
const addTask = (label, es, get, set) =>
  tasks.push({ label, es, get, set });

addTask("brandTagline", data.brandTagline, () => en.brandTagline, (v) => {
  en.brandTagline = v;
});

for (const nav of data.navLinks || []) {
  addTask(
    `navLinks.${nav.id}`,
    nav.title,
    () => en.navLinks?.[nav.id],
    (v) => {
      objAt(en, "navLinks")[nav.id] = v;
    }
  );
}

for (const f of ["greeting", "subtitle"]) {
  addTask(`hero.${f}`, data.hero?.[f], () => en.hero?.[f], (v) => {
    objAt(en, "hero")[f] = v;
  });
}
for (const f of ["sub", "title", "description", "expSub", "expTitle"]) {
  addTask(`about.${f}`, data.about?.[f], () => en.about?.[f], (v) => {
    objAt(en, "about")[f] = v;
  });
}
for (const f of ["sub", "title", "description"]) {
  addTask(`works.${f}`, data.works?.[f], () => en.works?.[f], (v) => {
    objAt(en, "works")[f] = v;
  });
}
for (const f of ["sub", "title"]) {
  addTask(`feedbacks.${f}`, data.feedbacks?.[f], () => en.feedbacks?.[f], (v) => {
    objAt(en, "feedbacks")[f] = v;
  });
}
for (const f of ["sub", "title"]) {
  addTask(`contact.${f}`, data.contact?.[f], () => en.contact?.[f], (v) => {
    objAt(en, "contact")[f] = v;
  });
}

for (const svc of data.services || []) {
  addTask(
    `services[${svc.title}]`,
    svc.title,
    () => en.services?.[svc.title],
    (v) => {
      objAt(en, "services")[svc.title] = v;
    }
  );
}

for (const p of data.projects || []) {
  const key = p.name;
  if (!key) continue;
  const slot = objAt(objAt(en, "projects"), key);
  if (slot.name != null && slot.name !== "") {
    addTask(
      `projects[${key}].name`,
      p.name,
      () => slot.name,
      (v) => {
        slot.name = v;
      }
    );
  }
  addTask(
    `projects[${key}].description`,
    p.description,
    () => slot.description,
    (v) => {
      slot.description = v;
    }
  );
}

for (const e of data.experiences || []) {
  const key = e.company_name;
  if (!key) continue;
  const slot = objAt(objAt(en, "experiences"), key);
  addTask(
    `experiences[${key}].title`,
    e.title,
    () => slot.title,
    (v) => {
      slot.title = v;
    }
  );
  const pts = Array.isArray(e.points) ? e.points : [];
  const slotPoints = Array.isArray(slot.points) ? slot.points : (slot.points = []);
  pts.forEach((pt, i) => {
    addTask(
      `experiences[${key}].points[${i}]`,
      pt,
      () => slotPoints[i],
      (v) => {
        slotPoints[i] = v;
      }
    );
  });
  if (slotPoints.length > pts.length) slotPoints.length = pts.length;
}

for (const t of data.testimonials || []) {
  const key = t.name;
  if (!key) continue;
  const slot = objAt(objAt(en, "testimonials"), key);
  addTask(
    `testimonials[${key}].testimonial`,
    t.testimonial,
    () => slot.testimonial,
    (v) => {
      slot.testimonial = v;
    }
  );
  addTask(
    `testimonials[${key}].designation`,
    t.designation,
    () => slot.designation,
    (v) => {
      slot.designation = v;
    }
  );
}

for (const s of data.skills || []) {
  const key = s.name;
  if (!key) continue;
  const slot = objAt(objAt(en, "skills"), key);
  addTask(
    `skills[${key}].name`,
    s.name,
    () => slot.name,
    (v) => {
      slot.name = v;
    }
  );
}

for (const c of data.certifications || []) {
  const key = c.title;
  if (!key) continue;
  const slot = objAt(objAt(en, "certifications"), key);
  addTask(
    `certifications[${key}].title`,
    c.title,
    () => slot.title,
    (v) => {
      slot.title = v;
    }
  );
  addTask(
    `certifications[${key}].issuer`,
    c.issuer,
    () => slot.issuer,
    (v) => {
      slot.issuer = v;
    }
  );
}

for (const t of tasks) await syncSlot(t.label, t.es, t.get, t.set);

const cleanOrphans = (cat, list, keyField) => {
  const valid = new Set((list || []).map((x) => x[keyField]).filter(Boolean));
  if (!en[cat]) return;
  for (const k of Object.keys(en[cat])) if (!valid.has(k)) delete en[cat][k];
};
cleanOrphans("services", data.services, "title");
cleanOrphans("projects", data.projects, "name");
cleanOrphans("experiences", data.experiences, "company_name");
cleanOrphans("testimonials", data.testimonials, "name");
cleanOrphans("skills", data.skills, "name");
cleanOrphans("certifications", data.certifications, "title");

const validNav = new Set((data.navLinks || []).map((n) => n.id));
if (en.navLinks) {
  for (const k of Object.keys(en.navLinks)) if (!validNav.has(k)) delete en.navLinks[k];
}

for (const p of data.projects || []) {
  const slot = en.projects?.[p.name];
  if (slot && slot.name === p.name) delete slot.name;
}

const newEn = { ui: en.ui, months: en.months };
if (en.brandTagline !== undefined) newEn.brandTagline = en.brandTagline;
if (en.navLinks) {
  newEn.navLinks = Object.fromEntries(
    (data.navLinks || [])
      .map((n) => [n.id, en.navLinks[n.id]])
      .filter(([, v]) => v !== undefined)
  );
}
for (const [name, fields] of [
  ["hero", ["greeting", "subtitle"]],
  ["about", ["sub", "title", "description", "expSub", "expTitle"]],
  ["works", ["sub", "title", "description"]],
  ["feedbacks", ["sub", "title"]],
  ["contact", ["sub", "title"]],
]) {
  if (en[name]) {
    newEn[name] = Object.fromEntries(
      fields.map((f) => [f, en[name][f]]).filter(([, v]) => v !== undefined)
    );
  }
}
for (const [cat, list, keyField] of [
  ["services", data.services, "title"],
  ["experiences", data.experiences, "company_name"],
  ["projects", data.projects, "name"],
  ["testimonials", data.testimonials, "name"],
  ["skills", data.skills, "name"],
  ["certifications", data.certifications, "title"],
]) {
  if (en[cat]) {
    newEn[cat] = Object.fromEntries(
      (list || [])
        .map((x) => [x[keyField], en[cat][x[keyField]]])
        .filter(([, v]) => v !== undefined)
    );
  }
}
translations.en = newEn;

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const q = (k) => (IDENT.test(k) ? k : JSON.stringify(k));

const render = (obj, depth) => {
  const pad = "  ".repeat(depth);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    const items = obj.map((x) => `${pad}  ${render(x, depth + 1)},`);
    return `[\n${items.join("\n")}\n${pad}]`;
  }
  if (obj && typeof obj === "object") {
    const keys = Object.keys(obj);
    if (keys.length === 0) return "{}";
    const items = keys.map((k) => {
      const key = q(k);
      const v = obj[k];
      if (typeof v === "string") {
        const s = JSON.stringify(v);
        const head = `${pad}  ${key}: `;
        if (head.length + s.length + 1 <= 80) return head + s + ",";
        return `${pad}  ${key}:\n${"  ".repeat(depth + 2)}${s},`;
      }
      return `${pad}  ${key}: ${render(v, depth + 1)},`;
    });
    return `{\n${items.join("\n")}\n${pad}}`;
  }
  return JSON.stringify(obj);
};

const outText = `export const translations = ${render(translations, 0)};\n`;

const prevText = await readFile(TRANSLATIONS_PATH, "utf8");
const eol = prevText.includes("\r\n") ? "\r\n" : "\n";
const normalized = eol === "\n" ? outText : outText.replace(/\n/g, eol);
const changed = prevText !== normalized;
if (changed) await writeFile(TRANSLATIONS_PATH, normalized, "utf8");

await mkdir(path.dirname(CACHE_PATH), { recursive: true });
const sortedCache = Object.fromEntries(
  Object.entries(cache).sort(([a], [b]) => a.localeCompare(b))
);
const cacheText = JSON.stringify(sortedCache, null, 2) + "\n";
let cacheChanged = true;
try {
  const prevCache = await readFile(CACHE_PATH, "utf8");
  cacheChanged = prevCache !== cacheText;
} catch {
  /* first run */
}
if (cacheChanged) await writeFile(CACHE_PATH, cacheText, "utf8");

console.log(
  `Translation sync: ${stats.kept} kept, ${stats.translated} translated, ${stats.failed.length} failed.`
);
if (stats.failed.length) {
  console.warn("WARN: the following strings could not be translated (will fall back to Spanish):");
  for (const f of stats.failed) console.warn(`  - ${f}`);
}
console.log(
  `${changed ? "Wrote" : "Unchanged"} ${path.relative(ROOT, TRANSLATIONS_PATH)}`
);
console.log(
  `${cacheChanged ? "Wrote" : "Unchanged"} ${path.relative(ROOT, CACHE_PATH)} (${Object.keys(cache).length} entries)`
);
