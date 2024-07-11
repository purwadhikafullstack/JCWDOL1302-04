import React from 'react';
import UpdateRoomForm from '../_components/UpdateRoomForm';

const UpdateRoom = ({ params }: { params: { id: string; rId: string } }) => {
  return (
    <div className="mt-[78px] min-h-screen w-full px-12 pt-5">
      {/* {JSON.stringify(params)} */}
      <UpdateRoomForm pId={params.id} rId={params.rId} />
    </div>
  );
};

export default UpdateRoom;
