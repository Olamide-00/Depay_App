export type TransactionItem = {
  _id?: string;
  label?: string;
  category?: string;
  amount: string | number;
  status: string;
  date?: string;
  transaction_date?: string;
  type?: "debit" | "credit" | string;
  phone?: string;
  phoneNumber?: string;
  [key: string]: any;
};

export const mergeHistories = (
  bills: TransactionItem[] = [],
  funding: TransactionItem[] = [],
): TransactionItem[] => {
  const merged = [...bills, ...funding];

  return merged.sort((a, b) => {
    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;
    return bTime - aTime;
  });
};

export const getCategoryIcon = (category?: string): string => {
  const map: { [key: string]: string } = {
    airtime: "phone",
    data: "wifi",
    betting: "cards-spade",
    netflix: "netflix",
    electricity: "lightning-bolt",
    tv: "television",
    gotv: "television",
    dstv: "television",
    jamb: "school",
    waec: "school",
    education: "school",
    transfer: "bank-transfer",
    wallet: "wallet",
  };
  return map[(category || "").toLowerCase()] || "wallet";
};

export const getCategoryColor = (
  category?: string,
  brandColor = "#6C2BD9",
): string => {
  const map: { [key: string]: string } = {
    airtime: "#FF6B6B",
    data: "#4ECDC4",
    betting: "#FFD93D",
    netflix: "#E50914",
    electricity: "#95E1D3",
    tv: "#6C5CE7",
    gotv: "#6C5CE7",
    dstv: "#A29BFE",
    jamb: "#4C6FFF",
    waec: "#4C6FFF",
    education: "#4C6FFF",
    transfer: "#22c55e",
    wallet: brandColor,
  };
  return map[(category || "").toLowerCase()] || brandColor;
};
