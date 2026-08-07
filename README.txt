MYFLIX — EASY SETUP

TEST VIDEO INCLUDED
The featured "MyFlix Test Recording" is ready to play from the media folder.
Its movie-card poster and featured background are included in the images folder.

FOUR-DIGIT ACCESS CODE
The starting code is: 2026

To change it, open js/access.js and change this line:
const MYFLIX_ACCESS_CODE = "2026";

Use exactly four numbers. Firebase, Firestore and user accounts are not needed.

1. Keep index.html, style.css, app.js and library.json together.
2. Create a folder named: media
3. Put your OWN video files inside the media folder.
4. Open library.json and copy an existing movie block.
5. Change its id, title, year, description and video filename.
6. Upload everything to GitHub Pages.

Example video line:
"video": "media/movie-name.mp4"

Poster and backdrop can be full image links or files you upload:
"poster": "images/movie-poster.jpg"
"backdrop": "images/movie-background.jpg"

Important: use only videos you own or have permission to host.
