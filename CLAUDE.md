# Doctor Talos — Digital Signal Archive

## Project Overview
A cyberpunk-themed blog site. Monospace typography, black/dark gray palette, neon green and magenta accents. Deployed via Cloudflare Pages at doctortalos.com.

## Tech Stack
- Hugo static site generator
- Deployed via Cloudflare Pages at doctortalos.com
- Blog posts written in Markdown with YAML front matter

## File Structure
- `hugo.toml` — Hugo configuration
- `layouts/_default/baseof.html` — Base template (boot overlay, terminal wrapper)
- `layouts/index.html` — Landing page
- `layouts/_default/blog-index.html` — Blog index (Dispatches)
- `layouts/posts/single.html` — Individual post template
- `layouts/_default/about.html` — About page
- `layouts/partials/` — Shared partials (intro, nav, footer)
- `content/posts/*.md` — Blog posts (Markdown with YAML front matter)
- `content/blog/_index.md` — Blog index content file
- `content/about.md` — About page content file
- `static/css/style.css` — Core styles, cyberpunk palette, monospace typography
- `static/css/animations.css` — Boot sequence, glitch effects, neon glow
- `static/js/intro.js` — Boot sequence animation logic
- `archetypes/posts.md` — Template for new posts

## Local Development
```bash
hugo server
```
Then open http://localhost:1313

## Publishing a New Blog Post
```bash
hugo new posts/003-my-slug.md
# Edit content/posts/003-my-slug.md — write in Markdown, set draft: false
git add content/posts/003-my-slug.md
git commit -m "Add dispatch: Your Title"
git push
# Cloudflare builds automatically
```

## Post Front Matter Format
```yaml
title: "Post Title"
subtitle: "Optional Subtitle"
slug: "003-my-slug"
date: 2026-02-15T12:00:00
dateDisplay: "2026.02.15 // 12:00 UTC"
draft: false
```

## URL Structure
- `/` — Landing page
- `/blog/` — Blog index
- `/posts/<slug>/` — Individual posts
- `/about/` — About page

## Conventions
- Posts use `dateDisplay` for the styled date shown to readers
- First paragraph of each post gets an automatic CSS drop cap
- All state persistence (visit counter) uses localStorage
- The boot sequence plays once per session (sessionStorage)

## Theme Branches
- `theme/dying-earth-playbill` — Original parchment/burgundy/gold theme

## Archived
- The CYOA adventure ("The Play of the Sun's Last Day") lives at `/home/chris/git/doctor_talos_archive/`
- Hugo version of CYOA adventure at `/home/chris/git/doctor_talos_adventure/`
