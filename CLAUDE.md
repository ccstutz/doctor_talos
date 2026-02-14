# Doctor Talos's Traveling Show

## Project Overview
A static website themed as Doctor Talos's traveling theatrical show, inspired by Gene Wolfe's *Book of the New Sun*. Features a blog, a choose-your-own-adventure story, and theatrical "dying earth" aesthetics.

## Tech Stack
- Pure HTML/CSS/JS — no frameworks, no build tools, no dependencies
- Static files, designed for GitHub Pages
- All CYOA logic is client-side vanilla JS
- Blog posts stored as JSON in `posts/`

## File Structure
- `index.html` — Landing page (the Playbill)
- `blog.html` — Blog index (The Dispatches)
- `post.html` — Individual post viewer (reads `?slug=` query param)
- `adventure.html` — Choose Your Own Adventure
- `about.html` — About the Doctor
- `css/style.css` — Core styles, layout, typography
- `css/animations.css` — Curtain rise, glitch effects, starfield
- `css/adventure.css` — CYOA-specific styles (gauges, effects)
- `js/curtain.js` — Entrance animation logic
- `js/blog.js` — Blog listing & post rendering
- `js/adventure.js` — CYOA engine + story data
- `posts/*.json` — Blog post data

## Local Development
```bash
python3 -m http.server -d /home/chris/git/doctor_talos
```
Then open http://localhost:8000

## Conventions
- Blog posts use JSON format with fields: slug, title, subtitle, date, dateDisplay, content (array of paragraphs)
- CYOA story nodes are defined in adventure.js as a JS object keyed by node ID
- All state persistence uses localStorage
- No external dependencies — everything is self-contained
