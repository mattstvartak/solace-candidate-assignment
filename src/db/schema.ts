import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
  index,
} from "drizzle-orm/pg-core";

const advocates = pgTable(
  "advocates",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    city: text("city").notNull(),
    degree: text("degree").notNull(),
    specialties: jsonb("payload").default([]).notNull(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    // B-tree indexes for exact and prefix matching (ILIKE with leading %)
    firstNameIdx: index("first_name_idx").on(table.firstName),
    lastNameIdx: index("last_name_idx").on(table.lastName),
    cityIdx: index("city_idx").on(table.city),
    degreeIdx: index("degree_idx").on(table.degree),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
    // GIN index for JSONB specialties search (much faster for array containment)
    specialtiesIdx: index("specialties_gin_idx").using("gin", table.specialties),
  })
);

export type Advocate = typeof advocates.$inferSelect;

export { advocates };
