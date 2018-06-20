import csv
import json

csvfile = open('Dataset_sterren.csv', 'r')
jsonfile = open('jsonData.json', 'w')
fieldnames = ["StarID","HIP","HD","HR","Gliese","BayerFlamsteed","ProperName","RA","Dec","Distance","PMRA","PMDec","RV","Magnitude","AbsMagnitude","Spectrum","ColorIndex","X","Y","Z","VX","VY","VZ"]
reader = csv.DictReader(csvfile, fieldnames)
jsonfile.write('[')
del_row = ["HIP","HD","HR","Gliese","BayerFlamsteed","PMRA","PMDec","RV","X","Y","Z","VX","VY","VZ", "RA", "Dec", "ProperName"]
count = 0
datapoints = 10000
d = 0
types = ['S', 'N', 'R', 'M', 'K', 'G', 'F', 'A', 'B', 'O', 'W']

for row in reader:
	if not row["ColorIndex"] or (float(row["ColorIndex"]) > 2) or not row["Spectrum"]:
		continue

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


	row["Time"] = float(row["Distance"]) / 24 / 365.25 / 3600
	row["Gas"] = float(row["Distance"])  / 100 * 6.5
	try:
		row["Spectrum"] = types.index(row["Spectrum"][0]) + 1

	except ValueError:
		continue
	row["Temperature"] = 4600 * ((1 / (0.92 * float(row["ColorIndex"]) + 1.7))
						 + (1 / (0.92 * float(row["ColorIndex"]) + 0.62)))
	json.dump(row, jsonfile)
	jsonfile.write(',\n')

	if count > datapoints:
		break
	count +=1


csvfile.close()
jsonfile.close()

with open('jsonData.json', 'rb+') as file:
	file.seek(-3, 2)
	file.truncate()

with open('jsonData.json', 'a') as file:
	file.write(']')
