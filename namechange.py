import pandas as pd 
import numpy as np
import os

data = pd.read_csv("TaggedExpenditureData.txt", sep = '\t', low_memory=False)  

newname = []
fullname = []
for i in range(len(data["cand_nm"])):	
	##fix candidate names	
	newname.append(data["cand_nm"][i])
	
	if newname[i] == "Clinton, Hillary Rodham":
		newname[i] = "Clinton, Hillary"
	elif newname[i] == "Sanders, Bernard":
		newname[i] = "Sanders, Bernie"
	elif newname[i] == "Carson, Benjamin S.":
		newname[i] = "Carson, Ben"
	elif newname[i] == "Cruz, Rafael Edward 'Ted'":
		newname[i] = "Cruz, Ted"
	elif newname[i] == "Trump, Donald J.":
		newname[i] = "Trump, Donald"
	elif newname[i] == "Kasich, John R.":
		newname[i] = "Kasich, John"
	elif newname[i] == "Webb, James Henry Jr.":
		newname[i] = "Webb, Jim"
	elif newname[i] == "O'Malley, Martin Joseph":
		newname[i] = "O'Malley, Martin"	
	elif newname[i] == "Graham, Lindsey O.":
		newname[i] = "Graham, Lindsey"
	elif newname[i] == "Santorum, Richard J.":
		newname[i] = "Santorum, Rick"
	elif newname[i] == "Christie, Christopher J.":
		newname[i] = "Christie, Chris"
	elif newname[i] == "Gilmore, James S III":
		newname[i] = "Gilmore, Jim"
	elif newname[i] == "Perry, James R.":
		newname[i] = "Perry, Rick"
	elif newname[i] == "Perry, James R. (Rick)":
		newname[i] = "Perry, Rick"		
	elif newname[i] == "Pataki, George E.":
		newname[i] = "Pataki, George"
	fullname.append(newname[i].split(',')[1].strip() + " " + newname[i].split(',')[0].strip())
	

data["FullName"] = fullname
filename = "expedituresAllCandidates.txt"
data.to_csv(filename,sep = '\t')
#return Expenditure_Type	
os.system('say "DunDunDun Donnne"')