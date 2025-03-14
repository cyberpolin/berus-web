import React from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { ChartData, ChartOptions } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)
type PieChartProps = {
  data: ChartData<'pie'>
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  }
  return <Pie data={data} className="mb-5" />
}

export default PieChart
