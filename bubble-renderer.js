// bubble-renderer.js — full Telegram 2026 compatible, patched & reactive
(function(){
  const container = document.getElementById("tg-comments-container");
  if(!container) return;

  const TGRenderer = window.TGRenderer = window.TGRenderer || {};
  const bubbles = new Map();
  const jumpIndicator = document.getElementById("tg-jump-indicator");
  const jumpText = document.getElementById("tg-jump-text");

  // UTILS
  function createBubbleElement(persona, text, opts = {}) {
    const bubble = document.createElement("div");
    bubble.className = "tg-bubble " + (opts.type || "incoming");
    bubble.dataset.id = opts.id || `msg_${Date.now()}_${Math.floor(Math.random()*9999)}`;
    bubble.dataset.timestamp = opts.timestamp ? opts.timestamp.getTime() : Date.now();

    const avatar = document.createElement("img");
    avatar.className = "tg-bubble-avatar";
    avatar.src = persona.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(persona.name||"U")}`;
    avatar.alt = persona.name || "User";
    bubble.appendChild(avatar);

    const content = document.createElement("div");
    content.className = "tg-bubble-content";

    const nameEl = document.createElement("div");
    nameEl.className = "tg-bubble-name";
    nameEl.textContent = persona.name || "User";
    content.appendChild(nameEl);

    const textEl = document.createElement("div");
    textEl.className = "tg-bubble-text";
    textEl.textContent = text || "";
    content.appendChild(textEl);

    // replies
    if(opts.replyToText) {
      const replyEl = document.createElement("div");
      replyEl.className = "tg-bubble-reply";
      replyEl.textContent = opts.replyToText;
      content.insertBefore(replyEl, textEl);
    }

    bubble.appendChild(content);
    return bubble;
  }

  function scrollToBottom(force = false) {
    if(force || container.scrollTop + container.clientHeight >= container.scrollHeight - 10){
      container.scrollTop = container.scrollHeight;
      if(jumpIndicator) jumpIndicator.classList.add("hidden");
    } else if(jumpIndicator){
      jumpIndicator.classList.remove("hidden");
    }
  }

  // PUBLIC API
  TGRenderer.appendMessage = function(persona, text, opts = {}){
    const bubble = createBubbleElement(persona, text, opts);
    container.appendChild(bubble);
    bubbles.set(bubble.dataset.id, bubble);

    // auto scroll
    scrollToBottom();

    // return id
    return bubble.dataset.id;
  };

  TGRenderer.showTyping = function(persona, duration = 1000){
    const typingEl = document.createElement("div");
    typingEl.className = "tg-bubble tg-typing incoming";
    const avatar = document.createElement("img");
    avatar.className = "tg-bubble-avatar";
    avatar.src = persona.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(persona.name||"U")}`;
    avatar.alt = persona.name || "User";
    typingEl.appendChild(avatar);

    const dots = document.createElement("div");
    dots.className = "tg-bubble-dots";
    dots.innerHTML = `<span></span><span></span><span></span>`;
    typingEl.appendChild(dots);

    container.appendChild(typingEl);
    scrollToBottom();

    setTimeout(() => {
      if(typingEl.parentElement) typingEl.parentElement.removeChild(typingEl);
    }, duration);
  };

  // MESSAGE JUMPER
  if(jumpIndicator){
    jumpIndicator.addEventListener("click", ()=>{
      scrollToBottom(true);
    });
  }

  // REACTIONS
  TGRenderer.addReaction = function(messageId, emoji){
    const bubble = bubbles.get(messageId);
    if(!bubble) return;
    let reactionsEl = bubble.querySelector(".tg-bubble-reactions");
    if(!reactionsEl){
      reactionsEl = document.createElement("div");
      reactionsEl.className = "tg-bubble-reactions";
      bubble.appendChild(reactionsEl);
    }
    const r = document.createElement("span");
    r.className = "tg-bubble-reaction";
    r.textContent = emoji;
    reactionsEl.appendChild(r);
  };

  // LONDON SESSION ERC simulation
  function simulateLondonSession(){
    const messages = Array.from(container.querySelectorAll(".tg-bubble.incoming"));
    if(messages.length < 5) return;

    // randomly add reactions to older messages
    messages.forEach(msg=>{
      if(Math.random() < 0.08){
        const emoji = window.realismEngineV11EMOJIS ? window.realismEngineV11EMOJIS[Math.floor(Math.random()*window.realismEngineV11EMOJIS.length)] : "💹";
        TGRenderer.addReaction(msg.dataset.id, emoji);
      }
    });
  }

  setInterval(simulateLondonSession, 5000);

  console.log("Bubble renderer FULL — message jumper, reactions, typing, London session ERC active");
})();
