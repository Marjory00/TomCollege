// src/app/core/models/faculty.model.ts

export interface FacultyMember {
  id: number;
  name: string;
  title: string;
  department: string;
  email: string;
  office: string;
  researchInterests: string[];
}
