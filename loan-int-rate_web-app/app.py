import joblib
import pandas as pd

print('Loading...')

model = joblib.load('model/prediction.pkl')
transformer = joblib.load('model/transformer.pkl') 
print('Loaded!')


sample_data = {
    'credit.policy': [1],
    'purpose': ["debt_consolidation"],
    'log.annual.inc': [11.350407],
    'dti': [19.48],
    'fico': [400],
    'days.with.cr.line': [5639.95833],
    'revol.util': [52.1],
    'inq.last.6mths': [1],
    'delinq.2yrs': [0],
    'pub.rec': [0],
    'not.fully.paid': [0] 
}


input_df = pd.DataFrame(sample_data)


transformed_X = transformer.transform(input_df)


pred = model.predict(transformed_X)


print("Prediction:", pred)
