'use client';

import PropertyCard from '@/components/Property-Card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { formatNumberEn } from '@/lib/formatNumber';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getPropertiesClientThunk } from '@/redux/slices/client/property-thunk';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FilterDialog from './_components/FilterDialog';

const Property = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [sortPrice, setSortPrice] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const name = searchParams.get('name');
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');
  const sortPriceP = searchParams.get('sortPrice');
  const nameParam = name ? `&name=${name}` : '';
  const fromDateParam = fromDate ? `&fromDate=${fromDate}` : '';
  const toDateParam = toDate ? `&toDate=${toDate}` : '';
  const sortPriceParam = sortPriceP ? `&sortPrice=${sortPriceP}` : '';
  const dispatch = useAppDispatch();
  const { properties, totalPage, totalResult, isLoading } = useAppSelector(
    (state) => state.propertiesClientSlice,
  );

  const handleNextPagination = () => {
    const pageParam = page ? Number(page) + 1 : 1;
    if (name || fromDate || sortPrice) {
      router.push(
        `/property?page=${pageParam}${sortPriceParam}${nameParam}${fromDateParam}${toDateParam}`,
      );
      return;
    }

    router.push(`/property?page=${pageParam}`);
  };

  const handlePrevPagination = () => {
    const pageParam = Number(page!) > 1 ? `page=${Number(page) - 1}` : '';
    if ((name || fromDate || sortPrice) && pageParam) {
      router.push(
        `/property?${pageParam}${sortPriceParam}${nameParam}${fromDateParam}${toDateParam}`,
      );
      return;
    }

    if ((name || fromDate || sortPrice) && !pageParam) {
      router.push(
        `/property?${sortPriceParam}${nameParam}${fromDateParam}${toDateParam}`.replace(
          '/property?&',
          '/property?',
        ),
      );
      return;
    }

    router.push(`/property?${pageParam}`);
  };

  useEffect(() => {
    if (sortPriceP) setSortPrice(sortPriceP);
    dispatch(
      getPropertiesClientThunk({
        name,
        fromDate,
        toDate,
        sortPrice: sortPriceP,
        page,
      }),
    );
  }, [dispatch, searchParams]);

  return (
    <main className="min-h-svh pt-[78px]">
      {isLoading ? (
        <div className="flex min-h-[calc(100svh-79px)] w-full items-center justify-center">
          <Loader2 size={50} className="animate-spin" />
        </div>
      ) : (
        <>
          {properties.length > 0 ? (
            <>
              <div className="mb-12 px-6 md:px-10 xl:px-20">
                <div className="my-6 flex justify-between">
                  <h1 className="text-sm font-semibold">
                    Found {formatNumberEn(totalResult!)} places
                  </h1>
                  <div className="max-w-[250px]">
                    <FilterDialog
                      openDialog={openDialog}
                      setOpenDialog={setOpenDialog}
                      sortPrice={sortPrice}
                      setSortPrice={setSortPrice}
                      nameParam={nameParam}
                      fromDateParam={fromDateParam}
                      toDateParam={toDateParam}
                    />
                  </div>
                </div>
                <div className="grid gap-x-6 gap-y-10 md:grid-cols-4">
                  {properties.map((d) => (
                    <Link key={d.id} href={`/property/${d.id}`}>
                      <PropertyCard data={d} />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        aria-disabled={page ? false : true}
                        className={
                          page
                            ? 'cursor-pointer'
                            : 'pointer-events-none opacity-50'
                        }
                        onClick={handlePrevPagination}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink isActive>
                        {page ? Number(page) + 1 : 1}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        aria-disabled={
                          Number(page) + 1 === totalPage ? true : false
                        }
                        className={
                          !(Number(page) + 1 === totalPage)
                            ? 'cursor-pointer'
                            : 'pointer-events-none opacity-50'
                        }
                        onClick={handleNextPagination}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="flex min-h-[calc(100svh-79px)] w-full items-center justify-center">
              <h2 className="text-xl font-semibold">
                Opps. Property not found.
              </h2>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Property;
