'use client';

import React, { Suspense } from 'react';
import ReportPageContent from '@/app/report/page';

export default function UserReportPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Loading Report Form...</div>}>
      <ReportPageContent />
    </Suspense>
  );
}
