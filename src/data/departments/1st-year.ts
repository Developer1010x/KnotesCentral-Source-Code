import type { Department } from "../types";

export const y1stYear: Department = {
    name: "Year 1",
    description:
      "Ground Zero of RVCE Lol ",

    link: "/1st_Year",
    years: [
      {
        year: 1,
        semesters: [
          {
            number: 10,
            subjects: [
              {
                name: "1st Sem Drive Link",
                notes: [
                  {
                    title: "P cycle",
                    type: "theory",
                    link: "https://drive.google.com/drive/folders/1EHqT2hTuaADcG-q5SKuMCY75scJP4AOH",
                  },
                  {
                    title: "RVCE Physics Dept Website",
                    type: "lab",
                    link: "https://physicsrvce.wordpress.com",
                  },
                ],
                subject_code: "Y01SM01",
              },
              {
                name: "2nd Sem Drive Link",
                notes: [
                  {
                    title: "C Cycle",
                    type: "theory",
                    link: "https://drive.google.com/drive/folders/1o4U3vd4hhzS0jjjuOvciEJkn1shjb9ab",
                  },
                ],
                subject_code: "Y01SM02",
              },
            ],
          },
        ],
      },
    ],
  };
