#!/usr/bin/env python
#
# Python skripta, ki pobere vse pdf vozne rede iz spletne strani LPP.
# Uporaba:
# ./lpp_get_pdfs.py
#
# Requirements:
# - BeautifulSoup4
# - urllib3
#
# @author David Rubin
import urllib3
import os
from bs4 import BeautifulSoup

# Base url for the station, you can add a stop and ref url query to find station subpages
iskalnik_base_url = 'http://www.lpp.si/sites/default/files/lpp_vozniredi/iskalnik/'

# Folder for storing downloaded PDFS
pdf_folder = 'pdfs/'

# Connection pool for opening HTTP requests
http = urllib3.PoolManager()

# Store URLs for sites that you haven't found a schedule for
missing_schedules = []


def downloadPDF(station_url):
    """
    Finds the PDF link on the page and downloads it into a folder
    """
    # Makes a GET request to the specified URL
    response = http.request('GET', station_url)

    # Creates a new soup on the response data (HTML returned from the request)
    soup = BeautifulSoup(response.data, 'html.parser')

    # Finds the link tag for the schedule PDF based on:
    # a link tag, with classes btn, btn-success and pdf. The inner text
    # should also be PDF, since there is also a button for 'Navodila'
    link_tag = soup.find('a', attrs={'class': ['btn', 'btn-success', 'pdf']}, string='PDF')
    if link_tag is None:
        missing_schedules.append(station_url)
        return
    filename = link_tag['href'].split('/')[-1]
    r = http.request('GET', '{}{}'.format(iskalnik_base_url, link_tag['href']))
    with open('{}{}'.format(pdf_folder, filename), 'wb') as f:
        f.write(r.data)


def getStationURLs(line_url):
    """
    Grab all the station URLs from HTML for the given line
    """
    # Make a GET request to the given URL
    response = http.request('GET', line_url)

    # Create a new soup based on the response data
    soup = BeautifulSoup(response.data, 'html.parser')

    # Find the links for the stations
    # Links are inside a div with a class lineDir, and have a class called stop
    station_tags = soup.find_all('a', attrs={'class': 'stop'})
    stations_urls = []
    for tag in station_tags:
        stations_urls.append(tag['href'])
    return stations_urls


def getLineURLs():
    """
    Gets all line URLs based on the iskalnik_base_url
    """
    # Make a GET request to the base url
    # It contains a table with all the stations listed
    # It sohuld be noted that each stations has 2 identical links listed,
    # where one is a button and the other one text.
    response = http.request('GET', iskalnik_base_url)

    # Create a soup on the returned data
    soup = BeautifulSoup(response.data, 'html.parser')

    td_tags = soup.find_all('td', attrs={'class': 'no'})
    line_urls = []
    for td in td_tags:
        link_tag = td.find('a')
        span_tag = link_tag.find('span')
        if (span_tag):
            continue
        line_urls.append(link_tag['href'])
    return line_urls


def main():
    """
    Finds all urls for LPP schedule PDFs and downloads them into a folder
    """
    # A variable for figuring out how many pdfs have been downloaded
    station_count = 0

    # Check if the PDF folder exists, otherwise create one
    if not os.path.exists(pdf_folder):
        print('Creating the pdf folder in {}'.format(pdf_folder))
        os.makedirs(pdf_folder)
    
    # Get all the lines based on the iskalnik base url
    print('Grabbing all the bus lines from the web ...')
    lines = getLineURLs()

    print('Downloading PDFs for the stations, please wait.')
    for l, line in enumerate(lines):
        print('Processing bus line {} of {}'.format(l+1, len(lines)))
        # For each line get all the stations for it
        stations = getStationURLs('{}{}'.format(iskalnik_base_url, line))
        station_count += len(stations)
        # Download the PDF file for each station
        for s, station in enumerate(stations):
            # Delete the previous line and print the new info string
            print('{}Downloading schedule for station {} of {}'.format('\x1b[2K', s+1, len(stations)), end="\r")
            downloadPDF('{}{}'.format(iskalnik_base_url, station))
        # Move up one line and delete the contents of it (Replace processing bus line)
        print('\x1b[1A \x1b[2K', end='\r')
    # Print out some details about the scraping
    print('{}Found {} bus lines'.format('\x1b[2K', len(lines)))
    print('{}Downloaded {} schedule PDFs'.format('\x1b[2K', station_count))
    print('You can find the pdfs inside {}'.format(pdf_folder))
    print('Some sites didn\'t have a schedule:')
    for site in missing_schedules:
        print('- {}'.format(site))


if __name__ == '__main__':
    main()