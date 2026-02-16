# Doctor Talos's Traveling Show

## Project Overview
A static website themed as Doctor Talos's traveling theatrical show, inspired by Gene Wolfe's *Book of the New Sun*. Features a blog and theatrical "dying earth" aesthetics.

## Tech Stack
- Pure HTML/CSS/JS — no frameworks, no build tools, no dependencies
- Static files, deployed via Cloudflare Pages at doctortalos.com
- Blog posts stored as JSON in `posts/`

## File Structure
- `index.html` — Landing page (the Playbill)
- `blog.html` — Blog index (The Dispatches)
- `post.html` — Individual post viewer (reads `?slug=` query param)
- `about.html` — About the Doctor
- `css/style.css` — Core styles, layout, typography
- `css/animations.css` — Curtain rise, glitch effects, starfield
- `js/curtain.js` — Entrance animation logic
- `js/blog.js` — Blog listing & post rendering
- `posts/*.json` — Blog post data
- `publish.sh` — Auto-generates posts/index.json manifest, commits, and pushes

## Local Development
```bash
python3 -m http.server -d /home/chris/git/doctor_talos
```
Then open http://localhost:8000

## Publishing a New Blog Post
1. Create a JSON file in `posts/` (see `posts/template.json`)
2. Run `./publish.sh "Add dispatch: Your Title"`

## Conventions
- Blog posts use JSON format with fields: slug, title, subtitle, date, dateDisplay, content (array of paragraphs)
- All state persistence uses localStorage
- No external dependencies — everything is self-contained

## Archived
- The CYOA adventure ("The Play of the Sun's Last Day") lives at `/home/chris/git/doctor_talos_archive/`
