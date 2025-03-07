export function Button({ children, onClick }) {
    return (
      <button
        onClick={onClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        {children}
      </button>
    );
  }
  