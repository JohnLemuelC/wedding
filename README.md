# Nicole & Lemuel

Wedding website for September 30, 2026. Plain HTML, CSS and JavaScript, so there's nothing to build or install. GitHub Pages hosts it for free.

## What's on it

- Envelope invitation that opens when a guest taps it
- Home: names writing in on satin, calla lilies drawing themselves, falling petals, date and venue
- Welcome photo and quote, live countdown, Google Calendar and Apple/Outlook buttons
- The Details: ceremony, "I do", party and goodbye times with animated icons
- Dress code (burgundy + beige), RSVP, map to KVN Resort, photo gallery with a full-screen viewer
- Need Help contact card, FAQ, closing note

Sections still waiting on info stay hidden: Our Story, Share Your Photos, Gifts, and the location tips.

Guests with "reduce motion" turned on get the same site without the movement.

## Changing the details

Everything the site says is in `js/config.js`. You don't need to touch the HTML.

Anything with `[square brackets]` is a placeholder. The site hides those items from guests, and a section with nothing real in it disappears along with its menu link. Replace the brackets with real text and it shows up.

The date has two parts:
- `start` and `end` drive the countdown and calendar buttons. Keep the timezone at the end (`+08:00`).
- `displayDate`, `displayTime` and `dateParts` are the text guests see.

The link preview on Messenger comes from the `og:` tags at the top of `index.html` and the image `assets/share.jpg`.

## Adding photos

1. Put the image in `photos` (around 1800px on the long side) and a smaller copy in `photos/thumbs` (around 1080px).
2. Add it to `gallery` in `js/config.js`. Use `wide: true` for a landscape photo.

## How guests RSVP

The first option that's filled in under `rsvp` in `js/config.js` wins:

1. `googleFormUrl`: a Google Form link. The RSVP section becomes one big button.
2. `endpoint`: turns on the form on the page and saves replies to a Google Sheet (setup below).
3. `contact`: big Text and Call buttons for the person listed. This is what it uses now.

### Saving RSVPs to a Google Sheet

1. Make a new Google Sheet.
2. Extensions > Apps Script. Replace the code with:

```js
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("RSVPs") || ss.insertSheet("RSVPs");
  const headers = ["submittedAt", "name", "phone", "attending", "guests", "dietary", "message"];
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  sheet.appendRow(headers.map((h) => e.parameter[h] || ""));
  return ContentService.createTextOutput("ok");
}
```

3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
4. Paste the web app URL into `rsvp.endpoint`.

## Testing locally

Run `python -m http.server` in this folder and open http://localhost:8000. Add `?nointro` to skip the envelope while you work.

## Search engines

The site has a `noindex` tag so it won't show up on Google.
