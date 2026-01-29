# Website Setup and Maintenance Guide

## Local Development Setup

### Prerequisites
- Docker and Docker Compose installed on your system

### Running the Website Locally

1. **Pull the latest Docker images:**
   ```bash
   docker compose pull
   ```

2. **Start the development server:**
   ```bash
   docker compose up
   ```

3. **Access the website:**
   - Open your browser and navigate to: `http://localhost:4000`
   - The server will automatically rebuild when you modify files
   - Refresh your browser to see changes

4. **Stop the server:**
   - Press `Ctrl+C` in the terminal
   - Or run: `docker compose down`

## Deployment

### Automatic Deployment to GitHub Pages

Yes, you're correct! The website is configured for automatic deployment:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

3. **Automatic deployment:**
   - GitHub Pages will automatically build and deploy your site
   - Wait 2-5 minutes for deployment to complete
   - Visit your live site to verify changes

## Managing Conference and Journal Deadlines

The deadlines page (`/deadlines/`) displays AI conference and journal submission deadlines with live countdown timers.

### Data File Location

All deadline data is stored in:
```
assets/json/deadlines.json
```

### Adding a New Conference

Add a new object to the JSON array:

```json
{
  "venue": "ICML-27",
  "venue_long": "International Conference on Machine Learning",
  "type": "conference",
  "ranking": "A*",
  "area": "General AI/ML",
  "location": "Vienna, Austria",
  "abstract_deadline": "01/23/2027 11:59",
  "deadline": "01/28/2027 23:59",
  "conference_dates": {
    "start": "2027/07/10",
    "end": "2027/07/16"
  }
}
```

### Adding a Rolling Submission Journal

For journals with rolling submission (no specific deadline):

```json
{
  "venue": "JMLR",
  "venue_long": "Journal of Machine Learning Research",
  "type": "journal",
  "ranking": "A*",
  "area": "General AI/ML"
}
```

**Note:** Omit the `deadline` field for rolling journals - they'll automatically show "Rolling (Open Year-Round)"

### Field Reference

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `venue` | ✅ Yes | Short venue name | "ICML-27" |
| `type` | ✅ Yes | Type of venue | "conference" or "journal" |
| `venue_long` | ⭕ Optional | Full venue name | "International Conference on Machine Learning" |
| `ranking` | ⭕ Optional | Venue ranking | "A*", "A", "B", "Top - New" |
| `area` | ⭕ Optional | Research area | "General AI/ML", "NLP", "RL", "Vision" |
| `location` | ⭕ Optional | Conference location | "Vienna, Austria" |
| `deadline` | ⭕ Optional* | Paper submission deadline (AoE time) | "01/28/2027 23:59" |
| `abstract_deadline` | ⭕ Optional | Abstract submission deadline | "01/23/2027 11:59" |
| `conference_dates` | ⭕ Optional | Conference start/end dates | `{"start": "2027/07/10", "end": "2027/07/16"}` |
| `notification` | ⭕ Optional | Notification date | "04/15/2027" |
| `camera_ready` | ⭕ Optional | Camera ready deadline | "05/01/2027" |
| `link` | ⭕ Optional | Conference website URL | "https://icml.cc/" |
| `approx` | ⭕ Optional | 1 if date is approximate | 1 |

*For journals, omitting `deadline` creates a rolling submission entry

### Deadline Date Format

**Important:** All deadlines are assumed to be in **AoE (Anywhere on Earth)** time (UTC-12).

- Format: `"MM/DD/YYYY HH:MM"`
- Example: `"01/28/2027 23:59"` = January 28, 2027, 11:59 PM AoE
- The system automatically converts AoE to your local timezone for display

### Ranking Badge Colors

The following rankings have color-coded badges:

- **A*** - Gold (top-tier conferences/journals)
- **A** - Light Blue (excellent venues)
- **B** - Gray (good venues)
- **Top - New** - Green (new top-tier venues)
- **Top tier AI journal** - Purple (prestigious journals)
- **Recent top tier AI journal** - Lavender (newly prestigious journals)

### Quick Update Workflow

1. **Edit the file:**
   ```bash
   # Using nano
   nano assets/json/deadlines.json

   # Or use your preferred editor
   vim assets/json/deadlines.json
   code assets/json/deadlines.json
   ```

2. **Validate JSON syntax:**
   - Make sure all brackets and commas are correct
   - Use a JSON validator: https://jsonlint.com/

3. **Test locally:**
   - Save the file
   - Refresh browser at `http://localhost:4000/deadlines/`
   - Verify new entries appear

4. **Deploy:**
   ```bash
   git add assets/json/deadlines.json
   git commit -m "Add CONFERENCE-NAME deadline" # or "Update deadlines"
   git push origin main
   ```

5. **Verify deployment:**
   - Wait 2-5 minutes
   - Visit your live site and check `/deadlines/`

### Example: Complete Conference Entry

```json
{
  "venue": "NeurIPS-27",
  "venue_long": "Conference on Neural Information Processing Systems",
  "type": "conference",
  "ranking": "A*",
  "area": "General AI/ML",
  "location": "Vancouver, Canada",
  "link": "https://neurips.cc/Conferences/2027",
  "abstract_deadline": "05/08/2027 13:00",
  "deadline": "05/15/2027 13:00",
  "notification": "09/15/2027",
  "camera_ready": "10/15/2027",
  "conference_dates": {
    "start": "2027/12/06",
    "end": "2027/12/12"
  }
}
```

### Common Tasks

**Remove a past conference:**
- Delete the entire JSON object from the array
- Don't forget to remove the comma if it's not the last item

**Update a deadline:**
- Find the conference in `deadlines.json`
- Update the `deadline` field
- Update `approx: 1` to `approx: 0` or remove it if it's now confirmed

**Mark a deadline as approximate:**
- Add `"approx": 1` to the conference object
- This shows a warning: "based on previous year!"

## Website Structure

```
veerendrav.github.io/
├── _pages/               # Static pages
│   ├── about.md         # Homepage
│   ├── blog.md          # Blog listing
│   └── deadlines.md     # Deadlines page
├── _posts/              # Blog posts
├── _layouts/            # Page templates
├── _includes/           # Reusable components
├── assets/              # Static assets
│   ├── css/
│   │   └── deadlines.css     # Deadlines styling
│   ├── js/
│   │   └── deadlines.js      # Countdown logic
│   └── json/
│       └── deadlines.json    # Conference/journal data ⭐
├── _config.yml          # Jekyll configuration
└── docker-compose.yml   # Docker setup
```

## Troubleshooting

### Local server not starting
- Check if port 4000 is already in use: `lsof -i :4000`
- Stop other services using the port
- Try: `docker compose down && docker compose up`

### Changes not appearing in browser
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Check if Jekyll rebuilding succeeded (watch terminal output)

### Deadlines not displaying
- Open browser console (F12) and check for JavaScript errors
- Verify `deadlines.json` has valid JSON syntax
- Check that JSON file is accessible: `http://localhost:4000/assets/json/deadlines.json`

### Deployment not working
- Check GitHub Actions tab in your repository
- Look for build/deployment errors
- Ensure GitHub Pages is enabled in repository settings

## Additional Notes

### Dark Mode Support
The deadlines page fully supports dark mode:
- Toggle using the moon/sun icon in the navigation
- All colors adapt automatically

### Responsive Design
The countdown page is optimized for:
- Desktop (1920x1080, 1366x768)
- Tablet (iPad, Surface)
- Mobile (iPhone, Android)

### Browser Compatibility
Tested and working on:
- Chrome/Edge (Chromium)
- Firefox
- Safari

### Backup
The original countdown application is preserved in:
```
AI-Journal-and-Conference-Countdown/
```
This can be removed after confirming the integration works correctly.

## Credits

The deadlines countdown tool is based on:
- Original work by [@karpathy](https://twitter.com/karpathy)
- [Academic Countdown](http://www.academiccountdown.com/)
- [Intelligent Systems Laboratory, University of Bristol](https://github.com/IntelligentSystemsLaboratory/academic_countdown)

Integrated into Jekyll site with al-folio theme compatibility.
