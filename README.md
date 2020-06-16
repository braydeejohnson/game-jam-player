# game-jam-player
This is an example project for a game jam player using [Electron](https://www.electronjs.org/), [Vuejs](https://vuejs.org/), and [Tailwindcss](https://tailwindcss.com/)

The target of this example was to demonstrate the simple setup of an electron project and use common Nodejs packages to create the target list of needs for the player.

Example includes:
- Entries loaded from the `public/Entries` folder
- Automatic Folder parsing/detection for Entries (based on GMC Jam Player's current folder approach)
- `.exe` and `README` file scans within each Entry folder
- Reloading application rescans directories for changes and rebuilds the `Entries` list
- Sorts and Filters (Played, Unplayed, Ranked, Unranked, Name Sort, Rank Sort, Name Search Query)
- Drag and Drop Best ofs
- Simple Up/Down Vote Ranking
- Entry Details Panel with Name/Authors/Screenshot(Mock)/Readme/Game Launch Button
- Entry played tracking

## Project setup
Install npm dependencies based on the `package.json`
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Compiles and minifies for production
```
npm run electron:build
```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
