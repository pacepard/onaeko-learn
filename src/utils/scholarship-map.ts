export const SCHOLARSHIP_Q1 = [
    'I cannot afford the full course fee',
    'I currently have no income',
    'My current income is insufficient',
    'I am a student',
    'I am unemployed / between jobs',
    'I have other financial responsibilities',
    'I want to invest in my career but cannot afford the programme right now',
    'Other',
] as const;

export const SCHOLARSHIP_Q2 = [
    'No professional experience',
    'Less than 1 year',
    '1 to 2 years',
    '3 to 5 years',
    '6 to 10 years',
    'More than 10 years',
] as const;

export const SCHOLARSHIP_Q3 = [
    'Directly relevant to my current role',
    'Relevant to my career growth',
    'Relevant to a career transition I am making',
    'Relevant to a business I am building',
    'I am exploring the field',
    "I'm not sure yet",
] as const;

export const SCHOLARSHIP_Q4 = [
    'Very confident',
    'Somewhat confident',
    'Not sure',
    'I may need significant support',
    "I don't know yet",
] as const;

export const SCHOLARSHIP_Q5 = [
    'Yes, I can pay it immediately',
    'Yes, I can pay it with some planning',
    'Yes, but I would need additional financial support',
    'No, I cannot currently afford it',
    "I'm not sure",
] as const;

export const mapCanPayEnrollmentFee = (option: string): boolean =>
    option.trim().toLowerCase().startsWith('yes');
