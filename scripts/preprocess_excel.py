"""Regenerate dashboard-data.json from the Excel workbook.
Run: python scripts/preprocess_excel.py
"""
from pathlib import Path
import json
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / 'data' / 'India_Disaster_Management_OGD_Dataset.xlsx'
OUT = ROOT / 'data' / 'dashboard-data.json'

all_df = pd.read_excel(XLSX, sheet_name='All_Disaster_Records')
state_df = pd.read_excel(XLSX, sheet_name='State_Summary')
type_df = pd.read_excel(XLSX, sheet_name='DisasterType_Summary')
year_df = pd.read_excel(XLSX, sheet_name='Yearly_Trend')

def clean_records(df):
    cols = {
        'ID':'id','State':'state','Region':'region','Disaster Type':'type','Year':'year',
        'Number of Events':'events','Deaths':'deaths','Injured':'injured','People Affected':'affected',
        'Homes Destroyed':'homes','Damage (Crore INR)':'damage','South India Focus':'south'
    }
    return df.rename(columns=cols)[list(cols.values())].to_dict('records')

def clean_states(df):
    cols = {'State':'state','Region':'region','South India':'southIndia','Total Events':'events','Total Deaths':'deaths','Total Injured':'injured','Total Affected':'affected','Total Homes Destroyed':'homes','Total Damage (Crore INR)':'damage'}
    return df.rename(columns=cols)[list(cols.values())].to_dict('records')

def clean_types(df):
    cols = {'Disaster Type':'type','Total Incidents (Records)':'records','Total Events':'events','Total Deaths':'deaths','Total Injured':'injured','Total Affected':'affected','Total Damage (Crore INR)':'damage','Avg Damage per Record (Crore INR)':'avgDamage'}
    return df.rename(columns=cols)[list(cols.values())].to_dict('records')

def clean_years(df):
    cols = {'Year':'year','Total Events':'events','Total Deaths':'deaths','Total Injured':'injured','Total Affected':'affected','Total Damage (Crore INR)':'damage','South India Events':'southEvents'}
    return df.rename(columns=cols)[list(cols.values())].to_dict('records')

records = clean_records(all_df)
states = clean_states(state_df)
types = clean_types(type_df)
years = clean_years(year_df)

def total(arr, key): return int(sum(x.get(key,0) or 0 for x in arr))
south_states = [s for s in states if s['southIndia'] == 'Yes']
max_vals = {k:max(s[k] for s in states) for k in ['events','deaths','affected','damage']}
for s in states:
    s['riskScore'] = round(100*(0.25*s['events']/max_vals['events']+0.25*s['deaths']/max_vals['deaths']+0.25*s['affected']/max_vals['affected']+0.25*s['damage']/max_vals['damage']),1)

def group_by(arr, keys, nums):
    d={}
    for r in arr:
        k=tuple(r[x] for x in keys)
        d.setdefault(k,{keys[i]:k[i] for i in range(len(keys))})
        for n in nums: d[k][n]=d[k].get(n,0)+(r.get(n,0) or 0)
    return list(d.values())

payload = {
    'meta': {'project':'India Disaster Management Analytics Frontend','sourceFile':XLSX.name},
    'totals': {
        'india': {'events':total(states,'events'),'deaths':total(states,'deaths'),'injured':total(states,'injured'),'affected':total(states,'affected'),'homes':total(states,'homes'),'damage':total(states,'damage'),'states':len(states),'records':len(records)},
        'southIndia': {'events':total(south_states,'events'),'deaths':total(south_states,'deaths'),'injured':total(south_states,'injured'),'affected':total(south_states,'affected'),'homes':total(south_states,'homes'),'damage':total(south_states,'damage'),'states':len(south_states),'records':len([r for r in records if r['south']=='Yes'])}
    },
    'records': records, 'states': states, 'types': types, 'years': years,
    'southRecords': [r for r in records if r['south']=='Yes'],
    'southByType': group_by([r for r in records if r['south']=='Yes'], ['type'], ['events','deaths','affected','damage','homes']),
    'southByStateType': group_by([r for r in records if r['south']=='Yes'], ['state','type'], ['events','deaths','affected','damage','homes']),
    'topStates': {k: sorted(states,key=lambda x:x[k], reverse=True)[:10] for k in ['damage','deaths','affected','riskScore']},
    'insights': []
}
for key,label in [('events','events'),('deaths','deaths'),('affected','people affected'),('damage','damage cost')]:
    item = sorted(states, key=lambda x:x[key], reverse=True)[0]
    payload['insights'].append({'title':f'Highest {label}', 'text':f"{item['state']} leads by {label} with {item[key]:,}."})
OUT.write_text(json.dumps(payload, indent=2), encoding='utf-8')
print(f'Wrote {OUT}')
