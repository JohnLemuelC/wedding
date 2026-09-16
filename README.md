# Wedding Website

A one-page wedding site with animations. Plain HTML, CSS and JavaScript, so there's nothing to build or install. GitHub Pages hosts it for free.

## What's on it

- Envelope intro that opens when a guest taps it
- Hero with the names writing in, a drawn arch, leaf sprigs and falling petals
- Live countdown with rolling numbers, plus Google Calendar and Apple/Outlook buttons
- Our Story timeline that fills in as you scroll
- Ceremony and reception cards, order of the day, dress code and colors
- Photo gallery with a full-screen viewer (keyboard and swipe work)
- Travel and hotel info, FAQ accordion
- RSVP form with validation and a thank-you animation

Guests who have "reduce motion" turned on get the same site without the movement.

## Changing the details

Everything the site says is in `js/config.js`. Edit the names, date, venue, story, schedule, FAQ and so on there. You don't need to touch the HTML.

The date has two parts:
- `start` and `end` drive the countdown and calendar buttons. Keep the timezone at the end, like `+08:00`.
- `displayDate` is the text guests see.

## Adding photos

1. Put the images in the `photos` folder. JPGs around 1600px wide are plenty.
2. In `js/config.js`, set `src: "photos/your-file.jpg"` for gallery items, or `photo: "photos/your-file.jpg"` for story items.

Anything without a photo shows a soft placeholder.

## Saving RSVPs to a Google Sheet

Until this is set up, the form runs in preview mode and nothing is saved.

1. Make a new Google Sheet.
2. Extensions > Apps Script. Replace the code with:

```js
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("RSVPs") || ss.insertSheet("RSVPs");
  const headers = ["submittedAt", "name", "email", "attending", "guests", "meal", "dietary", "song", "message"];
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  sheet.appendRow(headers.map((h) => e.parameter[h] || ""));
  return ContentService.createTextOutput("ok");
}
```

3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
4. Copy the web app URL and paste it into `rsvp.endpoint` in `js/config.js`.

## Testing locally

Open `index.html` in a browser. Add `?nointro` to the address to skip the envelope while you work.

## Search engines

The site has a `noindex` tag so it won't show up on Google. Delete that line in `index.html` if you want it to.
