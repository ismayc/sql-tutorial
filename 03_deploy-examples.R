library(rsconnect)

setAccountInfo(name='chester-ismay', 
               token='D64F6CEF6D7A9DAD96DF2910B42AB145', 
               secret='M5BiWXGPGKVPbcP1HywaYWFTOEoi5Tqv+8BSuVfw')

deployApp(appDir = ".",
          appFiles = c("examples.Rmd", "renv.lock", "exercises/", "images/"),
          appName = paste0("pnw-sql-examples"),
          account = "chester-ismay",
          forceUpdate = TRUE)

for (i in 2:8) { # Up to 11
  deployApp(appDir = ".",
            appFiles = c("examples.Rmd", "renv.lock", "exercises/", "images/"),
            appName = paste0("pnw-sql-examples", i),
            account = "chester-ismay",
            forceUpdate = TRUE)
}

