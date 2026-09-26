# VC // Eymrola — GitHub Pages

## Upload
Put the contents of this folder into your GitHub repository and enable GitHub Pages.

The site uses the supplied:
- `Profile/profile1.gif`
- `Profile/profile2.webp`
- `Profile/profile3.webp`
- `Background.gif`
- `Background msuci.mp3`

## VC password
Open `script.js` and change:

`const VC_PASSWORD = "VC-UNLOCK";`

to your desired password.

## Invite links
You can add a room name to a link, for example:

`https://YOUR-USERNAME.github.io/YOUR-REPO/?room=night-call`

Different room names change the displayed channel name.

## Important
This build is the call-room UI/lock flow. It does not create real internet voice networking by itself. Real multi-user microphone audio requires a WebRTC signaling/backend service (or a hosted calling provider) in addition to GitHub Pages.
