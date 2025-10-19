# 🤖 AI Features Documentation

## Overview
This project integrates multiple AI models and systems to provide intelligent financial analysis, stock predictions, and startup recommendations for the AtlasWealth investment platform.

## 🧠 AI Models & Systems

### 1. LSTM Stock Prediction Model
**Location:** `bourse_ai_workflow/test_model.py`

**Purpose:** Predicts next-day closing prices for stocks using historical data patterns.

**Features:**
- **Deep Learning Architecture:** 2-layer LSTM with 64 and 32 hidden units
- **Input Features:** 10 features including OHLCV data, ticker encoding, and cyclical date features
- **Trained Models:** Pre-trained on historical stock data
- **Supported Stocks:** Google (GOOGL), IBM, Microsoft (MSFT), Apple (AAPL)

**API Endpoint:** `/api/predict-stocks`
```typescript
// Returns predictions for all supported stocks
GET /api/predict-stocks
Response: {
  predictions: {
    "GOOGL": 2850.50,
    "IBM": 185.20,
    "MSFT": 425.75,
    "AAPL": 195.40
  }
}
```

### 2. Real-Time Risk Analysis System
**Location:** `src/app/api/risk-analysis/route.ts`

**Purpose:** Combines LSTM predictions with real-time market data to generate comprehensive risk assessments.

**Features:**
- **Historical Analysis:** Analyzes 5-day price patterns, volatility, and trends
- **LSTM Integration:** Incorporates model predictions into risk assessment
- **Real-Time Detection:** Simulates real-time market risk detection
- **Comprehensive Reports:** Generates detailed risk paragraphs with actionable insights

**API Endpoint:** `/api/risk-analysis`
```typescript
// Generates risk analysis for specific stock
POST /api/risk-analysis
Body: {
  ticker: "GOOGL",
  companyName: "Google"
}
Response: {
  ticker: "GOOGL",
  companyName: "Google",
  modelPrediction: 2850.50,
  historicalAnalysis: {
    currentPrice: 485,
    averagePrice: 485,
    volatility: 35,
    trend: "bullish",
    priceRange: "465 - 500"
  },
  riskAssessment: "📊 HISTORICAL ANALYSIS: Google (GOOGL) currently at $485...",
  timestamp: "2025-01-19T10:30:00.000Z"
}
```

### 3. Startup Recommendation Engine
**Location:** `entreprise_ai_workflow/rec.py`

**Purpose:** AI-powered startup recommendations based on investor portfolio and preferences.

**Features:**
- **Portfolio-Based Filtering:** Matches startups to investor's sector and region preferences
- **Financial Scoring:** Analyzes growth, stability, and runway metrics
- **LLM Integration:** Uses Together AI for intelligent analysis and recommendations
- **Quantitative Analysis:** Combines multiple financial ratios for scoring

**API Endpoint:** `/api/startup-recommendations`
```typescript
// Returns top 3 startup recommendations
GET /api/startup-recommendations
Response: {
  recommendations: [
    {
      name: "Cole Group",
      sector: "Fintech",
      country: "US",
      score: 1.092,
      scorePercentage: 109
    },
    // ... 2 more recommendations
  ],
  aiSummary: "Based on the investor profile, the current portfolio..."
}
```

### 4. Search Agent for Real-Time Risk Detection
**Location:** `bourse_ai_workflow/trip.py`

**Purpose:** Real-time web search and analysis for market risk detection.

**Features:**
- **Web Search Integration:** Uses Serper API for real-time market news
- **Content Extraction:** Playwright-based dynamic content scraping
- **LLM Analysis:** Together AI for intelligent content summarization
- **Risk Detection:** Identifies market threats and opportunities

**Dependencies:**
- `together` - AI model integration
- `playwright` - Web scraping
- `requests` - HTTP requests
- `beautifulsoup4` - HTML parsing

## 🎯 Frontend Integration

### Dashboard Integration
**Location:** `src/components/investor/InvestorLanding.tsx`

**AI Features:**
- **Real-time Stock Predictions:** Displays LSTM model predictions
- **AI-Powered Recommendations:** Shows intelligent stock and startup suggestions
- **Risk Assessment Buttons:** Interactive risk analysis for each stock
- **Dynamic Content:** Updates based on AI model outputs

### Bourse Actions Page
**Location:** `src/app/(admin)/bourse-actions/page.tsx`

**AI Features:**
- **Interactive Charts:** Chart.js integration with AI predictions
- **Risk Analysis Integration:** Real-time risk assessment generation
- **Historical Data Visualization:** 5-day price trends with predictions
- **Color-coded Predictions:** Visual distinction between historical and predicted data

### Startup Requests Page
**Location:** `src/app/(admin)/startup-requests/page.tsx`

**AI Features:**
- **AI-Generated Recommendations:** Displays model-recommended startups
- **Compatibility Scoring:** Shows AI compatibility percentages
- **Dynamic Analysis:** Real-time AI summary generation
- **Professional Presentation:** Clean, data-driven interface

## 🔧 Technical Architecture

### Model Pipeline
```
Historical Data → LSTM Model → Price Predictions
     ↓
Real-time Search → Risk Analysis → Comprehensive Assessment
     ↓
Portfolio Data → Recommendation Engine → Startup Suggestions
     ↓
Frontend Integration → User Interface → Actionable Insights
```

### Data Flow
1. **Data Collection:** Historical stock data, real-time market data
2. **Model Processing:** LSTM predictions, risk analysis, recommendations
3. **API Integration:** RESTful endpoints for model outputs
4. **Frontend Display:** React components with real-time updates

### Dependencies
```json
{
  "python": {
    "torch": "LSTM model framework",
    "pandas": "Data processing",
    "numpy": "Numerical computations",
    "together": "LLM integration",
    "playwright": "Web scraping",
    "requests": "HTTP requests"
  },
  "typescript": {
    "react-chartjs-2": "Chart visualization",
    "chart.js": "Chart library",
    "next.js": "React framework"
  }
}
```

## 🚀 Usage Examples

### Getting Stock Predictions
```typescript
const response = await fetch('/api/predict-stocks');
const data = await response.json();
console.log(data.predictions); // { GOOGL: 2850.50, IBM: 185.20, ... }
```

### Generating Risk Analysis
```typescript
const response = await fetch('/api/risk-analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ticker: 'GOOGL', companyName: 'Google' })
});
const analysis = await response.json();
console.log(analysis.riskAssessment); // Comprehensive risk report
```

### Fetching Startup Recommendations
```typescript
const response = await fetch('/api/startup-recommendations');
const data = await response.json();
console.log(data.recommendations); // Top 3 AI-recommended startups
```

## 📊 Performance Metrics

### Model Accuracy
- **LSTM Model:** Trained on historical data with validation
- **Risk Analysis:** Combines multiple data sources for comprehensive assessment
- **Recommendation Engine:** Portfolio-aligned filtering with quantitative scoring

### Response Times
- **Stock Predictions:** ~2-3 seconds
- **Risk Analysis:** ~5-10 seconds
- **Startup Recommendations:** ~3-5 seconds

## 🔒 Security & Privacy

### API Key Management
- **Environment Variables:** All API keys stored securely
- **Server-Side Processing:** Sensitive operations on backend only
- **Error Handling:** Graceful fallbacks for API failures

### Data Protection
- **No Client-Side Keys:** All AI model calls server-side
- **Input Validation:** Sanitized inputs for all endpoints
- **Rate Limiting:** Built-in protection against abuse

## 🛠️ Development & Deployment

### Local Development
```bash
# Install Python dependencies
cd bourse_ai_workflow
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Set environment variables
export TOGETHER_API_KEY="your_key_here"
export SERPER_API_KEY="your_key_here"

# Run development server
npm run dev
```

### Model Training
```bash
# Train LSTM model (if needed)
cd bourse_ai_workflow
python train_model.py

# Test model predictions
python test_model.py
```

## 📈 Future Enhancements

### Planned Features
- **Real-time Data Integration:** Live market data feeds
- **Advanced Risk Models:** Multi-factor risk analysis
- **Portfolio Optimization:** AI-driven asset allocation
- **Sentiment Analysis:** News and social media sentiment integration
- **Custom Model Training:** User-specific model fine-tuning

### Scalability Improvements
- **Model Caching:** Redis-based prediction caching
- **Batch Processing:** Efficient bulk operations
- **API Rate Limiting:** Advanced throttling mechanisms
- **Monitoring:** Real-time model performance tracking

## 🤝 Contributing

### Adding New AI Features
1. Create model in appropriate directory (`bourse_ai_workflow/` or `entreprise_ai_workflow/`)
2. Add API endpoint in `src/app/api/`
3. Integrate frontend component
4. Update this documentation

### Testing AI Models
```bash
# Test stock prediction model
python bourse_ai_workflow/test_model.py

# Test startup recommendation model
python entreprise_ai_workflow/rec.py

# Test risk analysis API
curl -X POST http://localhost:3000/api/risk-analysis \
  -H "Content-Type: application/json" \
  -d '{"ticker":"GOOGL","companyName":"Google"}'
```

## 📞 Support

For AI model issues or questions:
- **Model Performance:** Check console logs for detailed error messages
- **API Endpoints:** Verify environment variables are set correctly
- **Frontend Integration:** Check browser console for client-side errors
- **Data Issues:** Ensure input data format matches model expectations

---

*This documentation covers the AI features integrated into the AtlasWealth platform. For general platform documentation, see the main README.md file.*
