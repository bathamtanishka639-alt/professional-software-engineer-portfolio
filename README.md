# Tanishka Batham — Personal Portfolio

A single-page portfolio for **Tanishka Batham**, B.Tech Computer Science Engineering student
(3rd year, graduating 2028), built to be shown to recruiters for internships and placements.

> No fake content anywhere. Anything that has not been provided yet is written as an editable
> placeholder such as `[ADD COLLEGE NAME]`, `[YOUR EMAIL]`, `[PROJECT NAME]`.

---

## 1. Technologies used

| Layer      | Tech                                                    |
| ---------- | ------------------------------------------------------- |
| Markup     | HTML5 (semantic sections, ARIA labels, SEO + Open Graph) |
| Styling    | CSS3 (custom properties, grid, flexbox, `backdrop-filter`) |
| Behaviour  | Vanilla JavaScript (ES6, no libraries, no build step)    |
| Type       | Google Fonts — Fraunces, Libre Franklin, IBM Plex Mono   |

---

## 2. Features

- Sticky navigation with **active section highlighting**
- **Responsive hamburger menu** (desktop → mobile at 1120 px)
- Smooth scrolling with sticky-header offset
- **Light / dark theme** with a toggle, saved in `localStorage`
- Hero with profile-photo plate, intro, three call-to-action buttons and social links
- Skills split into **what I know** vs **currently learning**
- **Project filtering** (All / AI-Based / Web Development / Other)
- **Certificate category filtering** (10 categories) + *View All Certificates*
- Achievements, coding profiles, education timeline, resume band
- Contact form with an honest "not connected yet" state (backend instructions inside)
- Scroll-to-top button, reveal-on-scroll animations, placeholder-link toast
- Lazy-loaded images, descriptive `alt` text, SEO description, favicon, Open Graph tags
- Fully accessible: skip link, focus styles, `aria-pressed`, `aria-live`, reduced-motion support

---

## 3. Folder structure

```
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── profile.jpg
│   ├── favicon.svg
│   ├── resume/
│   │   └── Tanishka_Batham_Resume.pdf     ← add this file
│   ├── certificates/                       ← add certificate images here
│   └── projects/                           ← add project screenshots here
└── README.md
```

---

## 4. How to run locally

No build step is required. Either:

**Option A — VS Code (recommended)**
1. Install the **Live Server** extension.
2. Open `index.html` and click **Go Live**.

**Option B — Python**
```bash
python -m mhttp.server 5500     # then open http://localhost:5500
```

**Option C — Node**
```bash
npx serve .
```

> Opening `index.html` by double-clicking also works; only the Google Fonts and
> placeholder features need a server in some browsers.

---

## 5. How to replace the profile photo

1. Put your photo at `assets/profile.jpg` (JPG, roughly 480 × 600 px, under 300 KB).
2. Delete this line in `index.html` (it is only a watermark for the placeholder):
   ```html
   <span class="portrait__initials" aria-hidden="true">TB</span>
   ```
3. Update the `alt` text with your own wording if you prefer.

---

## 6. How to update personal information

Search `index.html` for `[` — every placeholder is written in square brackets.

| Placeholder | Replace with |
| --- | --- |
| `[YOUR EMAIL]` | your email address |
| `[YOUR PHONE NUMBER]` | your phone number |
| `[COLLEGE NAME]` / `[UNIVERSITY NAME]` | your college and university |
| `[SCHOOL NAME]` | your school (Class 10 and Class 12) |
| `[ADD CGPA]` / `[ADD PERCENTAGE]` | your academic numbers |
| `[LINKEDIN URL]` `[GITHUB URL]` `[LEETCODE URL]` `[CODECHEF URL]` | your profile links |
| `[ADD EXACT INTERNSHIP ROLE]` `[ADD DATES]` | your internship details |
| `[PROJECT NAME]` `[PROJECT DESCRIPTION]` `[TECHNOLOGIES]` | project details |
| `[CERTIFICATE NAME]` `[ISSUING ORGANIZATION]` `[DATE]` `[CREDENTIAL ID]` | certificate details |

To add your resume, place the file at:
`assets/resume/Tanishka_Batham_Resume.pdf`

---

## 7. How to add a certificate

1. Drop the image into `assets/certificates/`, e.g. `assets/certificates/web-development.jpg`.
2. In `index.html`, copy an entire `<article class="cert" data-category="…">…</article>` block.
3. Inside the copy, replace the placeholder SVG with:
   ```html
   <img src="assets/certificates/web-development.jpg"
        alt="Certificate name — issuing organisation"
        loading="lazy">
   ```
4. Fill in the name, organisation, date and credential ID.
5. Set `data-category` to one of:
   `programming`, `web`, `database`, `ai`, `security`, `cloud`, `dsa`, `workshop`, `other`.
6. Delete the **Verify Credential** button if that certificate has no verification URL.

Never invent a credential ID — leave the placeholder until you have the real one.

---

## 8. How to connect the contact form

The form does **not** send e-mail yet, and it says so honestly.
Open `js/script.js` → section **9. CONTACT FORM** and follow one of the three options
(Formspree, EmailJS, or your own backend). Also remove the `e.preventDefault()` line.

---

## 9. How to deploy with GitHub Pages

1. Create a repository, e.g. `tanishka-portfolio`.
2. Push the project files (the contents of this folder) to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "First portfolio commit"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/tanishka-portfolio.git
   git push -u origin main
   ```
3. Open **Settings → Pages**.
4. Under *Source*, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
5. Save. Your site appears at `https://<YOUR-USERNAME>.github.io/tanishka-portfolio/`.
6. Update the Open Graph `og:url` values in `index.html` with that URL.

---

## 10. Option B — the single-file build (paste anywhere)

Everything above is the **multi-file edition** — the one you edit day to day.

For copying into another tool (Antigravity, CodePen, a static host, an email to a
mentor), run:

```bash
npm run build
```

This produces **`dist/index.html`** — the complete site in **one self-contained file**:
all markup, all CSS, all JavaScript and the profile image are inlined. Nothing else is
needed. Paste that file anywhere and it works.

| You want to… | Use |
| --- | --- |
| Edit content, colours, add sections | `index.html`, `css/style.css`, `js/script.js` |
| Paste one file into another tool | `dist/index.html` (after `npm run build`) |

> Always edit the multi-file sources, then rebuild — never edit `dist/index.html`
> by hand, or your changes will be overwritten on the next build.

---

## 11. Licence

Free to use and edit for your own portfolio. Please do not publish placeholder data as real.
