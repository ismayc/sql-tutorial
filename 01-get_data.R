library(googlesheets4)
library(tidyverse)

# https://docs.google.com/spreadsheets/d/19UkDsTrz0VDZbwdrrC6nQkbbY4GjS4Bc-YTp1lc23o0/edit?usp=sharing

# Get data from Google Sheets
gs4_deauth()  # optional: start with no Google credentials
your_sheet <- "https://docs.google.com/spreadsheets/d/19UkDsTrz0VDZbwdrrC6nQkbbY4GjS4Bc-YTp1lc23o0/edit?usp=sharing"
wa_towns_raw <- read_sheet(your_sheet, sheet = "Washington municipalities")
or_towns_raw <- read_sheet(your_sheet, sheet = "Oregon municipalities")
wa_counties_raw <- read_sheet(your_sheet, sheet = "Washington counties")
or_counties_raw <- read_sheet(your_sheet, sheet = "Oregon counties")

# Get FIPS data
fips <- read_csv("https://raw.githubusercontent.com/kjhealy/fips-codes/master/state_and_county_fips_master.csv")

# Clean data
wa_towns_colnames <- c("name", "type", "county", "population_2024_est", 
                       "population_2020_census", "population_2010_census",
                       "pop_growth", "land_area_sq_mi", "land_area_sq_km")
wa_towns <- wa_towns_raw |> 
  rename_with(~ wa_towns_colnames, .cols = everything()) |> 
  slice(-1) |> 
  select(name, county, population_2020_census, population_2010_census,
         land_area_sq_mi) |> 
  mutate(population_2020_census = as.numeric(population_2020_census),
         population_2010_census = as.numeric(population_2010_census),
         land_area_sq_mi = as.numeric(land_area_sq_mi)) |> 
  mutate(county = str_replace_all(county, "Note 1", "")) |> 
  mutate(county = str_replace_all(county, "\\[", "")) |>
  mutate(county = str_replace_all(county, "\\]", "")) |> 
  mutate(state = "Washington") |> 
  rename(primary_county = county)

or_towns_colnames <- c("rank", "name", "population_2020_census",
                       "population_2010_census", "pop_growth", "area",
                       "county")
or_towns <- or_towns_raw |> 
  mutate(City = str_trim(str_replace_all(City, "†", ""))) |> 
  rename_with(~ or_towns_colnames, .cols = everything()) |> 
  select(name, county, population_2020_census, population_2010_census,
         area) |>
  mutate(land_area_sq_mi = str_extract(area, "^[^\\s]+"),
         land_area_sq_mi = as.numeric(land_area_sq_mi)) |> 
  select(-area) |> 
  separate(county, into = c("primary_county", "secondary_county", 
                            "tertiary_county"), sep = ",") |> 
  mutate(primary_county = str_trim(primary_county),
         secondary_county = str_trim(secondary_county),
         tertiary_county = str_trim(tertiary_county)) |> 
  mutate(state = "Oregon")

pnw_towns <- or_towns |> 
  bind_rows(wa_towns) |> 
  relocate(state, .after = name) |> 
  rename(town = name)
# Create this in SQL instead
# mutate(
#   perc_pop_change = (population_2020_census - population_2010_census) / 
#     population_2010_census)
# Do the same for land_area_sq_km

or_counties_colnames <- c("county", "fips_short", "county_seat", 
                          "year_established", "origin", "etymology",
                          "population_2022", "area")
or_counties <- or_counties_raw |> 
  rename_with(~ or_counties_colnames, .cols = everything()) |> 
  mutate(land_area_sq_mi = str_extract(area, "\\b[0-9,]+") |> 
           str_replace_all(",", "") |> 
           as.numeric()) |>
  select(-area) |> 
  mutate(state = "Oregon", .after = county)
  
wa_counties_colnames <- c("county", "fips_short", "county_seat", 
                          "year_established", "origin", "etymology",
                          "population_2022", "area")
wa_counties <- wa_counties_raw |> 
  rename_with(~ wa_counties_colnames, .cols = everything()) |> 
  mutate(land_area_sq_mi = str_extract(area, "\\b[0-9,]+") |> 
           str_replace_all(",", "") |> 
           as.numeric()) |>
  select(-area) |> 
  mutate(state = "Washington", .after = county)

pnw_counties <- or_counties |> 
  bind_rows(wa_counties) |> 
  mutate(county = str_replace_all(county, " County", ""))

if (!dir.exists("data")) {
  dir.create("data")
}
write_rds(pnw_towns, "data/pnw_towns.rds")
write_rds(pnw_counties, "data/pnw_counties.rds")
write_rds(fips, "data/fips.rds")
