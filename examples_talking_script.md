---
title: SQL Examples Talking Script
---

## Pacific Northwest Towns and Counties Data

**Author:** Prepared for Dr. Chester Ismay's SQL Tutorial  
**Purpose:** Live coding presentation guide for students with no SQL background

---

### Key Teaching Philosophy
- **Go slow** - SQL syntax is new to everyone
- **Explain WHY** before showing HOW
- **Make mistakes on purpose** - debugging is learning
- **Encourage questions** at natural break points

---

## Introduction (5-7 minutes)

### Opening

> "Welcome everyone! Today we're going to learn SQL - Structured Query Language. SQL is pronounced either 'S-Q-L' or 'sequel' - both are correct, and you'll hear both in the industry.

> SQL is the universal language for talking to databases. Whether you end up working with Oracle, PostgreSQL, MySQL, or SQLite like we are today - the core SQL you learn will transfer everywhere."

### Introduce the Data

> "We're going to learn SQL using real data about the Pacific Northwest - specifically Oregon and Washington. We have two tables:"

These tables are on Canvas and correspond to information about counties and towns in Washington and Oregon.

**Show the ER Diagram and explain:**

> "This is an Entity-Relationship diagram, or ERD. It shows us what tables we have and how they connect.

> First, let's look at `pnw_counties` - this has 75 rows representing every county in Oregon and Washington. Each county has:   
> - Its name and which state it's in   
> - A FIPS code (that's a government identification number)   
> - The county seat - that's the city where the county government is located   
> - When it was established, where it came from originally, and what the name means   
> - The 2022 population and land area   

> Our second table is `pnw_towns` with 453 towns. For each town we have:   
> - The town name and state   
> - Which county or counties it falls in - some towns span multiple counties   
> - Population from both the 2010 and 2020 census   
> - Land area in square miles   

> Notice the line connecting these tables? That shows us that towns are connected to counties. One option is to set `primary_county` in the towns table to match up with the `county` in the counties table. We'll use this relationship later when we learn about JOINs."

### SQL Learning Tips

> "Before we dive in, here are three tips that will help you become effective SQL learners:

> **First: SQL keywords are not case-sensitive**, but there's a strong convention. Most SQL developers write keywords like SELECT and FROM in all capitals. This makes the code easier to read because you can instantly see what's a SQL command versus what's data.

Many SQL users use this SQL style guide as well: https://www.sqlstyle.guide/

> **Second: Spacing and indentation matter for readability**, not for the computer. I'll show you a clean style that makes your queries easy to understand.

> **Third: Every query ends with a semicolon**. Think of it like a period at the end of a sentence - it tells the database 'I'm done with this thought.'"

---

## Selection Techniques (20-25 minutes)

### Selecting Columns/Fields

#### Example 1: Select All Town Names

> "Let's write our very first SQL query. We want to see all the town names from our towns table.

> SQL queries have a basic structure - you tell the database WHAT you want, and then WHERE to find it."

**Type slowly, explaining each part:**

```sql
SELECT town
  FROM pnw_towns;
```

> "Let me break this down:
> - `SELECT` is our command - we're selecting data   
> - `town` is the column we want to see   
> - `FROM pnw_towns` tells SQL which table to look in   
> - The semicolon says 'end of query'   

> Notice how I indented `FROM` under `SELECT`? That's a style choice that makes it easy to scan. You'll see the keyword on the left and the details on the right."

**Run the query and show results.**

> "Look at that - all 453 town names! SQL returned exactly what we asked for, nothing more, nothing less."

#### Example 2: Select All County Names

> "Now you try. How would we get all the county names from the counties table?"

**Give students a moment, then show:**

```sql
SELECT county
  FROM pnw_counties;
```

> "Same pattern - SELECT the column, FROM the table."

#### Example 3: Select All Columns

> "What if we want to see EVERYTHING in a table? We could list every column name, but there's a shortcut - the asterisk, or star character."

```sql
SELECT *
  FROM pnw_towns;
```

> "The `*` means 'all columns.' This is great for exploring data, but in production code, it's better to be explicit about which columns you need. Why? Because tables can change over time, and you want your code to be predictable."

**Run and show the wider result set.**

> "See how we now get all 8 columns? The town, state, all three county columns, both population columns, and land area."

#### Example 4: Select Multiple Specific Columns

> "Usually we want something in between - not just one column, and not all columns. Let's get county names with their 2022 population."

```sql
SELECT county, population_2022
  FROM pnw_counties;
```

> "When you want multiple columns, separate them with commas. The order you list them is the order they'll appear in your results."

### Aliasing (Column and Table Aliases)

#### Example 5: Column Aliases

> "Sometimes column names are long or unclear. We can rename them in our output using aliases.

> Look at this query - I want to see county, population, and land area, but I want shorter, cleaner names in my results:"

```sql
SELECT county AS cty, 
       population_2022 AS pop2022,
       land_area_sq_mi AS area
  FROM pnw_counties;
```

> "The keyword `AS` creates an alias. The data stays the same, but the column header changes to whatever you specify. This is purely for readability in your results - it doesn't change anything in the actual database.

> Notice I put each column on its own line? When you have multiple columns, this makes it much easier to read."

#### Example 6: Table Aliases

> "We can also give tables shorter names. This becomes essential when you're working with multiple tables."

```sql
SELECT counties.county,
       counties.origin
  FROM pnw_counties AS counties;
```

> "Here I'm saying 'call the pnw_counties table just `counties` for this query.' Then I can reference columns as `counties.county` and `counties.origin`.

> This might seem like extra typing now, but when you have two tables that both have a column called 'name' or 'id', the table alias tells SQL exactly which one you mean."

### Unique Entries

#### Example 7: DISTINCT Values

> "What if I want to know which states are in our data, without seeing duplicates? Enter DISTINCT."

```sql
SELECT DISTINCT state
  FROM pnw_towns;
```

> "DISTINCT removes duplicate values from your results. We have 453 towns, but only 2 unique states - Oregon and Washington.

> This is incredibly useful for exploring data - you can quickly see what values exist in a column."

### Counting

#### Example 10: COUNT All Records

> "Often we don't need to see all the data - we just need to know how much there is. That's where COUNT comes in."

```sql
SELECT COUNT(*) AS num_towns
  FROM pnw_towns;
```

> "COUNT(*) counts every row in the table. The result? 453 towns.

> I added an alias `num_towns` because without it, the column header would just say `COUNT(*)` which isn't very descriptive."

#### Example 11: COUNT DISTINCT

> "We can combine COUNT with DISTINCT to count unique values:"

```sql
SELECT COUNT(DISTINCT state) AS num_unique_states
  FROM pnw_counties;
```

> "This tells us we have 2 unique states in our counties table. COUNT DISTINCT is fantastic for data quality checks - like seeing how many different categories exist in a column."

---

**[PAUSE POINT - Ask for Questions]**

> "That covers the basics of selecting data. Any questions before we move on to filtering? ... Great, let's learn how to narrow down our results."

---

## Filtering Techniques (25-30 minutes)

### Filtering Rows/Records

> "So far, we've been getting ALL rows from our tables. But usually we only want rows that meet certain conditions. That's filtering, and we use the WHERE clause."

#### Example 12: Basic Filtering with Greater Than

> "Let's find all towns with more than 150,000 people."

```sql
SELECT town, state, population_2020_census 
  FROM pnw_towns 
 WHERE population_2020_census > 150000;
```

> "The WHERE clause comes after FROM and specifies our condition. Here we're saying: only give me rows where the population column is greater than 150,000.

> Notice the structure - it reads almost like English: 'Select town, state, and population FROM the towns table WHERE the population is greater than 150,000.'"

**Run and show results.**

> "We get just 5 towns - these are the major cities. Portland, Seattle, Eugene, Salem, and Vancouver."

#### Example 13: Multiple Conditions with AND

> "What if we want large Oregon towns specifically? We add another condition with AND."

```sql
SELECT town, state, population_2020_census 
  FROM pnw_towns 
 WHERE population_2020_census > 150000
   AND state = 'Oregon';
```

> "When using AND, both conditions must be true for a row to be included. Notice that 'Oregon' is in single quotes - that's because it's text data, not a number. SQL needs those quotes to know it's a string.

> Also notice - text comparisons are case-sensitive in most databases. 'Oregon' is not the same as 'oregon' or 'OREGON'."

**Run and show the filtered results.**

> "Now we're down to just 4 rows - the large Oregon towns."

#### Example 14: Expanding Results with OR

> "OR works differently - it includes a row if EITHER condition is true."

```sql
SELECT town, state, population_2020_census 
  FROM pnw_towns 
 WHERE population_2020_census > 150000
    OR state = 'Oregon';
```

> "This gives us all towns with more than 150,000 people, PLUS all Oregon towns regardless of population. The result set is much larger."

**Run and discuss the difference from AND.**

> "See how many more rows we get? Every Oregon town is included, plus the big Washington cities."

#### Example 17: BETWEEN for Ranges

> "When filtering on a range of values, you could write two conditions with AND:"

```sql
SELECT town, state, land_area_sq_mi
  FROM pnw_towns
 WHERE land_area_sq_mi >= 12
   AND land_area_sq_mi <= 15;
```

> "But SQL has a cleaner way - the BETWEEN operator:"

```sql
SELECT town, state, land_area_sq_mi
  FROM pnw_towns
 WHERE land_area_sq_mi BETWEEN 12 AND 15;
```

> "BETWEEN is inclusive on both ends - it includes 12 and 15. It's cleaner to read and less prone to typos."

#### Example 19: Complex Conditions with Parentheses

> "Sometimes we need complex logic. Parentheses group conditions together, just like in math."

```sql
SELECT county, state, year_established, population_2022
  FROM pnw_counties
 WHERE (state = 'Washington' AND year_established BETWEEN 1890 AND 1900)
    OR (state = 'Oregon' AND population_2022 > 300000);
```

> "Read this as: 'Give me Washington counties established in the 1890s, OR Oregon counties with more than 300,000 people.'

> Without the parentheses, SQL might interpret this differently. When your logic gets complex, parentheses make your intent clear."

### Filtering Text

#### Example 20: LIKE with Wildcards - Starting Characters

> "For text matching, SQL gives us the LIKE operator with wildcards. The percent sign `%` means 'any characters.'"

```sql
SELECT county, state
  FROM pnw_counties
 WHERE county LIKE 'K%';
```

> "'K%' means 'starts with K, followed by anything.' This finds Klamath, King, Kitsap, Kittitas, and Klickitat.

> This is called pattern matching, and it's incredibly powerful for text data."

#### Example 21: LIKE - Ending Characters

```sql
SELECT town, state
  FROM pnw_towns
 WHERE town LIKE '%ia';
```

> "'%ia' means 'ends with ia.' This catches Olympia, Columbia City, Astoria, and many others."

#### Example 22: LIKE - Contains Pattern

```sql
SELECT town, state
  FROM pnw_towns
 WHERE town LIKE '%mount%';
```

> "'%mount%' means 'contains mount anywhere.' This finds Mount Vernon, Mountlake Terrace, and any other town with 'mount' in the name."

#### Example 23: Underscore for Single Character

```sql
SELECT county
  FROM pnw_counties
 WHERE county LIKE '__ar%';
```

> "The underscore `_` matches exactly one character. So '__ar%' means: two characters, then 'ar', then anything. This finds 'Clark' - 'Cl' are the two characters, then 'ar', then 'k'."

#### Example 24: IN for Multiple Values

> "When checking against a list of values, use IN instead of multiple ORs."

```sql
SELECT * 
  FROM pnw_towns 
 WHERE primary_county IN ('Multnomah', 'Spokane');
```

> "This is cleaner than writing `primary_county = 'Multnomah' OR primary_county = 'Spokane'`. As your list grows, IN becomes much more readable."

#### Example 25: IS NULL - Finding Missing Data

> "Real data often has missing values. In SQL, missing data is represented as NULL - not zero, not empty string, but NULL meaning 'unknown' or 'not applicable.'"

```sql
SELECT * 
 FROM pnw_towns 
WHERE secondary_county IS NULL;
```

> "We use `IS NULL` - not `= NULL`. This is a common mistake! NULL is special - it's not equal to anything, not even itself. So we have to use `IS NULL` to check for it."

#### Example 26: IS NOT NULL

```sql
SELECT * 
 FROM pnw_towns 
WHERE secondary_county IS NOT NULL;
```

> "And `IS NOT NULL` finds rows that DO have a value. These are towns that span multiple counties."

---

**[PAUSE POINT - Ask for Questions]**

> "Filtering is fundamental - you'll use WHERE clauses constantly. Any questions? ... Alright, let's move on to calculations and aggregations."

---

## Aggregating Techniques (15-20 minutes)

### Numerical Summaries

> "SQL can do calculations across many rows, collapsing them into summary statistics. These are called aggregate functions."

#### Example 27: AVG - Average

```sql
SELECT AVG(population_2020_census) AS avg_population
  FROM pnw_towns
 WHERE state = 'Washington';
```

> "AVG calculates the arithmetic mean. This tells us the average population of Washington towns.

> Notice we can combine aggregation with filtering - we're only averaging Washington towns, not all towns."

#### Example 28: SUM - Total

```sql
SELECT SUM(population_2020_census) AS total_population
  FROM pnw_towns
 WHERE state = 'Oregon';
```

> "SUM adds up all the values. This gives us the total population of all Oregon towns in our dataset."

#### Example 29 & 30: MIN and MAX

```sql
SELECT MIN(population_2020_census) AS min_population
  FROM pnw_towns;
```

```sql
SELECT MAX(population_2020_census) AS max_population
  FROM pnw_towns;
```

> "MIN and MAX find the smallest and largest values. Pretty straightforward!"

### Categorical Summaries

> "MIN and MAX also work on text - they give you the first and last alphabetically."

#### Example 32: First Alphabetically

```sql
SELECT MIN(town) AS first_town
  FROM pnw_towns;
```

> "This returns 'Aberdeen' - the first town alphabetically."

#### Example 33: Last Alphabetically

```sql
SELECT MAX(county) AS last_county
  FROM pnw_counties;
```

> "This returns 'Yamhill' or 'Yakima' depending on the state - whichever comes last in alphabetical order."

### Rounding

#### Example 34a & 34b: ROUND Function

```sql
SELECT town, ROUND(land_area_sq_mi, 2) AS rounded_area
  FROM pnw_towns;
```

> "ROUND takes two arguments: the number to round, and how many decimal places. So ROUND(land_area_sq_mi, 2) gives us two decimal places."

```sql
SELECT town, ROUND(land_area_sq_mi, 0) AS rounded_area
  FROM pnw_towns;
```

> "With 0 decimal places, we get whole numbers."

---

## Sorting and Grouping Techniques (20-25 minutes)

### Sorting

> "Results come back in no guaranteed order unless you specify one. ORDER BY lets you control the sort."

#### Example 35: Basic Sorting

```sql
SELECT town, population_2020_census
  FROM pnw_towns
 ORDER BY population_2020_census;
```

> "This sorts from smallest to largest population - ascending order, which is the default."

#### Example 36a & 36b: ASC and DESC

```sql
SELECT town, population_2020_census
  FROM pnw_towns
ORDER BY population_2020_census ASC;
```

> "ASC means ascending - smallest to largest. It's the default, so you don't have to write it, but it makes your intent clear."

```sql
SELECT town, population_2020_census
  FROM pnw_towns
 ORDER BY population_2020_census DESC;
```

> "DESC means descending - largest to smallest. Now Seattle shows up first with 737,015 people."

#### Example 37: Multiple Sort Columns

```sql
SELECT county, state, population_2022
  FROM pnw_counties
 ORDER BY state, population_2022 DESC;
```

> "You can sort by multiple columns. This sorts first by state (alphabetically), then within each state, by population (largest first).

> So Oregon counties come first (O before W), ordered by population. Then Washington counties, also ordered by population."

### Grouping

> "This is where SQL gets really powerful. GROUP BY lets you calculate summaries for each category."

#### Example 38: Basic GROUP BY

```sql
SELECT state, COUNT(*) AS total_towns
  FROM pnw_towns
 GROUP BY state;
```

> "Instead of counting ALL towns, we count towns PER STATE. GROUP BY state creates two groups, and COUNT(*) runs separately for each group.

> Result: Oregon has some number of towns, Washington has some number of towns."

#### Example 39: GROUP BY with ORDER BY

```sql
SELECT state, AVG(population_2022) AS avg_population
  FROM pnw_counties
 GROUP BY state
 ORDER BY avg_population DESC;
```

> "We can calculate average county population by state, then sort to see which state has larger counties on average."

#### Example 40a & 40b: HAVING vs WHERE

> "Here's a common mistake. What if we want to see only counties that have more than 10 towns?"

**First, show the error:**

```sql
SELECT primary_county, state, COUNT(*) AS total_towns
  FROM pnw_towns
 GROUP BY primary_county
 WHERE COUNT(*) > 10;
```

> "This gives an error! Why? Because WHERE filters individual rows BEFORE grouping happens. We can't use COUNT(*) in WHERE because the counting hasn't happened yet."

**Then show the solution:**

```sql
SELECT primary_county, state, COUNT(*) AS total_towns
  FROM pnw_towns
 GROUP BY primary_county
HAVING COUNT(*) > 10;
```

> "HAVING filters groups AFTER the grouping and counting. Think of it as WHERE for aggregated results.

> **Key rule**: WHERE filters rows before grouping, HAVING filters groups after grouping."

---

**[PAUSE POINT - Ask for Questions]**

> "GROUP BY and HAVING are often the trickiest concepts for new SQL learners. Any questions before we move on?"

---

## Transforming Techniques (10-15 minutes)

### CASE WHEN - Conditional Logic

#### Example 41: Classifying Data

> "Sometimes we want to create new categories based on values. CASE WHEN is SQL's if-then-else."

```sql
SELECT town, 
       population_2010_census,
       CASE 
           WHEN population_2010_census > 100000 THEN 'Large'
           WHEN population_2010_census BETWEEN 50000 AND 100000 THEN 'Medium'
           ELSE 'Small'
       END AS town_size
  FROM pnw_towns
  ORDER BY population_2010_census DESC;
```

> "Let me walk through this:   
> - CASE starts the conditional   
> - Each WHEN tests a condition   
> - THEN specifies what to return if that condition is true   
> - ELSE catches everything that didn't match any WHEN   
> - END closes the CASE statement   
> - AS town_size gives our new calculated column a name   

> This creates a new column that classifies each town as Large, Medium, or Small based on population."

### Calculated Columns

#### Example 42: Percentage Change

```sql
SELECT town, state, (population_2020_census - population_2010_census) / population_2010_census * 100 AS pct_change
  FROM pnw_towns
  ORDER BY pct_change DESC;
```

> "We can do math right in our SELECT! This calculates the percentage population change between 2010 and 2020.

> The formula: (new - old) / old * 100. SQL follows normal order of operations."

#### Example 43: Population Density

```sql
SELECT town, state, population_2020_census / land_area_sq_mi AS pop_density
  FROM pnw_towns
 ORDER BY pop_density DESC;
```

> "Population divided by area gives us density - people per square mile. Now we can see which towns are most crowded."

---

## Joining Techniques (35-45 minutes)

> "This is where it all comes together. Real databases have data spread across multiple tables. JOINs let us combine them. This is often the trickiest part of SQL for beginners, so we're going to take our time here."

### Why Do We Need JOINs?

> "First, let's understand WHY data is split across tables in the first place.

> Imagine if we stored everything in ONE giant table - every town would repeat the county's establishment year, etymology, population, etc. If a county's population estimate changed, we'd have to update it in hundreds of rows. That's error-prone and wasteful.

> Instead, databases use **normalization** - storing each piece of information once, in the right place. Counties in one table, towns in another. But then we need a way to connect them back together when we need combined information. That's what JOINs do."

### Setup - Understanding the Relationship

> "Look back at our ER diagram. See the line connecting the tables? That represents a relationship.

> The `primary_county` column in the towns table contains values like 'Multnomah', 'King', 'Lane'. The `county` column in the counties table ALSO contains those same values. This shared data is what lets us connect the tables.

> In database terminology:   
> - The `county` column in pnw_counties is a **primary key** - it uniquely identifies each row   
> - The `primary_county` column in pnw_towns is a **foreign key** - it references the primary key in another table   

> JOINs work by finding rows where these values match."

### The Mental Model: JOINs as Matching

> "Here's how I want you to think about JOINs:

> Imagine you have two stacks of index cards. One stack has county information, one has town information. A JOIN is like going through the town cards one by one and finding the matching county card to staple together.

> The **ON** clause tells SQL what 'matching' means - which columns to compare."

---

### INNER JOIN

**Show the visual diagrams for INNER JOIN**

> "An INNER JOIN is the most selective type of join. It only returns rows where there's a match in BOTH tables.

> Think of it like a Venn diagram - INNER JOIN gives you only the overlap, only the rows that exist in both tables based on your matching condition."

#### Example 44: Basic INNER JOIN

> "Let's say we want to see each county alongside its county seat's population. The county seat name is stored in pnw_counties, but the population is stored in pnw_towns. We need to JOIN them."

```sql
SELECT c.county, c.county_seat, t.population_2020_census
  FROM pnw_counties AS c
 INNER JOIN pnw_towns AS t ON c.county_seat = t.town;
```

> "Let me break this down piece by piece:"

**Walk through each component slowly:**

> "**FROM pnw_counties AS c** - We start with the counties table and give it the alias 'c'. This is our 'left' table.

> **INNER JOIN pnw_towns AS t** - We're joining the towns table, aliased as 't'. This is our 'right' table.

> **ON c.county_seat = t.town** - This is the matching condition. For each county, SQL looks for a town where the town name equals the county seat name.

> **SELECT c.county, c.county_seat, t.population_2020_census** - We pick columns from BOTH tables. The aliases (c. and t.) tell SQL which table each column comes from."

**Run the query and examine results.**

> "Notice what happened - we have 75 counties, but we might not get 75 rows back. Why? Because INNER JOIN only keeps matches. If a county seat (like a very small town) isn't in our towns table, that entire county row disappears from the results.

> **Key insight**: INNER JOIN can LOSE data. You only see rows that have matches on both sides."

#### Common INNER JOIN Mistakes

> "Let me show you mistakes I see students make:"

**Mistake 1: Forgetting the ON clause**

```sql
-- This is WRONG - produces a Cartesian product!
SELECT c.county, t.town
  FROM pnw_counties AS c
 INNER JOIN pnw_towns AS t;
```

> "Without ON, SQL matches every county with every town. 75 counties times 453 towns = 33,975 rows of nonsense. Always include your ON clause!"

**Mistake 2: Using the wrong columns to match**

```sql
-- This probably returns nothing useful
SELECT c.county, t.town
  FROM pnw_counties AS c
 INNER JOIN pnw_towns AS t ON c.county = t.town;
```

> "Here we're trying to match county names to town names. Those aren't the same thing! Think carefully about which columns actually contain matching data."

---

### LEFT JOIN

**Show the visual diagrams for LEFT JOIN**

> "LEFT JOIN is more forgiving than INNER JOIN. It keeps ALL rows from the left table (the first one mentioned), whether or not they have a match in the right table."

#### The Key Difference from INNER JOIN

> "With INNER JOIN, no match means the row disappears. With LEFT JOIN, no match means the row stays, but the columns from the right table show NULL.

> Think of it as: 'Give me everything from the left table, and add matching information from the right table if it exists.'"

#### Example 45: LEFT JOIN

```sql
SELECT c.county, c.county_seat, t.population_2020_census
  FROM pnw_counties AS c
  LEFT JOIN pnw_towns AS t ON c.county_seat = t.town;
```

> "Now we see ALL 75 counties, guaranteed. For counties whose county seat IS in our towns table, we see the population. For counties whose county seat ISN'T in our towns table, we see NULL for the population.

> Compare this to the INNER JOIN results - you'll likely see more rows here."

**Run both queries and compare row counts.**

> "See the difference? INNER JOIN gave us [X] rows. LEFT JOIN gives us 75 rows - every single county. The ones with NULL populations are counties whose seats weren't in our towns table."

#### When to Use LEFT JOIN vs INNER JOIN

> "Use **INNER JOIN** when you only want results that have complete information from both tables. Missing data should exclude the row.

> Use **LEFT JOIN** when the left table is your 'primary' data and you want to enhance it with optional information from the right table. Missing data is okay - you still want to see the row.

> **Real-world example**: If you're generating a report of all counties and their seats' populations, LEFT JOIN ensures every county appears even if population data is missing. INNER JOIN would silently omit counties with missing data - which might hide problems in your data."

---

### Understanding NULL in JOIN Results

> "This trips up a lot of students. When a LEFT JOIN doesn't find a match, ALL columns from the right table become NULL - not just the join column.

```sql
SELECT c.county, 
       c.county_seat, 
       t.town,           -- Will be NULL if no match
       t.state,          -- Will ALSO be NULL if no match
       t.population_2020_census  -- Will ALSO be NULL if no match
  FROM pnw_counties AS c
  LEFT JOIN pnw_towns AS t ON c.county_seat = t.town;
```

> "If a county seat doesn't match any town, ALL the 't.' columns are NULL, not just t.town. This is important when you're trying to figure out why you're seeing NULLs."

---

### Anti-Join Pattern

**Show the anti-join visual**

> "Sometimes the most interesting question is: 'What's missing?' We call this an anti-join - finding rows in one table that DON'T have matches in another."

#### Example 47: Finding Unmatched Records

> "Let's find counties that don't have ANY towns listed in our towns table. Maybe these are very rural counties, or maybe there's a data quality issue we need to investigate."

```sql
SELECT c.county
  FROM pnw_counties AS c
  LEFT JOIN pnw_towns AS t ON c.county = t.primary_county
 WHERE t.town IS NULL;
```

> "Here's the logic, step by step:

> **Step 1**: LEFT JOIN ensures all counties are included, even those with no matching towns.

> **Step 2**: For counties with no matching towns, ALL columns from t (including t.town) will be NULL.

> **Step 3**: WHERE t.town IS NULL filters to keep only those 'orphan' counties.

> The result shows counties that have zero towns in our towns table. This is incredibly useful for data quality checks!"

#### Anti-Join Use Cases

> "Anti-joins answer questions like:   
> - Which customers have never placed an order?   
> - Which products have never been sold?   
> - Which counties have no recorded towns?   
> - Which employees aren't assigned to any project?   

> Any time you need to find 'things without matches,' the anti-join pattern is your tool."

---

### JOIN Troubleshooting Guide

> "When your JOINs aren't working as expected, check these things:"

**Problem: Way too many rows (Cartesian product)**
> "You probably forgot the ON clause, or your ON condition is matching too broadly."

**Problem: Way too few rows (or zero rows)**
> "Your ON condition might be too restrictive, or the values don't actually match. Check for case sensitivity issues ('Oregon' vs 'oregon'), trailing spaces, or comparing the wrong columns."

**Problem: Unexpected NULLs everywhere**
> "You're using LEFT JOIN and many rows don't have matches. This might be correct! Or your matching condition might be wrong."

**Problem: Duplicate rows appearing**
> "One row in your left table might match MULTIPLE rows in your right table. This is called a many-to-many situation. You might need to add more conditions to ON, or use GROUP BY to consolidate."

---

### JOIN Summary Table

| JOIN Type | Keeps from Left Table | Keeps from Right Table | Use When |
|-----------|----------------------|------------------------|----------|
| INNER JOIN | Only matching rows | Only matching rows | You need complete data from both tables |
| LEFT JOIN | ALL rows | Only matching rows (NULL if no match) | Left table is primary, right is optional enhancement |
| Anti-Join (LEFT + WHERE NULL) | Only NON-matching rows | Nothing | Finding orphans or missing relationships |

---

### Practice Mental Exercise

> "Before we move on, let's do a mental exercise. Without running any code, predict:

> If we INNER JOIN pnw_counties (75 rows) with pnw_towns (453 rows) on county = primary_county, will we get:   
> A) 75 rows (one per county)   
> B) 453 rows (one per town)   
> C) Something else?   

> ... The answer is C - something else! Each county can match MULTIPLE towns. King County might match Seattle, Bellevue, Redmond, etc. So we could get up to 453 rows (if every town's county exists in our counties table), but each county appears multiple times.

> Understanding this 'row multiplication' effect is crucial for working with JOINs correctly."

---

## Wrap-Up and Key Takeaways (5 minutes)

> "Congratulations! You've just learned the fundamentals of SQL. Let me summarize what you can now do:

> **Selection**: You can pick specific columns, all columns, rename them with aliases, and find unique values with DISTINCT.

> **Filtering**: You can narrow results with WHERE, use comparison operators, combine conditions with AND/OR, match patterns with LIKE, check for NULL values, and use IN for lists.

> **Aggregation**: You can calculate COUNT, SUM, AVG, MIN, and MAX, and ROUND your results.

> **Sorting and Grouping**: You can ORDER BY to sort results, GROUP BY to calculate summaries per category, and use HAVING to filter those groups.

> **Transforming**: You can create new calculated columns and use CASE WHEN for conditional logic.

> **Joining**: You can combine data from multiple tables with INNER JOIN, LEFT JOIN, and the anti-join pattern.

> **Next steps**: Practice is everything. The exercises.Rmd file has 30 exercises using flight data - try them out! The more you write SQL, the more natural it becomes.

> Any final questions?"

---

## Quick Reference Card (For Your Notes)

```
SELECT column1, column2      -- what columns to show
  FROM table_name            -- which table
 WHERE condition             -- filter rows (before grouping)
 GROUP BY column             -- create groups for aggregation
HAVING aggregate_condition   -- filter groups (after grouping)
 ORDER BY column DESC;       -- sort results

-- Wildcards
%  = any characters (LIKE 'A%')
_  = exactly one character (LIKE '_BC')

-- Aggregates
COUNT(*), SUM(col), AVG(col), MIN(col), MAX(col)

-- Joins
INNER JOIN -- only matching rows from both tables
LEFT JOIN  -- all from left table + matching from right
```

