# Shopfront Diary

[Open the diary](https://coolcode.ca/shopfrontdiary/)

Search selected food trades, proprietors and neighbouring premises on Halifax’s Upper Water and Barrington streets, or follow a Vancouver confectioner as his directory listings change. Every result opens its printed evidence.

<!-- coolcode:guide -->
Search “oyster” to find Charlie Aucoin’s Rialto, then open 44–46 Upper Water to see the later directory entry. In Vancouver, 608 Granville links John Oben’s 1906 entry to a 1908 delicatessen listing. An empty edition means the sampled pages have no entry for that address. The Halifax city archive provides a conversion list for comparing historical street numbers with modern ones.
<!-- /coolcode:guide -->

## Scope and method

- Halifax excerpts come from [McAlpine’s 1890–91 directory](https://central.bac-lac.gc.ca/.item/?op=pdf&id=nlc008229) and its [1899–1900 edition](https://central.bac-lac.gc.ca/.item/?op=pdf&id=nlc008238) at Library and Archives Canada. Records link to the PDF page number. They combine street, personal and trade listings. Initials, rounded street-number ranges and expanded trade descriptions help search. Each record keeps its printed address and a source page for checking the transcription.
- Vancouver covers selected listings in 1891, 1896, 1903, 1906, 1908 and 1909. Read the directory reproductions gathered in [WestEndVancouver’s John Oben research](https://westendvancouver.wordpress.com/biographies-n-z/biographies-o/oben-john-1862-1919/) or explore [Vancouver Public Library’s digitized directories](https://bccd.vpl.ca/). Page references are the printed numbers. Listings for the same firm can give multiple shop addresses. Each has its own row.
- The address history groups exact transcribed addresses within a city. Listings at overlapping number ranges or different locations stay separate. Search a surname to find people across addresses. The choices reflect the pages reviewed and cannot establish a business’s opening or closing date. An explicit “shop unoccupied” entry is an observation for that edition.
- Halifax’s citywide civic renumbering affects modern comparisons. Use the [municipal conversion table](https://www.halifax.ca/sites/default/files/documents/about-the-city/archives/AboutTheCity_MunicipalArchives_SearchToolsCivicAddresses_PDF4.pdf) and check other records before matching buildings.

## Refresh and development

Reviewed rows live in `sources/records.json`. The monthly workflow retrieves the two complete Halifax directory PDFs and six Vancouver page reproductions and verifies their fingerprints. A changed source requires reviewing its transcription before publication. The date on the site is the last successful retrieval and the editions shown are historical.

Search terms and selections remain in the browser. Run `python3 scripts/refresh.py` to check the originals, `node --test tests/*.test.mjs` and `python3 -m unittest discover -s tests` to check the application, then `python3 scripts/build.py` to build offline. Serve `dist/`. With Playwright installed, `python3 tests/browser_smoke.py` checks navigation and filtering.
