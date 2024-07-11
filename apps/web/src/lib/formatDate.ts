export const showDateForBirthdate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions | undefined = {
    year: "numeric",
    month: "long",
    day: "numeric"
  }
  return new Date(date).toLocaleString("id-ID", options)
}