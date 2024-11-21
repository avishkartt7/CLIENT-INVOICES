 
export const formatTRN = (trn) => {
    if (!trn) return 'N/A';
    return String(trn).replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
  };