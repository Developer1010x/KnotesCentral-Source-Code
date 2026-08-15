import type { Department } from "../../../src/data/types";

export const demo: Department = {
  name: "Demo Department",
  description: "Fixture data — a valid department.",
  link: "/demo",
  years: [
    {
      year: 2,
      semesters: [
        {
          number: 3,
          subjects: [
            {
              name: "Database Management Systems",
              subject_code: "CS301",
              notes: [
                {
                  title: "DBMS unit 1-5 notes",
                  type: "theory",
                  link: "https://drive.google.com/drive/folders/fixture",
                },
                {
                  title: "DBMS lab manual",
                  type: "lab",
                  link: "https://github.com/example/dbms-lab",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
