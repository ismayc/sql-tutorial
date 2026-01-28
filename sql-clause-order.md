# SQL Query Syntax Order Cheatsheet

## Required Order of Clauses

SQL clauses must appear in this specific order for the query to be valid:

```
SELECT      -- columns to return
FROM        -- table(s) to query
WHERE       -- filter rows before grouping
GROUP BY    -- group rows by column(s)
HAVING      -- filter groups after grouping
ORDER BY    -- sort the results
LIMIT       -- restrict number of rows returned
OFFSET      -- skip a number of rows
```

## Quick Reference

| Order | Clause     | Purpose                          | Required? |
|-------|------------|----------------------------------|-----------|
| 1     | SELECT     | Specify columns to retrieve      | Yes       |
| 2     | FROM       | Specify source table(s)          | Yes*      |
| 3     | WHERE      | Filter rows before grouping      | No        |
| 4     | GROUP BY   | Group rows sharing a value       | No        |
| 5     | HAVING     | Filter groups after aggregation  | No        |
| 6     | ORDER BY   | Sort the result set              | No        |
| 7     | LIMIT      | Limit number of rows returned    | No        |
| 8     | OFFSET     | Skip rows before returning       | No        |

*Some databases allow SELECT without FROM for simple expressions.

## Example Queries

### Basic query
```sql
SELECT name, age
FROM users
WHERE age > 18
ORDER BY name;
```

### With aggregation
```sql
SELECT department, COUNT(*) as employee_count
FROM employees
WHERE status = 'active'
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY employee_count DESC;
```

### With joins
```sql
SELECT o.id, c.name, o.total
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.date > '2024-01-01'
ORDER BY o.date DESC
LIMIT 10;
```

### Full example with all clauses
```sql
SELECT 
    category,
    AVG(price) as avg_price,
    COUNT(*) as product_count
FROM products
WHERE in_stock = true
GROUP BY category
HAVING AVG(price) > 50
ORDER BY avg_price DESC
LIMIT 5
OFFSET 0;
```

## Common Mistakes to Avoid

1. **WHERE after GROUP BY** - WHERE must come before GROUP BY
2. **HAVING without GROUP BY** - HAVING is meant for filtering aggregated groups
3. **Using aliases in WHERE** - Column aliases defined in SELECT cannot be used in WHERE
4. **LIMIT before ORDER BY** - Always sort before limiting, or results are unpredictable

## WHERE vs HAVING

| WHERE                              | HAVING                              |
|------------------------------------|-------------------------------------|
| Filters individual rows            | Filters grouped results             |
| Runs before GROUP BY               | Runs after GROUP BY                 |
| Cannot use aggregate functions     | Can use aggregate functions         |
| Works on raw table data            | Works on aggregated data            |

## Join Syntax Position

Joins are part of the FROM clause and come immediately after it:

```sql
SELECT ...
FROM table1
    JOIN table2 ON table1.id = table2.foreign_id
    LEFT JOIN table3 ON table2.id = table3.other_id
WHERE ...
```

## Subquery Positions

Subqueries can appear in multiple places:

```sql
-- In SELECT (scalar subquery)
SELECT name, (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count
FROM users;

-- In FROM (derived table)
SELECT * 
FROM (SELECT id, name FROM users WHERE active = true) as active_users;

-- In WHERE
SELECT * 
FROM products 
WHERE category_id IN (SELECT id FROM categories WHERE name = 'Electronics');
```