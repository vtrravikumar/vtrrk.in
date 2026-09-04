export interface Book {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  cover: string;
  access: {
    type: "amazon" | "free";
    label: string;
    url: string;
  };
}

export const books: Book[] = [
  {
    slug: "engineering-home",
    title: "Engineering Home",
    subtitle: "Rediscovering the Engineer Beyond the Workplace",
    description: "An engineering memoir about rediscovering the engineer within after leaving the traditional workplace. From decades in technology to building a home lab, this is a story about curiosity, experimentation, failure, and the enduring mindset of an engineer.",
    cover: "/images/books/engineering-home.png",
    access: {
      type: "amazon",
      label: "Buy / read",
      url: "https://www.amazon.in/Engineering-Home-Rediscovering-Engineer-Workplace-ebook/dp/B0HDZFP4CF/",
    },
  },
  {
    slug: "gen-z",
    title: "Gen Z",
    subtitle: "Generation Zero",
    description: "A candid exploration of growing up and finding your place in a world shaped by technology, changing expectations, and a generation that has inherited a very different future. Written for Gen Z, but with something to say to anyone trying to understand them.",
    cover: "/images/books/gen-z.png",
    access: {
      type: "amazon",
      label: "Buy / read",
      url: "https://www.amazon.in/Gen-Z-Generation-Ravi-Kumar-ebook/dp/B0HF57Y74L/",
    },
  },
  {
    slug: "the-white-envelope",
    title: "The White Envelope",
    description: "A story of choices, uncertainty, relationships, and the moments that can quietly change the course of a life. The White Envelope is a personal story about what lies behind an ordinary-looking envelope — and the consequences that follow.",
    cover: "/images/books/the-white-envelope.png",
    access: {
      type: "amazon",
      label: "Buy / read",
      url: "https://www.amazon.in/White-Envelope-V-Ravi-Kumar/dp/B0HDNSG816/",
    },
  },
  {
    slug: "travelogue",
    title: "Travelogue",
    description: "Twenty years of journeys, captured through memories, photographs, people and moments that stayed behind long after the bags were unpacked. A personal travelogue across India and the world.",
    cover: "/images/books/travelogue.png",
    access: {
      type: "free",
      label: "Get for free",
      url: "/books/travelogue/",
    },
  },
];
