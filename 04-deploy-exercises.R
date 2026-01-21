library(rsconnect)

setAccountInfo(name='chester-ismay', 
               token='D64F6CEF6D7A9DAD96DF2910B42AB145', 
               secret='M5BiWXGPGKVPbcP1HywaYWFTOEoi5Tqv+8BSuVfw')

deployApp(appDir = "exercises",
          appName = paste0("pnw-sql-exercises"),
          account = "chester-ismay",
          forceUpdate = TRUE)

for (i in 2:11) {
  deployApp(appDir = "exercises",
            appName = paste0("pnw-sql-exercises", i),
            account = "chester-ismay",
            forceUpdate = TRUE)
}

# For 13th and 14th students
rsconnect::setAccountInfo(name='chesterismay',
                          token='588F1892E3C091B60EE85857E0618BA9',
                          secret='OOV8es6R7RQvCT44gyYBp21MttvjzOpt1y6yTczd')

for (i in 12:13) {
  deployApp(appDir = "exercises",
            appName = paste0("pnw-sql-exercises", i),
            account = "chesterismay",
            forceUpdate = TRUE)
}
