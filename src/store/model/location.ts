export type Link = {
  cartUrl?: string;
  url: string;
};

export type Location = {
  zip?: string;
  url?: string;
  type?: string;
  street?: string;
  storeNumber?: number;
  state?: string;
  openTimeslots: number;
  openAppointmentSlots: number;
  name: string;
  longitude?: number;
  latitude?: number;
  city?: string;
};
