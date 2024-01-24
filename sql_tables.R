library(DBI)
library(RSQLite)
library(tidyverse)

pnw_counties_df <- as.data.frame(
  read_rds("data/pnw_counties.rds")
)

pnw_towns_df <- as.data.frame(
  read_rds("data/pnw_towns.rds")
)

fips <- as.data.frame(
  read_rds("data/fips.rds")
)

con <- dbConnect(RSQLite::SQLite(), dbname = "pnw_database.sqlite")

dbWriteTable(con, "pnw_counties", pnw_counties)
dbWriteTable(con, "pnw_towns", pnw_towns)
dbWriteTable(con, "fips", fips)

dbListTables(con)
dbDisconnect(con)
