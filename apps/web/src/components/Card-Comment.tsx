import React from 'react'
import locale from 'date-fns/locale/id'
import { Avatar, AvatarImage } from "./ui/avatar"
import { Star } from "lucide-react"
import { TGetReviewsByPropertyId } from "@/redux/slices/client/review-slice"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const CardComment = ({
  data
}:{
  data: TGetReviewsByPropertyId
}) => {
  let avatar;

  if (data.image) {
    avatar = data.image.startsWith('IMG')
      ? `http://localhost:8000/user-images/${data.image}`
      : data.image
  } else {
    avatar = 'https://github.com/shadcn.png';
  }


  return (
    <div className="mb-3 flex flex-col gap-5">
      <div className="flex md:justify-between max-md:flex-col max-md:gap-4">
        <div className="flex gap-2 items-center">
          <Avatar className="aspect-square md:h-12 h-11 w-fit">
            <AvatarImage src={avatar}/>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span>{data.name}</span>
            <span className="text-sm text-gray-600">
              {format(data.createAt, "dd MMM yyyy", { locale: locale.id })}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <Star
            className={cn(data.point >= 1 ? 'text-yellow-400' : 'text-gray-500')}
            size={20}
          />
          <Star
            className={cn(data.point >= 2 ? 'text-yellow-400' : 'text-gray-500')}
            size={20}
          />
          <Star
            className={cn(data.point >= 3 ? 'text-yellow-400' : 'text-gray-500')}
            size={20}
          />
          <Star
            className={cn(data.point >= 4 ? 'text-yellow-400' : 'text-gray-500')}
            size={20}
          />
          <Star
            className={cn(data.point >= 5 ? 'text-yellow-400' : 'text-gray-500')}
            size={20}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-600">
          Type:
          {data.orderRooms.map((odr, i) => {
            return i > 0 ? `, ${odr.type}` : ` ${odr.type}`
          })}
        </span>
        <span>{data.comment}</span>
      </div>
    </div>
  )
}

export default CardComment