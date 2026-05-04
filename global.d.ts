// allow CSS imports
declare module '*.css'

// (optional but fine to keep)
declare module '.next/types/*' {
  const value: any
  export default value
}