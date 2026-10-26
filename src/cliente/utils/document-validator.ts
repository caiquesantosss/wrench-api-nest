export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false

  const calculateDigit = (factor: number) => {
    let total = 0
    for (let i = 0 i < factor - 1 i++) {
      total += parseInt(cpf.charAt(i)) * (factor - i)
    }
    const rest = total % 11
    return rest < 2 ? 0 : 11 - rest
  }

  const digit1 = calculateDigit(10)
  const digit2 = calculateDigit(11)

  return digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10))
}

export function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, '')
  if (cnpj.length !== 14 || !!cnpj.match(/(\d)\1{13}/)) return false

  const calculateDigit = (length: number, weights: number[]) => {
    let total = 0
    for (let i = 0 i < length i++) {
      total += parseInt(cnpj.charAt(i)) * weights[i]
    }
    const rest = total % 11
    return rest < 2 ? 0 : 11 - rest
  }

  const digit1 = calculateDigit(12, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const digit2 = calculateDigit(13, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])

  return digit1 === parseInt(cnpj.charAt(12)) && digit2 === parseInt(cnpj.charAt(13))
}