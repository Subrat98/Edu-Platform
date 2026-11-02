// Curated Indian given-name / surname pools used to deterministically
// generate realistic student and guardian names across the ERP module.
export const FIRST_NAMES_MALE = [
  "Aarav", "Vihaan", "Aditya", "Vivaan", "Reyansh", "Arjun", "Sai", "Krishna", "Ishaan", "Rohan",
  "Kabir", "Ayaan", "Shaurya", "Atharv", "Advait", "Pranav", "Rudra", "Yash", "Dev", "Nikhil",
  "Abhinav", "Siddharth", "Manas", "Debadutta", "Soumya", "Gourav", "Bikash", "Chinmay", "Subham", "Rakesh",
];
export const FIRST_NAMES_FEMALE = [
  "Aadhya", "Ananya", "Diya", "Myra", "Sara", "Ira", "Anika", "Kiara", "Riya", "Pari",
  "Ishita", "Navya", "Prisha", "Trisha", "Aarohi", "Saanvi", "Avni", "Kavya", "Siya", "Ridhima",
  "Lipika", "Swagatika", "Priyanka", "Sneha", "Rashmita", "Monalisa", "Sunita", "Jyotsna", "Aparajita", "Smruti",
];
export const SURNAMES = [
  "Mohanty", "Patra", "Nayak", "Sahoo", "Das", "Panda", "Rout", "Behera", "Swain", "Jena",
  "Mallick", "Sahu", "Dash", "Pradhan", "Senapati", "Mishra", "Pati", "Tripathy", "Routray", "Nanda",
  "Acharya", "Giri", "Rath", "Panigrahi", "Sethi", "Barik", "Mahanty", "Parida", "Bisoyi", "Khuntia",
];

export function nameAt(index: number): { name: string; gender: "Male" | "Female" } {
  const isMale = index % 2 === 0;
  const pool = isMale ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE;
  const first = pool[index % pool.length]!;
  const surname = SURNAMES[Math.floor(index / 2) % SURNAMES.length]!;
  return { name: `${first} ${surname}`, gender: isMale ? "Male" : "Female" };
}

export function phoneAt(seed: number): string {
  const base = 9000000000 + ((seed * 7919) % 999999999);
  return `+91 ${String(base).slice(0, 5)} ${String(base).slice(5, 10)}`;
}
