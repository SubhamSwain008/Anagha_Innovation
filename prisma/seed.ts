import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Admin
  const hashedPassword = await bcrypt.hash("admin@admin", 12);
  await prisma.admin.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      password: hashedPassword,
      name: "Super Admin",
    },
  });
  console.log("✅ Admin user created");

  // Seed Company Profile
  await prisma.companyProfile.upsert({
    where: { id: "default-profile" },
    update: {},
    create: {
      id: "default-profile",
      companyName: "Anagha Innovation",
      tagline: "Powering the Future of Green Energy & EV Technology",
      description:
        "Anagha Innovation is a cutting-edge green energy and electric vehicle technology startup focused on developing sustainable power solutions, smart charging systems, and advanced motor technologies for the next generation of electric mobility.",
      mission:
        "To accelerate the transition to sustainable energy through innovative engineering solutions in EV technology, power electronics, and smart energy systems.",
      vision:
        "A world powered by clean, efficient, and intelligent energy systems — accessible to everyone.",
      address: "IIT Patna, Bihta, Bihar 801106, India",
      phone: "+91-XXXXXXXXXX",
      email: "contact@anaghainnovation.com",
      socialLinks: JSON.stringify([
        { platform: "LinkedIn", url: "https://linkedin.com/company/anagha-innovation" },
        { platform: "Twitter", url: "https://twitter.com/anaghainnovation" },
        { platform: "Instagram", url: "https://instagram.com/anaghainnovation" },
      ]),
      logoUrl: null,
      faviconUrl: null,
    },
  });
  console.log("✅ Company profile created");

  // Seed Product Categories
  const categories = [
    {
      name: "Charging Systems",
      slug: "charging-systems",
      description: "Advanced EV charging solutions including solar-powered and multi-voltage systems",
    },
    {
      name: "EV Motors",
      slug: "ev-motors",
      description: "High-efficiency BLDC and PMSM motors for electric vehicles",
    },
    {
      name: "Smart IoT",
      slug: "smart-iot",
      description: "IoT-enabled monitoring and control systems for energy management",
    },
    {
      name: "Energy Storage",
      slug: "energy-storage",
      description: "Battery management systems and energy storage solutions",
    },
    {
      name: "Power Electronics",
      slug: "power-electronics",
      description: "Multi-voltage converters, inverters, and power conditioning equipment",
    },
  ];

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Product categories created");

  // Seed sample products
  const chargingCategory = await prisma.productCategory.findUnique({
    where: { slug: "charging-systems" },
  });
  const motorCategory = await prisma.productCategory.findUnique({
    where: { slug: "ev-motors" },
  });

  if (chargingCategory) {
    const product1 = await prisma.product.upsert({
      where: { slug: "solar-ev-charger-pro" },
      update: {},
      create: {
        name: "Solar EV Charger Pro",
        slug: "solar-ev-charger-pro",
        shortDescription: "Solar-powered Level 2 EV charging station with smart grid integration",
        fullDescription:
          "The Solar EV Charger Pro is our flagship solar-powered charging solution designed for commercial and residential applications. It features integrated MPPT solar charge controller, bi-directional grid connectivity, and real-time monitoring via our IoT platform. Built with industrial-grade components rated for outdoor deployment.",
        categoryId: chargingCategory.id,
        status: "AVAILABLE",
        powerRating: "7.4 kW",
        voltageRange: "180V - 280V AC",
        efficiency: "95%",
        weight: "25 kg",
        dimensions: "600 x 400 x 200 mm",
        price: 150000,
      },
    });

    // Add features
    await prisma.productFeature.createMany({
      data: [
        { productId: product1.id, title: "Solar MPPT Integration", description: "Maximum power point tracking for optimal solar harvesting", order: 1 },
        { productId: product1.id, title: "Smart Grid Connectivity", description: "Bi-directional V2G capable with grid-tie functionality", order: 2 },
        { productId: product1.id, title: "Real-time IoT Monitoring", description: "Cloud-based dashboard with mobile app support", order: 3 },
        { productId: product1.id, title: "Weather-proof Enclosure", description: "IP65 rated housing for outdoor installation", order: 4 },
      ],
      skipDuplicates: true,
    });

    // Add specifications
    await prisma.productSpecification.createMany({
      data: [
        { productId: product1.id, specKey: "Rated Power", specValue: "7.4", unit: "kW", order: 1 },
        { productId: product1.id, specKey: "Input Voltage", specValue: "180-280", unit: "V AC", order: 2 },
        { productId: product1.id, specKey: "Output Voltage", specValue: "200-500", unit: "V DC", order: 3 },
        { productId: product1.id, specKey: "Max Current", specValue: "32", unit: "A", order: 4 },
        { productId: product1.id, specKey: "Efficiency", specValue: "95", unit: "%", order: 5 },
        { productId: product1.id, specKey: "Connector Type", specValue: "Type 2 / CCS2", unit: "", order: 6 },
        { productId: product1.id, specKey: "Solar Input", specValue: "2000", unit: "W max", order: 7 },
        { productId: product1.id, specKey: "Operating Temperature", specValue: "-10 to 55", unit: "°C", order: 8 },
        { productId: product1.id, specKey: "Protection Rating", specValue: "IP65", unit: "", order: 9 },
        { productId: product1.id, specKey: "Communication", specValue: "Wi-Fi / 4G / RS485", unit: "", order: 10 },
      ],
      skipDuplicates: true,
    });
  }

  if (motorCategory) {
    const product2 = await prisma.product.upsert({
      where: { slug: "bldc-hub-motor-3000w" },
      update: {},
      create: {
        name: "BLDC Hub Motor 3000W",
        slug: "bldc-hub-motor-3000w",
        shortDescription: "High torque brushless DC hub motor for electric two-wheelers and three-wheelers",
        fullDescription:
          "Our 3000W BLDC Hub Motor delivers exceptional torque and efficiency for electric two-wheeler and three-wheeler applications. Featuring neodymium magnets, precision bearings, and advanced thermal management, this motor provides reliable performance across a wide speed range with minimal maintenance.",
        categoryId: motorCategory.id,
        status: "AVAILABLE",
        powerRating: "3000W",
        voltageRange: "48V - 72V DC",
        efficiency: "92%",
        rpm: "800-1200",
        weight: "12 kg",
        dimensions: "Ø280 x 120 mm",
        price: 18000,
      },
    });

    await prisma.productFeature.createMany({
      data: [
        { productId: product2.id, title: "High Torque Design", description: "Optimized for hill climbing and heavy loads", order: 1 },
        { productId: product2.id, title: "Maintenance Free", description: "No brushes, no gears — minimal wear components", order: 2 },
        { productId: product2.id, title: "Regenerative Braking", description: "Built-in support for regenerative braking systems", order: 3 },
      ],
      skipDuplicates: true,
    });

    await prisma.productSpecification.createMany({
      data: [
        { productId: product2.id, specKey: "Rated Power", specValue: "3000", unit: "W", order: 1 },
        { productId: product2.id, specKey: "Rated Voltage", specValue: "48-72", unit: "V DC", order: 2 },
        { productId: product2.id, specKey: "Rated Speed", specValue: "800-1200", unit: "RPM", order: 3 },
        { productId: product2.id, specKey: "Rated Torque", specValue: "25", unit: "Nm", order: 4 },
        { productId: product2.id, specKey: "Peak Torque", specValue: "55", unit: "Nm", order: 5 },
        { productId: product2.id, specKey: "Efficiency", specValue: "≥92", unit: "%", order: 6 },
        { productId: product2.id, specKey: "Magnet Type", specValue: "Neodymium N42SH", unit: "", order: 7 },
        { productId: product2.id, specKey: "Bearing", specValue: "6205-2RS", unit: "", order: 8 },
        { productId: product2.id, specKey: "Hall Sensors", specValue: "120° Phase", unit: "", order: 9 },
      ],
      skipDuplicates: true,
    });
  }

  // Seed sample team members
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Dr. Rajesh Kumar",
        designation: "Chief Technology Officer",
        roleType: "DIRECTOR",
        bio: "PhD in Power Electronics from IIT Patna. 15+ years of experience in EV technology and renewable energy systems.",
        order: 1,
      },
      {
        name: "Priya Sharma",
        designation: "Lead Hardware Engineer",
        roleType: "ENGINEER",
        bio: "M.Tech in Electrical Engineering. Specializes in motor controller design and battery management systems.",
        order: 2,
      },
      {
        name: "Prof. Amit Verma",
        designation: "Technical Advisor",
        roleType: "ADVISOR",
        bio: "Professor of Electrical Engineering at IIT Patna. Expert in power systems and renewable energy integration.",
        order: 3,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Team members created");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
