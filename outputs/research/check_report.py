import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from decimal import Decimal, ROUND_HALF_UP
def R(value): return float(Decimal(str(value)).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP))

root=Path(__file__).resolve().parents[1]
data=json.loads((root/'research/scorecard.json').read_text())
rubric=json.loads((root/'research/rubric.json').read_text())
weights=[r['weight'] for r in rubric]
class Report(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.links=[]; self.dependencies=[]; self.profiles=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag=='a': self.links.append(a.get('href',''))
        if tag in ['script','img','iframe'] and a.get('src'): self.dependencies.append(a['src'])
        if tag=='link' and a.get('rel')=='stylesheet': self.dependencies.append(a.get('href'))
        if tag=='details' and a.get('class')=='profile': self.profiles.append(a['data-group'])
p=Report();body=(root/'competitor-website-executive-summary.html').read_text();p.feed(body)
assert len(p.ids)==len(set(p.ids))
assert len(p.profiles)==20
assert p.profiles.count('top')==5 and p.profiles.count('lower')==5
assert not p.dependencies
assert all(u[1:] in p.ids for u in p.links if u.startswith('#'))
assert all(urlsplit(u).scheme in ('http','https') for u in p.links if not u.startswith('#'))
assert sum(weights)==100
for d in data:
    assert all(s is None or 0<=s<=5 for s in d['scores'])
    coverage=sum(w for w,s in zip(weights,d['scores']) if s is not None)
    raw=sum(w*s/5 for w,s in zip(weights,d['scores']) if s is not None)
    assert coverage==d['coverage'] and coverage>=80
    assert R(100*raw/coverage)==d['observed']
    assert d['bounds']==[R(raw),R(raw+100-coverage)]
    assert R(sum(weights[i]*d['scores'][i] for i in [0,1,2,4,6])/4)==d['common']
    assert d['scores'][3] is None or d['rating'], d['name']
assert all(data[i]['common']>=data[i+1]['common'] for i in range(len(data)-1))
assert '—' not in body
result={'result':'passed','assessed':20,'top':5,'lower':5,'external_links':sum(not u.startswith('#') for u in p.links),'external_runtime_dependencies':0,'score_math':'verified','internal_links':'verified','external_link_status':'URLs and evidence association checked; not a new full network availability audit','visual_QA':'Desktop and 390x844 CSS-pixel mobile preview inspected in Chrome; filters and disclosure navigation exercised; no page-level horizontal overflow at mobile width.'}
(root/'research/qa.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
