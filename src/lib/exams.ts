export const skills = [
  {
    id: "listening",
    name: "Listening",
    vi: "Lắng nghe. Nắm bắt.",
    icon: "headphones",
    time: 40,
    questions: 17,
    color: "#e9e7fa",
    description: "Luyện nghe từ hội thoại ngắn đến quan điểm của người nói.",
  },
  {
    id: "reading",
    name: "Reading",
    vi: "Đọc hiểu. Kết nối.",
    icon: "auto_stories",
    time: 35,
    questions: 5,
    color: "#f8ebda",
    description: "Tìm thông tin, sắp xếp ý và hiểu thông điệp của bài đọc.",
  },
  {
    id: "speaking",
    name: "Speaking",
    vi: "Cất lời. Tự tin.",
    icon: "mic",
    time: 12,
    questions: 4,
    color: "#e0eee9",
    description: "Làm quen nhịp thi, mô tả hình và trình bày quan điểm.",
  },
  {
    id: "writing",
    name: "Writing",
    vi: "Viết rõ. Đúng ý.",
    icon: "edit_note",
    time: 50,
    questions: 4,
    color: "#f7e4e8",
    description: "Từ câu trả lời ngắn đến email với đúng ngữ cảnh.",
  },
] as const;
export type SkillId = (typeof skills)[number]["id"];
export const getSkill = (id: string) => skills.find((s) => s.id === id);
export type AnswerMap = Record<string, string>;
export type Attempt = {
  id: string;
  skill: SkillId;
  title: string;
  date: string;
  answers: AnswerMap;
  recordings?: number;
  duration: number;
};
export function saveAttempt(attempt: Attempt) {
  const all = readAttempts();
  localStorage.setItem("aptis-attempts", JSON.stringify([attempt, ...all]));
}
export function readAttempts(): Attempt[] {
  try {
    return JSON.parse(localStorage.getItem("aptis-attempts") || "[]");
  } catch {
    return [];
  }
}
export const listeningPrompts = [
  "A doctor’s secretary calls about a change to an appointment. What is changing?",
  "A student is arranging to meet a friend. Where will they meet?",
  "A woman is asking about a train ticket. What time does the train leave?",
  "A man calls a shop about an order. What does he need?",
  "Two friends discuss their weekend. What will they do?",
  "Listen to a weather announcement. What will the weather be like?",
  "A teacher gives instructions. What should the students bring?",
  "A woman describes her journey. How did she travel?",
  "A man talks about his new home. What does he like most?",
  "Two people discuss a restaurant. What do they decide?",
  "A visitor asks for directions. Where is the library?",
  "A student talks about a course. Why did she choose it?",
  "A man leaves a message. What does he want his friend to do?",
];
export const listeningOptions = [
  ["The date", "The time", "The place"],
  ["At the library", "At the station", "At the café"],
  ["At nine o’clock", "At ten o’clock", "At eleven o’clock"],
  ["A different size", "A refund", "A delivery date"],
  ["Visit a museum", "Watch a film", "Go swimming"],
  ["Sunny", "Rainy", "Snowy"],
  ["A dictionary", "A notebook", "A photograph"],
  ["By train", "By bus", "By bicycle"],
  ["The large kitchen", "The quiet street", "The garden"],
  ["Book a table", "Cook at home", "Try another restaurant"],
  ["Opposite the bank", "Next to the park", "Behind the station"],
  ["The low price", "The convenient schedule", "A friend’s recommendation"],
  ["Return a book", "Call him back", "Collect a parcel"],
];
export const audioScripts = [
  "Hello, this is the doctor’s secretary. I am calling about your appointment on Tuesday. The doctor has a meeting in the morning, so could you come at three in the afternoon instead of ten? The date and the clinic remain the same. Thank you.",
  "Let’s meet at the library after class. The station is too busy and the café closes early. I will see you at the library at four.",
  "The morning train leaves at ten o’clock. Please arrive at the station fifteen minutes before departure.",
  "Hello, I ordered a jacket from your shop last week. It arrived yesterday, but it is too small. I do not want a refund. Could you send me the next size up?",
  "Shall we go swimming this weekend? I went yesterday. There is a new exhibition at the museum. That sounds interesting. Let us go there on Saturday.",
  "Tomorrow morning will be bright and sunny, but clouds will arrive in the afternoon. Expect heavy rain throughout the evening.",
  "For our next lesson, please bring a photograph of a place you have visited. You will not need your dictionary or notebook.",
  "I usually travel by train, but the station was closed. I took the bus instead. It was too far to cycle.",
  "My new home has a small kitchen and no garden. What I really love is the quiet street. There is almost no traffic.",
  "The restaurant is fully booked tonight. We could cook at home, but I would like to go out. Let us try the new restaurant near the park.",
  "The library used to be opposite the bank. It has moved. You will find it next to the park, a short walk from the station.",
  "The course was not the cheapest, and none of my friends had tried it. I chose it because the evening classes fit around my work.",
  "Hi, it is Tom. I have a question about our travel plans. You do not need to collect the parcel. Please call me back when you have a moment.",
];
export const speakers = [
  "enjoyed science experiments at school.",
  "finds science difficult to understand.",
  "wants to study science.",
  "likes reading science books.",
  "preferred non-science school subjects.",
  "now enjoys science.",
];
export const opinions = [
  "Parents should better manage their children’s diets.",
  "Parents should support their child’s interest in sport.",
  "Quiet time can promote children’s concentration abilities.",
  "Excessive sleep can be bad for young people.",
];
export const readingAuthors = [
  {
    name: "Petra",
    text: "As you get older, responsibilities like a job and family dominate your life. It can be hard to balance things. Studying at university is demanding. So you should do it at an age when you are independent and carefree. It is also important to learn how the world of business works. Spending unpaid time in a company is a great way to get that experience. Any course that can give you an opportunity to do that is worth considering.",
  },
  {
    name: "Antonio",
    text: "Life doesn’t really get serious until you hit your mid-twenties. Before that, try out different things and get some life experience. It’s only as you approach your thirties that you need to get serious about your career. That’s the time to start thinking about further education. Many colleges offer inexpensive courses for more mature students. Going back to student life for a year is a great idea, and you can then return to the world of work at management level.",
  },
  {
    name: "Eleanor",
    text: "Nowadays, it’s popular for school leavers to take a break before they think about an occupation or a place at university. I think the most important thing is to start working as soon as you can. You need practical experience for your CV, and that can be more valuable than a diploma. Nevertheless, your studies do not have to stop just because you are working. Colleges and universities offer options for people who want to do both.",
  },
  {
    name: "Jermaine",
    text: "I think we should all keep learning, but you don’t need a piece of paper from an institution to prove it. There are many free courses available online. Of course, not all are good, but a little research will help you identify which one is best for you. A lot of young people get into debt because they have to pay for their studies. With the resources available online these days, you can take control. You won’t regret it.",
  },
];
export const authorQuestions = [
  "study when you are older",
  "formal qualifications are too expensive",
  "go to university when you are young",
  "study independently",
  "combine a job with studying",
  "choose a course that is practical",
  "get a job immediately after leaving school",
];
export const headings = [
  "A journey without leaving Earth",
  "The return to everyday life",
  "Living together in a small space",
  "A scientific purpose",
  "Communication across the distance",
  "Keeping healthy on board",
  "Lessons for future missions",
  "An unexpected discovery",
];
export const paragraphs = [
  "On 3 June 2010, an international crew of six astronauts entered a spaceship and prepared themselves for a 520-day voyage to the planet Mars and back. The module that was to be their home for the next year and a half contained their sleeping quarters, a kitchen/dining room, a living room, a control room and a toilet. There was also space for food storage, a small greenhouse, a bathroom, a sauna and even a gym. The Mars landing was scheduled for 12 February 2011, following a 255-day flight, and would involve a full two days of exploration of the planet’s surface. An equally long return journey would see the astronauts return to Earth on 4 November 2011.",
  "Emerging from the spaceship after an exhausting 520 days, the crew welcomed fresh air and daylight. Adjusting to ordinary routines took time after so long in an artificial environment.",
  "The volunteers shared a small living space. They needed patience, clear responsibilities and regular conversations to resolve everyday problems.",
  "The experiment allowed researchers to study how isolation affects sleep, concentration and cooperation over a long period.",
  "Messages to family and mission control arrived with a delay, reflecting the distance between Earth and Mars. The crew learned to solve problems independently.",
  "Each day included exercise and carefully planned meals. Maintaining physical health was as important as completing scientific tasks.",
  "The experience helped scientists prepare for future travel. Understanding the human challenges of a mission is essential before sending a real crew to Mars.",
];
export const writingShort = [
  "What do you usually do in the morning?",
  "What is your favourite place?",
  "What is your favourite animal?",
  "What is the weather like today?",
  "What is your favourite time of year?",
];
export const writingChat = [
  "Sam: Hi! Welcome to the club. Can you remember the first time you went on a journey by yourself? What was it like?",
  "Olga: Hi! What do you enjoy most about travelling to a new place?",
  "Michelle: What is the most exciting journey you’ve been on?",
];
export const speakingQuestions = [
  [
    "Please tell me about your family.",
    "What do you like doing in your free time?",
    "Tell me about the place where you live.",
  ],
  [
    "Describe this picture.",
    "Tell me about a time when you visited a museum.",
    "Do you think people should pay to visit museums, or should they be free?",
  ],
  [
    "Tell me what you see in the two pictures.",
    "What kind of people play these two sports?",
    "Why do some people prefer team sports?",
  ],
];
