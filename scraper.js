import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { writeFileSync } from "fs";

const URL = "https://apps.lanecountyor.gov/hhs/Health/Shelter/Availability";

// Hardcoded shelter contact information
const SHELTER_INFO = {
  "Egan Warming Center": { phone: "541-687-5820", address: "Sites vary by activation; no fixed walk-up address" },
  "SVdP Severe Weather Shelter": { phone: "541-687-5820", address: "Multiple SVdP-run sites; no single fixed severe-weather address" },
  "Eugene Mission": { phone: "541-344-3251", address: "1542 W 1st Ave" },
  "*Eugene Mission Rescue Shelter": { phone: "541-344-3251", address: "1542 W 1st Ave" },
  "Station 7": { phone: "541-689-3111", address: "931 W 7th Ave" },
  "*Station 7": { phone: "541-689-3111", address: "931 W 7th Ave" },
  "Overnight Parking": { phone: "541-461-8688", address: "450 Highway 99 N" },
  "Overnight Parking Program EUGENE": { phone: "541-461-8688", address: "450 Highway 99 N" },
  "Brooklyn Street": { phone: "541-606-4093", address: "1545 Brooklyn St" },
  "Dusk to Dawn": { phone: "541-461-8688", address: "717 Highway 99 N" },
  "*Dusk to Dawn": { phone: "541-461-8688", address: "717 Highway 99 N" },
  "310 Safe Sleep": { phone: "541-357-1220", address: "310 Garfield St" },
  "310 Garfield Safe Sleep Site": { phone: "541-357-1220", address: "310 Garfield St" },
  "Anns Heart Womens": { phone: "541-897-9764", address: "PO Box 499" },
  "Ann`s Heart Women`s Shelter": { phone: "541-897-9764", address: "PO Box 499" },
  "Community Supported": { phone: "541-683-0836", address: "1160 Grant St" },
  "Community Supported Shelters": { phone: "541-683-0836", address: "1160 Grant St" },
  "Roosevelt Safe Spot": { phone: "541-683-0836", address: "2031 Roosevelt Blvd" },
  "Roosevelt Safe Spot Community": { phone: "541-683-0836", address: "2031 Roosevelt Blvd" },
  "OASIS Family": { phone: "541-345-3628", address: "1175 G St" },
  "*OASIS Emergency Family Shelter": { phone: "541-345-3628", address: "1175 G St" },
  "ShelterCare Respite": { phone: "541-461-2845", address: "780 Highway 99 N" },
  "ShelterCare Medical Respite": { phone: "541-461-2845", address: "780 Highway 99 N" },
  "1st Place Family Annex": { phone: "541-342-7728", address: "4060 W Amazon Dr" },
  "*1st Place Family Annex": { phone: "541-342-7728", address: "4060 W Amazon Dr" },
  "River Ave Navigation Ctr": { phone: "541-897-9771", address: "100 River Ave" },
  "River Ave Navigation Center": { phone: "541-897-9771", address: "100 River Ave" },
  "410 Safe Sleep": { phone: "541-359-9860", address: "410 Garfield St" },
  "410 Garfield Safe Sleep Site": { phone: "541-359-9860", address: "410 Garfield St" },
  "Opportunity Village": { phone: "541-525-0501", address: "111 N Garfield St" },
  "Opportunity Village Eugene (SquareOne Villages)": { phone: "541-525-0501", address: "111 N Garfield St" },
  "ALL IN ShelterCare": { phone: "541-686-1262", address: "499 W 4th Ave" },
  "PEER Shelter": { phone: "541-342-4293", address: "2517 MLK Blvd" },
  "*PEER Shelter": { phone: "541-342-4293", address: "2517 MLK Blvd" },
  "Everyone Village": { phone: "541-505-7597", address: "3825 Janisse St" },
  "Community Supported Shelters - Veterans Safe Spot Community": { phone: "541-683-0836", address: "1160 Grant St" }
};

async function scrapeBeds() {
  const res = await fetch(URL);
  const html = await res.text();

  const $ = cheerio.load(html);

  const rows = [];

  $("#results tr").each((i, el) => {
    if (i === 0) return; // header row

    const tds = $(el).find("td");

    const shelter = $(tds[0]).text().trim();
    const units = $(tds[1]).text().trim();
    const updated = $(tds[2]).text().trim();

    if (!shelter) return;

    // Get contact info from lookup table
    const info = SHELTER_INFO[shelter] || { phone: "", address: "" };

    rows.push({
      shelter,
      units: Number(units) || 0,
      phone: info.phone,
      address: info.address,
      updated
    });
  });

  return rows;
}

scrapeBeds().then((data) => {
  console.log(data);
  
  // Save to JSON file
  writeFileSync("shelter-data.json", JSON.stringify(data, null, 2));
  console.log("\n✅ Data saved to shelter-data.json");
});
