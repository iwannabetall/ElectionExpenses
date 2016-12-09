import pandas as pd 
import numpy as np
import os

data = pd.read_csv("TaggedExpenditureData.txt", sep = '\t', low_memory=False)  
Expenditure_Type = []
Category_Type = []

for i in range(len(data["cand_nm"])):	
	Expenditure_Type.append(data["Exp_Type"][i])
	Category_Type.append(data["Exp_Type_Cat"][i])

for i in range(len(data["cand_nm"])):		
	if "void" in str(data["disb_desc"][i]).lower():
		print "found void " + str(i) 
		##if void, check if recipient already labeled.  if labeled, match category 
		for j in range(len(data["cand_nm"])):
			if ((data["recipient_nm"][i] == data["recipient_nm"][j]) and (abs(data["disb_amt"][i]) == abs(data["disb_amt"][j])) and (data["cand_nm"][i] == data["cand_nm"][j])):
				if Expenditure_Type[j] != "":
					print "j " + str(j)
					Expenditure_Type[i] = Expenditure_Type[j]
					Category_Type[i] = Category_Type[j]
					print "void fixed"
					print data["recipient_nm"][i] + " " + str(data["disb_amt"][j])
					continue

filename = "TaggedExpenditureData3.txt"
data.to_csv(filename,sep = '\t')
#return Expenditure_Type	
os.system('say "DunDunDun Donnne"')