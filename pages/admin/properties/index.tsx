import { useState } from 'react';
import { months } from '../../../lib/utils/date';

import Layout from '../../../components/layout/NLayout';
import Properties from '@/components/adminPage/Properties';

const getTextMonth = (month: any) =>
  parseInt(month) < 9 ? `0${parseInt(month) + 1}` : `${parseInt(month) + 1}`;

export default function () {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear;

  const [selectedMonth, setSelectedMonth] = useState(getTextMonth(month));
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <Layout>
      <div className="m-4 w-full">
        <Properties />
      </div>
    </Layout>
  );
}
