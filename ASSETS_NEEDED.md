# Assets needed

Everything below renders today as a designed placeholder (dark frame, gold rule,
mono caption) or a dashed `[TOKEN]`. Each one is a single-line change in
`src/content/placeholders.ts` or `src/content/copy.ts`. Photos pulled from the
live site are already in `public/images/source/`; the owner should keep rights
records for them on file.

## Photos

| slot id       | where                                     | size / aspect   | format    | should depict                                                   | status                                |
| ------------- | ----------------------------------------- | --------------- | --------- | --------------------------------------------------------------- | ------------------------------------- |
| `poster1`     | SHOT 04 / poster 1 — MOSSORÓ               | 1200×1600, 12:16 | JPG/WebP  | Claudia as a young athlete in Mossoró, or the city itself        | NEEDED                                |
| `poster2`     | SHOT 04 / poster 2 — NOVA UNIÃO            | 1200×1600, 12:16 | JPG/WebP  | Claudia in the gi with her black belt                            | filled: `claudia-bjj.jpeg` (live site) |
| `poster3`     | SHOT 04 / poster 3 — INVICTA FC            | 1200×1600, 12:16 | JPG/WebP  | Invicta FC 6 bout, 13 Jul 2013, rights cleared                   | NEEDED                                |
| `poster4`     | SHOT 04 / poster 4 — UFC                   | 1200×1600, 12:16 | JPG/WebP  | UFC walkout or bout, rights cleared                              | NEEDED                                |
| `poster5`     | SHOT 04 / poster 5 — THE TITLE FIGHT       | 1200×1600, 12:16 | JPG/WebP  | Title fight vs. Joanna Jędrzejczyk, 8 Jul 2016, rights cleared   | NEEDED                                |
| `poster6`     | SHOT 04 / poster 6 — THE NEXT CHAPTER      | 1200×1600, 12:16 | JPG/WebP  | Claudia on stage as executive and mentor                         | filled: `claudia-stage.jpeg`           |
| `wallstreet`  | SHOT 06 / The Terminal side panel          | 1092×1348       | JPG       | Claudia with the Charging Bull                                   | filled: `wallstreet.jpeg`              |
| `speakingHero`| /speaking hero                             | 1600×939        | JPG       | Claudia presenting at a podium                                   | filled: `claudia-speaking.jpeg`        |
| `speaking1-3` | /speaking gallery                          | see file        | JPG       | On stage / panel                                                 | filled: `stage01.jpeg`, `stage02.jpeg`, `claudia-stage.jpeg` |
| `ogImage`     | social share card                          | 1200×630        | PNG       | arena still with the headline                                    | generated at build (`public/og.png`); replace if desired |

Community proof images (SHOT 11): `depo2–7.jpeg` from the live site. One of them
shows a member's brokerage P&L screenshot; counsel should confirm it may stay.

## Facts and dates (`src/content/facts.ts`)

| item                                   | status                                                                                   |
| -------------------------------------- | ---------------------------------------------------------------------------------------- |
| "Jungle Fight" on the old brief        | Removed. ESPN/Sherdog list no Jungle Fight bout; poster 2 is now NOVA UNIÃO (2010 black belt). |
| 4th-degree BJJ black belt              | Owner's own claim on cgadelha.com; black belt (Nova União, 2010) is independently sourced. |
| Law graduate                           | Owner's own claim; UFC.com Q&A confirms law school attendance.                            |
| "78% of athletes broke within 2 years" | Softened to "most athletes" in copy; `BACKPACK.statNote` asks for a source before using the figure. |
| "MMC"                                  | Appears verbatim in owner copy (personas + a testimonial). Owner to confirm the acronym / expand it. |

## Tokens in copy

| token                                   | where                         | owner to supply                                   |
| --------------------------------------- | ----------------------------- | ------------------------------------------------- |
| `[DAY/TIME — OWNER TO SUPPLY]`          | SHOT 08 (live calls schedule) | weekly call day and time (and timezone)           |
| `[SAMPLE]`                              | SHOT 07 alert timestamp       | nothing — it marks the sample alert as a sample   |
| `EBOOK LINK — OWNER TO SUPPLY`          | /links                        | URL of the "Money Moves" ebook                    |
| `AIRBNB LINK — OWNER TO SUPPLY`         | /links                        | URL of the Orlando vacation home listing          |
| `CONTACT_EMAIL` (empty)                 | footer "Contact"              | a contact address (currently routes to the form)  |
| Privacy / Terms bodies `[OWNER TO SUPPLY]` | /privacy, /terms           | legal text from counsel                           |
| `VITE_FORM_ENDPOINT`                    | both forms                    | where applications and speaking inquiries go      |

## Not needed, by design

- Pricing: the live site shows none; the Apply section asks for a free call instead.
- Member count: not shown anywhere.
- Audio: none (the brief allows sound only behind an off-by-default toggle; not built).
