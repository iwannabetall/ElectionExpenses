import pandas as pd 
import numpy as np

#read in as tab delimited, save as txt to avoid comma/csv issues 
data = pd.read_csv("expedituresAllCandidates.txt", sep = '\t')  

#calculate candidate expenditure by month
#calculate # of staffers paid per month, overall
##create dictionary of category types 
categories = {}
categories.update({"Travel" : ["Air", "Air: Checked Bag Fees", "Lodging", "Uncategorized", "Parking", "Car", "Bus", "Train"]})
categories.update({"Staff": ["Staff", "Consultants" ,"Door Knockers"]})

categories.update({"Office Supplies" : ["Phone"]})
categories.update({"Advertising" : ["Digital", "Mailers", "Telemarketers"]})

categories.update({"Food" : ["Food", "Fast Food"]})
categories.update({"Event" : ["Venue", "Flowers"]})

categories.update({"Consultants" : ["Legal", "Political", "Communications"]})
categories.update({"Technology" : ["Website", "Data/Analytics"]})

#dictionary[key].append("value")  #alternate way to update dictionary value 
Expenditure_Type = []  #create 

#Air ["airfare"]
#recipient_nm  ["airlines"]
#using list of lists to label categories 
#create empty lists to append types to 
for i in range(len(data["cand_nm"])):
	Expenditure_Type.append([])  #create lists of lists 

for i in range(len(data["cand_nm"])):	
#for i in range(1000,2000):
	##Staff 
	for word in "payroll, salary".split(","):
		if word.strip() in str(data["disb_desc"][i]).lower() and "tax" not in str(data["disb_desc"][i]).lower():
			Expenditure_Type[data.index.values[i]].append("Staff")    #add staff to list 
			break	
	###Travel 
	for word in "lodging, hotel, motel, wynn, springhill suites, fairfield inn, residence inn, holiday inn, crowne plaza, best western, comfort inn, marriot ".split(","):
		if word.strip() in str(data["disb_desc"][i]).lower():   #check in description
			Expenditure_Type[data.index.values[i]].append("Lodging")    
			break	
		elif word.strip() in str(data["recipient_nm"][i]).lower():  #check receipient of money
			Expenditure_Type[data.index.values[i]].append("Lodging")    
			break
	for word in "airline, air line, air fare, airfare, airway, virgin america, delta, jetbue, air travel, air charter".split(","):
		if word.strip() in str(data["disb_desc"][i]).lower():
			Expenditure_Type[data.index.values[i]].append("Air")    #add air travel to list 
			break	
		elif word.strip() in str(data["recipient_nm"][i]).lower():
			Expenditure_Type[data.index.values[i]].append("Air")    #add air travel to list 
			break
	for word in "exxon, oil co, sunoco, shell, car rental, carey limo, mileage, gas, rent a car, rent-a-car".split(","):
		if word.strip() in str(data["disb_desc"][i]).lower():
			Expenditure_Type[data.index.values[i]].append("Car")    #add car travel to list 
			break	
		elif word.strip() in str(data["recipient_nm"][i]).lower():
			Expenditure_Type[data.index.values[i]].append("Car")    #add car travel to list 
			break			
	for word in "amtrak".split(","):
		if word.strip() in str(data["disb_desc"][i]).lower():
			Expenditure_Type[data.index.values[i]].append("Train")    #add train travel to list 
			break	

	#####Food		
	for word in "wendys, chili's, ihop, mcdonalds, mcdonald's,applebees, starbucks, in-n-out".split(","):
		if word.strip() in str(data["disb_desc"][i]).lower():
			Expenditure_Type[data.index.values[i]].append("Fast Food")    #add fast food
			break	
		elif word.strip() in str(data["recipient_nm"][i]).lower():
			Expenditure_Type[data.index.values[i]].append("Fast Food")    
			break
	
	