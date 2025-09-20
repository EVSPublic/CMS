# Development Standards & Workflow

## Task Management
- ALWAYS update the TODO.md file and mark finished steps immediately
- Follow the status indicators: ✅ COMPLETED, 🚀 CURRENT PRIORITY, 🔄 PENDING, ⏸️ PAUSED, ❌ BLOCKED
- Run `npm run build` to verify changes before marking tasks complete
- Update implementation details when completing phases

## Code Standards
- **TypeScript**: All new code must be properly typed
- **Component Structure**: Use functional components with hooks
- **Styling**: Tailwind CSS utility classes, avoid custom CSS
- **State Management**: Redux Toolkit for global state, local state for forms
- **Image Management**: Use ImageInput components for all image fields
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Development Approach
- Work on pages incrementally (one by one)
- Follow IndexPage.tsx pattern for new content editors
- Focus only on admin panel (do not update HTML files)
- Maintain existing styling and layout structure
- Preserve responsive design consistency
- Implement proper error handling throughout

# Important Instruction Reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.