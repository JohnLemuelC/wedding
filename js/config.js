/*
  All the wedding details live here. Edit this file to change what the site says.
  Everything below is placeholder content.
*/
window.WEDDING = {
  couple: {
    first: "Olivia",
    second: "James",
    monogram: "O&J",
    hashtag: "#OliviaAndJames2027"
  },

  // Start and end of the celebration. Keep the timezone offset at the end
  // (+08:00 is Manila time). Drives the countdown and the calendar buttons.
  start: "2027-05-15T15:30:00+08:00",
  end: "2027-05-15T23:00:00+08:00",

  displayDate: "Saturday, May 15, 2027",
  shortDate: "05 . 15 . 27",
  venue: "The Rosewood Estate",
  city: "Hillcrest",
  intro: "Together with their families",
  footerNote: "We can't wait to celebrate with you.",

  // Add a photo by putting the file in the photos folder and setting photo: "photos/your-file.jpg"
  story: [
    {
      year: "2018",
      title: "First hello",
      text: "We met at a friend's birthday dinner and kept talking until the restaurant turned the lights off.",
      photo: ""
    },
    {
      year: "2020",
      title: "The long-distance year",
      text: "Two cities, a lot of late-night video calls, and more airport goodbyes than either of us wants to count.",
      photo: ""
    },
    {
      year: "2023",
      title: "Same address",
      text: "We moved in together with one crooked couch and a plant we are somehow still keeping alive.",
      photo: ""
    },
    {
      year: "2026",
      title: "The question",
      text: "A quiet walk at sunset, one ring, and the fastest yes in history.",
      photo: ""
    }
  ],

  // icon options: rings, glass
  events: [
    {
      type: "Ceremony",
      icon: "rings",
      time: "4:00 PM",
      venue: "Rosewood Garden Chapel",
      address: "1 Rosewood Lane, Hillcrest",
      mapUrl: "" // leave empty to search the venue + address on Google Maps
    },
    {
      type: "Reception",
      icon: "glass",
      time: "6:00 PM",
      venue: "The Glasshouse at Rosewood",
      address: "1 Rosewood Lane, Hillcrest",
      mapUrl: ""
    }
  ],

  schedule: [
    { time: "3:30 PM", title: "Guests arrive", note: "Find your seat and grab something cold to drink." },
    { time: "4:00 PM", title: "Ceremony", note: "In the garden chapel." },
    { time: "5:00 PM", title: "Cocktail hour", note: "Drinks, snacks, and music on the lawn." },
    { time: "6:30 PM", title: "Dinner", note: "Served in the Glasshouse." },
    { time: "8:00 PM", title: "First dance", note: "After that, the dance floor is yours." },
    { time: "11:00 PM", title: "Send-off", note: "Sparklers on the front steps." }
  ],

  dressCode: "Garden formal. Suits, dresses, soft colors. The ceremony is on grass, so maybe leave the stilettos at home.",
  palette: ["#7D8C6F", "#E8C8BC", "#B08D57", "#EADFCB", "#4E5B45"],

  // Up to any number of photos. src: "photos/your-file.jpg"
  gallery: [
    { src: "", alt: "", caption: "The night we met" },
    { src: "", alt: "", caption: "Our first trip" },
    { src: "", alt: "", caption: "Sunday mornings" },
    { src: "", alt: "", caption: "Moving day" },
    { src: "", alt: "", caption: "The proposal" },
    { src: "", alt: "", caption: "Engagement shoot" }
  ],

  // icon options: pin, bed, car
  travel: [
    {
      icon: "pin",
      title: "Getting there",
      text: "The estate is about 90 minutes from the city. There is free parking on site.",
      links: [{ label: "Open in Maps", url: "" }]
    },
    {
      icon: "bed",
      title: "Where to stay",
      text: "We've held a block of rooms at these two places. Mention our names when you book.",
      list: [
        { name: "The Hillcrest Inn", note: "5 min drive", url: "" },
        { name: "Maple House B&B", note: "10 min drive", url: "" }
      ]
    },
    {
      icon: "car",
      title: "Shuttle",
      text: "A shuttle leaves The Hillcrest Inn at 3:00 PM and brings everyone back at 11:30 PM."
    }
  ],

  // {deadline} gets replaced with the RSVP deadline below
  faq: [
    {
      q: "When do I need to RSVP by?",
      a: "Please reply by {deadline} so we can give the caterer final numbers."
    },
    {
      q: "Can I bring a plus one?",
      a: "Your invitation lists everyone who's included. If it says \"and guest\", bring whoever you like."
    },
    {
      q: "Are kids welcome?",
      a: "We love your little ones, but the celebration is adults only. Babies in arms are fine."
    },
    {
      q: "Can I take photos during the ceremony?",
      a: "We're asking for an unplugged ceremony, so phones away until we walk back down the aisle. Our photographer has it covered. At the reception, snap away."
    },
    {
      q: "Do you have a registry?",
      a: "Having you there is the gift. If you'd still like to give something, a contribution to our honeymoon fund would mean a lot."
    },
    {
      q: "Is there parking?",
      a: "Yes. Free parking on site, and the shuttle runs from The Hillcrest Inn."
    }
  ],

  rsvp: {
    deadline: "April 1, 2027",
    // Paste a Google Apps Script web app URL here to save RSVPs to a Google Sheet (see README).
    // While empty, the form runs in preview mode and nothing is saved.
    endpoint: "",
    maxGuests: 4,
    meals: ["Beef", "Fish", "Vegetarian"] // set to [] to hide the meal question
  }
};
