import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";
import interior from "@/assets/interior.jpg";
import hero from "@/assets/hero-villa.jpg";

export type Property = {
  slug: string;
  name: string;
  location: string;
  price: string;
  area: string;
  beds: number;
  baths: number;
  status: "Ready to Move" | "Under Construction" | "New Launch";
  type: "Apartment" | "Villa" | "Commercial" | "Penthouse";
  amenities: string[];
  image: string;
};

export const properties: Property[] = [
  {
    slug: "the-aurelia-residences",
    name: "The Aurelia Residences",
    location: "Golf Course Road, Gurugram",
    price: "₹ 6.40 Cr onwards",
    area: "3,240 sq.ft.",
    beds: 4,
    baths: 5,
    status: "Ready to Move",
    type: "Penthouse",
    amenities: ["Private Sky Deck", "Concierge", "Infinity Pool"],
    image: prop1,
  },
  {
    slug: "vantara-hill-villas",
    name: "Vantara Hill Villas",
    location: "Lonavala, Maharashtra",
    price: "₹ 9.10 Cr onwards",
    area: "5,800 sq.ft.",
    beds: 5,
    baths: 6,
    status: "New Launch",
    type: "Villa",
    amenities: ["Valley View", "Home Theatre", "Private Pool"],
    image: prop2,
  },
  {
    slug: "meridian-business-tower",
    name: "Meridian Business Tower",
    location: "BKC, Mumbai",
    price: "₹ 4.25 Cr onwards",
    area: "2,100 sq.ft.",
    beds: 0,
    baths: 2,
    status: "Under Construction",
    type: "Commercial",
    amenities: ["Grade A Office", "Valet Parking", "LEED Gold"],
    image: prop3,
  },
  {
    slug: "the-monarch-collection",
    name: "The Monarch Collection",
    location: "Jubilee Hills, Hyderabad",
    price: "₹ 5.75 Cr onwards",
    area: "3,900 sq.ft.",
    beds: 4,
    baths: 4,
    status: "Ready to Move",
    type: "Apartment",
    amenities: ["Italian Marble", "Private Lift", "Club House"],
    image: interior,
  },
  {
    slug: "solaire-cliff-estate",
    name: "Solaire Cliff Estate",
    location: "ECR, Chennai",
    price: "₹ 12.80 Cr onwards",
    area: "7,400 sq.ft.",
    beds: 6,
    baths: 7,
    status: "New Launch",
    type: "Villa",
    amenities: ["Sea Facing", "Infinity Edge Pool", "Staff Quarters"],
    image: hero,
  },
  {
    slug: "the-north-quay",
    name: "The North Quay",
    location: "Kharadi, Pune",
    price: "₹ 2.95 Cr onwards",
    area: "1,860 sq.ft.",
    beds: 3,
    baths: 3,
    status: "Under Construction",
    type: "Apartment",
    amenities: ["Sky Lounge", "Co-work Suite", "Wellness Spa"],
    image: prop1,
  },
];
