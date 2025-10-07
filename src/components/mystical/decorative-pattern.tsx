export const DecorativePattern = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mandala-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="100" cy="100" r="2" fill="currentColor" className="text-primary/20" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent/10" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/10" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-secondary/10" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mandala-pattern)" />
      </svg>
    </div>
  )
}