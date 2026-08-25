document.addEventListener('DOMContentLoaded', () => {
  const launchBtn = document.getElementById('aiLaunchBtn');
  const closeBtn = document.getElementById('aiCloseBtn');
  const chatWindow = document.getElementById('aiChatWindow');
  const chatForm = document.getElementById('aiChatForm');
  const chatInput = document.getElementById('aiChatInput');
  const chatMessages = document.getElementById('aiChatMessages');
  const chips = document.querySelectorAll('.ai-chip');

  if (!launchBtn || !chatWindow) return;

  // Toggle Chat Window
  launchBtn.addEventListener('click', () => {
    const isVisible = chatWindow.style.display === 'flex';
    chatWindow.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) chatInput.focus();
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
  });

  // Suggestion Chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.prompt;
      if (prompt) {
        sendMessage(prompt);
      }
    });
  });

  // Handle Form Submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if (!msg) return;
    chatInput.value = '';
    sendMessage(msg);
  });

  async function sendMessage(userText) {
    // Append User Message
    appendMessage(userText, 'user');

    // Show Typing Indicator
    const typingElem = document.createElement('div');
    typingElem.className = 'ai-msg ai-msg-bot d-flex align-items-center gap-1';
    typingElem.innerHTML = '<span class="spinner-grow spinner-grow-sm text-danger" role="status"></span> Thinking & searching verified stays...';
    chatMessages.appendChild(typingElem);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      const data = await res.json();
      typingElem.remove();

      // Format Bot Reply with Markdown-style bold
      let formattedReply = (data.reply || "Here's what I found for you:").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      let replyHtml = `<div class="mb-2">${formattedReply}</div>`;

      // Render Itinerary if available
      if (data.itinerary && data.itinerary.days) {
        replyHtml += `<div class="p-3 my-2 rounded-3 border bg-white text-dark shadow-sm">
          <div class="fw-bold text-danger mb-2"><i class="fa-solid fa-route me-1"></i> ${data.itinerary.destination} 3-Day Plan</div>`;
        data.itinerary.days.forEach(d => {
          replyHtml += `<div class="mb-2">
            <div class="fw-bold small text-secondary">${d.day}</div>
            <ul class="ps-3 mb-0 small text-muted">
              ${d.activities.map(a => `<li>${a}</li>`).join('')}
            </ul>
          </div>`;
        });
        replyHtml += `</div>`;
      }

      // Render Listings Cards if returned
      if (data.listings && data.listings.length > 0) {
        replyHtml += `<div class="d-flex flex-column gap-2 mt-2">`;
        data.listings.forEach(l => {
          replyHtml += `
            <a href="/listings/${l.id}" class="d-flex align-items-center gap-2 p-2 rounded-3 border bg-white text-dark text-decoration-none shadow-sm" style="transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
              <img src="${l.imageUrl}" alt="${l.title}" style="width: 54px; height: 54px; border-radius: 8px; object-fit: cover;" />
              <div style="min-width: 0; flex: 1;">
                <div class="fw-bold small text-truncate">${l.title}</div>
                <div class="text-muted" style="font-size: 0.75rem;"><i class="fa-solid fa-location-dot me-1 text-danger"></i>${l.location}</div>
                <div class="fw-bold text-danger small mt-1">₹${l.price.toLocaleString('en-IN')} <span class="text-muted fw-normal" style="font-size: 0.7rem;">/night</span></div>
              </div>
            </a>
          `;
        });
        replyHtml += `</div>`;
      }

      appendMessage(replyHtml, 'bot', true);

    } catch (err) {
      typingElem.remove();
      appendMessage("Sorry, I encountered an issue while retrieving recommendations. Please try again.", 'bot');
    }
  }

  function appendMessage(content, sender, isHtml = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ai-msg-${sender}`;
    if (isHtml) {
      msgDiv.innerHTML = content;
    } else {
      msgDiv.textContent = content;
    }
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
