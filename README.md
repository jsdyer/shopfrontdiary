# Shopfront Diary

[Open the diary](https://coolcode.ca/shopfrontdiary/)

Search selected food trades, proprietors and neighbouring premises on Halifax’s Upper Water and Barrington streets, or follow a Vancouver confectioner as his directory listings change. Every result opens its printed evidence.

<!-- coolcode:guide -->
Compare Halifax’s 1890–91 and 1899–1900 directories to find the explicit vacancies at 80 and 100–102 Upper Water. On the same street, see both listed occupants at number 54, alongside the earlier 54–56 range. Compare Vancouver in 1901 and 1903 to see John Oben listed at 413 Hastings W in both, alongside different second shop addresses. Each entry links to its source page.
<!-- /coolcode:guide -->

## Scope and method

- Halifax excerpts come from [McAlpine’s 1890–91 directory](https://central.bac-lac.gc.ca/.item/?op=pdf&id=nlc008229) and its [1899–1900 edition](https://central.bac-lac.gc.ca/.item/?op=pdf&id=nlc008238) at Library and Archives Canada. Records link to the PDF page number. They combine street, personal and trade listings. Initials, rounded street-number ranges and expanded trade descriptions help search. Each record keeps its printed address and a source page for checking the transcription.
- Vancouver covers selected listings in 1891, 1896, 1901, 1903, 1906, 1908 and 1909. Read the directory reproductions gathered in [WestEndVancouver’s John Oben research](https://westendvancouver.wordpress.com/biographies-n-z/biographies-o/oben-john-1862-1919/) or explore [Vancouver Public Library’s digitized directories](https://bccd.vpl.ca/). Page references are the printed numbers. Listings for the same firm can give multiple shop addresses. Each has its own row.
- The edition comparison aligns exact address labels within one city. Halifax includes the numbered entries between Duke and Buckingham on Upper Water (PDF pages 485 and 630 respectively). This includes separate occupants at the same number and goods entrances. In 1901 Oben’s entry lists 413 Hastings W and 4 Arcade plus a residence. Only the two business addresses enter the comparison.
- The address history groups exact transcribed addresses within a city. Listings at overlapping number ranges or different locations stay separate. Search a surname to find people across addresses. The choices reflect the pages reviewed and cannot establish a business’s opening or closing date. An explicit “shop unoccupied” entry is an observation for that edition.
- Halifax’s citywide civic renumbering affects modern comparisons. Use the [municipal conversion table](https://www.halifax.ca/sites/default/files/documents/about-the-city/archives/AboutTheCity_MunicipalArchives_SearchToolsCivicAddresses_PDF4.pdf) and check other records before matching buildings.

## Refresh and development

Reviewed rows live in `sources/records.json`. The monthly workflow retrieves the two complete Halifax directory PDFs and seven Vancouver page reproductions and verifies their fingerprints. A changed source requires reviewing its transcription before publication. The date on the site is the last successful retrieval and the editions shown are historical.

Search terms and selections remain in the browser. Run `python3 scripts/refresh.py` to check the originals, `node --test tests/*.test.mjs` and `python3 -m unittest discover -s tests` to check the application, then `python3 scripts/build.py` to build offline. Serve `dist/`. With Playwright installed, `python3 tests/browser_smoke.py` checks navigation and filtering.

<!-- schedule-reliability -->
## Schedule reliability

Public GitHub repositories can have scheduled workflows disabled after 60 days of inactivity. A separate weekly [schedule guard](.github/workflows/schedule-guard.yml) calls GitHub's enable-workflow API for an explicit list of refresh workflows and itself. It can restore workflows disabled for inactivity, preserves manually disabled workflows, and runs independently of collection failures.

This is an interim mitigation, not a scheduling guarantee: GitHub does not document active-workflow renewal as a permanent exemption, and scheduled runs can be delayed or dropped. A scheduler on our own Linux server is the planned independent trigger. The guard does not collect data, create dummy commits, or change source/check timestamps; successful collection and published data freshness still need monitoring.
<!-- /schedule-reliability -->
