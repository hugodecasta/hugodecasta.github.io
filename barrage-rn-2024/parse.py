import pandas as pd

t1 = pd.read_csv('lg2024t1.csv')

# circos_terminees_t1 = t1[t1['Elu'] == 'OUI']['CodCirElec'].unique()
# t1 = t1[-t1['CodCirElec'].isin(circos_terminees_t1)]
t1 = t1[t1['Elu'] == 'QUALIF T2']

print(t1['Elu'].unique())
print(t1.columns)

circo_data:dict[str,pd.DataFrame] = dict([
    (circo,t1[t1['CodCirElec'] == circo])
    for circo in t1['CodCirElec'].unique()
])

circo_data = dict([
    [circo,df.sort_values(by='NbVoix',ascending=False)]
    for circo,df in circo_data.items() if len(df) == 3
])

circo_data = dict([
    [circo,df]
    for circo,df in circo_data.items() if df.iloc[0]['CodNuaCand'] in ['RN','UXD']
])

for df in circo_data.values():
    df.index = list(range(len(df)))
    df['PT1'] = df.index+1

for c,d in circo_data.items():
    dep = c[:2]
    cir = c[2:]
    print(dep,f'({cir})')
    for _,cd in d.iterrows():
        print('    ',cd['PrenomPsn'],cd['NomPsn'],'-',cd['LibNuaCand'],'::',cd['RapportExprimes'])


final_df = pd.concat(circo_data.values(),ignore_index=True)

partis:pd.Series = final_df['CodNuaCand'].unique()
partis = [p for p in partis if p not in ['RN','UXD']]

for parti in partis:
    total = final_df[final_df['CodNuaCand'] == parti]
    p3 = total[total['PT1'] == 3]
    print(total.iloc[0]['LibNuaCand'],len(p3)/len(total))
    print('\n'.join([
        '     '+cd['CodCirElec']+' :: '+cd['PrenomPsn']+' '+cd['NomPsn'] for cd in p3.iloc
    ]))

final_df.to_json('lg2024data.json',orient='records',index=False)