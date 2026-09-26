(() => {
  // Change this one value to whatever VC password you want.
  const VC_PASSWORD = "VC-UNLOCK";
  const profiles = [
    {name:"Eymrola", img:"Profile/profile1.gif", status:"In the call", badge:"HOST"},
    {name:"A-SHEN-TADES", img:"Profile/profile2.webp", status:"Listening", badge:"MEMBER"},
    {name:"TOZI", img:"Profile/profile3.webp", status:"Listening", badge:"MEMBER"}
  ];

  const $ = s => document.querySelector(s);
  const participants = $("#participants");
  const backdrop = $("#modalBackdrop");
  const modal = $("#modal");
  const music = $("#bgMusic");
  let unlocked = false, muted = false, joined = false, musicOn = true;

  const room = new URLSearchParams(location.search).get("room") || "hidden-room";
  $("#roomName").textContent = "# " + room;

  function render() {
    const list = [...profiles];
    if (joined) list.push({name:"YOU", img:null, status: unlocked ? "Voice connected" : "Locked • audio off", badge:"YOU", self:true});
    participants.classList.toggle("has-four", list.length > 3);
    participants.innerHTML = list.map(p => `
      <article class="card ${p.self ? "self" : ""}">
        ${p.self ? '<div class="question">?</div>' : ""}
        <span class="badge">${p.badge}</span>
        ${p.img ? `<img class="avatar" src="${p.img}" alt="${p.name}">` : `<div class="avatar question-avatar">?</div>`}
        <div class="identity"><div class="name">${p.name}</div><div class="status">${p.status}</div></div>
      </article>
    `).join("");
  }

  function openModal(html) {
    modal.innerHTML = html;
    backdrop.classList.remove("hidden");
    const input = modal.querySelector("input");
    if (input) setTimeout(() => input.focus(), 30);
  }
  function closeModal(){backdrop.classList.add("hidden"); modal.innerHTML="";}

  function passwordModal() {
    openModal(`
      <h2>Hey, stop right here!</h2>
      <p>You need a password to unlock VC. Without the correct code, you can stay in the call, but you will not hear anyone.</p>
      <div class="password-wrap"><input id="codeInput" type="password" placeholder="Type VC code" autocomplete="off"><button class="primary" id="codeSubmit">Unlock</button></div>
      <div class="error" id="codeError"></div>
      <div class="modal-actions"><button class="secondary" id="noPass">I don't have a password</button></div>
    `);
    $("#codeSubmit").onclick = checkPassword;
    $("#codeInput").onkeydown = e => { if(e.key === "Enter") checkPassword(); };
    $("#noPass").onclick = () => { closeModal(); showNoPasswordNotice(); };
  }

  function checkPassword() {
    const input = $("#codeInput");
    const error = $("#codeError");
    if ((input.value || "").trim() === VC_PASSWORD) {
      unlocked = true;
      closeModal();
      joined = true;
      render();
      $("#lockedBanner").innerHTML = `<div class="lock-icon" style="color:#6bffcf;border-color:rgba(76,255,203,.35);background:rgba(76,255,203,.07)">✓</div><div><strong>VC UNLOCKED</strong><span>Voice access is active for this call.</span></div><button class="unlock-small" id="lockAgain">LOCK</button>`;
      $("#lockAgain").onclick = () => { unlocked=false; render(); passwordModal(); };
    } else {
      error.textContent = "That code is not valid.";
      input.animate([{transform:"translateX(-4px)"},{transform:"translateX(4px)"},{transform:"translateX(0)"}], {duration:180});
    }
  }

  function showNoPasswordNotice() {
    openModal(`
      <h2 class="rainbow-text">UNLOCK VC</h2>
      <p>Please type in a code to join this call. You can still stay here and use the mute control, but voice audio remains locked.</p>
      <div class="modal-actions"><button class="secondary" id="closeNotice">Stay in call</button><button class="primary" id="tryCode">Type a code</button></div>
    `);
    $("#tryCode").onclick = passwordModal;
    $("#closeNotice").onclick = closeModal;
  }

  function join() {
    joined = true;
    render();
    // Attempt music immediately; browsers may require one user gesture.
    music.volume = 0.28;
    music.play().catch(()=>{});
    setTimeout(passwordModal, 2000);
  }

  $("#unlockTop").onclick = passwordModal;
  $("#muteBtn").onclick = () => {
    muted = !muted;
    $("#muteBtn").classList.toggle("muted", muted);
    $("#muteBtn").setAttribute("aria-pressed", String(muted));
    $("#muteBtn").querySelector(".control-icon").textContent = muted ? "×" : "◖";
  };
  $("#mixBtn").onclick = () => openModal(`
    <h2>Mix options</h2><p>Call controls and audio routing.</p>
    <div class="option-grid">
      <button class="option" id="micOpt">🎙 Microphone<br><small>${unlocked ? "Available" : "Locked"}</small></button>
      <button class="option" id="headOpt">◉ Headphones<br><small>${unlocked ? "Available" : "Locked"}</small></button>
      <button class="option" id="noiseOpt">≋ Noise suppression<br><small>Automatic</small></button>
      <button class="option" id="volOpt">♫ Call volume<br><small>100%</small></button>
    </div>
    <div class="modal-actions"><button class="secondary" id="closeMix">Close</button></div>
  `);
  $("#moreBtn").onclick = () => openModal(`
    <h2>Call options</h2><p>More controls for this room.</p>
    <div class="option-grid">
      <button class="option" id="unlockOpt">🔑 Unlock VC</button>
      <button class="option" id="musicOpt">♫ Background music</button>
      <button class="option" id="aboutOpt">ⓘ About this call</button>
      <button class="option" id="copyOpt">⌁ Copy invite link</button>
    </div>
    <div class="modal-actions"><button class="secondary" id="closeMore">Close</button></div>
  `);
  $("#infoBtn").onclick = () => openModal(`<h2>Private VC</h2><p>This room is locked behind a password. Your profile appears as a red-glowing question-mark profile until VC is unlocked.</p><div class="modal-actions"><button class="secondary" id="infoClose">Close</button></div>`);
  $("#soundBtn").onclick = () => {
    musicOn = !musicOn;
    if (musicOn) music.play().catch(()=>{}); else music.pause();
    $("#soundBtn").textContent = musicOn ? "♫" : "×";
  };
  $("#endBtn").onclick = () => {
    try { window.close(); } catch(e) {}
    setTimeout(() => {
      if (history.length > 1) history.back();
      else location.href = "about:blank";
    }, 80);
  };

  backdrop.addEventListener("click", e => { if(e.target === backdrop) closeModal(); });
  document.addEventListener("click", e => {
    if(e.target.id === "closeMix" || e.target.id === "closeMore" || e.target.id === "infoClose") closeModal();
    if(e.target.id === "unlockOpt") passwordModal();
    if(e.target.id === "musicOpt") { musicOn=!musicOn; musicOn?music.play().catch(()=>{}):music.pause(); }
    if(e.target.id === "copyOpt") navigator.clipboard?.writeText(location.href).then(()=>{ e.target.innerHTML="✓ Invite copied"; }).catch(()=>{});
    if(e.target.id === "aboutOpt") openModal(`<h2>Private VC</h2><p>Share this page's invite link to let another person enter the room.</p><div class="modal-actions"><button class="secondary" id="aboutBack">Close</button></div>`);
    if(e.target.id === "aboutBack") closeModal();
    if(e.target.id === "micOpt" || e.target.id === "headOpt") { if(!unlocked) showNoPasswordNotice(); }
  });

  // Start as soon as the page opens: the 2-second lock sequence happens after joining.
  render();
  music.volume = 0.28;
  music.play().catch(() => {});
  window.addEventListener("pointerdown", () => {
    if(musicOn) music.play().catch(()=>{});
  }, {once:true});
  join();
})();
