# Contributing to Expo Starter

Thank you for considering contributing to this project! 🎉

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/aydinfer/Expo-Starter/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment info (Expo version, OS, device)

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and why it's useful
3. Include examples or mockups if possible

### Submitting Pull Requests

1. **Fork the repository**

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/Expo-Starter.git
   cd Expo-Starter/clean-build
   ```

3. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow the [Coding Guide](./docs/meta/CODING_GUIDE.md)
   - Write clear, descriptive commit messages
   - Add tests if applicable

5. **Test your changes**

   ```bash
   npm install
   npx expo start
   npx tsc --noEmit
   ```

6. **Update documentation**
   - Update relevant docs in `/docs`
   - Update CHANGELOG.md if needed

7. **Commit with conventional commits**

   ```bash
   git commit -m "feat: add user profile component"
   git commit -m "fix: resolve authentication issue"
   git commit -m "docs: update setup guide"
   ```

8. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub

## Coding Standards

### Follow the Coding Guide

Read [docs/meta/CODING_GUIDE.md](./docs/meta/CODING_GUIDE.md) for:

- TypeScript standards
- Component structure
- Naming conventions
- State management patterns
- Testing guidelines

### Key Principles

- ✅ TypeScript strict mode (no `any`)
- ✅ NativeWind for styling (no inline styles)
- ✅ Design tokens from tailwind.config.js
- ✅ React Query for server state
- ✅ Zustand for client state
- ✅ Functional components with hooks

### Code Review Checklist

Before submitting:

- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Follows NativeWind patterns
- [ ] Uses design tokens (no hardcoded colors)
- [ ] Dark mode support
- [ ] Error handling implemented
- [ ] Documentation updated
- [ ] Commit messages follow convention

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(auth): add password reset flow
fix(ui): resolve button alignment issue
docs: update supabase setup guide
refactor(hooks): extract validation logic
```

## Documentation Guidelines

When adding documentation:

1. **Keep files focused** - Under 300 lines
2. **Use clear examples** - Show, don't just tell
3. **Link related docs** - Help users navigate
4. **Update the index** - Add to docs/README.md
5. **Test code snippets** - Ensure they work

## Project Structure

```
clean-build/
├── app/                # Expo Router screens
├── lib/                # Business logic
│   ├── hooks/         # Custom hooks
│   ├── store/         # Zustand stores
│   ├── supabase/      # Supabase client
│   └── utils/         # Utilities
├── components/        # Reusable components
├── docs/              # Documentation
└── assets/            # Images, fonts
```

## Getting Help

- 📖 [Documentation](./docs/README.md)
- 💬 [GitHub Discussions](https://github.com/aydinfer/Expo-Starter/discussions)
- 🐛 [Report Issues](https://github.com/aydinfer/Expo-Starter/issues)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You! 🙏

Your contributions make this project better for everyone!
