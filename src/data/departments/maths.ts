import type { Department } from "../types";

export const maths: Department = {
  name: "Maths",
  description:
    "Maths Notes XD ",

  link: "/maths",
  years: [
    {
      year: 1,
      semesters: [
        {
          number: 0,
          subjects: [
            {
              name: "1st Year Drive Link",
              notes: [
                {
                  title: "Maths 1st Sem",
                  type: "theory",
                  link: "https://drive.google.com/drive/folders/1SgmLoucNQGbvr8z4ie9trbH1zJxnVhAu?usp=sharing",
                },
                {
                  title: "Maths 2nd Sem",
                  type: "theory",
                  link: "https://drive.google.com/drive/folders/1JXWefuRHosd_oiCZxI8a9-gHiKEtZSFq?usp=share_link",
                },
              ],
              subject_code: "MA1x/2x",
            },
            {
              name: "2nd Year Drive Link",
              notes: [
                {
                  title: "Maths 3rd Sem",
                  type: "theory",
                  link: "https://drive.google.com/drive/folders/1qhQxvAxpkEWxd1X-4KeEPun-evSNQUCx?usp=sharing",
                },
                {
                  title: "Maths 4th Sem",
                  type: "theory",
                  link: "https://drive.google.com/drive/folders/1AwgnytwRkygV8Wb7f1FC1PKNFCM0rEDa?usp=sharing",
                },
              ],
              subject_code: "MA3x/4x",
            },
            
            
          ],
        },
      ],
    },
  ],
};
