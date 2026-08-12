import type { Department } from "../types";

export const allEngineering: Department = {
    name: "Global Engineering Subjects",
    description:
      "Common subjects for all engineering disciplines, including HSS and global subjects. Free CGPA and SGPA courses",
    link: "/all-engineering",
    years: [
      {
        year: 0,
        semesters: [
          {
            number: 0,
            subjects: [
              {
                name: "HSS, Global Subjects",
                subject_code: "ENG000",
                notes: [
                  {
                    title: "HSS, Global Subjects Notes",
                    type: "theory",
                    link: "https://drive.google.com/drive/folders/1qK6-tYMiC9EmrL8DMp8F5YghOO7vQXlR?usp=sharing",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
