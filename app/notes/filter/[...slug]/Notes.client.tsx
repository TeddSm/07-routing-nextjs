import { fetchNotes } from "@/lib/api";
import { NoteList } from "@/components/NoteList/NoteList";

interface FilterPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function FilteredNotesPage({ params }: FilterPageProps) {
  const { slug } = await params;
  
  const currentTag = slug?.[0] === "all" ? "" : slug?.[0] || "";

  const data = await fetchNotes({ search: currentTag });

  return (
    <div>
      <h1>Notes: {currentTag || "All"}</h1>
      {data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found for this tag.</p>
      )}
    </div>
  );
}