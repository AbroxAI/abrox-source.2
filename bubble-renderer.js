// bubble-renderer-full.js
// FULL TG-LIKE CHAT BUBBLES — AVATARS, REACTIONS, REPLIES, TIMESTAMPS

(function(){

const container = document.getElementById("tg-comments-container");
if(!container) return;

window.TGRenderer = window.TGRenderer||{};

const BUBBLE_ID_PREFIX = "tg_bubble_";

// Append a message bubble
function appendMessage(persona, text, opts={}){
  const id = opts.id || BUBBLE_ID_PREFIX + Date.now() + "_" + Math.floor(Math.random()*9999);

  // Container bubble
  const bubble = document.createElement("div");
  bubble.className = "tg-bubble " + (opts.type==="outgoing"?"outgoing":"incoming");
  bubble.dataset.id = id;

  // Avatar
  const avatar = document.createElement("img");
  avatar.className = "tg-bubble-avatar";
  avatar.src = persona.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(persona.name||"U")}`;
  avatar.alt = persona.name||"User";
  bubble.appendChild(avatar);

  // Content wrapper
  const content = document.createElement("div");
  content.className = "tg-bubble-content";

  // Name
  const nameEl = document.createElement("div");
  nameEl.className = "tg-bubble-name";
  nameEl.textContent = persona.name||"User";
  content.appendChild(nameEl);

  // Text
  const textEl = document.createElement("div");
  textEl.className = "tg-bubble-text";
  textEl.textContent = text;
  content.appendChild(textEl);

  // Timestamp
  const tsEl = document.createElement("div");
  tsEl.className = "tg-bubble-timestamp";
  tsEl.textContent = opts.timestamp ? new Date(opts.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  content.appendChild(tsEl);

  bubble.appendChild(content);

  // Reply to
  if(opts.replyToText){
    const replyEl = document.createElement("div");
    replyEl.className = "tg-bubble-reply";
    replyEl.textContent = opts.replyToText;
    content.insertBefore(replyEl, textEl);
  }

  // Reactions container
  const reactionsContainer = document.createElement("div");
  reactionsContainer.className = "tg-bubble-reactions";
  bubble.appendChild(reactionsContainer);

  // Append bubble to container
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;

  return id;
}

// Show typing indicator
function showTyping(persona){
  let typingEl = document.getElementById("tg-typing-indicator");
  if(!typingEl){
    typingEl = document.createElement("div");
    typingEl.id = "tg-typing-indicator";
    typingEl.className = "tg-typing-indicator";
    container.appendChild(typingEl);
  }
  typingEl.textContent = `${persona.name||"User"} is typing...`;
  setTimeout(()=>{ typingEl.remove(); }, 1200 + Math.random()*1000);
}

// Add a reaction to a bubble
function addReaction(bubbleId, emoji){
  const bubble = container.querySelector(`[data-id="${bubbleId}"]`);
  if(!bubble) return;
  const reactionsContainer = bubble.querySelector(".tg-bubble-reactions");
  if(!reactionsContainer) return;

  const reactEl = document.createElement("span");
  reactEl.className = "tg-bubble-reaction";
  reactEl.textContent = emoji;
  reactionsContainer.appendChild(reactEl);
}

// Export
Object.assign(window.TGRenderer, {
  appendMessage,
  showTyping,
  addReaction
});

console.log("TG Bubble Renderer FULL initialized");

})();
