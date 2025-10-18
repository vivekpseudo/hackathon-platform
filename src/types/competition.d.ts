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
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isCompleted: boolean;
  type: string;
  minMember: number;
  maxMember: number;
  feeType: string;
  feePerMember: number;
  feePerTeam: number;
  isFeeForTeam: boolean;
  competition_category: number[]; // IDs
  competition_contact: {
    contactName: string;
    email: string;
    phonenumber: string;
  };
  competition_organiser: {
    name: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    entityType?: string;
  };
  competition_rewards: {
    title: string;
    description: string;
    amount: string;
    isCash: boolean;
    position?: string;
  }[];
  competition_timelines: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    type: string;
  }[];
  competition_result: string;
  helpDocs: string[];
}


export interface CompetitionCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionType {
  id: string;
  name: string; // e.g., "Online", "Offline"
  description?: string;
  createdAt: string;
  updatedAt: string;
}   
export interface Competition {
  id: number;
  Title: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
export interface CompetitionDetail {
   Title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isCompleted: boolean;
  type: string;
  minMember: number;
  maxMember: number;
  feeType: string;
  feePerMember: number;
  feePerTeam: number;
  isFeeForTeam: boolean;
  competition_category: number[]; // IDs
  competition_contact: {
    contactName: string;
    email: string;
    phonenumber: string;
  };
  competition_organiser: {
    name: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    entityType?: string;
  };
  competition_rewards: {
    title: string;
    description: string;
    amount: string;
    isCash: boolean;
    position?: string;
  }[];
  competition_timelines: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    type: string;
  }[];
  competition_result: string;
  helpDocs: string[];
}

export interface ObjectResponseType<T> {
   data: {
    id: number;
    attributes: T;
  };
  meta?: any;
}