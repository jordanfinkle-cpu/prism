# Prism icon set

274 icons from [icons.download](https://icons.download/) by Vitaly Belousov.
Free to use in any project, personal or commercial ([license](https://icons.download/license)).

## Style

The whole set was pulled in one style — the one selected in the switcher:

| Setting | Value |
| --- | --- |
| Stroke | `medium` |
| Fill | `outline` |
| Corners | `sharp` |

Source URL pattern: `https://icons.download/icons/medium/outline/sharp/<category>/<name>.svg`

To re-pull a different style, swap the three path segments
(`bold\|medium\|regular\|thin` / `outline\|solid` / `round\|sharp`).

## Layout

```
public/icons/
  <category>/<name>.svg   # 24×24 viewBox, single path, fill="currentColor"
  MANIFEST.json           # every icon: file, display name, category, search tags
```

| Category | Count | | Category | Count |
| --- | --- | --- | --- | --- |
| arrows | 51 | | files | 21 |
| design | 32 | | content | 15 |
| multimedia | 30 | | navigation | 15 |
| communication | 29 | | date-and-time | 12 |
| commerce | 28 | | devices | 7 |
| interface | 22 | | education | 6 |
| | | | system | 6 |

## Usage

Every icon is a 24×24 `<svg>` with a single filled path. The upstream files ship
`fill="black"`; these were converted to `fill="currentColor"` so they inherit text
color and work in both themes.

As a plain `<img>` (no color inheritance — fine for fixed-color chrome):

```jsx
<img src="/icons/multimedia/mic.svg" width={20} height={20} alt="" />
```

Inline, so `currentColor` and CSS sizing apply — matches how `src/icons.jsx` works today:

```jsx
export const MicIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
    <path fillRule="evenodd" clipRule="evenodd" d="…" fill="currentColor" />
  </svg>
)
```

With Vite you can also import the raw markup: `import mic from '/icons/multimedia/mic.svg?raw'`.

## Mapping to Prism surfaces

The 131 icons below cover the app's current and near-term UI. The rest of the
library is there for whatever comes next.

### Recording / capture
`multimedia/`: `mic`, `mic-off`, `play`, `pause`, `stop`, `headphones`, `headphones-micro`,
`sound`, `sound-off`, `video-camera`, `video-camera-off`, `subtitles`, `fast-forward`,
`skip-next`, `skip-previous`

### Notes & editing
`files/file-text`, `files/file`, `files/file-plus`, `design/pen`, `design/pencil`,
`content/edit`, `content/copy`, `design/text-align-left`, `design/list`,
`content/paper-clip`, `content/push-pin`, `files/clipboard-text`, `files/image`

### Folders & organization
`files/folder`, `files/folder-plus`, `files/archive`, `commerce/tag`, `education/bookmark`,
`design/layout`, `design/sidebar`, `design/grid-four`, `design/apps`, `design/rows`, `design/columns`

### Tasks
`interface/check`, `interface/check-circle`, `interface/checks`, `interface/plus-circle`,
`interface/minus-circle`, `commerce/star`, `date-and-time/alarm`, `date-and-time/snooze`,
`date-and-time/timer`

### Meetings & calendar
`date-and-time/`: `calendar`, `calendar-check`, `calendar-x`, `clock`, `history`, `hourglass`
`communication/`: `users`, `user`, `user-circle`, `user-add`, `phone`, `phone-incoming`,
`phone-outgoing`, `phone-missed`, `contacts`

### Navigation & chrome
`navigation/house`, `interface/search`, `interface/settings`, `interface/settings-alt`,
`interface/sliders`, `interface/menu`, `interface/close`, `interface/more-horizontal`,
`interface/more-vertical`, `interface/drag-vertical`, `arrows/caret-down`, `arrows/caret-right`,
`arrows/small-caret-down`, `arrows/arrow-left`, `arrows/arrow-right`, `arrows/unfold-more`,
`arrows/unfold-less`, `arrows/maximize`, `arrows/minimize`

### AI / assistant
`content/lightning`, `content/light-bulb`, `communication/chat`, `communication/message-square`,
`communication/message-circle`, `communication/send`, `design/cursor`, `commerce/chart`

### Sharing & export
`communication/share`, `communication/share-network`, `communication/link`, `communication/mail`,
`arrows/download`, `arrows/upload`, `arrows/external-link`, `files/cloud-upload`,
`files/cloud-download`, `files/save`, `commerce/qr-code`

### Sync & status
`arrows/sync`, `arrows/refresh`, `files/cloud`, `files/cloud-check`, `files/cloud-slash`,
`system/alert`, `system/alert-triangle`, `system/info`, `system/question`,
`system/error-octagon`, `system/block`

### Account & privacy
`content/lock`, `content/lock-open`, `content/shield`, `content/shield-check`, `content/key`,
`content/eye`, `content/eye-slash`, `arrows/sign-in`, `arrows/sign-out`, `files/bin`, `files/bin-simple`

### Theme & devices
`date-and-time/sun`, `date-and-time/moon`, `devices/desktop`, `devices/laptop`,
`devices/smartphone`, `devices/tablet`, `multimedia/bell`, `multimedia/bell-off`

## Gaps

The library has no icon for these existing Prism glyphs — keep the hand-rolled versions
in `src/icons.jsx`: the Prism `Tri` mark, and the Claude / Google / Microsoft brand logos
(brand marks are never in a generic icon set). `FolderSwapIcon` has no direct match either;
closest options are `files/folder` + `arrows/sync`, or `arrows/repeat`.
