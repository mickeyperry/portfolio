# Mickey Perry - Portfolio Website

Modern, animated portfolio website for creative designer and animator.

## Features

- ✨ Smooth scroll animations
- 🎬 Video showreel section
- 📱 Fully responsive design
- 🎨 Modern gradient effects
- ⚡ Fast loading, no dependencies
- 🌙 Dark theme optimized for creative work

## How to Customize

### 1. Add Your Showreel Video

Replace the placeholder in `index.html` (around line 54) with your YouTube or Vimeo embed:

**For YouTube:**
```html
<div class="video-container">
    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allowfullscreen></iframe>
</div>
```

**For Vimeo:**
```html
<div class="video-container">
    <iframe src="https://player.vimeo.com/video/YOUR_VIDEO_ID" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
</div>
```

### 2. Add Your Avatar/Photo

Replace the avatar placeholder in the About section with your image:

```html
<div class="about-image">
    <img src="your-avatar.jpg" alt="Mickey Perry" style="width: 100%; border-radius: 20px;">
</div>
```

### 3. Add Project Images/Videos

For each project card, replace the placeholder with actual images:

```html
<div class="project-card">
    <div class="project-image">
        <img src="path/to/project-image.jpg" alt="Project Name">
    </div>
    <h3>Project Name</h3>
</div>
```

### 4. Update Social Media Links

In the navigation and footer, update these URLs:
- Facebook: Replace `https://www.facebook.com` with your profile
- YouTube: Replace `https://www.youtube.com` with your channel
- Instagram: Replace `https://www.instagram.com` with your profile

### 5. Add Your CV

Upload your CV PDF and update the link in the About section:

```html
<a href="Mickey-Perry-CV.pdf" download class="cv-link">Download Full CV →</a>
```

## Deployment to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to github.com and create a new repository
2. Name it: `yourusername.github.io` (replace `yourusername` with your GitHub username)
3. Make it public
4. Don't initialize with README

### Step 2: Push Your Code

Run these commands in the terminal:

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click Settings → Pages
3. Under "Source", select "main" branch
4. Click Save

Your site will be live at: `https://yourusername.github.io`

## Alternative Free Hosting Options

### Netlify (Easiest)
1. Go to netlify.com
2. Drag and drop the `portfolio` folder
3. Done! You get a free URL

### Vercel
1. Install: `npm i -g vercel`
2. Run: `vercel` in the portfolio folder
3. Follow the prompts

### Cloudflare Pages
1. Go to pages.cloudflare.com
2. Connect your GitHub repository
3. Deploy automatically

## File Structure

```
portfolio/
├── index.html      # Main HTML file
├── style.css       # All styles and animations
├── script.js       # JavaScript for interactions
└── README.md       # This file
```

## Customization Tips

- **Colors**: Edit the CSS variables in `style.css` (lines 11-20)
- **Fonts**: Change font-family in `style.css` (line 28)
- **Animations**: Adjust timing in CSS animations
- **Add more sections**: Copy existing section structure

## Need Help?

- Can't find your YouTube video ID? It's the part after `v=` in the URL
- Images not showing? Make sure they're in the same folder or use full paths
- Site not updating? Clear your browser cache (Ctrl+Shift+R)

---

Built with ❤️ for creative professionals
