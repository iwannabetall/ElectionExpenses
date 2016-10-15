import pandas as pd 
import numpy as np

#read in as tab delimited, save as txt to avoid comma/csv issues 
data = pd.read_csv("expedituresAllCandidates.txt", sep = '\t')  

#calculate candidate expenditure by month
#calculate # of staffers paid per month, overall
##create dictionary of category types 
categories = {}
categories.update({"Travel" : ["Air", "Lodging", "Parking", "Car","Uber","Lyft","Taxi", "Bus", "Train","Uncategorized"]})
categories.update({"Staff": ["Salary", "External Consultants" ,"Volunteers", "Health Insurance/Payroll Tax"]})
#categories.update({"Insurance": ["Health Insurance", "General Insurance"]})
categories.update({"Misc": ["Bank Fees", "Travel Agencies", "Insurance"]})
categories.update({"Food" : ["General Food", "Fast Food", "Catering", "Convenience/Grocery", "Alcohol"]})
categories.update({"Consultants" : ["Legal", "Events", "Outreach", "Financial","Political", "Communication", "Technical"]})
categories.update({"IT": ["General IT", "IT Services", "Website", "Software", "Equipment", "Data", "Telecom"]})
categories.update({"Facilities": ["Office Supplies", "Facilities"]})
categories.update({"Advertising" : ["Marketing", "Grassroots", "Signage", "Digital", "Mailers", "Telemarketers", "Promos/Apparel", "Licensing", "Newspaper", "Media Production"]})
##moved "Canvassing" to staff under volunteers

#############################KEYWORD TERMS
#Consulting Terms
Legal = "legal, compliance"
Events = "event, operations, logistic, fundraising, fund raising" #Logistical/Events/Fundraising"
Outreach = "field, outreach, volunteer"
Tech_consulting = "web, online, database, website, IT, data, computer"
Financial = "accounting, financial"
Political = "political strategy, campaign, policy, strategic, ballot acces, ballot access, administrative, polling"
Media = "media, communications, advertising, marketing, microtargeting, press relations, public affairs"


###IT Terms
IT = "technology"
IT_services = "technical support, technical consulting, it support"
Websites_terms = "hosting, website, web consulting, hosting, server, domain, portal subscription"
Software_terms = "software"
Equipment_terms = "flash drives, cables, headsets, headphones, computer"
Data_terms = "data, file storage, online processing, database"
Telecom_terms = "cell, internet, phone, conference call, teleconference, telecom"

#Facilities
##facilities services has office in it 
facilities_services_terms = "janitorial, custodial, cleaning service, cleaning, repair, conference services, utilities, delivery, delviery, meeting room, fax, office rent, maintenance, meeting, ofice utilities, office utilities, waste, water, po box"
office_supplies_terms = "office, ofice, supplies, printing, shipping, postage, cleaning supplies, copier, copies, printer, copying, cork board, folders, office equipment, furniture, office sup, office equipment, software, bean bag, labels, paper, pens, toner"

#Advertising
ad_terms = "ad service, advertising, ad expense, ads, advertisement, advertisment, advertising/media, advertisng, advertising- banner, direct marketing, promotional, marketing, copywriting, publication, list rent, list service, lists, list purchase, list aquisition"
Licensing_terms = "licensing, license"
Signage_terms = "printing & design, printing and design, bumper stickers, signs, poster, flyer, printing and graphic design"
digital_ad_terms = "advertising - internet, advetising - internet, online advertising, social media develop, online advertising, livestreaming, web service, digital, direct email, e-mail service, e-marketing, google, placed media, online, facebook, social media, voter id targeting/web service, web ad"
media_production_terms = "media, music production, music software, cd production, graphic design, graphics, images, logo design, logos & design, production, web development, website development, photos, photo, video, web design, web production, website"
Promotional_items_terms = "promotional items, sticker, collateral material production, cups, blankets, ties, collateral: pens, mugs, decals, flash drives with campaign logo, card printing, merchandise, button, merchant tee, campaign hats, shirts, wrist bands, jackets, pins, lanyards, caps"
Telemarketing_terms = "automated calls, calling services, call center, paid calls, telemarketing"
canvassing_terms = "canvassing, door knockers, volunteer"   #classified as staff 
Mail = "direct mail, mailings, mail"
Newspaper = "newspaper"
Radio = "radio"
#dictionary[key].append("value")  #alternate way to update dictionary value 

###FOOD TERMS 
FF = "donuts, starbucks, wendys, chili's, ihop, mcdonalds, mcdonald's, chick-fil-a, chick fil, taco, hardee, kfc, dairy queen, popeye, papa john, krispy kreme, in-n-out, pizza, burger, five guy, caesars, chicken and biscuit, panda express, sonic, church's, carl's jr, auntie anne, bojangl, chipotle, buffalo wild wings, white castle, cook out, zaxby, jack in"
Alcohol ="wine, alcohol, liquor, spirits, bevmo, binny's beverage depot, spec's"
catering = "cater"
convenience_grocery = "mart, convenience, grocery, safeway, target, supermarket, costco, general store, harris teeter, kroger, wawa, wegman, trader joe, fareway, walgreen, cvs, market, rite aid, whole foods, winn dixie, shoprite, food lion, publix, hyvee, quicktrip, pilot, quiktrip, chevron, exxon, speedway, shell, flying j" 

###Misc
fees = "wire transfer fee, bank fee, merchant fee"

#calc number of unique employees by month 
#calc average/total expensed at a time 
#Air ["airfare"]
#recipient_nm  ["airlines"]
#using list of lists to label categories 
#create empty lists to append types to 
Expenditure_Type = []  #create 

for i in range(len(data["cand_nm"])):
	Expenditure_Type.append([])  #create lists of lists 

airlines = "southwest, american, delta, jetblue, frontier, spirit, united, virgin, us airways,"
####TRAVEL
lodging_terms = "lodging, hotel, motel, housing, airbnb, wynn, doubletree, hyatt, springhill suites, sheraton, hilton, fairfield inn, residence inn, holiday inn, crowne plaza, best western, comfort inn, marriot "
airtravel = "airfare, air travel, air fare, airline, air line, airway, delta, air charter, aviation, virgin america, jetblue, air travel, air charter, baggage, airport"
groundtravel = "fuel, gas, rent a car, rent-a-car, car rental, mileage, parking, toll, ez Pass, avis, enterprise, hertz, exxon, oil co, chevron, sunoco, shell, flying j, pilot, citgo"
health_insur = "health insurance, healthcare, humana health, aetna, amerihealth, blue cross blue shield, insperity"

def travel_label(description, recipient):
	###Travel ?#?#?#?trump - rent?? to himself? 
	for word in airtravel.split(","):
		if word.strip() in str(description).lower():
			return "Air"
			#Expenditure_Type[data.index.values[i]].append("Air")    #add air travel to list 
			#break	
		elif word.strip() in str(recipient).lower():
			return "Air"
			#Expenditure_Type[data.index.values[i]].append("Air")    #add air travel to list 
			#break
	for word in lodging_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Lodging"
			#Expenditure_Type[data.index.values[i]].append("Lodging")    				
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Lodging"
			#Expenditure_Type[data.index.values[i]].append("Lodging")    
	for word in "uber".split(","):
		if word.strip() in str(recipient).lower():
			#Expenditure_Type[data.index.values[i]].append("Uber")    #add train travel to list 
			return "Uber"	
	for word in "lyft".split(","):
		if word.strip() in str(recipient).lower():
			return "Lyft"
			#Expenditure_Type[data.index.values[i]].append("Lyft")    #add train travel to list 
			#break	
	if "food" not in str(description).lower():
		for word in groundtravel.split(","):
			if word.strip() in str(description).lower():
				return "Car"
				#Expenditure_Type[data.index.values[i]].append("Car")    #add car travel to list 
				#break	
			elif word.strip() in str(recipient).lower():
				return "Car"
				#Expenditure_Type[data.index.values[i]].append("Car")    #add car travel to list 
				#break			
	for word in "amtrak".split(","):
		if word.strip() in str(recipient).lower():
			return "Train"
			#Expenditure_Type[data.index.values[i]].append("Train")    #add train travel to list 
			#break	
	for word in "dc metro, mta, metropolitan transportation authority".split(","):
		if word.strip() in str(recipient).lower():
			return "Subway"
			#Expenditure_Type[data.index.values[i]].append("Subway")    #add train travel to list 
			#break	
	for word in "cab, taxi".split(","): 
		if word.strip() in str(recipient).lower():
			return "Taxi"
			#Expenditure_Type[data.index.values[i]].append("Car Service")    #add train travel to list 
			#break	
	for word in "carey, limo ".split(","): 
		if word.strip() in str(recipient).lower():
			return "Car Service"
			#Expenditure_Type[data.index.values[i]].append("Taxi")    #add train travel to list 
			#break	
	for word in "travel, transportation":
		if word.strip() in str(description).lower():
			return "Uncategorized"

def food_label(description, recipient):
	for word in FF.split(","):
		if word.strip() in str(recipient).lower():
			return "Fast Food"
			#Expenditure_Type[data.index.values[i]].append("Fast Food")    #add fast food
			#break
	for word in Alcohol.split(","):
		if word.strip() in str(recipient).lower():
			return "Alcohol"
			#Expenditure_Type[data.index.values[i]].append("Alcohol")    #add fast food
			#break	
	for word in catering.split(","):
		if word.strip() in str(recipient).lower():
			return "Catering"
			#Expenditure_Type[data.index.values[i]].append("Catering")    #add fast food
			#break	
	for word in convenience_grocery.split(","):
		if word.strip() in str(recipient).lower():
			return "Convenience/Grocery"
			#Expenditure_Type[data.index.values[i]].append("Convenience/Grocery")    #add fast food
			#break	

def staff_label(description, recipient):
	##per diem = pay b/c they could not spend any of it 
	for word in "payroll, salary, intern stipend, per diem".split(","):
		if word.strip() in str(description).lower() and "tax" not in str(description).lower():
			return "Salary"
	for word in canvassing_terms.split(","):
		if word.strip() in str(description).lower() and "tax" not in str(description).lower():
			return "Volunteers"
	for word in health_insur.split(","):  
		if word.strip() in str(description).lower():
			return "Health Insurance/Payroll Tax"
			#Expenditure_Type[data.index.values[i]].append("Health Insurance/Payroll Tax")    #add staff to list 
			#break
			
def consulting_label(description, recipient):
	for word in Legal.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Legal Consulting"
			#Expenditure_Type[data.index.values[i]].append("Legal Consulting")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Legal Consulting"
			#Expenditure_Type[data.index.values[i]].append("Legal Consulting")    
			#break
	for word in Events.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Events"
			#Expenditure_Type[data.index.values[i]].append("Events")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Events"
			#Expenditure_Type[data.index.values[i]].append("Events")    
			#break	
	for word in Outreach.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Outreach"
			#Expenditure_Type[data.index.values[i]].append("Outreach")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Outreach"
			#Expenditure_Type[data.index.values[i]].append("Outreach")    
			#break	
	for word in Tech_consulting.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Technical"
			#Expenditure_Type[data.index.values[i]].append("Technical")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Technical"
			#Expenditure_Type[data.index.values[i]].append("Technical")    
			#break	
	for word in Financial.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Communication"
			#Expenditure_Type[data.index.values[i]].append("Financial")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Financial"
			#Expenditure_Type[data.index.values[i]].append("Financial")    
			#break	
	for word in Political.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Political"
			#Expenditure_Type[data.index.values[i]].append("Political")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Political"
			#Expenditure_Type[data.index.values[i]].append("Political")    
			#break	
	for word in Media.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Communication"
			#Expenditure_Type[data.index.values[i]].append("Communication")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Communication"
			#Expenditure_Type[data.index.values[i]].append("Communication")    
			#break	

def facilities_label(description, recipient):
	####FACILITIES 
	for word in office_supplies_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Office Supplies"
			#Expenditure_Type[data.index.values[i]].append("Office Supplies")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Office Supplies"
			#Expenditure_Type[data.index.values[i]].append("Office Supplies")    
			#break	
	for word in facilities_services_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Facilities"
			#Expenditure_Type[data.index.values[i]].append("Facilities")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Facilities"
			#Expenditure_Type[data.index.values[i]].append("Facilities")    
			#break

def marketing_label(description, recipient): 
	for word in ad_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Marketing"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Marketing"    
			#break
	for word in Licensing_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Licensing"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Licensing"    
			#break
	for word in digital_ad_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Digital"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Digital"    
			#break
	for word in Promotional_items_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Promos/Apparel"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Promos/Apparel"    
			#break
	for word in Telemarketing_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Telemarketers"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Telemarketers"    
			#break
	for word in Signage_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Signage"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Signage"    
			#break			
	for word in Mail.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Mailers"
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Mailers"    
			#break						
	for word in Newspaper.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Newspaper"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Newspaper"    
			#break	
	for word in Radio.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Radio"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Radio"    
			#break	
	for word in media_production_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Media Production"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Media Production"    
			#break		

def IT_label(description, recipient):	
	for word in IT.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "General IT"   
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "General IT"   
			#break
	for word in IT_services.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "IT Services"  
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "IT Services"   
			#break
	for word in Websites_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Website"   
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Website"   
			#break
	for word in Software_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Software"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Software"    
			#break
	for word in Equipment_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Equipment"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Equipment"    
			#break	
	for word in Data_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Data"  
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Data"    
			#break
	for word in Telecom_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Telecom"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Telecom"    
			#break

### loop thru all words 
for i in range(len(data["cand_nm"])):	
	#key expense areas: travel, payroll, office, payroll 
	##if not office supplies, salary, check for travel
	if "office supplies" not in str(description).lower() and "payroll" not in str(description).lower(): 
		TravelLabelValue = travel_label(data["disb_desc"][i],data["recipient_nm"][i])
		if TravelLabelValue is not None: 
			Expenditure_Type[data.index.values[i]].append(TravelLabelValue) 
		if TravelLabelValue is not None: 	
			continue  #if anything in travel, skip other categories and go to next entry 	

	#no travel, check food 
	if "food" in str(data["disb_desc"][i]).lower() or "food" in str(data["recipient_nm"][i]).lower():
		FoodLabelValue = food_label(data["disb_desc"][i],data["recipient_nm"][i])
		if FoodLabelValue is not None: 
			Expenditure_Type[data.index.values[i]].append(FoodLabelValue) 
		if FoodLabelValue is not None: 
			continue  #if anything in food, skip other categories and jump to next expense
	
	StaffLabelValue = staff_label(data["disb_desc"][i],data["recipient_nm"][i])
	if StaffLabelValue is not None: 
		Expenditure_Type[data.index.values[i]].append(StaffLabelValue) 
	if StaffLabelValue is not None: 
		continue

	###office supplies
	FacilitiesLabelValue = facilities_label(data["disb_desc"][i],data["recipient_nm"][i])
	if FacilitiesLabelValue is not None: 
		Expenditure_Type[data.index.values[i]].append(FacilitiesLabelValue) 
	if FacilitiesLabelValue is not None: 
		continue

	ITLabelValue = IT_label(data["disb_desc"][i],data["recipient_nm"][i])
	if ITLabelValue is not None: 
		Expenditure_Type[data.index.values[i]].append(ITLabelValue) 
	if ITLabelValue is not None: 
		continue
		
	###TECHNOLOGY
	########MARKETING -- ad terms = marketing? general? 
	MarketingLabelValue = marketing_label(data["disb_desc"][i],data["recipient_nm"][i])
	if MarketingLabelValue is not None: 
		Expenditure_Type[data.index.values[i]].append(MarketingLabelValue) 
	if MarketingLabelValue is not None: 
		continue

	#########CONSULTING
	if "consult" in str(description).lower() or str(recipient).lower():
		ConsultingLabelValue = consulting_label(data["disb_desc"][i],data["recipient_nm"][i])
		if ConsultingLabelValue is not None: 
			Expenditure_Type[data.index.values[i]].append(ConsultingLabelValue) 
		if ConsultingLabelValue is not None: 
			continue

	#LOCKTON AFFINITY LLC ???, USI INSURANCE SERVICES LLC, JP West insurance = health insurance?
	if "Health Insurance" not in Expenditure_Type:
		for word in "insurance, lockton, insuror".split(","):
			if word.strip() in str(description).lower() or word in str(recipient).lower():
				Expenditure_Type[data.index.values[i]].append("Insurance")    #add staff to list 
				break

	##Miscallaneous 
		for word in fees.split(","):
			if word.strip() in str(description).lower():
				Expenditure_Type[data.index.values[i]].append("Finance Fees")    #add train travel to list 
				break
'''for word in "expedia, egencia, chambers, orbitz, chambers, hotwire, budget.com".split(","): 
		if word.strip() in str(recipient).lower():
			return "Travel Agency"
'''			
##interpreting services, translation, transcription
#gogoair as internet instead of travel
#travel agencies? expedia, EGENCIA, chambers, hotwire, budget.com, orbitz--> fees? bank fees? 
#include car service with taxi? 
##save to file 
#headers = list(data)  #variable names 
#headers.append("Expenditure_Type")
data["Exp_Type"] = Expenditure_Type  #append column 
filename = "TaggedExpenditureData.txt"
data.to_csv(filename,sep = '\t')
#return Expenditure_Type	