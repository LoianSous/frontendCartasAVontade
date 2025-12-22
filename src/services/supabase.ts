import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://sfuxjvgjqruzffzspzhq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmdXhqdmdqcXJ1emZmenNwemhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDYxNzEsImV4cCI6MjA4MDM4MjE3MX0.w7xBA57xd0xs-wo4qHgHT5eWSY7S0mPVUoWJQjhpomQ"
);
