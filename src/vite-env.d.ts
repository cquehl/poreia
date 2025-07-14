/// <reference types="vite/client" />

// This tells TypeScript that importing a .png file is valid
// and that the default import will be a string (the URL).
declare module '*.png' {
  const value: string;
  export default value;
}

// It's a good practice to add declarations for other common image types too.
declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}
