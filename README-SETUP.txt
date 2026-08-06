MYFLIX V1 FIREBASE SETUP
========================

IMPORTANT:
Do not open index.html by double-clicking it. Firebase JavaScript modules need the
website to be served from a web address such as GitHub Pages.

A. UPDATE YOUR GITHUB REPOSITORY
1. Extract this ZIP.
2. Open your MyFlixV1 repository on GitHub.
3. Select Add file > Upload files.
4. Upload every file from this folder except firestore.rules if you prefer.
5. Commit with: Connect Firebase authentication

B. TURN ON GITHUB PAGES
GitHub Pages on a free GitHub account requires a public repository.
1. Repository > Settings > Pages.
2. Under Build and deployment choose Deploy from a branch.
3. Branch: main, folder: / (root).
4. Save.
5. GitHub will show your website address after deployment.

If you must keep the repository private, use another browser-based host that can
connect to a private GitHub repository.

C. ADD THE DEPLOYED DOMAIN TO FIREBASE
1. Firebase Console > Authentication > Settings.
2. Open Authorised domains.
3. Add your GitHub Pages domain, for example: username.github.io

D. PUBLISH FIRESTORE RULES
1. Firebase Console > Firestore Database > Rules.
2. Replace the existing rules with the contents of firestore.rules.
3. Click Publish.

E. CREATE THE PUBLIC SETTINGS DOCUMENT
1. Firebase Console > Firestore Database > Data.
2. Start collection: settings
3. Document ID: public
4. Add Boolean field: registrationOpen = true
5. Save.

F. CREATE YOUR OWNER ACCOUNT
1. Open your live MyFlix site.
2. Create your own account.
3. Verify your email.
4. Firebase Console > Firestore Database > users > your user document.
5. Change role from "user" to "owner".
Only do this for your own trusted Owner account.

CURRENT PAGES
index.html       Sign in
register.html    Create account
verify.html      Email verification
profiles.html    Protected profile selection
home.html        Protected homepage starter

SECURITY NOTE
The Firebase web config is designed to be present in browser code. Actual access
is controlled by Authentication, Firestore Security Rules and authorised domains.
Never upload a Firebase service-account private key to GitHub.
