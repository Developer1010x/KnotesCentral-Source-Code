import { Department, Contributors } from "./dataTypes";

export const departments: Department[] = [
  {
    name: "Computer Science",
    description:
      "Access comprehensive study materials for Computer Science and Engineering, including programming, algorithms, database systems, and more.",
    link: "/cse",
    years: [
      {
        year: 1,
        semesters: [
          {
            number: 1,
            subjects: [
              {
                name: "Introduction to Programming",
                subject_code: "CSE101",
                notes: [
                  {
                    title: "Basic Syntax Notes",
                    type: "theory",
                    link: "https://drive.google.com/...",
                  },
                  {
                    title: "2023 Question Paper",
                    type: "question-paper",
                    link: "https://drive.google.com/...",
                  },
                  {
                    title: "Programming Lab Manual",
                    type: "lab",
                    link: "https://drive.google.com/...",
                  },
                ],
              },
              {
                name: "Digital Logic Design",
                subject_code: "CSE102",
                notes: [
                  {
                    title: "Boolean Algebra Notes",
                    type: "theory",
                    link: "https://drive.google.com/...",
                  },
                  {
                    title: "Circuit Design Lab Guide",
                    type: "lab",
                    link: "https://drive.google.com/...",
                  },
                ],
              },
            ],
          },
          {
            number: 2,
            subjects: [
              {
                name: "Data Structures",
                subject_code: "CSE103",
                notes: [
                  {
                    title: "Arrays and Linked Lists",
                    type: "theory",
                    link: "https://drive.google.com/...",
                  },
                  {
                    title: "DSA Lab Exercises",
                    type: "lab",
                    link: "https://drive.google.com/...",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Electrical Engineering",
    description:
      "Find resources for Electrical Engineering courses, covering circuit theory, power systems, control systems, and electrical machines.",
    link: "/eee",
    years: [
      {
        year: 1,
        semesters: [
          {
            number: 1,
            subjects: [
              {
                name: "Circuit Theory",
                subject_code: "EEE101",
                notes: [
                  {
                    title: "Basic Circuit Analysis",
                    type: "theory",
                    link: "https://drive.google.com/...",
                  },
                  {
                    title: "Circuit Lab Manual",
                    type: "lab",
                    link: "https://drive.google.com/...",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Mechanical Engineering",
    description:
      "Explore study materials for Mechanical Engineering, including thermodynamics, mechanics, manufacturing processes, and CAD/CAM.",
    link: "/mech",
    years: [
      {
        year: 1,
        semesters: [
          {
            number: 1,
            subjects: [
              {
                name: "Engineering Mechanics",
                subject_code: "MECH101",
                notes: [
                  {
                    title: "Statics and Dynamics",
                    type: "theory",
                    link: "https://drive.google.com/...",
                  },
                  {
                    title: "2023 Mid-term Paper",
                    type: "question-paper",
                    link: "https://drive.google.com/...",
                  },
                ],
              },
              {
                name: "Engineering Drawing",
                subject_code: "MECH102",
                notes: [
                  {
                    title: "AutoCAD Basics",
                    type: "lab",
                    link: "https://drive.google.com/...",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Electronics & Communication",
    description:
      "Access resources for Electronics and Communication Engineering, covering digital electronics, communication systems, and signal processing.",
    link: "/ece",
    years: [
      {
        year: 1,
        semesters: [
          {
            number: 1,
            subjects: [
              {
                name: "Digital Electronics",
                subject_code: "ECE101",
                notes: [
                  {
                    title: "Boolean Algebra and Logic Gates",
                    type: "theory",
                    link: "https://drive.google.com/...",
                  },
                  {
                    title: "Digital Lab Manual",
                    type: "lab",
                    link: "https://drive.google.com/...",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const contributors: Contributors[] = [
  {
    name: "John Doe",
    link: "https://github.com/johndoe",
    notes_contributed: 10,
    department: "Computer Science",
    year: 1,
    description:
      "John Doe is a student of Computer Science and Engineering at RV College of Engineering. He is a dedicated contributor to the notes database and has uploaded a variety of study materials for various subjects.",
  },
  {
    name: "Jane Doe",
    link: "https://github.com/janedoe",
    notes_contributed: 5,
    department: "Electrical Engineering",
    year: 2,
    description:
      "Jane Doe is a student of Electrical Engineering at RV College of Engineering. She has contributed a significant number of notes for various subjects, including circuit theory and power systems.",
  },
  {
    name: "John Doe",
    link: "https://github.com/johndoe",
    notes_contributed: 10,
    department: "Computer Science",
    year: 1,
    description:
      "John Doe is a student of Computer Science and Engineering at RV College of Engineering. He is a dedicated contributor to the notes database and has uploaded a variety of study materials for various subjects.",
  },
];
