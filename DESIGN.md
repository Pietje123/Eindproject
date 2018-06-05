# DESIGN

Data sources:

http://www.astronexus.com/hyg (versie 2)

Aangepast met converter.py

Technical Components:

	- Scatterplot met logaritmische y-as van de absolute magnitude (AbsMag) en lineaire x-as van de kleurindex (ColorIndex).
	  Als er op een ster wordt geklikt dan wordt er een barchart gemaakt.
	- Een barchart met een deel van de overige data en de x en y coordinaten (AbsMag, Colorindex,Spectrum, Velocity).
	  Titel van de barchart is de naam van de ster als deze bekent is, anders de ID van de ster.
	- Radar chart met de afstand, de hoeveelheid benzine, de tijd en de schijnbare magnitude
	- Select knoppen om de type sterren te selecteren
	- Slider om de afstand tot / vanaf waar te selecteren

Scripts / Functies:

	- Barchart.js met daarin makeBarchart die de assen en 