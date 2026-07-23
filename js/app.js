import {
  auth,
  db,
  firebaseConfigured,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut
} from "./firebase.js";

const appEl = document.querySelector("#app");

const state = {
  route: "landing",
  child: null,
  parentUser: null,
  parentTab: "home",
  notice: "",
  error: ""
};

const children = {
  wyatt: { name: "Wyatt", icon: "🧢", level: 12, xp: 840, streak: 6 },
  nolan: { name: "Nolan", icon: "🏒", level: 9, xp: 610, streak: 4 }
};

const demoQuests = [
  { icon: "☀️", title: "Morning routine", meta: "25 XP · Before school" },
  { icon: "📚", title: "Complete school assignments", meta: "40 XP · School" },
  { icon: "🏋️", title: "Training session", meta: "35 XP · Strength" },
  { icon: "❤️", title: "Help someone without being asked", meta: "20 XP · Character" }
];

function esc(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
  }[char]));
}

function layout(content, nav = "") {
  appEl.innerHTML = `<main class="shell"><div class="container">${content}</div>${nav}</main>`;
}

function renderLanding() {
  layout(`
    <section class="hero">
      <p class="eyebrow">Bell Family</p>
      <h1>Choose your adventure.</h1>
      <p class="lead">The boys get a focused dashboard for school, training, character, rewards, and progress. Parents manage the family from a secure command center.</p>
    </section>
    <section class="grid profile-grid" aria-label="Choose a profile">
      ${Object.entries(children).map(([id, child]) => `
        <button class="card profile-card" data-child="${id}">
          <span class="avatar">${child.icon}</span>
          <h2>${child.name}</h2>
          <p>Open today's quests, progress, rewards, and schedule.</p>
          <div class="action">Continue →</div>
        </button>
      `).join("")}
      <button class="card profile-card" data-route="parent-login">
        <span class="avatar">🔒</span>
        <h2>Parent Dashboard</h2>
        <p>Plan the week, approve quests, manage rewards, and track both boys.</p>
        <div class="action">Open command center →</div>
      </button>
    </section>
  `);
}

function renderKid() {
  const child = children[state.child];
  layout(`
    <div class="topbar">
      <div><p class="eyebrow">Today's Adventure</p><h2>${child.icon} Good evening, ${child.name}</h2></div>
      <button class="back-btn" data-route="landing">Switch profile</button>
    </div>
    <section class="grid dashboard-grid">
      <div class="card panel">
        <h2>Today's quests</h2>
        ${demoQuests.map((quest, index) => `
          <div class="quest">
            <div class="quest-icon">${quest.icon}</div>
            <div class="quest-copy"><div class="quest-title">${quest.title}</div><div class="quest-meta">${quest.meta}</div></div>
            <button data-complete="${index}">Done</button>
          </div>
        `).join("")}
      </div>
      <div class="stack">
        <div class="grid stat-grid">
          <div class="card stat"><strong>${child.level}</strong><span>Level</span></div>
          <div class="card stat"><strong>${child.xp}</strong><span>Total XP</span></div>
          <div class="card stat"><strong>${child.streak}</strong><span>Day streak</span></div>
          <div class="card stat"><strong>2</strong><span>Rewards ready</span></div>
        </div>
        <div class="card panel"><h3>Family challenge</h3><p class="lead">Complete 25 family quests this week.</p><div class="notice">18 of 25 complete</div></div>
      </div>
    </section>
  `, kidNav());
}

function kidNav() {
  return `<nav class="bottom-nav" aria-label="Kid navigation">
    <button class="active">Today</button><button>Quests</button><button>Rewards</button><button>Journal</button><button>Profile</button>
  </nav>`;
}

function renderParentLogin() {
  const configuredNotice = firebaseConfigured
    ? `<div class="notice">Firebase is connected. Sign in with an approved parent Google account.</div>`
    : `<div class="notice">Firebase is not connected yet. Add the three missing values in <strong>js/firebase-config.js</strong>, commit, and push.</div>`;

  layout(`
    <div class="topbar"><button class="back-btn" data-route="landing">← Back</button></div>
    <section class="card login-card">
      <p class="eyebrow">Parent Access</p>
      <h1>Family command center</h1>
      <p class="lead">Parent tools require Google sign-in. A local PIN screen will be added after the authorized-parent database record is established.</p>
      ${configuredNotice}
      ${state.error ? `<div class="notice error">${esc(state.error)}</div>` : ""}
      <div class="login-actions">
        <button class="primary-btn" id="googleSignIn" ${firebaseConfigured ? "" : "disabled"}>Continue with Google</button>
        ${state.parentUser ? `<button class="ghost-btn" id="openParent">Open dashboard</button>` : ""}
      </div>
    </section>
  `);
}

function renderParent() {
  const userName = state.parentUser?.displayName || "Parent";
  layout(`
    <div class="topbar">
      <div><p class="eyebrow">Bell Family Command Center</p><h2>Welcome, ${esc(userName)}</h2></div>
      <button class="ghost-btn" id="signOut">Sign out</button>
    </div>
    <section class="grid dashboard-grid">
      <div class="stack">
        <div class="card panel"><h2>Today's family schedule</h2>
          <div class="quest"><div class="quest-icon">📚</div><div class="quest-copy"><div class="quest-title">School block</div><div class="quest-meta">Wyatt and Nolan · Morning</div></div></div>
          <div class="quest"><div class="quest-icon">🏒</div><div class="quest-copy"><div class="quest-title">Hockey practice</div><div class="quest-meta">5:00 PM</div></div></div>
        </div>
        <div class="card panel"><h2>Pending approvals</h2><div class="notice">No live Firestore approvals yet. This panel is ready for Sprint 2.</div></div>
      </div>
      <div class="stack">
        <div class="grid stat-grid">
          <div class="card stat"><strong>4</strong><span>Quests pending</span></div>
          <div class="card stat"><strong>2</strong><span>Reward requests</span></div>
          <div class="card stat"><strong>18</strong><span>Family quests</span></div>
          <div class="card stat"><strong>1</strong><span>Journal entry</span></div>
        </div>
        <div class="card panel"><h3>Cloud status</h3><p class="lead">Authentication is active. Next we will create the family record and secure Firestore rules.</p></div>
      </div>
    </section>
  `, parentNav());
}

function parentNav() {
  return `<nav class="bottom-nav" aria-label="Parent navigation">
    ${["Home","Schedule","Approvals","Kids","More"].map((tab) => `<button class="${state.parentTab === tab.toLowerCase() ? "active" : ""}" data-parent-tab="${tab.toLowerCase()}">${tab}</button>`).join("")}
  </nav>`;
}

function render() {
  if (state.route === "kid") return renderKid();
  if (state.route === "parent-login") return renderParentLogin();
  if (state.route === "parent") return renderParent();
  renderLanding();
}

async function googleSignIn() {
  state.error = "";
  try {
    const provider = new GoogleAuthProvider();
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
    }
  } catch (error) {
    state.error = error?.message || "Google sign-in failed.";
    render();
  }
}

document.addEventListener("click", async (event) => {
  const childButton = event.target.closest("[data-child]");
  if (childButton) {
    state.child = childButton.dataset.child;
    state.route = "kid";
    render();
    return;
  }

  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    state.route = routeButton.dataset.route;
    render();
    return;
  }

  if (event.target.closest("#googleSignIn")) await googleSignIn();
  if (event.target.closest("#openParent") && state.parentUser) { state.route = "parent"; render(); }
  if (event.target.closest("#signOut")) { await signOut(auth); state.route = "landing"; render(); }

  const complete = event.target.closest("[data-complete]");
  if (complete) {
    complete.textContent = "Submitted";
    complete.disabled = true;
  }
});

if (firebaseConfigured) {
  onAuthStateChanged(auth, (user) => {
    state.parentUser = user;
    if (user && state.route === "parent-login") state.route = "parent";
    render();
  });
} else {
  render();
}
