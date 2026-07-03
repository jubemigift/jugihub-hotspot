export const BRAND = {
  name: "JugiHub Internet",
  supportPhone: "09013160626",
  supportEmail: "jubemigift@gmail.com",
  colors: {
    purple: "#7c3aed",
    black: "#05030a",
    white: "#ffffff"
  }
} as const;

export const PLAN_DURATION = {
  hour: 60,
  day: 24 * 60,
  week: 7 * 24 * 60,
  month: 30 * 24 * 60
} as const;

export type PaymentGatewayCode = "flutterwave";
