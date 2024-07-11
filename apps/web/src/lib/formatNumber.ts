export const formatNumberEn = (data: number) => {
  return new Intl.NumberFormat("en-US").format(data)
}

export const formatCurrencyRp = (data: number) => {
  const options: Intl.NumberFormatOptions | undefined = {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }

  return new Intl.NumberFormat("id-ID", options).format(data);
}
