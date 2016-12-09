import pandas
import numpy

dataF = pandas.read_csv("TaggedExpenditureData.txt", encoding='utf-8', sep='\t',index_col=0,names=["fullname", "expend", "date","cand_name", "label", "category"], usecols=[2,4,5,10,11,12], header=0)

print(dataF['expend'].sum())

#retrieve all candidate names
candidates = dataF.cand_name.unique()
categories = dataF.category.unique()
labels = dataF.label.unique()
parties = ["Republican Party", "Democratic Party"]

#party lists
democratic = ['Bernie Sanders', "Martin O'Malley", 'Hillary Clinton','Lawrence Lessig', 'Jim Webb' ]
republican = ['Mike Huckabee', 'Chris Christie', 'Ted Cruz', 'Rick Perry', 'Bobby Jindal', 'Scott Walker', 'Rand Paul', 'Jeb Bush', 'Rick Santorum', 'Jim Gilmore', 'Marco Rubio', 'George Pataki', 'Carly Fiorina', 'Donald Trump', 'Lindsey Graham', 'John Kasich', 'Ben Carson']

def main(dataF):
    monthFrame, biweekFrame = timeseriesMaker(dataF)

    monthFrame = monthFrame.reset_index()
    biweekFrame = biweekFrame.reset_index()

    candidateSums(monthFrame)

    #Set datetime index as 'date' column; delete the 'index' column
    monthFrame['date'] = monthFrame['index'].dt.strftime('%d-%b-%y')
    del monthFrame['index']

    biweekFrame['date'] = biweekFrame['index'].dt.strftime('%d-%b-%y')
    del biweekFrame['index']

    #check sum and write to file
    print(monthFrame['expend'].sum())
    print(biweekFrame['expend'].sum())

    writer(monthFrame, 'expend_data_monthly.json')
    writer(biweekFrame, 'expend_data_biweekly.json')

def candidateSums(sumFrame):
    candidateSums = {}

    sumFrame['date'] = pandas.to_datetime(sumFrame['date'])

    for candidate in candidates:
        candFrame = sumFrame.loc[sumFrame['cand_name'] == candidate]
        candidateSums[candidate] = candFrame['expend'].sum()

    for party in parties:
        partyFrame = sumFrame.loc[sumFrame['party'] == party]
        candidateSums[party] = partyFrame['expend'].sum()

    try:
        with open('candidateSums.json', 'w', newline='', encoding="utf-8") as outfile:
            outfile.write(str(candidateSums))

    except Exception as err:
        print(err)

def timeseriesMaker(dataF):
    monthFrame = pandas.DataFrame(columns=['expend', 'cand_name', 'label', 'party'])
    biweekFrame = pandas.DataFrame(columns=['expend', 'cand_name', 'label', 'party'])

    for candidate in candidates:
        #get the rows for the candidate
        candidateFrame = dataF.loc[dataF['cand_name'] == candidate]

        for category in categories:
            categoryFrame = candidateFrame.loc[candidateFrame['category'] == category]

            for label in labels:
                labelFrame = categoryFrame.loc[categoryFrame['label'] == label]

                #sums all values for a particular candidate and date
                labelFrame = labelFrame.groupby(['cand_name', 'label', 'date']).sum()

                labelFrame = labelFrame.reset_index()

                #convert to datetime and reindex by date
                labelFrame['date'] = pandas.to_datetime(labelFrame['date'])
                labelFrame.index = labelFrame['date']

                #resample - 'M' for monthly values; 'W' for weekly
                sumMonthFrame = labelFrame.resample('M', closed='right').sum()
                sumBiweekFrame = labelFrame.resample('W', closed='right').sum()

                sumBiweekFrame = sumBiweekFrame.truncate(before='7/15/2016', after='10/17/2016')

                #labelFrame.truncate(before='01/01/2015', after='12/31/2016')

                sumMonthFrame['cand_name'] = candidate
                sumMonthFrame['label'] = label
                sumMonthFrame['category'] = category

                sumBiweekFrame['cand_name'] = candidate
                sumBiweekFrame['label'] = label
                sumBiweekFrame['category'] = category

                if candidate in republican:
                    sumMonthFrame['party'] = 'Republican Party'
                    sumBiweekFrame['party'] = 'Republican Party'
                elif candidate in democratic:
                    sumMonthFrame['party'] = 'Democratic Party'
                    sumBiweekFrame['party'] = 'Democratic Party'

                #strip rows with NaN expenditures
                sumMonthFrame = sumMonthFrame[sumMonthFrame.expend.notnull()]
                monthFrame = monthFrame.append(sumMonthFrame)

                sumBiweekFrame = sumBiweekFrame[sumBiweekFrame.expend.notnull()]
                biweekFrame = biweekFrame.append(sumBiweekFrame)

    return monthFrame, biweekFrame


def writer(outFrame, fileName):
    #json write option
    outFrame.to_json(fileName, orient='records', date_format='iso')

    #CSV write option
    #outFrame.to_csv('out.csv', sep='\t')

main(dataF)

