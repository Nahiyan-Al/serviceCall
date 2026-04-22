export type Term = "Fall" | "Winter" | "Spring";

const TERMS: Term[] = ["Fall", "Winter", "Spring"];

interface TermSelectorProps {
  selection: Term;
  setSelection: (term: Term) => void;
}

const TermSelector = ({ selection, setSelection }: TermSelectorProps) => (
  <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by term">
    {TERMS.map((term) => (
      <button
        key={term}
        type="button"
        onClick={() => setSelection(term)}
        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
          term === selection
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
        }`}
      >
        {term}
      </button>
    ))}
  </div>
);

export default TermSelector;
