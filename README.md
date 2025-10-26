# Nanox Technologies Website

A comprehensive and elegant website for Nanox Technologies - an IT company specializing in medical industry solutions and AI technology.

## Features

- **Modern Design**: Clean, professional design with smooth animations and transitions
- **Responsive**: Fully responsive layout that works on all devices (desktop, tablet, mobile)
- **Comprehensive Sections**:
  - Hero section with compelling value proposition
  - About section highlighting company expertise
  - Solutions showcase (Hospital Management, AI Diagnostics, Telemedicine, etc.)
  - Services overview (Consultation, Development, Integration, etc.)
  - Technology stack display
  - Client testimonials
  - Contact form

## Technologies Used

- HTML5
- CSS3 (Modern features including CSS Grid, Flexbox, Animations)
- Vanilla JavaScript (No dependencies)
- Google Fonts (Inter & Poppins)

## Getting Started

1. Open `index.html` in your web browser
2. No build process or installation required
3. All files are self-contained and ready to use

## Customization

### Colors
Edit the CSS variables in `styles.css` (lines 1-17) to change the color scheme:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #06b6d4;
    /* ... more variables */
}
```

### Content
- Edit `index.html` to update text, images, and content
- Modify the solutions, services, and testimonials sections as needed

### Contact Form
The contact form currently logs data to the console. To make it functional:
1. Set up a backend API endpoint
2. Update the form submission handler in `script.js` (lines 35-55)
3. Replace the console.log with an API call

## File Structure

```
nanox-technologies/
├── index.html          # Main HTML file
├── styles.css          # All styles and responsive design
├── script.js           # Interactive functionality
└── README.md          # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- Smooth scroll behavior
- Intersection Observer API for efficient animations
- Optimized CSS with minimal repaints
- Lazy loading ready structure

## Future Enhancements

- Add actual images (currently using placeholder elements)
- Implement backend for contact form
- Add blog section
- Integrate case studies
- Add multilingual support
- Implement dark mode toggle

## License

Copyright © 2025 Nanox Technologies. All rights reserved.
