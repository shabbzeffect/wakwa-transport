# Demo images — bundled, no hotlinking

All files in `assets/img/*.jpg` are **demo placeholders** (Unsplash License:
free to use, no attribution required). Swap any file with a real WAKWA photo
using the same filename — zero code changes needed.

| File | Used in | Shows | Size |
|---|---|---|---|
| `hero-tippers.jpg` | `index.html` hero | Highway at dawn | 1800px, 237KB |
| `case-housing.jpg` | `index.html` case spotlight | Construction site | 1000px, 151KB |
| `about-depot.jpg` | `about.html` | Depot yard, tippers | 1200px, 226KB |
| `about-site.jpg` | `about.html` | Tower crane on site | 1200px, 195KB |
| `project-road.jpg` | `projects.html` (murram-road) | Highway corridor | 1000px, 85KB |
| `project-housing.jpg` | `projects.html` (slab-400) | Crane on housing site | 1000px, 145KB |
| `project-relief.jpg` | `projects.html` (relief) | Freight/containers | 1000px, 157KB |
| `project-move.jpg` | `projects.html` (relocation), fleet vans | Delivery fleet | 1000px, 81KB |
| `fleet-highway.jpg` | `fleet.html` (tippers/tanker/flatbed), blog tipper guide | Trucks on highway | 1000px, 103KB |
| `fleet-warehouse.jpg` | `fleet.html` (box/van/skip/reefer/hooklift) | Warehouse aisle | 1000px, 141KB |
| `fleet-plant.jpg` | `fleet.html` (lowbed/plant), blog hazmat guide | Industrial plant | 1000px, 135KB |
| `favicon.svg` | all pages | WAKWA wordmark | vector |

Sources (Unsplash photo IDs): `1519003722824-194d4455a60c`,
`1541888946425-d81bb19240f5`, `1504307651254-35680f356dfd`,
`1586528116311-ad8dd3c8310d`, `1494412574643-ff11b0a5c1c3`,
`1601584115197-04ecc0da31d7`, `1501700493788-fa1a4fc9fe62`,
`1553413077-190dd305871c`, `1516937941344-00b4e0337589`.
Fleet cards map categories → photos in `fleetPic()` (`fleet.html`);
blog covers come from the `pic` field in `WAKWA_POSTS` (`content/data.js`).

## Replacing with real photos
1. Resize to the same width as the file above (keeps `width`/`height` attrs
   accurate → no layout shift). Export JPEG q70–75 or WebP.
2. Overwrite the file, keep the name. Done — no HTML edits.
3. Project covers come from the `pic` field in `content/data.js`
   (`WAKWA_PROJECTS`); point it at a new file to change one cover.
