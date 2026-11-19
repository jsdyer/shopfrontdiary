"""Verify reviewed source documents before replacing the edition shown by the tool."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from hashlib import sha256
import json
from pathlib import Path
import re
from time import sleep
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "sources"
EDITION = ROOT / "web/data/edition.json"


def retrieve(url):
    for attempt in range(3):
        try:
            with urlopen(Request(url, headers={"User-Agent": "CoolCode source refresh/1.0"}), timeout=90) as response:
                return response.read()
        except OSError:
            if attempt == 2:
                raise
            sleep(2 ** attempt)


def verify(source):
    if sha256(retrieve(source["url"])).hexdigest() != source["sha256"]:
        raise ValueError("A reviewed document changed. Inspect the source and transcription: " + source["url"])


def refresh():
    documents = json.loads((SOURCES / "documents.json").read_text())
    with ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(verify, documents))
    edition = json.loads((SOURCES / "records.json").read_text())
    update(edition)
    edition["retrieved"] = datetime.now(timezone.utc).date().isoformat()
    temp = EDITION.with_suffix(".tmp")
    temp.write_text(json.dumps(edition, ensure_ascii=False, indent=2) + "\n")
    temp.replace(EDITION)
def update(edition):
    rows = edition["rows"]
    if not rows or len(rows) != edition["count"]:
        raise ValueError("Reconcile the count with the reviewed records")

if __name__ == "__main__":
    refresh()
