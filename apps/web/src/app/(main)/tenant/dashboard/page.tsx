'use client';

import React from 'react';
import SalesReportTable from "./_components/SalesReportTable";

const TenantDashboard = () => {
  return (
    <main className="min-h-svh pt-[78px]">
      <section className="mt-4 px-6 md:px-10 xl:px-20">
        <h2 className="font-semibold text-xl">Sales Report</h2>
        <SalesReportTable />
      </section>
    </main>
  );
};

export default TenantDashboard;
