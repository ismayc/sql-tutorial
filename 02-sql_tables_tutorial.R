library(DBI)
library(RSQLite)
library(tidyverse)

# Read data from RDS files
pnw_counties_df <- as.data.frame(read_rds("data/pnw_counties.rds"))
pnw_towns_df <- as.data.frame(read_rds("data/pnw_towns.rds"))
fips <- as.data.frame(read_rds("data/fips.rds"))

# Connect to the SQLite database
con <- dbConnect(RSQLite::SQLite(), dbname = "pnw_database.sqlite")

# Remove existing tables if they exist
dbRemoveTable(con, "pnw_counties")
dbRemoveTable(con, "pnw_towns")
dbRemoveTable(con, "fips")

# Write the new data to the database
dbWriteTable(con, "pnw_counties", pnw_counties_df)
dbWriteTable(con, "pnw_towns", pnw_towns_df)
dbWriteTable(con, "fips", fips)

# List tables to confirm
dbListTables(con)

# Disconnect from the database
dbDisconnect(con)
