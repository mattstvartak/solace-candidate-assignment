import db from "../../../../db";
import { advocates } from "../../../../db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch unique degrees and specialties in parallel
    const [degreeResults, specialtyResults] = await Promise.all([
      // Get unique degrees
      db
        .selectDistinct({ degree: advocates.degree })
        .from(advocates)
        .orderBy(advocates.degree),

      // Get all specialties (will need to flatten and deduplicate)
      db.select({ specialties: advocates.specialties }).from(advocates),
    ]);

    // Extract unique degrees
    const degrees = degreeResults.map((row) => row.degree);

    // Flatten and deduplicate specialties
    const specialtiesSet = new Set<string>();
    specialtyResults.forEach((row) => {
      const specialtiesArray = Array.isArray(row.specialties) ? row.specialties : [];
      specialtiesArray.forEach((specialty) => {
        if (typeof specialty === "string") {
          specialtiesSet.add(specialty);
        }
      });
    });
    const specialties = Array.from(specialtiesSet).sort();

    return Response.json({
      degrees,
      specialties,
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return Response.json({ error: "Failed to fetch filter options" }, { status: 500 });
  }
}
