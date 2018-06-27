# This script reads data from a .csv and writes it in a .json
#
# Alwan Rashid (10580204)

import csv
import json

csvfile = open('Dataset_sterren.csv', 'r')
jsonfile = open('jsonData.json', 'w')
fieldnames = ["StarID","HIP","HD","HR","Gliese","BayerFlamsteed","ProperName","RA","Dec","Distance","PMRA","PMDec","RV","Magnitude","AbsMagnitude","Spectrum","ColorIndex","X","Y","Z","VX","VY","VZ"]
reader = csv.DictReader(csvfile, fieldnames)

# for correct output
jsonfile.write('[')

# unwanted rows
del_row = ["HIP","HD","HR","Gliese","BayerFlamsteed","PMRA","PMDec","RV","X","Y","Z","VX","VY","VZ", "RA", "Dec", "ProperName"]

# amount of stars - 2
datapoints = 998
starnumber = 1
types = ['S', 'N', 'R', 'M', 'K', 'G', 'F', 'A', 'B', 'O', 'W']
count = 0

for row in reader:

	# unwanted data
	if not row["ColorIndex"] or (float(row["ColorIndex"]) > 2) or not row["Spectrum"]:
		continue

	# the radar chart can't function properly if the Sun is in the data
	if row["ProperName"] == "Sol":
		continue

	velocity = (float(row["VX"])**2 + float(row["VY"])**2 + float(row["VZ"])**2)**0.5
	
	for kill in del_row:
		del row[kill]

	# 9777.92221 to get km/s
	row["Velocity"] = str(velocity * 9777.92221)
	if float(row["Distance"]) >= 1000:
		continue

	# Distance in kilometers instead of parsec
	row["Distance"] = float(row["Distance"]) * 3.08567758 * 10 ** 13

	# To make life easier (StarID was an arbitrary number)
	row["StarID"] = starnumber
	starnumber+=1

	# to get to km / s
	row["Time"] = float(row["Distance"]) / 24 / 365.25 / 3600

	# to get the amount of gas needed
	row["Gas"] = float(row["Distance"])  / 100 * 6.5
	
	# to get a numerical value for the startype
	try:
		row["Spectrum"] = types.index(row["Spectrum"][0]) + 1

	# if not in types continue
	except ValueError:
		continue

	# calculate temperature
	# https://en.wikipedia.org/wiki/Color_index
	row["Temperature"] = 4600 * ((1 / (0.92 * float(row["ColorIndex"]) + 1.7))
						 + (1 / (0.92 * float(row["ColorIndex"]) + 0.62)))
	json.dump(row, jsonfile)
	jsonfile.write(',\n')

	# stop if too big, transitions won't work properly if this gets too big
	if count > datapoints:
		break
	count +=1


csvfile.close()
jsonfile.close()

# replace the last }, with }]
with open('jsonData.json', 'rb+') as file:
	file.seek(-3, 2)
	file.truncate()

with open('jsonData.json', 'a') as file:
	file.write(']')
