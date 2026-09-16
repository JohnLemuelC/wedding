/*
  All the wedding details live here. Edit this file to change what the site says.

  Anything with [square brackets] is a placeholder. Items with placeholders are hidden
  from guests automatically, and a section with nothing real in it disappears (along with
  its menu link). Fill one in and it shows up.
*/
window.WEDDING = {
  couple: {
    first: "Nicole",
    second: "Lemuel",
    monogram: "N&L",
    hashtag: ""
  },

  // Ceremony start and when the celebration ends (+08:00 is Philippine time).
  // Drives the countdown and the calendar buttons.
  start: "2026-09-30T14:00:00+08:00",
  end: "2026-09-30T16:00:00+08:00",

  displayDate: "Wednesday, September 30, 2026",
  displayTime: "2:00 PM",
  shortDate: "09 . 30 . 26",
  dateParts: { weekday: "Wednesday", time: "2:00 PM", day: "30", month: "September", year: "2026" },

  hero: {
    eyebrow: "Together with their families",
    tagline: "We're getting married"
  },

  welcome: {
    photo: "photos/together.jpg",
    photoPosition: "50% 50%",
    quote: "Together with our families, we invite you to celebrate the beginning of our forever."
  },

  // The Details, same as the invitation. icon options: church, rings, glass, car
  details: [
    { time: "2:00 PM", title: "Ceremony", icon: "church" },
    { time: "2:45 PM", title: "Say I do!", icon: "rings" },
    { time: "3:00 PM", title: "Party", icon: "glass" },
    { time: "4:00 PM", title: "We say goodbye", icon: "car" }
  ],

  // Add a second entry if the ceremony and reception end up in different places.
  venues: [
    {
      label: "Ceremony & Reception",
      name: "KVN Resort",
      address: "Mamarlao, San Carlos City, Pangasinan",
      mapUrl: "https://maps.app.goo.gl/Te1nAJdtXcPQL9EcA",
      coordinates: "15.928184,120.331205"
    }
  ],

  // label is optional (a year, for example). photo: "photos/your-file.jpg"
  story: [
    { label: "", title: "How We Met", text: "[A short story about how you met.]", photo: "" },
    { label: "", title: "When It All Began", text: "[When it became official.]", photo: "" },
    { label: "", title: "The Journey", text: "[Important memories and milestones along the way.]", photo: "" },
    { label: "", title: "The Proposal", text: "[Your proposal story.]", photo: "" }
  ],
  storyEnding: "After years of growing, laughing, learning, and loving together, we're ready to begin our next chapter as husband and wife.",

  dressCode: {
    title: "The Dress Code",
    colors: [
      { name: "Burgundy", hex: "#440A19", text: "#F3E9DF" },
      { name: "Beige", hex: "#D1B391", text: "#3A2A22" }
    ],
    note: "As this is a formal event, we kindly ask our guests to avoid very short skirts or dresses and opt for elegant, modest, and formal attire.",
    thanks: "Thank you for your understanding and for helping us keep the celebration elegant and respectful."
  },

  rsvp: {
    deadline: "September 15, 2026",
    lead: "Your presence would make our celebration even more meaningful.",
    // How guests RSVP. The first one that's filled in wins:
    // 1. googleFormUrl: a Google Form link, shown as one big button
    // 2. endpoint: a Google Apps Script web app URL, turns on the form on the page (see README)
    // 3. contact: text or call this person (what the invitation says)
    googleFormUrl: "",
    endpoint: "",
    contact: { name: "Nicole D.", phone: "09458612234" },
    smsMessage: "Hi Nicole! RSVP for the wedding on Sept 30. Name: ___ Number of guests: ___",
    maxGuests: 4
  },

  location: {
    // icon options: parking, landmark, route, car
    tips: [
      { icon: "parking", title: "Parking", text: "[Parking information]" },
      { icon: "landmark", title: "Landmarks", text: "[Nearby landmarks]" },
      { icon: "route", title: "Recommended route", text: "[Best way to get there]" },
      { icon: "car", title: "Transportation", text: "[Commute or ride-hailing tips]" }
    ]
  },

  // wide: true makes a landscape photo span two columns.
  gallery: [
    { src: "photos/embrace.jpg", thumb: "photos/thumbs/embrace.jpg", alt: "Nicole and Lemuel in an embrace" },
    { src: "photos/together.jpg", thumb: "photos/thumbs/together.jpg", alt: "Nicole and Lemuel smiling side by side", wide: true },
    { src: "photos/roses-and-hands.jpg", thumb: "photos/thumbs/roses-and-hands.jpg", alt: "Nicole holding red roses while holding Lemuel's hand" },
    { src: "photos/nicole-roses.jpg", thumb: "photos/thumbs/nicole-roses.jpg", alt: "Nicole holding a bouquet of red roses" },
    { src: "photos/lemuel-seated.jpg", thumb: "photos/thumbs/lemuel-seated.jpg", alt: "Lemuel smiling, seated on a stool" },
    { src: "photos/nicole-portrait.jpg", thumb: "photos/thumbs/nicole-portrait.jpg", alt: "Close portrait of Nicole with roses" },
    { src: "photos/holding-hands.jpg", thumb: "photos/thumbs/holding-hands.jpg", alt: "Nicole and Lemuel holding hands" },
    { src: "photos/lemuel-standing.jpg", thumb: "photos/thumbs/lemuel-standing.jpg", alt: "Lemuel standing with hands in pockets" }
  ],

  sharePhotos: {
    // Google Drive folder link. Set sharing so anyone with the link can add files.
    url: "[Google Drive folder link]",
    lead: "There will be moments we won't get to see.",
    text: "So while you're celebrating with us, we'd love for you to capture the little moments, funny memories, and beautiful memories from your perspective.",
    note: "Your photos will help us relive our wedding day through your eyes."
  },

  gifts: {
    intro: [
      "Your presence at our wedding is already the greatest gift we could ask for.",
      "But for those who wish to bless us as we begin this new chapter, we've provided the following information:"
    ],
    // copy: true adds a Copy button. qr: "photos/gcash-qr.png" shows a QR code.
    options: [
      {
        label: "GCash",
        qr: "",
        details: [
          { key: "Name", value: "[Account name]" },
          { key: "Number", value: "[GCash number]", copy: true }
        ]
      },
      {
        label: "Bank transfer",
        qr: "",
        details: [
          { key: "Bank", value: "[Bank name]" },
          { key: "Name", value: "[Account name]" },
          { key: "Account no.", value: "[Account number]", copy: true }
        ]
      }
    ]
  },

  contact: {
    lead: "For questions about the wedding, feel free to contact:",
    people: [
      { name: "Nicole D.", role: "", phone: "09458612234" }
    ],
    messengerUrl: "" // e.g. "https://m.me/yourusername"
  },

  // {deadline} becomes the RSVP deadline. Questions answered with [Answer] stay hidden.
  faq: [
    { q: "What time should I arrive?", a: "The ceremony starts at 2:00 PM, so please arrive a little before then." },
    { q: "Where is the wedding?", a: "At KVN Resort in Mamarlao, San Carlos City, Pangasinan. There's a map in the How to Get There section." },
    { q: "What should I wear?", a: "Formal attire in burgundy or beige. Please skip very short skirts or dresses and go for something elegant and modest." },
    { q: "When do I need to RSVP by?", a: "Please RSVP before {deadline} by texting or calling Nicole D. at 0945 861 2234." },
    { q: "Is the ceremony indoors or outdoors?", a: "[Answer]" },
    { q: "Can I bring a plus one?", a: "[Answer]" },
    { q: "Is there parking?", a: "[Answer]" },
    { q: "Can children attend?", a: "[Answer]" },
    { q: "Can I share this invitation?", a: "We kindly ask that you keep this invitation to yourself and not share or forward it to others. We're celebrating this day with the people closest to our hearts." },
    { q: "Who can I contact if I have questions?", a: "Nicole D. at 0945 861 2234." }
  ],

  closing: {
    title: "Thank you for being part of our story",
    text: "We can't wait to celebrate this beautiful day with the people we love.",
    request: "We kindly ask that you keep this invitation to yourself and not share or forward it to others. Your understanding means so much to us as we celebrate this special day with the people closest to our hearts."
  }
};
