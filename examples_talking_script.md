---
title: SQL Live-Coding Script — 2.5 hour workshop
description: Talking script with explicit timing for a 2.5-hour live SQL session, broken by 10-minute pauses at the top of each hour.
---

## Session at a glance

| Wall clock | Segment | Length |
|---|---|---|
| **0:00 – 1:00** | **Block 1** — Welcome, Selection, Filtering | 60 min |
| 1:00 – 1:10 | ☕ Break | 10 min |
| **1:10 – 2:00** | **Block 2** — Aggregating, Sorting & Grouping, Transforming, JOIN setup | 50 min |
| 2:00 – 2:10 | ☕ Break | 10 min |
| **2:10 – 2:30** | **Block 3** — INNER / LEFT / Anti-JOIN, Wrap-up | 20 min |

The first column assumes a 0:00 start. If the class is scheduled (e.g.) 9:00–11:30 the breaks fall at 10:00 and 11:00.

### Teaching philosophy
- **Go slow** — SQL syntax is new to everyone.
- **Explain WHY before HOW** — context first, syntax second.
- **Make mistakes on purpose** — debugging is the lesson.
- **Frame each example with a scenario** — every example in `examples.Rmd` opens with one (e.g., "You need a list for a mail merge…"). Read the scenario aloud, then write the SQL.

### Material to have open
- The static tutorial at `https://ismayc.github.io/sql-tutorial/` (Examples + Scratchpad open in two browser tabs).
- The ER diagram for towns & counties (the **Examples** index page has it expandable; the **Scratchpad** has the same diagram so you can keep ONE tab open across the whole session).
- A pre-loaded scratchpad URL for live coding so the editor is hot.

### Compression cheatsheet — if you fall behind
If you're more than 5 minutes behind by the end of any segment, drop these in this order:
1. **Aliasing 2** (table aliases) — you'll redo it in JOINs anyway.
2. **One of the LIKE examples** (keep just `LIKE 'K%'` and one wildcard variant).
3. **MIN/MAX on text** (Categorical Summaries) — say it works on strings and move on.
4. **Population Density** in Transforming — pick *either* density *or* percentage change, not both.
5. **JOIN troubleshooting guide** — refer students to the script handout instead.
6. **Mental Exercise** at the end of JOINs — skip.

### Material the script doesn't cover live
The improved `examples.Rmd` has additions students can explore independently after class:
- **Selection — Unique 2**: counties with multi-county towns.
- **Sorting & Grouping** additions on multi-column sort and `HAVING` with `AVG`.
- **Transforming** additions on `CASE WHEN` with text + percentage formatting.
- **Joining** has 7 more examples (multiple-match LEFT JOINs, self-joins, more anti-join patterns). Point students to the **Joining Techniques** page on the static site and tell them to start with the scenario boxes.

---

# BLOCK 1 — Foundations (60 min) · 0:00 → 1:00

## 0:00 — Welcome & orientation (5 min)

> "Welcome everyone! Today we're going to learn SQL — Structured Query Language. SQL is pronounced either 'S-Q-L' or 'sequel' — both are correct, and you'll hear both in industry.

> SQL is the universal language for talking to databases. Whether you end up working with Postgres, MySQL, BigQuery, or SQLite like we are today — the core SQL you learn will transfer everywhere."

### Show the static site

> "Everything we'll write today, you can practice on `ismayc.github.io/sql-tutorial`. The site runs entirely in your browser — there's nothing to install, no account to make, and your work is saved locally as you go. We'll be live-coding on the **Examples** pages; the **Exercises** pages are for you afterward."

### Introduce the data

Open the **Examples → Selection Techniques** page; expand the ER diagram + text description.

> "Two tables for the live coding today:
> - `pnw_counties` — 75 rows, one per county in Oregon and Washington. Columns include the name, the county seat, when it was established, etymology, 2022 population, and land area.
> - `pnw_towns` — 453 rows, one per town. Each town points back to its primary county; some towns straddle multiple counties so we also have secondary and tertiary county columns. Population is recorded for both the 2010 and 2020 censuses.

> Notice the relationship: a town's `primary_county` matches the `county` in `pnw_counties`. That shared value is what JOINs use later."

### Three style tips before we type

> "**Keywords are not case-sensitive**, but the convention is all-caps for SQL keywords (`SELECT`, `FROM`, …). That makes commands visually distinct from data.
>
> **Indentation is for humans**, not for SQLite. I'm going to indent so `SELECT` and `FROM` line up — it makes long queries easier to scan.
>
> **Every statement ends with a semicolon.** Think of it as a period."

> "**Cmd/Ctrl + Enter** runs the query in the editor. We'll do that constantly."

---

## 0:05 — Selection Techniques (25 min)

### Selecting columns

#### Example 1 — Quick reference list of all town names

> "**Scenario:** you need a list of town names for a mail merge or a dropdown menu.

> This is the simplest SQL you can write: tell the database WHAT you want, and WHERE to find it."

```sql
SELECT town
  FROM pnw_towns;
```

Type it slowly. Walk through each token:

> "`SELECT` is the verb — we're picking. `town` is the column. `FROM pnw_towns` is the source. Semicolon ends the thought.
> 453 rows back — every town in our dataset."

#### Example 2 — List all counties in the Pacific Northwest

> "Same pattern, different table. *Scenario: a report header that needs to enumerate every county in the region.*"

```sql
SELECT county
  FROM pnw_counties;
```

> "75 rows. Notice the result table appears below the editor — for small results like this it's just plain HTML; for larger results you'll see a search box and pagination."

#### Example 3 — Export all town data for an audit

> "*Scenario: an auditor needs the complete towns dataset.* The shortcut for 'every column' is `*`."

```sql
SELECT *
  FROM pnw_towns;
```

> "`*` is great for exploration, but in production code be explicit — tables change over time and `*` makes your queries fragile."

#### Example 4 — County names and populations for a funding report

> "*Scenario: federal funding is allocated by population.* You want county name paired with its 2022 population."

```sql
SELECT county, population_2022
  FROM pnw_counties;
```

> "Multiple columns are comma-separated. The output order matches the SELECT order."

### Aliasing — clean column headers

#### Example 5 — Friendly headers for non-technical stakeholders

> "*Scenario: you're emailing a CSV to people who won't understand* `land_area_sq_mi`. The `AS` keyword renames columns in the output."

```sql
SELECT county AS county_name,
       population_2022 AS population,
       land_area_sq_mi AS area_square_miles
  FROM pnw_counties;
```

> "The data is identical to the unaliased query — only the column headers change. Each column on its own line is a readability choice; SQL doesn't care."

#### Example 6 — Table aliases (90 seconds, skip if behind)

```sql
SELECT c.county,
       c.county_seat,
       c.year_established
  FROM pnw_counties AS c;
```

> "We can alias the *table* too. Right now this looks like extra typing — `c.county` instead of just `county`. The payoff comes in JOINs when two tables both have a column called `name` or `id`. Park this idea, we'll revisit it."

### DISTINCT

#### Example 7 — What states are represented?

> "*Scenario: before running state-specific analyses, you need to know which states exist in the data.*"

```sql
SELECT DISTINCT state
  FROM pnw_towns;
```

> "453 rows in the table, 2 unique states — Oregon and Washington. `DISTINCT` is a one-keyword data audit."

### COUNT

#### Example 10 — How many towns are in the dataset?

```sql
SELECT COUNT(*) AS num_towns
  FROM pnw_towns;
```

> "`COUNT(*)` counts every row. The alias is purely cosmetic — without it the column header would say `COUNT(*)` which isn't a great variable name. Result: 453."

#### Example 11 — How many distinct states are in `pnw_counties`?

```sql
SELECT COUNT(DISTINCT state) AS num_unique_states
  FROM pnw_counties;
```

> "Combine `COUNT` with `DISTINCT` to get the number of unique categories. Two states. This pattern is gold for data quality — 'how many distinct customers? products? departments?'"

**[Pause point — invite questions]**

> "That's the building-block half of `SELECT`. Any questions before we narrow results down with `WHERE`?"

⏱ **Checkpoint: you should be at ~0:30.**

---

## 0:30 — Filtering Techniques (30 min)

> "So far we've returned every row. Most real work asks 'just the rows that meet *these* conditions.' That's `WHERE`."

### Filtering rows

#### Example 12 — Cities with more than 150,000 people

```sql
SELECT town, state, population_2020_census
  FROM pnw_towns
 WHERE population_2020_census > 150000;
```

> "`WHERE` comes after `FROM`. Reads almost like English: '*Select* town, state, population *from* the towns table *where* the population is greater than 150,000.'
> Five rows back: Portland, Seattle, Eugene, Salem, Vancouver — the major metros."

#### Example 13 — Large Oregon cities only

```sql
SELECT town, state, population_2020_census
  FROM pnw_towns
 WHERE population_2020_census > 150000
   AND state = 'Oregon';
```

> "`AND` requires both conditions. `'Oregon'` is in single quotes because it's text. **Text comparisons are case-sensitive in SQLite by default** — `'Oregon'` ≠ `'oregon'`.
> Down to 2 rows: Portland and Eugene."

#### Example 14 — Big cities OR any Oregon city

```sql
SELECT town, state, population_2020_census
  FROM pnw_towns
 WHERE population_2020_census > 150000
    OR state = 'Oregon';
```

> "`OR` keeps a row if EITHER condition is true. Much wider result set — every Oregon town, plus the big Washington ones."

#### Example 17 — BETWEEN for ranges (optional — skip if behind)

> "You could write a range as two conditions:"

```sql
WHERE land_area_sq_mi >= 12
  AND land_area_sq_mi <= 15
```

> "But `BETWEEN` reads cleaner and includes both endpoints:"

```sql
SELECT town, state, land_area_sq_mi
  FROM pnw_towns
 WHERE land_area_sq_mi BETWEEN 12 AND 15;
```

#### Example 19 — Complex logic with parentheses

```sql
SELECT county, state, year_established, population_2022
  FROM pnw_counties
 WHERE (state = 'Washington' AND year_established BETWEEN 1890 AND 1900)
    OR (state = 'Oregon' AND population_2022 > 300000);
```

> "'Washington counties established in the 1890s, OR Oregon counties bigger than 300k.' Parentheses make intent unambiguous. Without them SQLite would still evaluate left-to-right with precedence, but you don't want to gamble on that — make grouping explicit."

### Pattern matching on text

#### Example 20 — Counties starting with K

```sql
SELECT county, state
  FROM pnw_counties
 WHERE county LIKE 'K%';
```

> "`LIKE` is pattern matching. `%` means 'any characters.' `'K%'` is 'starts with K, then anything.' Klamath, King, Kitsap, Kittitas, Klickitat."

#### Example 21 — Towns ending in 'ia'

```sql
SELECT town, state
  FROM pnw_towns
 WHERE town LIKE '%ia';
```

> "Wildcard on the left. Olympia, Astoria, Columbia City, …"

#### Example 22 — Towns containing 'mount' (combine if behind)

```sql
SELECT town, state
  FROM pnw_towns
 WHERE town LIKE '%mount%';
```

> "Wildcards on both sides — substring search. Mount Vernon, Mountlake Terrace, …"

#### Example 23 — Single-character wildcard

```sql
SELECT county
  FROM pnw_counties
 WHERE county LIKE '__ar%';
```

> "`_` (underscore) means exactly one character. Two chars, then `ar`, then anything. Finds `Clark` — `Cl` + `ar` + `k`."

### IN and NULL

#### Example 24 — `IN` instead of multiple ORs

```sql
SELECT *
  FROM pnw_towns
 WHERE primary_county IN ('Multnomah', 'Spokane');
```

> "Cleaner than `primary_county = 'Multnomah' OR primary_county = 'Spokane'`. As the list grows, `IN` wins easily."

#### Example 25 — `IS NULL`, not `= NULL`

> "Real data has missing values. SQL represents them as `NULL` — not zero, not empty string, but a separate 'unknown' state."

```sql
SELECT *
 FROM pnw_towns
WHERE secondary_county IS NULL;
```

> "Use `IS NULL`, not `= NULL`. This trips up everyone the first time. `NULL` isn't equal to anything — not even itself — so equality comparisons don't work."

#### Example 26 — `IS NOT NULL`

```sql
SELECT *
 FROM pnw_towns
WHERE secondary_county IS NOT NULL;
```

> "Towns that DO have a secondary county. These are towns that straddle multiple counties — useful, e.g., for tax-jurisdiction reporting."

**[Pause point — invite questions]**

> "`WHERE` is the workhorse — you'll use it on most queries. Final questions before we take a break?"

⏱ **Checkpoint: you should be at ~1:00.**

---

# ☕ BREAK 1 (10 min) · 1:00 → 1:10

> "We'll take ten minutes. When we come back, we'll do calculations across many rows — counting, averaging, grouping. Stretch your legs!"

While students are away:
- Make sure the **Aggregating Techniques** Examples page is open.
- Set the theme toggle to whichever theme looks best on the projector — if dark vs light contrast looked rough in Block 1, switch now.
- Pre-paste the GROUP BY example into the editor so the first demo is fast.

---

# BLOCK 2 — Computation, grouping, transforming, JOIN setup (50 min) · 1:10 → 2:00

## 1:10 — Aggregating Techniques (15 min)

> "Now we'll do arithmetic across many rows. Aggregate functions collapse rows down into a single summary number."

### Numerical summaries

#### Example 27 — AVG of populations

```sql
SELECT AVG(population_2020_census) AS avg_population
  FROM pnw_towns
 WHERE state = 'Washington';
```

> "`AVG` = arithmetic mean. Filter + aggregate combine naturally — only Washington towns get averaged."

#### Example 28 — SUM

```sql
SELECT SUM(population_2020_census) AS total_population
  FROM pnw_towns
 WHERE state = 'Oregon';
```

> "Total population across all Oregon towns in our dataset."

#### Examples 29 & 30 — MIN, MAX

```sql
SELECT MIN(population_2020_census) AS min_population,
       MAX(population_2020_census) AS max_population
  FROM pnw_towns;
```

> "Combined into one query — you can compute multiple aggregates in a single `SELECT`."

### Categorical summaries (skip if behind)

> "`MIN` and `MAX` also work on text — first/last alphabetically."

```sql
SELECT MIN(town) AS first_town,
       MAX(county) AS last_county
  FROM pnw_towns, pnw_counties;
```

> "Useful for sanity-checking the alphabet range of a column."

### Rounding

#### Examples 34a / 34b — ROUND

```sql
SELECT town, ROUND(land_area_sq_mi, 2) AS rounded_area
  FROM pnw_towns;
```

> "`ROUND(value, n)` — `n` is decimal places. With `0` you get whole numbers."

```sql
SELECT town, ROUND(land_area_sq_mi, 0) AS rounded_area
  FROM pnw_towns;
```

⏱ **Checkpoint: you should be at ~1:25.**

---

## 1:25 — Sorting and Grouping (20 min)

### Sorting

#### Example 35 — Default ascending sort

```sql
SELECT town, population_2020_census
  FROM pnw_towns
 ORDER BY population_2020_census;
```

> "Without `ORDER BY` the row order is whatever SQLite feels like — usually insertion order, but you cannot rely on it. With `ORDER BY` you make the order explicit."

#### Examples 36a / 36b — ASC, DESC

```sql
SELECT town, population_2020_census
  FROM pnw_towns
 ORDER BY population_2020_census DESC;
```

> "`DESC` for largest-first. Seattle is on top with 737,015. `ASC` is the default — write it for readability anyway."

#### Example 37 — Multi-column sort

```sql
SELECT county, state, population_2022
  FROM pnw_counties
 ORDER BY state, population_2022 DESC;
```

> "Primary sort by state (alphabetical Oregon → Washington), within each state by population descending. Mix of orderings is fine."

### Grouping

> "This is where SQL becomes magic. `GROUP BY` lets you compute aggregates *per category*."

#### Example 38 — Count per state

```sql
SELECT state, COUNT(*) AS total_towns
  FROM pnw_towns
 GROUP BY state;
```

> "Instead of one count over the whole table, we get one count *per state*. The grouping key shows up in the result."

#### Example 39 — Combine GROUP BY with ORDER BY

```sql
SELECT state, AVG(population_2022) AS avg_population
  FROM pnw_counties
 GROUP BY state
 ORDER BY avg_population DESC;
```

> "Compute the average county population by state, then sort the resulting two rows by that average. The state with the larger counties on average bubbles to the top."

#### Examples 40a / 40b — WHERE vs HAVING

> "Here is one of the most common SQL mistakes. We want counties with more than 10 towns. Try the natural-sounding query first."

```sql
SELECT primary_county, state, COUNT(*) AS total_towns
  FROM pnw_towns
 GROUP BY primary_county
 WHERE COUNT(*) > 10;
```

> "This throws an error. `WHERE` runs *before* `GROUP BY`, so the count doesn't exist yet to compare. The fix:"

```sql
SELECT primary_county, state, COUNT(*) AS total_towns
  FROM pnw_towns
 GROUP BY primary_county
HAVING COUNT(*) > 10;
```

> "`HAVING` is `WHERE` for aggregated groups. Mnemonic: **WHERE filters rows, HAVING filters groups.** They're not interchangeable."

⏱ **Checkpoint: you should be at ~1:45.**

---

## 1:45 — Transforming Techniques (10 min)

### CASE WHEN — SQL's if/then/else

#### Example 41 — Classify town by size

```sql
SELECT town,
       population_2010_census,
       CASE
         WHEN population_2010_census > 100000              THEN 'Large'
         WHEN population_2010_census BETWEEN 50000 AND 100000 THEN 'Medium'
         ELSE                                                 'Small'
       END AS town_size
  FROM pnw_towns
 ORDER BY population_2010_census DESC;
```

> "Each `WHEN` is a test. First match wins. `ELSE` catches everything else. `END` closes the `CASE`. Order matters — write more specific conditions first."

### Math in the SELECT list (pick ONE if behind)

#### Example 42 — Percentage change

```sql
SELECT town, state,
       (population_2020_census - population_2010_census) * 100.0
         / population_2010_census AS pct_change
  FROM pnw_towns
 ORDER BY pct_change DESC;
```

> "Arithmetic operators work in `SELECT`. `* 100.0` (not `* 100`) forces floating-point division — otherwise integer division gives misleading zeros for small percentages."

#### Example 43 — Population density (skip if you did 42)

```sql
SELECT town, state, population_2020_census / land_area_sq_mi AS pop_density
  FROM pnw_towns
 ORDER BY pop_density DESC;
```

> "People per square mile. Same idea — derive new values right in `SELECT`."

⏱ **Checkpoint: you should be at ~1:55.**

---

## 1:55 — Setup for JOINs (5 min)

> "Five minutes left in this block. We're going to *set up* JOINs now and *do* them after the next break. Trust me — JOINs land better when the mental model is fresh."

### Why JOINs exist

> "If we stored everything in one mega-table, a county's population would repeat in every town's row. Update the population once and you'd need to update hundreds of rows. So databases store each fact once — `pnw_counties` has the county facts, `pnw_towns` has the town facts — and use a shared column to reconnect them on demand. That reconnection is a JOIN."

### The shared column

> "Look at the data:
> - `pnw_towns.primary_county` has values like `'King'`, `'Multnomah'`, `'Lane'`.
> - `pnw_counties.county` has values like `'King'`, `'Multnomah'`, `'Lane'`.
> Same strings, in different tables. The JOIN's `ON` clause says 'match rows where these are equal.'"

### Mental model

> "Imagine two stacks of index cards — counties and towns. A JOIN is walking through one stack, finding the matching card in the other stack, and stapling them together. The `ON` clause says what 'matching' means."

> "Three JOIN flavours we'll cover after the break:
> - **INNER JOIN** — only rows that have a match on both sides.
> - **LEFT JOIN** — every row on the left, plus matching info from the right when it exists.
> - **Anti-Join** — rows on the left that have *no* match on the right (e.g., counties with no recorded towns).
> Hold those names in your head, we'll write each one shortly."

⏱ **Checkpoint: you should be at ~2:00.**

---

# ☕ BREAK 2 (10 min) · 2:00 → 2:10

> "Quick break. When we come back: ten focused minutes on JOIN syntax, then five minutes wrapping up and answering questions."

While students are away:
- Switch to the **Joining Techniques** Examples page so the JOIN diagrams are ready.
- If the room's energy is low, plan to spend more time on the INNER JOIN demo and skip the Mental Exercise.

---

# BLOCK 3 — JOINs and wrap-up (20 min) · 2:10 → 2:30

## 2:10 — INNER JOIN (5 min)

**Show the INNER JOIN visual** on screen (`Examples → Joining Techniques`, top of the page).

> "INNER JOIN is the strictest type. Only rows with matches on both sides survive. Venn diagram intersection."

#### Example 44 — County seats' populations

```sql
SELECT c.county, c.county_seat, t.population_2020_census
  FROM pnw_counties AS c
 INNER JOIN pnw_towns AS t ON c.county_seat = t.town;
```

Walk through it slowly:
> "**FROM `pnw_counties` AS c** — left table, aliased.
> **INNER JOIN `pnw_towns` AS t** — right table, aliased.
> **ON c.county_seat = t.town** — the matching rule.
> **SELECT c.county, c.county_seat, t.population_2020_census** — pick columns from BOTH sides; the alias tells SQL which table each column comes from."

> "75 counties → fewer rows back. INNER JOIN *can lose data*. If a county seat (say, a tiny town) isn't in our towns table, that whole county row disappears. Remember that — it's a common cause of 'where did my rows go?' bugs."

### One mistake to call out (30 sec)

```sql
-- DON'T DO THIS
SELECT c.county, t.town
  FROM pnw_counties AS c
 INNER JOIN pnw_towns AS t;
```

> "No `ON` clause → Cartesian product. 75 × 453 = 33,975 nonsense rows. Always specify `ON`."

---

## 2:15 — LEFT JOIN (5 min)

**Show the LEFT JOIN visual.**

> "LEFT JOIN keeps every row from the left table whether or not there's a match. Where there's no match, the right-table columns come back as `NULL`."

#### Example 45 — Same query, swap INNER for LEFT

```sql
SELECT c.county, c.county_seat, t.population_2020_census
  FROM pnw_counties AS c
  LEFT JOIN pnw_towns AS t ON c.county_seat = t.town;
```

> "All 75 counties guaranteed. Counties whose seat isn't in the towns table show `NULL` for population. Compare to the INNER JOIN row count — LEFT will have more (or equal, never fewer)."

### When to pick which

> "**INNER** when missing data on either side should drop the row.
> **LEFT** when the left table is your 'main' data and you want the right table to *enhance* it where possible.
> Reporting tip: LEFT is safer for audit-style reports because rows can't vanish silently."

---

## 2:20 — Anti-Join: 'what's missing?' (5 min)

**Show the anti-join visual.**

> "The most pedagogically interesting JOIN is the one that finds rows *without* matches."

#### Example 47 — Counties with no recorded towns

```sql
SELECT c.county
  FROM pnw_counties AS c
  LEFT JOIN pnw_towns AS t ON c.county = t.primary_county
 WHERE t.town IS NULL;
```

Three-step explanation:
> "1. LEFT JOIN ensures every county is in the result, even those with no matching town.
> 2. Counties with no matching town have `NULL` in every `t.*` column.
> 3. `WHERE t.town IS NULL` keeps only the orphans."

> "Real-world translations:
> - Customers who've never placed an order
> - Products never sold
> - Employees not yet assigned to a project
> - Counties with no recorded towns (today)."

---

## 2:25 — Wrap-up and Q&A (5 min)

### What you can do now

> "After 2.5 hours, you can:
> - **SELECT** specific columns or all columns, with aliases.
> - **WHERE** to narrow results — comparisons, `AND`/`OR`, `BETWEEN`, `LIKE`, `IN`, `IS NULL`.
> - **Aggregate** with `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, plus `ROUND`.
> - **`ORDER BY`** to control sort, **`GROUP BY`** for per-category aggregates, **`HAVING`** to filter groups.
> - **`CASE WHEN`** for conditional logic and calculated columns.
> - **INNER**, **LEFT**, and **anti**-JOINs to combine tables."

### Where to go next

> "Open the **Exercises** section on the static site — 32 practice problems on the Pacific Northwest flights data. The flights tutorial uses a different dataset (airlines, airports, flights, planes, weather) so you'll exercise everything you learned today plus a few new patterns.

> Each exercise has hints if you're stuck and a 'Check answer' button that diff-compares your result against the expected output and gives you specific feedback like 'your column count is right but the names don't match — did you forget AS?' or 'too many rows — your WHERE might be too loose.'

> If you want to go deeper on JOINs there are seven more JOIN examples on the **Joining Techniques** Examples page that we didn't cover live."

### Final invitation

> "Any final questions?"

---

# Appendix A — Quick reference card

```sql
SELECT column1, column2     -- what columns to show
  FROM table_name           -- which table
 WHERE row_condition        -- filter rows (before grouping)
 GROUP BY column            -- create groups
HAVING group_condition      -- filter groups (after grouping)
 ORDER BY column DESC       -- sort the final result
 LIMIT 10;                  -- cap the rows returned

-- Wildcards inside LIKE
%   any characters          LIKE 'A%'      starts with A
_   exactly one character   LIKE '__ar%'   2 chars + 'ar' + anything

-- Aggregates
COUNT(*) SUM(col) AVG(col) MIN(col) MAX(col)

-- JOIN syntax
SELECT a.col, b.col
  FROM table_a AS a
 INNER JOIN table_b AS b ON a.key = b.key;
-- LEFT JOIN keeps every left row; right cols are NULL on no match.
-- Anti-join = LEFT JOIN + WHERE right.key IS NULL.
```

# Appendix B — Going long? Going short?

**If you're 5 min behind** at the end of any block, drop in this order:
1. Aliasing 2 (Example 6)
2. One LIKE example (collapse 21/22 into one)
3. Categorical MIN/MAX (Example 32/33)
4. Either Example 42 or Example 43, not both
5. The "common JOIN mistakes" callout in Block 3

**If you have 10 extra minutes** at the end:
1. Click into the static **Exercises** site and have students try `query1` and `query11` together.
2. Show the Scratchpad with a slightly absurd query against the 16 MB flights table (count flights per carrier), demonstrating that the database is real and queries take milliseconds even at 200k rows.
3. Open the **Joining Techniques** *Examples* page and demo one of the multi-match LEFT JOIN examples you skipped.

# Appendix C — Common student questions and quick answers

**Q: Why all-caps for keywords if it doesn't matter?**
A: Convention. Skim-readability. Senior engineers and code reviewers expect it.

**Q: Why semicolons if every editor box runs one query?**
A: Habit. The moment you write multi-statement SQL (or paste into a different tool) you'll need them.

**Q: Why does `WHERE NULL = NULL` not work?**
A: `NULL` is 'unknown.' SQL can't decide whether two unknowns are equal — so the answer is also unknown, which `WHERE` treats as false. Use `IS NULL`.

**Q: Difference between `COUNT(*)` and `COUNT(column)`?**
A: `COUNT(*)` counts rows. `COUNT(column)` counts rows where that column is NOT NULL. Sometimes that distinction matters.

**Q: Why use `LEFT JOIN` over `INNER JOIN` if I always want matches?**
A: Use `INNER`. `LEFT` is for when missing-on-the-right is meaningful information (audit/report contexts).

**Q: When do I need `GROUP BY` explicitly?**
A: Any non-aggregated column in `SELECT` must appear in `GROUP BY`. SQLite is lenient here, but Postgres/MySQL will error. Get the habit early.

**Q: What if my query is slow?**
A: A topic for a follow-up session. Short answer: read up on indexes and `EXPLAIN`.
