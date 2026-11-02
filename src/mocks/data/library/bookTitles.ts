import type { BookTitle } from "@/types";

const COVER_COLORS = ["#1f3a5f", "#0e8f8f", "#b45309", "#6366f1", "#15803d", "#be185d", "#1b2f52", "#2563a8"];

function cover(i: number) {
  return COVER_COLORS[i % COVER_COLORS.length]!;
}

export const schoolBookTitles: BookTitle[] = [
  { id: "bk-sch-01", institutionId: "school", title: "NCERT Mathematics — Class X", authors: "NCERT", category: "Mathematics", isbn: "978-81-7450-634-1", publisher: "NCERT", edition: "2024", isReference: false, coverColor: cover(1) },
  { id: "bk-sch-02", institutionId: "school", title: "NCERT Science — Class X", authors: "NCERT", category: "Science", isbn: "978-81-7450-635-8", publisher: "NCERT", edition: "2024", isReference: false, coverColor: cover(2) },
  { id: "bk-sch-03", institutionId: "school", title: "A Textbook of Physics for Class XII", authors: "H.C. Verma", category: "Science", isbn: "978-81-7709-187-5", publisher: "Bharati Bhawan", edition: "3rd", isReference: false, coverColor: cover(3) },
  { id: "bk-sch-04", institutionId: "school", title: "Concepts of Physics Vol. 1", authors: "H.C. Verma", category: "Science", isbn: "978-81-7709-186-8", publisher: "Bharati Bhawan", edition: "2020", isReference: true, coverColor: cover(4) },
  { id: "bk-sch-05", institutionId: "school", title: "Wren & Martin — High School English Grammar", authors: "P.C. Wren, H. Martin", category: "Languages", isbn: "978-81-219-0392-0", publisher: "S. Chand", edition: "Revised", isReference: false, coverColor: cover(5) },
  { id: "bk-sch-06", institutionId: "school", title: "A Pact with the Sun — NCERT Supplementary Reader", authors: "NCERT", category: "Languages", isbn: "978-81-7450-544-3", publisher: "NCERT", edition: "2023", isReference: false, coverColor: cover(6) },
  { id: "bk-sch-07", institutionId: "school", title: "Our Pasts — History Class X", authors: "NCERT", category: "Social Science", isbn: "978-81-7450-751-5", publisher: "NCERT", edition: "2024", isReference: false, coverColor: cover(7) },
  { id: "bk-sch-08", institutionId: "school", title: "Contemporary India — Geography Class X", authors: "NCERT", category: "Social Science", isbn: "978-81-7450-752-2", publisher: "NCERT", edition: "2024", isReference: false, coverColor: cover(8) },
  { id: "bk-sch-09", institutionId: "school", title: "Democratic Politics — Class X", authors: "NCERT", category: "Social Science", isbn: "978-81-7450-753-9", publisher: "NCERT", edition: "2024", isReference: false, coverColor: cover(1) },
  { id: "bk-sch-10", institutionId: "school", title: "Elements of Mathematics Class XI", authors: "Dr. K.C. Sinha", category: "Mathematics", isbn: "978-93-5078-123-4", publisher: "Rastogi Publications", edition: "2023", isReference: false, coverColor: cover(2) },
  { id: "bk-sch-11", institutionId: "school", title: "Modern ABC of Chemistry Class XI", authors: "S.P. Jauhar", category: "Science", isbn: "978-81-219-3456-5", publisher: "Modern Publishers", edition: "2023", isReference: false, coverColor: cover(3) },
  { id: "bk-sch-12", institutionId: "school", title: "Truman's Elementary Biology Vol. I & II", authors: "Various", category: "Science", isbn: "978-81-219-0021-9", publisher: "S. Chand", edition: "2022", isReference: true, coverColor: cover(4) },
  { id: "bk-sch-13", institutionId: "school", title: "Panchatantra Stories for Children", authors: "Vishnu Sharma (trans.)", category: "Fiction", isbn: "978-81-291-1445-2", publisher: "Rupa", edition: "2019", isReference: false, coverColor: cover(5) },
  { id: "bk-sch-14", institutionId: "school", title: "Malgudi Days", authors: "R.K. Narayan", category: "Fiction", isbn: "978-0-14-306391-9", publisher: "Penguin", edition: "2006", isReference: false, coverColor: cover(6) },
  { id: "bk-sch-15", institutionId: "school", title: "The Discovery of India", authors: "Jawaharlal Nehru", category: "History", isbn: "978-0-14-303104-8", publisher: "Penguin", edition: "2004", isReference: false, coverColor: cover(7) },
  { id: "bk-sch-16", institutionId: "school", title: "Atlas of the World for Schools", authors: "Oxford Cartographers", category: "Reference", isbn: "978-0-19-837882-8", publisher: "Oxford University Press", edition: "2022", isReference: true, coverColor: cover(8) },
  { id: "bk-sch-17", institutionId: "school", title: "Oxford School Atlas", authors: "Oxford Cartographers", category: "Reference", isbn: "978-0-19-569699-1", publisher: "Oxford University Press", edition: "36th", isReference: true, coverColor: cover(1) },
  { id: "bk-sch-18", institutionId: "school", title: "Five Point Someone", authors: "Chetan Bhagat", category: "Fiction", isbn: "978-81-7992-157-5", publisher: "Rupa", edition: "2004", isReference: false, coverColor: cover(2) },
  { id: "bk-sch-19", institutionId: "school", title: "Harry Potter and the Philosopher's Stone", authors: "J.K. Rowling", category: "Fiction", isbn: "978-0-7475-3269-9", publisher: "Bloomsbury", edition: "1997", isReference: false, coverColor: cover(3) },
  { id: "bk-sch-20", institutionId: "school", title: "Introduction to Computer Applications Class IX", authors: "CBSE", category: "Computer Science", isbn: "978-93-86561-02-1", publisher: "CBSE", edition: "2023", isReference: false, coverColor: cover(4) },
  { id: "bk-sch-21", institutionId: "school", title: "Learning Python for Beginners", authors: "Ananya Roy", category: "Computer Science", isbn: "978-93-89957-10-3", publisher: "BPB Publications", edition: "2021", isReference: false, coverColor: cover(5) },
  { id: "bk-sch-22", institutionId: "school", title: "The Illustrated Mahabharata", authors: "DK Publishing", category: "Reference", isbn: "978-0-241-28587-5", publisher: "DK", edition: "2017", isReference: true, coverColor: cover(6) },
  { id: "bk-sch-23", institutionId: "school", title: "Children's Encyclopedia of Science", authors: "DK Publishing", category: "Reference", isbn: "978-0-241-35678-9", publisher: "DK", edition: "2020", isReference: true, coverColor: cover(7) },
  { id: "bk-sch-24", institutionId: "school", title: "Panorama of Indian Festivals", authors: "Usha Rani", category: "Social Science", isbn: "978-81-7016-234-5", publisher: "National Book Trust", edition: "2018", isReference: false, coverColor: cover(8) },
];

export const collegeBookTitles: BookTitle[] = [
  { id: "bk-col-01", institutionId: "college", title: "Introduction to Algorithms", authors: "Cormen, Leiserson, Rivest, Stein", category: "Computer Science", isbn: "978-0-262-03384-8", publisher: "MIT Press", edition: "3rd", isReference: false, coverColor: cover(1) },
  { id: "bk-col-02", institutionId: "college", title: "Database System Concepts", authors: "Silberschatz, Korth, Sudarshan", category: "Computer Science", isbn: "978-0-07-802215-9", publisher: "McGraw-Hill", edition: "7th", isReference: false, coverColor: cover(2) },
  { id: "bk-col-03", institutionId: "college", title: "Computer Networks", authors: "Andrew S. Tanenbaum", category: "Computer Science", isbn: "978-0-13-212695-3", publisher: "Pearson", edition: "5th", isReference: false, coverColor: cover(3) },
  { id: "bk-col-04", institutionId: "college", title: "Operating System Concepts", authors: "Silberschatz, Galvin, Gagne", category: "Computer Science", isbn: "978-1-118-06333-0", publisher: "Wiley", edition: "9th", isReference: false, coverColor: cover(4) },
  { id: "bk-col-05", institutionId: "college", title: "Pattern Recognition and Machine Learning", authors: "Christopher M. Bishop", category: "Computer Science", isbn: "978-0-387-31073-2", publisher: "Springer", edition: "2006", isReference: true, coverColor: cover(5) },
  { id: "bk-col-06", institutionId: "college", title: "Concepts of Physics Vol. 1 & 2", authors: "H.C. Verma", category: "Physics", isbn: "978-81-7709-187-5", publisher: "Bharati Bhawan", edition: "2020", isReference: false, coverColor: cover(6) },
  { id: "bk-col-07", institutionId: "college", title: "Introduction to Electrodynamics", authors: "David J. Griffiths", category: "Physics", isbn: "978-1-108-42041-9", publisher: "Cambridge University Press", edition: "4th", isReference: false, coverColor: cover(7) },
  { id: "bk-col-08", institutionId: "college", title: "Quantum Mechanics: Concepts and Applications", authors: "Nouredine Zettili", category: "Physics", isbn: "978-0-470-02679-3", publisher: "Wiley", edition: "2nd", isReference: true, coverColor: cover(8) },
  { id: "bk-col-09", institutionId: "college", title: "Solid State Physics", authors: "Neil W. Ashcroft, N. David Mermin", category: "Physics", isbn: "978-0-03-083993-1", publisher: "Cengage", edition: "1976", isReference: true, coverColor: cover(1) },
  { id: "bk-col-10", institutionId: "college", title: "Organic Chemistry", authors: "Jonathan Clayden et al.", category: "Chemistry", isbn: "978-0-19-927029-3", publisher: "Oxford University Press", edition: "2nd", isReference: false, coverColor: cover(2) },
  { id: "bk-col-11", institutionId: "college", title: "Physical Chemistry", authors: "Peter Atkins, Julio de Paula", category: "Chemistry", isbn: "978-1-4292-7498-7", publisher: "Oxford University Press", edition: "10th", isReference: false, coverColor: cover(3) },
  { id: "bk-col-12", institutionId: "college", title: "Inorganic Chemistry", authors: "J.D. Lee", category: "Chemistry", isbn: "978-0-632-05293-6", publisher: "Wiley-Blackwell", edition: "5th", isReference: false, coverColor: cover(4) },
  { id: "bk-col-13", institutionId: "college", title: "Higher Algebra", authors: "Hall & Knight", category: "Mathematics", isbn: "978-81-219-0280-0", publisher: "S. Chand", edition: "1994", isReference: false, coverColor: cover(5) },
  { id: "bk-col-14", institutionId: "college", title: "Real Analysis", authors: "Royden, Fitzpatrick", category: "Mathematics", isbn: "978-0-13-143747-0", publisher: "Pearson", edition: "4th", isReference: false, coverColor: cover(6) },
  { id: "bk-col-15", institutionId: "college", title: "Linear Algebra and Its Applications", authors: "Gilbert Strang", category: "Mathematics", isbn: "978-0-03-010567-8", publisher: "Cengage", edition: "4th", isReference: false, coverColor: cover(7) },
  { id: "bk-col-16", institutionId: "college", title: "Principles of Economics", authors: "N. Gregory Mankiw", category: "Economics", isbn: "978-1-285-16587-5", publisher: "Cengage", edition: "8th", isReference: false, coverColor: cover(8) },
  { id: "bk-col-17", institutionId: "college", title: "Microeconomic Theory", authors: "Mas-Colell, Whinston, Green", category: "Economics", isbn: "978-0-19-507340-9", publisher: "Oxford University Press", edition: "1995", isReference: true, coverColor: cover(1) },
  { id: "bk-col-18", institutionId: "college", title: "Financial Accounting", authors: "S.N. Maheshwari", category: "Commerce", isbn: "978-93-5163-612-2", publisher: "Vikas Publishing", edition: "11th", isReference: false, coverColor: cover(2) },
  { id: "bk-col-19", institutionId: "college", title: "Cost Accounting: A Managerial Emphasis", authors: "Horngren, Datar, Rajan", category: "Commerce", isbn: "978-0-13-210917-8", publisher: "Pearson", edition: "16th", isReference: false, coverColor: cover(3) },
  { id: "bk-col-20", institutionId: "college", title: "Business Statistics", authors: "J.K. Sharma", category: "Commerce", isbn: "978-93-325-7382-5", publisher: "Pearson", edition: "4th", isReference: false, coverColor: cover(4) },
  { id: "bk-col-21", institutionId: "college", title: "A History of English Literature", authors: "Edward Albert", category: "English", isbn: "978-81-219-0188-9", publisher: "Oxford University Press", edition: "5th", isReference: true, coverColor: cover(5) },
  { id: "bk-col-22", institutionId: "college", title: "Pride and Prejudice", authors: "Jane Austen", category: "English", isbn: "978-0-14-143951-8", publisher: "Penguin Classics", edition: "2003", isReference: false, coverColor: cover(6) },
  { id: "bk-col-23", institutionId: "college", title: "Campbell Biology", authors: "Urry, Cain, Wasserman et al.", category: "Life Sciences", isbn: "978-0-13-460491-9", publisher: "Pearson", edition: "11th", isReference: false, coverColor: cover(7) },
  { id: "bk-col-24", institutionId: "college", title: "Plant Systematics", authors: "Michael G. Simpson", category: "Life Sciences", isbn: "978-0-12-374380-0", publisher: "Academic Press", edition: "3rd", isReference: false, coverColor: cover(8) },
];

export const allBookTitles: BookTitle[] = [...schoolBookTitles, ...collegeBookTitles];

export function getBookTitlesByInstitution(id: "school" | "college"): BookTitle[] {
  return id === "school" ? schoolBookTitles : collegeBookTitles;
}

export function getBookTitle(id: string): BookTitle | undefined {
  return allBookTitles.find((t) => t.id === id);
}
