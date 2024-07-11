import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatCurrencyRp } from "@/lib/formatNumber"
import { TPropertiesClient } from "@/redux/slices/client/property-slice"
import { Star } from "lucide-react"
import Image from "next/image"

const PropertyCard = (props: {data: TPropertiesClient}) => {
  const { data } = props;
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0 mb-3">
        <div className="relative aspect-[3/2.5] rounded-md overflow-hidden">
          <Image
            alt="Property Example"
            src={`http://localhost:8000/properties/${data.image}`}
            fill
            sizes="(min-width: 768px) 25vw, 100vw"
            priority={true}
            style={{
              objectFit: "cover"
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 text-sm">
        <div className="flex gap-2">
          <span className="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis font-semibold">{data.name}</span>
          <div className="flex gap-1 items-center">
            {data.rating ? (
              <>
                <Star className="text-yellow-500" size={14} />
                <span className="flex-1">{data.rating}</span>
              </>
            ):(
              <span>News</span>
            )}
          </div>
        </div>
        <div className="flex">
          <span className="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis text-gray-500">{data.description}</span>
        </div>
        <div>
          <span className="text-gray-500">{data.location}</span>
        </div>
        <div className="mt-1 flex gap-1">
          {/* <span className="line-through text-slate-500 font-semibold">{formatCurrencyRp(729000)}</span> */}
          <span className="font-semibold">{formatCurrencyRp(data.minPrice)}</span>
          <span>/ day</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default PropertyCard
