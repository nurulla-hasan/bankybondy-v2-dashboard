import type { PaginationMeta } from "./api.types";

export type IncidentType =
  | "Unprofessional Behavior"
  | "Failure to collaborate"
  | "Spam"
  | "Other";

/** Populated either side of a report (profile with its linked user account). */
export interface ReportUserRef {
  _id?: string;
  name?: string;
  email?: string;
  profile_image?: string;
  user?: string | { _id?: string };
}

export interface UserReport {
  _id: string;
  reportFrom?: ReportUserRef | null;
  reportTo?: ReportUserRef | null;
  incidentType: IncidentType;
  additionalNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReportsQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  incidentType?: IncidentType;
  sort?: string;
}

export interface ReportsPage {
  meta: PaginationMeta;
  result: UserReport[];
}
