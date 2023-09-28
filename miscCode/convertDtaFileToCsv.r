#replace rawData.dta with the path to the .dta file
#to run the code enter Rscript filename.r

#after you run the line below once and everything is installed comment it out. You will need sudo privliges when installing (assuming you are running this on linux)
#install.packages("haven")

library(haven)
yourData = read_dta("/home/tomato/Documents/UniversityGithub/SE4450_Capstone_Project/Data/rawData/2021/CES21_dictionarycoding_public_release_final.dta")
write.csv(yourData, file = "CES21_dictionarycoding_public_release_final.csv")

