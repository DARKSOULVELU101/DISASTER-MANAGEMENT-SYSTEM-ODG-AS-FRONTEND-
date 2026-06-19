# India Disaster Management Analytics Dashboard

This is a Power BI-style frontend analytics project built from the uploaded Excel dataset. It is **not a PBIX file**. It is a clean frontend website with Python-preprocessed JSON data and 9 visualization pages.

## Pages Included
1. Executive Overview
2. State Performance
3. Disaster Type Analysis
4. Yearly Trend
5. South India Focus
6. Human Impact
7. Damage & Homes
8. Risk Score Matrix
9. Raw Data Explorer

## How to run in VS Code

### Option 1: VS Code Live Server
1. Open this folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and select **Open with Live Server**.

### Option 2: Python local server
```bash
cd india-disaster-powerbi-frontend
python -m http.server 5500
```
Then open:
```text
http://localhost:5500
```

## Python Integration
The preprocessed dashboard data is already available in:
```text
data/dashboard-data.json
```

To regenerate it from the Excel file:
```bash
pip install -r requirements.txt
python scripts/preprocess_excel.py
```

## Project Structure
```text
index.html
styles.css
app.js
data/dashboard-data.json
data/India_Disaster_Management_OGD_Dataset.xlsx
scripts/preprocess_excel.py
requirements.txt
```

## Notes
- Uses vanilla HTML, CSS, and JavaScript for easy deployment.
- No React build step is required.
- All charts are custom Canvas charts, so the dashboard can run without Chart.js or Power BI Desktop.

## Serii AI Bot
This version includes **Serii**, an AI chat bot fixed at the left-bottom of the dashboard. Serii can answer questions using the loaded dashboard dataset, active filters, KPI totals, state ranking, disaster type summary, yearly trends, and South India focus.

### API note
Serii now uses Puter.js AI, so no API key is stored in this frontend project. It works directly from the browser using the Puter.js script. The user may be asked to allow/sign in to Puter when using AI features.


### Serii with Puter.js
This version uses Puter.js AI instead of Gemini API keys.

Benefits:
- No Gemini/OpenRouter/Groq API key stored in the project
- Works in static frontend hosting such as GitHub Pages
- Serii still uses the local dashboard dataset context for answers

If Serii shows local fallback only, check:
1. Internet connection is available.
2. Browser is not blocking `https://js.puter.com/v2/`.
3. Allow the Puter popup/login if the browser asks.
4. Open DevTools Console to see the exact message.
