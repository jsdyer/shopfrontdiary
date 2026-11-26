"""Render native city examples from the same public snapshots as the interactive tool."""
from html import escape
import json
import re

from search_metadata import add_search_metadata


def load_sources(stage):
    return json.loads((stage / "data/edition.json").read_text())


def case_content(data, city, address):
    attrs = {"city": city, "address": address}
    records = sorted((r for r in data["rows"] if r["city"] == city and r["address"] == address), key=lambda r: r["edition"])
    items = []
    for r in records:
        source = '<a href="' + escape(r["source"], quote=True) + '">' + escape(r["page"]) + '</a>'
        items.append(f'<li><strong>{escape(r["edition"])} · {escape(r["name"])}</strong> · {escape(r["trade"])} · {source}</li>')
    result = "<ul>" + "".join(items) + "</ul>" if items else "<p>This edition contains no transcribed listing for that exact address.</p>"
    return attrs, result + '<p><a href="#history">Explore the address timeline</a> · <a href="#search">Find another street or shop</a></p>'


CASES = [
    ('413-hastings-west', '413 West Hastings Street in Vancouver Directories', 'Follow John Oben’s directory listings at 413 Hastings W. Open the printed pages for the business name, trade and edition year.', 'Vancouver', '413 Hastings W'),
    ('608-granville', '608 Granville Street in Vancouver Directories', 'See who the Vancouver directories recorded at 608 Granville. Compare the entries for John Oben and the Provincial Delicatessen Company.', 'Vancouver', '608 Granville'),
    ('80-upper-water', '80 Upper Water Street in Halifax Directories', 'Compare the named listing and later printed vacancy at historic 80 Upper Water. Open each original directory page and check the Halifax civic-number guide.', 'Halifax', '80 Upper Water'),
]


def publish_pages(stage, template, tool):
    sources = load_sources(stage)
    entries = []
    for slug, title, description, *fields in CASES:
        filename = slug + ".html"
        attributes, evidence = case_content(sources, *fields)
        attributes["use-case"] = slug
        state = " ".join(f'data-{key}="{escape(str(value), quote=True)}"' for key, value in attributes.items())
        page = template.replace("<body ", "<body " + state + " ", 1)
        page = re.sub(r"<title>.*?</title>", lambda _: "<title>" + escape(title) + " · CoolCode</title>", page, count=1)
        page = re.sub(r"(<h1[^>]*>).*?</h1>", lambda m: m[1] + escape(title) + "</h1>", page, count=1, flags=re.S)
        page = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m[1] + escape(description, quote=True), page, count=1)
        example = '<section class="place-evidence" aria-label="Published example"><p>' + escape(description) + '</p>' + evidence + '</section>'
        page = page.replace("<!-- place-example -->", example).replace("<!-- place-links -->", '<a href="./">Open ' + escape(tool["title"]) + '</a>')
        info = {**tool, "title": title, "description": description, "url": tool["url"] + filename}
        (stage / filename).write_text(add_search_metadata(page, info), encoding="utf-8")
        entries.append('<a href="./' + filename + '">' + escape(title) + '</a>')
    home = template.replace("<!-- place-example -->", "").replace("<!-- place-links -->", " ".join(entries))
    (stage / "index.html").write_text(add_search_metadata(home, tool), encoding="utf-8")
