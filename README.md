<img src="https://github.com/user-attachments/assets/1320d707-b505-4c96-8c37-e8a4941a1775" width="48">

# SJA Office 365 License Mapping 📊

A React-based application for managing and analyzing Microsoft 365 license assignments across St John Ambulance Canada. This tool provides detailed insights into license usage, costs, and distribution across departments.

## ✨ Features

### 📥 Data Sources
- **CSV Upload**: Import license data through CSV files
- **Microsoft SSO Integration**: Direct data fetching using Microsoft authentication
- **Graph API Integration**: Real-time license and user data from Microsoft 365

### 📊 Analysis & Visualization
- **License Usage Overview**: Comprehensive view of license distribution
- **Cost Analysis**: Monthly and annual cost calculations per user and department
- **Department Insights**: Group-based analysis of license allocation

### 🔍 Advanced Filtering
- Department-based filtering
- License type filtering
- Text-based search
- Zero-cost account filtering
- Unknown license visibility toggle

### 📤 Export Options
- PDF reports
- CSV data export
- Excel workbooks
- HTML reports

### 🎨 User Interface
- Modern, responsive design
- Dark/Light mode with system theme detection
- Interactive data tables with sorting
- Real-time data filtering
- Loading indicators for async operations

## 🚀 Getting Started

### ⚡ Prerequisites
- Node.js v18.17.1 (exact version required for Microsoft Graph API compatibility)
- npm v9.6.7 or yarn v1.22.19
- Microsoft 365 account with appropriate permissions (for SSO features)

### 💻 Installation

1. Clone the repository:
```bash
git clone https://github.com/bungeetaco/reconciliation.git
cd reconciliation
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following:
```env
VITE_MICROSOFT_CLIENT_ID=your_client_id
VITE_MICROSOFT_TENANT_ID=your_tenant_id
```

4. Start the development server:
```bash
npm run dev
```

### 📖 Usage

#### 📁 Method 1: CSV Upload
1. Click the "Upload File" button in the header
2. Select your CSV file containing license data
3. The application will automatically process and display the data

#### 🔑 Method 2: Microsoft SSO
1. Click "Sign in with Microsoft" in the header
2. Authenticate with your Microsoft 365 account
3. The application will fetch and display your organization's license data

### 📋 CSV File Format

The application expects CSV files with the following columns:
- Display Name
- User Principal Name
- Department
- License Information

### 🔍 Filtering Data
- Use the search bar to filter by user names or email addresses
- Select departments from the dropdown to filter by department
- Choose specific license types to view
- Toggle "Hide Zero Cost Accounts" to focus on paid licenses
- Toggle "Show Unknown Licenses" to include unrecognized licenses

### 📥 Exporting Data
1. Click the export button in the header
2. Choose your preferred format:
   - PDF: For printable reports
   - CSV: For raw data analysis
   - Excel: For detailed spreadsheets
   - HTML: For web-based viewing

## 👨‍💻 Development

### 📁 Project Structure
```
src/
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── ...           
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and constants
├── providers/        # Context providers
├── types/           # TypeScript type definitions
└── helpers/         # Helper functions
```

### 🏗️ Building for Production
```bash
npm run build
```

### 🚀 Deployment
```bash
npm run deploy
```

## 🔧 Technical Details

### 🛠️ Built With
- React 18.2.0
- TypeScript
- Vite
- Tailwind CSS
- Microsoft Authentication Library (MSAL)
- Microsoft Graph API
- Papa Parse (CSV parsing)
- lucide-react (Icons)

### 🏛️ Architecture
- Modular component structure
- Custom hooks for data management
- Type-safe implementations
- Error boundary protection
- Responsive design patterns

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This software is licensed under the GNU General Public License v3.0 (GPL-3.0) with additional terms:

### 🔓 Open Source Components
- Source code is available under GPL-3.0
- Modifications must be shared under the same license
- See LICENSE file for complete GPL-3.0 terms

### 🔒 Proprietary Components (Not Licensed)
The following components are proprietary and not included in the GPL license:

1. **St. John Ambulance Canada Assets**
   - Trademarks and logos
   - Brand names and service marks
   - Corporate identity materials

2. **Organizational Data**
   - User information and contact data
   - Department structures
   - License assignments
   - Pricing and cost information

For permissions regarding proprietary components, contact:
gabriel.girouard@sja.ca

### 📦 Third-Party Components
This project includes third-party software under their respective licenses:
- React - MIT License
- Tailwind CSS - MIT License
- Other dependencies - See package.json

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## 👏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Microsoft Graph API Documentation
- All contributors and users of this project

© 2024 St John Ambulance Canada / Gabriel Girouard. All rights reserved.
