export const changeCalculator = (availableCoins: number[], change: number) => {
  const coins: number[] = [];
  let changeAux = change;
  for (let i = 0; i < availableCoins.length; i++) {
    while (changeAux >= availableCoins[i]) {
      changeAux -= availableCoins[i];
      coins.push(availableCoins[i]);
    }
  }
  return coins;
};
