# Online keyboard wallpaper catalog

This folder contains the GitHub Pages site and catalog for the app's
**Online images** tab. Upload the *contents* of this folder (not the folder
itself) to the root of the `oxpc/jetbgimg` repository. The app loads:

`https://oxpc.github.io/jetbgimg/index.json`

Place full-size artwork in `images/` and optional smaller previews in `thumbs/`.
Open `https://oxpc.github.io/jetbgimg/`, add each image's path and attribution,
then download the updated `index.json` and commit it to the repository. GitHub
Pages serves the files from the committed repository; the browser editor does
not write to GitHub. Enable GitHub Pages for the repository (for example, deploy
the `main` branch root) so the app can read the published JSON and images.

The JSON contract is:

```json
{
  "version": 1,
  "images": [
    {
      "id": "addis-at-dusk",
      "name": "Addis at dusk",
      "image": "images/addis-at-dusk.webp",
      "thumbnail": "thumbs/addis-at-dusk.webp",
      "author": "Artist or source"
    }
  ]
}
```

`thumbnail` and `author` are optional. Image paths may be relative to this
folder or absolute HTTPS URLs. Only publish images you have the rights to
distribute.
