# Contributing to Knotes Central

Thank you for your interest in contributing to Knotes Central! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### 1. Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/knotes-central-ui.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

### 2. Adding Notes Content

1. Navigate to `src/data/mockData.ts`
2. Follow the existing data structure (see Data Types below)
3. Ensure all links are valid and accessible
4. Test your changes locally before submitting

### 3. Making Code Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Follow the existing code style and patterns
3. Ensure your code follows TypeScript best practices
4. Add appropriate comments for complex logic

### 4. Data Structure Guidelines

Follow these interfaces when adding new content:

```typescript
interface Department {
  name: string;
  description: string;
  link: string;
  years: Year[];
}
interface Note {
  title: string;
  type: "theory" | "lab" | "question-paper";
  link: string;
}
```

### 5. Styling Guidelines

- Use Tailwind CSS classes
- Follow the theme system using CSS variables
- Maintain dark mode compatibility
- Ensure responsive design

### 6. Submitting Changes

1. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: brief description of changes"
   ```
2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Create a Pull Request from your fork to the main repository

### 7. Pull Request Guidelines

- Use a clear, descriptive title
- Include details of changes made
- Reference any related issues
- Ensure all tests pass
- Include screenshots for UI changes

## Development Standards

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable and function names
- Keep components modular and reusable

### Component Structure

- Place new components in `src/components/`
- Follow existing component patterns
- Include proper TypeScript types
- Add necessary comments

### Testing

- Test your changes thoroughly
- Ensure cross-browser compatibility
- Verify mobile responsiveness
- Check dark mode functionality

## Getting Help

- Create an issue for bugs or feature requests
- Join our community discussions
- Contact maintainers:
  - [S Prajwall Narayana](https://github.com/developer1010x)
  - [Krishnatejaswi S](https://github.com/KTS-o7)

## License

By contributing to Knotes Central, you agree that your contributions will be licensed under the MIT License. See [LICENSE.md](../LICENSE.md) for details.
