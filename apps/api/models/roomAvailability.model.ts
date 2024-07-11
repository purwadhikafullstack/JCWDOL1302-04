export type AddRoomAvailabilityReq = {
  fromDate: Date;
  toDate: Date;
  roomId: string;
}

export type GetRoomAvailabilityRes = {
  name: string;
  type: string;
  roomAvailaId: string;
  fromDate: Date;
  toDate: Date;
}

export type UpdateRoomAvailabilityReq = {
  fromDate: Date;
  toDate: Date;
}
