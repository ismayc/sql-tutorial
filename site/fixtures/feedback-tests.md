# Feedback regression report

Generated: 2026-05-24T21:37:32.056Z
Base URL: `http://localhost:4321/sql-tutorial`
Total cases: **319** · matching expectation: **319** (100.0%) · runtime: 46.5s

### Reading this report

Each exercise lists 2–6 variants. **Expected** is the outcome class the test author wants: `ok` (✓ pass), `fail` (any non-pass; diagnostic warning), `error` (friendly SQL error). **Actual** is what classify() saw. Rows where Expected ≠ Actual are flagged with ✗ — those are the cases worth inspecting because the student would get unexpected feedback.

## Examples

### Selection Techniques  `/examples/selection-techniques`

#### `example1` — Selection 1: Select all town names

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

#### `example2` — Selection 2: Select all county names

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

#### `example3` — Selection 3: Select all columns for towns table

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

#### `example4` — Selection 4: Select county names and population for 2022

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

#### `example5` — Aliasing 1: Select county names, population for 2022, and land area (Aliased)

**Solution:**
```sql
SELECT county AS cty, 
       population_2022 AS pop2022,
       land_area_sq_mi AS area
  FROM pnw_counties;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county AS cty, population_2022 AS pop2022, land_area_` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county AS cty, population_2022 AS pop2022, land_area_` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx AS cty, population_2022 AS pop2022, land_area` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |

#### `example6` — Aliasing 2: Alias the table name

**Solution:**
```sql
SELECT counties.county,
       counties.origin
  FROM pnw_counties AS counties;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT counties.county, counties.origin FROM pnw_counties AS` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT counties.county, counties.origin FROM pnw_countiesx A` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT counties.countyx, counties.origin FROM pnw_counties A` | error | error | ✓ | There's no column named "countyx" in table `counties`. Did you mean `county`? |

#### `example7` — Unique 1: Select distinct states from the `pnw_towns` table

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

#### `example10` — Counting 1: Count the number of records in the `pnw_towns` table

**Solution:**
```sql
SELECT COUNT(*) AS num_towns
  FROM pnw_towns;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT COUNT(*) AS num_towns FROM pnw_towns;` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT COUNT(*) AS num_towns FROM pnw_townsx;` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |

#### `example11` — Counting 2: Count the number of distinct states in `pnw_counties`

**Solution:**
```sql
SELECT COUNT(DISTINCT state) AS num_unique_states
  FROM pnw_counties;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT COUNT(DISTINCT state) AS num_unique_states FROM pnw_c` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT COUNT(DISTINCT state) AS num_unique_states FROM pnw_c` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |

### Filtering Techniques  `/examples/filtering-techniques`

#### `example12` — Filtering 1: Towns with greater than 150,000 people

**Solution:**
```sql
SELECT town, state, population_2020_census 
  FROM pnw_towns 
 WHERE population_2020_census > 150000;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census FROM pnw_townsx W` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census FROM pnw_towns W` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2020_census FROM pnw_towns;` | fail | warn | ✓ | Too many rows: you returned 453, expected 8. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example13` — Filtering 2: Towns with greater than 150,000 people and in Oregon

**Solution:**
```sql
SELECT town, state, population_2020_census 
  FROM pnw_towns 
 WHERE population_2020_census > 150000
   AND state = 'Oregon';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census FROM pnw_townsx W` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census FROM pnw_towns W` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2020_census FROM pnw_towns;` | fail | warn | ✓ | Too many rows: you returned 453, expected 3. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example14` — Filtering 3: Towns with greater than 150,000 people or in Oregon

**Solution:**
```sql
SELECT town, state, population_2020_census 
  FROM pnw_towns 
 WHERE population_2020_census > 150000
    OR state = 'Oregon';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census FROM pnw_towns WH` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census FROM pnw_townsx W` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census FROM pnw_towns W` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, population_2020_census FROM pnw_towns;` | fail | warn | ✓ | Too many rows: you returned 453, expected 246. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example15` — Filtering 4: Counties established after 1920 with a population greater than 100,000

**Solution:**
```sql
SELECT county, state, year_established, population_2022
  FROM pnw_counties
 WHERE year_established > 1920
   AND population_2022 > 100000;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, state, year_established, population_2022 FROM` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, state, year_established, population_2022 FROM` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, state, year_established, population_2022 FRO` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-where**<br>`SELECT county, state, year_established, population_2022 FROM` | fail | warn | ✓ | Your query returned 75 rows but the expected answer has 0 — your WHERE condition probably needs to be stricter. |

#### `example16` — Filtering 5: Counties established after 1880 with a population greater than 100,000

**Solution:**
```sql
SELECT county, state, year_established, population_2022
  FROM pnw_counties
 WHERE year_established > 1880
   AND population_2022 > 100000;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, state, year_established, population_2022 FROM` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, state, year_established, population_2022 FROM` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, state, year_established, population_2022 FRO` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-where**<br>`SELECT county, state, year_established, population_2022 FROM` | fail | warn | ✓ | Too many rows: you returned 75, expected 4. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example17` — Filtering 6: Towns with a land area between 12 and 15 square miles

**Solution:**
```sql
SELECT town, state, land_area_sq_mi
  FROM pnw_towns
 WHERE land_area_sq_mi >= 12
   AND land_area_sq_mi <= 15;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, land_area_sq_mi FROM pnw_towns WHERE lan` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, land_area_sq_mi FROM pnw_townsx WHERE la` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, land_area_sq_mi FROM pnw_towns WHERE la` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, land_area_sq_mi FROM pnw_towns;` | fail | warn | ✓ | Too many rows: you returned 453, expected 8. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example18` — Filtering 7: Towns with a land area between 10 and 15 square miles (simplified)

**Solution:**
```sql
SELECT town, state, land_area_sq_mi
  FROM pnw_towns
 WHERE land_area_sq_mi BETWEEN 12 AND 15;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, land_area_sq_mi FROM pnw_towns WHERE lan` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, land_area_sq_mi FROM pnw_townsx WHERE la` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, land_area_sq_mi FROM pnw_towns WHERE la` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state, land_area_sq_mi FROM pnw_towns;` | fail | warn | ✓ | Too many rows: you returned 453, expected 8. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example19` — Filtering 8: Counties in Washington established between 1890 and 1900 or counties in Oregon with a population greater than 300,000 in 2022

**Solution:**
```sql
SELECT county, state, year_established, population_2022
  FROM pnw_counties
 WHERE (state = 'Washington' AND year_established BETWEEN 1890 AND 1900)
    OR (state = 'Oregon' AND population_2022 > 300000);
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, state, year_established, population_2022 FROM` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, state, year_established, population_2022 FROM` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, state, year_established, population_2022 FRO` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-where**<br>`SELECT county, state, year_established, population_2022 FROM` | fail | warn | ✓ | Too many rows: you returned 75, expected 7. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example20` — Filtering 9: Counties that start with the letter "K":

**Solution:**
```sql
SELECT county, state
  FROM pnw_counties
 WHERE county LIKE 'K%';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, state FROM pnw_counties WHERE county LIKE 'K%` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, state FROM pnw_countiesx WHERE county LIKE 'K` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, state FROM pnw_counties WHERE county LIKE 'K` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-where**<br>`SELECT county, state FROM pnw_counties;` | fail | warn | ✓ | Too many rows: you returned 75, expected 5. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example21` — Filtering 10: Towns that end with the letters "ia":

**Solution:**
```sql
SELECT town, state
  FROM pnw_towns
 WHERE town LIKE '%ia';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state FROM pnw_towns WHERE town LIKE '%ia';` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state FROM pnw_townsx WHERE town LIKE '%ia';` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state FROM pnw_towns WHERE town LIKE '%ia';` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state FROM pnw_towns;` | fail | warn | ✓ | Too many rows: you returned 453, expected 4. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example22` — Filtering 11: Towns that contain the phrase "mount":

**Solution:**
```sql
SELECT town, state
  FROM pnw_towns
 WHERE town LIKE '%mount%';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state FROM pnw_towns WHERE town LIKE '%mount%';` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state FROM pnw_townsx WHERE town LIKE '%mount%'` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state FROM pnw_towns WHERE town LIKE '%mount%'` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-where**<br>`SELECT town, state FROM pnw_towns;` | fail | warn | ✓ | Too many rows: you returned 453, expected 3. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example23` — Filtering 12: Counties with specific pattern in third and fourth position ("ar")

**Solution:**
```sql
SELECT county
  FROM pnw_counties
 WHERE county LIKE '__ar%';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county FROM pnw_counties WHERE county LIKE '__ar%';` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county FROM pnw_countiesx WHERE county LIKE '__ar%';` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx FROM pnw_counties WHERE county LIKE '__ar%';` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-where**<br>`SELECT county FROM pnw_counties;` | fail | warn | ✓ | Too many rows: you returned 75, expected 1. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example24` — Filtering 13: Towns that are in Multnomah or Spokane counties

**Solution:**
```sql
SELECT * 
  FROM pnw_towns 
 WHERE primary_county IN ('Multnomah', 'Spokane');
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT * FROM pnw_towns WHERE primary_county IN ('Multnomah'` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT * FROM pnw_townsx WHERE primary_county IN ('Multnomah` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **missing-where**<br>`SELECT * FROM pnw_towns;` | fail | warn | ✓ | Too many rows: you returned 453, expected 15. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

#### `example25` — Filtering 14: Towns with missing values for secondary county

**Solution:**
```sql
SELECT * 
 FROM pnw_towns 
WHERE secondary_county IS NULL;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT * FROM pnw_towns WHERE secondary_county IS NULL;` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT * FROM pnw_townsx WHERE secondary_county IS NULL;` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **missing-where**<br>`SELECT * FROM pnw_towns;` | fail | warn | ✓ | Slightly too many rows: you returned 453, expected 439. Check whether your filter excludes the boundary (e.g., `>` vs `>=`). |

#### `example26` — Filtering 15: Towns without missing values for secondary county

**Solution:**
```sql
SELECT * 
 FROM pnw_towns 
WHERE secondary_county IS NOT NULL;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT * FROM pnw_towns WHERE secondary_county IS NOT NULL;` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT * FROM pnw_townsx WHERE secondary_county IS NOT NULL;` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **missing-where**<br>`SELECT * FROM pnw_towns;` | fail | warn | ✓ | Too many rows: you returned 453, expected 14. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

### Aggregating Techniques  `/examples/aggregating-techniques`

#### `example27` — Aggregating 1: Average population across all towns in Washington

**Solution:**
```sql
SELECT AVG(population_2020_census) AS avg_population
  FROM pnw_towns
 WHERE state = 'Washington';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT AVG(population_2020_census) AS avg_population FROM pn` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT AVG(population_2020_census) AS avg_population FROM pn` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **missing-where**<br>`SELECT AVG(population_2020_census) AS avg_population FROM pn` | fail | warn | ✓ | Expected a row like [23543.04245283019], but you have [17617.69536423841]. Column "avg_population" differs (expected 23543.04245283019, got 17617.69536423841). |

#### `example28` — Aggregating 2: Total population across all towns in Oregon

**Solution:**
```sql
SELECT SUM(population_2020_census) AS total_population
  FROM pnw_towns
 WHERE state = 'Oregon';
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT SUM(population_2020_census) AS total_population FROM ` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT SUM(population_2020_census) AS total_population FROM ` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **missing-where**<br>`SELECT SUM(population_2020_census) AS total_population FROM ` | fail | warn | ✓ | Expected a row like [2989691], but you have [7980816]. Column "total_population" differs (expected 2989691, got 7980816). |

#### `example29` — Aggregating 3: Minimum population across all towns

**Solution:**
```sql
SELECT MIN(population_2020_census) AS min_population
  FROM pnw_towns;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT MIN(population_2020_census) AS min_population FROM pn` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT MIN(population_2020_census) AS min_population FROM pn` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |

#### `example30` — Aggregating 4: Maximum population across all towns

**Solution:**
```sql
SELECT MAX(population_2020_census) AS max_population
  FROM pnw_towns;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT MAX(population_2020_census) AS max_population FROM pn` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT MAX(population_2020_census) AS max_population FROM pn` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |

#### `example31` — Aggregating 5: Total number of towns

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

#### `example32` — Aggregating 6: First town alphabetically

**Solution:**
```sql
SELECT MIN(town) AS first_town
  FROM pnw_towns;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT MIN(town) AS first_town FROM pnw_towns;` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT MIN(town) AS first_town FROM pnw_townsx;` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |

#### `example33` — Aggregating 7: Last county alphabetically

**Solution:**
```sql
SELECT MAX(county) AS last_county
  FROM pnw_counties;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT MAX(county) AS last_county FROM pnw_counties;` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT MAX(county) AS last_county FROM pnw_countiesx;` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |

#### `example34a` — Aggregating 8: Rounded average land areas

**Solution:**
```sql
SELECT town, ROUND(land_area_sq_mi, 2) AS rounded_area
    FROM pnw_towns;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, ROUND(land_area_sq_mi, 2) AS rounded_area FROM ` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, ROUND(land_area_sq_mi, 2) AS rounded_area FROM ` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, ROUND(land_area_sq_mi, 2) AS rounded_area FROM` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |

#### `example34b` — example34b

**Solution:**
```sql
SELECT town, ROUND(land_area_sq_mi, 0) AS rounded_area
    FROM pnw_towns;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, ROUND(land_area_sq_mi, 0) AS rounded_area FROM ` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, ROUND(land_area_sq_mi, 0) AS rounded_area FROM ` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, ROUND(land_area_sq_mi, 0) AS rounded_area FROM` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |

### Sorting and Grouping Techniques  `/examples/sorting-and-grouping-techniques`

#### `example35` — Sorting 1: Sorting towns by 2020 census population

**Solution:**
```sql
SELECT town, population_2020_census
  FROM pnw_towns
 ORDER BY population_2020_census;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, population_2020_census FROM pnw_towns ORDER BY ` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, population_2020_census FROM pnw_townsx ORDER BY` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, population_2020_census FROM pnw_towns ORDER BY` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-orderby**<br>`SELECT town, population_2020_census FROM pnw_towns;` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example36a` — Sorting 2: Sorting towns by 2020 census population in ascending and descending order

**Solution:**
```sql
SELECT town, population_2020_census
  FROM pnw_towns
ORDER BY population_2020_census ASC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, population_2020_census FROM pnw_towns ORDER BY ` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, population_2020_census FROM pnw_townsx ORDER BY` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, population_2020_census FROM pnw_towns ORDER BY` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-orderby**<br>`SELECT town, population_2020_census FROM pnw_towns;` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example36b` — example36b

**Solution:**
```sql
SELECT town, population_2020_census
  FROM pnw_towns
 ORDER BY population_2020_census DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, population_2020_census FROM pnw_towns ORDER BY ` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, population_2020_census FROM pnw_townsx ORDER BY` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, population_2020_census FROM pnw_towns ORDER BY` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-orderby**<br>`SELECT town, population_2020_census FROM pnw_towns;` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example37` — Sorting 3: Sorting counties by state and population in 2022

**Solution:**
```sql
SELECT county, state, population_2022
  FROM pnw_counties
 ORDER BY state, population_2022 DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT county, state, population_2022 FROM pnw_counties ORDE` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT county, state, population_2022 FROM pnw_countiesx ORD` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT countyx, state, population_2022 FROM pnw_counties ORD` | error | error | ✓ | There's no column named "countyx". Did you mean `county`? |
| **missing-orderby**<br>`SELECT county, state, population_2022 FROM pnw_counties;` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example38` — Grouping 1: Grouping towns by state

**Solution:**
```sql
SELECT state, COUNT(*) AS total_towns
  FROM pnw_towns
 GROUP BY state;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT state, COUNT(*) AS total_towns FROM pnw_towns GROUP B` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT state, COUNT(*) AS total_towns FROM pnw_townsx GROUP ` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT statex, COUNT(*) AS total_towns FROM pnw_towns GROUP ` | error | error | ✓ | There's no column named "statex". Did you mean `state`? |

#### `example39` — Grouping 2: Grouping and ordering counties by state and average population

**Solution:**
```sql
SELECT state, AVG(population_2022) AS avg_population
  FROM pnw_counties
 GROUP BY state
 ORDER BY avg_population DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT state, AVG(population_2022) AS avg_population FROM pn` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT state, AVG(population_2022) AS avg_population FROM pn` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT statex, AVG(population_2022) AS avg_population FROM p` | error | error | ✓ | There's no column named "statex". Did you mean `state`? |
| **missing-orderby**<br>`SELECT state, AVG(population_2022) AS avg_population FROM pn` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example40b` — example40b

**Solution:**
```sql
SELECT primary_county, state, COUNT(*) AS total_towns
  FROM pnw_towns
 GROUP BY primary_county
HAVING COUNT(*) > 10;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT primary_county, state, COUNT(*) AS total_towns FROM p` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT primary_county, state, COUNT(*) AS total_towns FROM p` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT primary_countyx, state, COUNT(*) AS total_towns FROM ` | error | error | ✓ | There's no column named "primary_countyx". Did you mean `primary_county`? |

### Transforming Techniques  `/examples/transforming-techniques`

#### `example41` — Transforming 1: Classifying towns by population size using CASE WHEN

**Solution:**
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

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, population_2010_census, CASE WHEN population_20` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, population_2010_census, CASE WHEN population_20` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, population_2010_census, CASE WHEN population_2` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-orderby**<br>`SELECT town, population_2010_census, CASE WHEN population_20` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example42` — Transforming 2: Percentage increase in population from 2010 to 2020

**Solution:**
```sql
SELECT town, state, (population_2020_census - population_2010_census) / population_2010_census * 100 AS pct_change
  FROM pnw_towns
  ORDER BY pct_change DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, (population_2020_census - population_201` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, (population_2020_census - population_201` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, (population_2020_census - population_20` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-orderby**<br>`SELECT town, state, (population_2020_census - population_201` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

#### `example43` — Transforming 3: Population density

**Solution:**
```sql
SELECT town, state, population_2020_census / land_area_sq_mi AS pop_density
  FROM pnw_towns
 ORDER BY pop_density DESC;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT town, state, population_2020_census / land_area_sq_mi` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT town, state, population_2020_census / land_area_sq_mi` | error | error | ✓ | There's no table named "pnw_townsx". Did you mean `pnw_towns`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT townx, state, population_2020_census / land_area_sq_m` | error | error | ✓ | There's no column named "townx". Did you mean `town`? |
| **missing-orderby**<br>`SELECT town, state, population_2020_census / land_area_sq_mi` | fail | warn | ✓ | Values are right, but the rows are in the wrong order. Add or adjust your ORDER BY clause to match the expected ordering. |

### Joining Techniques  `/examples/joining-techniques`

#### `example44` — Joining 1: Get population of each county seat

**Solution:**
```sql
SELECT c.county, c.county_seat, t.population_2020_census
  FROM pnw_counties AS c
 INNER JOIN pnw_towns AS t ON c.county_seat = t.town;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT c.county, c.county_seat, t.population_2020_census FRO` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT c.county, c.county_seat, t.population_2020_census FRO` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT c.countyx, c.county_seat, t.population_2020_census FR` | error | error | ✓ | There's no column named "countyx" in table `c`. Did you mean `county`? |

#### `example45` — Joining 2: Show ALL counties, even those whose seat isn't in our towns data

**Solution:**
```sql
SELECT c.county, c.county_seat, t.population_2020_census
  FROM pnw_counties AS c
  LEFT JOIN pnw_towns AS t ON c.county_seat = t.town;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT c.county, c.county_seat, t.population_2020_census FRO` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT c.county, c.county_seat, t.population_2020_census FRO` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT c.countyx, c.county_seat, t.population_2020_census FR` | error | error | ✓ | There's no column named "countyx" in table `c`. Did you mean `county`? |

#### `example47` — Joining 3: Find counties that don't have any towns listed

**Solution:**
```sql
SELECT c.county
 FROM pnw_counties AS c
LEFT JOIN pnw_towns AS t ON c.county = t.primary_county
WHERE t.town IS NULL;
```

| Pattern | Expected | Actual | Match | Message |
|---|---|---|---|---|
| **correct**<br>`SELECT c.county FROM pnw_counties AS c LEFT JOIN pnw_towns A` | ok | ok | ✓ | ✓ Your query matches the expected result. |
| **empty**<br>`(empty)` | fail | warn | ✓ | Your query didn't return any columns — make sure it's a SELECT statement. |
| **typo-table**<br>`SELECT c.county FROM pnw_countiesx AS c LEFT JOIN pnw_towns ` | error | error | ✓ | There's no table named "pnw_countiesx". Did you mean `pnw_counties`? Available tables: `fips`, `pnw_counties`, `pnw_towns`. |
| **typo-column**<br>`SELECT c.countyx FROM pnw_counties AS c LEFT JOIN pnw_towns ` | error | error | ✓ | There's no column named "countyx" in table `c`. Did you mean `county`? |
| **missing-where**<br>`SELECT c.county FROM pnw_counties AS c LEFT JOIN pnw_towns A` | fail | warn | ✓ | Too many rows: you returned 514, expected 2. You may be missing a WHERE clause, joining without the right ON condition, or forgetting GROUP BY. |

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
