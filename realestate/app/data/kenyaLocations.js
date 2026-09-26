// Kenya's 47 counties (official county codes), their headquarters, sub-counties
// (the 290 constituencies) and the towns / estates buyers most often search for.

export const REGIONS = [
  "Nairobi",
  "Central",
  "Coast",
  "Eastern",
  "North Eastern",
  "Rift Valley",
  "Western",
  "Nyanza",
];

export const COUNTIES = [
  {
    code: 1, name: "Mombasa", region: "Coast", hq: "Mombasa",
    subCounties: ["Changamwe", "Jomvu", "Kisauni", "Nyali", "Likoni", "Mvita"],
    towns: ["Nyali", "Bamburi", "Shanzu", "Kizingo", "Tudor", "Mkomani", "Likoni", "Mtongwe", "Port Reitz", "Changamwe"],
  },
  {
    code: 2, name: "Kwale", region: "Coast", hq: "Kwale",
    subCounties: ["Msambweni", "Lunga Lunga", "Matuga", "Kinango"],
    towns: ["Diani", "Ukunda", "Tiwi", "Galu", "Msambweni", "Shimoni", "Kwale", "Kinango", "Lunga Lunga"],
  },
  {
    code: 3, name: "Kilifi", region: "Coast", hq: "Kilifi",
    subCounties: ["Kilifi North", "Kilifi South", "Kaloleni", "Rabai", "Ganze", "Malindi", "Magarini"],
    towns: ["Kilifi", "Malindi", "Watamu", "Mtwapa", "Vipingo", "Kikambala", "Mariakani", "Mambrui", "Takaungu"],
  },
  {
    code: 4, name: "Tana River", region: "Coast", hq: "Hola",
    subCounties: ["Garsen", "Galole", "Bura"],
    towns: ["Hola", "Garsen", "Bura", "Madogo", "Kipini"],
  },
  {
    code: 5, name: "Lamu", region: "Coast", hq: "Lamu",
    subCounties: ["Lamu East", "Lamu West"],
    towns: ["Lamu", "Shela", "Mokowe", "Mpeketoni", "Hindi", "Witu", "Faza"],
  },
  {
    code: 6, name: "Taita-Taveta", region: "Coast", hq: "Mwatate",
    subCounties: ["Taveta", "Wundanyi", "Mwatate", "Voi"],
    towns: ["Voi", "Wundanyi", "Mwatate", "Taveta", "Maktau"],
  },
  {
    code: 7, name: "Garissa", region: "North Eastern", hq: "Garissa",
    subCounties: ["Garissa Township", "Balambala", "Lagdera", "Dadaab", "Fafi", "Ijara"],
    towns: ["Garissa", "Dadaab", "Masalani", "Modogashe", "Hulugho"],
  },
  {
    code: 8, name: "Wajir", region: "North Eastern", hq: "Wajir",
    subCounties: ["Wajir North", "Wajir East", "Tarbaj", "Wajir West", "Eldas", "Wajir South"],
    towns: ["Wajir", "Habaswein", "Griftu", "Bute", "Eldas", "Tarbaj"],
  },
  {
    code: 9, name: "Mandera", region: "North Eastern", hq: "Mandera",
    subCounties: ["Mandera West", "Banissa", "Mandera North", "Mandera South", "Mandera East", "Lafey"],
    towns: ["Mandera", "El Wak", "Rhamu", "Takaba", "Banissa", "Lafey"],
  },
  {
    code: 10, name: "Marsabit", region: "Eastern", hq: "Marsabit",
    subCounties: ["Moyale", "North Horr", "Saku", "Laisamis"],
    towns: ["Marsabit", "Moyale", "Laisamis", "Loiyangalani", "North Horr", "Sololo"],
  },
  {
    code: 11, name: "Isiolo", region: "Eastern", hq: "Isiolo",
    subCounties: ["Isiolo North", "Isiolo South"],
    towns: ["Isiolo", "Kulamawe", "Merti", "Garbatulla", "Oldonyiro", "Kinna"],
  },
  {
    code: 12, name: "Meru", region: "Eastern", hq: "Meru",
    subCounties: [
      "Igembe South", "Igembe Central", "Igembe North", "Tigania West", "Tigania East",
      "North Imenti", "Buuri", "Central Imenti", "South Imenti",
    ],
    towns: ["Meru", "Makutano", "Maua", "Nkubu", "Timau", "Laare", "Kianjai", "Mitunguu", "Kiirua"],
  },
  {
    code: 13, name: "Tharaka-Nithi", region: "Eastern", hq: "Kathwana",
    subCounties: ["Maara", "Chuka/Igambang'ombe", "Tharaka"],
    towns: ["Chuka", "Chogoria", "Kathwana", "Marimanti", "Gatunga"],
  },
  {
    code: 14, name: "Embu", region: "Eastern", hq: "Embu",
    subCounties: ["Manyatta", "Runyenjes", "Mbeere South", "Mbeere North"],
    towns: ["Embu", "Runyenjes", "Manyatta", "Siakago", "Kiritiri", "Ishiara"],
  },
  {
    code: 15, name: "Kitui", region: "Eastern", hq: "Kitui",
    subCounties: [
      "Mwingi North", "Mwingi West", "Mwingi Central", "Kitui West",
      "Kitui Rural", "Kitui Central", "Kitui East", "Kitui South",
    ],
    towns: ["Kitui", "Mwingi", "Kabati", "Mutomo", "Kyuso", "Migwani"],
  },
  {
    code: 16, name: "Machakos", region: "Eastern", hq: "Machakos",
    subCounties: ["Masinga", "Yatta", "Kangundo", "Matungulu", "Kathiani", "Mavoko", "Machakos Town", "Mwala"],
    towns: ["Syokimau", "Athi River", "Mlolongo", "Machakos", "Joska", "Tala", "Kangundo", "Matuu", "Kathiani", "Masii"],
  },
  {
    code: 17, name: "Makueni", region: "Eastern", hq: "Wote",
    subCounties: ["Mbooni", "Kilome", "Kaiti", "Makueni", "Kibwezi West", "Kibwezi East"],
    towns: ["Wote", "Emali", "Sultan Hamud", "Kibwezi", "Makindu", "Mtito Andei", "Salama"],
  },
  {
    code: 18, name: "Nyandarua", region: "Central", hq: "Ol Kalou",
    subCounties: ["Kinangop", "Kipipiri", "Ol Kalou", "Ol Joro Orok", "Ndaragwa"],
    towns: ["Ol Kalou", "Engineer", "Njabini", "Ol Joro Orok", "Ndaragwa", "Mairo Inya"],
  },
  {
    code: 19, name: "Nyeri", region: "Central", hq: "Nyeri",
    subCounties: ["Tetu", "Kieni", "Mathira", "Othaya", "Mukurweini", "Nyeri Town"],
    towns: ["Nyeri", "Karatina", "Othaya", "Naro Moru", "Mweiga", "Chaka", "Mukurweini"],
  },
  {
    code: 20, name: "Kirinyaga", region: "Central", hq: "Kerugoya",
    subCounties: ["Mwea", "Gichugu", "Ndia", "Kirinyaga Central"],
    towns: ["Kerugoya", "Kutus", "Sagana", "Wang'uru", "Kagio", "Kianyaga", "Kagumo"],
  },
  {
    code: 21, name: "Murang'a", region: "Central", hq: "Murang'a",
    subCounties: ["Kangema", "Mathioya", "Kiharu", "Kigumo", "Maragwa", "Kandara", "Gatanga"],
    towns: ["Murang'a", "Kenol", "Makuyu", "Maragua", "Kandara", "Kangema", "Kiria-ini", "Kabati"],
  },
  {
    code: 22, name: "Kiambu", region: "Central", hq: "Kiambu",
    subCounties: [
      "Gatundu South", "Gatundu North", "Juja", "Thika Town", "Ruiru", "Githunguri",
      "Kiambu", "Kiambaa", "Kabete", "Kikuyu", "Limuru", "Lari",
    ],
    towns: [
      "Ruaka", "Ridgeways", "Kiambu Road", "Thika", "Ruiru", "Juja", "Kikuyu", "Limuru",
      "Tatu City", "Kahawa Sukari", "Kahawa Wendani", "Githurai", "Membley", "Karuri",
      "Banana", "Wangige", "Gatundu", "Githunguri", "Kiambu Town",
    ],
  },
  {
    code: 23, name: "Turkana", region: "Rift Valley", hq: "Lodwar",
    subCounties: ["Turkana North", "Turkana West", "Turkana Central", "Loima", "Turkana South", "Turkana East"],
    towns: ["Lodwar", "Kakuma", "Lokichogio", "Lokichar", "Kalokol", "Lokori"],
  },
  {
    code: 24, name: "West Pokot", region: "Rift Valley", hq: "Kapenguria",
    subCounties: ["Kapenguria", "Sigor", "Kacheliba", "Pokot South"],
    towns: ["Kapenguria", "Makutano", "Chepareria", "Kacheliba", "Sigor", "Ortum"],
  },
  {
    code: 25, name: "Samburu", region: "Rift Valley", hq: "Maralal",
    subCounties: ["Samburu West", "Samburu North", "Samburu East"],
    towns: ["Maralal", "Baragoi", "Wamba", "Archers Post", "Kisima", "Suguta Marmar"],
  },
  {
    code: 26, name: "Trans Nzoia", region: "Rift Valley", hq: "Kitale",
    subCounties: ["Kwanza", "Endebess", "Saboti", "Kiminini", "Cherangany"],
    towns: ["Kitale", "Kiminini", "Endebess", "Moi's Bridge", "Kachibora", "Kwanza"],
  },
  {
    code: 27, name: "Uasin Gishu", region: "Rift Valley", hq: "Eldoret",
    subCounties: ["Soy", "Turbo", "Moiben", "Ainabkoi", "Kapseret", "Kesses"],
    towns: ["Eldoret", "Elgon View", "Kapsoya", "Pioneer", "Annex", "Langas", "Turbo", "Burnt Forest", "Ziwa", "Kesses"],
  },
  {
    code: 28, name: "Elgeyo-Marakwet", region: "Rift Valley", hq: "Iten",
    subCounties: ["Marakwet East", "Marakwet West", "Keiyo North", "Keiyo South"],
    towns: ["Iten", "Kapsowar", "Chepkorio", "Kamwosor", "Tambach", "Chesoi"],
  },
  {
    code: 29, name: "Nandi", region: "Rift Valley", hq: "Kapsabet",
    subCounties: ["Tinderet", "Aldai", "Nandi Hills", "Chesumei", "Emgwen", "Mosop"],
    towns: ["Kapsabet", "Nandi Hills", "Mosoriot", "Kobujoi", "Kabiyet", "Lessos"],
  },
  {
    code: 30, name: "Baringo", region: "Rift Valley", hq: "Kabarnet",
    subCounties: ["Tiaty", "Baringo North", "Baringo Central", "Baringo South", "Mogotio", "Eldama Ravine"],
    towns: ["Kabarnet", "Eldama Ravine", "Marigat", "Mogotio", "Chemolingot", "Kabartonjo"],
  },
  {
    code: 31, name: "Laikipia", region: "Rift Valley", hq: "Rumuruti",
    subCounties: ["Laikipia West", "Laikipia East", "Laikipia North"],
    towns: ["Nanyuki", "Nyahururu", "Rumuruti", "Doldol", "Kinamba", "Ol Moran"],
  },
  {
    code: 32, name: "Nakuru", region: "Rift Valley", hq: "Nakuru",
    subCounties: [
      "Molo", "Njoro", "Naivasha", "Gilgil", "Kuresoi South", "Kuresoi North",
      "Subukia", "Rongai", "Bahati", "Nakuru Town West", "Nakuru Town East",
    ],
    towns: ["Nakuru CBD", "Milimani", "Section 58", "Lanet", "Naivasha", "Gilgil", "Mai Mahiu", "Njoro", "Molo", "Bahati", "Subukia", "Salgaa"],
  },
  {
    code: 33, name: "Narok", region: "Rift Valley", hq: "Narok",
    subCounties: ["Kilgoris", "Emurua Dikirr", "Narok North", "Narok East", "Narok South", "Narok West"],
    towns: ["Narok", "Kilgoris", "Ololulung'a", "Suswa", "Ntulele", "Talek (Maasai Mara)"],
  },
  {
    code: 34, name: "Kajiado", region: "Rift Valley", hq: "Kajiado",
    subCounties: ["Kajiado North", "Kajiado Central", "Kajiado East", "Kajiado West", "Kajiado South"],
    towns: ["Kitengela", "Ongata Rongai", "Ngong", "Kiserian", "Matasia", "Isinya", "Kajiado Town", "Namanga", "Loitokitok"],
  },
  {
    code: 35, name: "Kericho", region: "Rift Valley", hq: "Kericho",
    subCounties: ["Kipkelion East", "Kipkelion West", "Ainamoi", "Bureti", "Belgut", "Sigowet/Soin"],
    towns: ["Kericho", "Litein", "Londiani", "Kipkelion", "Sosiot", "Fort Ternan"],
  },
  {
    code: 36, name: "Bomet", region: "Rift Valley", hq: "Bomet",
    subCounties: ["Sotik", "Chepalungu", "Bomet East", "Bomet Central", "Konoin"],
    towns: ["Bomet", "Sotik", "Longisa", "Mogogosiek", "Silibwet", "Sigor"],
  },
  {
    code: 37, name: "Kakamega", region: "Western", hq: "Kakamega",
    subCounties: [
      "Lugari", "Likuyani", "Malava", "Lurambi", "Navakholo", "Mumias West",
      "Mumias East", "Matungu", "Butere", "Khwisero", "Shinyalu", "Ikolomani",
    ],
    towns: ["Kakamega", "Mumias", "Butere", "Malava", "Lumakanda", "Shinyalu", "Khayega"],
  },
  {
    code: 38, name: "Vihiga", region: "Western", hq: "Mbale",
    subCounties: ["Vihiga", "Sabatia", "Hamisi", "Luanda", "Emuhaya"],
    towns: ["Mbale", "Chavakali", "Majengo", "Luanda", "Hamisi", "Kaimosi"],
  },
  {
    code: 39, name: "Bungoma", region: "Western", hq: "Bungoma",
    subCounties: [
      "Mt. Elgon", "Sirisia", "Kabuchai", "Bumula", "Kanduyi",
      "Webuye East", "Webuye West", "Kimilili", "Tongaren",
    ],
    towns: ["Bungoma", "Webuye", "Kimilili", "Chwele", "Malakisi", "Tongaren", "Kapsokwony"],
  },
  {
    code: 40, name: "Busia", region: "Western", hq: "Busia",
    subCounties: ["Teso North", "Teso South", "Nambale", "Matayos", "Butula", "Funyula", "Budalangi"],
    towns: ["Busia", "Malaba", "Nambale", "Butula", "Port Victoria", "Funyula", "Amagoro"],
  },
  {
    code: 41, name: "Siaya", region: "Nyanza", hq: "Siaya",
    subCounties: ["Ugenya", "Ugunja", "Alego Usonga", "Gem", "Bondo", "Rarieda"],
    towns: ["Siaya", "Bondo", "Ugunja", "Yala", "Usenge", "Sega"],
  },
  {
    code: 42, name: "Kisumu", region: "Nyanza", hq: "Kisumu",
    subCounties: ["Kisumu East", "Kisumu West", "Kisumu Central", "Seme", "Nyando", "Muhoroni", "Nyakach"],
    towns: ["Kisumu CBD", "Milimani", "Riat Hills", "Mamboleo", "Kondele", "Nyalenda", "Ahero", "Maseno", "Kombewa", "Muhoroni", "Katito"],
  },
  {
    code: 43, name: "Homa Bay", region: "Nyanza", hq: "Homa Bay",
    subCounties: ["Kasipul", "Kabondo Kasipul", "Karachuonyo", "Rangwe", "Homa Bay Town", "Ndhiwa", "Suba North", "Suba South"],
    towns: ["Homa Bay", "Mbita", "Kendu Bay", "Oyugis", "Ndhiwa", "Rangwe", "Sindo"],
  },
  {
    code: 44, name: "Migori", region: "Nyanza", hq: "Migori",
    subCounties: ["Rongo", "Awendo", "Suna East", "Suna West", "Uriri", "Nyatike", "Kuria West", "Kuria East"],
    towns: ["Migori", "Rongo", "Awendo", "Isebania", "Kehancha", "Uriri", "Muhuru Bay"],
  },
  {
    code: 45, name: "Kisii", region: "Nyanza", hq: "Kisii",
    subCounties: [
      "Bonchari", "South Mugirango", "Bomachoge Borabu", "Bobasi", "Bomachoge Chache",
      "Nyaribari Masaba", "Nyaribari Chache", "Kitutu Chache North", "Kitutu Chache South",
    ],
    towns: ["Kisii", "Suneka", "Ogembo", "Keroka", "Nyamache", "Marani"],
  },
  {
    code: 46, name: "Nyamira", region: "Nyanza", hq: "Nyamira",
    subCounties: ["Kitutu Masaba", "West Mugirango", "North Mugirango", "Borabu"],
    towns: ["Nyamira", "Nyansiongo", "Ekerenyo", "Manga", "Magwagwa"],
  },
  {
    code: 47, name: "Nairobi", region: "Nairobi", hq: "Nairobi",
    subCounties: [
      "Westlands", "Dagoretti North", "Dagoretti South", "Lang'ata", "Kibra", "Roysambu",
      "Kasarani", "Ruaraka", "Embakasi South", "Embakasi North", "Embakasi Central",
      "Embakasi East", "Embakasi West", "Makadara", "Kamukunji", "Starehe", "Mathare",
    ],
    towns: [
      "Westlands", "Kilimani", "Kileleshwa", "Lavington", "Karen", "Runda", "Muthaiga", "Gigiri",
      "Spring Valley", "Kitisuru", "Loresho", "Parklands", "Riverside", "Upper Hill", "Hurlingham",
      "Lang'ata", "South B", "South C", "Kasarani", "Roysambu", "Kahawa West", "Embakasi",
      "Donholm", "Buruburu", "Utawala", "Ruai",
    ],
  },
];

export const COUNTY_BY_NAME = Object.fromEntries(COUNTIES.map((c) => [c.name.toLowerCase(), c]));

export function countySlug(name) {
  return String(name || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const COUNTY_BY_SLUG = Object.fromEntries(COUNTIES.map((county) => [countySlug(county.name), county]));

export const TOTALS = {
  counties: COUNTIES.length,
  subCounties: COUNTIES.reduce((n, c) => n + c.subCounties.length, 0),
  towns: new Set(COUNTIES.flatMap((c) => c.towns)).size,
};

export function countiesByRegion() {
  return REGIONS.map((region) => ({
    region,
    counties: COUNTIES.filter((c) => c.region === region),
  }));
}

/** Towns first (what people search for), then sub-counties not already listed. */
export function placesInCounty(countyName) {
  const county = COUNTY_BY_NAME[String(countyName || "").toLowerCase()];
  if (!county) return [];
  const seen = new Set(county.towns.map((t) => t.toLowerCase()));
  return [...county.towns, ...county.subCounties.filter((s) => !seen.has(s.toLowerCase()))];
}
