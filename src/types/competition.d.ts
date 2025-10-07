export interface CompetitionOrganiser {
  name: string;
}

export interface CompetitionContact {
  contactName: string;
  email: string;
  phonenumber: string;
}

export interface CompetitionReward {
  title: string;
  rewardDesc?: string;
  position?: string;
  isCash?: boolean;
  amount?: number;
}

export interface CompetitionTimeline {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface CompetitionFormInput {
  Title: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isCompleted: boolean;
  type: string; // Online/Offline
  minMember: number;
  maxMember: number;
  feeType: string; // Paid/Free
  feePerMember: number;
  feePerTeam: number;
  isFeeForTeam: boolean;
}
interface ObjectResponseType<T> {
  id: number;
  attributes: T;
}
interface CompetitionDetail extends Competition {
    competition_category: any; //TODO: define category type
    competition_contact: any; //TODO: contact type
    competition_organiser: any; //TODO: organiser type
    competition_timelines: any; //TODO: timeline type
    competition_rewards: any; //TODO: reward type
    id: number
}