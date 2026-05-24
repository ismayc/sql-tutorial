# Feedback regression report

Generated: 2026-05-24T21:52:40.397Z
Base URL: `http://localhost:4321/sql-tutorial`
Total cases: **405** · matching expectation: **405** (100.0%) · runtime: 51.0s

### Reading this report

Each exercise lists 2–6 variants. **Expected** is the outcome class the test author wants: `ok` (✓ pass), `fail` (any non-pass; diagnostic warning), `error` (friendly SQL error). **Actual** is what classify() saw. Rows where Expected ≠ Actual are flagged with ✗ — those are the cases worth inspecting because the student would get unexpected feedback.

## Examples

### Selection Techniques  `/examples/selection-techniques`

#### `example1` — Selection 1: Create a quick reference list of all town names

**Solution:**
```sql
SELECT town
  FROM pnw_towns;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town FROM pnw_towns;` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town FROM pnw_townsx;` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx FROM pnw_towns;` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |

#### `example2` — Selection 2: List all counties in the Pacific Northwest

**Solution:**
```sql
SELECT county
  FROM pnw_counties;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county FROM pnw_counties;` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county FROM pnw_countiesx;` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx FROM pnw_counties;` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |

#### `example3` — Selection 3: Export all town data for a comprehensive audit

**Solution:**
```sql
SELECT *
  FROM pnw_towns;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT * FROM pnw_towns;` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT * FROM pnw_townsx;` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |

#### `example4` — Selection 4: Pull county names and populations for a funding report

**Solution:**
```sql
SELECT county, population_2022
  FROM pnw_counties;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, population_2022 FROM pnw_counties;` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, population_2022 FROM pnw_countiesx;` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, population_2022 FROM pnw_counties;` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |

#### `example5` — Aliasing 1: Create a clean report with user-friendly column headers

**Solution:**
```sql
SELECT county AS county_name, 
       population_2022 AS population,
       land_area_sq_mi AS area_square_miles
  FROM pnw_counties;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county AS county_name, population_2022 AS population,` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county AS county_name, population_2022 AS population,` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx AS county_name, population_2022 AS population` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |

#### `example6` — Aliasing 2: Use table aliases to simplify longer queries

**Solution:**
```sql
SELECT c.county,
       c.county_seat,
       c.year_established
  FROM pnw_counties AS c;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT c.county, c.county_seat, c.year_established FROM pnw_` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT c.county, c.county_seat, c.year_established FROM pnw_` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT c.countyx, c.county_seat, c.year_established FROM pnw` | error | error | ✓ | There's no column named "countyx" in table `c`. Did you mean `county`? |

#### `example7` — Unique 1: What states are represented in our towns database?

**Solution:**
```sql
SELECT DISTINCT state
  FROM pnw_towns;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT DISTINCT state FROM pnw_towns;` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT DISTINCT state FROM pnw_townsx;` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT DISTINCT statex FROM pnw_towns;` | error | error | ✓ | There's no column named "statex". Did you mean `state`? |

#### `example8` — Unique 2: Which counties have towns that span multiple counties?

**Solution:**
```sql
SELECT DISTINCT secondary_county
  FROM pnw_towns
 WHERE secondary_county IS NOT NULL;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT DISTINCT secondary_county FROM pnw_towns WHERE second` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT DISTINCT secondary_county FROM pnw_townsx WHERE secon` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT DISTINCT secondary_countyx FROM pnw_towns WHERE secon` | error | error | ✓ | There's no column named "secondary_countyx". Did you mean `secondary_county`? |
| **missing-where**<br>`SELECT DISTINCT secondary_county FROM pnw_towns;` | fail | warn | ✓ | Slightly too many rows: you returned 9, expected 8. Check whether your filter excludes the boundary (e.g., `>` vs `>=`). |

#### `example10` — Counting 1: How many towns are in our database?

**Solution:**
```sql
SELECT COUNT(*) AS total_towns
  FROM pnw_towns;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT COUNT(*) AS total_towns FROM pnw_towns;` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT COUNT(*) AS total_towns FROM pnw_townsx;` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |

#### `example11` — Counting 2: How many states does our county data cover?

**Solution:**
```sql
SELECT COUNT(DISTINCT state) AS number_of_states
  FROM pnw_counties;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT COUNT(DISTINCT state) AS number_of_states FROM pnw_co` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT COUNT(DISTINCT state) AS number_of_states FROM pnw_co` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |

#### `example11b` — Counting 3: How many towns have incomplete data (missing secondary county info)?

**Solution:**
```sql
SELECT COUNT(*) AS towns_single_county
  FROM pnw_towns
 WHERE secondary_county IS NULL;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT COUNT(*) AS towns_single_county FROM pnw_towns WHERE ` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT COUNT(*) AS towns_single_county FROM pnw_townsx WHERE` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **missing-where**<br>`SELECT COUNT(*) AS towns_single_county FROM pnw_towns;` | fail | warn | ✓ | Expected a row like [439], but you have [453]. Column "towns_single_county" differs (expected 439, got 453). |

### Filtering Techniques  `/examples/filtering-techniques`

#### `example12` — Filtering 1: Which towns qualify as "cities" (population over 50,000)?

**Solution:**
```sql
SELECT town, state, population_2020_census 
  FROM pnw_towns 
 WHERE population_2020_census > 50000
 ORDER BY population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census FROM pnw_townsx W` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census FROM pnw_towns W` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2020_census FROM pnw_towns OR` | fail | warn | ✓ | Too many rows: you returned 453, expected 37. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example13` — Filtering 2: Find large Oregon cities for a state-specific grant

**Solution:**
```sql
SELECT town, population_2020_census 
  FROM pnw_towns 
 WHERE population_2020_census > 50000
   AND state = 'Oregon'
 ORDER BY population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, population_2020_census FROM pnw_towns WHERE pop` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, population_2020_census FROM pnw_townsx WHERE po` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, population_2020_census FROM pnw_towns WHERE po` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, population_2020_census FROM pnw_towns ORDER BY ` | fail | warn | ✓ | Too many rows: you returned 453, expected 12. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT town, population_2020_census FROM pnw_towns WHERE pop` | fail | ok | ✓ | ✓ Your query matches the expected result. |

#### `example14` — Filtering 3: Find either large cities OR any Oregon town

**Solution:**
```sql
SELECT town, state, population_2020_census 
  FROM pnw_towns 
 WHERE population_2020_census > 100000
    OR state = 'Oregon'
 ORDER BY state, population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census FROM pnw_townsx W` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census FROM pnw_towns W` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2020_census FROM pnw_towns OR` | fail | warn | ✓ | Too many rows: you returned 453, expected 251. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example15` — Filtering 4: Find historically significant, populous counties

**Solution:**
```sql
SELECT county, state, year_established, population_2022
  FROM pnw_counties
 WHERE year_established < 1860
   AND population_2022 > 50000
 ORDER BY year_established;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, state, year_established, population_2022 FROM` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, state, year_established, population_2022 FROM` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, state, year_established, population_2022 FRO` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-where**<br>`SELECT county, state, year_established, population_2022 FROM` | fail | warn | ✓ | Too many rows: you returned 75, expected 27. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT county, state, year_established, population_2022 FROM` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example16` — Filtering 5: Find mid-sized towns (population between 10,000 and 50,000)

**Solution:**
```sql
SELECT town, state, population_2020_census
  FROM pnw_towns
 WHERE population_2020_census BETWEEN 10000 AND 50000
 ORDER BY population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census FROM pnw_townsx W` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census FROM pnw_towns W` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2020_census FROM pnw_towns OR` | fail | warn | ✓ | Too many rows: you returned 453, expected 109. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example17` — Filtering 6: Find compact towns (small land area)

**Solution:**
```sql
SELECT town, state, land_area_sq_mi, population_2020_census
  FROM pnw_towns
 WHERE land_area_sq_mi < 2
 ORDER BY land_area_sq_mi;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, land_area_sq_mi, population_2020_census ` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, land_area_sq_mi, population_2020_census ` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, land_area_sq_mi, population_2020_census` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, land_area_sq_mi, population_2020_census ` | fail | warn | ✓ | Too many rows: you returned 453, expected 210. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT town, state, land_area_sq_mi, population_2020_census ` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example19` — Filtering 7: Complex criteria with parentheses

**Solution:**
```sql
SELECT county, state, year_established, population_2022
  FROM pnw_counties
 WHERE (state = 'Washington' AND year_established < 1860)
    OR (state = 'Oregon' AND population_2022 > 200000)
 ORDER BY state, population_2022 DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, state, year_established, population_2022 FROM` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, state, year_established, population_2022 FROM` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, state, year_established, population_2022 FRO` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-where**<br>`SELECT county, state, year_established, population_2022 FROM` | fail | warn | ✓ | Too many rows: you returned 75, expected 25. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT county, state, year_established, population_2022 FROM` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example20` — Filtering 8: Find all counties named after presidents

**Solution:**
```sql
SELECT county, state, etymology
  FROM pnw_counties
 WHERE etymology LIKE '%President%';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, state, etymology FROM pnw_counties WHERE etym` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, state, etymology FROM pnw_countiesx WHERE ety` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, state, etymology FROM pnw_counties WHERE ety` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-where**<br>`SELECT county, state, etymology FROM pnw_counties;` | fail | warn | ✓ | Too many rows: you returned 75, expected 12. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example21` — Filtering 9: Find towns ending in "ville"

**Solution:**
```sql
SELECT town, state
  FROM pnw_towns
 WHERE town LIKE '%ville';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state FROM pnw_towns WHERE town LIKE '%ville';` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state FROM pnw_townsx WHERE town LIKE '%ville';` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state FROM pnw_towns WHERE town LIKE '%ville';` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state FROM pnw_towns;` | fail | warn | ✓ | Too many rows: you returned 453, expected 17. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example22` — Filtering 10: Find towns with "Port" in their name

**Solution:**
```sql
SELECT town, state, population_2020_census
  FROM pnw_towns
 WHERE town LIKE '%Port%'
    OR town LIKE '%port%'
 ORDER BY population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census FROM pnw_townsx W` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census FROM pnw_towns W` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2020_census FROM pnw_towns OR` | fail | warn | ✓ | Too many rows: you returned 453, expected 12. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example24` — Filtering 11: Find counties with names starting with "King" or "Clark"

**Solution:**
```sql
SELECT county, state, population_2022 
  FROM pnw_counties 
 WHERE county IN ('King', 'Clark', 'Pierce', 'Multnomah')
 ORDER BY population_2022 DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, state, population_2022 FROM pnw_counties WHER` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, state, population_2022 FROM pnw_countiesx WHE` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, state, population_2022 FROM pnw_counties WHE` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-where**<br>`SELECT county, state, population_2022 FROM pnw_counties ORDE` | fail | warn | ✓ | Too many rows: you returned 75, expected 4. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT county, state, population_2022 FROM pnw_counties WHER` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example25` — Filtering 12: Find towns that span multiple counties

**Solution:**
```sql
SELECT town, state, primary_county, secondary_county, tertiary_county
  FROM pnw_towns 
 WHERE secondary_county IS NOT NULL
 ORDER BY town;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, primary_county, secondary_county, tertia` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, primary_county, secondary_county, tertia` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, primary_county, secondary_county, terti` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, primary_county, secondary_county, tertia` | fail | warn | ✓ | Too many rows: you returned 453, expected 14. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT town, state, primary_county, secondary_county, tertia` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example26` — Filtering 13: Find towns entirely within one county

**Solution:**
```sql
SELECT town, state, primary_county
  FROM pnw_towns 
 WHERE secondary_county IS NULL
 ORDER BY population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, primary_county FROM pnw_towns WHERE seco` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, primary_county FROM pnw_townsx WHERE sec` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, primary_county FROM pnw_towns WHERE sec` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, primary_county FROM pnw_towns ORDER BY p` | fail | warn | ✓ | Slightly too many rows: you returned 453, expected 439. Check whether your filter excludes the boundary (e.g., `>` vs `>=`). |
| **missing-orderby**<br>`SELECT town, state, primary_county FROM pnw_towns WHERE seco` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

### Aggregating Techniques  `/examples/aggregating-techniques`

#### `example27` — Aggregating 1: What's the average town size in each state?

**Solution:**
```sql
SELECT state,
       ROUND(AVG(population_2020_census), 0) AS avg_population
  FROM pnw_towns
 GROUP BY state;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT state, ROUND(AVG(population_2020_census), 0) AS avg_p` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT state, ROUND(AVG(population_2020_census), 0) AS avg_p` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT statex, ROUND(AVG(population_2020_census), 0) AS avg_` | error | error | ✓ | There's no column named "statex". Did you mean `state`? |

#### `example28` — Aggregating 2: What's the total urban population by state?

**Solution:**
```sql
SELECT state,
       SUM(population_2020_census) AS total_town_population
  FROM pnw_towns
 GROUP BY state;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT state, SUM(population_2020_census) AS total_town_popu` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT state, SUM(population_2020_census) AS total_town_popu` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT statex, SUM(population_2020_census) AS total_town_pop` | error | error | ✓ | There's no column named "statex". Did you mean `state`? |

#### `example29` — Aggregating 3: Find the smallest incorporated town

**Solution:**
```sql
SELECT town, state, population_2020_census
  FROM pnw_towns
 WHERE population_2020_census = (SELECT MIN(population_2020_census) FROM pnw_towns);
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census FROM pnw_townsx W` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census FROM pnw_towns W` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2020_census FROM pnw_towns;` | fail | warn | ✓ | Too many rows: you returned 453, expected 1. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example30` — Aggregating 4: Find the largest city

**Solution:**
```sql
SELECT town, state, population_2020_census
  FROM pnw_towns
 WHERE population_2020_census = (SELECT MAX(population_2020_census) FROM pnw_towns);
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census FROM pnw_townsx W` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census FROM pnw_towns W` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2020_census FROM pnw_towns;` | fail | warn | ✓ | Too many rows: you returned 453, expected 1. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example31` — Aggregating 5: Summary statistics for county land areas

**Solution:**
```sql
SELECT COUNT(*) AS num_counties,
       MIN(land_area_sq_mi) AS smallest_county,
       MAX(land_area_sq_mi) AS largest_county,
       ROUND(AVG(land_area_sq_mi), 0) AS avg_size,
       SUM(land_area_sq_mi) AS total_area
  FROM pnw_counties;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT COUNT(*) AS num_counties, MIN(land_area_sq_mi) AS sma` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT COUNT(*) AS num_counties, MIN(land_area_sq_mi) AS sma` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |

#### `example32` — Aggregating 6: Which county was established first and last?

**Solution:**
```sql
SELECT MIN(year_established) AS earliest_county,
       MAX(year_established) AS newest_county
  FROM pnw_counties;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT MIN(year_established) AS earliest_county, MAX(year_es` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT MIN(year_established) AS earliest_county, MAX(year_es` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |

#### `example33` — Aggregating 7: Find the actual earliest and newest counties

**Solution:**
```sql
SELECT county, state, year_established
  FROM pnw_counties
 WHERE year_established = (SELECT MIN(year_established) FROM pnw_counties)
    OR year_established = (SELECT MAX(year_established) FROM pnw_counties)
 ORDER BY year_established;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, state, year_established FROM pnw_counties WHE` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, state, year_established FROM pnw_countiesx WH` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, state, year_established FROM pnw_counties WH` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-where**<br>`SELECT county, state, year_established FROM pnw_counties ORD` | fail | warn | ✓ | Too many rows: you returned 75, expected 5. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT county, state, year_established FROM pnw_counties WHE` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example34a` — Aggregating 8: Calculate and round population density

**Solution:**
```sql
SELECT town, 
       state,
       population_2020_census,
       land_area_sq_mi,
       ROUND(population_2020_census / land_area_sq_mi, 1) AS people_per_sq_mile
  FROM pnw_towns
 WHERE land_area_sq_mi > 0
 ORDER BY people_per_sq_mile DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census, land_area_sq_mi,` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census, land_area_sq_mi,` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census, land_area_sq_mi` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2020_census, land_area_sq_mi,` | fail | ok | ✓ | ✓ Your query matches the expected result. |
| **missing-orderby**<br>`SELECT town, state, population_2020_census, land_area_sq_mi,` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example34b` — Aggregating 9: Round to whole numbers for simpler reporting

**Solution:**
```sql
SELECT state,
       ROUND(AVG(population_2020_census), 0) AS avg_town_pop,
       ROUND(AVG(land_area_sq_mi), 0) AS avg_town_area
  FROM pnw_towns
 GROUP BY state;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT state, ROUND(AVG(population_2020_census), 0) AS avg_t` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT state, ROUND(AVG(population_2020_census), 0) AS avg_t` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT statex, ROUND(AVG(population_2020_census), 0) AS avg_` | error | error | ✓ | There's no column named "statex". Did you mean `state`? |

### Sorting and Grouping Techniques  `/examples/sorting-and-grouping-techniques`

#### `example35` — Sorting 1: Rank towns by population (smallest first)

**Solution:**
```sql
SELECT town, state, population_2020_census
  FROM pnw_towns
 ORDER BY population_2020_census;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census FROM pnw_towns OR` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census FROM pnw_townsx O` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census FROM pnw_towns O` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-orderby**<br>`SELECT town, state, population_2020_census FROM pnw_towns;` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example36b` — Sorting 2: Rank towns by population (largest first)

**Solution:**
```sql
SELECT town, state, population_2020_census
  FROM pnw_towns
 ORDER BY population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census FROM pnw_towns OR` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census FROM pnw_townsx O` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census FROM pnw_towns O` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-orderby**<br>`SELECT town, state, population_2020_census FROM pnw_towns;` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example37` — Sorting 3: Sort by multiple columns (state, then population within state)

**Solution:**
```sql
SELECT town, state, population_2020_census
  FROM pnw_towns
 ORDER BY state, population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census FROM pnw_towns OR` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census FROM pnw_townsx O` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census FROM pnw_towns O` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-orderby**<br>`SELECT town, state, population_2020_census FROM pnw_towns;` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example37b` — Sorting 4: Sort counties by age (oldest first)

**Solution:**
```sql
SELECT county, state, year_established, etymology
  FROM pnw_counties
 ORDER BY year_established, county;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, state, year_established, etymology FROM pnw_c` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, state, year_established, etymology FROM pnw_c` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, state, year_established, etymology FROM pnw_` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-orderby**<br>`SELECT county, state, year_established, etymology FROM pnw_c` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example38` — Grouping 1: Count towns per state

**Solution:**
```sql
SELECT state, 
       COUNT(*) AS number_of_towns
  FROM pnw_towns
 GROUP BY state;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT state, COUNT(*) AS number_of_towns FROM pnw_towns GRO` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT state, COUNT(*) AS number_of_towns FROM pnw_townsx GR` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT statex, COUNT(*) AS number_of_towns FROM pnw_towns GR` | error | error | ✓ | There's no column named "statex". Did you mean `state`? |

#### `example39` — Grouping 2: Compare states by average county population

**Solution:**
```sql
SELECT state, 
       COUNT(*) AS num_counties,
       ROUND(AVG(population_2022), 0) AS avg_county_pop,
       SUM(population_2022) AS total_state_pop
  FROM pnw_counties
 GROUP BY state
 ORDER BY avg_county_pop DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT state, COUNT(*) AS num_counties, ROUND(AVG(population` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT state, COUNT(*) AS num_counties, ROUND(AVG(population` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT statex, COUNT(*) AS num_counties, ROUND(AVG(populatio` | error | error | ✓ | There's no column named "statex". Did you mean `state`? |
| **missing-orderby**<br>`SELECT state, COUNT(*) AS num_counties, ROUND(AVG(population` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example39b` — Grouping 3: Which counties have the most towns?

**Solution:**
```sql
SELECT primary_county, 
       state,
       COUNT(*) AS num_towns,
       SUM(population_2020_census) AS total_pop
  FROM pnw_towns
 GROUP BY primary_county, state
 ORDER BY num_towns DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT primary_county, state, COUNT(*) AS num_towns, SUM(pop` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT primary_county, state, COUNT(*) AS num_towns, SUM(pop` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT primary_countyx, state, COUNT(*) AS num_towns, SUM(po` | error | error | ✓ | There's no column named "primary_countyx". Did you mean `primary_county`? |
| **missing-orderby**<br>`SELECT primary_county, state, COUNT(*) AS num_towns, SUM(pop` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example40b` — example40b

**Solution:**
```sql
SELECT primary_county, 
       state, 
       COUNT(*) AS num_towns
  FROM pnw_towns
 GROUP BY primary_county, state
HAVING COUNT(*) >= 10
 ORDER BY num_towns DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT primary_county, state, COUNT(*) AS num_towns FROM pnw` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT primary_county, state, COUNT(*) AS num_towns FROM pnw` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT primary_countyx, state, COUNT(*) AS num_towns FROM pn` | error | error | ✓ | There's no column named "primary_countyx". Did you mean `primary_county`? |
| **missing-orderby**<br>`SELECT primary_county, state, COUNT(*) AS num_towns FROM pnw` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example40c` — Grouping 5: Population growth by county

**Solution:**
```sql
SELECT primary_county,
       state,
       SUM(population_2010_census) AS pop_2010,
       SUM(population_2020_census) AS pop_2020,
       SUM(population_2020_census) - SUM(population_2010_census) AS growth
  FROM pnw_towns
 GROUP BY primary_county, state
HAVING SUM(population_2010_census) > 0
 ORDER BY growth DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT primary_county, state, SUM(population_2010_census) AS` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT primary_county, state, SUM(population_2010_census) AS` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT primary_countyx, state, SUM(population_2010_census) A` | error | error | ✓ | There's no column named "primary_countyx". Did you mean `primary_county`? |
| **missing-orderby**<br>`SELECT primary_county, state, SUM(population_2010_census) AS` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

### Transforming Techniques  `/examples/transforming-techniques`

#### `example41` — Transforming 1: Classify towns by size category

**Solution:**
```sql
SELECT town, 
       state,
       population_2020_census,
       CASE 
           WHEN population_2020_census >= 100000 THEN 'Large City'
           WHEN population_2020_census >= 25000 THEN 'Medium City'
           WHEN population_2020_census >= 5000 THEN 'Small City'
           ELSE 'Town'
       END AS size_category
  FROM pnw_towns
 ORDER BY population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census, CASE WHEN popula` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census, CASE WHEN popula` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census, CASE WHEN popul` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-orderby**<br>`SELECT town, state, population_2020_census, CASE WHEN popula` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example42` — Transforming 2: Calculate population change from 2010 to 2020

**Solution:**
```sql
SELECT town, 
       state, 
       population_2010_census AS pop_2010,
       population_2020_census AS pop_2020,
       population_2020_census - population_2010_census AS pop_change,
       ROUND((population_2020_census - population_2010_census) * 100.0 / population_2010_census, 1) AS pct_change
  FROM pnw_towns
 WHERE population_2010_census > 0
 ORDER BY pct_change DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2010_census AS pop_2010, popu` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2010_census AS pop_2010, popu` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2010_census AS pop_2010, pop` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2010_census AS pop_2010, popu` | fail | warn | ✓ | Slightly too many rows: you returned 453, expected 452. Check whether your filter excludes the boundary (e.g., `>` vs `>=`). |
| **missing-orderby**<br>`SELECT town, state, population_2010_census AS pop_2010, popu` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example42b` — Transforming 3: Identify fastest-growing and declining towns

**Solution:**
```sql
SELECT town,
       state,
       population_2010_census AS pop_2010,
       population_2020_census AS pop_2020,
       CASE 
           WHEN population_2020_census > population_2010_census * 1.20 THEN 'Rapid Growth (>20%)'
           WHEN population_2020_census > population_2010_census THEN 'Growing'
           WHEN population_2020_census = population_2010_census THEN 'Stable'
           WHEN population_2020_census > population_2010_census * 0.80 THEN 'Declining'
           ELSE 'Rapid Decline (>20%)'
       END AS growth_status
  FROM pnw_towns
 WHERE population_2010_census > 0
 ORDER BY (population_2020_census - population_2010_census) * 1.0 / population_2010_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2010_census AS pop_2010, popu` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2010_census AS pop_2010, popu` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2010_census AS pop_2010, pop` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2010_census AS pop_2010, popu` | fail | warn | ✓ | Slightly too many rows: you returned 453, expected 452. Check whether your filter excludes the boundary (e.g., `>` vs `>=`). |
| **missing-orderby**<br>`SELECT town, state, population_2010_census AS pop_2010, popu` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example43` — Transforming 4: Calculate and categorize population density

**Solution:**
```sql
SELECT town, 
       state, 
       population_2020_census,
       land_area_sq_mi,
       ROUND(population_2020_census / land_area_sq_mi, 0) AS density,
       CASE 
           WHEN population_2020_census / land_area_sq_mi > 5000 THEN 'Urban'
           WHEN population_2020_census / land_area_sq_mi > 1000 THEN 'Suburban'
           ELSE 'Rural'
       END AS density_class
  FROM pnw_towns
 WHERE land_area_sq_mi > 0
 ORDER BY density DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census, land_area_sq_mi,` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census, land_area_sq_mi,` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census, land_area_sq_mi` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2020_census, land_area_sq_mi,` | fail | ok | ✓ | ✓ Your query matches the expected result. |
| **missing-orderby**<br>`SELECT town, state, population_2020_census, land_area_sq_mi,` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example43b` — Transforming 5: Flag counties by era of establishment

**Solution:**
```sql
SELECT county,
       state,
       year_established,
       CASE 
           WHEN year_established < 1850 THEN 'Pioneer Era'
           WHEN year_established < 1890 THEN 'Settlement Era'
           WHEN year_established < 1920 THEN 'Progressive Era'
           ELSE 'Modern Era'
       END AS historical_era
  FROM pnw_counties
 ORDER BY year_established;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, state, year_established, CASE WHEN year_estab` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, state, year_established, CASE WHEN year_estab` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, state, year_established, CASE WHEN year_esta` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-orderby**<br>`SELECT county, state, year_established, CASE WHEN year_estab` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

### Joining Techniques  `/examples/joining-techniques`

#### `example44` — Joining 1: Enrich town data with county information

**Solution:**
```sql
SELECT t.town,
       t.population_2020_census,
       c.county,
       c.year_established,
       c.etymology
  FROM pnw_towns AS t
 INNER JOIN pnw_counties AS c 
    ON t.primary_county = c.county 
   AND t.state = c.state
 ORDER BY t.population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT t.town, t.population_2020_census, c.county, c.year_es` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT t.town, t.population_2020_census, c.county, c.year_es` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT t.townx, t.population_2020_census, c.county, c.year_e` | error | error | ✓ | There's no column named "townx" in table `t`. Did you mean `town`? |
| **missing-orderby**<br>`SELECT t.town, t.population_2020_census, c.county, c.year_es` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example44b` — Joining 2: Find which towns are county seats

**Solution:**
```sql
SELECT t.town,
       t.state,
       t.population_2020_census AS town_pop,
       c.county,
       c.population_2022 AS county_pop
  FROM pnw_towns AS t
 INNER JOIN pnw_counties AS c 
    ON t.town = c.county_seat 
   AND t.state = c.state
 ORDER BY t.population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT t.town, t.state, t.population_2020_census AS town_pop` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT t.town, t.state, t.population_2020_census AS town_pop` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT t.townx, t.state, t.population_2020_census AS town_po` | error | error | ✓ | There's no column named "townx" in table `t`. Did you mean `town`? |
| **missing-orderby**<br>`SELECT t.town, t.state, t.population_2020_census AS town_pop` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example44c` — Joining 3: Compare town population to county population

**Solution:**
```sql
SELECT t.town,
       t.population_2020_census AS town_pop,
       c.county,
       c.population_2022 AS county_pop,
       ROUND(t.population_2020_census * 100.0 / c.population_2022, 1) AS pct_of_county
  FROM pnw_towns AS t
 INNER JOIN pnw_counties AS c 
    ON t.primary_county = c.county 
   AND t.state = c.state
 ORDER BY pct_of_county DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT t.town, t.population_2020_census AS town_pop, c.count` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT t.town, t.population_2020_census AS town_pop, c.count` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT t.townx, t.population_2020_census AS town_pop, c.coun` | error | error | ✓ | There's no column named "townx" in table `t`. Did you mean `town`? |
| **missing-orderby**<br>`SELECT t.town, t.population_2020_census AS town_pop, c.count` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example45` — Joining 4: List all counties with their county seat populations (if available)

**Solution:**
```sql
SELECT c.county,
       c.state,
       c.county_seat,
       t.population_2020_census AS seat_population
  FROM pnw_counties AS c
  LEFT JOIN pnw_towns AS t 
    ON c.county_seat = t.town 
   AND c.state = t.state
 ORDER BY t.population_2020_census IS NULL DESC, 
          c.county;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT c.county, c.state, c.county_seat, t.population_2020_c` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT c.county, c.state, c.county_seat, t.population_2020_c` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT c.countyx, c.state, c.county_seat, t.population_2020_` | error | error | ✓ | There's no column named "countyx" in table `c`. Did you mean `county`? |
| **missing-orderby**<br>`SELECT c.county, c.state, c.county_seat, t.population_2020_c` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example45b` — Joining 5: Flag whether each town is a county seat

**Solution:**
```sql
SELECT t.town,
       t.state,
       t.population_2020_census,
       CASE 
           WHEN c.county IS NOT NULL THEN 'Yes'
           ELSE 'No'
       END AS is_county_seat,
       c.county AS seat_of_county
  FROM pnw_towns AS t
  LEFT JOIN pnw_counties AS c 
    ON t.town = c.county_seat 
   AND t.state = c.state
 ORDER BY is_county_seat DESC, t.population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT t.town, t.state, t.population_2020_census, CASE WHEN ` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT t.town, t.state, t.population_2020_census, CASE WHEN ` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT t.townx, t.state, t.population_2020_census, CASE WHEN` | error | error | ✓ | There's no column named "townx" in table `t`. Did you mean `town`? |
| **missing-orderby**<br>`SELECT t.town, t.state, t.population_2020_census, CASE WHEN ` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example45c` — Joining 6: Count towns per county (including counties with zero towns)

**Solution:**
```sql
SELECT c.county,
       c.state,
       c.population_2022 AS county_pop,
       COUNT(t.town) AS num_towns,
       COALESCE(SUM(t.population_2020_census), 0) AS total_town_pop
  FROM pnw_counties AS c
  LEFT JOIN pnw_towns AS t 
    ON c.county = t.primary_county 
   AND c.state = t.state
 GROUP BY c.county, c.state, c.population_2022
 ORDER BY num_towns DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT c.county, c.state, c.population_2022 AS county_pop, C` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT c.county, c.state, c.population_2022 AS county_pop, C` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT c.countyx, c.state, c.population_2022 AS county_pop, ` | error | error | ✓ | There's no column named "countyx" in table `c`. Did you mean `county`? |
| **missing-orderby**<br>`SELECT c.county, c.state, c.population_2022 AS county_pop, C` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example47` — Joining 7: Find county seats not in our towns database

**Solution:**
```sql
SELECT c.county,
       c.state,
       c.county_seat
  FROM pnw_counties AS c
  LEFT JOIN pnw_towns AS t 
    ON c.county_seat = t.town 
   AND c.state = t.state
 WHERE t.town IS NULL
 ORDER BY c.state, c.county;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT c.county, c.state, c.county_seat FROM pnw_counties AS` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT c.county, c.state, c.county_seat FROM pnw_countiesx A` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT c.countyx, c.state, c.county_seat FROM pnw_counties A` | error | error | ✓ | There's no column named "countyx" in table `c`. Did you mean `county`? |
| **missing-where**<br>`SELECT c.county, c.state, c.county_seat FROM pnw_counties AS` | fail | warn | ✓ | Too many rows: you returned 75, expected 5. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT c.county, c.state, c.county_seat FROM pnw_counties AS` | fail | ok | ✓ | ✓ Your query matches the expected result. |

#### `example47b` — Joining 8: Find large towns that are NOT county seats

**Solution:**
```sql
SELECT t.town,
       t.state,
       t.population_2020_census,
       t.primary_county
  FROM pnw_towns AS t
  LEFT JOIN pnw_counties AS c 
    ON t.town = c.county_seat 
   AND t.state = c.state
 WHERE c.county IS NULL
   AND t.population_2020_census > 25000
 ORDER BY t.population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT t.town, t.state, t.population_2020_census, t.primary_` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT t.town, t.state, t.population_2020_census, t.primary_` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT t.townx, t.state, t.population_2020_census, t.primary` | error | error | ✓ | There's no column named "townx" in table `t`. Did you mean `town`? |
| **missing-where**<br>`SELECT t.town, t.state, t.population_2020_census, t.primary_` | fail | warn | ✓ | Too many rows: you returned 453, expected 46. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT t.town, t.state, t.population_2020_census, t.primary_` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example47c` — Joining 9: Find counties with no towns in our database

**Solution:**
```sql
SELECT c.county,
       c.state,
       c.population_2022,
       c.county_seat
  FROM pnw_counties AS c
  LEFT JOIN pnw_towns AS t 
    ON c.county = t.primary_county 
   AND c.state = t.state
 WHERE t.town IS NULL
 ORDER BY c.population_2022 DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT c.county, c.state, c.population_2022, c.county_seat F` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT c.county, c.state, c.population_2022, c.county_seat F` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT c.countyx, c.state, c.population_2022, c.county_seat ` | error | error | ✓ | There's no column named "countyx" in table `c`. Did you mean `county`? |
| **missing-where**<br>`SELECT c.county, c.state, c.population_2022, c.county_seat F` | fail | warn | ✓ | Too many rows: you returned 449, expected 2. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
| **missing-orderby**<br>`SELECT c.county, c.state, c.population_2022, c.county_seat F` | fail | ok | ✓ | ✓ Your query matches the expected result. |

#### `example48` — Joining 10: Comprehensive county analysis

**Solution:**
```sql
SELECT c.county,
       c.state,
       c.year_established,
       CASE 
           WHEN c.year_established < 1860 THEN 'Pioneer'
           WHEN c.year_established < 1900 THEN 'Settlement'
           ELSE 'Modern'
       END AS era,
       c.population_2022 AS county_pop,
       COUNT(t.town) AS num_towns,
       COALESCE(SUM(t.population_2020_census), 0) AS urban_pop,
       MAX(t.population_2020_census) AS largest_town_pop
  FROM pnw_counties AS c
  LEFT JOIN pnw_towns AS t 
    ON c.county = t.primary_county 
   AND c.state = t.state
 GROUP BY c.county, c.state, c.year_established, c.population_2022
 ORDER BY c.population_2022 DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT c.county, c.state, c.year_established, CASE WHEN c.ye` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT c.county, c.state, c.year_established, CASE WHEN c.ye` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT c.countyx, c.state, c.year_established, CASE WHEN c.y` | error | error | ✓ | There's no column named "countyx" in table `c`. Did you mean `county`? |
| **missing-orderby**<br>`SELECT c.county, c.state, c.year_established, CASE WHEN c.ye` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

## Exercises

### Selection Techniques  `/exercises/selection-techniques`

#### `query1` — Select all airline names from the `airlines` table.

**Solution:**
```sql
-- SOLUTION: Here's one way to select all airline names from the airlines table
SELECT name
FROM airlines;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: Here's one way to select all airline names from` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT name FROM airlinesx;` | error | error | ✓ | There's no table named "airlinesx". Did you mean `airlines`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT namex FROM airlines;` | error | error | ✓ | There's no column named "namex". Did you mean `name`? |

#### `query2` — Select all columns from the `weather` table.

**Solution:**
```sql
-- SOLUTION: Here is one way to select all fields from the `weather` table:
SELECT *
FROM weather;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: Here is one way to select all fields from the \`` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT * FROM weatherx;` | error | error | ✓ | There's no table named "weatherx". Did you mean `weather`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |

#### `query3` — Select the FAA code and name from the `airports` table.

**Solution:**
```sql
-- SOLUTION: Here is one way to select the FAA code and name from the airports table:
SELECT faa, name
FROM airports;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: Here is one way to select the FAA code and name` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT faa, name FROM airportsx;` | error | error | ✓ | There's no table named "airportsx". Did you mean `airports`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT faax, name FROM airports;` | error | error | ✓ | There's no column named "faax". Did you mean `faa`? |

#### `query4` — Select and alias specific columns from the airports table

**Solution:**
```sql
-- SOLUTION: Here is how you can select and alias the FAA code, name, and altitude from the airports table:
SELECT faa AS code, name AS airport_name, alt AS altitude
FROM airports;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: Here is how you can select and alias the FAA co` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT faa AS code, name AS airport_name, alt AS altitude FR` | error | error | ✓ | There's no table named "airportsx". Did you mean `airports`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT faax AS code, name AS airport_name, alt AS altitude F` | error | error | ✓ | There's no column named "faax". Did you mean `faa`? |

#### `query5` — Choose the destination airport code and air time from the flights table with an alias `f`

**Solution:**
```sql
-- SOLUTION: Here's how to select the destination airport code and air time from the flights table using an alias:
SELECT f.dest, f.air_time
FROM flights AS f;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: Here's how to select the destination airport co` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT f.dest, f.air_time FROM flightsx AS f;` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT f.destx, f.air_time FROM flights AS f;` | error | error | ✓ | There's no column named "destx" in table `f`. Did you mean `dest`? |

#### `query6` — Select all distinct time zones (`tz`) from the `airports` table.

**Solution:**
```sql
-- SOLUTION: Here's how to select all distinct time zones from the airports table:
SELECT DISTINCT tz
FROM airports;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: Here's how to select all distinct time zones fr` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT DISTINCT tz FROM airportsx;` | error | error | ✓ | There's no table named "airportsx". Did you mean `airports`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT DISTINCT tzx FROM airports;` | error | error | ✓ | There's no column named "tzx". Did you mean `tz`? |

#### `query9` — Count the records in the flights table (aliased as `total_flights`)

**Solution:**
```sql
-- SOLUTION: Here's how to count all records in the flights table:
SELECT COUNT(*) AS total_flights
FROM flights;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: Here's how to count all records in the flights ` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT COUNT(*) AS total_flights FROM flightsx;` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |

#### `query10` — Count all distinct carriers in the flights table as `total_distinct_carriers`

**Solution:**
```sql
-- SOLUTION: This query counts all distinct carriers in the flights table.
SELECT COUNT(DISTINCT carrier) AS total_distinct_carriers
FROM flights;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query counts all distinct carriers in the ` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT COUNT(DISTINCT carrier) AS total_distinct_carriers FR` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |

### Filtering Techniques  `/exercises/filtering-techniques`

#### `query11` — Select Boeing Planes' Tail Numbers and Models

**Solution:**
```sql
-- SOLUTION: This query selects tail numbers and models of planes manufactured by Boeing.
SELECT tailnum, model 
FROM planes 
WHERE manufacturer = 'BOEING';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query selects tail numbers and models of p` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT tailnum, model FROM planesx WHERE manufacturer = 'BOE` | error | error | ✓ | There's no table named "planesx". Did you mean `planes`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT tailnumx, model FROM planes WHERE manufacturer = 'BOE` | error | error | ✓ | There's no column named "tailnumx". Did you mean `tailnum`? |
| **missing-where**<br>`SELECT tailnum, model FROM planes;` | fail | warn | ✓ | Too many rows: you returned 3,953, expected 2,219. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `query12` — Select airports (faa, name, lat) above 40 latitude and in the America/New_York time zone.

**Solution:**
```sql
-- SOLUTION: This query selects certain columns from airports based on specified conditions.
SELECT faa, name, lat 
FROM airports 
WHERE lat > 40 
AND tzone = 'America/New_York';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query selects certain columns from airport` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT faa, name, lat FROM airportsx WHERE lat > 40 AND tzon` | error | error | ✓ | There's no table named "airportsx". Did you mean `airports`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT faax, name, lat FROM airports WHERE lat > 40 AND tzon` | error | error | ✓ | There's no column named "faax". Did you mean `faa`? |
| **missing-where**<br>`SELECT faa, name, lat FROM airports;` | fail | warn | ✓ | Too many rows: you returned 1,251, expected 161. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `query13` — Select airports (faa code, name, and lat) within 40 to 42 degrees latitude.

**Solution:**
```sql
-- SOLUTION: This query selects FAA codes, names, and latitudes of airports within a specific latitude range.
SELECT faa, name, lat 
FROM airports 
WHERE lat BETWEEN 40 AND 42;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query selects FAA codes, names, and latitu` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT faa, name, lat FROM airportsx WHERE lat BETWEEN 40 AN` | error | error | ✓ | There's no table named "airportsx". Did you mean `airports`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT faax, name, lat FROM airports WHERE lat BETWEEN 40 AN` | error | error | ✓ | There's no column named "faax". Did you mean `faa`? |
| **missing-where**<br>`SELECT faa, name, lat FROM airports;` | fail | warn | ✓ | Too many rows: you returned 1,251, expected 160. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `query14` — Select airlines (carrier code and name) with name starting with an "A"

**Solution:**
```sql
-- SOLUTION: This query selects the carrier code and name of airlines with names starting with 'A'.
SELECT carrier, name 
FROM airlines 
WHERE name LIKE 'A%';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query selects the carrier code and name of` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT carrier, name FROM airlinesx WHERE name LIKE 'A%';` | error | error | ✓ | There's no table named "airlinesx". Did you mean `airlines`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT carrierx, name FROM airlines WHERE name LIKE 'A%';` | error | error | ✓ | There's no column named "carrierx". Did you mean `carrier`? |
| **missing-where**<br>`SELECT carrier, name FROM airlines;` | fail | warn | ✓ | Too many rows: you returned 12, expected 3. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `query15` — Select flights having 101 as the second, third, and fourth characters of the tail number.

**Solution:**
```sql
-- SOLUTION: This query selects flights with tail numbers that have '101' as the second, third, and fourth characters.
SELECT tailnum 
FROM flights 
WHERE tailnum LIKE '_101%';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query selects flights with tail numbers th` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT tailnum FROM flightsx WHERE tailnum LIKE '_101%';` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT tailnumx FROM flights WHERE tailnum LIKE '_101%';` | error | error | ✓ | There's no column named "tailnumx". Did you mean `tailnum`? |
| **missing-where**<br>`SELECT tailnum FROM flights;` | fail | warn | ✓ | Too many rows: you returned 222,494, expected 116. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `query16` — Select flights (all columns) where the carrier is either "AS" or "HA"

**Solution:**
```sql
-- SOLUTION: This query selects all flights where the carrier is either "AS" or "HA".
SELECT * 
FROM flights 
WHERE carrier IN ('AS', 'HA');
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query selects all flights where the carrie` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT * FROM flightsx WHERE carrier IN ('AS', 'HA');` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **missing-where**<br>`SELECT * FROM flights;` | fail | warn | ✓ | Too many rows: you returned 222,494, expected 96,467. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `query17` — Select weather records (all columns) where wind direction is missing

**Solution:**
```sql
-- SOLUTION: This query selects all weather records where the wind direction is missing.
SELECT * 
FROM weather 
WHERE wind_dir IS NULL;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query selects all weather records where th` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT * FROM weatherx WHERE wind_dir IS NULL;` | error | error | ✓ | There's no table named "weatherx". Did you mean `weather`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **missing-where**<br>`SELECT * FROM weather;` | fail | warn | ✓ | Too many rows: you returned 17,468, expected 395. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `query18` — Select weather records where temperature is not missing

**Solution:**
```sql
-- SOLUTION: This query selects all weather records where the temperature is not missing.
SELECT * 
FROM weather 
WHERE temp IS NOT NULL;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query selects all weather records where th` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT * FROM weatherx WHERE temp IS NOT NULL;` | error | error | ✓ | There's no table named "weatherx". Did you mean `weather`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **missing-where**<br>`SELECT * FROM weather;` | fail | warn | ✓ | Slightly too many rows: you returned 17468, expected 17464. Check whether your filter excludes the boundary (e.g., `>` vs `>=`). |

### Aggregating Techniques  `/exercises/aggregating-techniques`

#### `query19` — Calculate the average temperature from the weather table as `avg_temperature`

**Solution:**
```sql
-- SOLUTION: This query calculates the average temperature from the weather table.
SELECT AVG(temp) AS avg_temperature
FROM weather;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query calculates the average temperature f` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT AVG(temp) AS avg_temperature FROM weatherx;` | error | error | ✓ | There's no table named "weatherx". Did you mean `weather`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |

#### `query20` — Find the maximum arrival time for flights destined to ORD as `max_arr_time`

**Solution:**
```sql
-- SOLUTION: This query finds the maximum arrival time for flights destined to ORD.
SELECT MAX(arr_time) AS max_arr_time
FROM flights
WHERE dest = 'ORD';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query finds the maximum arrival time for f` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT MAX(arr_time) AS max_arr_time FROM flightsx WHERE des` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **missing-where**<br>`SELECT MAX(arr_time) AS max_arr_time FROM flights;` | fail | ok | ✓ | ✓ Your query matches the expected result. |

#### `query21` — Find the first destination alphabetically for flights from SEA as `first_sea_dest`

**Solution:**
```sql
-- SOLUTION: This query finds the first destination alphabetically for flights destined to SEA.
SELECT MIN(dest) AS first_sea_dest
FROM flights
WHERE origin = 'SEA';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query finds the first destination alphabet` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT MIN(dest) AS first_sea_dest FROM flightsx WHERE origi` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **missing-where**<br>`SELECT MIN(dest) AS first_sea_dest FROM flights;` | fail | ok | ✓ | ✓ Your query matches the expected result. |

#### `query22` — Round wind gust values in the weather table to 0 decimal places as `rounded_wind_gust`

**Solution:**
```sql
-- SOLUTION: This query rounds wind gust values in the weather table to 0 decimal places.
SELECT ROUND(wind_gust, 0) AS rounded_wind_gust
FROM weather;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query rounds wind gust values in the weath` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT ROUND(wind_gust, 0) AS rounded_wind_gust FROM weather` | error | error | ✓ | There's no table named "weatherx". Did you mean `weather`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |

### Sorting and Grouping Techniques  `/exercises/sorting-and-grouping-techniques`

#### `query23` — Sort flights by departure delay

**Solution:**
```sql
-- SOLUTION: This query sorts flights by departure delay.
SELECT *
FROM flights
ORDER BY dep_delay;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query sorts flights by departure delay. SE` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT * FROM flightsx ORDER BY dep_delay;` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **missing-orderby**<br>`SELECT * FROM flights;` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `query24` — Sort flights by descending arrival delay

**Solution:**
```sql
-- SOLUTION: This query sorts flights by descending arrival delay.
SELECT *
FROM flights
ORDER BY arr_delay DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query sorts flights by descending arrival ` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT * FROM flightsx ORDER BY arr_delay DESC;` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **missing-orderby**<br>`SELECT * FROM flights;` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `query25` — Sort weather data by descending visibility and then descending wind speed

**Solution:**
```sql
-- SOLUTION: This query sorts weather data by descending visibility and then by descending wind speed.
SELECT *
FROM weather
ORDER BY visib DESC, wind_speed DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query sorts weather data by descending vis` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT * FROM weatherx ORDER BY visib DESC, wind_speed DESC;` | error | error | ✓ | There's no table named "weatherx". Did you mean `weather`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **missing-orderby**<br>`SELECT * FROM weather;` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `query26` — Group flights by origin and calculate the average arrival delay as `avg_arr_delay`

**Solution:**
```sql
-- SOLUTION: This query groups flights by origin and calculates the average arrival delay.
SELECT origin, AVG(arr_delay) AS avg_arr_delay
FROM flights
GROUP BY origin;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query groups flights by origin and calcula` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT origin, AVG(arr_delay) AS avg_arr_delay FROM flightsx` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT originx, AVG(arr_delay) AS avg_arr_delay FROM flights` | error | error | ✓ | There's no column named "originx". Did you mean `origin`? |

#### `query27` — Group flights by destination and count the number of flights for each destination having more than 100 flights as `total_flights`

**Solution:**
```sql
-- SOLUTION: This query groups flights by destination and counts the number of flights for each, only including those destinations with more than 100 flights.
SELECT dest, COUNT(*) AS total_flights
FROM flights
GROUP BY dest
HAVING COUNT(*) > 100;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query groups flights by destination and co` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT dest, COUNT(*) AS total_flights FROM flightsx GROUP B` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT destx, COUNT(*) AS total_flights FROM flights GROUP B` | error | error | ✓ | There's no column named "destx". Did you mean `dest`? |

### Transforming Techniques  `/exercises/transforming-techniques`

#### `query28` — Categorize flights by distance as Short, Medium, or Long. Use 'Short' for distances less than 500 miles, 'Medium' for 500 to 2000 miles, and 'Long' for more than 2000 miles.

**Solution:**
```sql
-- SOLUTION: This query categorizes flights by distance as 'Short', 'Medium', or 'Long'.
SELECT distance, CASE 
WHEN distance < 500 THEN 'Short'
WHEN distance BETWEEN 500 AND 2000 THEN 'Medium'
ELSE 'Long'
END AS flight_distance_category
FROM flights;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query categorizes flights by distance as '` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT distance, CASE WHEN distance < 500 THEN 'Short' WHEN ` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT distancex, CASE WHEN distance < 500 THEN 'Short' WHEN` | error | error | ✓ | There's no column named "distancex". Did you mean `distance`? |

#### `query29` — Calculate the average speed of flights grouped by origin and destination and order by the fastest average speed

**Solution:**
```sql
-- SOLUTION: This query calculates the average speed of flights from each origin to each destination and orders the results by the fastest average speeds.
SELECT origin, dest,
AVG(distance / (air_time / 60)) AS avg_speed
FROM flights
GROUP BY origin, dest
ORDER BY avg_speed DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query calculates the average speed of flig` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT origin, dest, AVG(distance / (air_time / 60)) AS avg_` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT originx, dest, AVG(distance / (air_time / 60)) AS avg` | error | error | ✓ | There's no column named "originx". Did you mean `origin`? |
| **missing-orderby**<br>`SELECT origin, dest, AVG(distance / (air_time / 60)) AS avg_` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

### Joining Techniques  `/exercises/joining-techniques`

#### `query30` — Join flights (as `f`) with weather (as `w`) on `origin` and `time_hour` (returning only the rows matching between both tables). Select the `origin`, `dest`,

**Solution:**
```sql
-- SOLUTION: This query joins the flights table with the weather table on matching origin and time_hour, selecting origin, destination, temperature, and humidity.
SELECT f.origin, f.dest, w.temp, w.humid
FROM flights AS f
INNER JOIN weather AS w ON f.origin = w.origin AND f.time_hour = w.time_hour;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query joins the flights table with the wea` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT f.origin, f.dest, w.temp, w.humid FROM flightsx AS f ` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT f.originx, f.dest, w.temp, w.humid FROM flights AS f ` | error | error | ✓ | There's no column named "originx" in table `f`. Did you mean `origin`? |

#### `query31` — Left join flights with planes on tailnum (returning all rows from flights and only the rows from planes that match). Select the `tailnum`, `origin`, `dest`, `manufacturer`, and `model` fields.

**Solution:**
```sql
-- SOLUTION: This query left joins the flights table with the planes table on matching tailnum, selecting tailnum, origin, destination, manufacturer, and model.
SELECT f.tailnum, f.origin, f.dest, p.manufacturer, p.model
FROM flights AS f
LEFT JOIN planes AS p ON f.tailnum = p.tailnum;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query left joins the flights table with th` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT f.tailnum, f.origin, f.dest, p.manufacturer, p.model ` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT f.tailnumx, f.origin, f.dest, p.manufacturer, p.model` | error | error | ✓ | There's no column named "tailnumx" in table `f`. Did you mean `tailnum`? |

#### `query33` — Anti-join flights (as `f`) with planes (as `p`) where plane's tailnum is missing. Select the `tailnum`, `origin`, and `dest` fields.

**Solution:**
```sql
-- SOLUTION: This query left joins the flights table with the planes table on matching tailnum, selecting flights' tailnum, origin, and destination where the corresponding tailnum in planes is missing.
SELECT f.tailnum, f.origin, f.dest
FROM flights AS f
LEFT JOIN planes AS p ON f.tailnum = p.tailnum
WHERE p.tailnum IS NULL;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`-- SOLUTION: This query left joins the flights table with th` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT f.tailnum, f.origin, f.dest FROM flightsx AS f LEFT J` | error | error | ✓ | There's no table named "flightsx". Did you mean `flights`? Available tables: `airlines`, `airports`, `flights`, `planes`, `weather`. |
| **typo-column**<br>`SELECT f.tailnumx, f.origin, f.dest FROM flights AS f LEFT J` | error | error | ✓ | There's no column named "tailnumx" in table `f`. Did you mean `tailnum`? |
| **missing-where**<br>`SELECT f.tailnum, f.origin, f.dest FROM flights AS f LEFT JO` | fail | warn | ✓ | Too many rows: you returned 222,494, expected 11,267. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |
