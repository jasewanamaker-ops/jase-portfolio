# Jase Wanamaker — Choose the Call

A static, GitHub Pages-ready portfolio. No installation or build is required.

## Preview

Unzip this package and double-click `index.html`. The opening presents racing and basketball equally, with neither selected. Choose either to reveal its scene, then use Both sports to return. Racing includes U.S. 131/Bristol venue controls. Direct links ending in ?sport=racing or ?sport=basketball open that scene immediately. About is under **Behind the mic**.

The choice screen uses abstract track and court markings; venue photographs and recording details appear only after selection. The opening is intentionally silent until your recording is added and the visitor presses play. It never claims a recording is live. No crowd audio or substitute commentary is included.

## Publish with GitHub Pages

1. Sign in to GitHub and create a new public repository, for example `jase-portfolio`.
2. Open the repository, select **Add file → Upload files** (or **uploading an existing file** for an empty repository).
3. Unzip this download. Upload the files inside it, including the complete `assets` folder. Do not upload the ZIP itself or put the files inside an extra enclosing folder. `index.html` must be at the repository root.
4. Select **Commit changes**.
5. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then branch **main** and folder **/(root)**. Save.
6. When GitHub finishes deploying, use the website address shown in Pages. If it takes a few minutes, refresh that settings page.

This package has not been published for you. GitHub menu names can change; look for the equivalent repository file-upload and Pages settings.

## Add your recording this weekend

All optional content lives in **content.js**. You can edit that file on GitHub: open it, click the pencil, edit, and commit. You do not need to change the layout.

For each sport:

- `title`: your chosen clip title.
- `event`, `date`, `role`: accurate details for that recording. Basketball analyst experience is described in your introduction; label each future recording with its actual role.
- `mediaType`: use `"audio"`, `"video"`, or `"link"`.
- `mediaUrl`: put the recording path or hosted page URL here. An empty value keeps the honest “coming soon” state.
- `description`, `purpose`, `decisions`, `reflection`: add your own words. They appear on the listening page.
- `transcript`: your recording's spoken words, to make the work available without sound. For video, add captions to the hosted video or extend the native video element with a WebVTT track.

### Easiest: a YouTube or other hosted recording

Use `mediaType: "link"` and paste the complete URL into `mediaUrl`. The site displays **Hear the call**, opening the hosted recording in a new tab. This option does not embed the video or generate a waveform. YouTube URLs must use the link option, not the audio/video option.

### Play directly on your site

Upload `racing-call.mp3` into `assets`, then change the racing entries to:

```js
mediaType: "audio", mediaUrl: "assets/racing-call.mp3",
```

For a video file, use `mediaType: "video"` and a direct MP4 path. The optional `poster` is a still image. Use a short export that loads quickly. GitHub's web uploader accepts individual files up to 25 MiB; use hosted recordings for larger files. File names and paths are case-sensitive.

Use a 10–20 second highlight for the opening. The current version shares the same recording between its opening and listening page; if you later want a highlight plus a separate full broadcast, ask for that addition.

A same-site recording can drive a real volume-responsive visualizer. It appears only during playback and stays hidden when motion is reduced. Externally hosted audio may play without visualization because of hosting restrictions.

## Add photos

- `assets/us131.jpg`: the U.S. 131 view you supplied.
- `assets/bristol.jpg`: the Bristol starting-line view you supplied.
- Keep these file names to replace photos without changing paths. Update alt text and captions if you change the venue or subject.
- Basketball intentionally uses a court-line graphic and explicitly says its venue photo is pending. To add a photo, upload it and ask for a small HTML/CSS update, or replace the basketball environment in `styles.css` and the `.basketball-lead` block in `basketball.html`.
- A future portrait belongs on `about.html`, where your Bristol photo currently provides venue context. There is no fabricated portrait.

## Contact and professional links

In `content.js`, fill in `contact.email` and/or `contact.professionalUrl`. Only add details you want publicly visible. The email becomes a mail link. Do not put private credentials in these files.

## What still needs your content

- Selected racing and basketball recordings, event names, roles, and dates.
- Your project descriptions, purpose, creative decisions, and reflections.
- Transcripts or captions.
- Public contact information and optional professional profile.
- Optional basketball photo, portrait, résumé, and recommendations.

Your introduction, approach, and purpose are preserved exactly as you supplied them, including capitalization and punctuation. They live in `about.html`. No project achievements, scores, statistics, or outcomes have been invented.

## Sound changes later

Future crowd ambience, a separate opening highlight, or different playback controls can be added. The central media configuration and `renderMedia` function in `app.js` isolate playback from the page layout. Future ambience should have its own opt-in control and level, should pause when changing sports, and should not obscure your voice. Use sound you have permission to publish. Nothing in this version requires crowd audio.

## Files

- `index.html`: interactive scene gateway.
- `racing.html`: racing listening page and your two venue photos.
- `basketball.html`: basketball listening page.
- `about.html`: your exact introduction, approach, purpose, and contact area.
- `styles.css`: all desktop/mobile styling and motion preferences.
- `content.js`: recordings and optional project/contact text.
- `app.js`: scene selection, playback, visualization, and content rendering.
- `assets/`: your photographs and future media. Keep this folder intact.

## Accessibility and review

Includes visible keyboard focus, a skip link, native playback controls, descriptive image alternatives, text-based navigation, reduced-motion support, and readable content without audio. Essential navigation remains available without JavaScript. Mobile layout rules are included.

Code syntax, local links/assets, exact supplied copy, and ZIP root structure were checked. Automated browser rendering was unavailable in the build environment, so visually review desktop and phone layouts after opening it. Audio playback and the volume visualization need a real recording before final verification. Test the whole site after each update, including the sound-off experience.

## Course completeness

The design is built, but the portfolio's evidence is incomplete until your recordings, project reflections, and public contact details are added. Review your class rubric for any résumé or professional-link requirements. The site presents ESPN college football only as your stated career goal.
