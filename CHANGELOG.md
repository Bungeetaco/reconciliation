# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-02-05

### Added
- Microsoft SSO integration using MSAL for direct data fetching
- Microsoft Graph API integration for fetching user and license data
- Dark mode support with system theme detection
- Export functionality for PDF, CSV, Excel, and HTML formats
- Advanced filtering options:
  - Department filtering
  - License type filtering
  - Search functionality
  - Option to hide zero-cost accounts
  - Option to show/hide unknown licenses
- Sorting capabilities for all data columns
- Cost calculation for monthly and annual license expenses
- Error boundary implementation for graceful error handling
- Loading spinner for asynchronous operations
- Responsive UI with Tailwind CSS
- Type-safe implementation with TypeScript

### Changed
- Updated React to version 18.2.0 for improved performance
- Migrated to TypeScript for better type safety
- Implemented modular component architecture
- Enhanced data management with custom hooks
- Improved error handling with custom error types

### Fixed
- Type definitions for user cost properties
- Microsoft Graph API authentication flow
- Data transformation for Microsoft license data
- Theme persistence across sessions
- Performance optimizations with useMemo and useCallback

## [0.1.0] - 2024-02-04

### Added
- Initial release with basic functionality
- File upload support for CSV data
- Basic data display and filtering
- Simple cost calculations
- Basic UI components