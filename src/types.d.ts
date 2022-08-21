enum UserStatus {
  Active = 'active',
  Ban = 'ban',
  Restrict = 'restrict',
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
  twitter?: string;
  is_mentoring: boolean;
  topics: number[];
  approved?: boolean;
  top_mentor: boolean;
}

export interface UserType {
  _id: string;
  graduation_year?: string;
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
  approved?: boolean;
  top_mentor?: boolean;
  experiences?: ExperienceType[];
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

interface BookingUser {
  _id: string;
  first_name: string;
  last_name: string;
}

interface Session {
  email?: string;
  topic?: string;
  description?: string;
  status?: 'rated' | 'unrated';
  rating?: number;
}
export interface MeetingType {
  _id: string;
  mentor: BookingUser;
  mentee: BookingUser;
  mentor_email: string;
  mentee_email: string;
  start_date: Date;
  end_date: Date;
  google_meeting_link: string;
  event_id: string;
  status: 'accepted' | 'cancelled' | 'waiting';
  session: Session;
}

interface StatsType {
  likes: number;
  reports: number;
  meetings: number;
}
