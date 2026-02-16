# Doctor Talos's Traveling Show

## Project Overview
A static website themed as Doctor Talos's traveling theatrical show, inspired by Gene Wolfe's *Book of the New Sun*. Features a blog and theatrical "dying earth" aesthetics.

## Tech Stack
- Hugo static site generator
- Deployed via Cloudflare Pages at doctortalos.com
- Blog posts written in Markdown with YAML front matter

## File Structure
- `hugo.toml` — Hugo configuration
- `layouts/_default/baseof.html` — Base template (starfield, curtain, parchment shell)
- `layouts/index.html` — Landing page
- `layouts/_default/blog-index.html` — Blog index (The Dispatches)
- `layouts/posts/single.html` — Individual post template
- `layouts/_default/about.html` — About the Doctor
- `layouts/partials/` — Shared partials (starfield, curtain, nav, footer)
- `content/posts/*.md` — Blog posts (Markdown with YAML front matter)
- `content/blog/_index.md` — Blog index content file
- `content/about.md` — About page content file
- `static/css/style.css` — Core styles, layout, typography
- `static/css/animations.css` — Curtain rise, glitch effects, starfield
- `static/js/curtain.js` — Entrance animation logic
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
dateDisplay: "The 15th Day of the Month of Frost, Year of the New Sun"
draft: false
```

## URL Structure
- `/` — Landing page
- `/blog/` — Blog index
- `/posts/<slug>/` — Individual posts
- `/about/` — About the Doctor

## Conventions
- Posts use `dateDisplay` for the in-universe date shown to readers
- First paragraph of each post gets an automatic CSS drop cap
- All state persistence (visit counter) uses localStorage
- The curtain animation plays once per session (sessionStorage)

## Archived
- The CYOA adventure ("The Play of the Sun's Last Day") lives at `/home/chris/git/doctor_talos_archive/`
