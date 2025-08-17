# 💳 Loan Interest Rate Prediction Web App

A production-ready machine learning web application that predicts **loan interest rates** and provides **transparent, explainable insights** for loan officers.  
Built with modern cloud, ML, and web technologies to demonstrate end-to-end software engineering skills: data science, model deployment, scalable architecture, and a polished user experience.

Deployed Link: https://loan-advisor.azurewebsites.net  
Demo Video: https://www.youtube.com/watch?v=JUUbiYQo2aI

---

## 🚀 Features

- **Real-time Predictions**  
  Enter borrower details and instantly get a predicted loan interest rate.

- **Bulk Uploads**  
  Upload CSV files of multiple applicants to receive batch predictions at scale.

- **Explainable AI with SHAP**  
  Interactive decision charts highlight which features most influenced each prediction, supporting transparency and compliance.

- **Secure & Scalable**  
  Containerized deployment with Azure services (App Service / Container Registries) to ensure reliability, scalability, and data privacy.

---

## 🖥️ Tech Stack

- **Frontend:** React + Bootstrap (responsive UI for loan officers)  
- **Backend API:** Flask (Python) with Dockerized deployment  
- **ML Model:** Scikit-learn CatBoost / XGBoost 
- **Explainability:** SHAP decision plots & feature importance visualizations  
- **Cloud Infrastructure:** Azure App Service   

---

## 🏗️ System Architecture

```text
[ Frontend UI ] → [ FastAPI Backend ] → [ Prediction Service ]
                               ↘
                                ↘ [ SHAP Insights Service ]
```
                              

## 📊 Example Prediction Workflow

1. Loan officer logs in via secure Azure AD SSO

2. Enters borrower details or uploads CSV with multiple applicants

3. App returns:

   - Predicted interest rate (with confidence interval)

   - SHAP decision chart showing feature contributions



## 📈 Why This Project is Useful

- **Loan Officers**: Get faster, more consistent loan pricing decisions

- **Compliance Teams**: Access full audit trail with explainable ML decisions

- **Applicants**: Benefit from transparency and trust in lending decisions



## 📦 Installation (Developer Setup)

```bash
# Clone repository
git clone https://github.com/devernchattergoon/loan-rate-predictor.git
cd loan-rate-predictor

# Setup Python environment
pip install -r requirements.txt

# Start backend
uvicorn app.main:app --reload

# Start frontend
cd frontend
npm install
npm run dev
```



## 🔮 Future Enhancements

- Counterfactual explanations (“To lower rate by 0.5%, borrower needs FICO ≥ 700”)

- Fairness dashboards to monitor bias across demographic groups

- Real-time drift detection & automatic retraining pipelines

- Mobile-friendly “Quick Predict” mode for officers in the field




## 👤 Author

Devern Chattergoon
3rd Year Computer Science Student, University of the West Indies  
📍 Trinidad & Tobago  
