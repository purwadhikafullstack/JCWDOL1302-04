import React from 'react';
import { Loader2, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import CardComment from '@/components/Card-Comment';
import { TGetReviewsByPropertyId } from '@/redux/slices/client/review-slice';

interface DetailReviewsProps {
  propertyReviews: TGetReviewsByPropertyId[];
  isLoadingComment: boolean;
  rating: number | '';
}

const DetailReviews = ({
  propertyReviews,
  isLoadingComment,
  rating,
}: DetailReviewsProps) => (
  <div className="px-6 md:px-10 xl:px-20">
    <div className="flex justify-between">
      <p className="text-athens-gray-950 text-2xl font-bold tracking-tight">
        Reviews
      </p>
      {rating && (
        <div className="flex items-end gap-1">
          <div className="flex items-center gap-1 text-2xl font-bold">
            <Star className="text-yellow-400" size={24} />
            <span className="text-athens-gray-950 leading-6">{rating}</span>
          </div>
          <span className="text-sm text-gray-600">/ 5.0</span>
        </div>
      )}
    </div>
    <div className="mt-5 flex flex-col gap-4 px-3">
      {isLoadingComment ? (
        <div className="min-h-10 w-full">
          <Loader2 size={50} className="animate-spin" />
        </div>
      ) : (
        <>
          {propertyReviews.length > 0 ? (
            <>
              {propertyReviews.map((pr, i) => (
                <>
                  {i > 0 && <Separator />}
                  <CardComment data={pr} />
                </>
              ))}
            </>
          ) : (
            <div className="flex min-h-32 w-full items-center justify-center">
              <span className="text-athens-gray-950 text-xl font-semibold">
                There are no reviews yet
              </span>
            </div>
          )}
        </>
      )}
    </div>
  </div>
);

export default DetailReviews;
