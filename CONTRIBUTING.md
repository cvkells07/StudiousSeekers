# Contributing to StudiousSeekers

This doc explains how we work together on this project. If you forget a command, just copy-paste from here — that's what it's for.

## Getting set up (do this once)

1. **Clone the repo** (download it to your computer):
   ```
   git clone https://github.com/cvkells07/StudiousSeekers.git
   cd StudiousSeekers
   ```

2. **Set up the React app** (this is in the `client` folder, built with Vite):
   ```
   cd client
   npm install
   npm run dev
   ```
   This prints a local URL (like `http://localhost:5173`) — open it in your browser to see the app. Press Ctrl+C in the terminal to stop it when you're done. Run `git checkout ..` back to the root when you're ready to move on.

3. **Set up the Python app** (this is in the `server` folder, built with FastAPI — do this in a separate terminal window/tab so React can keep running):
   ```
   cd server
   python -m venv venv
   ```
   Then activate it — **Mac/Linux**: `source venv/bin/activate` — **Windows**: `venv\Scripts\activate`
   You'll know it worked if you see `(venv)` at the start of your terminal line. Then:
   ```
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
   This prints a local URL (like `http://127.0.0.1:8000`) — open it in your browser to confirm it's running. Also check `http://127.0.0.1:8000/docs` to see the interactive API docs. Press Ctrl+C to stop it when you're done.

   **Important:** never edit anything inside the `venv` folder directly, and don't worry if you don't see it tracked in git — it's intentionally ignored (see the `.gitignore` note below).

If any of these steps error out, don't struggle alone — post in our group chat right away.

## A note on .gitignore

Both `client` and `server` have a `.gitignore` file that tells git to skip certain folders (`node_modules` in client, `venv` in server) because they're huge, personal to your machine, and don't need to be shared. If you ever run `git status` and see hundreds of unfamiliar files suddenly show up, **stop before committing** — it likely means a `.gitignore` got skipped or corrupted, and it's worth double-checking with the team before pushing.

## Authenticating with GitHub (do this once per computer)

GitHub no longer accepts your normal account password for git operations like `push`. Instead, you need a **Personal Access Token**:

1. Go to `https://github.com/settings/tokens` while logged into GitHub
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name (e.g. "my laptop"), set an expiration, and check the **repo** scope
4. Click **Generate token** and copy it immediately — GitHub only shows it once
5. Next time git asks for a password (e.g. during `git push`), paste this token instead of your actual password

If git isn't prompting you at all and instead fails silently with an auth error, it may have an old/invalid credential cached. On Windows, open **Credential Manager** → **Windows Credentials** → find the `git:https://github.com` entry → remove it, then try again.

## How we use branches (our workflow)

We never write code directly on `main`. `main` is our "official" version — it should always work. Instead, everyone works on their own **branch**, which is basically a safe copy of the project where you can experiment without breaking anyone else's work.

### Starting new work

1. Make sure your `main` is up to date:
   ```
   git checkout main
   git pull origin main
   ```

2. Create your branch (name it after what you're building):
   ```
   git checkout -b feature/your-feature-name
   ```
   Examples: `feature/client-search-bar`, `feature/server-spots-api`, `feature/boost-voting`

3. Now write your code!

### Saving your work

Do this often — don't wait until you're "done":

```
git add .
git commit -m "short description of what you did"
```

Example: `git commit -m "add filter dropdown to search bar"`

### Sharing your work / asking for it to be added to main

1. Push your branch to GitHub:
   ```
   git push -u origin feature/your-feature-name
   ```
   (You only need `-u origin feature/your-feature-name` the very first time you push this branch — after that, just `git push`.)

2. Go to GitHub in your browser. You'll see a banner offering to open a **Pull Request (PR)**. Click it.

3. Write a short description of what you built. Tag the team lead (or whoever's reviewing) for a look.

4. Once it's approved, it gets merged into `main`. GitHub will ask if you want to delete your branch afterward — say yes, it keeps things tidy.

## Keeping your branch up to date

If you're working on something for more than a day or two, other people's merged work will start to drift ahead of you. Every so often, run:

```
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main
```

If this causes a "merge conflict," don't panic — just message the group chat and we'll sort it out together.

## Checking your code style (linting)

Before opening a PR, run the linter from inside `client` to catch common mistakes:
```
npm run lint
```
It'll either say no problems found, or list warnings/errors with file names and line numbers to fix.

## Commit message style

Keep it short and describe *what changed*, not how you felt about it:
- Good: `fix filter bug on mobile view`
- Not as helpful: `stuff` or `updates`

## Questions?

If you're stuck on git, code, or anything else — ask in the group chat before you spend more than ~20 minutes stuck alone. We're all still learning this.
