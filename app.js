const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const clock = document.querySelector("#clock");
const dateLabel = document.querySelector("#date");
const greeting = document.querySelector("#greeting");
const mottoText = document.querySelector("#mottoText");
const engineSelect = document.querySelector("#engineSelect");
const linkItems = Array.from(document.querySelectorAll(".link-item"));
const linkGroups = Array.from(document.querySelectorAll(".link-group"));
const siteCount = document.querySelector("#siteCount");
const siteTotal = document.querySelector("#siteTotal");
const emptyState = document.querySelector("#emptyState");

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
  tasks: "command-home.tasks",
  note: "command-home.quick-note",
  engine: "command-home.search-engine",
};

const MOTTO_CORPUS = ["以狂笑拥抱世俗，以愚钝对抗虚无"];

const SEARCH_ENGINES = {
  bing: {
    label: "Bing",
    url: (query) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
  },
  baidu: {
    label: "百度",
    url: (query) => `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
  },
  google: {
    label: "Google",
    url: (query) =>
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  },
  github: {
    label: "GitHub",
    url: (query) => `https://github.com/search?q=${encodeURIComponent(query)}`,
  },
};

const defaultTasks = [
  { id: createId(), text: "梳理今天最重要的一件事", done: false },
  { id: createId(), text: "推进一个可交付的小改进", done: false },
  { id: createId(), text: "清理一处未闭合的信息", done: false },
];

let tasks = loadTasks();
let noteTimer;
let mottoIndex = 0;
let mottoCharIndex = 0;
let mottoDeleting = false;

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

  return defaultTasks;
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

function loadSearchEngine() {
  const saved = localStorage.getItem(STORAGE_KEYS.engine);
  return SEARCH_ENGINES[saved] ? saved : "bing";
}

function saveSearchEngine(engine) {
  localStorage.setItem(STORAGE_KEYS.engine, engine);
}

function restoreSearchEngine() {
  engineSelect.value = loadSearchEngine();
}

function updateClock() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes().toString().padStart(2, "0");
  const displayHour = hour.toString().padStart(2, "0");
  const iso = now.toISOString();

  clock.textContent = `${displayHour}:${minute}`;
  clock.dateTime = iso;
  dateLabel.textContent = new Intl.DateTimeFormat("zh-CN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);
  dateLabel.dateTime = iso;

  const greetingWord =
    hour >= 5 && hour < 11
      ? "上午好"
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

  let delay = 92;
  if (!mottoDeleting && mottoCharIndex < current.length) {
    mottoCharIndex += 1;
  } else if (!mottoDeleting) {
    mottoDeleting = true;
    delay = 2400;
  } else if (mottoCharIndex > 0) {
    mottoCharIndex -= 1;
    delay = 42;
  } else {
    mottoDeleting = false;
    mottoIndex = (mottoIndex + 1) % MOTTO_CORPUS.length;
    delay = 420;
  }

  window.setTimeout(playMotto, delay);
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function isUrl(value) {
  return /^(https?:\/\/|www\.)/i.test(value);
}

function resolveSearchUrl(value) {
  const query = value.trim();
  if (!query) {
    return null;
  }

  if (isUrl(query)) {
    return query.startsWith("http") ? query : `https://${query}`;
  }

  return SEARCH_ENGINES[engineSelect.value].url(query);
}

function applyLinkFilter() {
  const query = normalize(searchInput.value);
  let count = 0;

  linkItems.forEach((item) => {
    const haystack = normalize(`${item.textContent} ${item.dataset.keywords || ""} ${item.href}`);
    const match = !query || haystack.includes(query);
    item.hidden = !match;
    if (match) {
      count += 1;
    }
  });

  linkGroups.forEach((group) => {
    group.hidden = !group.querySelector(".link-item:not([hidden])");
  });

  siteCount.textContent = count;
  siteTotal.textContent = linkItems.length;
  emptyState.style.display = count ? "none" : "block";
}

function runSearch(event) {
  event.preventDefault();

  const url = resolveSearchUrl(searchInput.value);
  if (!url) {
    searchInput.focus();
    return;
  }

  window.location.href = url;
}

function renderTasks() {
  taskList.innerHTML = "";

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

    const label = document.createElement("span");
    label.textContent = task.text;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-task";
    removeButton.textContent = "×";
    removeButton.ariaLabel = `移除 ${task.text}`;
    removeButton.addEventListener("click", () => {
      tasks = tasks.filter((itemTask) => itemTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, label, removeButton);
    taskList.append(item);
  });

  const done = tasks.filter((task) => task.done).length;
  taskProgress.textContent = `${done}/${tasks.length} 完成`;
}

function addTask(event) {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: createId(),
    text,
    done: false,
  });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function updateNoteMeta() {
  const length = quickNote.value.length;
  noteMeta.textContent = `${length} 字`;
}

function saveNoteSoon() {
  noteStatus.textContent = "保存中...";
  updateNoteMeta();
  clearTimeout(noteTimer);

  noteTimer = window.setTimeout(() => {
    localStorage.setItem(STORAGE_KEYS.note, quickNote.value);
    noteStatus.textContent = "已自动保存";
  }, 240);
}

async function copyCurrentNote() {
  const text = quickNote.value;

  try {
    await navigator.clipboard.writeText(text);
    noteStatus.textContent = "已复制";
  } catch {
    quickNote.select();
    document.execCommand("copy");
    noteStatus.textContent = "已复制";
  }

  window.setTimeout(() => {
    noteStatus.textContent = "已自动保存";
  }, 1200);
}

function clearCurrentNote() {
  quickNote.value = "";
  localStorage.setItem(STORAGE_KEYS.note, "");
  updateNoteMeta();
  noteStatus.textContent = "已清空";

  window.setTimeout(() => {
    noteStatus.textContent = "已自动保存";
  }, 1200);
}

function restoreNote() {
  quickNote.value = localStorage.getItem(STORAGE_KEYS.note) || "";
  updateNoteMeta();
}

searchForm.addEventListener("submit", runSearch);
searchInput.addEventListener("input", applyLinkFilter);
engineSelect.addEventListener("change", () => {
  saveSearchEngine(engineSelect.value);
  searchInput.focus();
});
taskForm.addEventListener("submit", addTask);
quickNote.addEventListener("input", saveNoteSoon);
copyNote.addEventListener("click", copyCurrentNote);
clearNote.addEventListener("click", clearCurrentNote);

window.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    const isTyping =
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement;

    if (!isTyping) {
      event.preventDefault();
      searchInput.focus();
    }
  }
});

updateClock();
window.setInterval(updateClock, 1000);
restoreSearchEngine();
applyLinkFilter();
renderTasks();
restoreNote();
playMotto();
searchInput.focus();
