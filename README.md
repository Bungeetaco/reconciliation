
<img src="https://github.com/user-attachments/assets/1320d707-b505-4c96-8c37-e8a4941a1775" width="48"> 

## SJA Office 365 License Mapping


A React-based application for managing and analyzing Microsoft 365 license assignments across St John Ambulance Canada.

## Features

- 📊 License usage analysis and cost tracking
- 🌓 Dark/Light theme support
- 📱 Responsive design
- 📤 Multiple export formats (PDF, CSV, Excel, HTML)
- 🔍 Advanced search and filtering
- 📈 Cost analysis and summaries
- 🎯 Department-based grouping
- 💾 Drag-and-drop file upload

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A modern web browser

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd reconciliation

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Usage

1. Launch the application
2. Upload a CSV file containing license data
3. Use filters to analyze specific departments or license types
4. Export data in your preferred format

### CSV File Format

The application expects CSV files with the following columns:
- Display Name
- User Principal Name
- Department
- License Information

## Technology Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- next-themes (Dark mode)
- Papa Parse (CSV parsing)
- lucide-react (Icons)

## Project Structure

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This software is licensed under the GNU General Public License v3.0 (GPL-3.0) with additional terms:

### Open Source Components
- Source code is available under GPL-3.0
- Modifications must be shared under the same license
- See LICENSE file for complete GPL-3.0 terms

### Proprietary Components (Not Licensed)
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

### Third-Party Components
This project includes third-party software under their respective licenses:
- React - MIT License
- Tailwind CSS - MIT License
- Other dependencies - See package.json

© 2024 St John Ambulance Canada / Gabriel Girouard. All rights reserved.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
