import pandas as pd 
import numpy as np
import os
'''with open("TaggedexpedituresAllCandidates.txt", 'w') as out:
with open("expedituresAllCandidates.txt","r") as f:
    header = f.readline()
	out.write(header)
        snacodeIdx = header.split(',').index('SNACODE')  #get column number of SNA CODE
        pnacodeIdx = header.split(',').index('PNACODE')  #get column number of SNA CODE
        #snacodeIdx = header.split(',').index('CONAME')  #get column number of SNA CODE
        
        for line in f:
            if validSnaCode(line.split(',')[snacodeIdx]):  #check if 
                out.write(line)
'''
#read in as tab delimited, save as txt to avoid comma/csv issues 
data = pd.read_csv("expedituresAllCandidates.txt", sep = '\t', low_memory=False)  

#calculate candidate expenditure by month
#calculate # of staffers paid per month, overall
##create dictionary of category types 
categories = {}
categories.update({"Travel" : ["Air", "Lodging", "Parking", "Ground","Uber","Lyft","Taxi", "Train","Uncategorized Travel"]})
categories.update({"Staff": ["Salary", "Volunteers/Interns", "Health Insurance/Payroll Tax", "Contractors"]})
#categories.update({"Insurance": ["Health Insurance", "General Insurance"]})
#general food = "fast casual or restaurant"
categories.update({"Misc": ["Financial Fees", "Political Fees","Travel Agencies", "Insurance", "Rebate Bonus", "Refund"]})
categories.update({"Food" : ["General Food", "Fast Food", "Catering", "Convenience/Grocery", "Alcohol"]})
categories.update({"Consultants" : ["Legal", "Events", "Outreach", "Financial","Political", "Communication", "Technical"]})
categories.update({"IT": ["General IT", "IT Services", "Website", "Software", "Equipment", "Data", "Telecom"]})
categories.update({"Facilities": ["Office Supplies", "Facilities and Events", "Shipping"]})
categories.update({"Advertising" : ["Marketing", "Grassroots", "Signage", "Digital", "Mailers", "Telemarketers", "Promos/Apparel", "Licensing", "Newspaper", "Media Production"]})
categories.update({"Uncategorized Expense" : ["Uncategorized Expense"]})
categories.update({"Donations" : ["In-Kind Contribution"]})
##moved "Canvassing" to staff under volunteers

#############################KEYWORD TERMS
#Consulting Terms
Legal = "legal, compliance, lexis nexis"
Events = "event, operations, logistic, fundraising, fund raising, valet" #Logistical/Events/Fundraising"
Outreach = "field, outreach, volunteer, gotv, organizing service, grassroots, job listing"
Tech_consulting = "web, online, database, tech, website, data, computer, it consult"
Financial = "accounting, financ"
Political = "political, strategy, political strategy, advance consult, campaign, policy, survey research, strategic, poltical stratgey, research, admin, polling, cmdi, conservativeconnector, targeted victory, camapign consult, crowley, government relation, campain"
Media = "media, communication, advertising, marketing, microtargeting, public relation,press relations, public affairs, interpreting, translation, transcription, singularis"


###IT Terms
IT = "technology"  #
IT_services = "technical support, technical consulting, it support, technical service, network support, it service"
Websites_terms = "hosting, website, web consulting, hosting, server, domain, portal subscription"
Software_terms = "softwa, subscription, basecamp, dropbox, godaddy, subcription, microsoft"   #subscriptions and software/software services 
Equipment_terms = "flash drives, cables, headsets, headphones, computer, microphone, comput"
Data_terms = "data, file storage, online processing, database, voter file"
Telecom_terms = "cell, internet, phone, conference call, teleconferenc, telecom, broadband service, comcast, mobile pho"

#Facilities
##facilities services has office in it 
facilities_services_terms = "venue, rent, audio, music, entertainment, janitorial, flower, storage, moving service, utilies,custodial, floral, sound, security, recycling, cleaning, repair, sanitation, conference services, utilit, delivery, delviery, meeting room, fax, maintenance, meeting, waste, water, decoration, po box, site rental, rent, fice rent, facility rental, room rental, alarm service, booth fee, hardware, portable restrooms, trash, shredding"
office_supplies_terms = "office, ofice, supplie, equipment, printing, cleaning supplies, copier, copies, printer, copying, cork board, folders, furniture, bean bag, labels, paper, pens, toner, ink"
shipping = "shippin, fedex, usps, postage, shipiping, courier, delivery, delviery"

#Advertising
ad_terms = "ad service, advertising, ad expense, ads, advertisement, advertisment, advertising/media, advertisng, direct marketing, promotional, marketing, copywriting, publication, list rent, list service, lists, list purchase, list aquisition"
Licensing_terms = "licensing, license"
Signage_terms = "printing & design, printing and design, banner, bumper stickers, sign, poster, flyer, printing and graphic design, sinage"
digital_ad_terms = "facebook, twitter, advertising - internet, advetising - internet, online advertising, social media develop, online advertising, livestreaming, web service, digital, direct email, e-mail service, e-marketing, google, placed media, online, facebook, social media, voter id targeting/web service, web ad"
media_production_terms = "media, music production, music software, cd production, graphic design, graphics, images, logo design, logos & design, production, web development, website development, photos, photo, video, web design, web production, website"
Promotional_items_terms = "promotional items, ace specialties, sticker, collateral material production, flag, book, cups, blankets, collateral: pens, mugs, decals, hats, flash drives with campaign logo, card printing, merchandise, button, merchant tee, campaign hats, shirts, wrist bands, jackets, pins, lanyards, caps, balloon"
Telemarketing_terms = "automated calls, calling services, call center, paid calls, telemarketing"
Mail = "direct mail, mailings, mail"
PrintAds = "newspaper, print adv, magazine"
Radio = "radio"
#dictionary[key].append("value")  #alternate way to update dictionary value 

###FOOD TERMS 
FF = "donuts, starbucks, wendy's, wendys, chili's, ihop, mcdonalds, mcdonald's, chick-fil-a, chick fil, taco, hardee, kfc, dairy queen, popeye, papa john, krispy kreme, in-n-out, pizza, burger, five guy, caesars, chicken and biscuit, panda express, sonic, church's, carl's jr, auntie anne, bojangl, chipotle, buffalo wild wings, white castle, cook out, zaxby, jack in, qdoba"
Alcohol ="wine, alcohol, liquor, spirits, bevmo, binny's beverage depot, spec's"
catering = "cater, brian dobbin"
convenience_grocery = "mart, convenience, grocery, safeway, target, supermarket, costco, general store, teeter, kroger, wawa, wegman, trader joe, fareway, walgreen, cvs, market, rite aid, whole foods, winn dixie, shoprite, food lion, publix, hyvee, quicktrip, pilot, quiktrip, chevron, exxon, speedway, shell, flying j" 

###Misc
financial_fees = "wire transfer fee, bank fee, merchant fee, filing fee, credit card fee, credit card processing, merchant processing fee, processing fee, service charge, bank service fee, cc transaction fee, loan interest payment, loan fee, card fee, merchant account fee, donation processing fee, service fee, service charge, revshare fee, broker fee, membership fee, services fee, donation processing, check fee, transaction fee"
political_fees = "registration, ballot fee, ballot, acess fee,  ballot acces, delegate registration, ballat access, ballot reg, earmark fee, access fee"
financial_rebate = "rebate"  
inkind = "in-kind, kind contrib, merchant discount, in kind"
#calc number of unique employees by month 
#calc average/total expensed at a time 
#Air ["airfare"]
#recipient_nm  ["airlines"]
#using list of lists to label categories 
#create empty lists to append types to 
Expenditure_Type = [None] * len(data["cand_nm"])  #create 
Category_Type = [None] * len(data["cand_nm"])

#for i in range(len(data["cand_nm"])):
#	Expenditure_Type.append([])  #create lists of lists 
#	Category_Type.append([])

airlines = "southwest, american, delta, jetblue, frontier, spirit, united, virgin, us airways"
####TRAVEL
lodging_terms = "lodging, hotel, motel, housing, airbnb, wynn, doubletree, hyatt, springhill suites, loding, sheraton, hilton, fairfield inn, residence inn, holiday inn, crowne plaza, best western, comfort inn, marriot "
airtravel = "airfare, air travel, air fare, airline, air line, flight, airway, delta, air charter, aviation, virgin america, jetblue, air travel, air charter, baggage, airport, airfaire"
groundtravel = "fuel, gas, rent a car, rent-a-car, car rental, mileage, parking, toll, ez Pass, avis, enterprise rent, hertz, driving services, exxon, oil co, chevron, sunoco, shell, flying j, pilot, citgo, truck rental, bus rental, charter bus"
health_insur = "health insurance, healthcare, humana health, aetna, payroll tax, payroll svc-insur-taxes, amerihealth, blue cross blue shield, insperity, employee benefits"

staff_terms = "payroll, salary, director, staff reimburse, wages, senior advisor, coordinator"
peons = "canvassing, door knockers, volunteer, voluntee, per diem, living stipend, intern stipend, per deim, career fair"   #classified as staff 
contractors = "contract labor, job listing services, staffing, staff time, notary service, voter contact, ems service, emergency service, fire marshall, personnel, cpr training"
unknown = "see memo, credit card payment, unitemized total,unitemize, reimburse"

def travel_label(description, recipient):
	###Travel ?#?#?#?trump - rent?? to himself? 
	for word in airtravel.split(","):
		if word.strip() in str(description).lower():
			return "Air"
			#Expenditure_Type[i] = ("Air")    #add air travel to list 
			#break	
		elif word.strip() in str(recipient).lower():
			return "Air"
			#Expenditure_Type[i] = ("Air")    #add air travel to list 
			#break
	for word in lodging_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Lodging"
			#Expenditure_Type[i] = ("Lodging")    				
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Lodging"
			#Expenditure_Type[i] = ("Lodging")    
	for word in "uber".split(","):
		if word.strip() in str(recipient).lower():
			#Expenditure_Type[i] = ("Uber")    #add train travel to list 
			return "Uber"	
	for word in "lyft".split(","):
		if word.strip() in str(recipient).lower():
			return "Lyft"
			#Expenditure_Type[i] = ("Lyft")    #add train travel to list 
			#break	
	if "food" not in str(description).lower():
		for word in groundtravel.split(","):
			if word.strip() in str(description).lower():
				return "Ground Travel"
				#Expenditure_Type[i] = ("Car")    #add car travel to list 
				#break	
			elif word.strip() in str(recipient).lower():
				return "Ground Travel"
				#Expenditure_Type[i] = ("Car")    #add car travel to list 
				#break			
	for word in "amtrak".split(","):
		if word.strip() in str(recipient).lower():
			return "Train"
			#Expenditure_Type[i] = ("Train")    #add train travel to list 
			#break	
	for word in "dc metro, mta, metropolitan transportation authority".split(","):
		if word.strip() in str(recipient).lower():
			return "Subway"
			#Expenditure_Type[i] = ("Subway")    #add train travel to list 
			#break	
	for word in "cab, taxi".split(","): 
		if word.strip() in str(recipient).lower():
			return "Taxi"
		elif word.strip() in str(description).lower():
			return "Taxi"
			#Expenditure_Type[i] = ("Car Service")    #add train travel to list 
			#break	
	for word in "carey, limo, car service, chauffer services, driving services".split(","): 
		if word.strip() in str(recipient).lower():
			return "Car Service"
			#Expenditure_Type[i] = ("Taxi")    #add train travel to list 
			#break	
	for word in "trav, transportation, ferry".split(","):
		if word.strip() in str(description).lower() and "food" not in str(description).lower():
			return "Uncategorized Travel"

def food_label(description, recipient):
	for word in FF.split(","):
		if word.strip() in str(recipient).lower():
			return "Fast Food"
			#Expenditure_Type[i] = ("Fast Food")    #add fast food
			#break
	for word in Alcohol.split(","):
		if word.strip() in str(recipient).lower():
			return "Alcohol"
			#Expenditure_Type[i] = ("Alcohol")   
			#break	
	for word in catering.split(","):
		if word.strip() in str(recipient).lower():
			return "Catering"
			#Expenditure_Type[i] = ("Catering")   
			#break	
	for word in convenience_grocery.split(","):
		if word.strip() in str(recipient).lower():
			return "Convenience/Grocery"
			#Expenditure_Type[i] = ("Convenience/Grocery") 
			#break	
	return "General Food"

def staff_label(description, recipient):
	##per diem = pay b/c they could not spend any of it 
	for word in staff_terms.split(","):
		if word.strip() in str(description).lower() and "tax" not in str(description).lower():
			return "Salary"
	for word in peons.split(","):
		if word.strip() in str(description).lower() and "tax" not in str(description).lower():
			return "Volunteers/Interns"
	for word in health_insur.split(","):  
		if word.strip() in str(description).lower():
			return "Health Insurance/Payroll Tax"
	for word in contractors.split(","):  
		if word.strip() in str(description).lower():
			return "Contractors"
			#Expenditure_Type[i] = ("Health Insurance/Payroll Tax")    #add staff to list 
			#break
			
def consulting_label(description, recipient):
	for word in Legal.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Legal Consulting"
			#Expenditure_Type[i] = ("Legal Consulting")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Legal Consulting"
			#Expenditure_Type[i] = ("Legal Consulting")    
			#break
	for word in Events.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Events"
			#Expenditure_Type[i] = ("Events")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Events"
			#Expenditure_Type[i] = ("Events")    
			#break	
	for word in Outreach.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Outreach"
			#Expenditure_Type[i] = ("Outreach")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Outreach"
			#Expenditure_Type[i] = ("Outreach")    
			#break	
	for word in Tech_consulting.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Technical"
			#Expenditure_Type[i] = ("Technical")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Technical"
			#Expenditure_Type[i] = ("Technical")    
			#break	
	for word in Financial.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Financial"
			#Expenditure_Type[i] = ("Financial")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Financial"
			#Expenditure_Type[i] = ("Financial")    
			#break	
	for word in Political.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Political"
			#Expenditure_Type[i] = ("Political")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Political"
			#Expenditure_Type[i] = ("Political")    
			#break	
	for word in Media.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Communication"
			#Expenditure_Type[i] = ("Communication")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Communication"
			#Expenditure_Type[i] = ("Communication")    
			#break	

def facilities_label(description, recipient):
	####FACILITIES 
	for word in office_supplies_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Office Supplies"
			#Expenditure_Type[i] = ("Office Supplies")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Office Supplies"
			#Expenditure_Type[i] = ("Office Supplies")    
			#break	
	for word in facilities_services_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Facilities and Events"
			#Expenditure_Type[i] = ("Facilities")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Facilities and Events"
			#Expenditure_Type[i] = ("Facilities")    
			#break
	for word in shipping.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Shipping"
			#Expenditure_Type[i] = ("Facilities")    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Shipping"

def marketing_label(description, recipient): 
	for word in digital_ad_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Digital"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Digital"    
			#break
	for word in Licensing_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Licensing"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Licensing"    
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
	for word in PrintAds.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Print Ads"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Print Ads"    
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
	for word in ad_terms.split(","):
		if word.strip() in str(description).lower():   #check in description
			return "Marketing"    
			#break	
		elif word.strip() in str(recipient).lower():  #check receipient of money
			return "Marketing"    
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
	if "office supplies" not in str(data["disb_desc"][i]).lower() and "payroll" not in str(data["disb_desc"][i]).lower(): 
		TravelLabelValue = travel_label(data["disb_desc"][i],data["recipient_nm"][i])
		if TravelLabelValue is not None: 
			Expenditure_Type[i] = (TravelLabelValue) 
			Category_Type[i] = ("Travel") 
		if TravelLabelValue is not None: 	
			continue  #if anything in travel, skip other categories and go to next entry 	

	#no travel, check food --include meal 
	if ("food" in str(data["disb_desc"][i]).lower()) or ("food" in str(data["recipient_nm"][i]).lower()):
		FoodLabelValue = food_label(data["disb_desc"][i],data["recipient_nm"][i])
		if FoodLabelValue is not None: 
			Expenditure_Type[i] = (FoodLabelValue) 
			Category_Type[i] = ("Food")
		if FoodLabelValue is not None: 
			continue  #if anything in food, skip other categories and jump to next expense
	if ("meal" in str(data["disb_desc"][i]).lower()):
		Expenditure_Type[i] = ("General Food") 
		Category_Type[i] = ("Food")
		continue

	elif "catering" in str(data["disb_desc"][i]).lower() or "catering" in str(data["recipient_nm"][i]).lower():
		FoodLabelValue = food_label(data["disb_desc"][i],data["recipient_nm"][i])
		if FoodLabelValue is not None: 
			Expenditure_Type[i] = (FoodLabelValue)
			Category_Type[i] = ("Food") 
		if FoodLabelValue is not None: 
			continue  #if anything in food, skip other categories and jump to next expense	
	#deal with "Meeting expense" -- most likely food 
	if "meeting expense" in str(data["disb_desc"][i]).lower():
		for word in office_supplies_terms.split(","):
			if word.strip() in str(data["recipient_nm"][i]).lower():   #check in description
				Expenditure_Type[i] = ("Office Supplies")
				Category_Type[i] = ("Facilities")  
				break  #break for loop if matched
		FoodLabelValue = food_label(data["disb_desc"][i],data["recipient_nm"][i])
		if FoodLabelValue is not None: 
			Expenditure_Type[i] = (FoodLabelValue) 
			Category_Type[i] = ("Food")
		if FoodLabelValue is not None: 
			continue 

	StaffLabelValue = staff_label(data["disb_desc"][i],data["recipient_nm"][i])
	if StaffLabelValue is not None: 
		Expenditure_Type[i] = (StaffLabelValue) 
		Category_Type[i] = ("Staff")
	if StaffLabelValue is not None: 
		continue

	###TECHNOLOGY
	########MARKETING -- ad terms = marketing? general? 
	MarketingLabelValue = marketing_label(data["disb_desc"][i],data["recipient_nm"][i])
	if MarketingLabelValue is not None: 
		Expenditure_Type[i] = (MarketingLabelValue) 
		Category_Type[i] = ("Advertising")
	if MarketingLabelValue is not None: 
		continue

	###office supplies
	FacilitiesLabelValue = facilities_label(data["disb_desc"][i],data["recipient_nm"][i])
	if FacilitiesLabelValue is not None: 
		Expenditure_Type[i] = (FacilitiesLabelValue) 
		Category_Type[i] = ("Facilities")
	if FacilitiesLabelValue is not None: 
		continue

	ITLabelValue = IT_label(data["disb_desc"][i],data["recipient_nm"][i])
	if ITLabelValue is not None: 
		Expenditure_Type[i] = (ITLabelValue) 
		Category_Type[i] = ("IT")
	if ITLabelValue is not None: 
		continue

	##Miscallaneous 
	for word in financial_fees.split(","):
		if word.strip() in str(data["disb_desc"][i]).lower():
			Expenditure_Type[i] = ("Finance Fees")    #add train travel to list 
			Category_Type[i] = ("Misc")
			break
	for word in political_fees.split(","):
		if word.strip() in str(data["disb_desc"][i]).lower():
			Expenditure_Type[i] = ("Political Fees")    #add train travel to list 
			Category_Type[i] = ("Misc")
			break
	for word in financial_rebate.split(","):
		if word.strip() in str(data["disb_desc"][i]).lower():
			Expenditure_Type[i] = ("Financial Rebates")    #add train travel to list 
			Category_Type[i] = ("Misc")
			break
		
	#########CONSULTING
	if "consult" in str(data["disb_desc"][i]).lower() or str(data["recipient_nm"][i]).lower():
		ConsultingLabelValue = consulting_label(data["disb_desc"][i],data["recipient_nm"][i])
		if ConsultingLabelValue is not None: 
			Expenditure_Type[i] = (ConsultingLabelValue) 
			Category_Type[i] = ("Consulting")
		if ConsultingLabelValue is not None: 
			continue

	#LOCKTON AFFINITY LLC ???, USI INSURANCE SERVICES LLC, JP West insurance = health insurance?
	for word in "insurance, lockton, insuror".split(","):
		if word.strip() in str(data["disb_desc"][i]).lower() or word.strip() in str(data["recipient_nm"][i]).lower():
			Expenditure_Type[i] = ("Insurance")    #add staff to list 
			Category_Type[i] = ("Misc")
			break
	for word in inkind.split(","):
		if word.strip() in str(data["disb_desc"][i]).lower() or word.strip() in str(data["recipient_nm"][i]).lower():
			Expenditure_Type[i] = ("In-Kind Contribution")
			Category_Type[i] = ("Donations")
		continue
		if word.strip() in str(data["memo_text"][i]).lower():
			Expenditure_Type[i] = ("In-Kind Contribution")
			Category_Type[i] = ("Donations")
		continue
	##uncategorized expenses 		
	for word in unknown.split(","):
		if word.strip() in str(data["recipient_nm"][i]).lower():
			Expenditure_Type[i] = ("Uncategorized Expense")
			Category_Type[i] = ("Uncategorized Expense")
			break
		if word.strip() in str(data["disb_desc"][i]).lower():
			Expenditure_Type[i] = ("Uncategorized Expense")
			Category_Type[i] = ("Uncategorized Expense")
			break
			
for i in range(len(data["cand_nm"])):	
	if "void" in str(data["disb_desc"][i]).lower():
		##if void, check if recipient already labeled.  if labeled, match category 
		for j in range(len(data["cand_nm"])):
			if ((data["recipient_nm"][i] == data["recipient_nm"][j]) and (abs(data["disb_amt"][i]) == abs(data["disb_amt"][j])) and (data["cand_nm"][i] == data["cand_nm"][j])):
				if Expenditure_Type[j] != "":
					Expenditure_Type[i] = Expenditure_Type[j]
					Category_Type[i] = Category_Type[j]
					continue
					
##interpreting services, translation, transcription
#gogoair as internet instead of travel
#include car service with taxi? 
##save to file 
#headers = list(data)  #variable names 
#headers.append("Expenditure_Type")
data["Exp_Type"] = Expenditure_Type  #append column 
data["Exp_Type_Cat"] = Category_Type  #append column 
filename = "TaggedExpenditureData.txt"
data.to_csv(filename,sep = '\t')
#return Expenditure_Type	
os.system('say "DunDunDun Donnne"')