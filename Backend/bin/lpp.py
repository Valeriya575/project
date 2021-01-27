#!/usr/bin/env python
#
# S pomocjo lpp-pdf in lpp-get-pdfs nalozi podatke o LPP prevozih v mongodb podatkovno bazo
#
# Predvideva, da je CWD=RUPS/Backend, v kolikor ni tako ne 
#
# @author David Rubin
import lpp_pdf
import lpp_get_pdfs
import sys
import urllib3
import pymongo
from os import listdir, chdir, getcwd
from pathlib import Path

# Tabula release 1.0.2, for PDF parsing
tabula_url = 'https://github.com/tabulapdf/tabula-java/releases/download/v1.0.2/tabula-1.0.2-jar-with-dependencies.jar'
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def main(args):
    if '-h' in args or len(args) == 0:
        print('A script to invoke data gathering from LPP')
        print('\nUsage:')
        print('  ./lpp.py [options]\n')
        print('Options:')
        print('  -h Show help.')
        print('  -d Download PDFs from LPP.')
        print('  -p Parse pdfs in Backend/pdfs.')
        return
    if '-d' in args:
        lpp_get_pdfs.main()
    if '-p' in args:
        print(getcwd())
        tabula = Path('bin/tabula.jar')
        if not tabula.is_file():
            http = urllib3.PoolManager()
            r = http.request('GET', tabula_url)
            with open('bin/tabula.jar', 'wb') as f:
                f.write(r.data)
        pdfCount = len(listdir('pdfs'))
        # Connect to the db
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client.buslines

        # Ustvari vse postaje na omocju Ljubljane v MongoDB
        print('->Loading all stations from overpass', end="\r")
        lpp_pdf.get_station_locations(db)
        print('{}Stations loaded'.format('\x1b[2K'))

        for p, pdf in enumerate(listdir('pdfs')):
            print('{}->Processing pdf {} of {}'.format('\x1b[2K', p+1, pdfCount), end='\r')
            lpp_pdf.main(['pdfs/'+pdf, 'bin/tabula.jar'], db)
            

if __name__ == '__main__':
    main(sys.argv[1:])