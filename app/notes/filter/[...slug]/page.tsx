import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface FilterPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function FilteredNotesPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const currentTag = slug?.[0] === "all" ? "" : slug?.[0] || "";

  // Отримуємо дані на сервері
  const data = await fetchNotes({ search: currentTag });

  // Передаємо дані в клієнтський компонент, який вимагає тест
  return <NotesClient notes={data.notes} currentTag={currentTag} />;
}