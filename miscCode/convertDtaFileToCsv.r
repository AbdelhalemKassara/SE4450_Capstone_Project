#replace rawData.dta with the path to the .dta file
#to run the code enter Rscript filename.r

#after you run the line below once and everything is installed comment it out. You will need sudo privliges when installing (assuming you are running this on linux)
install.packages("haven")

library(haven)
yourData = read_dta("/Users/abdelkassara/Documents/University/4th year/SE 4450/SE4450_Capstone_Project/miscCode/Democracy Checkup 22_V1.dta")
write.csv(yourData, file = "Democracy Checkup 2022 v1.0.csv")

