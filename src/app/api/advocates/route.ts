import db from "../../../db";
import { advocates } from "../../../db/schema";
import { sql, ilike, or, and, inArray, asc, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "100");
  const search = searchParams.get("search") || "";
  const degrees = searchParams.getAll("degrees");
  const specialties = searchParams.getAll("specialties");
  const sortField = searchParams.get("sortField");
  const sortDirection = searchParams.get("sortDirection") || "asc";

  const offset = (page - 1) * limit;

  try {
    // Build search conditions
    const conditions = [];

    // Text search conditions
    if (search) {
      conditions.push(
        or(
          ilike(advocates.firstName, `%${search}%`),
          ilike(advocates.lastName, `%${search}%`),
          ilike(advocates.city, `%${search}%`),
          ilike(advocates.degree, `%${search}%`),
          sql`${advocates.specialties}::text ILIKE ${`%${search}%`}`
        )
      );
    }

    // Degree filter
    if (degrees.length > 0) {
      conditions.push(inArray(advocates.degree, degrees));
    }

    // Specialties filter - check if JSONB array contains any of the selected specialties
    if (specialties.length > 0) {
      const specialtyConditions = specialties.map((specialty) =>
        sql`${advocates.specialties} @> ${sql.raw(`'${JSON.stringify([specialty])}'::jsonb`)}`
      );
      conditions.push(or(...specialtyConditions));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Determine sort order
    const getSortOrder = () => {
      const direction = sortDirection === "desc" ? desc : asc;

      switch (sortField) {
        case "name":
          return [direction(advocates.lastName), direction(advocates.firstName)];
        case "degree":
          return [direction(advocates.degree), asc(advocates.lastName), asc(advocates.firstName)];
        case "city":
          return [direction(advocates.city), asc(advocates.lastName), asc(advocates.firstName)];
        case "experience":
          return [direction(advocates.yearsOfExperience), asc(advocates.lastName), asc(advocates.firstName)];
        default:
          return [asc(advocates.lastName), asc(advocates.firstName)];
      }
    };

    // Run data fetch and count queries in parallel for better performance
    const [data, [{ count }]] = await Promise.all([
      db
        .select()
        .from(advocates)
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(...getSortOrder()),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(advocates)
        .where(whereClause),
    ]);

    return Response.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasMore: offset + data.length < count,
      },
    });
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json({ error: "Failed to fetch advocates" }, { status: 500 });
  }
}
