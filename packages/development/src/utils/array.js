export const array = ([args]) => {
  return args.trim().split(/\n+/).map(i => i.trim()) // Array.from(args).map(i => i.trim())
}
