import csv
import json

csvfile = open('Dataset_sterren.csv', 'r')
jsonfile = open('jsonData.json', 'w')
fieldnames = ["StarID","HIP","HD","HR","Gliese","BayerFlamsteed","ProperName","RA","Dec","Distance","PMRA","PMDec","RV","Mag","AbsMag","Spectrum","ColorIndex","X","Y","Z","VX","VY","VZ"]
reader = csv.DictReader(csvfile, fieldnames)
jsonfile.write('[')
del_row = ["HIP","HD","HR","Gliese","BayerFlamsteed","PMRA","PMDec","RV","X","Y","Z","VX","VY","VZ"]
count = 0
datapoints = 10000
d = 0
for row in reader:
	if not row["ColorIndex"] or (float(row["ColorIndex"]) > 2):
		continue

	velocity = (float(row["VX"])**2 + float(row["VY"])**2 + float(row["VZ"])**2)**0.5
	for kill in del_row:
		del row[kill]
	row["Velocity"] = str(velocity)
	if float(row["Distance"]) == 10000000.0:
		continue


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