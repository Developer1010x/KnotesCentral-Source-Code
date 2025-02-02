# Knotes Central Documentation

## Overview

Knotes Central is a modern web application built to provide RVCE students with easy access to academic resources, including notes, lab materials, and question papers. The application is built using Next.js, TypeScript, and Tailwind CSS, featuring a responsive design with dark mode support.

## Tech Stack

- **Frontend Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context (for theme)
- **Deployment**: [Platform information to be added]

## Project Structure

```
src/
├── app/ # Next.js 13 app directory
│ ├── [department]/ # Dynamic department routes
│ ├── about/ # About page
│ ├── contact/ # Contact page
│ ├── layout.tsx # Root layout
│ └── page.tsx # Home page
├── components/ # Reusable React components
├── data/ # Data types and mock data
└── lib/ # Utility functions
```

## Key Features

### 1. Department-Based Navigation

- Dynamic routing based on department
- Hierarchical structure: Department → Year → Semester → Subject
- Easy-to-use interface for browsing academic resources

### 2. Theme System

- Dark/Light mode support
- System preference detection
- Persistent theme selection
- Smooth transitions between themes

### 3. Responsive Design

- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly navigation
- Optimized for both desktop and mobile devices

### 4. Visual Design

- Neon color scheme
- Gradient effects
- Glassmorphism UI elements
- Smooth animations and transitions

## Data Structure

### Core Data Types

```typescript
interface Department {
  name: string;
  description: string;
  link: string;
  years: Year[];
}
interface Year {
  year: number;
  semesters: Semester[];
}
interface Semester {
  number: number;
  subjects: Subject[];
}
interface Subject {
  name: string;
  subject_code: string;
  notes: Note[];
}
interface Note {
  title: string;
  type: "theory" | "lab" | "question-paper";
  link: string;
}
```

## Component Architecture

### Layout Components

- `RootLayout`: Main application wrapper with navigation and theme provider
- `ThemeProvider`: Manages application theme state
- `ThemeToggle`: UI component for switching themes

### Page Components

- `Home`: Landing page with department listings
- `DepartmentPage`: Department-specific content
- `About`: Information about the platform
- `Contact`: Contact information and form

### UI Components

- `DepartmentCard`: Displays department information
- `YearSection`: Shows year-specific content
- `SemesterSection`: Displays semester information
- `SubjectSection`: Contains subject-related materials

## Styling System

### Theme Variables

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --neon-blue: #00ffff;
  --neon-purple: #ff00ff;
  --neon-pink: #ff69b4;
  --neon-green: #39ff14;
}
```

### CSS Features

- Custom color scheme
- Neon effects
- Glassmorphism
- Responsive utilities
- Dark mode optimizations

## Contributing

### Adding New Content

1. Update the relevant data files in `src/data/`
2. Follow the existing data structure
3. Ensure all links are valid
4. Test the changes locally

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Access the application at `http://localhost:3000`

## Performance Considerations

- Image optimization
- Component lazy loading
- Static page generation where possible
- Client-side navigation
- Optimized theme switching

## Future Enhancements

- Search functionality
- User authentication
- Content management system
- Real-time updates
- Mobile application
- Offline support

## Support and Contact

For support or contributions, please contact:

- [S Prajwall Narayana](https://github.com/developer1010x)
- [Krishnatejaswi S](https://github.com/KTS-o7)
- [Github Repository](https://github.com/KTS-o7/knotes-central-ui)

## License

This project is licensed under the MIT License. See the [LICENSE.md](../LICENSE.md) file for details.

The MIT License allows you to:

- Use the software commercially
- Modify the source code
- Distribute the software
- Use and modify the software privately

While requiring you to:

- Include the original copyright notice
- Include the license notice
