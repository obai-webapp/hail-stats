# Hail Damage Analytics Dashboard

A brutalist-styled web application for analyzing hail damage annotations exported from Label Studio. Upload your JSON exports and instantly visualize damage statistics, dent size distributions, and annotation breakdowns.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-blue) ![Recharts](https://img.shields.io/badge/Recharts-2.15-green)

## Features

### 📊 Visual Analytics
- **Damage Breakdown Pie Chart** - Donut chart showing YES/NO/PENDING damage classification ratios
- **Dent Size Distribution Chart** - Horizontal bar chart visualizing dent counts by size category
- **Real-time Statistics** - Cards displaying total tasks, damage counts, and pending reviews

### 📋 Data Tables
- **Primary Panel Distribution** - Breakdown of damage by vehicle panel location
- **Method Distribution** - Analysis of annotation methods used
- **Hail Grid Type Distribution** - Statistics on grid types present in photos

### 📝 Slack Summary
- One-click copy of formatted dataset summary for sharing in Slack/Teams

### 🎨 Design
- High-contrast brutalist aesthetic with sharp borders and terminal-style typography
- Responsive layout optimized for desktop and tablet viewing
- Dark theme with accent color highlights

## Tech Stack

- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Charts**: Recharts
- **UI Components**: shadcn/ui (Radix primitives)
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-directory>

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:8080`

## Usage

1. **Export from Label Studio** - Export your annotated hail damage project as JSON
2. **Upload JSON** - Drag and drop or click to upload the exported file
3. **Analyze** - View instant visualizations and statistics
4. **Share** - Copy the Slack summary to share with your team

## Expected Data Format

The application expects Label Studio JSON exports with the following annotation structure:

```json
{
  "id": 1,
  "data": {
    "image": "https://example.com/image.jpg"
  },
  "annotations": [
    {
      "id": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "completed_by": {
        "id": 1,
        "email": "annotator@example.com"
      },
      "result": [
        {
          "type": "choices",
          "from_name": "hail_present",
          "value": { "choices": ["YES"] }
        },
        {
          "type": "rectanglelabels",
          "from_name": "dent_boxes",
          "value": { 
            "rectanglelabels": ["DIME"],
            "x": 10, "y": 20, "width": 5, "height": 5
          }
        }
      ]
    }
  ]
}
```

### Supported Annotation Labels

| Field | Values |
|-------|--------|
| `hail_present` | YES, NO |
| `dent_boxes` (rectanglelabels) | DIME, NICKEL, QUARTER, HALF_DOLLAR, OVERSIZED |
| `primary_panel` | Any string (e.g., HOOD, ROOF, DOOR) |
| `method` | Any string |
| `hail_grid_present` | YES, NO |
| `hail_grid_type` | Any string |

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── DamageBreakdownChart.tsx  # Pie chart for damage status
│   ├── DentSizeChart.tsx         # Bar chart for dent sizes
│   ├── DistributionTable.tsx     # Generic distribution table
│   ├── FileUpload.tsx            # JSON file upload handler
│   ├── SlackSummary.tsx          # Copyable summary generator
│   ├── StatCard.tsx              # Statistics display card
│   └── StatsDashboard.tsx        # Main dashboard layout
├── lib/
│   └── labelStudioParser.ts   # JSON parsing and stats computation
├── types/
│   └── labelStudio.ts         # TypeScript interfaces
├── pages/
│   ├── Index.tsx              # Home page
│   └── NotFound.tsx           # 404 page
└── index.css                  # Global styles and design tokens
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |

## Customization

### Design Tokens

Colors and design tokens are defined in `src/index.css`. The application uses HSL color values for consistent theming:

```css
:root {
  --background: 0 0% 3%;
  --foreground: 0 0% 98%;
  --primary: 45 100% 50%;
  /* ... */
}
```

### Adding New Charts

1. Create a new component in `src/components/`
2. Use Recharts with the existing color palette
3. Import and add to `StatsDashboard.tsx`

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-chart`)
3. Commit changes (`git commit -m 'Add new chart type'`)
4. Push to branch (`git push origin feature/new-chart`)
5. Open a Pull Request
