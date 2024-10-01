const locations = [
  {
    region: "Arusha",
    district: [
      {
        name: "Arumeru",
      },
      {
        name: "Arusha",
      },
      {
        name: "Ngorongoro",
      },
      {
        name: "Longido",
      },
      {
        name: "Monduli",
      },
      {
        name: "Karatu",
      },
    ],
  },
  {
    region: "Dar Es Salaam",
    district: [
      {
        name: "Kinondoni",
      },
      {
        name: "Ilala",
      },
      {
        name: "Temeke",
      },
      {
        name: "Kigamboni",
      },
      {
        name: "Ubungo",
      },
    ],
  },
  {
    region: "Dodoma",
    district: [
      {
        name: "Chamwino",
      },
      {
        name: "Dodoma",
      },
      {
        name: "Chemba",
      },
      {
        name: "Kondoa",
      },
      {
        name: "Bahi",
      },
      {
        name: "Mpwapwa",
      },
      {
        name: "Kongwa",
      },
    ],
  },
  {
    region: "Iringa",
    district: [
      {
        name: "Mufindi",
      },
      {
        name: "Kilolo",
      },
      {
        name: "Iringa",
      },
    ],
  },
  {
    region: "Kagera",
    district: [
      {
        name: "Biharamulo",
      },
      {
        name: "Muleba",
      },
      {
        name: "Kyerwa",
      },
      {
        name: "Bukoba",
      },
      {
        name: "Ngara",
      },
      {
        name: "Missenyi",
      },
    ],
  },
  {
    region: "Katavi",
    district: [
      {
        name: "Mlele",
      },
      {
        name: "Mpanda",
      },
      {
        name: "Tanganyika",
      },
    ],
  },
  {
    region: "Kigoma",
    district: [
      {
        name: "Kigoma",
      },
      {
        name: "Kasulu",
      },
      {
        name: "Kakonko",
      },
      {
        name: "Uvinza",
      },
      {
        name: "Buhigwe",
      },
      {
        name: "Kibondo",
      },
    ],
  },
  {
    region: "Kilimanjaro",
    district: [
      {
        name: "Siha",
      },
      {
        name: "Moshi",
      },
      {
        name: "Mwanga",
      },
      {
        name: "Rombo",
      },
      {
        name: "Hai",
      },
      {
        name: "Same",
      },
    ],
  },
  {
    region: "Lindi",
    district: [
      {
        name: "Nachingwea",
      },
      {
        name: "Ruangwa",
      },
      {
        name: "Liwale",
      },
      {
        name: "Lindi",
      },
      {
        name: "Kilwa",
      },
    ],
  },
  {
    region: "Manyara",
    district: [
      {
        name: "Babati",
      },
      {
        name: "Mbulu",
      },
      {
        name: "Hanang’",
      },
      {
        name: "Kiteto",
      },
      {
        name: "Simanjiro",
      },
    ],
  },
  {
    region: "Mara",
    district: [
      {
        name: "Rorya",
      },
      {
        name: "Serengeti",
      },
      {
        name: "Bunda",
      },
      {
        name: "Butiama",
      },
      {
        name: "Tarime",
      },
      {
        name: "Musoma",
      },
    ],
  },
  {
    region: "Mbeya",
    district: [
      {
        name: "Chunya",
      },
      {
        name: "Kyela",
      },
      {
        name: "Mbeya",
      },
      {
        name: "Rungwe",
      },
      {
        name: "Mbarali",
      },
    ],
  },
  {
    region: "Morogoro",
    district: [
      {
        name: "Gairo",
      },
      {
        name: "Kilombero",
      },
      {
        name: "Mvomero",
      },
      {
        name: "Morogoro",
      },
      {
        name: "Ulanga",
      },
      {
        name: "Kilosa",
      },
      {
        name: "Malinyi",
      },
    ],
  },
  {
    region: "Mtwara",
    district: [
      {
        name: "Newala",
      },
      {
        name: "Nanyumbu",
      },
      {
        name: "Mtwara",
      },
      {
        name: "Masasi",
      },
      {
        name: "Tandahimba",
      },
    ],
  },
  {
    region: "Mwanza",
    district: [
      {
        name: "Ilemela",
      },
      {
        name: "Kwimba",
      },
      {
        name: "Sengerema",
      },
      {
        name: "Nyamagana",
      },
      {
        name: "Magu",
      },
      {
        name: "Ukerewe",
      },
      {
        name: "Misungwi",
      },
    ],
  },
  {
    region: "Njombe",
    district: [
      {
        name: "Njombe",
      },
      {
        name: "Ludewa",
      },
      {
        name: "Wanging’ombe",
      },
      {
        name: "Makete",
      },
    ],
  },
  {
    region: "Pwani",
    district: [
      {
        name: "Bagamoyo",
      },
      {
        name: "Mkuranga",
      },
      {
        name: "Rufiji",
      },
      {
        name: "Mafia",
      },
      {
        name: "Kibaha",
      },
      {
        name: "Kisarawe",
      },
      {
        name: "Kibiti",
      },
    ],
  },
  {
    region: "Rukwa",
    district: [
      {
        name: "Sumbawanga",
      },
      {
        name: "Nkasi",
      },
      {
        name: "Kalambo",
      },
    ],
  },
  {
    region: "Ruvuma",
    district: [
      {
        name: "Namtumbo",
      },
      {
        name: "Mbinga",
      },
      {
        name: "Nyasa",
      },
      {
        name: "Tunduru",
      },
      {
        name: "Songea",
      },
    ],
  },
  {
    region: "Shinyanga",
    district: [
      {
        name: "Kishapu",
      },
      {
        name: "Kahama",
      },
      {
        name: "Shinyanga",
      },
    ],
  },
  {
    region: "Simiyu",
    district: [
      {
        name: "Busega",
      },
      {
        name: "Maswa",
      },
      {
        name: "Bariadi",
      },
      {
        name: "Meatu",
      },
      {
        name: "Itilima",
      },
    ],
  },
  {
    region: "Singida",
    district: [
      {
        name: "Mkalama",
      },
      {
        name: "Manyoni",
      },
      {
        name: "Singida",
      },
      {
        name: "Ikungi",
      },
      {
        name: "Iramba",
      },
    ],
  },
  {
    region: "Songwe",
    district: [
      {
        name: "Songwe",
      },
      {
        name: "Ileje",
      },
      {
        name: "Mbozi",
      },
      {
        name: "Momba",
      },
    ],
  },
  {
    region: "Tabora",
    district: [
      {
        name: "Nzega",
      },
      {
        name: "Kaliua",
      },
      {
        name: "Igunga",
      },
      {
        name: "Sikonge",
      },
      {
        name: "Tabora",
      },
      {
        name: "Urambo",
      },
      {
        name: "Uyui",
      },
    ],
  },
  {
    region: "Tanga",
    district: [
      {
        name: "Tanga",
      },
      {
        name: "Muheza",
      },
      {
        name: "Mkinga",
      },
      {
        name: "Pangani",
      },
      {
        name: "Handeni",
      },
      {
        name: "Korogwe",
      },
      {
        name: "Kilindi",
      },
      {
        name: "Lushoto",
      },
    ],
  },
];

export default locations;
