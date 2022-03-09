export default function removeKeyFromObject<T extends {}>(object: T, keys: (keyof T)[]) {
  return Object.keys(object)
    .filter((ea) => !keys.includes(ea as keyof T))
    .reduce(
      (acc, ea) => ({
        ...acc,
        [ea]: object[ea as keyof T],
      }),
      {} as Partial<T>
    )
}
