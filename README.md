# Hermes + Exponify Unified Business Platform

A powerful, unified business intelligence and module management platform that combines Hermes analytics capabilities with Exponify's modular admin system.

## 🚀 Features

### 📊 **Hermes Analytics Dashboard**
- **Real-time Revenue Analytics**: Track revenue, expenses, and profit trends
- **Customer Demographics**: Age and geographic distribution insights
- **Platform Performance**: Multi-platform reach and conversion metrics
- **Sentiment Analysis**: Customer sentiment tracking over time
- **CRM Integration**: Customer relationship management with scoring

### ⚡ **Exponify Admin Dashboard**
- **Module Management**: Enable/disable business modules across 5 phases
- **Phase Roadmap**: Track implementation progress from Foundation to AI OS
- **Benefits Analysis**: CEO and client value propositions
- **Modular Architecture**: Core modules + Phase 1-5 expansion modules

### 🎨 **Unified Design System**
- **Gold & Obsidian Theme**: Premium dark theme with gold accents
- **Responsive Design**: Mobile-first approach
- **Modern UI Components**: Built with React 19 and Tailwind CSS
- **Smooth Animations**: Micro-interactions and transitions

## 🏗️ Architecture

### Phase-Based Module System
- **Phase 1 (Live)**: Core commerce + AI inbox
- **Phase 2 (2-3 mo)**: Finance & Customer Experience
- **Phase 3 (4-6 mo)**: Supply Chain Management
- **Phase 4 (7-9 mo)**: Legal & IT Compliance
- **Phase 5 (10-12 mo)**: AI Operating System

### Core Modules (Always Active)
- 📧 **Inbox**: Unified AI inbox across platforms
- 👥 **CRM**: Customer intelligence & pipeline
- 📊 **Analytics**: Revenue intelligence dashboards
- ⚙️ **Settings**: Platform & profile configuration

### Expansion Modules
- **Operations**: Calendar, Orders, Inventory, Support
- **Marketing**: Broadcast, Email, Social Ads, Campaigns
- **Finance**: Accounting, HR & Payroll, Tax Reports
- **AI**: Chatbot, Document AI, Corporate AI, Predictive AI
- **Legal**: Compliance, Risk Management
- **IT**: Security, Facilities Management

## 🛠️ Tech Stack

- **Frontend**: React 19.2.0, Vite 7.3.1
- **Routing**: React Router DOM 6.28.0
- **Styling**: Tailwind CSS 3.4.14 + Custom Design System
- **Charts**: Recharts 3.8.0
- **Icons**: Lucide React 0.460.0
- **Database**: Supabase 2.99.1
- **PDF**: PDF.js 5.5.207
- **Build**: Vite, ESLint, PostCSS

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd ExponifyHermes-Merged
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 🌐 Available Routes

- **/** - Hermes Analytics Dashboard
- **/crm** - Customer Relationship Management
- **/exponify-admin** - Exponify Module Management

## ⚙️ Configuration

### Environment Variables
```env
VITE_BACKEND_URL=http://localhost:5055
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette (obsidian, gold, etc.)
- Custom font families (DM Sans, Cormorant Garamond)
- Extended theme colors matching the design system

## 📱 Features Deep Dive

### Analytics Dashboard
- **Overview Tab**: Key metrics, revenue trends
- **Revenue Tab**: Detailed revenue vs expenses analysis
- **Demographics Tab**: Age/gender breakdown, geographic distribution
- **Platforms Tab**: Social media and e-commerce performance
- **Sentiment Tab**: Customer sentiment analysis over time

### CRM System
- **Contact Management**: Full customer profiles with scoring
- **Pipeline Tracking**: Lead → Prospect → Customer journey
- **Multi-platform Integration**: Instagram, Facebook, TikTok, Shopee, Lazada
- **Advanced Filtering**: Search by stage, platform, brand
- **Value Tracking**: Customer lifetime value and engagement metrics

### Module Administration
- **Phase-based Rollout**: Enable modules by implementation phase
- **Bulk Operations**: Enable all modules in a phase with one click
- **Module Information**: Detailed descriptions and timelines
- **Benefits Tracking**: CEO vs client value propositions
- **Progress Monitoring**: Real-time module activation status

## 🎯 Business Value

### For CEOs/Project Owners
- **Faster Time-to-Market**: Modular parallel development
- **Reduced Technical Debt**: Clean separation prevents spaghetti code
- **Scalability**: Independent module scaling
- **Competitive Moat**: PH-specific compliance built-in
- **Enterprise Appeal**: Auditable, secure architecture
- **Revenue Expansion**: Tier-based module pricing

### For Clients
- **All-in-One Platform**: Single login, unified experience
- **Automated Compliance**: BIR, SSS/PhilHealth/Pag-IBIG automation
- **Cost Savings**: Replace multiple subscriptions
- **Real-Time Insights**: Integrated dashboards
- **Audit-Ready**: Immutable logs and data export
- **Data Security**: PH-hosted with multi-tenant isolation

## 🔧 Development

### Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run start    # Start with host exposure
```

### Project Structure
```
src/
├── components/
│   └── ExponifyAdminDashboard.jsx
├── lib/
│   └── supabase.js
├── pages/
│   └── Login.jsx
├── app.jsx           # Main application with routing
├── main.jsx          # React entry point
└── index.css         # Global styles + Tailwind
```

### Design System
The unified design system includes:
- **Color Palette**: Obsidian backgrounds with gold accents
- **Typography**: DM Sans (body) + Cormorant Garamond (display)
- **Components**: Gold buttons, cards, navigation elements
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
1. Configure production environment variables
2. Set up Supabase database
3. Configure backend API endpoints
4. Deploy to your preferred hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
- Check the documentation
- Review the configuration guide
- Contact the development team

---

**Built for Filipino Businesses** 🇵🇭  
*International competitors have scale and brand recognition. Exponify.ph has context, integration, and a unified architecture built for how Filipino businesses actually operate.*
