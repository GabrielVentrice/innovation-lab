# Creators Dashboard

A clean and professional dashboard built with Nuxt 3 and TypeScript to help marketing teams find and connect with gaming content creators across YouTube, Twitch, and TikTok.

## Features

- **Multi-Platform Search**: Search creators across YouTube, Twitch, and TikTok
- **Advanced Filtering**: Filter by game, language, region, and platform
- **Detailed Creator Profiles**: View comprehensive information including:
  - Social media accounts and follower counts
  - Contact information (email, WhatsApp, Discord)
  - Bio and game tags
  - Average view counts
- **Export Functionality**: Export results to CSV or JSON
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Clean UI**: Minimalist design inspired by Claude.ai and Linear

## Tech Stack

- **Framework**: Nuxt 3
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Architecture**: Composables-based state management

## Project Structure

```
.
├── assets/
│   └── css/
│       └── main.css              # Tailwind CSS configuration
├── components/
│   ├── creators/
│   │   ├── CreatorCard.vue       # Individual creator card
│   │   ├── CreatorDetailModal.vue # Detailed creator view
│   │   ├── CreatorFilters.vue    # Search filters form
│   │   └── CreatorGrid.vue       # Grid layout for cards
│   └── ui/
│       ├── Badge.vue             # Badge component
│       ├── Button.vue            # Button component
│       ├── Input.vue             # Input component
│       ├── Loading.vue           # Loading states
│       └── Select.vue            # Select dropdown
├── composables/
│   └── useCreators.ts            # Creators state management
├── pages/
│   └── index.vue                 # Main dashboard page
├── types/
│   └── creator.ts                # TypeScript interfaces
├── utils/
│   ├── creatorsSearch.ts         # API search logic (MOCK)
│   └── formatters.ts             # Helper functions
├── app.vue                       # Root component
├── nuxt.config.ts                # Nuxt configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd innovation-lab
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Searching for Creators

1. Enter a **Game name** in the search form (required)
2. Optionally filter by:
   - **Language**: Portuguese, English, Spanish, etc.
   - **Region**: Brazil, US, Europe, etc.
   - **Platforms**: Select one or more (YouTube, Twitch, TikTok)
   - **View Mode**: Full results or Top 10 creators
3. Click **Search Creators**

### Viewing Creator Details

- Click on any creator card to open a detailed modal
- View all platform accounts, statistics, and contact information
- Copy creator information to clipboard
- Mark creators as contacted

### Exporting Results

- Click **Export CSV** or **Export JSON** buttons above the results
- Files will be automatically downloaded with timestamp

## Important: API Implementation

⚠️ **The current search implementation uses MOCK data for demonstration purposes.**

To integrate with real APIs, you need to:

1. **Replace the mock implementation** in `utils/creatorsSearch.ts`
2. **Add your API keys** for:
   - YouTube Data API
   - Twitch API
   - TikTok API
3. **Implement the actual search logic** while keeping the same function signature

Example structure for real implementation:

```typescript
export async function searchCreators(options: SearchOptions): Promise<Creator[]> {
  // 1. Search YouTube API
  const youtubeResults = await searchYouTube(options.game, options.region)

  // 2. Search Twitch API
  const twitchResults = await searchTwitch(options.game, options.region)

  // 3. Search TikTok API
  const tiktokResults = await searchTikTok(options.game, options.region)

  // 4. Merge and deduplicate results
  const creators = mergeResults(youtubeResults, twitchResults, tiktokResults)

  return creators
}
```

## Design System

### Colors

- **Primary**: Orange (`#FF6B35`) - Used for CTAs and highlights
- **Grays**: Neutral gray palette for text and backgrounds
- **Accent Colors**: Subtle colors for badges and states

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components

All components follow a consistent design pattern:
- Rounded corners (`rounded-lg`, `rounded-xl`)
- Subtle shadows (`shadow-soft`, `shadow-medium`)
- Smooth transitions (200ms duration)
- Clear hover states

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

### TypeScript

The project uses strict TypeScript mode. All types are defined in `types/creator.ts`.

### Adding New Features

1. Create new components in `components/`
2. Add types to `types/creator.ts`
3. Extend composable in `composables/useCreators.ts`
4. Update formatters in `utils/formatters.ts` if needed

## Deployment

### Static Hosting (Vercel, Netlify)

```bash
npm run generate
```

Deploy the `.output/public` directory.

### Node.js Server

```bash
npm run build
node .output/server/index.mjs
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## License

Internal tool - All rights reserved

## Support

For questions or issues, contact the development team.

---

Built with ❤️ using Nuxt 3 + TypeScript + Tailwind CSS
