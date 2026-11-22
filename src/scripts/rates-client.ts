/** Tarifas en el navegador: las publicadas en la página (#rg-rates) o las leídas en vivo de la hoja. */
import { rates as codeRates, type Rates } from '../data/rates';

export function baseRates(): Rates {
  try { return JSON.parse(document.getElementById('rg-rates')!.textContent!) as Rates; } catch { return codeRates; }
}
export const currentRates = (): Rates => (window as any).__rgRates ?? baseRates();
