/** Center mark for `.nerio-preloader` (Nerio-style blue M + red dot). */
export function PreloaderMark() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="preloader-mark h-10 w-10"
      aria-hidden
    >
      <path
        d="M4 32V8L12 22L20 8L28 22L36 8V32H32V14L20 28L8 14V32H4Z"
        fill="#0073FF"
      />
      <circle cx="20" cy="21" r="3.5" fill="#FF2D2D" />
    </svg>
  );
}
