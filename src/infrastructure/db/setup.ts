import { Client } from "pg"
import fs from "fs"
import path from "path"

let isDbSetupDone = false
let setupPromise: Promise<void> | null = null

export async function ensureDatabaseSchema() {
  if (isDbSetupDone) return
  if (setupPromise) return setupPromise

  setupPromise = (async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const dbPassword = process.env.SUPABASE_DB_PASSWORD
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl && (!supabaseUrl || !dbPassword)) {
      console.warn(
        "[DB Setup] Missing DATABASE_URL or SUPABASE_DB_PASSWORD / NEXT_PUBLIC_SUPABASE_URL. Skipping auto-schema check."
      )
      return
    }

    let connectionString = databaseUrl
    if (!connectionString && supabaseUrl && dbPassword) {
      const match = supabaseUrl.match(/https:\/\/(.*?)\.supabase\.co/)
      if (match && match[1]) {
        const ref = match[1]
        // Using pooler connection port 6543
        connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${ref}.supabase.co:6543/postgres`
      }
    }

    if (!connectionString) {
      console.warn("[DB Setup] Could not determine database connection string. Skipping.")
      return
    }

    const client = new Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    })

    try {
      await client.connect()

      // Check if the users table exists in the public schema
      const checkRes = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `)

      const tableExists = checkRes.rows[0]?.exists
      if (!tableExists) {
        console.log("[DB Setup] Table public.users not found. Initializing database schema...")

        const schemaPath = path.join(process.cwd(), "supabase", "schema.sql")
        if (!fs.existsSync(schemaPath)) {
          throw new Error(`Schema file not found at ${schemaPath}`)
        }

        const schemaSql = fs.readFileSync(schemaPath, "utf8")

        // Run the entire schema.sql script
        await client.query(schemaSql)
        console.log("[DB Setup] Database schema successfully initialized!")
      } else {
        console.log("[DB Setup] Database schema is already initialized.")
      }

      isDbSetupDone = true
    } catch (error) {
      console.error("[DB Setup] Error checking or initializing database schema:", error)
      throw error
    } finally {
      try {
        await client.end()
      } catch (e) {
        // Ignore client closing errors
      }
    }
  })()

  try {
    await setupPromise
  } catch (err) {
    setupPromise = null // Allow retrying on next request if it failed
    throw err
  }
}
