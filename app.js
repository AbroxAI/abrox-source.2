// app.js — FINAL Telegram 2026 (Pinned + Realism + Joiner Safe + Stability Fix)

document.addEventListener("DOMContentLoaded", () => {

  const pinBanner = document.getElementById("tg-pin-banner");
  const container = document.getElementById("tg-comments-container");

  if (!container) {
    console.error("tg-comments-container missing in DOM");
    return;
  }

  if (window.__TG_APP_INITIALIZED__) return;
  window.__TG_APP_INITIALIZED__ = true;

  /* =====================================================
     SAFE APPEND WRAPPER
  ===================================================== */
  function appendSafe(persona, text, opts = {}) {
    if (!window.TGRenderer?.appendMessage) {
      console.warn("TGRenderer not ready");
      return null;
    }

    const id = window.TGRenderer.appendMessage(persona, text, opts);

    return id;
  }

  /* =====================================================
     ADMIN BROADCAST (Image + Caption + Glass Button)
  ===================================================== */
  function postAdminBroadcast() {

    if (window.__TG_ADMIN_BROADCASTED__) return window.__TG_ADMIN_BROADCASTED__;

    const admin = window.identity?.Admin || {
      name: "Admin",
      avatar: "assets/admin.jpg",
      isAdmin: true
    };

    const caption =
`📌 Group Rules

1️⃣ New members are read-only until verified.
2️⃣ Admins do NOT DM directly.
3️⃣ 🚫 No screenshots in chat.
4️⃣ ⚠️ Ignore unsolicited messages.

✅ To verify or contact admin, use the Contact Admin button below.`;

    const image = "assets/broadcast.jpg";
    const timestamp = new Date(2025, 2, 14, 10, 0, 0);

    const id = appendSafe(admin, "", {
      timestamp,
      type: "incoming",
      image,
      caption
    });

    window.__TG_ADMIN_BROADCASTED__ = { id, caption, image };

    return window.__TG_ADMIN_BROADCASTED__;
  }

  /* =====================================================
     PIN BANNER
  ===================================================== */
  function showPinBanner(image, caption, pinnedMessageId) {

    if (!pinBanner) return;

    pinBanner.innerHTML = "";

    const img = document.createElement("img");
    img.src = image;
    img.onerror = () => img.src = "assets/admin.jpg";

    const text = document.createElement("div");
    text.className = "pin-text";
    text.textContent = (caption || "Pinned message").split("\n")[0];

    const blueBtn = document.createElement("button");
    blueBtn.className = "pin-btn";
    blueBtn.textContent = "View Pinned";

    blueBtn.onclick = (e) => {
      e.stopPropagation();

      if (!pinnedMessageId) return;

      const el = document.querySelector(`[data-id="${pinnedMessageId}"]`);
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "center" });

      el.classList.add("tg-highlight");
      setTimeout(() => {
        el.classList.remove("tg-highlight");
      }, 2500);
    };

    const adminBtn = document.createElement("a");
    adminBtn.className = "glass-btn";
    adminBtn.href = window.CONTACT_ADMIN_LINK || "https://t.me/ph_suppp";
    adminBtn.target = "_blank";
    adminBtn.rel = "noopener";
    adminBtn.textContent = "Contact Admin";

    const btnContainer = document.createElement("div");
    btnContainer.className = "pin-btn-container";
    btnContainer.appendChild(blueBtn);
    btnContainer.appendChild(adminBtn);

    pinBanner.appendChild(img);
    pinBanner.appendChild(text);
    pinBanner.appendChild(btnContainer);

    pinBanner.classList.remove("hidden");
    requestAnimationFrame(() => {
      pinBanner.classList.add("show");
    });
  }

  function postPinNotice() {
    const system = { name: "System", avatar: "assets/admin.jpg" };
    appendSafe(system, "Admin pinned a message", {
      timestamp: new Date(),
      type: "incoming"
    });
  }

  /* =====================================================
     INITIAL PIN FLOW (Waits for Renderer)
  ===================================================== */
  function initializePinFlow() {

    if (!window.TGRenderer?.appendMessage) {
      setTimeout(initializePinFlow, 200);
      return;
    }

    const broadcast = postAdminBroadcast();

    setTimeout(() => {
      postPinNotice();
      showPinBanner(broadcast.image, broadcast.caption, broadcast.id);
    }, 1000);
  }

  initializePinFlow();

  /* =====================================================
     ADMIN AUTO RESPONSE (Safe)
  ===================================================== */
  let adminCooldown = false;

  document.addEventListener("sendMessage", (ev) => {

    if (adminCooldown) return;

    const text = ev.detail?.text?.toLowerCase() || "";

    if (text.includes("admin") || text.includes("contact")) {

      adminCooldown = true;
      setTimeout(() => adminCooldown = false, 5000);

      const admin = window.identity?.Admin || {
        name: "Admin",
        avatar: "assets/admin.jpg"
      };

      window.TGRenderer?.showTyping(admin);

      setTimeout(() => {
        appendSafe(
          admin,
          "Please use the Contact Admin button in the pinned banner above.",
          { timestamp: new Date(), type: "incoming" }
        );
      }, 1500);
    }
  });

  /* =====================================================
     AUTO REPLY HANDLER (Realism Reply Mode)
  ===================================================== */
  document.addEventListener("autoReply", (ev) => {

    const { parentText, persona, text } = ev.detail || {};
    if (!persona || !text) return;

    window.TGRenderer?.showTyping(persona);

    setTimeout(() => {
      appendSafe(persona, text, {
        timestamp: new Date(),
        type: "incoming",
        replyToText: parentText
      });
    }, 1400);
  });

  /* =====================================================
     START REALISM ENGINE (Single Instance)
  ===================================================== */
  if (window.realism?.simulateRandomCrowdV11 && !window.__TG_REALISM_STARTED__) {
    window.__TG_REALISM_STARTED__ = true;

    setTimeout(() => {
      window.realism.simulateRandomCrowdV11();
    }, 800);
  }

  /* =====================================================
     SAFE INPUT BAR FIX (No White Box)
  ===================================================== */
  const inputBar = document.querySelector(".tg-input-bar");

  if (inputBar) {
    inputBar.style.background = "rgba(23,33,43,0.78)";
    inputBar.style.backdropFilter = "blur(24px)";
    inputBar.style.webkitBackdropFilter = "blur(24px)";
    inputBar.style.borderRadius = "26px";
  }

  console.log("app.js fully stabilized and synced");

});
