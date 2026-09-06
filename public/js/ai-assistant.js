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
    if (!isVisible && chatInput) {
      setTimeout(() => chatInput.focus(), 150);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatWindow.style.display = 'none';
    });
  }

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
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = chatInput.value.trim();
      if (!msg) return;
      chatInput.value = '';
      sendMessage(msg);
    });
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<div class="my-1"></div>')
      .replace(/\n/g, '<br/>');
    return formatted;
  }

  async function sendMessage(userText) {
    // Append User Message
    appendMessage(userText, 'user');

    // Show Typing Indicator
    const typingElem = document.createElement('div');
    typingElem.className = 'ai-msg ai-msg-bot d-flex align-items-center gap-2';
    typingElem.id = 'aiTypingIndicator';
    typingElem.innerHTML = `
      <div class="spinner-grow spinner-grow-sm text-danger" role="status" style="width: 0.8rem; height: 0.8rem;"></div>
      <span class="small text-muted">WanderBot is crafting your answer...</span>
    `;
    chatMessages.appendChild(typingElem);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      const data = await res.json();
      
      const indicator = document.getElementById('aiTypingIndicator');
      if (indicator) indicator.remove();

      let replyText = data.reply || "Here is what I found for your journey:";
      let formattedReply = formatMarkdown(replyText);

      let replyHtml = `<div class="mb-2" style="line-height: 1.45;">${formattedReply}</div>`;

      // Render Itinerary if available
      if (data.itinerary && data.itinerary.days && data.itinerary.days.length > 0) {
        replyHtml += `
          <div class="p-3 my-2 rounded-3 border bg-white text-dark shadow-sm" style="font-size: 0.85rem;">
            <div class="fw-bold text-danger mb-2 d-flex align-items-center gap-1">
              <i class="fa-solid fa-route"></i>
              <span>${data.itinerary.destination} 3-Day Curated Plan</span>
            </div>`;
        
        data.itinerary.days.forEach(d => {
          replyHtml += `
            <div class="mb-2 pb-2 border-bottom last-border-0" style="border-color: #f1f3f5 !important;">
              <div class="fw-bold text-dark small mb-1">${d.day}</div>
              <ul class="ps-3 mb-0 small text-secondary" style="line-height: 1.4;">
                ${d.activities.map(a => `<li class="mb-1">${a}</li>`).join('')}
              </ul>
            </div>`;
        });
        
        replyHtml += `</div>`;
      }

      // Render Listings Cards if returned
      if (data.listings && data.listings.length > 0) {
        replyHtml += `<div class="d-flex flex-column gap-2 mt-2">`;
        data.listings.forEach(l => {
          const formattedPrice = typeof l.price === 'number' 
            ? l.price.toLocaleString('en-IN') 
            : (l.price || '2,500');
          
          const imgUrl = l.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60';

          replyHtml += `
            <a href="/listings/${l.id}" class="d-flex align-items-center gap-2 p-2 rounded-3 border bg-white text-dark text-decoration-none shadow-sm" style="transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
              <img src="${imgUrl}" alt="${l.title}" style="width: 58px; height: 58px; border-radius: 8px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60'" />
              <div style="min-width: 0; flex: 1;">
                <div class="fw-bold small text-truncate text-dark">${l.title}</div>
                <div class="text-muted text-truncate" style="font-size: 0.73rem;"><i class="fa-solid fa-location-dot me-1 text-danger"></i>${l.location}</div>
                <div class="d-flex align-items-center justify-content-between mt-1">
                  <span class="fw-bold text-danger small">₹${formattedPrice} <span class="text-muted fw-normal" style="font-size: 0.7rem;">/night</span></span>
                  <span class="badge bg-light text-dark border" style="font-size: 0.68rem;"><i class="fa-solid fa-star text-warning me-1"></i>${l.rating}</span>
                </div>
              </div>
            </a>
          `;
        });
        replyHtml += `</div>`;
      }

      appendMessage(replyHtml, 'bot', true);

    } catch (err) {
      console.error("Chat error:", err);
      const indicator = document.getElementById('aiTypingIndicator');
      if (indicator) indicator.remove();
      
      appendMessage(
        `👋 I'm here to help! You can ask me things like:<br/>` +
        `• <strong>"Beachfront villas in Goa under ₹5000"</strong><br/>` +
        `• <strong>"Plan a 3-day trip to Manali"</strong><br/>` +
        `• <strong>"How do I host my property?"</strong><br/>` +
        `• <strong>"What is the cancellation policy?"</strong>`,
        'bot',
        true
      );
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
