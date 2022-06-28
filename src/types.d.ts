enum UserStatus {
  Active = "active",
  Ban = "ban",
  Restrict = "restrict",
}

export interface ExperienceType {
  company: string;
  role: string;
  start_year: string;
  end_year: string;
}

export interface MentorSchemaType {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar: {
    url: string;
    filename: string;
  };
  experiences: ExperienceType[];
  bio: string;
  expertise: string[];
  languages: string[];
  linkedIn: string;
  is_mentoring: boolean;
  topics: number[];
  approved?: boolean;
  top_mentor: boolean;
}

export interface UserType {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: UserStatus;
  is_mentor: boolean;
  avatar?: {
    url: string;
    filename: string;
  };
  bio?: string;
  mentor_information?: string;
  verified?: boolean;
  signup_completed?: boolean;
}

export interface AdminType {
  name: string;
  email: string;
}

export interface BannerType {
  content: string;
  show: boolean;
  height: number;
}
