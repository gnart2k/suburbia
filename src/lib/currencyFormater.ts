export default function formatMoney(
  number: number,
  decPlaces: number = 0,
  decSep: string = ".",
  thouSep: string = ","
): string {
  decPlaces = isNaN(decPlaces) ? 2 : Math.abs(decPlaces);
  decSep = decSep ?? ".";
  thouSep = thouSep ?? ",";

  const sign = number < 0 ? "-" : "";
  const absNumber = Math.abs(number);
  const fixedNumber = absNumber.toFixed(decPlaces);
  const i = String(parseInt(fixedNumber));
  const j = i.length > 3 ? i.length % 3 : 0;

  return (
    sign +
    (j ? i.substr(0, j) + thouSep : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSep) +
    (decPlaces ? decSep + fixedNumber.slice(i.length + 1) : "")
  );
}

