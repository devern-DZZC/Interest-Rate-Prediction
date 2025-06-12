# Loan Interest Rate Prediction
This notebook utilizes Python and key libraries (Pandas, NumPy, scikit-learn, and Matplotlib) to analyze and predict loan interest rates based on a number of factors such as income level, purpose of the loan, FICO credit score, debt-to-income ratio

## Data
We will be exploring publicly available data from LendingClub.com. Lending Club connects people who need money (borrowers) with people who have money(investors).  
Link to dataset: https://www.kaggle.com/datasets/sahilnbajaj/loans-data

## Importance of Predicting Loan Interest Rates

Predicting loan interest rates is a critical aspect of financial decision-making for both lenders and borrowers. Lenders use interest rates to assess the risk of lending money to individuals, assigning higher rates to those deemed riskier based on factors like credit score, debt-to-income ratio, and income. For borrowers, understanding the factors that affect their interest rates can help them make informed financial decisions, like improving their creditworthiness before applying for a loan.

By building machine learning models to predict loan interest rates, financial institutions can:
- **Improve Risk Assessment**: More accurate predictions of interest rates can help institutions evaluate the likelihood of loan defaults, leading to better lending decisions.
- **Personalize Loan Offers**: With predictive models, lenders can offer more personalized interest rates to customers, improving customer satisfaction and competitiveness in the market.
- **Enhance Operational Efficiency**: Automation of the interest rate prediction process can reduce manual work, speeding up loan approval times and improving operational efficiency.

For borrowers, these models provide transparency into the loan approval process, helping them understand how their financial profile affects the interest rates they receive and what actions they can take to secure more favorable terms.



## Data Dictionary:
- **credit.policy**: 1 if the customer meets the credit underwriting criteria of LendingClub.com, and 0 otherwise.
- **purpose**: The purpose of the loan (values: "credit_card", "debt_consolidation", "educational", "major_purchase", "small_business", "all_other").
- **int.rate**: The interest rate of the loan, as a proportion (e.g., a rate of 11% would be stored as 0.11). Borrowers judged as more risky are assigned higher interest rates.
- **installment**: The monthly installments owed by the borrower if the loan is funded.
- **log.annual.inc**: The natural log of the self-reported annual income of the borrower.
- **dti**: The debt-to-income ratio of the borrower (amount of debt divided by annual income).
- **fico**: The FICO credit score of the borrower.
- **days.with.cr.line**: The number of days the borrower has had a credit line.
- **revol.bal**: The borrower's revolving balance (amount unpaid at the end of the credit card billing cycle).
- **revol.util**: The borrower's revolving line utilization rate (the amount of the credit line used relative to total credit available).
- **inq.last.6mths**: The borrower's number of inquiries by creditors in the last 6 months.
- **delinq.2yrs**: The number of times the borrower has been 30+ days past due on a payment in the past 2 years.
- **pub.rec**: The borrower's number of derogatory public records (e.g., bankruptcy filings, tax liens, or judgments).

### Target Variable: **Interest Rate**

## Machine Learning Models Used:
- Random Forest
- Linear Regression
- Ridge Regression
- Gradient Boosting
- XG Boost
- CatBoost

### Goal: Mean Absolute Error (MAE) <= 0.01
**Mean absolute error (MAE)** measures the average magnitude of errors in predictions, without considering their direction. It’s in the same units as the target variable. 

**Smaller MAE values are better**  

* **Low MAE (~0.01 or less)**: If MAE is around 0.01, it means that, on average, the model's predictions deviate by 1% from the actual interest rates. This would be considered very good for predicting loan interest rates.
* **Moderate MAE (0.01 - 0.05)**: An MAE in this range would suggest reasonably accurate predictions but could still lead to noticeable deviations, especially for customers at the edge of creditworthiness or for loans with sensitive pricing.
* **High MAE (above 0.05)**: If the MAE exceeds 5%, the predictions may not be accurate enough for business-critical decisions like loan approval or setting interest rates. This level of error could be problematic for practical use in the financial industry.
