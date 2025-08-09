# Housing Search Application

A modern web application for searching rental properties using natural language queries. Built with Next.js + TypeScript frontend and Python FastAPI backend.

## 🏗️ Architecture

- **Frontend**: Next.js 15 + TypeScript + shadcn/ui
- **Backend**: Python FastAPI with natural language processing
- **Styling**: TailwindCSS with Airbnb-inspired design
- **Deployment**: Netlify (frontend) + Python backend

## ✨ Features

- 🔍 **Natural Language Search**: "2 bedrooms in SF under $3k, near BART, cats ok"
- 🏠 **Airbnb-Style Property Cards**: Beautiful property displays with images, prices, ratings
- 🎯 **Smart Filtering**: Automatic parsing of bedrooms, price, location, amenities
- 📱 **Responsive Design**: Works perfectly on all devices
- 🚀 **Feature Requests**: Users can request new filters and functionality
- 🐍 **Python Backend**: FastAPI backend ready for Claude API integration

## 🚀 Quick Start

### Option 1: Use the startup script (Recommended)

**Linux/Mac:**
```bash
./start-dev.sh
```

**Windows:**
```bash
start-dev.bat
```

This will automatically start both the Python backend and Next.js frontend.

### Option 2: Manual setup

**1. Start the Python Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**2. Start the Frontend**
```bash
# In a new terminal, from the project root
bun install
bun run dev
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📊 Mock Data

The application includes 6 realistic Bay Area properties with:
- Various bedroom counts (studio to 3BR)
- Price range $2,200 - $5,200/month
- Different neighborhoods (Mission Bay, SOMA, Oakland, Berkeley, etc.)
- Amenities (Near Transit, Pet Friendly, Furnished, etc.)

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

For production deployment, set your backend URL accordingly.

## 🤖 Claude API Integration

The Python backend is ready for Claude API integration:

1. Install the anthropic package (already in requirements.txt)
2. Set your API key:
   ```bash
   export CLAUDE_API_KEY="your-api-key-here"
   ```
3. Uncomment the Claude integration code in `backend/main.py`

## 📁 Project Structure

```
housing-search-app/
├── src/                          # Next.js frontend
│   ├── app/                      # App router pages
│   ├── components/               # React components
│   │   ├── SearchInterface.tsx   # Natural language search
│   │   ├── PropertyCard.tsx      # Airbnb-style property cards
│   │   ├── SearchResults.tsx     # Results grid display
│   │   └── FeatureRequestDialog.tsx
│   └── data/                     # Mock housing data
├── backend/                      # Python FastAPI backend
│   ├── main.py                   # FastAPI application
│   ├── requirements.txt          # Python dependencies
│   └── README.md                 # Backend documentation
├── start-dev.sh                  # Linux/Mac startup script
├── start-dev.bat                 # Windows startup script
└── README.md                     # This file
```

## 🎨 Design

The application features a clean, modern design inspired by Airbnb:
- Rose accent colors (#f43f5e)
- Professional gray scale
- Smooth hover effects and transitions
- Responsive grid layouts
- Loading states and empty states

## 🚀 Deployment

**Frontend**: Deployed to Netlify at https://same-7vh6svpr20r-latest.netlify.app

**Backend**: Ready for deployment to services like:
- Railway
- Render
- Google Cloud Run
- AWS Lambda (with Mangum)
- Vercel (with Python runtime)

## 🛠️ Technologies

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Python 3.8+, FastAPI, Pydantic, Uvicorn
- **Future Integrations**: Claude API, RentCast API
- **Development**: Bun, ESLint, Biome

## 📝 API Reference

### POST /api/parse-search

Parse natural language search queries.

**Request:**
```json
{
  "query": "2 bedrooms in SF under $3k, near BART, cats ok"
}
```

**Response:**
```json
{
  "query": "2 bedrooms in SF under $3k, near BART, cats ok",
  "filters": {
    "bedrooms": 2,
    "maxPrice": 3000,
    "city": "San Francisco",
    "nearTransit": true,
    "petFriendly": true
  },
  "parsedSuccessfully": true
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own applications!
