interface HtmlContent   {
    type: "heading" | "paragraph" | "link" | "text";
    level?: number;
    url?: string;
    bold?: boolean;
    children: HtmlContent[];
    text?: string;
} 

interface Competition {
  Title: string;
  startDate: string;
  endDate: string;
  isActive: true;
  isCompleted: false;
  createdAt: string;
  updatedAt:string;
  publishedAt: string;
  type: "Online" | "Offline";
  minMember: number;
  maxMember: number;
  feeType: "Paid" | "Free";
  feePerMember: number;
  feePerTeam: number;
  isFeeForTeam: boolean;
  description: Array<HtmlContent>;
}

// define detailed competition interface extending basic competition
interface CompetitionDetail extends Competition {
    competition_category: any; //TODO: define category type
    competition_contact: any; //TODO: contact type
    competition_organiser: any; //TODO: organiser type
    competition_timelines: any; //TODO: timeline type
    competition_rewards: any; //TODO: reward type
    id: number
}

interface ObjectResponseType<T> {
  id: number;
  attributes: T;
}

export interface CompetitionFormInput {
  Title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: string;
  feeType: string;
  feePerMember: number;
  feePerTeam: number;
  isFeeForTeam: boolean;
  isActive: boolean;
  isCompleted: boolean;
  minMember: number;
  maxMember: number;
  competition_organiser: {
    name: string;
  };
  competition_contact: {
    contactName: string;
    email: string;
    phonenumber: string;
  };
  competition_rewards: {
    title: string;
  }[];
  competition_timelines: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  }[];
  competition_category: any[];
  images: any[];
  helpDocs: any[];
}


