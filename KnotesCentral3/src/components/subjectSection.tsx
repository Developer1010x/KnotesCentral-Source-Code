import { Subject } from "../data/dataTypes";
import NoteItem from "../components/noteItem";

export default function SubjectSection({ subject }: { subject: Subject }) {
  return (
    <div className="mb-3 last:mb-0 border-b border-gray-100 dark:border-gray-700 pb-3">
      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center">
        <span className="mr-2">📖</span>
        {subject.name}
      </h5>
      <div className="space-y-2">
        {subject.notes.map((note) => (
          <NoteItem key={note.title} note={note} />
        ))}
      </div>
    </div>
  );
}
