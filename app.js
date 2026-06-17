const variantKey = document.body.dataset.variant || "scheme2-refined";

const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const engineSelect = document.querySelector("#engineSelect");
const linkGrid = document.querySelector("#linkGrid");
const linkTabs = document.querySelector("#linkTabs");
const siteCount = document.querySelector("#siteCount");
const siteTotal = document.querySelector("#siteTotal");
const emptyState = document.querySelector("#emptyState");

const clock = document.querySelector("#clock");
const dateLabel = document.querySelector("#date");
const greeting = document.querySelector("#greeting");
const mottoText = document.querySelector("#mottoText");

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const taskProgress = document.querySelector("#taskProgress");

const quickNote = document.querySelector("#quickNote");
const noteStatus = document.querySelector("#noteStatus");
const noteMeta = document.querySelector("#noteMeta");
const copyNote = document.querySelector("#copyNote");
const clearNote = document.querySelector("#clearNote");

const STORAGE_KEYS = {
  tasks: `${variantKey}.tasks`,
  note: `${variantKey}.quick-note`,
  engine: `${variantKey}.search-engine`,
};

const MOTTO_CORPUS = [
  "以狂笑拥抱世俗，以愚钝对抗虚无。",
  "讲分开，可否不再，用憾事的口吻，习惯无常，才会庆幸。",
  "没有受益者的付出，都是自我感动；没有受益者的坚持，都是自我折磨。",
];

const SEARCH_ENGINES = {
  bing: (query) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
  baidu: (query) => `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
  google: (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  github: (query) => `https://github.com/search?q=${encodeURIComponent(query)}`,
  youtube: (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  bilibili: (query) => `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`,
};

const LINK_GROUPS = [
  {
    title: "校园核心",
    code: "CAMPUS",
    items: [
      ["C", "CC98", "https://www.cc98.org/", "cc98 校园 论坛"],
      ["学", "学在浙大", "https://courses.zju.edu.cn/user/index", "课程 教学"],
      ["教", "教务网", "http://zdbk.zju.edu.cn/", "教务 选课 成绩"],
      ["V", "WebVPN", "https://webvpn.zju.edu.cn/", "vpn 校外 访问"],
      ["课", "智云课堂", "https://classroom.zju.edu.cn/", "课堂 回放"],
      ["图", "浙大图书馆", "http://libweb.zju.edu.cn/", "图书馆 借阅 文献"],
      ["@", "浙大邮箱", "https://zjuem.zju.edu.cn/", "邮箱 email"],
      ["充", "ZJUCharger", "https://charger.philfan.cn/", "充电 charger"],
    ],
  },
  {
    title: "学习资源",
    code: "LEARN",
    items: [
      ["知", "中国知网", "https://www.cnki.net/", "知网 论文 文献"],
      ["CS", "CS-ALL", "https://isshikihugh.github.io/zju-cs-asio/", "zju cs 课程"],
      ["DY", "CSDIY", "https://csdiy.wiki/", "计算机 自学"],
      ["算", "Hello 算法", "https://www.hello-algo.com/", "算法 数据结构"],
      ["DL", "深度学习", "http://zh.d2l.ai/", "d2l ai"],
      ["MD", "MDN Web", "https://developer.mozilla.org/zh-CN/docs/Learn", "前端 文档"],
      ["源", "源梦紫金", "https://zjusuee.github.io/", "学习 资料 zju"],
    ],
  },
  {
    title: "写作文档",
    code: "WRITE",
    items: [
      ["Te", "Overleaf", "https://www.overleaf.com/", "latex 论文"],
      ["识", "SimpleTex", "https://simpletex.cn/ai/latex_ocr", "latex 公式 识别"],
      ["fx", "在线公式编辑", "https://www.latexlive.com/", "latex 公式 编辑"],
      ["卷", "问卷星", "https://www.wjx.cn/", "问卷 调研"],
      ["秀", "秀米", "https://xiumi.us/", "排版 公众号 写作"],
      ["微", "微信公众平台", "https://mp.weixin.qq.com/", "公众号 发布"],
      ["工", "在线工具箱", "https://tool.browser.qq.com/", "工具箱"],
      ["译", "有道翻译", "https://fanyi.youdao.com/#/AITranslate?keyfrom=fanyiweb_tab", "翻译 词典"],
    ],
  },
  {
    title: "开发工具",
    code: "DEV",
    items: [
      ["G", "ChatGPT", "https://chat.openai.com/", "openai ai"],
      ["D", "DeepSeek", "https://chat.deepseek.com/", "deepseek ai"],
      ["Ge", "Gemini", "https://gemini.google.com/", "google ai"],
      ["豆", "豆包", "https://www.doubao.com/", "ai"],
      ["GH", "GitHub", "https://github.com/", "git 代码 开发"],
    ],
  },
  {
    title: "休闲娱乐",
    code: "MEDIA",
    items: [
      ["B", "Bilibili", "https://www.bilibili.com/", "b站 视频"],
      ["抖", "抖音", "https://www.douyin.com/", "douyin 视频"],
      ["红", "小红书", "https://www.xiaohongshu.com/", "社区"],
      ["X", "X", "https://x.com/", "twitter 社交"],
      ["YT", "YouTube", "https://www.youtube.com/", "视频"],
      ["F", "Facebook", "https://www.facebook.com/", "社交"],
    ],
  },
  {
    title: "个人相关",
    code: "PERSONAL",
    items: [
      ["S", "个人主页", "https://xinchen-sea.top/", "homepage"],
      ["B", "BLOG", "https://blog.xinchen-sea.top/", "blog 博客"],
      ["N", "NoteBook", "https://note.xinchen-sea.top/", "notebook note 笔记"],
    ],
  },
];

let tasks = loadTasks();
let renderedItems = [];
let activeGroup = LINK_GROUPS[0].code;
let mottoIndex = 0;
let mottoCharIndex = 0;
let mottoDeleting = false;
let noteTimer;

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks));
    if (Array.isArray(saved)) {
      return saved;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEYS.tasks);
  }

  return [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

function loadSearchEngine() {
  const saved = localStorage.getItem(STORAGE_KEYS.engine);
  return SEARCH_ENGINES[saved] ? saved : "bing";
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function isUrl(value) {
  if (/\s/.test(value)) {
    return false;
  }

  return /^(https?:\/\/|www\.)/i.test(value) || /^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(value);
}

function makeText(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  return element;
}

function renderLinks() {
  linkGrid.replaceChildren();
  linkTabs.replaceChildren();
  renderedItems = [];

  LINK_GROUPS.forEach((group, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.textContent = `${group.title} · ${group.items.length}`;
    tab.dataset.group = group.code;
    tab.setAttribute("role", "tab");
    tab.addEventListener("click", () => {
      activeGroup = group.code;
      renderTabs();
      applyLinkFilter();
    });
    linkTabs.append(tab);

    const section = document.createElement("section");
    section.className = "link-group";
    section.dataset.group = group.code;

    const header = document.createElement("div");
    header.className = "section-header";

    const heading = document.createElement("h3");
    const indexText = makeText("span", "", String(index + 1).padStart(2, "0"));
    heading.append(indexText, ` ${group.title} / ${group.code}`);

    const count = makeText("span", "section-count", String(group.items.length));
    header.append(heading, count);

    const links = document.createElement("div");
    links.className = "links";

    group.items.forEach(([mark, name, href, keywords]) => {
      const item = document.createElement("a");
      item.className = "link-item";
      item.href = href;
      item.target = "_blank";
      item.rel = "noopener noreferrer";
      item.dataset.mark = mark;
      item.dataset.name = name;
      item.dataset.keywords = keywords;

      const markNode = makeText("span", "link-mark", mark);
      const textNode = makeText("span", "link-text", name);
      const arrowNode = makeText("span", "link-arrow", "↗");
      arrowNode.setAttribute("aria-hidden", "true");

      item.append(markNode, textNode, arrowNode);
      links.append(item);
      renderedItems.push(item);
    });

    section.append(header, links);
    linkGrid.append(section);
  });

  siteTotal.textContent = String(renderedItems.length);
}

function renderTabs() {
  linkTabs.querySelectorAll("button").forEach((button) => {
    const selected = button.dataset.group === activeGroup;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
}

function applyLinkFilter() {
  const query = normalize(searchInput.value);
  let count = 0;

  renderedItems.forEach((item) => {
    const itemGroup = item.closest(".link-group")?.dataset.group;
    const haystack = normalize(`${item.dataset.mark} ${item.dataset.name} ${item.dataset.keywords} ${item.href}`);
    const match = query ? haystack.includes(query) : itemGroup === activeGroup;
    item.hidden = !match;
    if (match) {
      count += 1;
    }
  });

  document.querySelectorAll(".link-group").forEach((group) => {
    group.hidden = !group.querySelector(".link-item:not([hidden])");
  });

  siteCount.textContent = String(count);
  emptyState.hidden = count > 0;
}

function resolveSearchUrl(value) {
  const query = value.trim();
  if (!query) {
    return null;
  }

  if (isUrl(query)) {
    return {
      type: "url",
      url: query.startsWith("http") ? query : `https://${query}`,
    };
  }

  return {
    type: "search",
    url: SEARCH_ENGINES[engineSelect.value](query),
  };
}

function appendNote(text) {
  const prefix = quickNote.value.trim() ? "\n" : "";
  quickNote.value += `${prefix}${text}`;
  localStorage.setItem(STORAGE_KEYS.note, quickNote.value);
  updateNoteMeta();
  noteStatus.textContent = "已收进记录";
}

function addTaskText(text) {
  tasks.unshift({ id: createId(), text, done: false });
  saveTasks();
  renderTasks();
}

function findDirectLink(raw) {
  const query = normalize(raw);
  if (!query) {
    return null;
  }

  return renderedItems.find((item) => {
    const name = normalize(item.dataset.name || "");
    const mark = normalize(item.dataset.mark || "");
    return query === name || query === mark;
  });
}

function runSearch(event) {
  event.preventDefault();
  const raw = searchInput.value.trim();
  const command = raw.match(/^([nt])\s+(.+)/i);

  if (command?.[1].toLowerCase() === "n") {
    appendNote(command[2]);
    searchInput.value = "";
    applyLinkFilter();
    return;
  }

  if (command?.[1].toLowerCase() === "t") {
    addTaskText(command[2]);
    searchInput.value = "";
    applyLinkFilter();
    return;
  }

  const direct = findDirectLink(raw);
  if (direct) {
    window.location.href = direct.href;
    return;
  }

  const target = resolveSearchUrl(raw);
  if (target?.type === "search") {
    window.open(target.url, "_blank", "noopener,noreferrer");
    return;
  }

  if (target?.url) {
    window.location.href = target.url;
  }
}

function updateClock() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes().toString().padStart(2, "0");
  const iso = now.toISOString();

  clock.textContent = `${hour.toString().padStart(2, "0")}:${minute}`;
  clock.dateTime = iso;

  const dateText = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);
  const weekdayText = new Intl.DateTimeFormat("zh-CN", { weekday: "long" }).format(now);
  dateLabel.textContent = `${dateText} ${weekdayText}`;
  dateLabel.dateTime = iso;

  const greetingWord =
    hour >= 5 && hour < 11
      ? "早上好"
      : hour >= 11 && hour < 13
        ? "中午好"
        : hour >= 13 && hour < 18
          ? "下午好"
          : "晚上好";

  greeting.textContent = `${greetingWord}，尘心`;
}

function playMotto() {
  const current = MOTTO_CORPUS[mottoIndex];
  mottoText.textContent = current.slice(0, mottoCharIndex);

  let delay = 88;
  if (!mottoDeleting && mottoCharIndex < current.length) {
    mottoCharIndex += 1;
  } else if (!mottoDeleting) {
    mottoDeleting = true;
    delay = 2300;
  } else if (mottoCharIndex > 0) {
    mottoCharIndex -= 1;
    delay = 38;
  } else {
    mottoDeleting = false;
    mottoIndex = (mottoIndex + 1) % MOTTO_CORPUS.length;
    delay = 380;
  }

  window.setTimeout(playMotto, delay);
}

function renderEmptyTask() {
  const empty = document.createElement("li");
  empty.className = "task-empty";

  const title = makeText("strong", "", "今天还没有任务。");
  const detail = makeText("span", "", "写下一个小目标，让今天有一个清晰起点。");
  empty.append(title, detail);
  taskList.append(empty);
}

function renderTasks() {
  taskList.replaceChildren();

  if (!tasks.length) {
    renderEmptyTask();
  }

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.done ? " done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.ariaLabel = `标记 ${task.text} 为完成`;
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const label = makeText("span", "", task.text);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "×";
    removeButton.ariaLabel = `移除 ${task.text}`;
    removeButton.title = "移除";
    removeButton.addEventListener("click", () => {
      tasks = tasks.filter((itemTask) => itemTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, label, removeButton);
    taskList.append(item);
  });

  const done = tasks.filter((task) => task.done).length;
  taskProgress.textContent = `${done}/${tasks.length} 已完成`;
}

function addTask(event) {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  addTaskText(text);
  taskInput.value = "";
}

function updateNoteMeta() {
  noteMeta.textContent = `${quickNote.value.length} 字 · local only`;
}

function saveNoteSoon() {
  noteStatus.textContent = "保存中";
  updateNoteMeta();
  clearTimeout(noteTimer);

  noteTimer = window.setTimeout(() => {
    localStorage.setItem(STORAGE_KEYS.note, quickNote.value);
    noteStatus.textContent = "已自动保存";
  }, 240);
}

async function copyCurrentNote() {
  try {
    await navigator.clipboard.writeText(quickNote.value);
    noteStatus.textContent = "已复制";
  } catch {
    quickNote.select();
    document.execCommand("copy");
    noteStatus.textContent = "已复制";
  }
}

function clearCurrentNote() {
  quickNote.value = "";
  localStorage.setItem(STORAGE_KEYS.note, "");
  noteStatus.textContent = "已清空";
  updateNoteMeta();
}

function restoreNote() {
  quickNote.value = localStorage.getItem(STORAGE_KEYS.note) || "";
  updateNoteMeta();
}

renderLinks();
renderTabs();
engineSelect.value = loadSearchEngine();

searchForm.addEventListener("submit", runSearch);
searchInput.addEventListener("input", applyLinkFilter);
engineSelect.addEventListener("change", () => {
  localStorage.setItem(STORAGE_KEYS.engine, engineSelect.value);
});
window.addEventListener("keydown", (event) => {
  if (event.key !== "/" || document.activeElement === searchInput) {
    return;
  }

  const isTyping =
    document.activeElement instanceof HTMLInputElement ||
    document.activeElement instanceof HTMLTextAreaElement ||
    document.activeElement instanceof HTMLSelectElement;

  if (!isTyping) {
    event.preventDefault();
    searchInput.focus();
  }
});

taskForm.addEventListener("submit", addTask);
quickNote.addEventListener("input", saveNoteSoon);
copyNote.addEventListener("click", copyCurrentNote);
clearNote.addEventListener("click", clearCurrentNote);

updateClock();
window.setInterval(updateClock, 1000);
applyLinkFilter();
renderTasks();
restoreNote();
playMotto();
