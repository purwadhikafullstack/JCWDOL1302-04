export type GetRoomsPar = {
  id: string;
  pId: string;
};

export type AddRoomPar = {
  id: string;
  pId: string;
};

export type DeleteRoomPar = {
  id: string;
  pId: string;
  rId: string;
};

export type GetDetailRoomReq = {
  id: string;
  pId: string;
  rId: string;
};

export type AddRoomReq = {
  price: number;
  description: string;
  type: string;
  image: string;
};

export type UpdateRoomReq = {
  price?: number;
  description?: string;
  type?: string;
  image?: string;
};

export type UpdateRoomPar = {
  id: string;
  pId: string;
  rId: string;
};

export type AddRoomRes = {
  id: string;
  price: number;
  description: string;
  type: string;
  image: string;
};

export const toGetRoomsRes = (room: AddRoomRes[]) => {
  return room;
};

export const toGetDetailRoomRes = (room: AddRoomRes) => {
  return room;
};

export const toAddRoomRes = (room: AddRoomRes) => {
  return {
    ...room,
  };
};

export const toDeleteRoomRes = (id: string) => {
  return {
    id,
  };
};
