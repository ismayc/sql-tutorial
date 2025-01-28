library(rsconnect)

setAccountInfo(name='chester-ismay', 
               token='D64F6CEF6D7A9DAD96DF2910B42AB145', 
               secret='M5BiWXGPGKVPbcP1HywaYWFTOEoi5Tqv+8BSuVfw')

deployApp(appDir = "exercises",
          appName = paste0("pnw-sql-exercises"),
          account = "chester-ismay")

for (i in 2:9) {
  deployApp(appDir = "exercises",
            appName = paste0("pnw-sql-exercises", i),
            account = "chester-ismay")
}
