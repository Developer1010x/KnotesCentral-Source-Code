import { Note } from "../data/dataTypes";

export default function NoteItem({ note }: { note: Note }) {
  const typeColors = {
    theory:
      "bg-neon-blue/10 text-neon-blue dark:bg-neon-blue/20 dark:text-neon-blue",
    lab: "bg-neon-green/10 text-neon-green dark:bg-neon-green/20 dark:text-neon-green",
    "question-paper":
      "bg-neon-pink/10 text-neon-pink dark:bg-neon-pink/20 dark:text-neon-pink",
  };

  return (
    <a
      href={note.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 rounded-lg hover:bg-neon-purple/5 dark:hover:bg-neon-purple/10 transition-colors group"
    >
      <span className="text-sm text-foreground group-hover:text-neon-purple transition-colors">
        {note.title}
      </span>
      <span
        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          typeColors[note.type]
        }`}
      >
        {note.type.replace("-", " ").toUpperCase()}
      </span>
    </a>
  );
}
