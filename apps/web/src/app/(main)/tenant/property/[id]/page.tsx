import React from 'react';
import UpdatePropertyForm from '../_components/UpdatePropertyForm';

const UpdatePage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="min-h-screen w-full mt-[78px] px-12 pt-5">
      <UpdatePropertyForm id={params.id} />
    </div>
  );
};

export default UpdatePage;
